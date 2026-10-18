import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Leaderboard and Review API Routes", () => {
  it("GET /api/leaderboard accepts valid age band query and defaults weekStart", async () => {
    const res = await app.request("/api/leaderboard?ageBand=b8_10");
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      weekStart: string;
      ageBand: string;
      leaderboard: unknown[];
    };
    expect(json.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(json.ageBand).toBe("b8_10");
    expect(Array.isArray(json.leaderboard)).toBe(true);
  });

  it("GET /api/leaderboard rejects invalid age band", async () => {
    const res = await app.request("/api/leaderboard?ageBand=adult");
    expect(res.status).toBe(400);
  });

  it("GET /api/review/daily rejects missing childId", async () => {
    const res = await app.request("/api/review/daily");
    expect(res.status).toBe(400);
  });

  it("GET /api/review/daily accepts valid childId and returns review question array", async () => {
    const res = await app.request(
      "/api/review/daily?childId=00000000-0000-4000-8000-000000000001&limit=3",
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      childId: string;
      questions: unknown[];
    };
    expect(json.childId).toBe("00000000-0000-4000-8000-000000000001");
    expect(Array.isArray(json.questions)).toBe(true);
  });
});
