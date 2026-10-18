import React from "react";
import { cn } from "../lib/utils";
import { ChildAvatar } from "./child-avatar";
import { RankBadge } from "./rank-badge";
import { MascotLamb } from "./mascot-lamb";

export interface LeaderboardUserItem {
  rank: number;
  childId: string;
  nickname: string;
  avatar: string;
  ageBand: "b3_7" | "b8_10" | "b11_15";
  stars: number;
}

export interface LeaderboardListProps {
  items: LeaderboardUserItem[];
  selectedBand: "b3_7" | "b8_10" | "b11_15";
  onSelectBand: (band: "b3_7" | "b8_10" | "b11_15") => void;
  currentChildId?: string;
  className?: string;
}

const AGE_BANDS: Array<{ key: "b3_7" | "b8_10" | "b11_15"; label: string }> = [
  { key: "b3_7", label: "Ages 3 to 7" },
  { key: "b8_10", label: "Ages 8 to 10" },
  { key: "b11_15", label: "Ages 11 to 15" },
];

export function LeaderboardList({
  items,
  selectedBand,
  onSelectBand,
  currentChildId,
  className,
}: LeaderboardListProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Age Band Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2" role="tablist">
        {AGE_BANDS.map((b) => {
          const isSelected = selectedBand === b.key;
          return (
            <button
              key={b.key}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectBand(b.key)}
              className={cn(
                "font-heading focus-accessible min-h-[48px] cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                isSelected
                  ? "bg-orange shadow-card-interactive scale-105 text-white"
                  : "text-ink-soft border-sand-border hover:border-slate/40 border-2 bg-white",
              )}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {/* Rankings List */}
      {items.length === 0 ? (
        <div className="border-sand-border flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center">
          <MascotLamb size="md" mood="happy" className="mb-3" />
          <h3 className="font-heading text-ink text-lg font-bold">Be the First Explorer!</h3>
          <p className="text-ink-soft mt-1 max-w-sm text-sm">
            Read Bible verses, solve holy puzzles, and collect weekly stars to inspire your Catholic
            friends.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => {
            const isSelf = currentChildId === item.childId;
            return (
              <div
                key={item.childId}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 p-3.5 transition-all",
                  isSelf
                    ? "border-orange/40 bg-orange-tint/30 shadow-sm"
                    : "border-sand-border hover:border-slate/30 bg-white",
                )}
              >
                <div className="flex items-center gap-3.5">
                  <RankBadge rank={item.rank} />
                  <ChildAvatar avatar={item.avatar} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-ink text-base font-bold">
                        {item.nickname}
                      </span>
                      {isSelf && (
                        <span className="bg-orange rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-ink-soft text-xs">Catholic Explorer</span>
                  </div>
                </div>

                <div className="font-heading shadow-xs flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-900">
                  <span>⭐</span>
                  <span>{item.stars}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
