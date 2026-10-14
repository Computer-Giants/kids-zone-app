import {
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  date,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./accounts";
import { ageRangeCheck, contentMeta, publishedCheck } from "./columns";
import { mediaAssets } from "./core";
import { placeKind } from "./enums";

/**
 * A saint's profile. The illustrated life story is a row in `stories` (kind 'saint', saint_id set).
 * Virtues are tagged through `content_topics`.
 */
export const saints = pgTable(
  "saints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    /** "St.", "Bl." and so on. */
    title: text("title"),
    tagline: text("tagline"),
    /** Month and day, because the feast repeats every year. */
    feastMonth: smallint("feast_month"),
    feastDay: smallint("feast_day"),
    /** For moveable or optional feasts. */
    feastNote: text("feast_note"),
    birthYear: integer("birth_year"),
    deathYear: integer("death_year"),
    /** "4th century". */
    eraLabel: text("era_label"),
    countryCodes: text("country_codes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    /** Extra names for search ("Francis" for "Francis of Assisi"). */
    searchAliases: text("search_aliases")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    prayer: text("prayer"),
    portraitAssetId: uuid("portrait_asset_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...contentMeta(),
  },
  (t) => [
    index("saints_feast_idx").on(t.feastMonth, t.feastDay),
    ageRangeCheck("saints"),
    publishedCheck("saints"),
  ],
);

export const saintFunFacts = pgTable(
  "saint_fun_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    saintId: uuid("saint_id")
      .notNull()
      .references(() => saints.id, { onDelete: "cascade" }),
    position: smallint("position").notNull().default(1),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("saint_fun_facts_saint_idx").on(t.saintId, t.position)],
);

/** Pins for the world map and timeline. */
export const saintPlaces = pgTable(
  "saint_places",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    saintId: uuid("saint_id")
      .notNull()
      .references(() => saints.id, { onDelete: "cascade" }),
    kind: placeKind("kind").notNull(),
    placeName: text("place_name").notNull(),
    /** ISO 3166-1 alpha-2. */
    countryCode: text("country_code").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    note: text("note"),
  },
  (t) => [
    index("saint_places_saint_idx").on(t.saintId),
    index("saint_places_country_idx").on(t.countryCode),
  ],
);

/** "Patron of animals, music, travellers...". Admins add rows. */
export const patronages = pgTable("patronages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  iconAssetId: uuid("icon_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
});

export const saintPatronages = pgTable(
  "saint_patronages",
  {
    saintId: uuid("saint_id")
      .notNull()
      .references(() => saints.id, { onDelete: "cascade" }),
    patronageId: integer("patronage_id")
      .notNull()
      .references(() => patronages.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.saintId, t.patronageId] })],
);

/** Override for dates with several saints or none. By default the saint follows the feast day. */
export const saintOfTheDay = pgTable("saint_of_the_day", {
  day: date("day", { mode: "string" }).primaryKey(),
  saintId: uuid("saint_id")
    .notNull()
    .references(() => saints.id, { onDelete: "restrict" }),
  setBy: uuid("set_by").references(() => profiles.id, { onDelete: "set null" }),
});
