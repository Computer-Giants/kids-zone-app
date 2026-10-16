"use client";

import * as React from "react";
import { ArrowRight, Grid, Sparkles, SpellCheck } from "lucide-react";
import { cn } from "../lib/utils";

export interface PuzzleCardProps {
  slug: string;
  title: string;
  instructions: string;
  type: "matching" | "word_search" | "scramble";
  difficulty: 1 | 2 | 3;
  category: "church" | "saints" | "bible" | "catechism";
  themeTag: string;
  minAge: number;
  maxAge: number;
  onSelect: () => void;
  className?: string;
}

export function PuzzleCard({
  slug,
  title,
  instructions,
  type,
  difficulty,
  themeTag,
  minAge,
  maxAge,
  onSelect,
  className,
}: PuzzleCardProps) {
  const getTypeBadge = () => {
    switch (type) {
      case "matching":
        return {
          label: "Tile Match",
          icon: <Grid className="h-4 w-4" />,
          badgeStyle: "bg-blue-tint text-blue-deep",
        };
      case "word_search":
        return {
          label: "Word Search",
          icon: <SpellCheck className="h-4 w-4" />,
          badgeStyle: "bg-green-tint text-green-deep",
        };
      case "scramble":
        return {
          label: "Word Scramble",
          icon: <Sparkles className="h-4 w-4" />,
          badgeStyle: "bg-yellow-tint text-yellow-deep",
        };
    }
  };

  const { label, icon, badgeStyle } = getTypeBadge();

  return (
    <article
      data-puzzle-slug={slug}
      className={cn(
        "border-sand-border shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      <div>
        {/* Top Badges */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-heading inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold",
                badgeStyle,
              )}
            >
              {icon}
              <span>{label}</span>
            </span>

            <span className="bg-sand font-heading text-ink-soft border-sand-border inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold">
              <span>{themeTag}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="bg-sand font-heading text-ink-soft border-sand-border rounded-full border px-2.5 py-1 text-xs font-bold">
              Ages {minAge} to {maxAge}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading text-ink group-hover:text-blue-deep mb-2 text-xl font-black tracking-tight transition-colors">
          {title}
        </h3>

        {/* Instructions */}
        <p className="font-body text-ink-soft mb-5 line-clamp-3 text-sm font-medium leading-relaxed">
          {instructions}
        </p>
      </div>

      {/* Footer and Play Action */}
      <div className="border-sand-border/70 flex items-center justify-between gap-3 border-t pt-3">
        <div className="flex items-center gap-1">
          <span className="font-heading text-ink-soft text-xs font-bold">Difficulty:</span>
          <div className="flex gap-1" aria-label={`Difficulty ${difficulty} of 3`}>
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={cn(
                  "h-2 w-2 rounded-full",
                  level <= difficulty ? "bg-orange" : "bg-sand-border",
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onSelect}
          className="bg-orange font-heading hover:bg-orange-deep focus-accessible shadow-sticker-orange inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black text-white transition-all active:scale-95 sm:text-sm"
        >
          <span>Play Puzzle</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
