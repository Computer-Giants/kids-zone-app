import { and, eq, getDb, sql, tables } from "@kidzone/db";
import { activityCompletionSchema, rewardBalanceQuerySchema } from "@kidzone/validators";
import {
  calculateUpdatedStreak,
  evaluateRewardRule,
  getCalendarDateInTimezone,
  type CoinRuleEvaluation,
} from "@kidzone/utils";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const rewards = new Hono()
  /**
   * AC-5: Get balance of stars, coins, and current streak for an authenticated child.
   */
  .get("/balance", zValidator("query", rewardBalanceQuerySchema), async (c) => {
    const { childId } = c.req.valid("query");
    const db = getDb();

    // Query aggregated sums from append-only ledger_entries
    const balances = await db
      .select({
        currency: tables.ledgerEntries.currency,
        total: sql<number>`COALESCE(SUM(${tables.ledgerEntries.amount}), 0)::int`,
      })
      .from(tables.ledgerEntries)
      .where(eq(tables.ledgerEntries.childId, childId))
      .groupBy(tables.ledgerEntries.currency);

    let stars = 0;
    let coins = 0;
    for (const b of balances) {
      if (b.currency === "star") stars = b.total;
      if (b.currency === "coin") coins = b.total;
    }

    // Query streak record
    const [streak] = await db
      .select({
        current: tables.streaks.current,
        longest: tables.streaks.longest,
        lastActiveDate: tables.streaks.lastActiveDate,
      })
      .from(tables.streaks)
      .where(eq(tables.streaks.childId, childId))
      .limit(1);

    return c.json({
      childId,
      stars: Math.max(0, stars),
      coins: Math.max(0, coins),
      streak: {
        current: streak?.current ?? 0,
        longest: streak?.longest ?? 0,
        lastActiveDate: streak?.lastActiveDate ?? null,
      },
    });
  })

  /**
   * AC-1, AC-2, AC-3, AC-4, AC-6, AC-7:
   * Process activity completion, record idempotent activity_event,
   * evaluate coin_rules with daily caps, append ledger_entries, and update streak.
   */
  .post("/activity", zValidator("json", activityCompletionSchema), async (c) => {
    const { childId, type, entityType, entityId, score, idempotencyKey, metadata } =
      c.req.valid("json");

    // Unauthenticated guest explorer: no server database mutations
    if (!childId) {
      return c.json({
        success: true,
        guest: true,
        starsEarned: type === "puzzle_completed" ? 2 : 1,
        coinsEarned: 0,
        isFirstTime: true,
        dailyCapReached: false,
        streak: {
          current: 1,
          longest: 1,
          isMilestone: false,
          bonusStars: 0,
        },
        newBalances: {
          stars: 2,
          coins: 0,
        },
        message: "Activity completed. Progress saved locally on device.",
      });
    }

    const db = getDb();

    // 1. Idempotency Check: check if event already recorded
    const existingEvents = await db
      .select({ id: tables.activityEvents.id })
      .from(tables.activityEvents)
      .where(
        and(
          eq(tables.activityEvents.childId, childId),
          eq(tables.activityEvents.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1);

    if (existingEvents.length > 0) {
      // Re-fetch current balances
      const balances = await db
        .select({
          currency: tables.ledgerEntries.currency,
          total: sql<number>`COALESCE(SUM(${tables.ledgerEntries.amount}), 0)::int`,
        })
        .from(tables.ledgerEntries)
        .where(eq(tables.ledgerEntries.childId, childId))
        .groupBy(tables.ledgerEntries.currency);

      let stars = 0;
      let coins = 0;
      for (const b of balances) {
        if (b.currency === "star") stars = b.total;
        if (b.currency === "coin") coins = b.total;
      }

      const [existingStreak] = await db
        .select()
        .from(tables.streaks)
        .where(eq(tables.streaks.childId, childId))
        .limit(1);

      return c.json({
        success: true,
        guest: false,
        starsEarned: 0,
        coinsEarned: 0,
        isFirstTime: false,
        dailyCapReached: false,
        duplicate: true,
        streak: {
          current: existingStreak?.current ?? 0,
          longest: existingStreak?.longest ?? 0,
          isMilestone: false,
          bonusStars: 0,
        },
        newBalances: {
          stars: Math.max(0, stars),
          coins: Math.max(0, coins),
        },
        message: "Event already recorded with this idempotency key.",
      });
    }

    // 2. Fetch Household Timezone for streak calendar calculations
    const [childRecord] = await db
      .select({
        householdId: tables.children.householdId,
        timezone: tables.households.timezone,
      })
      .from(tables.children)
      .innerJoin(tables.households, eq(tables.children.householdId, tables.households.id))
      .where(eq(tables.children.id, childId))
      .limit(1);

    const timezone = childRecord?.timezone ?? "UTC";
    const serverNow = new Date();
    const todayStr = getCalendarDateInTimezone(serverNow, timezone);

    // 3. Insert Activity Event
    const [newEvent] = await db
      .insert(tables.activityEvents)
      .values({
        childId,
        type,
        entityType: entityType ?? null,
        entityId: entityId ? (entityId as string) : null,
        score: score ?? null,
        idempotencyKey,
        metadata: metadata ?? {},
      })
      .returning({ id: tables.activityEvents.id });

    // 4. Update Child Progress if entity details are provided
    if (entityType && entityId) {
      await db
        .insert(tables.childProgress)
        .values({
          childId,
          entityType,
          entityId,
          status: "completed",
          bestScore: score ?? null,
          attempts: 1,
          firstCompletedAt: serverNow,
          lastActivityAt: serverNow,
        })
        .onConflictDoUpdate({
          target: [
            tables.childProgress.childId,
            tables.childProgress.entityType,
            tables.childProgress.entityId,
          ],
          set: {
            status: "completed",
            bestScore: sql`GREATEST(${tables.childProgress.bestScore}, ${score ?? null})`,
            attempts: sql`${tables.childProgress.attempts} + 1`,
            lastActivityAt: serverNow,
          },
        });
    }

    // 5. Evaluate Matching Coin Rules
    const matchingRules = await db
      .select()
      .from(tables.coinRules)
      .where(and(eq(tables.coinRules.activityType, type), eq(tables.coinRules.isActive, true)));

    let totalStarsEarned = 0;
    let totalCoinsEarned = 0;
    let anyDailyCapReached = false;
    let isFirstTimeAward = true;

    for (const rule of matchingRules) {
      // Calculate earnings from this rule for today in household timezone
      const [todaySum] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${tables.ledgerEntries.amount}), 0)::int`,
        })
        .from(tables.ledgerEntries)
        .where(
          and(
            eq(tables.ledgerEntries.childId, childId),
            eq(tables.ledgerEntries.ruleId, rule.id),
            sql`DATE(${tables.ledgerEntries.createdAt} AT TIME ZONE ${timezone}) = ${todayStr}::date`,
          ),
        );

      const earnedToday = todaySum?.total ?? 0;

      // Check if earned for this specific content item before
      let hasEarnedForItem = false;
      if (rule.firstTimeOnly && entityId) {
        const [priorItemLedger] = await db
          .select({ id: tables.ledgerEntries.id })
          .from(tables.ledgerEntries)
          .where(
            and(
              eq(tables.ledgerEntries.childId, childId),
              eq(tables.ledgerEntries.ruleId, rule.id),
              eq(tables.ledgerEntries.entityId, entityId),
            ),
          )
          .limit(1);

        hasEarnedForItem = Boolean(priorItemLedger);
      }

      const ruleEval: CoinRuleEvaluation = {
        ruleCode: rule.code,
        ruleAmount: rule.amount,
        currency: rule.currency,
        dailyCap: rule.dailyCap,
        firstTimeOnly: rule.firstTimeOnly,
        minScore: rule.minScore,
      };

      const evaluation = evaluateRewardRule(ruleEval, {
        earnedTodayFromRule: earnedToday,
        hasEarnedForItemBefore: hasEarnedForItem,
        activityScore: score,
      });

      if (evaluation.dailyCapReached) {
        anyDailyCapReached = true;
      }

      if (evaluation.isEligible && evaluation.awardedAmount > 0) {
        // Append immutable ledger row
        await db.insert(tables.ledgerEntries).values({
          childId,
          currency: evaluation.currency,
          amount: evaluation.awardedAmount,
          reason: evaluation.reason,
          eventId: newEvent?.id,
          ruleId: rule.id,
          entityType: entityType ?? null,
          entityId: entityId ?? null,
        });

        if (evaluation.currency === "star") {
          totalStarsEarned += evaluation.awardedAmount;
        } else {
          totalCoinsEarned += evaluation.awardedAmount;
        }
      } else if (hasEarnedForItem) {
        isFirstTimeAward = false;
      }
    }

    // 6. Calculate Habit Streak
    const [currentStreakRecord] = await db
      .select({
        current: tables.streaks.current,
        longest: tables.streaks.longest,
        lastActiveDate: tables.streaks.lastActiveDate,
      })
      .from(tables.streaks)
      .where(eq(tables.streaks.childId, childId))
      .limit(1);

    const streakState = {
      current: currentStreakRecord?.current ?? 0,
      longest: currentStreakRecord?.longest ?? 0,
      lastActiveDate: currentStreakRecord?.lastActiveDate ?? null,
    };

    const updatedStreak = calculateUpdatedStreak(streakState, serverNow, timezone);

    // Save updated streak
    await db
      .insert(tables.streaks)
      .values({
        childId,
        current: updatedStreak.current,
        longest: updatedStreak.longest,
        lastActiveDate: updatedStreak.newActiveDate,
        updatedAt: serverNow,
      })
      .onConflictDoUpdate({
        target: tables.streaks.childId,
        set: {
          current: updatedStreak.current,
          longest: updatedStreak.longest,
          lastActiveDate: updatedStreak.newActiveDate,
          updatedAt: serverNow,
        },
      });

    // Milestone bonus stars
    if (updatedStreak.isMilestone && updatedStreak.bonusStars > 0) {
      await db.insert(tables.ledgerEntries).values({
        childId,
        currency: "star",
        amount: updatedStreak.bonusStars,
        reason: `Streak milestone bonus: ${updatedStreak.current} days of faithful learning!`,
        eventId: newEvent?.id,
      });
      totalStarsEarned += updatedStreak.bonusStars;
    }

    // 7. Get Final Balances
    const finalBalances = await db
      .select({
        currency: tables.ledgerEntries.currency,
        total: sql<number>`COALESCE(SUM(${tables.ledgerEntries.amount}), 0)::int`,
      })
      .from(tables.ledgerEntries)
      .where(eq(tables.ledgerEntries.childId, childId))
      .groupBy(tables.ledgerEntries.currency);

    let finalStars = 0;
    let finalCoins = 0;
    for (const b of finalBalances) {
      if (b.currency === "star") finalStars = b.total;
      if (b.currency === "coin") finalCoins = b.total;
    }

    return c.json({
      success: true,
      guest: false,
      starsEarned: totalStarsEarned,
      coinsEarned: totalCoinsEarned,
      isFirstTime: isFirstTimeAward,
      dailyCapReached: anyDailyCapReached,
      streak: {
        current: updatedStreak.current,
        longest: updatedStreak.longest,
        isMilestone: updatedStreak.isMilestone,
        milestoneDays: updatedStreak.milestoneDays,
        bonusStars: updatedStreak.bonusStars,
      },
      newBalances: {
        stars: Math.max(0, finalStars),
        coins: Math.max(0, finalCoins),
      },
      message: "Activity event recorded and rewards applied.",
    });
  });
