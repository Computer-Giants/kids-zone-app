"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChurchItemData,
  ChurchItemModal,
  ChurchSceneViewer,
  MascotLamb,
  TourProgressIndicator,
} from "@kidzone/ui";
import type { SeedChurchTourScene } from "@kidzone/db";

export interface ChurchTourClientProps {
  initialScenes: SeedChurchTourScene[];
  initialActiveSlug?: string;
  childId?: string;
  ageBand?: "b3_7" | "b8_10" | "b11_15";
}

export function ChurchTourClient({
  initialScenes,
  initialActiveSlug = "narthex",
  childId,
  ageBand = "b8_10",
}: ChurchTourClientProps) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string>(initialActiveSlug);
  const [inspectedItemIds, setInspectedItemIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ChurchItemData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [awardedStars, setAwardedStars] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local storage key for persistent exploration tracking
  const storageKey = `kz_church_tour_${childId || "guest"}_inspected`;

  // Restore inspected items from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setInspectedItemIds(parsed);
          }
        }
      } catch {
        // Fallback to empty
      }
    }
  }, [storageKey]);

  // Save inspected items to localStorage
  const markItemInspected = (itemId: string) => {
    setInspectedItemIds((prev) => {
      if (prev.includes(itemId)) return prev;
      const updated = [...prev, itemId];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // Ignore write failure
        }
      }
      return updated;
    });
  };

  // Find active scene object
  const activeScene = initialScenes.find((s) => s.slug === activeSlug) ?? initialScenes[0]!;

  const currentIndex = initialScenes.findIndex((s) => s.slug === activeScene.slug);
  const previousSceneSlug =
    currentIndex > 0 ? (initialScenes[currentIndex - 1]?.slug ?? null) : null;
  const nextSceneSlug =
    currentIndex < initialScenes.length - 1
      ? (initialScenes[currentIndex + 1]?.slug ?? null)
      : null;

  // Calculate total item count across all scenes
  const totalItemCount = initialScenes.reduce((acc, s) => acc + s.items.length, 0);

  const handleSelectScene = (slug: string) => {
    setActiveSlug(slug);
    window.history.replaceState(null, "", `/church-tour?scene=${slug}`);
  };

  const handleItemSelect = (item: { id: string; title: string; illustrationSvgKey: string }) => {
    markItemInspected(item.id);

    // Find full item data from active scene
    const fullItem = activeScene.items.find((i) => i.id === item.id);
    if (fullItem) {
      setSelectedItem({
        id: fullItem.id,
        title: fullItem.title,
        illustrationSvgKey: fullItem.illustrationSvgKey,
        reverenceNote: fullItem.reverenceNote,
        simplifiedTextBand3_7: fullItem.simplifiedTextBand3_7,
        simplifiedTextBand8_10: fullItem.simplifiedTextBand8_10,
        simplifiedTextBand11_15: fullItem.simplifiedTextBand11_15,
        glossaryTerm: fullItem.glossaryTermSlug
          ? {
              slug: fullItem.glossaryTermSlug,
              term: fullItem.title,
            }
          : null,
      });
    }
  };

  const handleCompleteTour = async () => {
    if (isSubmitting || isCompleted) return;
    setIsSubmitting(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch("/api/church-tour/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: childId || undefined,
          idempotencyKey,
          completedItemIds: inspectedItemIds,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setIsCompleted(true);
        setAwardedStars(data.starsAwarded ?? 0);
      }
    } catch {
      // Offline fallback
      setIsCompleted(true);
      setAwardedStars(childId ? 5 : 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      {/* Progress & Room Sequence Header */}
      <TourProgressIndicator
        scenes={initialScenes.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          orderIndex: s.orderIndex,
        }))}
        activeSceneSlug={activeScene.slug}
        inspectedItemCount={inspectedItemIds.length}
        totalItemCount={totalItemCount}
        isTourCompleted={isCompleted}
        onSelectScene={handleSelectScene}
        onCompleteTour={handleCompleteTour}
      />

      {/* Completion Banner */}
      {isCompleted && (
        <div className="flex items-center gap-4 rounded-3xl border-2 border-emerald-400 bg-emerald-50 p-6 shadow-md">
          <MascotLamb size="md" mood="celebrating" />
          <div>
            <h3 className="font-heading text-xl font-bold text-emerald-950">
              Glory to God! You Completed the Church Tour!
            </h3>
            <p className="mt-1 text-sm text-emerald-800">
              You discovered all sacred objects and learned how we show Catholic reverence in God's
              holy house. {awardedStars ? `You earned ${awardedStars} golden stars!` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Responsive Interactive Scene Viewer */}
      <ChurchSceneViewer
        scene={{
          id: activeScene.id,
          slug: activeScene.slug,
          title: activeScene.title,
          description: activeScene.description,
          illustrationSvgKey: activeScene.illustrationSvgKey,
          previousSceneSlug,
          nextSceneSlug,
          items: activeScene.items.map((i) => ({
            id: i.id,
            title: i.title,
            illustrationSvgKey: i.illustrationSvgKey,
            xPercent: i.xPercent,
            yPercent: i.yPercent,
          })),
        }}
        inspectedItemIds={inspectedItemIds}
        onItemSelect={handleItemSelect}
        onNavigatePrevious={
          previousSceneSlug ? () => handleSelectScene(previousSceneSlug) : undefined
        }
        onNavigateNext={nextSceneSlug ? () => handleSelectScene(nextSceneSlug) : undefined}
      />

      {/* Item Inspection Bottom Sheet Modal */}
      <ChurchItemModal
        item={selectedItem}
        initialAgeBand={ageBand}
        onClose={() => setSelectedItem(null)}
        onGlossaryClick={(slug) => {
          setSelectedItem(null);
          router.push(`/saints?search=${encodeURIComponent(slug)}`);
        }}
      />
    </div>
  );
}
