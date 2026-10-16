"use client";

import * as React from "react";
import { Check, HelpCircle, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export interface TileMatchingPair {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  matchId: string;
}

export interface TileMatchingGridProps {
  pairs: TileMatchingPair[];
  onComplete: () => void;
  className?: string;
}

interface TileState {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  matchId: string;
}

export function TileMatchingGrid({ pairs, onComplete, className }: TileMatchingGridProps) {
  // Shuffled tiles on mount
  const [tiles, setTiles] = React.useState<TileState[]>([]);
  const [flippedIndices, setFlippedIndices] = React.useState<number[]>([]);
  const [matchedIds, setMatchedIds] = React.useState<Set<string>>(new Set());
  const [hintIndices, setHintIndices] = React.useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = React.useState<boolean>(false);
  const [moves, setMoves] = React.useState<number>(0);

  // Initialize and shuffle tiles on mount
  React.useEffect(() => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setHintIndices([]);
    setMoves(0);
  }, [pairs]);

  // Handle tile tap
  const handleTileClick = (index: number) => {
    if (isEvaluating) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.has(tiles[index]!.id)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    setHintIndices([]);

    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      setMoves((m) => m + 1);

      const firstTile = tiles[newFlipped[0]!]!;
      const secondTile = tiles[newFlipped[1]!]!;

      if (firstTile.matchId === secondTile.matchId) {
        // Match found!
        const newMatched = new Set(matchedIds);
        newMatched.add(firstTile.id);
        newMatched.add(secondTile.id);
        setMatchedIds(newMatched);
        setFlippedIndices([]);
        setIsEvaluating(false);

        // Check completion
        if (newMatched.size === tiles.length && tiles.length > 0) {
          setTimeout(() => {
            onComplete();
          }, 600);
        }
      } else {
        // Mismatch: gentle flip back after 1 second
        setTimeout(() => {
          setFlippedIndices([]);
          setIsEvaluating(false);
        }, 1000);
      }
    }
  };

  // AC-6: Gentle Lamb Hint (reveals an unmatched pair briefly without penalty)
  const handleAskHint = () => {
    if (isEvaluating) return;

    // Find the first unmatched tile
    const unmatched = tiles
      .map((tile, idx) => ({ tile, idx }))
      .filter(({ tile }) => !matchedIds.has(tile.id));

    if (unmatched.length >= 2) {
      const targetMatchId = unmatched[0]!.tile.matchId;
      const pairIndices = unmatched
        .filter(({ tile }) => tile.matchId === targetMatchId)
        .map(({ idx }) => idx);

      setHintIndices(pairIndices);
      setTimeout(() => {
        setHintIndices([]);
      }, 1800);
    }
  };

  const handleReset = () => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setHintIndices([]);
    setMoves(0);
  };

  const allMatched = matchedIds.size === tiles.length && tiles.length > 0;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Top Toolbar */}
      <div className="flex w-full max-w-lg items-center justify-between gap-3 px-2">
        <div className="bg-sand border-sand-border font-heading text-ink-soft rounded-full border px-4 py-1.5 text-xs font-bold sm:text-sm">
          Matched: <span className="text-ink font-extrabold">{matchedIds.size / 2}</span> /{" "}
          {tiles.length / 2} pairs
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAskHint}
            disabled={allMatched || isEvaluating}
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
            aria-label="Restart puzzle"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div
        className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        role="grid"
        aria-label="Matching tiles grid"
      >
        {tiles.map((tile, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedIds.has(tile.id);
          const isMatched = matchedIds.has(tile.id);
          const isHinted = hintIndices.includes(index);

          return (
            <button
              key={`${tile.id}-${index}`}
              type="button"
              onClick={() => handleTileClick(index)}
              disabled={isMatched || isEvaluating}
              className={cn(
                "focus-accessible group relative flex min-h-[100px] flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all duration-300 sm:min-h-[120px]",
                // Matched state
                isMatched && "border-green bg-green-tint shadow-sticker-green scale-[0.98]",
                // Hinted state
                !isMatched &&
                  isHinted &&
                  "border-yellow-deep bg-yellow-tint animate-pulse ring-2 ring-yellow-400 ring-offset-2",
                // Flipped / Front state
                !isMatched &&
                  !isHinted &&
                  isFlipped &&
                  "border-blue bg-blue-tint shadow-sticker-blue",
                // Hidden / Back of card state
                !isFlipped &&
                  !isHinted &&
                  "border-sand-border shadow-card-rest hover:shadow-card-hover bg-white hover:-translate-y-0.5",
              )}
              aria-label={
                isFlipped
                  ? `${tile.label}: ${tile.description ?? "Card"}`
                  : `Hidden card ${index + 1}`
              }
            >
              {isFlipped || isHinted ? (
                <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-1.5 duration-200">
                  <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                    {tile.icon ?? "✨"}
                  </span>
                  <span className="font-heading text-ink text-xs font-black sm:text-sm">
                    {tile.label}
                  </span>
                  {isMatched && (
                    <span className="text-green-deep inline-flex items-center gap-0.5 text-[10px] font-extrabold uppercase">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>Found</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-sand border-sand-border flex h-10 w-10 items-center justify-center rounded-xl border">
                    <Sparkles className="text-ink-soft h-5 w-5" />
                  </div>
                  <span className="font-heading text-ink-soft text-[11px] font-bold">Tap</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
