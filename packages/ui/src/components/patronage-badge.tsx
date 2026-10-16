"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export interface PatronageBadgeProps {
  label: string;
  slug?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PatronageBadge({ label, active = false, onClick, className }: PatronageBadgeProps) {
  const content = (
    <>
      <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "font-heading focus-accessible inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-200 active:scale-95",
          active
            ? "bg-blue-deep shadow-sticker-blue text-white"
            : "bg-blue-tint text-blue-deep hover:bg-blue-tint/80 border-sand-border border",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={cn(
        "bg-sand font-heading text-ink border-sand-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        className,
      )}
    >
      {content}
    </span>
  );
}
