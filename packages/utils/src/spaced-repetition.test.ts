import { describe, expect, it } from "vitest";
import { calculateNextReview, getMondayOfWeek, REVIEW_INTERVAL_DAYS } from "./spaced-repetition";

describe("calculateNextReview", () => {
  const baseDate = new Date("2026-10-19T10:00:00Z");

  it("schedules first interval at 1 day for initial correct answer", () => {
    const result = calculateNextReview(0, true, baseDate);
    expect(result.nextIntervalDays).toBe(1);
    expect(result.newStreak).toBe(1);
    expect(result.dueAt.toISOString()).toBe("2026-10-20T10:00:00.000Z");
  });

  it("progresses through 3, 7, 14, 30 days on consecutive correct answers", () => {
    let streak = 0;
    const intervals: number[] = [];

    for (let i = 0; i < 5; i++) {
      const res = calculateNextReview(streak, true, baseDate);
      intervals.push(res.nextIntervalDays);
      streak = res.newStreak;
    }

    expect(intervals).toEqual([...REVIEW_INTERVAL_DAYS]);
    expect(streak).toBe(5);
  });

  it("caps interval at 30 days for streaks higher than 5", () => {
    const res = calculateNextReview(10, true, baseDate);
    expect(res.nextIntervalDays).toBe(30);
    expect(res.newStreak).toBe(11);
  });

  it("gently resets interval to 1 day and streak to 0 on incorrect answer (AC-7)", () => {
    const result = calculateNextReview(4, false, baseDate);
    expect(result.nextIntervalDays).toBe(1);
    expect(result.newStreak).toBe(0);
    expect(result.dueAt.toISOString()).toBe("2026-10-20T10:00:00.000Z");
  });
});

describe("getMondayOfWeek", () => {
  it("returns Monday for a Wednesday", () => {
    // 2026-10-21 is a Wednesday
    const wednesday = new Date(Date.UTC(2026, 9, 21));
    expect(getMondayOfWeek(wednesday)).toBe("2026-10-19");
  });

  it("returns itself for a Monday", () => {
    // 2026-10-19 is a Monday
    const monday = new Date(Date.UTC(2026, 9, 19));
    expect(getMondayOfWeek(monday)).toBe("2026-10-19");
  });

  it("returns previous Monday for a Sunday", () => {
    // 2026-10-25 is a Sunday
    const sunday = new Date(Date.UTC(2026, 9, 25));
    expect(getMondayOfWeek(sunday)).toBe("2026-10-19");
  });

  it("handles month rollover correctly", () => {
    // 2026-11-01 is a Sunday; Monday was 2026-10-26
    const novFirst = new Date(Date.UTC(2026, 10, 1));
    expect(getMondayOfWeek(novFirst)).toBe("2026-10-26");
  });
});
