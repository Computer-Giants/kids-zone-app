import React from "react";
import { cn } from "../lib/utils";

export interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div
        className={cn(
          "font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-400 text-sm font-bold text-amber-950 shadow-sm",
          className,
        )}
        aria-label="First place rank"
      >
        🥇
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className={cn(
          "font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-sm font-bold text-slate-800 shadow-sm",
          className,
        )}
        aria-label="Second place rank"
      >
        🥈
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className={cn(
          "font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-600/30 bg-amber-700/20 text-sm font-bold text-amber-900 shadow-sm",
          className,
        )}
        aria-label="Third place rank"
      >
        🥉
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-sand font-heading text-ink-soft border-sand-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
        className,
      )}
      aria-label={`Rank ${rank}`}
    >
      #{rank}
    </div>
  );
}
