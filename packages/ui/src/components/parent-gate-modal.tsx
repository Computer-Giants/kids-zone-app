"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (passcode: string) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  isSetupMode?: boolean;
  error?: string | null;
  className?: string;
}

export function ParentGateModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
  isSetupMode = false,
  error: externalError,
  className,
}: ParentGateModalProps) {
  const [digits, setDigits] = useState<string>("");
  const [setupStep, setSetupStep] = useState<"choose" | "confirm">("choose");
  const [firstEntry, setFirstEntry] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const activeError = externalError || localError;

  const handleClose = () => {
    setDigits("");
    setFirstEntry("");
    setSetupStep("choose");
    setLocalError(null);
    onClose();
  };

  const handleDigitPress = (digit: string) => {
    if (digits.length >= 4 || isSubmitting) {
      return;
    }
    const nextDigits = digits + digit;
    setDigits(nextDigits);
    setLocalError(null);

    if (nextDigits.length === 4) {
      if (isSetupMode) {
        if (setupStep === "choose") {
          // Transition to confirmation step
          setFirstEntry(nextDigits);
          setDigits("");
          setSetupStep("confirm");
        } else {
          // Verify confirmation matches first entry
          if (nextDigits === firstEntry) {
            handleSubmit(nextDigits);
          } else {
            setLocalError("Passcodes do not match. Please choose again.");
            setDigits("");
            setFirstEntry("");
            setSetupStep("choose");
          }
        }
      } else {
        handleSubmit(nextDigits);
      }
    }
  };

  const handleBackspace = () => {
    if (digits.length > 0 && !isSubmitting) {
      setDigits(digits.slice(0, -1));
      setLocalError(null);
    }
  };

  const handleClear = () => {
    if (!isSubmitting) {
      setDigits("");
      setLocalError(null);
    }
  };

  const handleSubmit = async (passcodeToSubmit: string) => {
    try {
      setIsSubmitting(true);
      await onSuccess(passcodeToSubmit);
      // Reset state on successful submission
      setDigits("");
      setFirstEntry("");
      setSetupStep("choose");
    } catch (err) {
      const defaultMsg = isSetupMode
        ? "Failed to save passcode. Please try again."
        : "Incorrect passcode. Please try again.";
      setLocalError(err instanceof Error && err.message ? err.message : defaultMsg);
      setDigits("");
      if (isSetupMode) {
        setFirstEntry("");
        setSetupStep("choose");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-ink/60 backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center p-4 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-gate-title"
    >
      <div
        className={cn(
          "border-sand-border relative w-full max-w-sm space-y-5 rounded-3xl border-2 bg-white p-6 text-center shadow-2xl sm:p-8",
          className,
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close parent gate"
          className="text-ink-soft hover:bg-slate-tint hover:text-ink focus-accessible absolute right-4 top-4 cursor-pointer rounded-xl p-2 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Header Icon */}
        <div className="bg-slate-tint text-slate shadow-xs mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          {isSetupMode ? (
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          ) : (
            <Lock className="h-7 w-7" aria-hidden="true" />
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h2 id="parent-gate-title" className="font-heading text-ink text-2xl font-bold">
            {isSetupMode && setupStep === "confirm"
              ? "Confirm Passcode"
              : title || (isSetupMode ? "Set Parent Passcode" : "Parent Verification")}
          </h2>
          <p className="text-ink-soft mt-1 text-sm">
            {isSetupMode && setupStep === "confirm"
              ? "Re enter the same 4 digit passcode to verify."
              : subtitle ||
                (isSetupMode
                  ? "Choose a 4 digit passcode to protect household settings."
                  : "Enter your 4 digit passcode to continue.")}
          </p>
          {isSetupMode && setupStep === "confirm" && (
            <button
              type="button"
              onClick={() => {
                setDigits("");
                setFirstEntry("");
                setSetupStep("choose");
                setLocalError(null);
              }}
              className="font-heading text-slate hover:text-ink focus-accessible mt-2 cursor-pointer text-xs font-bold underline"
            >
              Start over with different passcode
            </button>
          )}
        </div>

        {/* 4 Digit Visual Indicators */}
        <div
          className="flex items-center justify-center gap-3 py-2"
          aria-live="polite"
          aria-label={`${digits.length} of 4 digits entered`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = digits.length > index;
            return (
              <div
                key={index}
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-all duration-150",
                  isFilled
                    ? "bg-slate border-slate shadow-xs scale-110"
                    : "border-sand-border bg-slate-tint/50",
                )}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        {activeError && (
          <div
            role="alert"
            className="border-red/20 bg-red-tint text-red-deep animate-shake rounded-xl border p-2 text-xs font-semibold"
          >
            {activeError}
          </div>
        )}

        {/* Accessible Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1" role="group" aria-label="Keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              aria-label={`Digit ${num}`}
              disabled={isSubmitting}
              onClick={() => handleDigitPress(num)}
              className="border-sand-border font-heading text-ink hover:bg-slate-tint hover:border-slate shadow-xs focus-accessible min-h-[56px] min-w-[56px] cursor-pointer rounded-2xl border-2 bg-white text-2xl font-bold transition-all active:scale-95"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            disabled={isSubmitting || digits.length === 0}
            onClick={handleClear}
            className="border-sand-border bg-slate-tint font-heading text-ink-soft hover:text-ink focus-accessible min-h-[56px] min-w-[56px] cursor-pointer rounded-2xl border-2 text-sm font-bold transition-all hover:bg-white active:scale-95 disabled:opacity-40"
          >
            Clear
          </button>

          {/* 0 Button */}
          <button
            type="button"
            aria-label="Digit 0"
            disabled={isSubmitting}
            onClick={() => handleDigitPress("0")}
            className="border-sand-border font-heading text-ink hover:bg-slate-tint hover:border-slate shadow-xs focus-accessible min-h-[56px] min-w-[56px] cursor-pointer rounded-2xl border-2 bg-white text-2xl font-bold transition-all active:scale-95"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            disabled={isSubmitting || digits.length === 0}
            onClick={handleBackspace}
            aria-label="Delete last digit"
            className="border-sand-border bg-slate-tint font-heading text-ink-soft hover:text-ink focus-accessible min-h-[56px] min-w-[56px] cursor-pointer rounded-2xl border-2 text-lg font-bold transition-all hover:bg-white active:scale-95 disabled:opacity-40"
          >
            ⌫
          </button>
        </div>

        {/* Cancel Action */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full text-sm"
          >
            Cancel and Return
          </Button>
        </div>
      </div>
    </div>
  );
}
