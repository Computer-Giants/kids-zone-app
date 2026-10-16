"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export interface QuizOptionButtonProps {
  id: string;
  position: number;
  text: string;
  isSelected?: boolean;
  isCorrect?: boolean | null;
  showResult?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function QuizOptionButton({
  position,
  text,
  isSelected = false,
  isCorrect = null,
  showResult = false,
  disabled = false,
  onClick,
  className,
}: QuizOptionButtonProps) {
  // Option letter prefix: A, B, C, D
  const letter = String.fromCharCode(64 + position);

  let stateStyles =
    "bg-white border-sand-border text-ink hover:bg-sand/40 hover:border-sand-border/80";

  if (showResult) {
    if (isCorrect === true) {
      // Correct: Warm soft green celebration
      stateStyles = "bg-green-tint border-green text-ink shadow-sticker-green";
    } else if (isSelected && isCorrect === false) {
      // Gentle, non-shaming neutral/amber notice (NEVER red!)
      stateStyles = "bg-sand/60 border-yellow text-ink shadow-sm";
    }
  } else if (isSelected) {
    stateStyles = "bg-blue-tint border-blue text-blue-deep shadow-sticker-blue";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={cn(
        "focus-accessible group relative flex min-h-[52px] w-full items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed",
        stateStyles,
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span
          className={cn(
            "font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all",
            showResult && isCorrect === true
              ? "bg-green text-white"
              : isSelected
                ? "bg-blue-deep text-white"
                : "bg-sand text-ink/70 group-hover:bg-sand-border",
          )}
        >
          {showResult && isCorrect === true ? <Check className="h-4 w-4" /> : letter}
        </span>

        <span className="font-body text-ink text-base font-semibold leading-snug">{text}</span>
      </div>

      {showResult && isCorrect === true && (
        <span className="bg-green/20 font-heading text-green-deep inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Correct!</span>
        </span>
      )}
    </button>
  );
}
