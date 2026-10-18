"use client";

import {
  AppShell,
  ChildAvatar,
  Compass,
  Lock,
  ParentGateModal,
  Users,
  type SectionKind,
} from "@kidzone/ui";
import { formatAgeBand } from "@kidzone/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { verifyParentPasscodeAction } from "../app/parent/actions";
import type { LearnerSession } from "../lib/child-session";

export interface AppShellProviderProps {
  children: React.ReactNode;
  initialLearner?: LearnerSession;
}

function resolveActiveSection(pathname: string | null): SectionKind {
  if (!pathname || pathname === "/") return "home";
  if (pathname.startsWith("/bible")) return "bible";
  if (pathname.startsWith("/saints")) return "saints";
  if (pathname.startsWith("/fun")) return "fun";
  if (pathname.startsWith("/chat")) return "chat";
  if (pathname.startsWith("/parent")) return "parents";
  return "home";
}

export function AppShellProvider({ children, initialLearner = null }: AppShellProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = resolveActiveSection(pathname);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  const handleParentGateClick = () => {
    setGateError(null);
    setIsGateOpen(true);
  };

  const handleGateVerify = async (passcode: string) => {
    const res = await verifyParentPasscodeAction(passcode);
    if (!res.success) {
      setGateError(res.error || "Incorrect passcode.");
      throw new Error(res.error || "Incorrect passcode");
    }
    setIsGateOpen(false);
    router.push("/parent");
  };

  const rightSlot = (
    <div className="flex items-center gap-2 sm:gap-3">
      {initialLearner && !initialLearner.isGuest ? (
        <a
          href="/select-profile"
          aria-label={`Active learner profile: ${initialLearner.nickname}. Tap to switch profile.`}
          className="bg-cream border-sand-border hover:border-orange hover:bg-orange-tint/40 text-decoration-none focus-accessible group flex min-h-[48px] items-center gap-2 rounded-full border-2 py-1 pl-1.5 pr-3 transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            <ChildAvatar avatar={initialLearner.avatarId} size="sm" showBorder={false} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading text-ink group-hover:text-orange-deep text-xs font-black leading-tight">
              {initialLearner.nickname}
            </span>
            <span className="font-body text-ink-soft text-[10px] font-bold leading-none">
              Switch
            </span>
          </div>
        </a>
      ) : initialLearner && initialLearner.isGuest ? (
        <a
          href="/select-profile"
          aria-label={`Guest mode: ${formatAgeBand(initialLearner.ageBand)}. Tap to switch profile.`}
          className="bg-blue-tint border-blue/20 hover:border-blue text-decoration-none focus-accessible group flex min-h-[48px] items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all"
        >
          <Compass className="text-blue-deep h-4 w-4" aria-hidden="true" />
          <div className="flex flex-col text-left">
            <span className="font-heading text-blue-deep text-xs font-black leading-tight">
              Guest ({formatAgeBand(initialLearner.ageBand)})
            </span>
            <span className="font-body text-ink-soft text-[10px] font-bold leading-none">
              Switch
            </span>
          </div>
        </a>
      ) : (
        <a
          href="/select-profile"
          aria-label="Select learner profile"
          className="bg-orange-tint text-orange-deep font-heading border-orange/20 hover:border-orange focus-accessible text-decoration-none flex min-h-[48px] items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all"
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Choose Profile</span>
        </a>
      )}

      {/* Parent Gate Link */}
      <a
        href="/parent"
        onClick={(e) => {
          e.preventDefault();
          handleParentGateClick();
        }}
        aria-label="Parent settings and accounts"
        className="bg-slate-tint text-slate font-heading border-sand-border hover:text-ink hover:border-slate focus-accessible text-decoration-none flex min-h-[48px] min-w-[48px] cursor-pointer items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-xs font-bold transition-all hover:bg-white"
      >
        <Lock className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Parents</span>
      </a>
    </div>
  );

  return (
    <>
      <AppShell
        activeSection={activeSection}
        onParentGateClick={handleParentGateClick}
        rightSlot={rightSlot}
        logoSrc="/images/favicon.svg"
      >
        {children}
      </AppShell>

      <ParentGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onSuccess={handleGateVerify}
        error={gateError}
        title="Parent Gate"
        subtitle="Enter your 4 digit household passcode to access parent controls."
      />
    </>
  );
}
