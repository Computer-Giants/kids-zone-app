"use client";

import * as React from "react";
import type { SeedPuzzle } from "@kidzone/db";
import type { LearnerSession } from "@/lib/child-session";
import { AnimatedLambGuide, Button, Grid, PuzzleCard, Sparkles, SpellCheck } from "@kidzone/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface FunIndexViewProps {
  puzzles: readonly SeedPuzzle[];
  session: LearnerSession;
}

type FilterTab = "all" | "matching" | "word_search" | "scramble";

export function FunIndexView({ puzzles, session }: FunIndexViewProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState<FilterTab>("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<number | "all">("all");

  const filteredPuzzles = React.useMemo(() => {
    return puzzles.filter((p) => {
      const matchesType = selectedTab === "all" || p.type === selectedTab;
      const matchesDifficulty = selectedDifficulty === "all" || p.difficulty === selectedDifficulty;
      return matchesType && matchesDifficulty;
    });
  }, [puzzles, selectedTab, selectedDifficulty]);

  const activeAgeLabel = session?.ageBand
    ? session.ageBand === "b3_7"
      ? "Little Lambs (3 to 7)"
      : session.ageBand === "b8_10"
        ? "Seekers (8 to 10)"
        : "Disciples (11 to 15)"
    : "All Children";

  const userNickname = session && !session.isGuest ? session.nickname : "Friend";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col items-center gap-6 text-center sm:mb-12">
        <div className="bg-green-tint font-heading text-green-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide">
          <Sparkles className="h-4 w-4" />
          <span>Interactive Play & Faith Puzzles</span>
        </div>

        <div className="border-sand-border bg-sand shadow-card-rest rounded-3xl border-2 p-5 sm:p-6">
          <AnimatedLambGuide
            size="md"
            mood="happy"
            speechText={`Welcome to the Fun Zone, ${userNickname}! Ready to play holy church puzzles and word games?`}
            speechSpeaker="Guide Lamb"
          />
        </div>

        <div className="max-w-2xl space-y-2">
          <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
            Catholic Church Puzzles
          </h1>
          <p className="font-body text-ink-soft text-base leading-relaxed sm:text-lg">
            Explore sacred church items, holy saints, and Bible words through joyful tile matching,
            word search challenges, and unscramble puzzles.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/quizzes">
            <Button variant="outline" size="md">
              <Sparkles className="h-4 w-4" />
              <span>Explore Faith Quizzes</span>
            </Button>
          </Link>
          <div className="bg-sand border-sand-border font-heading text-ink-soft inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
            <span>Tailored for: {activeAgeLabel}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-col items-center gap-4">
        {/* Type Tabs */}
        <div
          className="bg-sand border-sand-border flex flex-wrap items-center justify-center gap-1 rounded-2xl border p-1"
          role="tablist"
          aria-label="Puzzle category tabs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "all"}
            onClick={() => setSelectedTab("all")}
            className={`font-heading focus-accessible rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === "all"
                ? "text-ink bg-white font-black shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            All Puzzles ({puzzles.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "matching"}
            onClick={() => setSelectedTab("matching")}
            className={`font-heading focus-accessible inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === "matching"
                ? "text-ink bg-white font-black shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Tile Matching</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "word_search"}
            onClick={() => setSelectedTab("word_search")}
            className={`font-heading focus-accessible inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === "word_search"
                ? "text-ink bg-white font-black shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <SpellCheck className="h-3.5 w-3.5" />
            <span>Word Search</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "scramble"}
            onClick={() => setSelectedTab("scramble")}
            className={`font-heading focus-accessible inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === "scramble"
                ? "text-ink bg-white font-black shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Word Scramble</span>
          </button>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-ink-soft text-xs font-bold">Difficulty:</span>
          {(["all", 1, 2, 3] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`font-heading rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all ${
                selectedDifficulty === diff
                  ? "bg-ink text-white"
                  : "bg-sand text-ink-soft hover:text-ink"
              }`}
            >
              {diff === "all" ? "All" : `Level ${diff}`}
            </button>
          ))}
        </div>
      </div>

      {/* Puzzle Cards Grid */}
      {filteredPuzzles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPuzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.slug}
              slug={puzzle.slug}
              title={puzzle.title}
              instructions={puzzle.instructions}
              type={puzzle.type}
              difficulty={puzzle.difficulty}
              category={puzzle.category}
              themeTag={puzzle.themeTag}
              minAge={puzzle.minAge}
              maxAge={puzzle.maxAge}
              onSelect={() => router.push(`/fun/${puzzle.slug}`)}
            />
          ))}
        </div>
      ) : (
        <div className="border-sand-border bg-sand/50 rounded-3xl border-2 p-12 text-center">
          <p className="font-heading text-ink text-lg font-bold">No puzzles in this category yet</p>
          <p className="font-body text-ink-soft mt-1 text-sm">
            Try choosing a different tab or difficulty filter!
          </p>
          <Button
            variant="outline"
            size="md"
            className="mt-4"
            onClick={() => {
              setSelectedTab("all");
              setSelectedDifficulty("all");
            }}
          >
            Show All Puzzles
          </Button>
        </div>
      )}
    </div>
  );
}
