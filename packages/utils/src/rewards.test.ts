import { describe, expect, it } from "vitest";
import {
  calculateUpdatedStreak,
  evaluateRewardRule,
  getCalendarDateInTimezone,
  getDayDifference,
  STREAK_MILESTONES,
  type StreakState,
  type CoinRuleEvaluation,
} from "./rewards";

describe("Rewards and Habit Streak Pure Calculations", () => {
  describe("getCalendarDateInTimezone", () => {
    it("converts server UTC date to local household calendar date", () => {
      // 2026-10-16 23:30:00 UTC is already 2026-10-17 in Tokyo (+9)
      const lateUtc = new Date("2026-10-16T23:30:00Z");
      expect(getCalendarDateInTimezone(lateUtc, "UTC")).toBe("2026-10-16");
      expect(getCalendarDateInTimezone(lateUtc, "Asia/Tokyo")).toBe("2026-10-17");
      expect(getCalendarDateInTimezone(lateUtc, "America/New_York")).toBe("2026-10-16");
    });

    it("falls back to UTC string on invalid timezone identifier", () => {
      const d = new Date("2026-10-16T12:00:00Z");
      expect(getCalendarDateInTimezone(d, "Invalid/Timezone")).toBe("2026-10-16");
    });
  });

  describe("getDayDifference", () => {
    it("computes difference in calendar days", () => {
      expect(getDayDifference("2026-10-15", "2026-10-16")).toBe(1);
      expect(getDayDifference("2026-10-16", "2026-10-16")).toBe(0);
      expect(getDayDifference("2026-10-14", "2026-10-16")).toBe(2);
    });
  });

  describe("calculateUpdatedStreak", () => {
    it("starts streak at 1 for a brand new child with no prior activity", () => {
      const state: StreakState = { current: 0, longest: 0, lastActiveDate: null };
      const res = calculateUpdatedStreak(state, new Date("2026-10-16T10:00:00Z"), "UTC");

      expect(res.current).toBe(1);
      expect(res.longest).toBe(1);
      expect(res.newActiveDate).toBe("2026-10-16");
      expect(res.isSameDay).toBe(false);
      expect(res.isConsecutive).toBe(false);
      expect(res.isMilestone).toBe(false);
      expect(res.bonusStars).toBe(0);
    });

    it("does not increment streak on multiple activities within the same calendar day", () => {
      const state: StreakState = { current: 3, longest: 5, lastActiveDate: "2026-10-16" };
      const res = calculateUpdatedStreak(state, new Date("2026-10-16T14:30:00Z"), "UTC");

      expect(res.current).toBe(3);
      expect(res.longest).toBe(5);
      expect(res.isSameDay).toBe(true);
      expect(res.isConsecutive).toBe(false);
      expect(res.bonusStars).toBe(0);
    });

    it("increments streak when returning the next consecutive calendar day", () => {
      const state: StreakState = { current: 2, longest: 4, lastActiveDate: "2026-10-15" };
      const res = calculateUpdatedStreak(state, new Date("2026-10-16T08:00:00Z"), "UTC");

      expect(res.current).toBe(3);
      expect(res.longest).toBe(4);
      expect(res.isConsecutive).toBe(true);
      expect(res.isMilestone).toBe(true);
      expect(res.milestoneDays).toBe(3);
      expect(res.bonusStars).toBe(STREAK_MILESTONES[3]); // 5 bonus stars
    });

    it("advances longest streak when current exceeds previous longest", () => {
      const state: StreakState = { current: 6, longest: 6, lastActiveDate: "2026-10-15" };
      const res = calculateUpdatedStreak(state, new Date("2026-10-16T08:00:00Z"), "UTC");

      expect(res.current).toBe(7);
      expect(res.longest).toBe(7);
      expect(res.isMilestone).toBe(true);
      expect(res.milestoneDays).toBe(7);
      expect(res.bonusStars).toBe(15);
    });

    it("resets current streak to 1 after missing a day while preserving longest record", () => {
      const state: StreakState = { current: 5, longest: 12, lastActiveDate: "2026-10-14" };
      const res = calculateUpdatedStreak(state, new Date("2026-10-16T09:00:00Z"), "UTC");

      expect(res.current).toBe(1);
      expect(res.longest).toBe(12);
      expect(res.isSameDay).toBe(false);
      expect(res.isConsecutive).toBe(false);
      expect(res.isMilestone).toBe(false);
      expect(res.bonusStars).toBe(0);
    });
  });

  describe("evaluateRewardRule", () => {
    const defaultRule: CoinRuleEvaluation = {
      ruleCode: "verse_read_star",
      ruleAmount: 2,
      currency: "star",
      dailyCap: 10,
      firstTimeOnly: true,
      minScore: null,
    };

    it("awards full reward when eligible and within daily cap", () => {
      const res = evaluateRewardRule(defaultRule, {
        earnedTodayFromRule: 4,
        hasEarnedForItemBefore: false,
      });

      expect(res.isEligible).toBe(true);
      expect(res.awardedAmount).toBe(2);
      expect(res.dailyCapReached).toBe(false);
      expect(res.currency).toBe("star");
    });

    it("rejects award if first_time_only is true and child already earned for this item", () => {
      const res = evaluateRewardRule(defaultRule, {
        earnedTodayFromRule: 0,
        hasEarnedForItemBefore: true,
      });

      expect(res.isEligible).toBe(false);
      expect(res.awardedAmount).toBe(0);
      expect(res.reason).toContain("already earned");
    });

    it("caps reward when award would exceed dailyCap", () => {
      const res = evaluateRewardRule(defaultRule, {
        earnedTodayFromRule: 9,
        hasEarnedForItemBefore: false,
      });

      expect(res.isEligible).toBe(true);
      expect(res.awardedAmount).toBe(1); // 10 - 9 = 1 remaining
      expect(res.dailyCapReached).toBe(true);
    });

    it("awards zero if dailyCap is already reached", () => {
      const res = evaluateRewardRule(defaultRule, {
        earnedTodayFromRule: 10,
        hasEarnedForItemBefore: false,
      });

      expect(res.isEligible).toBe(false);
      expect(res.awardedAmount).toBe(0);
      expect(res.dailyCapReached).toBe(true);
    });

    it("checks minimum score requirement for quizzes and puzzles", () => {
      const quizRule: CoinRuleEvaluation = {
        ruleCode: "quiz_completed_coins",
        ruleAmount: 5,
        currency: "coin",
        dailyCap: 20,
        firstTimeOnly: false,
        minScore: 75,
      };

      const failRes = evaluateRewardRule(quizRule, {
        earnedTodayFromRule: 0,
        hasEarnedForItemBefore: false,
        activityScore: 50,
      });
      expect(failRes.isEligible).toBe(false);
      expect(failRes.awardedAmount).toBe(0);

      const passRes = evaluateRewardRule(quizRule, {
        earnedTodayFromRule: 0,
        hasEarnedForItemBefore: false,
        activityScore: 100,
      });
      expect(passRes.isEligible).toBe(true);
      expect(passRes.awardedAmount).toBe(5);
    });
  });
});
