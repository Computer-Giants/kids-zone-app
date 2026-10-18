"use client";

import React from "react";
import { MascotLamb } from "./mascot-lamb";
import { Button } from "./button";

export interface SceneSummaryItem {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
}

export interface TourProgressIndicatorProps {
  scenes: SceneSummaryItem[];
  activeSceneSlug: string;
  inspectedItemCount: number;
  totalItemCount: number;
  isTourCompleted?: boolean;
  onSelectScene: (slug: string) => void;
  onCompleteTour: () => void;
  className?: string;
}

export function TourProgressIndicator({
  scenes,
  activeSceneSlug,
  inspectedItemCount,
  totalItemCount,
  isTourCompleted = false,
  onSelectScene,
  onCompleteTour,
  className = "",
}: TourProgressIndicatorProps) {
  const allDiscovered = inspectedItemCount >= totalItemCount && totalItemCount > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Bar: Progress and Win State */}
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-amber-300 bg-amber-100/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MascotLamb size="sm" mood={allDiscovered ? "celebrating" : "happy"} />
          <div>
            <h3 className="font-heading text-sm font-bold text-amber-950">
              {allDiscovered ? "All Holy Items Discovered!" : "Inside the Catholic Church Tour"}
            </h3>
            <p className="text-xs text-amber-800">
              {inspectedItemCount} of {totalItemCount} sacred objects discovered
            </p>
          </div>
        </div>

        {allDiscovered && !isTourCompleted ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCompleteTour}
            className="animate-bounce bg-amber-500 font-bold text-white hover:bg-amber-600"
          >
            Claim 5 Stars ⭐
          </Button>
        ) : isTourCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            <span>Tour Completed</span>
            <span>⭐</span>
          </span>
        ) : null}
      </div>

      {/* Room Sequence Tabs (Horizontal scroll on mobile) */}
      <nav aria-label="Church tour rooms" className="flex gap-2 overflow-x-auto pb-1">
        {scenes.map((scene, index) => {
          const isActive = scene.slug === activeSceneSlug;

          return (
            <button
              key={scene.id || scene.slug}
              type="button"
              onClick={() => onSelectScene(scene.slug)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 ${
                isActive
                  ? "border-amber-500 bg-amber-500 text-white shadow-md"
                  : "border-amber-200 bg-white/90 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  isActive ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-900"
                }`}
              >
                {index + 1}
              </span>
              <span>{scene.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
