import { z } from "zod";

export const leaderboardQuerySchema = z.object({
  ageBand: z.enum(["b3_7", "b8_10", "b11_15"]).optional(),
  weekStart: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid week start date")
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type LeaderboardQueryInput = z.infer<typeof leaderboardQuerySchema>;

export const dailyReviewQuerySchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
  limit: z.coerce.number().int().min(1).max(10).default(5),
});
export type DailyReviewQueryInput = z.infer<typeof dailyReviewQuerySchema>;

export const submitReviewAnswerSchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
  questionId: z.string().uuid("Invalid question ID"),
  optionId: z.string().uuid("Invalid option ID").optional(),
  isCorrect: z.boolean(),
  timeMs: z.number().int().min(0).max(600000).optional(),
  idempotencyKey: z.string().min(8).max(128),
});
export type SubmitReviewAnswerInput = z.infer<typeof submitReviewAnswerSchema>;
