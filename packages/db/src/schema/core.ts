import {
  boolean,
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
import { profiles } from "./accounts";
import { contentEntity, mediaKind, reviewDecision, topicGroup } from "./enums";

/** Images, SVGs and recorded audio. Shared by every content table. */
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: mediaKind("kind").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  bytes: integer("bytes"),
  durationMs: integer("duration_ms"),
  width: integer("width"),
  height: integer("height"),
  /** Required in the app for images shown to children. */
  altText: text("alt_text"),
  locale: text("locale").notNull().default("en"),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Virtues, sacraments, commandments, seasons, themes. Admins add rows; no migration needed. */
export const topics = pgTable("topics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  group: topicGroup("topic_group").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Tags any content item with a topic. entity_id is NOT a foreign key (it can point at several
 * tables), so the app must delete rows here when it deletes content.
 */
export const contentTopics = pgTable(
  "content_topics",
  {
    entityType: contentEntity("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.entityType, t.entityId, t.topicId] }),
    index("content_topics_topic_idx").on(t.topicId, t.entityType),
  ],
);

/** Permanent record of every review decision (e.g. a priest's go-ahead). */
export const contentReviews = pgTable(
  "content_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: contentEntity("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    decision: reviewDecision("decision").notNull(),
    notes: text("notes"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("content_reviews_entity_idx").on(t.entityType, t.entityId)],
);

/** Append-only record of staff actions (publish, unpublish, approve, moderate). */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    details: jsonb("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_log_entity_idx").on(t.entityType, t.entityId),
    index("audit_log_actor_idx").on(t.actorId, t.createdAt),
  ],
);

/**
 * Blocklist for nicknames now and chat later. Admin-editable. Phone numbers, emails and
 * addresses are detected in code, not listed here.
 */
export const filterTerms = pgTable(
  "filter_terms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    term: text("term").notNull(),
    locale: text("locale").notNull().default("en"),
    /** 1 = flag for a moderator, 2 = block outright. */
    severity: smallint("severity").notNull().default(2),
    category: text("category"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("filter_terms_term_locale_idx").on(t.term, t.locale)],
);
