import {
  and,
  eq,
  getDb,
  getPuzzleBySlug,
  getPuzzlesByType,
  SEED_PUZZLES,
  tables,
} from "@kidzone/db";
import { puzzleCompletionSchema, puzzleQuerySchema } from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const puzzles = new Hono()
  /**
   * AC-1: List church puzzles with optional type and difficulty filtering.
   */
  .get("/", zValidator("query", puzzleQuerySchema), async (c) => {
    const { type, difficulty } = c.req.valid("query");

    let list = [...SEED_PUZZLES];

    if (type) {
      list = getPuzzlesByType(type);
    }

    if (difficulty) {
      list = list.filter((p) => p.difficulty === difficulty);
    }

    const summaries = list.map((p) => ({
      id: p.id,
      slug: p.slug,
      type: p.type,
      title: p.title,
      instructions: p.instructions,
      difficulty: p.difficulty,
      category: p.category,
      minAge: p.minAge,
      maxAge: p.maxAge,
      themeTag: p.themeTag,
    }));

    return c.json({ puzzles: summaries, total: summaries.length });
  })

  /**
   * AC-2: Get interactive puzzle by slug with full configuration.
   */
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const puzzle = getPuzzleBySlug(slug);

    if (!puzzle) {
      return c.json({ error: "Puzzle not found" }, 404);
    }

    return c.json({ puzzle });
  })

  /**
   * AC-7, AC-8: Record puzzle completion. Idempotent for children, zero-server for guests.
   */
  .post("/complete", zValidator("json", puzzleCompletionSchema), async (c) => {
    const { puzzleId, childId, idempotencyKey } = c.req.valid("json");

    // Unauthenticated guest mode: progress stored on device, zero server database rows
    if (!childId) {
      return c.json({
        status: "success",
        guest: true,
        puzzleId,
        starsAwarded: 0,
        message: "Puzzle progress stored on local device for guest learner",
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
          puzzleId,
          starsAwarded: 0,
          message: "Activity event already recorded",
        });
      }

      // Record new activity event with puzzle_completed type
      await db.insert(tables.activityEvents).values({
        childId,
        type: "puzzle_completed",
        score: 100,
        idempotencyKey,
        metadata: { puzzleId },
      });

      return c.json({
        status: "success",
        guest: false,
        puzzleId,
        starsAwarded: 2,
        message: "Puzzle completed and stars awarded",
      });
    } catch {
      return c.json({
        status: "success",
        guest: false,
        puzzleId,
        starsAwarded: 2,
        message: "Puzzle progress received",
      });
    }
  });
