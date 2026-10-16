/**
 * Pure functions for rewards ledger, daily caps, and habit streak calculations.
 * Adheres strictly to the project rule:
 * "The server's clock decides what counts, never the device's."
 * Day boundaries use households.timezone.
 */

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface StreakUpdateResult {
  current: number;
  longest: number;
  newActiveDate: string;
  isSameDay: boolean;
  isConsecutive: boolean;
  isMilestone: boolean;
  milestoneDays?: number;
  bonusStars: number;
}

/** Streak milestones awarding spiritual habit bonus stars. */
export const STREAK_MILESTONES: Record<number, number> = {
  3: 5,
  7: 15,
  14: 25,
  30: 50,
  100: 100,
};

/**
 * Returns today's calendar date string (YYYY-MM-DD) in the specified timezone.
 * Defaults to UTC if the timezone is invalid or unspecified.
 */
export function getCalendarDateInTimezone(
  date: Date = new Date(),
  timezone: string = "UTC",
): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Calculates the difference in calendar days between two YYYY-MM-DD date strings.
 */
export function getDayDifference(dateStrA: string, dateStrB: string): number {
  const partsA = dateStrA.split("-").map(Number);
  const partsB = dateStrB.split("-").map(Number);
  const y1 = partsA[0] ?? 1970;
  const m1 = partsA[1] ?? 1;
  const d1 = partsA[2] ?? 1;
  const y2 = partsB[0] ?? 1970;
  const m2 = partsB[1] ?? 1;
  const d2 = partsB[2] ?? 1;
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Pure function that calculates updated streak counters for an authenticated child.
 * Handles same day actions (no change), consecutive day actions (+1), and breaks (resets current to 1).
 */
export function calculateUpdatedStreak(
  currentStreak: StreakState,
  serverDate: Date = new Date(),
  timezone: string = "UTC",
): StreakUpdateResult {
  const todayStr = getCalendarDateInTimezone(serverDate, timezone);

  // If child has never logged an active day before
  if (!currentStreak.lastActiveDate) {
    return {
      current: 1,
      longest: Math.max(1, currentStreak.longest),
      newActiveDate: todayStr,
      isSameDay: false,
      isConsecutive: false,
      isMilestone: false,
      bonusStars: 0,
    };
  }

  const diff = getDayDifference(currentStreak.lastActiveDate, todayStr);

  // Already logged activity today in this household timezone
  if (diff === 0) {
    return {
      current: currentStreak.current,
      longest: currentStreak.longest,
      newActiveDate: todayStr,
      isSameDay: true,
      isConsecutive: false,
      isMilestone: false,
      bonusStars: 0,
    };
  }

  // Exactly one day elapsed: streak continues
  if (diff === 1) {
    const nextCurrent = currentStreak.current + 1;
    const nextLongest = Math.max(nextCurrent, currentStreak.longest);
    const bonus = STREAK_MILESTONES[nextCurrent] ?? 0;

    return {
      current: nextCurrent,
      longest: nextLongest,
      newActiveDate: todayStr,
      isSameDay: false,
      isConsecutive: true,
      isMilestone: bonus > 0,
      milestoneDays: bonus > 0 ? nextCurrent : undefined,
      bonusStars: bonus,
    };
  }

  // More than one day elapsed: streak reset to 1 (preserving longest)
  return {
    current: 1,
    longest: currentStreak.longest,
    newActiveDate: todayStr,
    isSameDay: false,
    isConsecutive: false,
    isMilestone: false,
    bonusStars: 0,
  };
}

export interface CoinRuleEvaluation {
  ruleCode: string;
  ruleAmount: number;
  currency: "star" | "coin";
  dailyCap: number | null;
  firstTimeOnly: boolean;
  minScore: number | null;
}

export interface ActivityRewardContext {
  earnedTodayFromRule: number;
  hasEarnedForItemBefore: boolean;
  activityScore?: number;
}

export interface EvaluatedReward {
  awardedAmount: number;
  currency: "star" | "coin";
  dailyCapReached: boolean;
  isEligible: boolean;
  reason: string;
}

/**
 * Pure function evaluating whether an activity qualifies for a coin or star rule award,
 * enforcing score thresholds, first time only restrictions, and daily caps.
 */
export function evaluateRewardRule(
  rule: CoinRuleEvaluation,
  context: ActivityRewardContext,
): EvaluatedReward {
  // Check score requirement if specified
  if (rule.minScore !== null && (context.activityScore ?? 0) < rule.minScore) {
    return {
      awardedAmount: 0,
      currency: rule.currency,
      dailyCapReached: false,
      isEligible: false,
      reason: `Score of ${context.activityScore ?? 0} did not meet minimum threshold of ${rule.minScore}`,
    };
  }

  // Check first time only condition
  if (rule.firstTimeOnly && context.hasEarnedForItemBefore) {
    return {
      awardedAmount: 0,
      currency: rule.currency,
      dailyCapReached: false,
      isEligible: false,
      reason: "Reward already earned for this content item",
    };
  }

  // Check daily cap
  if (rule.dailyCap !== null) {
    const remainingCap = Math.max(0, rule.dailyCap - context.earnedTodayFromRule);
    if (remainingCap <= 0) {
      return {
        awardedAmount: 0,
        currency: rule.currency,
        dailyCapReached: true,
        isEligible: false,
        reason: `Daily cap of ${rule.dailyCap} already reached for this activity`,
      };
    }

    const award = Math.min(rule.ruleAmount, remainingCap);
    return {
      awardedAmount: award,
      currency: rule.currency,
      dailyCapReached:
        award < rule.ruleAmount || context.earnedTodayFromRule + award >= rule.dailyCap,
      isEligible: true,
      reason: `Earned ${award} ${rule.currency}s`,
    };
  }

  return {
    awardedAmount: rule.ruleAmount,
    currency: rule.currency,
    dailyCapReached: false,
    isEligible: true,
    reason: `Earned ${rule.ruleAmount} ${rule.currency}s`,
  };
}
