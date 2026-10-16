"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Button,
  ChildAvatar,
  ChildPinModal,
  Compass,
  Lock,
  MascotLamb,
  ParentGateModal,
  Plus,
  Shield,
  Sparkles,
  Users,
} from "@kidzone/ui";
import { selectChildAction, unlockChildPinAction, setGuestAgeBandAction } from "./actions";
import { setParentPasscodeAction, verifyParentPasscodeAction } from "../parent/actions";
import type { AgeBand } from "@kidzone/utils";

export interface ProfileItem {
  id: string;
  nickname: string;
  avatarId: string;
  birthDate: string;
  ageBand: AgeBand;
  hasPin: boolean;
}

export interface ProfileSelectionClientProps {
  profiles: ProfileItem[];
  isAuthenticated: boolean;
  hasParentPasscode: boolean;
  currentActiveChildId?: string | null;
  currentGuestAgeBand?: AgeBand | null;
}

const AGE_BAND_DETAILS: Record<
  AgeBand,
  { name: string; range: string; desc: string; icon: string }
> = {
  b3_7: {
    name: "Little Lambs",
    range: "Ages 3 to 7",
    desc: "Gentle Bible stories, read aloud audio, and colorful saint pictures.",
    icon: "🐑",
  },
  b8_10: {
    name: "Seekers",
    range: "Ages 8 to 10",
    desc: "Engaging scriptures, Catholic virtues, and catechism questions.",
    icon: "🕊️",
  },
  b11_15: {
    name: "Disciples",
    range: "Ages 11 to 15",
    desc: "Full scripture readings, church history, and saint reflections.",
    icon: "⭐",
  },
};

