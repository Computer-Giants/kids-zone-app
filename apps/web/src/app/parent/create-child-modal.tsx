"use client";

import {
  ArrowLeft,
  ArrowRight,
  AVATAR_DEFINITIONS,
  AvatarPicker,
  Button,
  Check,
  ChildAvatar,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  type AvatarKey,
} from "@kidzone/ui";
import { calculateAgeBand, formatAgeBand } from "@kidzone/utils";
import React, { useState, useTransition } from "react";
import { createChildAction } from "./actions";

export interface CreateChildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChildModal({ isOpen, onClose }: CreateChildModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<AvatarKey>("lamb");
  const [birthDate, setBirthDate] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) {
    return null;
  }

  const selectedDef = AVATAR_DEFINITIONS.find((a) => a.key === avatar);
  const ageBandPreview = birthDate ? calculateAgeBand(birthDate) : null;

  const getReadingLevelDescription = (band: string) => {
    switch (band) {
      case "b3_7":
        return "Grade 1 to 2 level with full read aloud support";
      case "b8_10":
        return "Grade 3 to 5 level with interactive faith stories";
      case "b11_15":
        return "Grade 6 to 8 level with deeper Catholic doctrine";
      default:
        return "Calibrated to your child's age band";
    }
  };

  const handleClose = () => {
    if (isPending) return;
    setError(null);
    setStep(1);
    onClose();
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!nickname.trim()) {
        setError("Please choose a nickname for your child.");
        return;
      }
      if (nickname.trim().length > 30) {
        setError("Nickname must be 30 characters or fewer.");
        return;
      }
      if (!birthDate) {
        setError("Please select your child's birth date.");
        return;
      }
      setStep(3);
    }
  };

  const handleFinalSubmit = () => {
    setError(null);

    if (!nickname.trim()) {
      setStep(2);
      setError("Please choose a nickname for your child.");
      return;
    }

    if (!birthDate) {
      setStep(2);
      setError("Please select your child's birth date.");
      return;
    }

    if (pin.trim() && pin.trim().length !== 4) {
      setError("Sibling PIN must be exactly 4 digits, or left blank.");
      return;
    }

    startTransition(async () => {
      const res = await createChildAction({
        nickname: nickname.trim(),
        avatar,
        birthDate,
        pin: pin.trim() || undefined,
      });

      if (!res.success && res.error) {
        setError(res.error);
      } else {
        // Reset state and close modal
        setNickname("");
        setBirthDate("");
        setPin("");
        setAvatar("lamb");
        setStep(1);
        onClose();
      }
    });
  };

  return (
    <div
      className="bg-ink/60 backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center p-3 duration-200 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-child-title"
    >
      <div className="border-sand-border relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border-2 bg-white shadow-2xl sm:max-h-[88vh]">
        {/* Step Indicator Top Bar */}
        <div className="border-sand-border bg-cream/40 flex shrink-0 items-center justify-between border-b-2 px-5 py-3.5">
          <div className="flex items-center gap-2 sm:gap-3" aria-label="Creation progress">
            {[
              { num: 1, label: "Avatar" },
              { num: 2, label: "Details" },
              { num: 3, label: "Security" },
            ].map((s, idx) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`font-heading flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
                      isCurrent
                        ? "bg-orange shadow-xs scale-105 text-white"
                        : isDone
                          ? "bg-green text-white"
                          : "bg-sand text-ink-soft"
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : s.num}
                  </div>
                  <span
                    className={`font-heading text-xs font-bold ${
                      isCurrent ? "text-ink font-black" : "text-ink-soft hidden sm:inline"
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < 2 && <div className="bg-sand-border mx-0.5 h-0.5 w-4 sm:mx-1 sm:w-8" />}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close child creation modal"
            className="text-ink-soft hover:bg-slate-tint hover:text-ink focus-accessible cursor-pointer rounded-xl p-2 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="border-red/20 bg-red-tint text-red-deep animate-shake rounded-2xl border p-3.5 text-xs font-semibold"
            >
              {error}
            </div>
          )}

          {/* Step 1: Avatar Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="font-heading text-orange text-xs font-bold uppercase tracking-wider">
                  Step 1 of 3
                </span>
                <h2
                  id="create-child-title"
                  className="font-heading text-ink mt-0.5 text-xl font-black sm:text-2xl"
                >
                  Choose Learning Companion
                </h2>
                <p className="text-ink-soft mt-1 text-xs sm:text-sm">
                  Pick a Catholic symbol, saint, or mascot for your child. They will see this
                  companion throughout their learning journey.
                </p>
              </div>

              {/* Selected Avatar Highlight Card */}
              {selectedDef && (
                <div className="bg-orange-tint/40 border-orange/20 shadow-xs flex items-center gap-3.5 rounded-2xl border-2 p-3.5">
                  <div className="relative">
                    <ChildAvatar avatar={avatar} size="lg" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-ink text-base font-bold">
                        {selectedDef.label}
                      </span>
                      <span className="text-orange-deep font-heading border-orange/20 rounded-full border bg-white px-2 py-0.5 text-xs font-bold">
                        Selected
                      </span>
                    </div>
                    <span className="text-ink-soft mt-0.5 text-xs">{selectedDef.description}</span>
                  </div>
                </div>
              )}

              {/* Responsive Avatar Picker Grid */}
              <div>
                <AvatarPicker
                  selectedAvatar={avatar}
                  onSelect={(key) => {
                    setAvatar(key);
                    setError(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Child Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="font-heading text-orange text-xs font-bold uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h2
                  id="create-child-title"
                  className="font-heading text-ink mt-0.5 text-xl font-black sm:text-2xl"
                >
                  Child Profile Details
                </h2>
                <p className="text-ink-soft mt-1 text-xs sm:text-sm">
                  Provide a nickname and birth date to calibrate Catholic reading levels. No real
                  names or emails are stored.
                </p>
              </div>

              {/* Avatar Summary Pill */}
              <div className="bg-slate-tint/50 border-sand-border flex items-center gap-3 rounded-2xl border p-3">
                <ChildAvatar avatar={avatar} size="md" />
                <div>
                  <span className="font-heading text-ink text-xs font-bold">
                    Companion: {selectedDef?.label || "Catholic Mascot"}
                  </span>
                  <p className="text-ink-soft text-[11px]">
                    Tap &quot;Back&quot; anytime to change this avatar.
                  </p>
                </div>
              </div>

              {/* Nickname Input */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="child-nickname"
                    className="font-heading text-ink text-sm font-bold"
                  >
                    Child Nickname <span className="text-orange">*</span>
                  </label>
                  <span className="text-ink-soft text-xs">{nickname.length}/30</span>
                </div>
                <input
                  id="child-nickname"
                  type="text"
                  required
                  maxLength={30}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. David, Little Mary, Sammy"
                  className="border-sand-border text-ink placeholder:text-ink-soft/40 focus:border-orange focus:ring-orange/20 shadow-xs min-h-[48px] w-full rounded-2xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
                />
                <p className="text-ink-soft mt-1.5 text-xs">
                  Shown on family screens and parish star leaderboards. Never enter a child&apos;s
                  real full name.
                </p>
              </div>

              {/* Birth Date Input & Age Band Preview */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="child-birthdate"
                    className="font-heading text-ink text-sm font-bold"
                  >
                    Birth Date <span className="text-orange">*</span>
                  </label>
                  {ageBandPreview && (
                    <span className="bg-sand font-heading text-ink rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {formatAgeBand(ageBandPreview)}
                    </span>
                  )}
                </div>
                <input
                  id="child-birthdate"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (error) setError(null);
                  }}
                  className="border-sand-border text-ink focus:border-orange focus:ring-orange/20 shadow-xs min-h-[48px] w-full cursor-pointer rounded-2xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
                />
                <p className="text-ink-soft mt-1.5 text-xs">
                  Used purely to determine recommended reading difficulty. Children can explore
                  stories at any level.
                </p>
              </div>

              {/* Derived Reading Level Live Card */}
              {ageBandPreview && (
                <div className="bg-blue-tint/50 border-blue/20 flex items-start gap-3 rounded-2xl border p-3.5">
                  <Sparkles className="text-blue-deep mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <div className="text-xs">
                    <span className="font-heading text-blue-deep block font-bold">
                      Recommended: {formatAgeBand(ageBandPreview)}
                    </span>
                    <span className="text-ink-soft mt-0.5 block">
                      {getReadingLevelDescription(ageBandPreview)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Security & Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="font-heading text-orange text-xs font-bold uppercase tracking-wider">
                  Step 3 of 3
                </span>
                <h2
                  id="create-child-title"
                  className="font-heading text-ink mt-0.5 text-xl font-black sm:text-2xl"
                >
                  Security & Profile Review
                </h2>
                <p className="text-ink-soft mt-1 text-xs sm:text-sm">
                  Optionally configure a sibling PIN and review profile settings before saving.
                </p>
              </div>

              {/* Sibling PIN Input */}
              <div className="border-sand-border space-y-2 rounded-2xl border-2 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Lock className="text-ink-soft h-4 w-4" aria-hidden="true" />
                  <label htmlFor="child-pin" className="font-heading text-ink text-sm font-bold">
                    Optional 4 Digit Sibling PIN
                  </label>
                </div>
                <input
                  id="child-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ""));
                    if (error) setError(null);
                  }}
                  placeholder="e.g. 1234 (leave blank for quick one tap entry)"
                  className="border-sand-border text-ink placeholder:text-ink-soft/40 focus:border-orange focus:ring-orange/20 shadow-xs min-h-[48px] w-full rounded-2xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
                />
                <p className="text-ink-soft text-xs">
                  Protects learning streaks, stars, and quiz records from curious siblings on shared
                  devices. Leave blank for one tap toddler access.
                </p>
              </div>

              {/* Profile Summary Card */}
              <div className="border-sand-border bg-cream/40 space-y-3.5 rounded-2xl border-2 p-4">
                <h3 className="font-heading text-ink-soft text-xs font-bold uppercase tracking-wider">
                  Profile Summary
                </h3>

                <div className="flex items-center gap-3.5">
                  <ChildAvatar avatar={avatar} size="lg" />
                  <div>
                    <h4 className="font-heading text-ink text-lg font-black">
                      {nickname || "Learning Profile"}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2">
                      {ageBandPreview && (
                        <span className="bg-slate-tint font-heading text-slate rounded-full px-2.5 py-0.5 text-xs font-bold">
                          {formatAgeBand(ageBandPreview)}
                        </span>
                      )}
                      <span className="bg-sand font-heading text-ink rounded-full px-2.5 py-0.5 text-xs font-bold">
                        {pin ? "PIN Protected" : "Quick Tap Access"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-sand-border text-green-deep flex items-center gap-2.5 border-t pt-2 text-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Human reviewed Catholic content. Zero child personal data collected.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Navigation Footer */}
        <div className="border-sand-border flex shrink-0 items-center justify-between border-t-2 bg-white px-5 py-3.5 sm:px-7 sm:py-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setError(null);
                setStep((s) => (s === 3 ? 2 : 1));
              }}
              disabled={isPending}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              disabled={isPending}
              className="text-sm"
            >
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              variant="parent"
              size="md"
              onClick={handleNextStep}
              className="flex items-center gap-2 text-sm"
            >
              <span>{step === 1 ? "Next: Details" : "Next: Security"}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="parent"
              size="md"
              onClick={handleFinalSubmit}
              disabled={isPending}
              className="flex items-center gap-2 text-sm"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>{isPending ? "Creating Profile..." : "Save Child Profile"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
