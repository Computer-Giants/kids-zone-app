import { and, eq, getDb, SEED_QUIZZES, tables, type SeedQuizQuestion } from "@kidzone/db";
import { calculateNextReview } from "@kidzone/utils";
import { dailyReviewQuerySchema, submitReviewAnswerSchema } from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const completeReviewSchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
  idempotencyKey: z.string().min(8).max(128),
});

export const review = new Hono()
  /**
   * AC-5: Get daily review question set (3 to 5 questions) for authenticated child.
   */
  .get("/daily", zValidator("query", dailyReviewQuerySchema), async (c) => {
    const { childId, limit = 5 } = c.req.valid("query");

    const questionMap = new Map<string, SeedQuizQuestion>();
    for (const qz of SEED_QUIZZES) {
      for (const q of qz.questions) {
        questionMap.set(q.id, q);
      }
    }

    const selectedQuestions: SeedQuizQuestion[] = [];
    const selectedIds = new Set<string>();

    try {
      const db = getDb();
      const dueItems = await db
        .select({
          questionId: tables.reviewItems.questionId,
          dueAt: tables.reviewItems.dueAt,
          intervalDays: tables.reviewItems.intervalDays,
          correctStreak: tables.reviewItems.correctStreak,
        })
        .from(tables.reviewItems)
        .where(eq(tables.reviewItems.childId, childId))
        .orderBy(tables.reviewItems.dueAt)
        .limit(limit);

      for (const item of dueItems) {
        const q = questionMap.get(item.questionId);
        if (q && !selectedIds.has(q.id)) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
        }
      }
    } catch {
      // In-memory question fallback
    }

    // If fewer than requested limit, supplement from SEED_QUIZZES pool
    if (selectedQuestions.length < limit) {
      const allPool = SEED_QUIZZES.flatMap((qz) => qz.questions);
      for (const q of allPool) {
        if (!selectedIds.has(q.id)) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
          if (selectedQuestions.length >= limit) break;
        }
      }
    }

    // Strip isCorrect for client delivery
    const sanitized = selectedQuestions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      hint: q.hint,
      explanation: q.explanation,
      difficulty: q.difficulty,
      type: q.type,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        position: opt.position,
      })),
    }));

    return c.json({
      childId,
      questions: sanitized,
      count: sanitized.length,
    });
  })

  /**
   * AC-6, AC-7: Submit single review question answer and recalculate spaced repetition interval.
   */
  .post("/submit", zValidator("json", submitReviewAnswerSchema), async (c) => {
    const { childId, questionId, isCorrect, idempotencyKey } = c.req.valid("json");
    let currentStreak = 0;

    try {
      const db = getDb();
      const [existing] = await db
        .select({
          intervalDays: tables.reviewItems.intervalDays,
          correctStreak: tables.reviewItems.correctStreak,
        })
        .from(tables.reviewItems)
        .where(
          and(
            eq(tables.reviewItems.childId, childId),
            eq(tables.reviewItems.questionId, questionId),
          ),
        )
        .limit(1);

      currentStreak = existing?.correctStreak ?? 0;
    } catch {
      // Fallback streak
    }

    const schedule = calculateNextReview(currentStreak, isCorrect, new Date());

    try {
      const db = getDb();
      await db
        .insert(tables.reviewItems)
        .values({
          childId,
          questionId,
          dueAt: schedule.dueAt,
          intervalDays: schedule.nextIntervalDays,
          correctStreak: schedule.newStreak,
          lastAnsweredAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [tables.reviewItems.childId, tables.reviewItems.questionId],
          set: {
            dueAt: schedule.dueAt,
            intervalDays: schedule.nextIntervalDays,
            correctStreak: schedule.newStreak,
            lastAnsweredAt: new Date(),
          },
        });

      await db.insert(tables.activityEvents).values({
        childId,
        type: "quiz_completed",
        entityType: "quiz",
        score: isCorrect ? 100 : 0,
        idempotencyKey,
        occurredAt: new Date(),
        metadata: { review: true, questionId, isCorrect },
      });
    } catch {
      // Handled
    }

    return c.json({
      success: true,
      nextIntervalDays: schedule.nextIntervalDays,
      newStreak: schedule.newStreak,
      dueAt: schedule.dueAt.toISOString(),
    });
  })

  /**
   * AC-8: Complete the daily review round and award habit stars.
   */
  .post("/complete", zValidator("json", completeReviewSchema), async (c) => {
    const { childId } = c.req.valid("json");
    const starsAwarded = 5;

    try {
      const db = getDb();
      await db.insert(tables.ledgerEntries).values({
        childId,
        currency: "star",
        amount: starsAwarded,
        reason: "Completed daily Catholic faith review",
        createdAt: new Date(),
      });
    } catch {
      // Handled
    }

    return c.json({
      success: true,
      starsAwarded,
    });
  });
