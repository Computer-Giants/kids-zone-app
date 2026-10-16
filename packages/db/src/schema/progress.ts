import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { children } from "./accounts";
import { contentMeta, ageRangeCheck, publishedCheck } from "./columns";
import { mediaAssets } from "./core";
import { quizOptions, quizQuestions, quizzes } from "./fun";
import {
  activityType,
  ageBand,
  appSection,
  attemptKind,
  contentEntity,
  ledgerCurrency,
  progressStatus,
} from "./enums";
import { timestamps } from "./timestamps";

/**
 * Append-only log of everything a child does. Streaks, badges, stars and coins are all derived
 * from it. Only server-validated events are written, so guests never appear here.
 */
export const activityEvents = pgTable(
  "activity_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    type: activityType("type").notNull(),
    entityType: contentEntity("entity_type"),
    entityId: uuid("entity_id"),
    /** 0 to 100, for quizzes and puzzles. */
    score: smallint("score"),
    /** Client-generated per action, so a double tap or retry can't count twice. */
    idempotencyKey: text("idempotency_key").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  },
  (t) => [
    uniqueIndex("activity_events_child_key_idx").on(t.childId, t.idempotencyKey),
    index("activity_events_child_time_idx").on(t.childId, t.occurredAt),
    index("activity_events_child_type_idx").on(t.childId, t.type),
    check("activity_events_score_chk", sql`score IS NULL OR score BETWEEN 0 AND 100`),
  ],
);

/** Current state per child and content item. Drives "Continue" and the journey map. */
export const childProgress = pgTable(
  "child_progress",
  {
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    entityType: contentEntity("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    status: progressStatus("status").notNull().default("started"),
    bestScore: smallint("best_score"),
    attempts: integer("attempts").notNull().default(0),
    firstCompletedAt: timestamp("first_completed_at", { withTimezone: true }),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.childId, t.entityType, t.entityId] }),
    index("child_progress_recent_idx").on(t.childId, t.lastActivityAt),
  ],
);

/** Day boundaries use households.timezone. */
export const streaks = pgTable("streaks", {
  childId: uuid("child_id")
    .primaryKey()
    .references(() => children.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastActiveDate: date("last_active_date", { mode: "string" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Earning rules live in the database so you can tune rewards without a deploy. */
export const coinRules = pgTable(
  "coin_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    activityType: activityType("activity_type").notNull(),
    currency: ledgerCurrency("currency").notNull().default("coin"),
    amount: integer("amount").notNull(),
    /** Only events with at least this score qualify (null = any). */
    minScore: smallint("min_score"),
    /** Paid once per child per content item. Replays earn nothing from this rule. */
    firstTimeOnly: boolean("first_time_only").notNull().default(true),
    /** Max total from this rule per child per day (null = no cap). */
    dailyCap: integer("daily_cap"),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps(),
  },
  () => [check("coin_rules_amount_chk", sql`amount > 0`)],
);

/**
 * Append-only ledger of stars and coins. Never edited: corrections are new rows.
 * Balances are SUM(amount) per child and currency.
 */
export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    currency: ledgerCurrency("currency").notNull(),
    /** Positive = earned, negative = spent or refunded. */
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    eventId: uuid("event_id").references(() => activityEvents.id, { onDelete: "set null" }),
    ruleId: uuid("rule_id").references(() => coinRules.id, { onDelete: "set null" }),
    entityType: contentEntity("entity_type"),
    entityId: uuid("entity_id"),
    /** Challenge id once challenges ship (no foreign key until that table exists). */
    challengeId: uuid("challenge_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("ledger_entries_child_idx").on(t.childId, t.currency, t.createdAt),
    // A first-time rule can pay a child at most once per content item.
    uniqueIndex("ledger_entries_first_time_idx")
      .on(t.childId, t.ruleId, t.entityType, t.entityId)
      .where(sql`rule_id IS NOT NULL AND entity_id IS NOT NULL`),
    check("ledger_entries_amount_chk", sql`amount <> 0`),
  ],
);

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  /** e.g. { activityType: "quiz_completed", count: 10 }. A background job awards from events. */
  rule: jsonb("rule").$type<Record<string, unknown>>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps(),
});

export const childBadges = pgTable(
  "child_badges",
  {
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.childId, t.badgeId] })],
);

/** The Coddy-style path of lessons, stories, quizzes and puzzles. */
export const journeys = pgTable(
  "journeys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    /** Picks the colour family for the path. */
    section: appSection("section").notNull(),
    coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (_t) => [ageRangeCheck("journeys"), publishedCheck("journeys")],
);

/** Node state (locked, current, completed) is derived from child_progress. */
export const journeyNodes = pgTable(
  "journey_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    journeyId: uuid("journey_id")
      .notNull()
      .references(() => journeys.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    entityType: contentEntity("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
  },
  (t) => [
    uniqueIndex("journey_nodes_journey_position_idx").on(t.journeyId, t.position),
    index("journey_nodes_entity_idx").on(t.entityType, t.entityId),
  ],
);

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    /** Null for random and review rounds, which draw from the question pool. */
    quizId: uuid("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }),
    kind: attemptKind("kind").notNull().default("quiz"),
    score: smallint("score"),
    correctCount: smallint("correct_count"),
    totalCount: smallint("total_count"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [
    index("quiz_attempts_child_quiz_idx").on(t.childId, t.quizId),
    check("quiz_attempts_quiz_chk", sql`kind <> 'quiz' OR quiz_id IS NOT NULL`),
  ],
);

export const quizAnswers = pgTable(
  "quiz_answers",
  {
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => quizAttempts.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    optionId: uuid("option_id").references(() => quizOptions.id, { onDelete: "set null" }),
    isCorrect: boolean("is_correct").notNull(),
    timeMs: integer("time_ms"),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.attemptId, t.questionId] }),
    index("quiz_answers_question_idx").on(t.questionId),
  ],
);

/** Daily review: when each question next comes back for each child. Gaps grow as they get it right. */
export const reviewItems = pgTable(
  "review_items",
  {
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    intervalDays: smallint("interval_days").notNull().default(1),
    correctStreak: smallint("correct_streak").notNull().default(0),
    lastAnsweredAt: timestamp("last_answered_at", { withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.childId, t.questionId] }),
    index("review_items_due_idx").on(t.childId, t.dueAt),
  ],
);

/**
 * Weekly stars by real age band, filled by a background job so the app never ranks on the fly.
 * The job skips children whose parent hid them (children.show_on_leaderboard = false).
 */
export const leaderboardWeekly = pgTable(
  "leaderboard_weekly",
  {
    weekStart: date("week_start", { mode: "string" }).notNull(),
    childId: uuid("child_id")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    ageBand: ageBand("age_band").notNull(),
    stars: integer("stars").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.weekStart, t.childId] }),
    index("leaderboard_weekly_rank_idx").on(t.weekStart, t.ageBand, t.stars),
  ],
);
