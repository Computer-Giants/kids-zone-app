"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, ParentGateModal, Share2, Sparkles } from "@kidzone/ui";

export interface SharePlatformCardProps {
  isAuthenticatedChild?: boolean;
  className?: string;
}

export function SharePlatformCard({
  isAuthenticatedChild = false,
  className,
}: SharePlatformCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const shareTitle = "Kid Zone — Catholic Learning & Skills for Children";
  const shareText =
    "Discover Kid Zone! A joyful Catholic learning platform for children aged 3 to 15 with sacred Scripture, holy saints, church tours, and free community skill classes. 100% priest reviewed!";

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://kidzone.app";
  };

  const executeNativeShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
      } catch (err: unknown) {
        // Silently ignore user aborts
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    } else {
      executeCopyLink();
    }
  };

  const executeWhatsAppShare = () => {
    const url = getShareUrl();
    const fullMessage = `${shareTitle}\n\n${shareText}\n\n${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const executeCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleProtectedAction = (action: () => void) => {
    if (isAuthenticatedChild) {
      setPendingAction(() => action);
      setIsGateOpen(true);
      return;
    }
    action();
  };

  const handleGateSuccess = () => {
    setIsGateOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
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
            <div className="border-blue-deep/20 bg-blue-tint text-blue-deep shadow-xs inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share With Families</span>
            </div>
            <span className="font-heading text-orange-deep text-xs font-bold">
              Spread Joyful Faith
            </span>
          </div>

          <h3 className="font-heading text-ink mt-3 text-xl font-bold sm:text-2xl">
            Invite Friends & Parishes
          </h3>

          <p className="font-body text-ink-soft mt-1.5 text-xs leading-relaxed sm:text-sm">
            Help Catholic parents, teachers, and catechists discover Kid Zone and Fr. Michael&apos;s
            free skills curriculum for children.
          </p>

          {/* Action Triggers Grid */}
          <div className="mt-5 space-y-3">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={() => handleProtectedAction(executeWhatsAppShare)}
              className="font-heading bg-green shadow-sticker-green hover:scale-101 active:scale-99 focus-visible:outline-blue-deep flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition-transform focus-visible:outline-4"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Quick Web Share & Copy Link Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleProtectedAction(executeNativeShare)}
                className="font-heading border-sand-border bg-sand text-ink shadow-xs hover:bg-orange-tint hover:border-orange focus-visible:outline-blue-deep flex min-h-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-4"
              >
                <Share2 className="text-orange-deep h-4 w-4" />
                <span>Device Share</span>
              </button>

              <button
                type="button"
                onClick={executeCopyLink}
                className="font-heading border-sand-border text-ink shadow-xs hover:bg-sand focus-visible:outline-blue-deep flex min-h-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 bg-white px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-4"
              >
                {isCopied ? (
                  <>
                    <Check className="text-green-deep h-4 w-4 stroke-[3]" />
                    <span className="text-green-deep">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="text-ink-soft h-4 w-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Faith Encouragement Note */}
        <div className="bg-blue-tint/50 text-blue-deep mt-5 flex items-center gap-2 rounded-xl p-2.5">
          <Sparkles className="h-4 w-4 shrink-0" />
          <p className="font-body text-[11px] font-semibold leading-snug">
            Sharing takes thirty seconds and helps a child grow in faith, music, computers, and
            virtue.
          </p>
        </div>
      </div>

      <ParentGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onSuccess={handleGateSuccess}
        title="Parent Verification"
        subtitle="Please enter your 4 digit household passcode before leaving the application."
      />
    </>
  );
}
