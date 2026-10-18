import { sql } from "drizzle-orm";
import { check, integer, pgTable, smallint, text, uuid } from "drizzle-orm/pg-core";
import { ageRangeCheck, contentMeta, publishedCheck } from "./columns";
import { glossaryTerms } from "./catechism";

/**
 * Five illustrated rooms of a Catholic church building:
 * 1. Entrance and Narthex
 * 2. Nave and Pews
 * 3. Sacred Sanctuary
 * 4. High Altar and Tabernacle
 * 5. Sacristy
 */
export const churchTourScenes = pgTable(
  "church_tour_scenes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    illustrationSvgKey: text("illustration_svg_key").notNull(),
    ...contentMeta(),
  },
  (_t) => [ageRangeCheck("church_tour_scenes"), publishedCheck("church_tour_scenes")],
);

/**
 * Sacred objects, furnishings, and liturgical items inside each church tour scene.
 * Percentage coordinates (0-100) place glowing halo hot spots on responsive SVG backgrounds.
 */
export const churchTourItems = pgTable(
  "church_tour_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sceneId: uuid("scene_id")
      .notNull()
      .references(() => churchTourScenes.id, { onDelete: "cascade" }),
    glossaryTermId: uuid("glossary_term_id").references(() => glossaryTerms.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    illustrationSvgKey: text("illustration_svg_key").notNull(),
    xPercent: smallint("x_percent").notNull(),
    yPercent: smallint("y_percent").notNull(),
    reverenceNote: text("reverence_note").notNull(),
    simplifiedTextBand3_7: text("simplified_text_band_3_7").notNull(),
    simplifiedTextBand8_10: text("simplified_text_band_8_10").notNull(),
    simplifiedTextBand11_15: text("simplified_text_band_11_15").notNull(),
    audioNarrationUrl: text("audio_narration_url"),
    orderIndex: integer("order_index").notNull().default(0),
    ...contentMeta(),
  },
  (_t) => [
    ageRangeCheck("church_tour_items"),
    publishedCheck("church_tour_items"),
    check("church_tour_items_x_chk", sql`x_percent >= 0 AND x_percent <= 100`),
    check("church_tour_items_y_chk", sql`y_percent >= 0 AND y_percent <= 100`),
  ],
);
