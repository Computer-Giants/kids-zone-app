"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { LambMood, LambSize } from "./mascot-lamb";
import { useTypewriter } from "../hooks/use-typewriter";
import { cn } from "../lib/utils";

export interface AnimatedLambGuideProps {
  mood?: LambMood;
  size?: LambSize;
  speechText?: string;
  speechSpeaker?: string;
  speechPosition?: "top" | "right" | "bottom" | "left" | "tooltip";
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
  const [mouthOpen, setMouthOpen] = useState(false);
  const { width, height } = sizePixels[size];

  // Active mood prioritizes prop if supplied and updated
  const activeMood = initialMood !== "happy" ? initialMood : currentMood;

  // Typewriter animation synchronized with speech text
  const { displayedText, isTyping } = useTypewriter(speechText, {
    speed: 25,
    enabled: interactive,
  });

  // Talking mouth changes geometric shape when speaking (zero vertical bouncing)
  useEffect(() => {
    if (!isTyping) {
      setMouthOpen(false);
      return;
    }
    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 180);
    return () => clearInterval(interval);
  }, [isTyping]);

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
      {/* Speech Bubble with SVG Cloud Shape & Trail of Smaller Bubbles */}
      {speechText && (
        <div
          role="status"
          className={cn(
            "relative z-20 mb-4 max-w-xs px-6 py-5 transition-all sm:max-w-sm sm:px-7 sm:py-6",
            speechPosition === "tooltip" &&
              "w-68 sm:w-76 pointer-events-auto absolute bottom-[108%] left-1/2 mb-2 -translate-x-1/2",
            speechPosition === "top" && "mb-5",
            speechPosition === "bottom" && "order-last mt-5",
          )}
        >
          {/* Cloud SVG Backdrop */}
          <svg
            viewBox="0 0 340 180"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-3 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible drop-shadow-[0_8px_20px_rgba(43,45,66,0.08)]"
            aria-hidden="true"
          >
            <path
              d="M 52 46
                 C 40 24, 72 10, 102 18
                 C 134 4, 186 4, 218 18
                 C 248 8, 290 20, 300 48
                 C 332 60, 338 102, 316 126
                 C 328 148, 298 172, 270 166
                 C 238 182, 186 182, 154 168
                 C 122 182, 70 178, 50 162
                 C 18 164, -2 136, 6 108
                 C -4 80, 18 52, 52 46 Z"
              fill="#ffffff"
              stroke="#e5dfd3"
              strokeWidth="2.75"
              strokeLinejoin="round"
            />
          </svg>

          {/* Visually hidden container for screen reader announcements without per-character noise */}
          <span className="sr-only" aria-live="polite">
            {speechText}
          </span>
          <div className="relative z-10 mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="text-orange-deep h-3.5 w-3.5" />
              <span className="text-orange-deep font-heading text-xs font-bold uppercase tracking-wider">
                {speechSpeaker}
              </span>
            </div>
            {onSpeechDismiss && (
              <button
                type="button"
                onClick={onSpeechDismiss}
                className="text-ink-soft hover:text-ink hover:bg-sand/60 focus-visible:outline-blue-deep cursor-pointer rounded-lg p-1 focus-visible:outline-2"
                aria-label="Dismiss guide tip"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p
            className="font-body text-ink relative z-10 text-sm font-semibold leading-relaxed sm:text-base"
            aria-hidden="true"
          >
            {displayedText}
          </p>

          {/* Speech bubble trail: series of smaller SVG bubbles connecting cloud to lamb's head */}
          {(speechPosition === "top" || speechPosition === "tooltip") && (
            <svg
              viewBox="0 0 30 38"
              className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 overflow-visible drop-shadow-[0_2px_4px_rgba(43,45,66,0.06)]"
              width="24"
              height="30"
              aria-hidden="true"
            >
              <circle cx="15" cy="6" r="6" fill="#ffffff" stroke="#e5dfd3" strokeWidth="2" />
              <circle cx="13" cy="18" r="4" fill="#ffffff" stroke="#e5dfd3" strokeWidth="1.75" />
              <circle cx="11" cy="27" r="2.5" fill="#ffffff" stroke="#e5dfd3" strokeWidth="1.5" />
            </svg>
          )}
          {speechPosition === "bottom" && (
            <svg
              viewBox="0 0 30 38"
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rotate-180 overflow-visible drop-shadow-[0_2px_4px_rgba(43,45,66,0.06)]"
              width="24"
              height="30"
              aria-hidden="true"
            >
              <circle cx="15" cy="6" r="6" fill="#ffffff" stroke="#e5dfd3" strokeWidth="2" />
              <circle cx="13" cy="18" r="4" fill="#ffffff" stroke="#e5dfd3" strokeWidth="1.75" />
              <circle cx="11" cy="27" r="2.5" fill="#ffffff" stroke="#e5dfd3" strokeWidth="1.5" />
            </svg>
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

          {/* Expressive Mouth: Geometric shape changes when talking (zero vertical bounce) */}
          {mouthOpen && isTyping ? (
            <g>
              <ellipse
                cx="60"
                cy="65"
                rx="4.5"
                ry="3.5"
                fill="#ec4466"
                stroke="#2b2d42"
                strokeWidth="2"
              />
              <path
                d="M 57.5 66 Q 60 64 62.5 66"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <>
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
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
