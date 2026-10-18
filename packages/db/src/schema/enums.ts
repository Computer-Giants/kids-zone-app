import { pgEnum } from "drizzle-orm/pg-core";

// Stable, closed sets live here as Postgres enums.
// Open-ended sets (story kinds, topics, patronages) are lookup TABLES so admins can add rows.

export const userRole = pgEnum("user_role", [
  "parent",
  "contributor",
  "reviewer",
  "moderator",
  "admin",
]);

/** draft -> submitted -> approved (reviewer) -> published (admin). */
export const contentStatus = pgEnum("content_status", [
  "draft",
  "submitted",
  "approved",
  "published",
  "archived",
]);

export const parishStatus = pgEnum("parish_status", ["pending", "approved", "rejected"]);
export const childStatus = pgEnum("child_status", ["active", "graduated"]);
export const ageBand = pgEnum("age_band", ["b3_7", "b8_10", "b11_15"]);
export const readingMode = pgEnum("reading_mode", ["full", "key_verses", "stories"]);
export const testament = pgEnum("testament", ["old", "new"]);
export const translationLevel = pgEnum("translation_level", ["standard", "easy"]);
export const reviewDecision = pgEnum("review_decision", [
  "approved",
  "changes_requested",
  "rejected",
]);
export const parishPostKind = pgEnum("parish_post_kind", ["announcement", "event"]);
export const mediaKind = pgEnum("media_kind", ["image", "svg", "audio"]);
export const topicGroup = pgEnum("topic_group", [
  "virtue",
  "sacrament",
  "commandment",
  "season",
  "theme",
]);

/** Content types that polymorphic tables (topics, reviews, progress, journeys) can point at. All use uuid ids. */
export const contentEntity = pgEnum("content_entity", [
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
  "church_tour",
  "church_tour_scene",
]);

export const placeKind = pgEnum("place_kind", ["born", "lived", "died", "visited"]);
export const liturgicalColor = pgEnum("liturgical_color", [
  "green",
  "purple",
  "white",
  "red",
  "rose",
  "gold",
]);
export const courseKind = pgEnum("course_kind", [
  "core_beliefs",
  "prayers",
  "mass_church_year",
  "sacrament_prep",
]);
export const prayerCategory = pgEnum("prayer_category", [
  "daily",
  "mass",
  "marian",
  "saints",
  "seasonal",
  "other",
]);
export const rosarySet = pgEnum("rosary_set", ["joyful", "luminous", "sorrowful", "glorious"]);
export const massSection = pgEnum("mass_section", [
  "introductory_rites",
  "liturgy_of_the_word",
  "liturgy_of_the_eucharist",
  "concluding_rites",
]);
export const puzzleType = pgEnum("puzzle_type", [
  "word_search",
  "matching",
  "scramble",
  "fill_blank",
  "coloring", // reserved for phase 2
]);
export const questionType = pgEnum("question_type", [
  "multiple_choice",
  "picture_choice",
  "true_false",
  "who_am_i",
]);
/** Colour family used by journeys and the UI (see docs/design.json accents). */
export const appSection = pgEnum("app_section", [
  "bible",
  "saints",
  "catechism",
  "quizzes",
  "games",
  "stories",
]);
export const activityType = pgEnum("activity_type", [
  "daily_open",
  "verse_read",
  "story_read",
  "saint_viewed",
  "prayer_prayed",
  "lesson_completed",
  "quiz_completed",
  "puzzle_completed",
  "review_completed",
  "random_quiz_completed",
  "church_tour_completed",
]);
/** A saved quiz, a random quiz drawn from the question pool, or a daily review round. */
export const attemptKind = pgEnum("attempt_kind", ["quiz", "random", "review"]);
export const progressStatus = pgEnum("progress_status", ["started", "completed"]);
/** Stars measure progress and are never spent. Coins are spendable. */
export const ledgerCurrency = pgEnum("ledger_currency", ["star", "coin"]);
