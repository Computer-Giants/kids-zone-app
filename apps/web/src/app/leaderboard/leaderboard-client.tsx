"use client";

import React, { useState } from "react";
import { LeaderboardList, type LeaderboardUserItem } from "@kidzone/ui";
import type { AgeBand } from "@kidzone/utils";

export interface LeaderboardClientProps {
  initialLeaderboard: LeaderboardUserItem[];
  initialAgeBand: AgeBand;
  activeChildId?: string;
}

export function LeaderboardClient({
  initialLeaderboard,
  initialAgeBand,
  activeChildId,
}: LeaderboardClientProps) {
  const [selectedBand, setSelectedBand] = useState<AgeBand>(initialAgeBand);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUserItem[]>(initialLeaderboard);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectBand = async (band: AgeBand) => {
    setSelectedBand(band);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/leaderboard?ageBand=${band}`);
      if (res.ok) {
        const json = await res.json();
        setLeaderboard(json.leaderboard ?? []);
      }
    } catch {
      // Fallback preserves current list on network error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="shadow-xs inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-100 px-3.5 py-1 text-xs font-bold text-yellow-900">
          <span>⭐</span>
          <span>Weekly Stars Leaderboard</span>
        </div>
        <h1 className="font-heading text-ink mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Catholic Community Stars
        </h1>
        <p className="text-ink-soft mx-auto mt-2 max-w-md text-sm">
          Celebrating young explorers walking in the footsteps of the saints. Ranked by weekly stars
          within each age band.
        </p>
      </div>

      {/* Leaderboard Component */}
      <div className={isLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
        <LeaderboardList
          items={leaderboard}
          selectedBand={selectedBand}
          onSelectBand={handleSelectBand}
          currentChildId={activeChildId}
        />
      </div>

      {/* Privacy Guarantee Note */}
      <div className="border-sand-border bg-sand/30 text-ink-soft mt-10 rounded-2xl border p-4 text-center text-xs">
        <p>
          🛡️ Nicknames only. Real names, locations, and photos are never collected or shown. Parents
          can hide their child anytime from the Parent Portal.
        </p>
      </div>
    </div>
  );
}
