import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Puzzles API routes", () => {
  it("GET /api/puzzles returns all seeded Catholic church puzzles", async () => {
    const res = await app.request("/api/puzzles");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.puzzles.length).toBeGreaterThanOrEqual(4);
    expect(data.total).toBe(data.puzzles.length);

    // Verify presence of all three puzzle types
    const types = data.puzzles.map((p: { type: string }) => p.type);
    expect(types).toContain("matching");
    expect(types).toContain("word_search");
    expect(types).toContain("scramble");
  });

  it("GET /api/puzzles with type filter returns only matching puzzles", async () => {
    const res = await app.request("/api/puzzles?type=matching");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.puzzles.length).toBeGreaterThanOrEqual(2);
    for (const p of data.puzzles) {
      expect(p.type).toBe("matching");
    }
  });

  it("GET /api/puzzles/:slug returns full puzzle with validated config", async () => {
    const res = await app.request("/api/puzzles/sacred-altar-vessels");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.puzzle).toBeDefined();
    expect(data.puzzle.slug).toBe("sacred-altar-vessels");
    expect(data.puzzle.config.pairs.length).toBe(8);
  });

  it("GET /api/puzzles/:slug returns 404 for unknown puzzle", async () => {
    const res = await app.request("/api/puzzles/non-existent-puzzle");
    expect(res.status).toBe(404);
  });

  it("POST /api/puzzles/complete returns guest mode with zero server database rows", async () => {
    const res = await app.request("/api/puzzles/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        puzzleId: "puz10001-0001-4000-8000-000000000001",
        idempotencyKey: "00000000-0000-4000-8000-000000000001",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(true);
    expect(data.starsAwarded).toBe(0);
  });
});
