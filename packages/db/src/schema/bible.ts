import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { children, profiles } from "./accounts";
import { ageRangeCheck, contentMeta, publishedCheck } from "./columns";
import { ageBand, readingMode, testament, translationLevel } from "./enums";

/** One row per translation. Adding a language later = adding rows, not changing the schema. */
export const bibleTranslations = pgTable("bible_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  language: text("language").notNull().default("en"),
  level: translationLevel("level").notNull(),
  /** Record the source and license of every translation before loading verses. */
  license: text("license").notNull(),
  sourceUrl: text("source_url"),
  attribution: text("attribution"),
  /** The default translation for its language and level. */
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** The 73 Catholic books. id is the canonical order (1 = Genesis). Seeded, not auto-numbered. */
export const bibleBooks = pgTable("bible_books", {
  id: integer("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  testament: testament("testament").notNull(),
  isDeuterocanonical: boolean("is_deuterocanonical").notNull().default(false),
  chapters: smallint("chapters").notNull(),
});

/** Full text. No surrogate id: a verse is identified by translation + book + chapter + verse. */
export const bibleVerses = pgTable(
  "bible_verses",
  {
    translationId: integer("translation_id")
      .notNull()
      .references(() => bibleTranslations.id, { onDelete: "cascade" }),
    bookId: integer("book_id")
      .notNull()
      .references(() => bibleBooks.id, { onDelete: "cascade" }),
    chapter: smallint("chapter").notNull(),
    verse: smallint("verse").notNull(),
    text: text("text").notNull(),
  },
  (t) => [primaryKey({ columns: [t.translationId, t.bookId, t.chapter, t.verse] })],
);

/**
 * Curated key verses. Stores a canonical reference, never copied text: the text is looked up in
 * the child's chosen translation. A single verse has end = start.
 */
export const featuredVerses = pgTable(
  "featured_verses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookId: integer("book_id")
      .notNull()
      .references(() => bibleBooks.id, { onDelete: "restrict" }),
    startChapter: smallint("start_chapter").notNull(),
    startVerse: smallint("start_verse").notNull(),
    endChapter: smallint("end_chapter").notNull(),
    endVerse: smallint("end_verse").notNull(),
    /** One simple line: "what it means". */
    meaning: text("meaning").notNull(),
    ...contentMeta(),
  },
  (t) => [
    index("featured_verses_ref_idx").on(t.bookId, t.startChapter, t.startVerse),
    ageRangeCheck("featured_verses"),
    publishedCheck("featured_verses"),
  ],
);

export const verseOfTheDay = pgTable(
  "verse_of_the_day",
  {
    day: date("day", { mode: "string" }).notNull(),
    locale: text("locale").notNull().default("en"),
    featuredVerseId: uuid("featured_verse_id")
      .notNull()
      .references(() => featuredVerses.id, { onDelete: "restrict" }),
    setBy: uuid("set_by").references(() => profiles.id, { onDelete: "set null" }),
  },
  (t) => [primaryKey({ columns: [t.day, t.locale] })],
);

/** Settings a parent can change (behind the parent gate). Null = use the age-based default. */
export const childPreferences = pgTable("child_preferences", {
  childId: uuid("child_id")
    .primaryKey()
    .references(() => children.id, { onDelete: "cascade" }),
  /** Overrides the band derived from birth_date for content defaults. Never affects chat. */
  ageBandOverride: ageBand("age_band_override"),
  readingMode: readingMode("reading_mode"),
  translationId: integer("translation_id").references(() => bibleTranslations.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