export function ProfileSelectionClient({
  profiles,
  isAuthenticated,
  hasParentPasscode,
  currentActiveChildId,
  currentGuestAgeBand,
}: ProfileSelectionClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Child PIN modal state
  const [pinModalProfile, setPinModalProfile] = useState<ProfileItem | null>(null);

  // Parent Gate modal state
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);

  const handleChildSelect = async (profile: ProfileItem) => {
    if (profile.hasPin) {
      setPinModalProfile(profile);
      return;
    }

    startTransition(async () => {
      const res = await selectChildAction(profile.id);
      if (res.requiresPin) {
        setPinModalProfile(profile);
      } else if (res.success) {
        router.push("/");
        router.refresh();
      }
    });
  };

  const handlePinSuccess = async (pin: string) => {
    if (!pinModalProfile) {
      return { success: false, error: "Profile missing" };
    }

    const res = await unlockChildPinAction(pinModalProfile.id, pin);
    if (res.success) {
      setPinModalProfile(null);
      router.push("/");
      router.refresh();
    }
    return res;
  };

  const handleGuestSelect = (band: AgeBand) => {
    startTransition(async () => {
      const res = await setGuestAgeBandAction(band);
      if (res.success) {
        router.push("/");
        router.refresh();
      }
    });
  };

  const handleParentGateSuccess = async (passcode: string) => {
    if (!hasParentPasscode) {
      const setRes = await setParentPasscodeAction(passcode);
      if (!setRes.success) {
        throw new Error(setRes.error || "Failed to set passcode");
      }
    } else {
      const res = await verifyParentPasscodeAction(passcode);
      if (!res.success) {
        throw new Error(res.error || "Incorrect passcode");
      }
    }
    setIsParentGateOpen(false);
    router.push("/parent");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 px-4 py-8 sm:py-12">
      {/* Header and Welcome */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="bg-orange-tint font-heading text-orange-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wide">
          <Sparkles className="h-4 w-4" />
          <span>Catholic Learning Companion</span>
        </div>

        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          Who is learning today?
        </h1>
        <p className="font-body text-ink-soft max-w-md text-base">
          Select your child profile to enter tailored Catholic readings, stories, and quizzes.
        </p>
      </div>

      {/* Authenticated Household Profiles Section */}
      {isAuthenticated && (
        <section aria-labelledby="household-profiles-heading" className="w-full space-y-5">
          <div className="border-sand-border flex items-center justify-between border-b-2 pb-2">
            <h2
              id="household-profiles-heading"
              className="font-heading text-ink flex items-center gap-2 text-lg font-black"
            >
              <Users className="text-orange h-5 w-5" />
              <span>Family Profiles</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsParentGateOpen(true)}
              className="font-heading text-orange hover:text-orange-deep flex min-h-[48px] items-center gap-1 px-2 text-xs font-extrabold"
            >
              <Plus className="h-4 w-4" />
              <span>Add Child Profile</span>
            </button>
          </div>

          {profiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {profiles.map((child) => {
                const isSelected = child.id === currentActiveChildId;
                const bandInfo = AGE_BAND_DETAILS[child.ageBand];

                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleChildSelect(child)}
                    disabled={isPending}
                    className={`group relative flex min-h-[160px] flex-col items-center rounded-3xl border-2 p-5 text-center transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "border-orange shadow-card-lifted ring-orange/30 bg-white ring-2"
                        : "border-sand-border shadow-card-rest hover:border-orange hover:shadow-card-hover bg-white"
                    }`}
                  >
                    {/* Optional Lock Indicator */}
                    {child.hasPin && (
                      <span
                        title="Protected with secret key"
                        className="bg-sand border-sand-border text-ink-soft absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border"
                      >
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                    )}

                    {/* Avatar */}
                    <div className="pb-3 transition-transform duration-200 group-hover:scale-105">
                      <ChildAvatar avatar={child.avatarId} size="lg" />
                    </div>

                    {/* Nickname */}
                    <span className="font-heading text-ink max-w-full truncate text-lg font-black">
                      {child.nickname}
                    </span>

                    {/* Derived Age Band Pill */}
                    <span className="font-heading bg-sand text-ink-soft mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold">
                      {bandInfo.name}
                    </span>
                  </button>
                );
              })}

              {/* Add Child Card */}
              <button
                type="button"
                onClick={() => setIsParentGateOpen(true)}
                className="border-sand-border bg-sand/50 hover:border-orange group flex min-h-[160px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-5 transition-all duration-200 hover:bg-white"
              >
                <div className="bg-cream border-sand-border text-ink-soft group-hover:text-orange group-hover:border-orange mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-heading text-ink-soft group-hover:text-ink text-sm font-extrabold">
                  Add Child
                </span>
              </button>
            </div>
          ) : (
            <div className="border-sand-border shadow-card-rest space-y-4 rounded-3xl border-2 bg-white p-6 text-center">
              <div className="flex justify-center">
                <MascotLamb size="md" mood="encouraging" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-ink text-lg font-black">
                  No child profiles added yet
                </h3>
                <p className="font-body text-ink-soft mx-auto max-w-sm text-sm">
                  Create your first child profile so they can enjoy age tailored Bible lessons and
                  church puzzles.
                </p>
              </div>
              <div>
                <Button variant="primary" size="md" onClick={() => setIsParentGateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Create First Profile</span>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Sign In Recommendation for Visiting Families */}
      {!isAuthenticated && (
        <div className="bg-orange-tint/40 border-orange/20 flex w-full flex-col items-center justify-between gap-3 rounded-2xl border-2 p-4 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-heading text-ink text-sm font-black">Have a family account?</h3>
            <p className="font-body text-ink-soft text-xs">
              Sign in to save your child learning progress and stars across devices.
            </p>
          </div>
          <a
            href="/login?next=/select-profile"
            className="bg-orange text-ink font-heading hover:bg-orange/90 text-decoration-none inline-flex min-h-[48px] items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition-colors"
          >
            <span>Sign in as parent</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Guest Exploration Mode Section */}
      <section aria-labelledby="guest-mode-heading" className="w-full space-y-5 pt-2">
        <div className="border-sand-border flex items-center justify-between border-b-2 pb-2">
          <h2
            id="guest-mode-heading"
            className="font-heading text-ink flex items-center gap-2 text-lg font-black"
          >
            <Compass className="text-blue h-5 w-5" />
            <span>Guest Exploration Mode</span>
          </h2>
          <span className="font-body text-ink-soft text-xs">
            Zero account needed · Stays on device
          </span>
        </div>

        <p className="font-body text-ink-soft text-sm">
          Pick an age band to preview Catholic learning content. All progress stays safely on this
          device with zero database records created.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["b3_7", "b8_10", "b11_15"] as AgeBand[]).map((band) => {
            const details = AGE_BAND_DETAILS[band];
            const isSelected = !isAuthenticated && currentGuestAgeBand === band;

            return (
              <button
                key={band}
                type="button"
                onClick={() => handleGuestSelect(band)}
                disabled={isPending}
                className={`flex flex-col space-y-2 rounded-3xl border-2 p-5 text-left transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "border-blue shadow-card-lifted ring-blue/30 bg-white ring-2"
                    : "border-sand-border shadow-card-rest hover:border-blue hover:shadow-card-hover bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="select-none text-3xl" aria-hidden="true">
                    {details.icon}
                  </span>
                  <span className="font-heading bg-blue-tint text-blue-deep rounded-full px-2.5 py-1 text-xs font-extrabold">
                    {details.range}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading text-ink text-lg font-black">{details.name}</h3>
                  <p className="font-body text-ink-soft text-xs leading-relaxed">{details.desc}</p>
                </div>

                <div className="font-heading text-blue flex items-center gap-1 pt-2 text-xs font-extrabold transition-transform group-hover:translate-x-1">
                  <span>Explore as Guest</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Parent Portal Bottom Action with Gate Keypad */}
      <div className="border-sand-border flex w-full flex-col items-center space-y-2 border-t-2 pt-4 text-center">
        <button
          type="button"
          onClick={() => setIsParentGateOpen(true)}
          className="bg-sand border-sand-border font-heading text-ink hover:bg-sand-border inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 px-5 py-3 text-sm font-extrabold transition-colors"
        >
          <Shield className="text-orange h-4 w-4" />
          <span>Parent Portal and Settings</span>
          <Lock className="text-ink-soft h-3.5 w-3.5" />
        </button>
        <p className="font-body text-ink-soft text-xs">
          Protected by household passcode to keep family controls in parent hands.
        </p>
      </div>

      {/* Child PIN Keypad Modal */}
      {pinModalProfile && (
        <ChildPinModal
          isOpen={Boolean(pinModalProfile)}
          childName={pinModalProfile.nickname}
          avatarId={pinModalProfile.avatarId}
          onClose={() => setPinModalProfile(null)}
          onSuccess={handlePinSuccess}
        />
      )}

      {/* Parent Gate Keypad Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
        title="Parent Gate"
        subtitle="Enter your 4-digit parent passcode to access household settings."
        isSetupMode={!hasParentPasscode}
      />
    </div>
  );
}
