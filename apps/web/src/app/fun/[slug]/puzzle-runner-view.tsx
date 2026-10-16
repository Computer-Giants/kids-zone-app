"use client";

import * as React from "react";
import type {
  SeedPuzzle,
  TileMatchingConfigData,
  WordSearchConfigData,
  WordScrambleConfigData,
} from "@kidzone/db";
import { markGuestItemComplete } from "@kidzone/utils";
import type { LearnerSession } from "@/lib/child-session";
import {
  AnimatedLambGuide,
  ArrowLeft,
  Button,
  RotateCcw,
  Sparkles,
  TileMatchingGrid,
  WordSearchBoard,
  WordScrambleBoard,
} from "@kidzone/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface PuzzleRunnerViewProps {
  puzzle: SeedPuzzle;
  session: LearnerSession;
}

export function PuzzleRunnerView({ puzzle, session }: PuzzleRunnerViewProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = React.useState<number>(0);
  const [key, setKey] = React.useState<number>(0);

  const childId = session && !session.isGuest ? session.id : undefined;

  // Handle puzzle completion
  const handlePuzzleCompleted = React.useCallback(async () => {
    setIsCompleted(true);

    if (!childId) {
      // Guest mode: save progress on client device
      if (typeof window !== "undefined") {
        markGuestItemComplete(puzzle.id);
      }
      setStarsAwarded(0);
      return;
    }

    // Authenticated child: send idempotent event to server
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${childId}-${puzzle.id}-${Date.now()}`;

      // 1. Post to rewards ledger engine
      await fetch("/api/rewards/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          type: "puzzle_completed",
          entityType: "puzzle",
          entityId: puzzle.id,
          score: 100,
          idempotencyKey,
          metadata: { puzzleSlug: puzzle.slug },
        }),
      });

      // 2. Also notify puzzles completion route
      const res = await fetch("/api/puzzles/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          puzzleId: puzzle.id,
          idempotencyKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStarsAwarded(data.starsAwarded ?? 2);
      } else {
        setStarsAwarded(2);
      }
    } catch {
      setStarsAwarded(2);
    }
  }, [puzzle.id, puzzle.slug, childId]);

  const handleReplay = () => {
    setIsCompleted(false);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/fun"
          className="bg-sand border-sand-border text-ink-soft hover:text-ink font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all active:scale-95 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Puzzles</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="bg-sand border-sand-border font-heading text-ink-soft rounded-full border px-3 py-1 text-xs font-bold">
            {puzzle.themeTag}
          </span>
          <span className="bg-sand border-sand-border font-heading text-ink-soft rounded-full border px-3 py-1 text-xs font-bold">
            Difficulty {puzzle.difficulty}/3
          </span>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="border-sand-border shadow-card-rest rounded-3xl border-2 bg-white p-5 sm:p-8">
        {/* Title and Instructions Header */}
        <div className="mb-6 text-center">
          <h1 className="font-heading text-ink text-2xl font-black tracking-tight sm:text-3xl">
            {puzzle.title}
          </h1>
          <p className="font-body text-ink-soft mx-auto mt-2 max-w-xl text-sm leading-relaxed sm:text-base">
            {puzzle.instructions}
          </p>
        </div>

        {/* Celebratory Completion Screen (AC-7) */}
        {isCompleted ? (
          <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-6 py-8 text-center duration-300">
            <div className="border-sand-border bg-sand shadow-card-rest rounded-3xl border-2 p-6">
              <AnimatedLambGuide
                size="lg"
                mood="celebrating"
                speechText={`Glory to God! You solved the ${puzzle.title} puzzle! Wonderful job!`}
                speechSpeaker="Guide Lamb"
              />
            </div>

            <div className="space-y-2">
              <div className="bg-yellow-tint border-yellow-deep text-yellow-deep font-heading inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-black">
                <Sparkles className="h-4 w-4" />
                <span>{childId ? `+${starsAwarded || 2} Stars Earned!` : "Puzzle Solved!"}</span>
              </div>
              <h2 className="font-heading text-ink text-2xl font-black sm:text-3xl">
                Well Done, Faithful Seeker!
              </h2>
              <p className="font-body text-ink-soft max-w-md text-sm sm:text-base">
                You used your mind and attention to explore sacred Catholic symbols. Keep growing in
                wisdom!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button variant="primary" size="lg" onClick={() => router.push("/fun")}>
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>Play Another Puzzle</span>
              </Button>

              <Button variant="outline" size="lg" onClick={handleReplay}>
                <RotateCcw className="h-5 w-5 shrink-0" />
                <span>Play Again</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Active Puzzle Board */
          <div key={`puzzle-board-${key}`} className="pt-2">
            {puzzle.type === "matching" && (
              <TileMatchingGrid
                pairs={(puzzle.config as TileMatchingConfigData).pairs}
                onComplete={handlePuzzleCompleted}
              />
            )}

            {puzzle.type === "word_search" && (
              <WordSearchBoard
                config={puzzle.config as WordSearchConfigData}
                onComplete={handlePuzzleCompleted}
              />
            )}

            {puzzle.type === "scramble" && (
              <WordScrambleBoard
                config={puzzle.config as WordScrambleConfigData}
                onComplete={handlePuzzleCompleted}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
