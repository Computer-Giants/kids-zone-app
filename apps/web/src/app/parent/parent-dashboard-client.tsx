"use client";

import {
  Button,
  ChildAvatar,
  Lock,
  MascotLamb,
  ParentGateModal,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "@kidzone/ui";
import { calculateAgeBand, formatAgeBand } from "@kidzone/utils";
import React, { useState, useTransition } from "react";
import {
  deleteChildAction,
  setParentPasscodeAction,
  toggleLeaderboardVisibilityAction,
} from "./actions";
import { CreateChildModal } from "./create-child-modal";

export interface ChildRecord {
  id: string;
  nickname: string;
  avatar: string;
  birth_date: string;
  pin_hash: string | null;
  status: string;
  show_on_leaderboard?: boolean;
}

export interface ParentDashboardClientProps {
  children: ChildRecord[];
  hasPasscode: boolean;
}

export function ParentDashboardClient({ children, hasPasscode }: ParentDashboardClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSetPasscode = async (passcode: string) => {
    const res = await setParentPasscodeAction(passcode);
    if (!res.success) {
      throw new Error(res.error || "Failed to set passcode");
    }
    setIsPasscodeModalOpen(false);
  };

  const handleDeleteChild = (childId: string) => {
    if (hasPasscode) {
      setChildToDelete(childId);
    } else {
      if (confirm("Are you sure you want to remove this learning profile?")) {
        startTransition(async () => {
          await deleteChildAction(childId);
        });
      }
    }
  };

  const handleConfirmDelete = async (passcode: string) => {
    if (!childToDelete) {
      return;
    }
    const res = await deleteChildAction(childToDelete, passcode);
    if (!res.success) {
      throw new Error(res.error || "Incorrect passcode");
    }
    setChildToDelete(null);
  };

  return (
    <div className="space-y-8">
      {/* Security Passcode Banner */}
      {!hasPasscode ? (
        <div className="border-orange/30 bg-orange-tint/40 shadow-xs flex flex-col items-start justify-between gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="bg-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-ink text-base font-bold">
                Set Household Security Passcode
              </h3>
              <p className="text-ink-soft text-xs">
                Add a 4-digit numeric key to keep little fingers from changing household settings on
                family devices.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsPasscodeModalOpen(true)}
            className="shrink-0"
          >
            Set 4-Digit Passcode
          </Button>
        </div>
      ) : (
        <div className="border-sand-border text-ink-soft flex items-center justify-between rounded-2xl border bg-white p-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-deep h-4 w-4" aria-hidden="true" />
            <span>Household security passcode active.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPasscodeModalOpen(true)}
            className="font-heading text-slate hover:text-ink focus-accessible cursor-pointer font-bold underline"
          >
            Change Passcode
          </button>
        </div>
      )}

      {/* Children Section */}
      <div className="border-sand-border shadow-card-rest rounded-2xl border-2 bg-white p-6 md:p-8">
        <div className="border-sand-border flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-ink text-2xl font-bold">Children Profiles</h2>
            <span className="bg-sand font-heading text-ink rounded-full px-2.5 py-0.5 text-xs font-bold">
              {children.length}
            </span>
          </div>

          <Button
            type="button"
            variant="parent"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span>Add Child Profile</span>
          </Button>
        </div>

        {children.length === 0 ? (
          /* Empty State */
          <div className="border-sand-border bg-cream/50 mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
            <div className="mb-4">
              <MascotLamb size="md" mood="happy" />
            </div>
            <h3 className="font-heading text-ink text-lg font-bold">No child profiles yet</h3>
            <p className="text-ink-soft mx-auto mt-1.5 max-w-md text-sm">
              Add your children with fun Catholic avatars, age bands, and optional sibling PINs.
              Children never need passwords or emails.
            </p>
            <div className="mt-6">
              <Button variant="parent" size="md" onClick={() => setIsCreateModalOpen(true)}>
                + Add First Child Profile
              </Button>
            </div>
          </div>
        ) : (
          /* Children Grid */
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {children.map((child) => {
              const band = calculateAgeBand(child.birth_date);
              const hasPin = Boolean(child.pin_hash);

              return (
                <div
                  key={child.id}
                  className="border-sand-border hover:border-slate/40 shadow-xs relative flex items-center justify-between rounded-2xl border-2 bg-white p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <ChildAvatar avatar={child.avatar} size="lg" />
                    <div>
                      <h3 className="font-heading text-ink text-lg font-bold">{child.nickname}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="bg-slate-tint font-heading text-slate rounded-full px-2.5 py-0.5 text-xs font-bold">
                          {formatAgeBand(band)}
                        </span>
                        {hasPin && (
                          <span
                            className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800"
                            title="4-digit sibling PIN active"
                          >
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            PIN
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-[11px] font-bold text-yellow-900"
                          title="Permanent spiritual progress stars"
                        >
                          ⭐ Active Explorer
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVisibility = child.show_on_leaderboard === false ? true : false;
                        startTransition(async () => {
                          await toggleLeaderboardVisibilityAction(child.id, nextVisibility);
                        });
                      }}
                      disabled={isPending}
                      title={
                        child.show_on_leaderboard !== false
                          ? "Visible on weekly stars leaderboard (tap to hide)"
                          : "Hidden from weekly stars leaderboard (tap to show)"
                      }
                      className="border-sand-border bg-sand text-ink-soft hover:text-ink focus-accessible cursor-pointer rounded-xl border px-2.5 py-1 text-xs font-bold transition-colors"
                    >
                      {child.show_on_leaderboard !== false ? "🏆 Public" : "🔒 Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteChild(child.id)}
                      disabled={isPending}
                      aria-label={`Remove profile for ${child.nickname}`}
                      className="text-ink-soft hover:bg-red-tint hover:text-red-deep focus-accessible cursor-pointer rounded-xl p-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Child Creation Modal */}
      <CreateChildModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Parent Passcode Setup Modal */}
      <ParentGateModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={handleSetPasscode}
        isSetupMode={!hasPasscode}
        title={hasPasscode ? "Change Passcode" : "Set Household Passcode"}
        subtitle="Accessible 4-digit key protecting parent settings on family devices."
      />

      {/* Delete Child Passcode Gate Modal */}
      <ParentGateModal
        isOpen={Boolean(childToDelete)}
        onClose={() => setChildToDelete(null)}
        onSuccess={handleConfirmDelete}
        title="Confirm Profile Deletion"
        subtitle="Enter your 4-digit household passcode to permanently remove this profile."
      />
    </div>
  );
}
