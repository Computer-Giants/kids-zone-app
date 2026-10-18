"use client";

import React from "react";
import { ChurchSceneIllustration } from "./church-tour-illustrations";
import { HotspotButton } from "./hotspot-button";

export interface SceneViewerItem {
  id: string;
  title: string;
  illustrationSvgKey: string;
  xPercent: number;
  yPercent: number;
}

export interface ChurchSceneViewerProps {
  scene: {
    id: string;
    slug: string;
    title: string;
    description: string;
    illustrationSvgKey: string;
    previousSceneSlug: string | null;
    nextSceneSlug: string | null;
    items: SceneViewerItem[];
  };
  inspectedItemIds: string[];
  onItemSelect: (item: SceneViewerItem) => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  className?: string;
}

export function ChurchSceneViewer({
  scene,
  inspectedItemIds,
  onItemSelect,
  onNavigatePrevious,
  onNavigateNext,
  className = "",
}: ChurchSceneViewerProps) {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Scene Header */}
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">{scene.title}</h2>
          <p className="text-sm text-stone-600">{scene.description}</p>
        </div>
        <span className="text-xs font-semibold text-amber-700">
          Tap the glowing golden halo spots to discover sacred items
        </span>
      </div>

      {/* Main Interactive Scene Window */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-4 border-amber-300 bg-stone-900 shadow-xl">
        {/* Vector Background */}
        <ChurchSceneIllustration
          svgKey={scene.illustrationSvgKey}
          className="h-full w-full object-cover"
        />

        {/* Hotspots */}
        {scene.items.map((item) => {
          const isInspected = inspectedItemIds.includes(item.id);

          return (
            <HotspotButton
              key={item.id}
              title={item.title}
              xPercent={item.xPercent}
              yPercent={item.yPercent}
              isInspected={isInspected}
              onClick={() => onItemSelect(item)}
            />
          );
        })}

        {/* Previous Scene Button */}
        {scene.previousSceneSlug && onNavigatePrevious && (
          <button
            type="button"
            onClick={onNavigatePrevious}
            aria-label="Walk to previous church room"
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-stone-900/70 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-stone-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Next Scene Button */}
        {scene.nextSceneSlug && onNavigateNext && (
          <button
            type="button"
            onClick={onNavigateNext}
            aria-label="Walk to next church room"
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-stone-900/70 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-stone-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Walking Navigation Footer */}
      <div className="flex items-center justify-between pt-1">
        {scene.previousSceneSlug && onNavigatePrevious ? (
          <button
            type="button"
            onClick={onNavigatePrevious}
            className="flex items-center gap-2 rounded-xl border-2 border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900 shadow-sm transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            <span>←</span>
            <span>Walk Back</span>
          </button>
        ) : (
          <div />
        )}

        <span className="text-xs font-medium text-stone-500">
          {scene.items.filter((i) => inspectedItemIds.includes(i.id)).length} of{" "}
          {scene.items.length} items explored here
        </span>

        {scene.nextSceneSlug && onNavigateNext ? (
          <button
            type="button"
            onClick={onNavigateNext}
            className="flex items-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            <span>Walk Forward</span>
            <span>→</span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
