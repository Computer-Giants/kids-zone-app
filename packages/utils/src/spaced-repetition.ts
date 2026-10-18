/**
 * Pure functions for spaced repetition question intervals and leaderboard week calculations.
 * Satisfies AC-1, AC-4, AC-6, AC-7 in spec 0013.
 */

export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

export interface ReviewScheduleResult {
  nextIntervalDays: number;
  newStreak: number;
  dueAt: Date;
}

/**
 * Calculates the next review date and interval based on spaced repetition.
 * Correct answers progress along [1, 3, 7, 14, 30] days.
 * Incorrect answers reset interval to 1 day without penalty.
 */
export function calculateNextReview(
  currentStreak: number,
  isCorrect: boolean,
  referenceDate: Date = new Date(),
): ReviewScheduleResult {
  if (!isCorrect) {
    const dueAt = new Date(referenceDate.getTime() + 1 * 24 * 60 * 60 * 1000);
    return {
      nextIntervalDays: 1,
      newStreak: 0,
      dueAt,
    };
  }

  const newStreak = Math.max(0, currentStreak) + 1;
  const index = Math.min(newStreak - 1, REVIEW_INTERVAL_DAYS.length - 1);
  const nextIntervalDays = REVIEW_INTERVAL_DAYS[index] ?? 30;

  const dueAt = new Date(referenceDate.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  return {
    nextIntervalDays,
    newStreak,
    dueAt,
  };
}

/**
 * Returns the Monday YYYY-MM-DD date string for the week containing the given date in UTC.
 * ISO weeks start on Monday (00:00 UTC).
 */
export function getMondayOfWeek(referenceDate: Date = new Date()): string {
  const d = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );
  const day = d.getUTCDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dateNum = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${dateNum}`;
}
