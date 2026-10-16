import { createClient } from "@kidzone/auth/server";
import { deriveAgeBand, type AgeBand } from "@kidzone/utils";
import { cookies } from "next/headers";

export const ACTIVE_CHILD_COOKIE = "kz_active_child";
export const GUEST_AGE_BAND_COOKIE = "kz_guest_age_band";

export interface ActiveChildSession {
  id: string;
  householdId: string;
  nickname: string;
  avatarId: string;
  birthDate: string;
  ageBand: AgeBand;
  hasPin: boolean;
  isGuest: false;
}

export interface GuestSession {
  isGuest: true;
  ageBand: AgeBand;
}

export type LearnerSession = ActiveChildSession | GuestSession | null;

/**
 * Returns the currently active child ID from HTTP cookies.
 */
export async function getActiveChildId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_CHILD_COOKIE)?.value ?? null;
}

/**
 * Returns the selected guest age band from HTTP cookies.
 */
export async function getGuestAgeBand(): Promise<AgeBand | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get(GUEST_AGE_BAND_COOKIE)?.value;
  if (val === "b3_7" || val === "b8_10" || val === "b11_15") {
    return val;
  }
  return null;
}

/**
 * Resolves the full active child or guest learner session on the server.
 */
export async function getActiveLearnerSession(): Promise<LearnerSession> {
  const childId = await getActiveChildId();

  if (childId) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("child_profiles")
        .select("id, household_id, nickname, avatar_id, birth_date, pin_hash")
        .eq("id", childId)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          householdId: profile.household_id,
          nickname: profile.nickname,
          avatarId: profile.avatar_id,
          birthDate: profile.birth_date,
          ageBand: deriveAgeBand(profile.birth_date),
          hasPin: Boolean(profile.pin_hash),
          isGuest: false,
        };
      }
    }
  }

  // Check guest session
  const guestBand = await getGuestAgeBand();
  if (guestBand) {
    return {
      isGuest: true,
      ageBand: guestBand,
    };
  }

  return null;
}
