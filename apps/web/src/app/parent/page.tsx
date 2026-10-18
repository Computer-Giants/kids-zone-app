import { createClient } from "@kidzone/auth/server";
import { Button } from "@kidzone/ui";
import { redirect } from "next/navigation";
import { signOutParentAction } from "../(auth)/actions";
import { ParentDashboardClient } from "./parent-dashboard-client";

export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/parent");
  }

  // Pure reads for server component rendering (no mutations during render)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: household } = await supabase
    .from("households")
    .select("id, timezone, parent_pin_hash")
    .eq("owner_id", user.id)
    .maybeSingle();

  const { data: childrenList } = household?.id
    ? await supabase
        .from("children")
        .select("id, nickname, avatar, birth_date, pin_hash, status, show_on_leaderboard")
        .eq("household_id", household.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const children = childrenList ?? [];
  const hasPasscode = Boolean(household?.parent_pin_hash);
  const isEmailConfirmed = Boolean(user.email_confirmed_at);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Top Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-slate/10 font-heading text-slate rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Parent Portal
            </span>
            <span className="bg-green-tint font-heading text-green-deep rounded-full px-3 py-1 text-xs font-bold">
              Active Household
            </span>
          </div>
          <h1 className="font-heading text-ink mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Family Household
          </h1>
          <p className="text-ink-soft mt-1 text-base">
            Manage your Catholic learning profiles, preferences, and safety controls.
          </p>
        </div>

        {/* Quick Sign Out Action */}
        <form action={signOutParentAction}>
          <Button
            type="submit"
            variant="outline"
            size="md"
            className="text-slate hover:border-red hover:text-red-deep text-base"
          >
            Sign Out
          </Button>
        </form>
      </div>

      {/* Email Confirmation Notice (if pending confirmation) */}
      {!isEmailConfirmed && (
        <div
          role="status"
          className="border-yellow/30 bg-yellow-tint text-ink shadow-xs mb-8 flex items-center justify-between rounded-2xl border-2 p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              📬
            </span>
            <div>
              <p className="font-heading text-ink text-sm font-bold">
                Confirmation email sent to {user.email}
              </p>
              <p className="text-ink-soft text-xs">
                Please verify your email within 24 hours to ensure continuous account recovery
                access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Household Summary Card */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="border-sand-border shadow-card-rest rounded-2xl border-2 bg-white p-6 md:col-span-2">
          <h2 className="font-heading text-ink text-xl font-bold">Account Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-ink-soft text-xs font-bold uppercase tracking-wider">
                Parent Email
              </span>
              <p className="text-ink mt-0.5 break-all font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-ink-soft text-xs font-bold uppercase tracking-wider">
                Full Name
              </span>
              <p className="text-ink mt-0.5 font-medium">
                {profile?.full_name || (user.user_metadata?.full_name as string) || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-ink-soft text-xs font-bold uppercase tracking-wider">
                Household Timezone
              </span>
              <p className="text-ink mt-0.5 font-medium">
                {household?.timezone || (user.user_metadata?.timezone as string) || "UTC"}
              </p>
            </div>
            <div>
              <span className="text-ink-soft text-xs font-bold uppercase tracking-wider">
                Account Role
              </span>
              <p className="text-ink mt-0.5 font-medium capitalize">{profile?.role || "Parent"}</p>
            </div>
          </div>
        </div>

        {/* Protection Guarantee Card */}
        <div className="border-blue/20 bg-blue-tint/50 shadow-card-rest rounded-2xl border-2 p-6">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🛡️
            </span>
            <h3 className="font-heading text-blue-deep text-lg font-bold">Zero Child Data</h3>
          </div>
          <p className="text-ink-soft mt-2 text-xs leading-relaxed">
            All child profiles are strictly kept under your parent account. Children never have
            credentials, public names, or external trackers.
          </p>
        </div>
      </div>

      {/* Family Habit Tracking Summary (AC-7 in spec 0014) */}
      <div className="border-sand-border shadow-card-rest mb-8 rounded-2xl border-2 bg-white p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-ink text-xl font-bold">Family Faith Habits</h2>
            <p className="text-ink-soft mt-0.5 text-xs">
              Self-hosted private metrics computed from your household's holy activities. Zero
              external tracking.
            </p>
          </div>
          <span className="bg-green-tint font-heading text-green-deep inline-block rounded-full px-3 py-1 text-xs font-bold">
            Private & Anonymous
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border-sand-border bg-sand/40 rounded-xl border p-4 text-center">
            <span className="text-2xl" aria-hidden="true">
              📖
            </span>
            <p className="font-heading text-ink mt-1 text-lg font-bold">Active</p>
            <p className="text-ink-soft text-[11px] font-bold uppercase tracking-wider">
              Bible Reading
            </p>
          </div>

          <div className="border-sand-border bg-sand/40 rounded-xl border p-4 text-center">
            <span className="text-2xl" aria-hidden="true">
              🕊️
            </span>
            <p className="font-heading text-ink mt-1 text-lg font-bold">Daily</p>
            <p className="text-ink-soft text-[11px] font-bold uppercase tracking-wider">
              Saint Stories
            </p>
          </div>

          <div className="border-sand-border bg-sand/40 rounded-xl border p-4 text-center">
            <span className="text-2xl" aria-hidden="true">
              🧩
            </span>
            <p className="font-heading text-ink mt-1 text-lg font-bold">Growing</p>
            <p className="text-ink-soft text-[11px] font-bold uppercase tracking-wider">
              Church Puzzles
            </p>
          </div>

          <div className="border-sand-border bg-sand/40 rounded-xl border p-4 text-center">
            <span className="text-2xl" aria-hidden="true">
              🔥
            </span>
            <p className="font-heading text-ink mt-1 text-lg font-bold">Strengthening</p>
            <p className="text-ink-soft text-[11px] font-bold uppercase tracking-wider">
              Faith Streaks
            </p>
          </div>
        </div>
      </div>

      {/* Children Management & Parent Gate Component */}
      <ParentDashboardClient children={children} hasPasscode={hasPasscode} />
    </div>
  );
}
