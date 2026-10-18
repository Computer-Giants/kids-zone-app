import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Telemetry API Routes", () => {
  it("POST /api/telemetry/event accepts valid anonymous event", async () => {
    const res = await app.request("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "puzzle_completed",
        ageBand: "b3_7",
        durationBucket: "1m_to_3m",
        status: "completed",
      }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });

  it("POST /api/telemetry/event rejects invalid eventType", async () => {
    const res = await app.request("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "custom_untracked_event",
        ageBand: "b3_7",
        durationBucket: "under_30s",
      }),
    });

    expect(res.status).toBe(400);
  });
});
