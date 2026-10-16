"use client";

import React, { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { Button } from "./button";
import { MascotLamb } from "./mascot-lamb";
import { cn } from "../lib/utils";

export interface ChildPinModalProps {
  isOpen: boolean;
  childName: string;
  avatarId?: string;
  onClose: () => void;
  onSuccess: (pin: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}

export function ChildPinModal({
  isOpen,
  childName,
  onClose,
  onSuccess,
  className,
}: ChildPinModalProps) {
  const [digits, setDigits] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleDigitPress = (digit: string) => {
    if (digits.length >= 4 || isSubmitting) {
      return;
    }
    const nextDigits = digits + digit;
    setDigits(nextDigits);
    setError(null);

    if (nextDigits.length === 4) {
      void handleSubmit(nextDigits);
    }
  };

  const handleBackspace = () => {
    if (digits.length > 0 && !isSubmitting) {
      setDigits(digits.slice(0, -1));
      setError(null);
    }
  };

  const handleClear = () => {
    if (!isSubmitting) {
      setDigits("");
      setError(null);
    }
  };

  const handleSubmit = async (pinToSubmit: string) => {
    try {
      setIsSubmitting(true);
      const res = await onSuccess(pinToSubmit);
      if (!res.success) {
        setError(res.error || "That key did not match. Let us try one more time!");
        setDigits("");
      }
    } catch {
      setError("Something went wrong. Let us try one more time!");
      setDigits("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="child-pin-modal-title"
      className="bg-ink/50 backdrop-blur-xs animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className={cn(
          "border-sand-border bg-sand shadow-card-lifted relative w-full max-w-sm space-y-5 rounded-3xl border-2 p-6",
          className,
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="text-ink-soft hover:bg-sand-border focus-accessible absolute right-4 top-4 flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-full p-2 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Header with Icon */}
        <div className="flex flex-col items-center space-y-2 pt-2 text-center">
          <div className="bg-orange-tint border-orange/20 text-orange-deep shadow-xs flex h-16 w-16 items-center justify-center rounded-2xl border-2">
            <KeyRound className="h-8 w-8" aria-hidden="true" />
          </div>

          <h2
            id="child-pin-modal-title"
            className="font-heading text-ink text-2xl font-black tracking-tight"
          >
            Enter {childName}&apos;s Key
          </h2>
          <p className="font-body text-ink-soft max-w-[240px] text-sm">
            Enter your four digit secret key to unlock your Catholic learning space.
          </p>
        </div>

        {/* 4 Pin Indicator Bubbles */}
        <div
          className="flex items-center justify-center gap-3 py-2"
          role="group"
          aria-label="Secret key input progress"
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = digits.length > idx;
            return (
              <div
                key={idx}
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-all duration-200",
                  isFilled
                    ? "bg-orange border-orange shadow-xs scale-110"
                    : "border-sand-border bg-white",
                )}
                aria-label={`Digit ${idx + 1}: ${isFilled ? "Entered" : "Empty"}`}
              />
            );
          })}
        </div>

        {/* Gentle Encouraging Error Banner (AC-4: Never red, warm encouragement) */}
        {error && (
          <div
            role="alert"
            className="bg-orange-tint border-orange/30 font-heading text-orange-deep animate-slide-up flex items-center gap-2.5 rounded-2xl border-2 p-3 text-xs font-extrabold"
          >
            <MascotLamb size="sm" mood="encouraging" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* 10 Digit Keypad (min 56px touch target for children) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1" role="group" aria-label="Keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              aria-label={`Digit ${digit}`}
              onClick={() => handleDigitPress(digit)}
              disabled={isSubmitting}
              className="border-sand-border font-heading text-ink hover:bg-cream shadow-xs focus-accessible flex h-14 min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-2xl border-2 bg-white text-2xl font-black transition-all active:scale-95"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting || digits.length === 0}
            className="bg-sand border-sand-border font-heading text-ink-soft hover:bg-sand-border focus-accessible flex h-14 min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-2xl border-2 text-xs font-extrabold transition-all active:scale-95 disabled:opacity-40"
          >
            Clear
          </button>

          <button
            type="button"
            aria-label="Digit 0"
            onClick={() => handleDigitPress("0")}
            disabled={isSubmitting}
            className="border-sand-border font-heading text-ink hover:bg-cream shadow-xs focus-accessible flex h-14 min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-2xl border-2 bg-white text-2xl font-black transition-all active:scale-95"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Delete last digit"
            disabled={isSubmitting || digits.length === 0}
            className="bg-sand border-sand-border font-heading text-ink-soft hover:bg-sand-border focus-accessible flex h-14 min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-2xl border-2 text-xs font-extrabold transition-all active:scale-95 disabled:opacity-40"
          >
            Delete
          </button>
        </div>

        {/* Footer cancel button */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="text-ink-soft w-full"
          >
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
