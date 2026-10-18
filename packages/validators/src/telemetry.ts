import { z } from "zod";

/**
 * Strict anonymous first-party telemetry schema.
 * Complies with strict project privacy rules:
 * - Zero child IDs, user IDs, or household IDs.
 * - Zero IP addresses or user agent fingerprints.
 * - Coarse age bands and coarse duration buckets only.
 */
export const telemetryEventSchema = z.object({
  eventType: z.enum([
    "story_completed",
    "verse_read",
    "quiz_completed",
    "puzzle_completed",
    "review_completed",
  ]),
  entityType: z
    .enum(["bible_verse", "saint_story", "quiz", "puzzle", "catechism_lesson"])
    .optional(),
  entityId: z.string().uuid().optional(),
  ageBand: z.enum(["b3_7", "b8_10", "b11_15"]),
  durationBucket: z.enum(["under_30s", "30s_to_1m", "1m_to_3m", "3m_to_5m", "over_5m"]),
  status: z.enum(["completed", "abandoned"]).default("completed"),
});

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;
