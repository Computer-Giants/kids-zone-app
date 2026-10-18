import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Rewards API Routes", () => {
  it("GET /api/rewards/balance rejects missing childId parameter", async () => {
    const res = await app.request("/api/rewards/balance");
    expect(res.status).toBe(400);
  });

  it("POST /api/rewards/activity handles unauthenticated guest learner without database writes", async () => {
    const res = await app.request("/api/rewards/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "puzzle_completed",
        score: 100,
        idempotencyKey: "00000000-0000-0000-0000-000000000001",
      }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      guest: boolean;
      starsEarned: number;
      streak: { current: number };
    };
    expect(json.success).toBe(true);
    expect(json.guest).toBe(true);
    expect(json.starsEarned).toBe(2);
    expect(json.streak.current).toBe(1);
  });

  it("POST /api/rewards/activity validates invalid UUID idempotency key", async () => {
    const res = await app.request("/api/rewards/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "verse_read",
        idempotencyKey: "not-a-valid-uuid",
      }),
    });

    expect(res.status).toBe(400);
  });
});
