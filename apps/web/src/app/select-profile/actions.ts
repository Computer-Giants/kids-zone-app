"use server";

import { createClient } from "@kidzone/auth/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyChildPin } from "@/lib/crypto";
import { ACTIVE_CHILD_COOKIE, GUEST_AGE_BAND_COOKIE } from "@/lib/child-session";
import type { AgeBand } from "@kidzone/utils";

export interface ProfileActionResult {
  success: boolean;
  error?: string;
  requiresPin?: boolean;
}

/**
 * Activates an unlocked child profile, or notifies the client if a PIN key is required.
 */
export async function selectChildAction(childId: string): Promise<ProfileActionResult> {
  if (!childId) {
    return { success: false, error: "Child profile ID is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required. Please sign in as a parent." };
  }

  // Fetch child profile to verify existence and check if PIN is configured
  const { data: profile, error } = await supabase
    .from("child_profiles")
    .select("id, household_id, pin_hash")
    .eq("id", childId)
    .maybeSingle();

  if (error || !profile) {
    return { success: false, error: "Profile not found or access denied." };
  }

  // Check if profile requires 4-digit PIN unlock
  if (profile.pin_hash) {
    return {
      success: false,
      requiresPin: true,
    };
  }

  // Set active child cookie (session lifetime)
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, profile.id, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.delete(GUEST_AGE_BAND_COOKIE);

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Validates a child profile's 4-digit PIN key and activates the profile upon match.
 */
export async function unlockChildPinAction(
  childId: string,
  pin: string,
): Promise<ProfileActionResult> {
  const trimmed = (pin || "").trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return {
      success: false,
      error: "Please enter your 4-digit secret key.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required. Please sign in as a parent." };
  }

  const { data: profile } = await supabase
    .from("child_profiles")
    .select("id, pin_hash")
    .eq("id", childId)
    .maybeSingle();

  if (!profile || !profile.pin_hash) {
    return { success: false, error: "Profile not found or key not set." };
  }

  const isValid = await verifyChildPin(trimmed, profile.pin_hash);
  if (!isValid) {
    // Gentle encouraging feedback without red error panic (AC-4)
    return {
      success: false,
      error: "That key did not match. Let us try one more time!",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, profile.id, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.delete(GUEST_AGE_BAND_COOKIE);

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Clears the active child profile session cookie.
 */
export async function clearActiveChildAction(): Promise<ProfileActionResult> {
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_CHILD_COOKIE);
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Activates guest exploration mode for a selected age band.
 */
export async function setGuestAgeBandAction(ageBand: AgeBand): Promise<ProfileActionResult> {
  if (ageBand !== "b3_7" && ageBand !== "b8_10" && ageBand !== "b11_15") {
    return { success: false, error: "Please select a valid age band." };
  }

  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_CHILD_COOKIE);
  cookieStore.set(GUEST_AGE_BAND_COOKIE, ageBand, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/", "layout");
  return { success: true };
}
