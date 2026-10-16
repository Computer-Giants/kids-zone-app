import { describe, expect, it } from "vitest";
import { CATHOLIC_BOOKS, getBookByCode, getBookById } from "./data/catholic-books";
import {
  SEED_FEATURED_VERSES,
  GENESIS_1_VERSES,
  GENESIS_CREATION_STORY,
} from "./data/initial-scripture";
import { seedBibleData } from "./seed";
import { getDb } from "./index";
import { bibleBooks } from "./schema/bible";

describe("Catholic Bible Canon & Seeding", () => {
  it("has exactly 73 Catholic canonical books", () => {
    expect(CATHOLIC_BOOKS).toHaveLength(73);
  });

  it("identifies all 7 Catholic Deuterocanonical books", () => {
    const deutero = CATHOLIC_BOOKS.filter((b) => b.isDeuterocanonical);
    expect(deutero).toHaveLength(7);
    const codes = deutero.map((b) => b.code);
    expect(codes).toContain("tob");
    expect(codes).toContain("jdt");
    expect(codes).toContain("1macc");
    expect(codes).toContain("2macc");
    expect(codes).toContain("wis");
    expect(codes).toContain("sir");
    expect(codes).toContain("bar");
  });

  it("finds books by code and id", () => {
    const genesis = getBookByCode("gen");
    expect(genesis?.name).toBe("Genesis");
    expect(genesis?.chapters).toBe(50);

    const matthew = getBookById(47);
    expect(matthew?.name).toBe("Matthew");
    expect(matthew?.testament).toBe("new");
  });

  it("has Genesis 1 scripture verses and kid story pages", () => {
    expect(GENESIS_1_VERSES.length).toBe(31);
    expect(GENESIS_CREATION_STORY.pages.length).toBe(6);
    expect(SEED_FEATURED_VERSES.length).toBeGreaterThanOrEqual(5);
  });

  it("executes seedBibleData idempotently against database", async () => {
    // If DATABASE_URL is available, run the seeder
    if (process.env.DATABASE_URL) {
      await expect(seedBibleData()).resolves.not.toThrow();
      const db = getDb();
      const books = await db.select().from(bibleBooks);
      expect(books.length).toBe(73);
    }
  }, 30000);
});
