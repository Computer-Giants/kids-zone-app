import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { ageRangeCheck, contentMeta, publishedCheck } from "./columns";
import { mediaAssets } from "./core";
import { bibleBooks } from "./bible";
import { catechismLessons, prayers, type WordTiming } from "./catechism";
import { contentEntity, puzzleType, questionType } from "./enums";
import { saints } from "./saints";

// ---------------------------------------------------------------- Stories

/** Open list: bible, saint, parable, original, church_history, miracle, bedtime... Add rows freely. */
export const storyKinds = pgTable("story_kinds", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  sortOrder: smallint("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

/**
 * One table for every illustrated story (Bible retellings, saint lives, parables, originals,
 * bedtime). Optional links tie a story to a Bible reference, a saint, or a closing prayer.
 */
export const stories = pgTable(
  "stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary"),
    kindId: integer("kind_id")
      .notNull()
      .references(() => storyKinds.id, { onDelete: "restrict" }),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    readingMinutes: smallint("reading_minutes"),
    author: text("author"),
    // Optional canonical Bible reference (all five columns set together, or all null).
    bibleBookId: integer("bible_book_id").references(() => bibleBooks.id, {
      onDelete: "set null",
    }),
    bibleStartChapter: smallint("bible_start_chapter"),
    bibleStartVerse: smallint("bible_start_verse"),
    bibleEndChapter: smallint("bible_end_chapter"),
    bibleEndVerse: smallint("bible_end_verse"),
    saintId: uuid("saint_id").references(() => saints.id, { onDelete: "set null" }),
    /** Bedtime stories end with this prayer. */
    closingPrayerId: uuid("closing_prayer_id").references(() => prayers.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (t) => [
    index("stories_kind_idx").on(t.kindId),
    index("stories_saint_idx").on(t.saintId),
    ageRangeCheck("stories"),
    publishedCheck("stories"),
    check(
      "stories_bible_ref_chk",
      sql`(bible_book_id IS NULL AND bible_start_chapter IS NULL AND bible_start_verse IS NULL AND bible_end_chapter IS NULL AND bible_end_verse IS NULL)
        OR (bible_book_id IS NOT NULL AND bible_start_chapter IS NOT NULL AND bible_start_verse IS NOT NULL AND bible_end_chapter IS NOT NULL AND bible_end_verse IS NOT NULL)`,
    ),
  ],
);

export const storyPages = pgTable(
  "story_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    text: text("text").notNull(),
    illustrationAssetId: uuid("illustration_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    /** One short recorded file per page keeps loads fast on slow connections. */
    audioAssetId: uuid("audio_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    wordTimings: jsonb("word_timings").$type<WordTiming[]>(),
  },
  (t) => [uniqueIndex("story_pages_story_position_idx").on(t.storyId, t.position)],
);

// ---------------------------------------------------------------- Puzzles

/**
 * word_search, matching, scramble, fill_blank (coloring reserved for phase 2).
 * `config` is validated per type by a Zod discriminated union in packages/validators.
 */
export const puzzles = pgTable(
  "puzzles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    type: puzzleType("type").notNull(),
    title: text("title").notNull(),
    instructions: text("instructions"),
    /** 1 (easy) to 3 (hard). */
    difficulty: smallint("difficulty").notNull().default(1),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    config: jsonb("config").$type<Record<string, unknown>>().notNull(),
    ...contentMeta(),
  },
  (t) => [
    index("puzzles_type_idx").on(t.type),
    ageRangeCheck("puzzles"),
    publishedCheck("puzzles"),
    check("puzzles_difficulty_chk", sql`difficulty BETWEEN 1 AND 3`),
  ],
);

/** Lets a saint, lesson or verse page offer "Play a puzzle about this". Not a foreign key on entity_id. */
export const puzzleLinks = pgTable(
  "puzzle_links",
  {
    puzzleId: uuid("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    entityType: contentEntity("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.puzzleId, t.entityType, t.entityId] }),
    index("puzzle_links_entity_idx").on(t.entityType, t.entityId),
  ],
);

// ---------------------------------------------------------------- Quizzes

export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    /** Set when this quiz is a lesson's "what did we learn?" recap. */
    lessonId: uuid("lesson_id").references(() => catechismLessons.id, { onDelete: "set null" }),
    /** Percent needed for a "pass" (stars are given regardless). */
    passScore: smallint("pass_score").notNull().default(60),
    ...contentMeta(),
  },
  (t) => [
    index("quizzes_lesson_idx").on(t.lessonId),
    ageRangeCheck("quizzes"),
    publishedCheck("quizzes"),
  ],
);

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    type: questionType("type").notNull(),
    prompt: text("prompt").notNull(),
    imageAssetId: uuid("image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    hint: text("hint"),
    /** Shown after answering. Short and encouraging. */
    explanation: text("explanation"),
    difficulty: smallint("difficulty").notNull().default(1),
    /** For who_am_i: the saint being described. */
    subjectSaintId: uuid("subject_saint_id").references(() => saints.id, {
      onDelete: "set null",
    }),
    /** Type-specific data, e.g. who_am_i clues ordered hardest to easiest. */
    config: jsonb("config").$type<Record<string, unknown>>(),
  },
  (t) => [
    uniqueIndex("quiz_questions_quiz_position_idx").on(t.quizId, t.position),
    check("quiz_questions_difficulty_chk", sql`difficulty BETWEEN 1 AND 3`),
  ],
);

/** Options are rows (not JSON) so we can see which wrong answers children choose most. */
export const quizOptions = pgTable(
  "quiz_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    text: text("text"),
    imageAssetId: uuid("image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (t) => [
    uniqueIndex("quiz_options_question_position_idx").on(t.questionId, t.position),
    check("quiz_options_content_chk", sql`text IS NOT NULL OR image_asset_id IS NOT NULL`),
  ],
);
