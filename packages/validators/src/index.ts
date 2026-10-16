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

export const parentSignUpSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().trim().max(100).optional().or(z.literal("")),
  timezone: z.string().trim().default("UTC"),
});
export type ParentSignUpInput = z.infer<typeof parentSignUpSchema>;

export const parentSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type ParentSignInInput = z.infer<typeof parentSignInSchema>;

export const magicLinkSchema = z.object({
  email: emailSchema,
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const childNicknameSchema = z
  .string()
  .trim()
  .min(2, "Nickname must be at least 2 characters")
  .max(30, "Nickname must be at most 30 characters")
  .regex(/^[\p{L}\p{N} _-]+$/u, "Nickname contains invalid characters");

export { containsBlockedTerm, normalizeLeetspeak } from "./filter";
import { containsBlockedTerm } from "./filter";

export const childAvatarSchema = z.string().min(1, "Avatar selection is required");

export const childPinSchema = z
  .string()
  .regex(/^\d{4}$/, "Child PIN must be exactly 4 digits")
  .optional()
  .or(z.literal(""));

export const parentPasscodeSchema = z
  .string()
  .regex(/^\d{4}$/, "Parent passcode must be exactly 4 digits");

function calculateAgeYears(birthDateInput: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDateInput.trim());
  if (!match || !match[1] || !match[2] || !match[3]) {
    return -1;
  }
  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]) - 1;
  const birthDay = Number(match[3]);
  const now = new Date();
  let age = now.getFullYear() - birthYear;
  const monthDiff = now.getMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDay)) {
    age--;
  }
  return age;
}

export const createChildSchema = z.object({
  nickname: childNicknameSchema.refine(
    (name) => !containsBlockedTerm(name),
    "Nickname contains inappropriate words. Please choose a friendly nickname.",
  ),
  avatar: childAvatarSchema,
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be in YYYY-MM-DD format")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "Birth date cannot be in the future")
    .refine((val) => {
      const age = calculateAgeYears(val);
      return age >= 2 && age <= 15;
    }, "Child must be between 2 and 15 years old"),
  pin: childPinSchema,
});
export type CreateChildInput = z.infer<typeof createChildSchema>;

export const updateChildSchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
  nickname: childNicknameSchema.refine(
    (name) => !containsBlockedTerm(name),
    "Nickname contains inappropriate words. Please choose a friendly nickname.",
  ),
  avatar: childAvatarSchema,
  pin: childPinSchema,
});
export type UpdateChildInput = z.infer<typeof updateChildSchema>;

export const setParentPasscodeSchema = z.object({
  passcode: parentPasscodeSchema,
  currentPassword: z.string().optional(),
});
export type SetParentPasscodeInput = z.infer<typeof setParentPasscodeSchema>;

export const verifyParentPasscodeSchema = z.object({
  passcode: parentPasscodeSchema,
});
export type VerifyParentPasscodeInput = z.infer<typeof verifyParentPasscodeSchema>;

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

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1),
});
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>;

export const quizCompleteSchema = z.object({
  quizId: z.string().min(1),
  childId: z.string().uuid().optional(),
  idempotencyKey: z.string().uuid(),
  score: z.number().int().min(0).max(100).default(100),
});
export type QuizCompleteInput = z.infer<typeof quizCompleteSchema>;

export const quizzesQuerySchema = z.object({
  category: z.string().optional(),
  ageBand: ageBandSchema.optional(),
  lessonId: z.string().uuid().optional(),
});
export type QuizzesQuery = z.infer<typeof quizzesQuerySchema>;

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

// ============================================================================
// Bible & Reading Progress
// ============================================================================

export const bibleChapterQuerySchema = z.object({
  book: z.string().min(1),
  chapter: z.coerce.number().int().min(1),
  translationId: z.coerce.number().int().optional(),
});
export type BibleChapterQuery = z.infer<typeof bibleChapterQuerySchema>;

export const readingCompletionSchema = z.object({
  childId: z.string().uuid().optional(),
  contentId: z.string().min(1),
  idempotencyKey: z.string().uuid(),
  entityType: z
    .enum(["story", "featured_verse", "bible_chapter", "saint", "saint_story"])
    .default("bible_chapter"),
});
export type ReadingCompletionInput = z.infer<typeof readingCompletionSchema>;

// ============================================================================
// Saints
// ============================================================================

export const saintTodayQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
export type SaintTodayQuery = z.infer<typeof saintTodayQuerySchema>;

export const saintsQuerySchema = z.object({
  search: z.string().trim().optional(),
  patronage: z.string().trim().optional(),
  era: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type SaintsQuery = z.infer<typeof saintsQuerySchema>;
