export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Convert major units (e.g. NGN 1500.50) to minor units (kobo): 150050. */
export const toMinorUnits = (amount: number) => Math.round(amount * 100);
export const fromMinorUnits = (amount: number) => amount / 100;

export function formatCurrency(minor: number, currency = "NGN", locale = "en-NG") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    fromMinorUnits(minor),
  );
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Narrowing helper for exhaustive switches. */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

export type AgeBand = "b3_7" | "b8_10" | "b11_15";

/**
 * Calculates a child's exact age in completed years from birth date and a reference date (defaults to now).
 */
export function calculateExactAge(
  birthDateInput: string | Date,
  referenceDate: Date = new Date(),
): number {
  let birthYear: number;
  let birthMonth: number;
  let birthDay: number;

  if (typeof birthDateInput === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDateInput.trim());
    if (match && match[1] && match[2] && match[3]) {
      birthYear = Number(match[1]);
      birthMonth = Number(match[2]) - 1;
      birthDay = Number(match[3]);
    } else {
      const d = new Date(birthDateInput);
      birthYear = d.getUTCFullYear();
      birthMonth = d.getUTCMonth();
      birthDay = d.getUTCDate();
    }
  } else {
    birthYear = birthDateInput.getFullYear();
    birthMonth = birthDateInput.getMonth();
    birthDay = birthDateInput.getDate();
  }

  let age = referenceDate.getFullYear() - birthYear;
  const monthDiff = referenceDate.getMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDay)) {
    age--;
  }
  return age;
}

/**
 * Derives the canonical age band from a child's birth date.
 * Single source of truth across the entire app. Never store age band in database.
 * Ages 2 to 7 -> "b3_7"
 * Ages 8 to 10 -> "b8_10"
 * Ages 11 to 15 -> "b11_15"
 * Under 2 defaults to "b3_7", 16+ defaults to "b11_15" (with graduated status).
 */
export function calculateAgeBand(
  birthDateInput: string | Date,
  referenceDate: Date = new Date(),
): AgeBand {
  const age = calculateExactAge(birthDateInput, referenceDate);
  if (age <= 7) {
    return "b3_7";
  }
  if (age <= 10) {
    return "b8_10";
  }
  return "b11_15";
}

/**
 * Checks whether a child has reached age 16 and graduated from Kid Zone learning bands.
 */
export function isChildGraduated(
  birthDateInput: string | Date,
  referenceDate: Date = new Date(),
): boolean {
  return calculateExactAge(birthDateInput, referenceDate) >= 16;
}

/**
 * Friendly label for an age band.
 */
export function formatAgeBand(band: AgeBand): string {
  switch (band) {
    case "b3_7":
      return "Ages 3 to 7";
    case "b8_10":
      return "Ages 8 to 10";
    case "b11_15":
      return "Ages 11 to 15";
    default:
      return assertNever(band);
  }
}
export const deriveAgeBand = calculateAgeBand;

export const GUEST_PROGRESS_STORAGE_KEY = "kz_guest_progress";

export interface GuestProgressEntry {
  completedAt: string;
}

export type GuestProgressMap = Record<string, GuestProgressEntry>;

function getSafeStorage(storage?: Storage): Storage | null {
  if (storage) return storage;
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

/**
 * Returns recorded guest reading and puzzle progress from local storage.
 */
export function getGuestProgress(storage?: Storage): GuestProgressMap {
  const store = getSafeStorage(storage);
  if (!store) return {};
  try {
    const raw = store.getItem(GUEST_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GuestProgressMap;
  } catch {
    return {};
  }
}

/**
 * Records completion of a reading story or puzzle on the guest's local device.
 */
export function markGuestItemComplete(contentId: string, storage?: Storage): GuestProgressMap {
  const store = getSafeStorage(storage);
  const current = getGuestProgress(storage);
  const updated: GuestProgressMap = {
    ...current,
    [contentId]: {
      completedAt: new Date().toISOString(),
    },
  };
  if (store) {
    try {
      store.setItem(GUEST_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable or quota exceeded
    }
  }
  return updated;
}

/**
 * Checks whether an item was completed in guest mode on this device.
 */
export function isGuestItemComplete(contentId: string, storage?: Storage): boolean {
  const current = getGuestProgress(storage);
  return Boolean(current[contentId]);
}

/**
 * Clears guest progress from the device.
 */
export function clearGuestProgress(storage?: Storage): void {
  const store = getSafeStorage(storage);
  if (store) {
    try {
      store.removeItem(GUEST_PROGRESS_STORAGE_KEY);
    } catch {
      // ignore storage error
    }
  }
}

export * from "./rewards";
export * from "./spaced-repetition";
