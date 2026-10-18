"use client";

import React, { useEffect, useState } from "react";
import { ChurchItemBadge } from "./church-tour-illustrations";
import { MascotLamb } from "./mascot-lamb";
import { Button } from "./button";

export interface ChurchItemData {
  id: string;
  title: string;
  illustrationSvgKey: string;
  reverenceNote: string;
  simplifiedTextBand3_7: string;
  simplifiedTextBand8_10: string;
  simplifiedTextBand11_15: string;
  glossaryTerm?: {
    slug: string;
    term: string;
  } | null;
}

export interface ChurchItemModalProps {
  item: ChurchItemData | null;
  initialAgeBand?: "b3_7" | "b8_10" | "b11_15";
  onClose: () => void;
  onGlossaryClick?: (slug: string) => void;
}

export function ChurchItemModal({
  item,
  initialAgeBand = "b3_7",
  onClose,
  onGlossaryClick,
}: ChurchItemModalProps) {
  const [selectedBand, setSelectedBand] = useState<"b3_7" | "b8_10" | "b11_15">(initialAgeBand);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setSelectedBand(initialAgeBand);
  }, [initialAgeBand, item]);

  useEffect(() => {
    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window);

    // Cancel speech when modal closes or item changes
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [item]);

  if (!item) return null;

  const activeText =
    selectedBand === "b3_7"
      ? item.simplifiedTextBand3_7
      : selectedBand === "b8_10"
        ? item.simplifiedTextBand8_10
        : item.simplifiedTextBand11_15;

  const handlePlayAudio = () => {
    if (!speechSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeText);
    utterance.rate = selectedBand === "b3_7" ? 0.85 : 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseAudio = () => {
    if (!speechSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStopAudio = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="church-item-title"
    >
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Bottom sheet card */}
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border-2 border-amber-300 bg-amber-50/95 p-6 shadow-2xl backdrop-blur-md sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChurchItemBadge itemKey={item.illustrationSvgKey} />
            <div>
              <h2 id="church-item-title" className="font-heading text-2xl font-bold text-stone-900">
                {item.title}
              </h2>
              {item.glossaryTerm && (
                <button
                  type="button"
                  onClick={() => onGlossaryClick?.(item.glossaryTerm!.slug)}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 underline hover:text-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span>View in Catechism Glossary</span>
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-200/80 text-stone-700 transition-colors hover:bg-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Age Band Switcher */}
        <div className="mt-5 flex rounded-xl border border-amber-200 bg-amber-100/70 p-1">
          <button
            type="button"
            onClick={() => {
              handleStopAudio();
              setSelectedBand("b3_7");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              selectedBand === "b3_7"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-900 hover:bg-amber-200/60"
            }`}
          >
            Ages 3 to 7
          </button>
          <button
            type="button"
            onClick={() => {
              handleStopAudio();
              setSelectedBand("b8_10");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              selectedBand === "b8_10"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-900 hover:bg-amber-200/60"
            }`}
          >
            Ages 8 to 10
          </button>
          <button
            type="button"
            onClick={() => {
              handleStopAudio();
              setSelectedBand("b11_15");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              selectedBand === "b11_15"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-900 hover:bg-amber-200/60"
            }`}
          >
            Ages 11 to 15
          </button>
        </div>

        {/* Explanation Copy */}
        <div className="mt-4 rounded-2xl border border-amber-200/60 bg-white/90 p-4 shadow-sm">
          <p className="text-base font-medium leading-relaxed text-stone-800">{activeText}</p>

          {/* Web Speech Narration Audio Player Controls */}
          {speechSupported && (
            <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${isSpeaking ? "animate-pulse bg-green-500" : "bg-stone-300"}`}
                />
                {isSpeaking ? (isPaused ? "Paused" : "Reading aloud...") : "Listen along"}
              </span>

              <div className="flex items-center gap-2">
                {!isSpeaking || isPaused ? (
                  <button
                    type="button"
                    onClick={handlePlayAudio}
                    className="flex h-10 items-center gap-1.5 rounded-full bg-amber-500 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                  >
                    <span>▶</span>
                    <span>{isPaused ? "Resume" : "Read Aloud"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePauseAudio}
                    className="flex h-10 items-center gap-1.5 rounded-full border-2 border-amber-300 bg-white px-4 text-xs font-bold text-amber-900 shadow-sm transition-all hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                  >
                    <span>⏸</span>
                    <span>Pause</span>
                  </button>
                )}

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopAudio}
                    className="flex h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-stone-600 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reverence Guidance Box: "How we behave" */}
        <div className="mt-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <MascotLamb size="sm" mood="encouraging" className="shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-emerald-900">
                How We Behave (Catholic Reverence)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-emerald-800">{item.reverenceNote}</p>
            </div>
          </div>
        </div>

        {/* Footer Done button */}
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Got it, thank you!
          </Button>
        </div>
      </div>
    </div>
  );
}
