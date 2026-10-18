import React from "react";
import { cn } from "../lib/utils";

export interface HotspotButtonProps {
  title: string;
  xPercent: number;
  yPercent: number;
  isInspected?: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Interactive glowing halo hot spot button placed with percentage coordinates on church scenes.
 * Maintains minimum 48px tap targets with high contrast focus rings.
 */
export function HotspotButton({
  title,
  xPercent,
  yPercent,
  isInspected = false,
  onClick,
  className,
}: HotspotButtonProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title}${isInspected ? " (Inspected)" : " (Tap to explore)"}`}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full transition-transform active:scale-95",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
          className,
        )}
      >
        {/* Outer glowing pulsing halo */}
        <span
          className={cn(
            "absolute inset-0 rounded-full transition-opacity duration-300",
            isInspected
              ? "bg-amber-400/30 ring-2 ring-amber-400/50"
              : "animate-ping bg-amber-400/40 ring-4 ring-amber-300",
          )}
          aria-hidden="true"
        />

        {/* Inner button surface */}
        <span
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition-colors",
            isInspected
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-white bg-amber-500 text-white shadow-amber-500/50 group-hover:bg-amber-600",
          )}
        >
          {isInspected ? (
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </span>

        {/* Hover / focus tooltip label */}
        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-stone-900/90 px-2 py-0.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {title}
        </span>
      </button>
    </div>
  );
}
