import React from "react";
import { cn } from "../lib/utils";
import { MascotLamb } from "./mascot-lamb";
import { Button } from "./button";

export interface DailyReviewCardProps {
  dueCount: number;
  onStartReview: () => void;
  isCompletedToday?: boolean;
  className?: string;
}

export function DailyReviewCard({
  dueCount,
  onStartReview,
  isCompletedToday = false,
  className,
}: DailyReviewCardProps) {
  if (isCompletedToday) {
    return (
      <div
        className={cn(
          "border-green-deep/20 bg-green-tint/40 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center",
          className,
        )}
      >
        <div className="flex items-center gap-4">
          <MascotLamb size="sm" mood="happy" />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-green-deep rounded-full px-2.5 py-0.5 text-xs font-bold text-white">
                Completed Today ⭐
              </span>
            </div>
            <h3 className="font-heading text-ink mt-1 text-lg font-bold">Faith Warmup Complete!</h3>
            <p className="text-ink-soft text-xs">
              You reviewed your holy lessons today. Great job keeping God's word close to heart!
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onStartReview}
          className="shrink-0"
        >
          Review Again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-orange/30 bg-orange-tint/40 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <MascotLamb size="sm" mood="encouraging" />
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange rounded-full px-2.5 py-0.5 text-xs font-bold text-white">
              Daily Faith Warmup
            </span>
            <span className="text-ink-soft text-xs font-bold">
              {dueCount} {dueCount === 1 ? "question" : "questions"} ready
            </span>
          </div>
          <h3 className="font-heading text-ink mt-1 text-lg font-bold">
            Remember God's Holy Truths
          </h3>
          <p className="text-ink-soft text-xs">
            A quick 3-minute review round to grow strong in Bible knowledge and saint wisdom.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={onStartReview}
        className="min-w-[140px] shrink-0"
      >
        Start Review
      </Button>
    </div>
  );
}
