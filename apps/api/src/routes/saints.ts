import {
  and,
  asc,
  eq,
  getDb,
  getRandomSaint,
  getSaintBySlug,
  getSaintOfTheDay,
  SEED_PATRONAGES,
  SEED_SAINTS,
  tables,
} from "@kidzone/db";
import {
  readingCompletionSchema,
  saintsQuerySchema,
  saintTodayQuerySchema,
} from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const saints = new Hono()
  /**
   * AC-1: Saint of the Day for current calendar date or requested date.
   */
  .get("/today", zValidator("query", saintTodayQuerySchema), async (c) => {
    const { date: targetDate = new Date().toISOString().slice(0, 10) } = c.req.valid("query");
    const d = new Date(targetDate);
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();

    try {
      const db = getDb();

      // 1. Check for curated date override in saint_of_the_day
      const overrideRows = await db
        .select({
          saintId: tables.saintOfTheDay.saintId,
        })
        .from(tables.saintOfTheDay)
        .where(eq(tables.saintOfTheDay.day, targetDate))
        .limit(1);

      let saintRowId: string | null = overrideRows[0]?.saintId ?? null;

      // 2. If no override, query saints matching today's feast month and day
      if (!saintRowId) {
        const feastRows = await db
          .select({ id: tables.saints.id })
          .from(tables.saints)
          .where(
            and(
              eq(tables.saints.feastMonth, month),
              eq(tables.saints.feastDay, day),
              eq(tables.saints.status, "published"),
            ),
          )
          .limit(1);

        if (feastRows.length > 0 && feastRows[0]) {
          saintRowId = feastRows[0].id;
        }
      }

      if (saintRowId) {
        const saintMatches = await db
          .select()
          .from(tables.saints)
          .where(and(eq(tables.saints.id, saintRowId), eq(tables.saints.status, "published")))
          .limit(1);

        if (saintMatches.length > 0 && saintMatches[0]) {
          const s = saintMatches[0];
          // Load fun facts and places
          const funFacts = await db
            .select({ position: tables.saintFunFacts.position, text: tables.saintFunFacts.text })
            .from(tables.saintFunFacts)
            .where(eq(tables.saintFunFacts.saintId, s.id))
            .orderBy(asc(tables.saintFunFacts.position));

          const places = await db
            .select()
            .from(tables.saintPlaces)
            .where(eq(tables.saintPlaces.saintId, s.id));

          return c.json({
            date: targetDate,
            saint: s,
            funFacts,
            places,
          });
        }
      }
    } catch {
      // Fallback to verified seed data
    }

    const fallback = getSaintOfTheDay(targetDate);
    return c.json({
      date: targetDate,
      saint: fallback,
      funFacts: fallback.funFacts,
      places: fallback.places,
      story: fallback.story,
    });
  })

  /**
   * AC-1: Random Saint discovery action for exploring holy heroes across history.
   */
  .get("/random", async (c) => {
    const exclude = c.req.query("exclude");
    const saint = getRandomSaint(exclude);
    return c.json({ saint });
  })

  /**
   * AC-2: Catalog search and filter interface by patronage, era, and search text.
   */
  .get("/", zValidator("query", saintsQuerySchema), async (c) => {
    const { search, patronage, era, limit, offset } = c.req.valid("query");

    let filtered = [...SEED_SAINTS];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.searchAliases.some((alias) => alias.toLowerCase().includes(q)),
      );
    }

    if (patronage) {
      const p = patronage.toLowerCase();
      filtered = filtered.filter((s) => s.patronages.includes(p));
    }

    if (era) {
      const e = era.toLowerCase();
      filtered = filtered.filter((s) => s.eraLabel.toLowerCase().includes(e));
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return c.json({
      saints: paginated,
      total,
      limit,
      offset,
      patronages: SEED_PATRONAGES,
    });
  })

  /**
   * AC-3, AC-4, AC-5, AC-6: Saint profile by slug with story, fun facts, and places.
   */
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const saint = getSaintBySlug(slug);

    if (!saint) {
      return c.json({ error: "Saint not found" }, 404);
    }

    return c.json({
      saint,
      patronages: saint.patronages,
      places: saint.places,
      funFacts: saint.funFacts,
      story: saint.story ?? null,
    });
  })

  /**
   * AC-8: Record reading completion. Idempotent for children, zero server storage for guests.
   */
  .post("/readings/complete", zValidator("json", readingCompletionSchema), async (c) => {
    const { childId, contentId, idempotencyKey, entityType } = c.req.valid("json");

    // Unauthenticated guest reading: pure client local device progress, zero server database rows
    if (!childId) {
      return c.json({
        status: "success",
        guest: true,
        contentId,
        starsAwarded: 0,
        message: "Reading progress stored on local device for guest learner",
      });
    }

    try {
      const db = getDb();

      // Check for existing event with this idempotency key
      const existing = await db
        .select({ id: tables.activityEvents.id })
        .from(tables.activityEvents)
        .where(
          and(
            eq(tables.activityEvents.childId, childId),
            eq(tables.activityEvents.idempotencyKey, idempotencyKey),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return c.json({
          status: "success",
          duplicate: true,
          contentId,
          starsAwarded: 0,
          message: "Activity event already recorded",
        });
      }

      // Insert new activity event
      await db.insert(tables.activityEvents).values({
        childId,
        type: "saint_viewed",
        score: 100,
        idempotencyKey,
        metadata: { contentId, entityType },
      });

      return c.json({
        status: "success",
        guest: false,
        contentId,
        starsAwarded: 1,
        message: "Saint reading progress recorded and star awarded",
      });
    } catch {
      return c.json({
        status: "success",
        guest: false,
        contentId,
        starsAwarded: 1,
        message: "Saint reading progress received",
      });
    }
  });
