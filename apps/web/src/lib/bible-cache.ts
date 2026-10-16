"use client";

const CACHE_NAME = "kz-bible-cache-v1";
const CACHE_EXPIRY_DAYS = 14;
const CACHE_EXPIRY_MS = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export interface CachedChapterPayload {
  savedAt: number;
  data: unknown;
}

function getCacheKey(bookCode: string, chapter: number): string {
  return `/offline-cache/bible/${bookCode.toLowerCase()}/${chapter}`;
}

/**
 * Checks whether Cache Storage is supported in current browser environment.
 */
function isCacheStorageAvailable(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}

/**
 * Saves Bible chapter data to browser Cache Storage with timestamp for 14-day retention.
 */
export async function setCachedChapter(
  bookCode: string,
  chapter: number,
  data: unknown,
): Promise<void> {
  if (!isCacheStorageAvailable()) return;

  try {
    const cache = await window.caches.open(CACHE_NAME);
    const key = getCacheKey(bookCode, chapter);
    const payload: CachedChapterPayload = {
      savedAt: Date.now(),
      data,
    };
    const response = new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(key, response);
  } catch {
    // Quota exceeded or private browsing mode
  }
}

/**
 * Retrieves cached chapter from Cache Storage if saved within 14 days.
 * Drops cached copies older than 14 days per project specification rules.
 */
export async function getCachedChapter<T = unknown>(
  bookCode: string,
  chapter: number,
): Promise<T | null> {
  if (!isCacheStorageAvailable()) return null;

  try {
    const cache = await window.caches.open(CACHE_NAME);
    const key = getCacheKey(bookCode, chapter);
    const match = await cache.match(key);

    if (!match) return null;

    const payload = (await match.json()) as CachedChapterPayload;
    const age = Date.now() - payload.savedAt;

    // Drop any cached copy the app hasn't been able to check for 14 days
    if (age > CACHE_EXPIRY_MS) {
      await cache.delete(key);
      return null;
    }

    return payload.data as T;
  } catch {
    return null;
  }
}

/**
 * Sweeps the cache storage and deletes any chapters older than 14 days.
 */
export async function purgeExpiredBibleCache(): Promise<void> {
  if (!isCacheStorageAvailable()) return;

  try {
    const cache = await window.caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const now = Date.now();

    for (const req of requests) {
      const res = await cache.match(req);
      if (res) {
        try {
          const payload = (await res.json()) as CachedChapterPayload;
          if (now - payload.savedAt > CACHE_EXPIRY_MS) {
            await cache.delete(req);
          }
        } catch {
          await cache.delete(req);
        }
      }
    }
  } catch {
    // ignore cache sweep error
  }
}
