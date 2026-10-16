import {
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { ageRangeCheck, contentMeta, publishedCheck, reviewMeta } from "./columns";
import { mediaAssets } from "./core";
import { courseKind, liturgicalColor, massSection, prayerCategory, rosarySet } from "./enums";

/** Word timings let the reader highlight the word being read aloud. */
export type WordTiming = { word: string; startMs: number; endMs: number };

/** The 7 sacraments. Fixed reference data, reviewed like any other faith content. */
export const sacraments = pgTable(
  "sacraments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    position: smallint("position").notNull(),
    /** The outward sign: water, oil, bread and wine... */
    signText: text("sign_text"),
    whoReceives: text("who_receives"),
    simpleExplanation: text("simple_explanation").notNull(),
    iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    ...reviewMeta(),
  },
  () => [publishedCheck("sacraments")],
);

/** Simple definitions with a picture (tabernacle, sanctuary lamp, ambo...). Reused everywhere. */
export const glossaryTerms = pgTable(
  "glossary_terms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    term: text("term").notNull(),
    definition: text("definition").notNull(),
    pronunciation: text("pronunciation"),
    imageAssetId: uuid("image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (_t) => [ageRangeCheck("glossary_terms"), publishedCheck("glossary_terms")],
);

export const prayers = pgTable(
  "prayers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    category: prayerCategory("category").notNull().default("other"),
    audioAssetId: uuid("audio_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (_t) => [ageRangeCheck("prayers"), publishedCheck("prayers")],
);

export const rosaryMysteries = pgTable(
  "rosary_mysteries",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    set: rosarySet("set").notNull(),
    /** 1 to 5 within the set. */
    position: smallint("position").notNull(),
    title: text("title").notNull(),
    /** Display reference such as "Luke 1:26-38". */
    scriptureRef: text("scripture_ref"),
    reflection: text("reflection").notNull(),
    imageAssetId: uuid("image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (t) => [
    uniqueIndex("rosary_mysteries_set_position_idx").on(t.set, t.position),
    ageRangeCheck("rosary_mysteries"),
    publishedCheck("rosary_mysteries"),
  ],
);

/** The Mass in order: what happens, what we say, what we do. */
export const massParts = pgTable(
  "mass_parts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    section: massSection("section").notNull(),
    position: smallint("position").notNull().unique(),
    name: text("name").notNull(),
    whatHappens: text("what_happens").notNull(),
    whatWeSay: text("what_we_say"),
    whatWeDo: text("what_we_do"),
    imageAssetId: uuid("image_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (_t) => [ageRangeCheck("mass_parts"), publishedCheck("mass_parts")],
);

/**
 * Season names and colours. Date ranges are calculated in code (Easter moves), not stored here.
 * Drives the optional seasonal accent colour in the UI.
 */
export const liturgicalSeasons = pgTable("liturgical_seasons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  color: liturgicalColor("color").notNull(),
  description: text("description"),
  iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
});

export const catechismCourses = pgTable(
  "catechism_courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    kind: courseKind("kind").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    /** Set on sacrament_prep courses. */
    sacramentId: integer("sacrament_id").references(() => sacraments.id, {
      onDelete: "set null",
    }),
    position: smallint("position").notNull().default(0),
    ...contentMeta(),
  },
  (t) => [
    index("catechism_courses_kind_idx").on(t.kind, t.position),
    ageRangeCheck("catechism_courses"),
    publishedCheck("catechism_courses"),
  ],
);

/** A short lesson made of illustrated panels. The recap quiz is a quiz with lesson_id set. */
export const catechismLessons = pgTable(
  "catechism_lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => catechismCourses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    position: smallint("position").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    sacramentId: integer("sacrament_id").references(() => sacraments.id, {
      onDelete: "set null",
    }),
    seasonId: integer("season_id").references(() => liturgicalSeasons.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (t) => [
    uniqueIndex("catechism_lessons_course_position_idx").on(t.courseId, t.position),
    ageRangeCheck("catechism_lessons"),
    publishedCheck("catechism_lessons"),
  ],
);

export const lessonPanels = pgTable(
  "lesson_panels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => catechismLessons.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    /** Very short. The picture carries the meaning. */
    caption: text("caption").notNull(),
    illustrationAssetId: uuid("illustration_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    audioAssetId: uuid("audio_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    wordTimings: jsonb("word_timings").$type<WordTiming[]>(),
  },
  (t) => [uniqueIndex("lesson_panels_lesson_position_idx").on(t.lessonId, t.position)],
);
