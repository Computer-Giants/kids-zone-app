import React from "react";
import { cn } from "../lib/utils";
import { Coins, Star } from "lucide-react";
import { StreakBadge } from "./streak-badge";

export interface RewardSummaryBarProps {
  stars: number;
  coins?: number;
  streakDays: number;
  longestStreak?: number;
  isMilestone?: boolean;
  className?: string;
}

/**
 * Compact dashboard bar displaying a child's stars, coins, and daily streak.
 * - Stars: spiritual progress, permanent, never spent
 * - Coins: spendable
 * - Streak: daily prayer & learning habit
 */
export function RewardSummaryBar({
  stars,
  coins = 0,
  streakDays,
  longestStreak,
  isMilestone = false,
  className,
}: RewardSummaryBarProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xs shadow-xs flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-2 sm:gap-3 dark:border-slate-800 dark:bg-slate-900/90",
        className,
      )}
      role="region"
      aria-label="Rewards and habit progress"
    >
      {/* Stars Badge */}
      <div
        className="flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200"
        title="Spiritual progress stars earned"
      >
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
        <span>{stars} Stars</span>
      </div>

      {/* Coins Badge */}
      <div
        className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        title="Coins available to spend"
      >
        <Coins className="h-4 w-4 fill-amber-500 text-amber-600" />
        <span>{coins} Coins</span>
      </div>

      {/* Streak Badge */}
      <StreakBadge
        currentStreak={streakDays}
        longestStreak={longestStreak}
        isMilestone={isMilestone}
        size="md"
      />
    </div>
  );
}
