"use client";

import * as React from "react";
import { Sparkles, Volume2, BookOpen } from "lucide-react";
import { MascotLamb } from "./mascot-lamb";
import { cn } from "../lib/utils";

export interface VerseCardProps {
  citation: string;
  text: string;
  meaning: string;
  bookCode?: string;
  chapter?: number;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
  onReadChapter?: () => void;
  isDailyHero?: boolean;
  className?: string;
}

export function VerseCard({
  citation,
  text,
  meaning,
  onPlayAudio,
  isPlaying = false,
  onReadChapter,
  isDailyHero = false,
  className,
}: VerseCardProps) {
  return (
    <article
      className={cn(
        "border-sand-border shadow-card-rest relative flex flex-col gap-5 rounded-3xl border-2 bg-white p-6 transition-all duration-200 sm:p-8",
        isDailyHero && "to-sand/40 border-sand-border bg-gradient-to-b from-white",
        className,
      )}
    >
      {/* Header bar with citation and audio button */}
      <div className="flex items-center justify-between gap-3">
        <div className="bg-blue-tint font-heading text-blue-deep inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold">
          <Sparkles className="text-blue-deep h-3.5 w-3.5" />
          <span>{isDailyHero ? "Verse of the Day" : "Key Scripture"}</span>
        </div>

        {onPlayAudio && (
          <button
            type="button"
            onClick={onPlayAudio}
            aria-label={isPlaying ? "Pause verse narration" : "Listen to verse"}
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

      {/* Scripture Text */}
      <div className="space-y-2">
        <h2 className="font-heading text-ink text-xl font-black tracking-tight sm:text-2xl">
          {citation}
        </h2>
        <blockquote className="text-ink/90 border-yellow border-l-4 py-1 pl-4 font-serif text-base italic leading-relaxed sm:text-lg">
          &ldquo;{text}&rdquo;
        </blockquote>
      </div>

      {/* Lamb Guide Meaning Explanation */}
      <div className="bg-sand/70 border-sand-border flex items-start gap-3.5 rounded-2xl border p-4">
        <div className="shrink-0 pt-0.5">
          <MascotLamb size="sm" mood="happy" />
        </div>
        <div className="space-y-1">
          <span className="font-heading text-orange-deep block text-xs font-black uppercase tracking-wider">
            What this means for you
          </span>
          <p className="font-body text-ink text-sm font-medium leading-relaxed">{meaning}</p>
        </div>
      </div>

      {/* Read Whole Chapter Action */}
      {onReadChapter && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onReadChapter}
            className="bg-sand font-heading text-blue-deep hover:bg-blue-tint focus-accessible border-sand-border inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition-all active:scale-95"
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Whole Chapter</span>
          </button>
        </div>
      )}
    </article>
  );
}
