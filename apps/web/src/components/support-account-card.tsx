"use client";

import { useState } from "react";
import { Check, Copy, HeartHandshake, ParentGateModal, ShieldCheck } from "@kidzone/ui";

export interface SupportAccountCardProps {
  isAuthenticatedChild?: boolean;
  className?: string;
}

export function SupportAccountCard({
  isAuthenticatedChild = false,
  className,
}: SupportAccountCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const bankName = process.env.NEXT_PUBLIC_SUPPORT_BANK_NAME || "Zenith Bank";
  const accountName = "Fr. Michael Ifeanyi Ezeora (Kid Zone Ministry)";
  const accountNumber = process.env.NEXT_PUBLIC_SUPPORT_ACCOUNT_NUMBER || "1012345678";

  const performCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(accountNumber);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleCopyClick = () => {
    if (isAuthenticatedChild) {
      setIsGateOpen(true);
      return;
    }
    void performCopy();
  };

  const handleGateSuccess = () => {
    setIsGateOpen(false);
    void performCopy();
  };

  return (
    <>
      <div
        className={`border-sand-border shadow-card-rest flex flex-col justify-between rounded-3xl border-2 bg-white p-6 sm:p-7 ${
          className || ""
        }`}
      >
        <div>
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="border-orange/20 bg-orange-tint text-orange-deep shadow-xs inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Support Free Classes</span>
            </div>
            <span className="font-heading text-green-deep text-xs font-bold">
              100% Direct Impact
            </span>
          </div>

          <h3 className="font-heading text-ink mt-3 text-xl font-bold sm:text-2xl">
            Support Children Faith & Skills
          </h3>

          <p className="font-body text-ink-soft mt-1.5 text-xs leading-relaxed sm:text-sm">
            All voluntary support directly funds venue facilities, computers, instruments, and
            sports gear for free parish youth classes hosted by Fr. Michael.
          </p>

          {/* Account Details Box */}
          <div className="border-sand-border bg-cream mt-5 space-y-3 rounded-2xl border p-4">
            <div>
              <span className="font-heading text-ink-soft block text-[11px] font-bold uppercase tracking-wider">
                Bank Name
              </span>
              <span className="font-heading text-ink text-base font-extrabold sm:text-lg">
                {bankName}
              </span>
            </div>

            <div>
              <span className="font-heading text-ink-soft block text-[11px] font-bold uppercase tracking-wider">
                Account Name
              </span>
              <span className="font-heading text-ink text-sm font-bold sm:text-base">
                {accountName}
              </span>
            </div>

            <div className="border-sand-border flex items-end justify-between gap-2 border-t pt-3">
              <div>
                <span className="font-heading text-ink-soft block text-[11px] font-bold uppercase tracking-wider">
                  Account Number
                </span>
                <span className="font-heading text-orange-deep text-xl font-black tracking-widest sm:text-2xl">
                  {accountNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyClick}
                aria-label="Copy bank account number"
                className={`font-heading focus-visible:outline-blue-deep flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline-4 ${
                  isCopied
                    ? "bg-green shadow-sticker-green text-white"
                    : "bg-orange shadow-sticker-orange hover:scale-102 active:scale-98 text-white"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Safeguarding & Transparency Notice */}
        <div className="bg-sand/60 text-ink-soft mt-5 flex items-start gap-2 rounded-xl p-2.5">
          <ShieldCheck className="text-green-deep mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-body text-[11px] leading-relaxed">
            Financial support is intended for adult parents and parish benefactors. Kid Zone never
            charges fees to children or collects child payment data.
          </p>
        </div>
      </div>

      <ParentGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onSuccess={handleGateSuccess}
        title="Parent Verification"
        subtitle="Please enter your 4 digit household passcode to copy financial support details."
      />
    </>
  );
}
