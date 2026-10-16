"use client";

import * as React from "react";
import { Delete, HelpCircle, RotateCcw } from "lucide-react";
import { cn } from "../lib/utils";

export interface WordScrambleConfigData {
  scrambled: string;
  targetWord: string;
  clue: string;
  letterBank: string[];
  funFact?: string;
}

export interface WordScrambleBoardProps {
  config: WordScrambleConfigData;
  onComplete: () => void;
  className?: string;
}

interface PlacedLetter {
  id: string;
  letter: string;
  originalIndex: number;
}

export function WordScrambleBoard({ config, onComplete, className }: WordScrambleBoardProps) {
  const { targetWord, clue, letterBank, funFact } = config;

  // Track which indices in the original letterBank have been used
  const [placedLetters, setPlacedLetters] = React.useState<PlacedLetter[]>([]);
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);

  // Remaining available letter chips
  const usedIndices = new Set(placedLetters.map((p) => p.originalIndex));

  // Current spelled string
  const currentWord = placedLetters.map((p) => p.letter).join("");

  // Check completion
  React.useEffect(() => {
    if (placedLetters.length === targetWord.length) {
      if (currentWord.toUpperCase() === targetWord.toUpperCase()) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    } else {
      setIsCompleted(false);
    }
  }, [placedLetters, currentWord, targetWord, onComplete]);

  // Handle tapping an available letter chip to place it
  const handleSelectLetter = (letter: string, originalIndex: number) => {
    if (placedLetters.length >= targetWord.length) return;
    if (usedIndices.has(originalIndex)) return;

    setPlacedLetters((prev) => [
      ...prev,
      { id: `${letter}-${originalIndex}-${Date.now()}`, letter, originalIndex },
    ]);
  };

  // Handle removing a placed letter
  const handleRemoveLetter = (indexToRemove: number) => {
    setPlacedLetters((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Backspace control
  const handleBackspace = () => {
    setPlacedLetters((prev) => prev.slice(0, -1));
  };

  // AC-6: Gentle Lamb Hint (places the next correct letter in position)
  const handleAskHint = () => {
    if (placedLetters.length >= targetWord.length) return;

    const nextIndex = placedLetters.length;
    const neededLetter = targetWord[nextIndex]!.toUpperCase();

    // Find an unused index in letterBank matching neededLetter
    const availableIndex = letterBank.findIndex(
      (letter: string, idx: number) =>
        letter.toUpperCase() === neededLetter && !usedIndices.has(idx),
    );

    if (availableIndex !== -1) {
      setPlacedLetters((prev) => [
        ...prev,
        {
          id: `${neededLetter}-${availableIndex}-${Date.now()}`,
          letter: neededLetter,
          originalIndex: availableIndex,
        },
      ]);
    }
  };

  const handleReset = () => {
    setPlacedLetters([]);
    setIsCompleted(false);
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Top Toolbar */}
      <div className="flex w-full max-w-md items-center justify-between gap-3 px-2">
        <div className="bg-sand border-sand-border font-heading text-ink-soft rounded-full border px-4 py-1.5 text-xs font-bold sm:text-sm">
          Letters: <span className="text-ink font-extrabold">{placedLetters.length}</span> /{" "}
          {targetWord.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAskHint}
            disabled={isCompleted || placedLetters.length >= targetWord.length}
            className="bg-yellow-tint border-yellow-deep text-yellow-deep font-heading hover:bg-yellow-tint/80 focus-accessible shadow-sticker-yellow inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border px-3.5 py-1.5 text-xs font-black transition-all active:scale-95 disabled:opacity-50"
            aria-label="Ask the Lamb for a hint"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Lamb for</span> Hint
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-sand border-sand-border text-ink-soft hover:text-ink focus-accessible inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
            aria-label="Restart word scramble"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Clue Card */}
      <div className="border-sand-border bg-sand/60 w-full max-w-md rounded-2xl border p-4 text-center">
        <span className="text-orange font-heading text-xs font-black uppercase tracking-wider">
          Clue:
        </span>
        <p className="font-body text-ink mt-1 text-sm font-semibold leading-relaxed sm:text-base">
          &ldquo;{clue}&rdquo;
        </p>
      </div>

      {/* Word Answer Slots */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label="Spelled word slots"
      >
        {Array.from({ length: targetWord.length }).map((_, index) => {
          const placed = placedLetters[index];

          return (
            <button
              key={`slot-${index}`}
              type="button"
              onClick={() => placed && handleRemoveLetter(index)}
              disabled={!placed}
              className={cn(
                "font-heading focus-accessible flex h-12 w-12 select-none items-center justify-center rounded-2xl border-2 text-xl font-black transition-all sm:h-14 sm:w-14 sm:text-2xl",
                placed
                  ? isCompleted
                    ? "border-green bg-green-tint text-green-deep shadow-sticker-green scale-105"
                    : "border-blue bg-blue-tint text-blue-deep shadow-sticker-blue cursor-pointer hover:scale-95"
                  : "border-sand-border text-ink-soft border-dashed bg-white",
              )}
              aria-label={
                placed
                  ? `Placed letter ${placed.letter} at position ${index + 1}. Tap to remove.`
                  : `Empty letter slot ${index + 1}`
              }
            >
              {placed ? placed.letter : "_"}
            </button>
          );
        })}
      </div>

      {/* Available Letter Chips */}
      <div className="flex flex-col items-center gap-3">
        <span className="font-heading text-ink-soft text-xs font-extrabold uppercase tracking-wide">
          Tap Letters to Spell:
        </span>

        <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
          {letterBank.map((letter: string, index: number) => {
            const isUsed = usedIndices.has(index);

            return (
              <button
                key={`chip-${index}-${letter}`}
                type="button"
                onClick={() => handleSelectLetter(letter, index)}
                disabled={isUsed}
                className={cn(
                  "font-heading focus-accessible flex h-12 w-12 select-none items-center justify-center rounded-2xl border-2 text-lg font-black transition-all active:scale-95 sm:h-14 sm:w-14 sm:text-xl",
                  isUsed
                    ? "border-sand-border bg-sand/30 text-ink-soft/40 scale-90 cursor-not-allowed opacity-40"
                    : "border-sand-border text-ink shadow-card-rest hover:shadow-card-hover bg-white hover:-translate-y-0.5",
                )}
                aria-label={`Letter chip ${letter}`}
              >
                {letter}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleBackspace}
            disabled={placedLetters.length === 0}
            className="border-sand-border bg-sand text-ink-soft hover:text-ink focus-accessible flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all active:scale-95 disabled:opacity-40 sm:h-14 sm:w-14"
            aria-label="Backspace last letter"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>

      {funFact && isCompleted && (
        <div className="bg-green-tint border-green text-green-deep animate-in fade-in max-w-md rounded-2xl border p-3 text-center text-xs font-bold">
          {funFact}
        </div>
      )}
    </div>
  );
}
