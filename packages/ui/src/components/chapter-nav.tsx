"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";

export interface ChapterNavProps {
  bookName: string;
  bookCode: string;
  currentChapter: number;
  totalChapters: number;
  onSelectChapter?: (chapter: number) => void;
  onOpenBookSelector?: () => void;
  className?: string;
}

export function ChapterNav({
  bookName,
  currentChapter,
  totalChapters,
  onSelectChapter,
  onOpenBookSelector,
  className,
}: ChapterNavProps) {
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <div
      role="navigation"
      aria-label="Chapter Navigation"
      className={cn(
        "border-sand-border shadow-card-rest flex items-center justify-between gap-2 rounded-2xl border-2 bg-white p-2 sm:px-4",
        className,
      )}
    >
      {/* Previous Chapter */}
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => hasPrev && onSelectChapter?.(currentChapter - 1)}
        aria-label="Previous Chapter"
        className={cn(
          "bg-sand text-ink focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl transition-all",
          hasPrev ? "hover:bg-sand-border active:scale-95" : "cursor-not-allowed opacity-30",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Book & Chapter Indicator with Selector Trigger */}
      <div className="flex items-center gap-2">
        {onOpenBookSelector ? (
          <button
            type="button"
            onClick={onOpenBookSelector}
            aria-label="Change Bible Book"
            className="bg-sand/60 hover:bg-sand focus-accessible border-sand-border flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-1.5 transition-all active:scale-95"
          >
            <BookOpen className="text-blue-deep h-4 w-4" />
            <span className="font-heading text-ink text-base font-black sm:text-lg">
              {bookName}
            </span>
          </button>
        ) : (
          <span className="font-heading text-ink text-base font-black sm:text-lg">{bookName}</span>
        )}

        {/* Chapter pill */}
        <div className="bg-blue-tint font-heading text-blue-deep flex items-center gap-1 rounded-xl px-3 py-1 text-sm font-black">
          <span>Ch. {currentChapter}</span>
          <span className="text-ink-soft text-xs">/ {totalChapters}</span>
        </div>
      </div>

      {/* Next Chapter */}
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => hasNext && onSelectChapter?.(currentChapter + 1)}
        aria-label="Next Chapter"
        className={cn(
          "bg-sand text-ink focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl transition-all",
          hasNext ? "hover:bg-sand-border active:scale-95" : "cursor-not-allowed opacity-30",
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
