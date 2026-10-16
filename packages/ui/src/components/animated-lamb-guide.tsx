"use client";

import { useState } from "react";
import type { LambMood, LambSize } from "./mascot-lamb";
import { cn } from "../lib/utils";

export interface AnimatedLambGuideProps {
  mood?: LambMood;
  size?: LambSize;
  speechText?: string;
  speechSpeaker?: string;
  speechPosition?: "top" | "right" | "bottom" | "left";
  onTap?: () => void;
  onSpeechDismiss?: () => void;
  interactive?: boolean;
  className?: string;
}

const sizePixels: Record<LambSize, { width: number; height: number }> = {
  sm: { width: 64, height: 64 },
  md: { width: 96, height: 96 },
  lg: { width: 128, height: 128 },
  xl: { width: 160, height: 160 },
};

export function AnimatedLambGuide({
  mood: initialMood = "happy",
  size = "md",
  speechText,
  speechSpeaker = "Little Lamb",
  speechPosition = "top",
  onTap,
  onSpeechDismiss,
  interactive = true,
  className,
}: AnimatedLambGuideProps) {
  const [currentMood, setCurrentMood] = useState<LambMood>(initialMood);
  const [isHopping, setIsHopping] = useState(false);
  const { width, height } = sizePixels[size];

  // Active mood prioritizes prop if supplied and updated
  const activeMood = initialMood !== "happy" ? initialMood : currentMood;

  const handleTap = () => {
    if (!interactive) return;

    // Trigger celebration hop
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 650);

    // If no parent tap handler, cycle through encouraging moods on click
    if (onTap) {
      onTap();
    } else {
      const moods: LambMood[] = ["happy", "celebrating", "thinking", "encouraging"];
      const nextIndex = (moods.indexOf(activeMood) + 1) % moods.length;
      const nextMood = moods[nextIndex] ?? "happy";
      setCurrentMood(nextMood);
    }
  };

  const isCelebrating = activeMood === "celebrating";
  const isEncouraging = activeMood === "encouraging";
  const isThinking = activeMood === "thinking";

  return (
    <div
      className={cn(
        "relative inline-flex select-none flex-col items-center",
        speechPosition === "right" && "sm:flex-row sm:items-center sm:gap-4",
        speechPosition === "left" && "sm:flex-row-reverse sm:items-center sm:gap-4",
        className,
      )}
    >
      {/* Speech Bubble */}
      {speechText && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "text-ink border-sand-border shadow-sticker-orange relative z-20 mb-3 max-w-xs rounded-2xl border-2 bg-white p-3.5 transition-all sm:max-w-sm sm:p-4",
            speechPosition === "top" && "mb-3",
            speechPosition === "bottom" && "order-last mt-3",
          )}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-orange-deep font-heading text-xs font-bold uppercase tracking-wider">
              {speechSpeaker}
            </span>
            {onSpeechDismiss && (
              <button
                type="button"
                onClick={onSpeechDismiss}
                className="text-ink-soft hover:text-ink cursor-pointer rounded px-1.5 py-0.5 text-xs font-bold"
                aria-label="Dismiss guide tip"
              >
                ✕
              </button>
            )}
          </div>
          <p className="font-body text-sm font-medium leading-relaxed sm:text-base">{speechText}</p>

          {/* Speech bubble pointer arrow */}
          {speechPosition === "top" && (
            <div
              aria-hidden="true"
              className="border-sand-border absolute -bottom-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-white"
            />
          )}
          {speechPosition === "bottom" && (
            <div
              aria-hidden="true"
              className="border-sand-border absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l-2 border-t-2 bg-white"
            />
          )}
        </div>
      )}

      {/* SVG Lamb Guide Container */}
      <button
        type="button"
        onClick={handleTap}
        disabled={!interactive}
        aria-label={`Guide lamb ${activeMood}, tap to interact`}
        className={cn(
          "focus-visible:ring-blue-deep relative cursor-pointer rounded-full transition-transform focus:outline-none focus-visible:ring-4",
          interactive && "hover:scale-105 active:scale-95",
          isHopping && "animate-lamb-hop",
        )}
      >
        <svg
          role="img"
          viewBox="0 0 120 120"
          width={width}
          height={height}
          className="select-none overflow-visible"
        >
          {/* Background aura for encouraging mood */}
          {isEncouraging && (
            <circle
              cx="60"
              cy="62"
              r="52"
              fill="var(--color-yellow-tint, #fff6cc)"
              opacity="0.75"
              className="animate-lamb-sparkle"
            />
          )}

          {/* Celebration Sparkles */}
          {isCelebrating && (
            <g className="animate-lamb-sparkle">
              <circle cx="18" cy="22" r="4.5" fill="#ffd23f" />
              <polygon
                points="102,18 105,27 114,30 105,33 102,42 99,33 90,30 99,27"
                fill="#ffd23f"
              />
              <circle cx="98" cy="78" r="3.5" fill="#ff7a1a" />
              <circle cx="16" cy="75" r="3.5" fill="#35c76a" />
              <polygon points="22,48 24,53 29,55 24,57 22,62 20,57 15,55 20,53" fill="#ec4466" />
            </g>
          )}

          {/* Little hooves */}
          <rect x="44" y="98" width="8" height="12" rx="4" fill="#5c5f7a" />
          <rect x="68" y="98" width="8" height="12" rx="4" fill="#5c5f7a" />

          {/* Fluffy wool body with subtle breathing */}
          <g
            className="animate-lamb-breathe"
            fill="#ffffff"
            stroke="#f0e2c0"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            <circle cx="42" cy="74" r="22" />
            <circle cx="78" cy="74" r="22" />
            <circle cx="60" cy="82" r="24" />
            <circle cx="36" cy="60" r="18" />
            <circle cx="84" cy="60" r="18" />
          </g>

          {/* Left Ear with wiggle animation */}
          <g className="animate-lamb-ear-l">
            <ellipse
              cx="26"
              cy="50"
              rx="14"
              ry="8"
              fill="#fff1d6"
              stroke="#f0e2c0"
              strokeWidth="2.5"
            />
            <ellipse cx="26" cy="50" rx="9" ry="5" fill="#ffe1e8" />
          </g>

          {/* Right Ear with wiggle animation */}
          <g className="animate-lamb-ear-r">
            <ellipse
              cx="94"
              cy="50"
              rx="14"
              ry="8"
              fill="#fff1d6"
              stroke="#f0e2c0"
              strokeWidth="2.5"
            />
            <ellipse cx="94" cy="50" rx="9" ry="5" fill="#ffe1e8" />
          </g>

          {/* Lamb face */}
          <ellipse
            cx="60"
            cy="56"
            rx="28"
            ry="24"
            fill="#fff1d6"
            stroke="#f0e2c0"
            strokeWidth="3"
          />

          {/* Fluffy wool head tuft */}
          <g fill="#ffffff" stroke="#f0e2c0" strokeWidth="2.5">
            <circle cx="48" cy="36" r="11" />
            <circle cx="72" cy="36" r="11" />
            <circle cx="60" cy="32" r="13" />
          </g>

          {/* Rosy cheeks */}
          <ellipse cx="40" cy="62" rx="6" ry="4" fill="#ffe1e8" />
          <ellipse cx="80" cy="62" rx="6" ry="4" fill="#ffe1e8" />

          {/* Little friendly nose */}
          <polygon points="60,58 56,54 64,54" fill="#ff7a1a" />

          {/* Animated Eyes Group */}
          <g className="animate-lamb-blink">
            {activeMood === "happy" && (
              <>
                <circle cx="48" cy="50" r="4.5" fill="#2b2d42" />
                <circle cx="46.5" cy="48.5" r="1.5" fill="#ffffff" />
                <circle cx="72" cy="50" r="4.5" fill="#2b2d42" />
                <circle cx="70.5" cy="48.5" r="1.5" fill="#ffffff" />
              </>
            )}

            {isThinking && (
              <>
                <circle cx="48" cy="48" r="4" fill="#2b2d42" />
                <circle cx="47" cy="46.5" r="1.5" fill="#ffffff" />
                <circle cx="72" cy="48" r="4" fill="#2b2d42" />
                <circle cx="71" cy="46.5" r="1.5" fill="#ffffff" />
              </>
            )}

            {isEncouraging && (
              <>
                <circle cx="48" cy="50" r="4.5" fill="#2b2d42" />
                <circle cx="49" cy="48.5" r="1.8" fill="#ffffff" />
                <circle cx="72" cy="50" r="4.5" fill="#2b2d42" />
                <circle cx="73" cy="48.5" r="1.8" fill="#ffffff" />
              </>
            )}

            {isCelebrating && (
              <>
                <path
                  d="M 43 51 Q 48 43 53 51"
                  fill="none"
                  stroke="#2b2d42"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 67 51 Q 72 43 77 51"
                  fill="none"
                  stroke="#2b2d42"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>

          {/* Thought bubbles for thinking mood */}
          {isThinking && (
            <g>
              <circle cx="88" cy="32" r="3" fill="#3d8bff" opacity="0.75" />
              <circle cx="96" cy="23" r="5" fill="#3d8bff" opacity="0.85" />
            </g>
          )}

          {/* Expressive Mouth */}
          {activeMood === "happy" && (
            <path
              d="M 54 64 Q 60 71 66 64"
              fill="none"
              stroke="#2b2d42"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {isThinking && (
            <path
              d="M 55 64 Q 60 67 66 63"
              fill="none"
              stroke="#2b2d42"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {isCelebrating && (
            <path
              d="M 53 63 Q 60 74 67 63 Z"
              fill="#ec4466"
              stroke="#2b2d42"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {isEncouraging && (
            <path
              d="M 53 64 Q 60 70 67 64"
              fill="none"
              stroke="#2b2d42"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
