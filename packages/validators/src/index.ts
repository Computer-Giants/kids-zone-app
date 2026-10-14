import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;

// ============================================================================
// Child & Account Validators
// ============================================================================

export const childNicknameSchema = z
  .string()
  .trim()
  .min(2, "Nickname must be at least 2 characters")
  .max(30, "Nickname must be at most 30 characters")
  .regex(/^[\p{L}\p{N} _-]+$/u, "Nickname contains invalid characters");

export const ageBandSchema = z.enum(["b3_7", "b8_10", "b11_15"]);
export type AgeBand = z.infer<typeof ageBandSchema>;

export const readingModeSchema = z.enum(["full", "key_verses", "stories"]);
export type ReadingMode = z.infer<typeof readingModeSchema>;

export const childPreferencesSchema = z.object({
  ageBandOverride: ageBandSchema.nullable().optional(),
  readingMode: readingModeSchema.nullable().optional(),
  translationId: z.number().int().nullable().optional(),
});
export type ChildPreferencesInput = z.infer<typeof childPreferencesSchema>;

// ============================================================================
// Puzzles (packages/validators for puzzles.config)
// ============================================================================

export const wordSearchConfigSchema = z.object({
  type: z.literal("word_search").default("word_search"),
  gridWidth: z.number().int().min(6).max(20).default(10),
  gridHeight: z.number().int().min(6).max(20).default(10),
  words: z
    .array(
      z.object({
        word: z.string().trim().toUpperCase().min(2),
        hint: z.string().optional(),
      }),
    )
    .min(1),
});
export type WordSearchConfig = z.infer<typeof wordSearchConfigSchema>;

export const matchingConfigSchema = z.object({
  type: z.literal("matching").default("matching"),
  pairs: z
    .array(
      z.object({
        id: z.string().min(1),
        leftText: z.string().min(1),
        leftImageAssetId: z.string().uuid().optional(),
        rightText: z.string().min(1),
        rightImageAssetId: z.string().uuid().optional(),
      }),
    )
    .min(2),
});
export type MatchingConfig = z.infer<typeof matchingConfigSchema>;

export const scrambleConfigSchema = z.object({
  type: z.literal("scramble").default("scramble"),
  solution: z.string().trim().toUpperCase().min(2),
  hint: z.string().optional(),
  initialScramble: z.string().trim().toUpperCase().optional(),
});
export type ScrambleConfig = z.infer<typeof scrambleConfigSchema>;

export const fillBlankConfigSchema = z.object({
  type: z.literal("fill_blank").default("fill_blank"),
  /** Text with placeholders like {{blank_1}} */
  template: z.string().min(3),
  blanks: z
    .array(
      z.object({
        key: z.string().min(1),
        answer: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
      }),
    )
    .min(1),
});
export type FillBlankConfig = z.infer<typeof fillBlankConfigSchema>;

export const coloringConfigSchema = z.object({
  type: z.literal("coloring").default("coloring"),
  palette: z.array(z.string()).default([]),
  regions: z.record(z.string(), z.string()).optional(),
});
export type ColoringConfig = z.infer<typeof coloringConfigSchema>;

export const puzzleConfigSchema = z.discriminatedUnion("type", [
  wordSearchConfigSchema,
  matchingConfigSchema,
  scrambleConfigSchema,
  fillBlankConfigSchema,
  coloringConfigSchema,
]);
export type PuzzleConfig = z.infer<typeof puzzleConfigSchema>;

// ============================================================================
// Quiz Questions (packages/validators for quiz_questions.config)
// ============================================================================

export const whoAmIClueSchema = z.object({
  position: z.number().int().min(1),
  clue: z.string().min(1),
  points: z.number().int().positive().optional(),
});

export const whoAmIConfigSchema = z.object({
  type: z.literal("who_am_i").default("who_am_i"),
  clues: z.array(whoAmIClueSchema).min(1),
  revealOrder: z.enum(["hardest_first", "chronological"]).default("hardest_first"),
});
export type WhoAmIConfig = z.infer<typeof whoAmIConfigSchema>;

export const multipleChoiceConfigSchema = z.object({
  type: z.literal("multiple_choice").default("multiple_choice"),
  shuffleOptions: z.boolean().default(true),
  layout: z.enum(["stack", "grid"]).default("stack"),
});

export const pictureChoiceConfigSchema = z.object({
  type: z.literal("picture_choice").default("picture_choice"),
  gridColumns: z.number().int().min(2).max(4).default(2),
});

export const trueFalseConfigSchema = z.object({
  type: z.literal("true_false").default("true_false"),
});

export const quizQuestionConfigSchema = z.union([
  whoAmIConfigSchema,
  multipleChoiceConfigSchema,
  pictureChoiceConfigSchema,
  trueFalseConfigSchema,
  z.record(z.string(), z.unknown()),
]);
export type QuizQuestionConfig = z.infer<typeof quizQuestionConfigSchema>;

// ============================================================================
// Badges (packages/validators for badges.rule)
// ============================================================================

export const badgeRuleSchema = z.object({
  activityType: z.enum([
    "daily_open",
    "verse_read",
    "story_read",
    "saint_viewed",
    "prayer_prayed",
    "lesson_completed",
    "quiz_completed",
    "puzzle_completed",
  ]),
  count: z.number().int().positive(),
  minScore: z.number().int().min(0).max(100).optional(),
  streakDays: z.number().int().positive().optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
});
export type BadgeRule = z.infer<typeof badgeRuleSchema>;
