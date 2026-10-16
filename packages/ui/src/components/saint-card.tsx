"use client";

import * as React from "react";
import { ArrowRight, Calendar, HeartHandshake, Sparkles, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";
import { PatronageBadge } from "./patronage-badge";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface SaintCardProps {
  slug: string;
  name: string;
  title?: string;
  tagline: string;
  feastMonth: number;
  feastDay: number;
  eraLabel: string;
  patronages: string[];
  isDailyHero?: boolean;
  onSelect?: () => void;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
  className?: string;
}

export function SaintCard({
  slug,
  name,
  title = "St.",
  tagline,
  feastMonth,
  feastDay,
  eraLabel,
  patronages,
  isDailyHero = false,
  onSelect,
  onPlayAudio,
  isPlaying = false,
  className,
}: SaintCardProps) {
  const monthName = MONTH_NAMES[feastMonth - 1] ?? "";
  const feastFormatted = monthName
    ? `${monthName} ${feastDay}`
    : `Feast: ${feastMonth}/${feastDay}`;

  return (
    <article
      data-saint-slug={slug}
      className={cn(
        "border-sand-border shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 sm:p-7",
        isDailyHero &&
          "via-sand/20 to-yellow-tint/30 border-yellow/60 shadow-sticker-yellow bg-gradient-to-b from-white",
        className,
      )}
    >
      <div>
        {/* Top Badges: Feast Day and Daily Hero indicator */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isDailyHero && (
              <span className="bg-orange font-heading shadow-sticker-orange inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black text-white">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Saint of the Day</span>
              </span>
            )}
            <span className="bg-sand font-heading text-ink/80 border-sand-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
              <Calendar className="text-blue-deep h-3.5 w-3.5" />
              <span>{feastFormatted}</span>
            </span>
          </div>

          {onPlayAudio && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayAudio();
              }}
              aria-label={isPlaying ? `Pause narration for ${name}` : `Listen to story of ${name}`}
              className={cn(
                "focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full transition-all active:scale-90",
                isPlaying
                  ? "bg-blue-deep shadow-sticker-blue animate-pulse text-white"
                  : "bg-blue-tint text-blue-deep hover:bg-blue hover:text-white",
              )}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Saint Portrait Placeholder & Name */}
        <div className="mb-3 flex items-start gap-4">
          <div className="from-yellow-tint to-yellow/40 border-yellow/50 text-yellow-deep flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 bg-gradient-to-br shadow-sm">
            <HeartHandshake className="h-7 w-7" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="font-heading text-blue-deep/70 text-xs font-black uppercase tracking-wider">
              {title} {eraLabel}
            </div>
            <h3 className="font-heading text-ink truncate text-xl font-black tracking-tight sm:text-2xl">
              {name}
            </h3>
          </div>
        </div>

        {/* Tagline */}
        <p className="font-body text-ink/85 mb-4 line-clamp-2 text-sm font-medium leading-relaxed">
          {tagline}
        </p>

        {/* Patronage Pills */}
        {patronages.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {patronages.slice(0, 3).map((patronage) => (
              <PatronageBadge
                key={patronage}
                label={patronage.charAt(0).toUpperCase() + patronage.slice(1)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {onSelect && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onSelect}
            className={cn(
              "font-heading focus-accessible inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-all active:scale-95",
              isDailyHero
                ? "bg-orange hover:bg-orange-deep shadow-sticker-orange text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border",
            )}
          >
            <span>Read Life Story</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </article>
  );
}
