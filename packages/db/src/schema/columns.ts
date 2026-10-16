import { sql } from "drizzle-orm";
import { check, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./accounts";
import { contentStatus } from "./enums";
import { timestamps } from "./timestamps";

/**
 * Review + publishing columns shared by every piece of faith content.
 * Flow: draft -> submitted -> approved (reviewer) -> published (admin).
 * Child-facing queries must only read status = 'published'.
 */
export const reviewMeta = () => ({
  status: contentStatus("status").notNull().default("draft"),
  locale: text("locale").notNull().default("en"),
  /** Where this came from (book, site, permission). The reviewer compares it to the child's version. */
  sourceNote: text("source_note"),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  publishedBy: uuid("published_by").references(() => profiles.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps(),
});

/** Suggested ages (3 to 15). Used to sort and recommend, never to hide content. */
export const ageRange = () => ({
  minAge: smallint("min_age").notNull().default(3),
  maxAge: smallint("max_age").notNull().default(15),
});

export const contentMeta = () => ({ ...reviewMeta(), ...ageRange() });

/** Table-level checks. Call inside a table's extra-config array, passing the table name. */
export const ageRangeCheck = (table: string) =>
  check(`${table}_age_range_chk`, sql`min_age >= 3 AND max_age <= 15 AND min_age <= max_age`);

/** Nothing can be 'published' without a reviewer, a publisher and a publish time. */
export const publishedCheck = (table: string) =>
  check(
    `${table}_published_chk`,
    sql`status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL)`,
  );
