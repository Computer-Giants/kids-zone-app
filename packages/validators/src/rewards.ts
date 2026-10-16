import { z } from "zod";

export const ledgerCurrencySchema = z.enum(["star", "coin"]);
export type LedgerCurrency = z.infer<typeof ledgerCurrencySchema>;

export const activityTypeSchema = z.enum([
  "daily_open",
  "verse_read",
  "story_read",
  "saint_viewed",
  "prayer_prayed",
  "lesson_completed",
  "quiz_completed",
  "puzzle_completed",
]);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const contentEntitySchema = z.enum([
  "story",
  "saint",
  "lesson",
  "course",
  "quiz",
  "puzzle",
  "prayer",
  "featured_verse",
  "glossary_term",
  "journey",
]);
export type ContentEntity = z.infer<typeof contentEntitySchema>;

/** Payload for submitting activity completion to earn rewards and extend streaks. */
export const activityCompletionSchema = z.object({
  childId: z.string().uuid("Invalid child ID").optional(),
  type: activityTypeSchema,
  entityType: contentEntitySchema.optional(),
  entityId: z.string().min(1, "Entity ID is required").optional(),
  score: z.number().int().min(0).max(100).optional(),
  idempotencyKey: z.string().uuid("Idempotency key must be a valid UUID"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type ActivityCompletionInput = z.infer<typeof activityCompletionSchema>;

/** Response returned after recording an activity event and calculating rewards. */
export const rewardResultSchema = z.object({
  success: z.boolean(),
  starsEarned: z.number().int().min(0),
  coinsEarned: z.number().int().min(0),
  isFirstTime: z.boolean(),
  dailyCapReached: z.boolean(),
  streak: z.object({
    current: z.number().int().min(0),
    longest: z.number().int().min(0),
    isMilestone: z.boolean(),
    milestoneDays: z.number().int().optional(),
    bonusStars: z.number().int().min(0),
  }),
  newBalances: z.object({
    stars: z.number().int().min(0),
    coins: z.number().int().min(0),
  }),
});
export type RewardResult = z.infer<typeof rewardResultSchema>;

export const rewardBalanceQuerySchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
});
export type RewardBalanceQuery = z.infer<typeof rewardBalanceQuerySchema>;
