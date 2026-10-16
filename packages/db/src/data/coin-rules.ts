import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { coinRules } from "../schema/progress";

export interface SeedCoinRule {
  code: string;
  activityType:
    | "daily_open"
    | "verse_read"
    | "story_read"
    | "saint_viewed"
    | "prayer_prayed"
    | "lesson_completed"
    | "quiz_completed"
    | "puzzle_completed";
  currency: "star" | "coin";
  amount: number;
  minScore: number | null;
  firstTimeOnly: boolean;
  dailyCap: number | null;
}

export const DEFAULT_COIN_RULES: SeedCoinRule[] = [
  {
    code: "daily_open_streak_coin",
    activityType: "daily_open",
    currency: "coin",
    amount: 5,
    minScore: null,
    firstTimeOnly: false,
    dailyCap: 5,
  },
  {
    code: "verse_read_star",
    activityType: "verse_read",
    currency: "star",
    amount: 1,
    minScore: null,
    firstTimeOnly: true,
    dailyCap: 10,
  },
  {
    code: "story_read_star",
    activityType: "story_read",
    currency: "star",
    amount: 2,
    minScore: null,
    firstTimeOnly: true,
    dailyCap: 10,
  },
  {
    code: "saint_viewed_star",
    activityType: "saint_viewed",
    currency: "star",
    amount: 1,
    minScore: null,
    firstTimeOnly: true,
    dailyCap: 5,
  },
  {
    code: "prayer_prayed_coin",
    activityType: "prayer_prayed",
    currency: "coin",
    amount: 2,
    minScore: null,
    firstTimeOnly: false,
    dailyCap: 10,
  },
  {
    code: "lesson_completed_star",
    activityType: "lesson_completed",
    currency: "star",
    amount: 3,
    minScore: null,
    firstTimeOnly: true,
    dailyCap: 15,
  },
  {
    code: "quiz_completed_star",
    activityType: "quiz_completed",
    currency: "star",
    amount: 2,
    minScore: 75,
    firstTimeOnly: false,
    dailyCap: 10,
  },
  {
    code: "quiz_completed_coin",
    activityType: "quiz_completed",
    currency: "coin",
    amount: 3,
    minScore: 75,
    firstTimeOnly: false,
    dailyCap: 15,
  },
  {
    code: "puzzle_completed_star",
    activityType: "puzzle_completed",
    currency: "star",
    amount: 2,
    minScore: 100,
    firstTimeOnly: false,
    dailyCap: 10,
  },
];

/**
 * Idempotently seeds default earning rules into coin_rules table.
 */
export async function seedCoinRules() {
  const db = getDb();
  for (const rule of DEFAULT_COIN_RULES) {
    const [existing] = await db
      .select({ id: coinRules.id })
      .from(coinRules)
      .where(eq(coinRules.code, rule.code))
      .limit(1);

    if (!existing) {
      await db.insert(coinRules).values({
        code: rule.code,
        activityType: rule.activityType,
        currency: rule.currency,
        amount: rule.amount,
        minScore: rule.minScore,
        firstTimeOnly: rule.firstTimeOnly,
        dailyCap: rule.dailyCap,
        isActive: true,
      });
    }
  }
}
