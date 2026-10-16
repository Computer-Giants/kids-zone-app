"use client";

import { markGuestItemComplete } from "@kidzone/utils";

export interface RecordReadingProgressOptions {
  contentId: string;
  childId?: string;
  entityType?: "story" | "featured_verse" | "bible_chapter" | "saint" | "saint_story";
}

export interface RecordReadingProgressResult {
  success: boolean;
  guest: boolean;
  starsAwarded: number;
}

/**
 * AC-8: Records completion of reading Scripture or a story retelling.
 * For guests: saves to local device storage with zero server database rows.
 * For authenticated children: sends idempotent activity event with client UUID.
 */
export async function recordReadingProgress({
  contentId,
  childId,
  entityType = "bible_chapter",
}: RecordReadingProgressOptions): Promise<RecordReadingProgressResult> {
  // Guest mode: local storage only
  if (!childId) {
    if (typeof window !== "undefined") {
      markGuestItemComplete(contentId);
    }
    return {
      success: true,
      guest: true,
      starsAwarded: 0,
    };
  }

  // Authenticated child: send idempotent event to server
  try {
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${childId}-${contentId}-${Date.now()}`;

    // 1. Post to rewards ledger engine
    const activityType =
      entityType === "saint" || entityType === "saint_story"
        ? "saint_viewed"
        : entityType === "story"
          ? "story_read"
          : "verse_read";

    await fetch("/api/rewards/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        type: activityType,
        entityType: entityType === "saint" || entityType === "saint_story" ? "saint" : "story",
        entityId: contentId,
        idempotencyKey,
      }),
    });

    const endpoint =
      entityType === "saint" || entityType === "saint_story"
        ? "/api/saints/readings/complete"
        : "/api/bible/readings/complete";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        contentId,
        idempotencyKey,
        entityType,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        guest: false,
        starsAwarded: data.starsAwarded ?? 1,
      };
    }
  } catch {
    // Offline or network error: guest progress can store as fallback
    if (typeof window !== "undefined") {
      markGuestItemComplete(contentId);
    }
  }

  return {
    success: true,
    guest: false,
    starsAwarded: 1,
  };
}
