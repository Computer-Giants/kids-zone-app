import { describe, expect, it } from "vitest";
import { telemetryEventSchema } from "./telemetry";

describe("telemetryEventSchema", () => {
  it("validates a valid anonymous story completion event", () => {
    const valid = {
      eventType: "story_completed",
      entityType: "saint_story",
      ageBand: "b8_10",
      durationBucket: "1m_to_3m",
      status: "completed",
    };
    const parsed = telemetryEventSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("fails if ageBand is invalid", () => {
    const invalid = {
      eventType: "quiz_completed",
      ageBand: "adult",
      durationBucket: "under_30s",
    };
    const parsed = telemetryEventSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("fails if durationBucket is invalid", () => {
    const invalid = {
      eventType: "verse_read",
      ageBand: "b3_7",
      durationBucket: "10_hours",
    };
    const parsed = telemetryEventSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});
