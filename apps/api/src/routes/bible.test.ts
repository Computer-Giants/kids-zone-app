import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Bible API routes", () => {
  it("GET /api/bible/books returns all 73 Catholic canonical books", async () => {
    const res = await app.request("/api/bible/books");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.books).toHaveLength(73);

    // Verify presence of Deuterocanonical books
    const deutero = data.books.filter((b: { isDeuterocanonical: boolean }) => b.isDeuterocanonical);
    expect(deutero.length).toBe(7);
  });

  it("GET /api/bible/chapter returns Genesis 1 verses, retelling, and key verses", async () => {
    const res = await app.request("/api/bible/chapter?book=gen&chapter=1");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.book.name).toBe("Genesis");
    expect(data.chapter).toBe(1);
    expect(data.verses.length).toBeGreaterThan(0);
    expect(data.retelling).not.toBeNull();
    expect(data.retelling.title).toBe("God Creates the Beautiful World");
    expect(data.retelling.pages.length).toBeGreaterThanOrEqual(6);
    expect(data.keyVerses.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/bible/chapter rejects non-existent book and invalid chapter", async () => {
    const notFound = await app.request("/api/bible/chapter?book=unknown&chapter=1");
    expect(notFound.status).toBe(404);

    const badChapter = await app.request("/api/bible/chapter?book=gen&chapter=999");
    expect(badChapter.status).toBe(400);
  });

  it("GET /api/bible/verse-of-the-day returns verse for date", async () => {
    const res = await app.request("/api/bible/verse-of-the-day?date=2026-10-15");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.day).toBe("2026-10-15");
    expect(data.verse).toBeDefined();
    expect(data.verse.citation).toBeDefined();
    expect(data.verse.text).toBeDefined();
    expect(data.verse.meaning).toBeDefined();
  });

  it("POST /api/bible/readings/complete supports guest completion without server records", async () => {
    const res = await app.request("/api/bible/readings/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId: "gen-1",
        idempotencyKey: "00000000-0000-4000-8000-000000000001",
        entityType: "bible_chapter",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(true);
    expect(data.starsAwarded).toBe(0);
  });
});
