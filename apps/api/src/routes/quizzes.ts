import {
  and,
  eq,
  getDb,
  getQuizBySlug,
  getQuizzesByAgeBand,
  getQuizzesByCategory,
  SEED_QUIZZES,
  tables,
} from "@kidzone/db";
import { quizAnswerSchema, quizCompleteSchema, quizzesQuerySchema } from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const quizzes = new Hono()
  /**
   * AC-1: List curated quizzes with optional category and age band filtering.
   */
  .get("/", zValidator("query", quizzesQuerySchema), async (c) => {
    const { category, ageBand, lessonId } = c.req.valid("query");

    let list = [...SEED_QUIZZES];

    if (category && category !== "all") {
      list = getQuizzesByCategory(category);
    }

    if (ageBand) {
      list = getQuizzesByAgeBand(ageBand);
    }

    if (lessonId) {
      list = list.filter((q) => q.lessonSlug === lessonId);
    }

    // Sanitize question metadata for list view (omit answers)
    const sanitized = list.map((q) => ({
      id: q.id,
      slug: q.slug,
      title: q.title,
      description: q.description,
      category: q.category,
      minAge: q.minAge,
      maxAge: q.maxAge,
      passScore: q.passScore,
      questionCount: q.questions.length,
    }));

    return c.json({ quizzes: sanitized, total: sanitized.length });
  })

  /**
   * AC-2, AC-3: Retrieve full 4-question interactive quiz by slug.
   * Note: isCorrect is stripped from options to prevent client inspection.
   */
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const quiz = getQuizBySlug(slug);

    if (!quiz) {
      return c.json({ error: "Quiz not found" }, 404);
    }

    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      position: q.position,
      type: q.type,
      prompt: q.prompt,
      hint: q.hint,
      difficulty: q.difficulty,
      clues: q.clues,
      options: q.options.map((opt) => ({
        id: opt.id,
        position: opt.position,
        text: opt.text,
      })),
    }));

    return c.json({
      quiz: {
        id: quiz.id,
        slug: quiz.slug,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        minAge: quiz.minAge,
        maxAge: quiz.maxAge,
        passScore: quiz.passScore,
      },
      questions: sanitizedQuestions,
    });
  })

  /**
   * AC-4, AC-5: Evaluate answer for a specific question.
   * Returns whether correct, explanation note, and gentle lamb mascot mood.
   */
  .post("/:slug/answer", zValidator("json", quizAnswerSchema), async (c) => {
    const slug = c.req.param("slug");
    const { questionId, optionId } = c.req.valid("json");

    const quiz = getQuizBySlug(slug);
    if (!quiz) {
      return c.json({ error: "Quiz not found" }, 404);
    }

    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) {
      return c.json({ error: "Question not found" }, 404);
    }

    const option = question.options.find((opt) => opt.id === optionId);
    if (!option) {
      return c.json({ error: "Option not found" }, 404);
    }

    const isCorrect = option.isCorrect;
    const lambMood = isCorrect ? "happy" : "encouraging";

    return c.json({
      isCorrect,
      explanation: question.explanation,
      lambMood,
      correctOptionId: isCorrect ? option.id : undefined,
    });
  })

  /**
   * AC-6, AC-7: Record quiz completion. Idempotent for children, zero-server for guests.
   */
  .post("/complete", zValidator("json", quizCompleteSchema), async (c) => {
    const { quizId, childId, idempotencyKey, score } = c.req.valid("json");

    // Unauthenticated guest reading/quiz: pure client local device progress, zero server database rows
    if (!childId) {
      return c.json({
        status: "success",
        guest: true,
        quizId,
        starsAwarded: 0,
        message: "Quiz progress stored on local device for guest learner",
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
          quizId,
          starsAwarded: 0,
          message: "Activity event already recorded",
        });
      }

      // Insert new activity event
      await db.insert(tables.activityEvents).values({
        childId,
        type: "quiz_completed",
        score,
        idempotencyKey,
        metadata: { quizId, score },
      });

      return c.json({
        status: "success",
        guest: false,
        quizId,
        starsAwarded: 2,
        message: "Quiz progress recorded and stars awarded",
      });
    } catch {
      return c.json({
        status: "success",
        guest: false,
        quizId,
        starsAwarded: 2,
        message: "Quiz progress received",
      });
    }
  });
