"use server";

import { createClient } from "@kidzone/auth/server";
import { createChildSchema, parentPasscodeSchema, updateChildSchema } from "@kidzone/validators";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { hashParentPasscode, hashPin, verifyPasscode } from "@/lib/crypto";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Creates a new child profile under the authenticated parent's household.
 */
export async function createChildAction(
  formData: FormData | Record<string, unknown>,
): Promise<ActionResult> {
  const raw =
    formData instanceof FormData
      ? {
          nickname: formData.get("nickname"),
          avatar: formData.get("avatar"),
          birthDate: formData.get("birthDate"),
          pin: formData.get("pin") || undefined,
        }
      : formData;

  const parsed = createChildSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid child profile details provided.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Authentication required. Please sign in as a parent.",
    };
  }

  // Retrieve household
  const { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!household) {
    return {
      success: false,
      error: "Household not found. Please refresh your dashboard.",
    };
  }

  // Check for duplicate nickname within household
  const { data: existingChild } = await supabase
    .from("children")
    .select("id")
    .eq("household_id", household.id)
    .eq("nickname", parsed.data.nickname)
    .maybeSingle();

  if (existingChild) {
    return {
      success: false,
      error: `A profile named "${parsed.data.nickname}" already exists in your family.`,
    };
  }

  // Hash PIN if configured
  const pinHash = parsed.data.pin ? await hashPin(parsed.data.pin) : null;

  // Insert child record
  const { data: newChild, error: insertError } = await supabase
    .from("children")
    .insert({
      household_id: household.id,
      nickname: parsed.data.nickname,
      avatar: parsed.data.avatar,
      birth_date: parsed.data.birthDate,
      pin_hash: pinHash,
      show_on_leaderboard: true,
      status: "active",
    })
    .select()
    .single();

  if (insertError || !newChild) {
    return {
      success: false,
      error: insertError ? insertError.message : "Failed to create child profile.",
    };
  }

  // Initialize default preferences
  await supabase.from("child_preferences").upsert({
    child_id: newChild.id,
  });

  revalidatePath("/parent");

  return {
    success: true,
    message: `Learning profile for ${parsed.data.nickname} is ready!`,
  };
}

/**
 * Updates an existing child profile's nickname, avatar, or PIN.
 */
export async function updateChildAction(
  formData: FormData | Record<string, unknown>,
): Promise<ActionResult> {
  const raw =
    formData instanceof FormData
      ? {
          childId: formData.get("childId"),
          nickname: formData.get("nickname"),
          avatar: formData.get("avatar"),
          pin: formData.get("pin") || undefined,
        }
      : formData;

  const parsed = updateChildSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid child update details.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Authentication required.",
    };
  }

  const { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!household) {
    return { success: false, error: "Household not found." };
  }

  const pinHash = parsed.data.pin ? await hashPin(parsed.data.pin) : undefined;

  const updatePayload: Record<string, unknown> = {
    nickname: parsed.data.nickname,
    avatar: parsed.data.avatar,
  };
  if (pinHash !== undefined) {
    updatePayload.pin_hash = pinHash;
  }

  const { error } = await supabase
    .from("children")
    .update(updatePayload)
    .eq("id", parsed.data.childId)
    .eq("household_id", household.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/parent");
  return { success: true, message: "Child profile updated successfully." };
}

/**
 * Deletes a child profile after parent passcode verification.
 */
export async function deleteChildAction(
  childId: string,
  parentPasscode?: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const { data: household } = await supabase
    .from("households")
    .select("id, parent_pin_hash")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!household) {
    return { success: false, error: "Household not found." };
  }

  // Enforce parent passcode verification if configured on household
  if (household.parent_pin_hash) {
    if (!parentPasscode) {
      return {
        success: false,
        error: "Parent security passcode is required to delete a child profile.",
      };
    }
    const isValid = await verifyPasscode(parentPasscode, household.parent_pin_hash);
    if (!isValid) {
      return {
        success: false,
        error: "Incorrect passcode. Profile was not deleted.",
      };
    }
  }

  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId)
    .eq("household_id", household.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/parent");
  return { success: true, message: "Profile deleted." };
}

/**
 * Sets or updates the household's 4-digit security passcode.
 */
export async function setParentPasscodeAction(passcode: string): Promise<ActionResult> {
  const parsed = parentPasscodeSchema.safeParse(passcode);
  if (!parsed.success) {
    return {
      success: false,
      error: "Passcode must be exactly 4 digits.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const pinHash = await hashParentPasscode(parsed.data);

  // Check if household exists; if missing, create it
  const { data: existingHousehold } = await supabase
    .from("households")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  let error;
  if (!existingHousehold) {
    const insertRes = await supabase.from("households").insert({
      owner_id: user.id,
      parent_pin_hash: pinHash,
      timezone: "UTC",
    });
    error = insertRes.error;
  } else {
    const updateRes = await supabase
      .from("households")
      .update({ parent_pin_hash: pinHash })
      .eq("owner_id", user.id);
    error = updateRes.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  // Set transient unlock cookie valid for 30 minutes
  const cookieStore = await cookies();
  cookieStore.set("parent_gate_unlocked", "1", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30, // 30 minutes
    sameSite: "lax",
  });

  revalidatePath("/parent");
  return {
    success: true,
    message: "Household security passcode set successfully!",
  };
}

/**
 * Verifies the 4-digit passcode to unlock the parent gate.
 */
export async function verifyParentPasscodeAction(passcode: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const { data: household } = await supabase
    .from("households")
    .select("parent_pin_hash")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!household?.parent_pin_hash) {
    // If no passcode has been configured yet, accept setup directly
    return { success: true };
  }

  const isValid = await verifyPasscode(passcode, household.parent_pin_hash);
  if (!isValid) {
    return {
      success: false,
      error: "Incorrect passcode. Please try again.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("parent_gate_unlocked", "1", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30, // 30 minutes
    sameSite: "lax",
  });

  return { success: true };
}

/**
 * AC-2 in spec 0013: Toggle whether a child is visible on the weekly public leaderboard.
 */
export async function toggleLeaderboardVisibilityAction(
  childId: string,
  showOnLeaderboard: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!household) {
    return { success: false, error: "Household not found." };
  }

  const { error } = await supabase
    .from("children")
    .update({ show_on_leaderboard: showOnLeaderboard })
    .eq("id", childId)
    .eq("household_id", household.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/parent");
  return {
    success: true,
    message: showOnLeaderboard
      ? "Child will appear on the friendly weekly leaderboard."
      : "Child is now hidden from the weekly leaderboard.",
  };
}
