import type { Metadata } from "next";
import { createClient } from "@kidzone/auth/server";
import { deriveAgeBand } from "@kidzone/utils";
import { getActiveChildId, getGuestAgeBand } from "@/lib/child-session";
import { ProfileSelectionClient, type ProfileItem } from "./profile-selection-client";

export const metadata: Metadata = {
  title: "Who is Learning Today?",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SelectProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profiles: ProfileItem[] = [];
  let hasParentPasscode = false;

  if (user) {
    const { data: household } = await supabase
      .from("households")
      .select("id, parent_pin_hash")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (household) {
      hasParentPasscode = Boolean(household.parent_pin_hash);

      const { data: rawProfiles } = await supabase
        .from("child_profiles")
        .select("id, nickname, avatar_id, birth_date, pin_hash")
        .eq("household_id", household.id)
        .order("created_at", { ascending: true });

      if (rawProfiles) {
        profiles = rawProfiles.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          avatarId: p.avatar_id,
          birthDate: p.birth_date,
          ageBand: deriveAgeBand(p.birth_date),
          hasPin: Boolean(p.pin_hash),
        }));
      }
    }
  }

  const activeChildId = await getActiveChildId();
  const guestAgeBand = await getGuestAgeBand();

  return (
    <ProfileSelectionClient
      profiles={profiles}
      isAuthenticated={Boolean(user)}
      hasParentPasscode={hasParentPasscode}
      currentActiveChildId={activeChildId}
      currentGuestAgeBand={guestAgeBand}
    />
  );
}
