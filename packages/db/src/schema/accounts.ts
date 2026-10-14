import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { childStatus, contentStatus, parishPostKind, parishStatus, userRole } from "./enums";
import { timestamps } from "./timestamps";

/** App profile. `id` mirrors auth.users.id (see supabase/sql/auth.sql). Parents, staff and admins. */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: userRole("role").notNull().default("parent"),
  ...timestamps(),
});

/** Optional grouping for families. Admins create approved parishes; parents can suggest (pending). */
export const parishes = pgTable(
  "parishes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    city: text("city"),
    region: text("region"),
    /** ISO 3166-1 alpha-2. */
    country: text("country"),
    diocese: text("diocese"),
    status: parishStatus("status").notNull().default("pending"),
    suggestedBy: uuid("suggested_by").references(() => profiles.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => profiles.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    ...timestamps(),
  },
  (t) => [
    index("parishes_status_idx").on(t.status),
    check(
      "parishes_approved_chk",
      sql`status <> 'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)`,
    ),
  ],
);

/** One household per parent account. The parish is optional and never gates content. */
export const households = pgTable(
  "households",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: "cascade" }),
    parishId: uuid("parish_id").references(() => parishes.id, { onDelete: "set null" }),
    /** IANA zone. Streak days roll over here. */
    timezone: text("timezone").notNull().default("UTC"),
    ...timestamps(),
  },
  (t) => [index("households_parish_idx").on(t.parishId)],
);

/** A child profile. Never has credentials. No real name, photo, email or phone. */
export const children = pgTable(
  "children",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, { onDelete: "cascade" }),
    nickname: text("nickname").notNull(),
    /** Key of a preset avatar. */
    avatar: text("avatar").notNull(),
    /** Parent-entered. Age band is derived from this, never stored. */
    birthDate: date("birth_date", { mode: "string" }).notNull(),
    pinHash: text("pin_hash"),
    /** Becomes 'graduated' at 16. History is kept. */
    status: childStatus("status").notNull().default("active"),
    graduatedAt: timestamp("graduated_at", { withTimezone: true }),
    ...timestamps(),
  },
  (t) => [
    index("children_household_idx").on(t.householdId),
    uniqueIndex("children_household_nickname_idx").on(t.householdId, t.nickname),
  ],
);

/** Scopes a profile to one parish (local announcements, pickup handling). */
export const parishAdmins = pgTable(
  "parish_admins",
  {
    parishId: uuid("parish_id")
      .notNull()
      .references(() => parishes.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.parishId, t.profileId] })],
);

/** Local announcements and events. An app admin must approve before families see them. */
export const parishPosts = pgTable(
  "parish_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parishId: uuid("parish_id")
      .notNull()
      .references(() => parishes.id, { onDelete: "cascade" }),
    kind: parishPostKind("kind").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    location: text("location"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    status: contentStatus("status").notNull().default("draft"),
    submittedBy: uuid("submitted_by")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    approvedBy: uuid("approved_by").references(() => profiles.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),
    ...timestamps(),
  },
  (t) => [
    index("parish_posts_parish_status_idx").on(t.parishId, t.status),
    check(
      "parish_posts_published_chk",
      sql`status <> 'published' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)`,
    ),
  ],
);

export type Profile = typeof profiles.$inferSelect;
export type Parish = typeof parishes.$inferSelect;
export type Household = typeof households.$inferSelect;
export type Child = typeof children.$inferSelect;
