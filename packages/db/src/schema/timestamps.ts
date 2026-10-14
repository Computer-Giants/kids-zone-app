import { timestamp } from "drizzle-orm/pg-core";

/** Call per table (returns fresh column builders each time). */
export const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
