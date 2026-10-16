import React from "react";
import { cn } from "../lib/utils";
import { Flame } from "lucide-react";

export interface StreakBadgeProps {
  currentStreak: number;
  longestStreak?: number;
  isMilestone?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Renders a child's daily prayer and learning habit streak.
 * Adheres strictly to the project rules:
 * - Flaming heart icon representing holy zeal and dedication
 * - Zero negative or shaming states when current is zero or broken
 * - Calm, uplifting colors with gentle highlight on milestones
 */
export function StreakBadge({
  currentStreak,
  longestStreak,
  isMilestone = false,
  className,
  size = "md",
}: StreakBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const hasActiveStreak = currentStreak > 0;

  return (
    <div
      className={cn(
        "shadow-xs inline-flex select-none items-center rounded-full font-bold transition-transform",
        sizeClasses[size],
        hasActiveStreak
          ? "border border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
          : "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
        isMilestone && "animate-pulse ring-2 ring-amber-400",
        className,
      )}
      aria-label={`Daily habit streak: ${currentStreak} days`}
      title={
        longestStreak
          ? `${currentStreak} day streak (Best: ${longestStreak} days)`
          : `${currentStreak} day streak`
      }
    >
      <Flame
        className={cn(
          iconSizes[size],
          hasActiveStreak
            ? "animate-bounce fill-amber-500 text-amber-600 duration-1000"
            : "fill-slate-300 text-slate-400",
        )}
      />
      <span>
        {currentStreak} {currentStreak === 1 ? "day" : "days"}
      </span>
      {isMilestone && (
        <span className="py-0.2 ml-0.5 rounded-full bg-amber-500 px-1.5 text-[10px] uppercase tracking-wider text-white">
          Milestone
        </span>
      )}
    </div>
  );
}
