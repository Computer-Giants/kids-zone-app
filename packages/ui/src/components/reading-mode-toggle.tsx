"use client";

import * as React from "react";
import { BookOpen, Sparkles, ScrollText } from "lucide-react";
import { cn } from "../lib/utils";

export type ReadingMode = "stories" | "key_verses" | "full";

export interface ReadingModeToggleProps {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
  hasStoryRetelling?: boolean;
  className?: string;
}

export function ReadingModeToggle({
  mode,
  onChange,
  hasStoryRetelling = true,
  className,
}: ReadingModeToggleProps) {
  const modes: Array<{
    id: ReadingMode;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
  }> = [
    {
      id: "stories",
      label: "Story Retelling",
      sublabel: "Ages 3 to 7",
      icon: Sparkles,
      disabled: !hasStoryRetelling,
    },
    {
      id: "key_verses",
      label: "Key Verses",
      sublabel: "Ages 8 to 10",
      icon: BookOpen,
    },
    {
      id: "full",
      label: "Full Chapter",
      sublabel: "Ages 11 to 15",
      icon: ScrollText,
    },
  ];

  return (
    <div
      role="group"
      aria-label="Select Reading Level"
      className={cn(
        "bg-sand border-sand-border shadow-card-rest inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 p-1.5",
        className,
      )}
    >
      {modes.map((item) => {
        const Icon = item.icon;
        const isActive = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            className={cn(
              "font-heading focus-accessible flex min-h-[48px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-extrabold transition-all duration-200",
              item.disabled && "cursor-not-allowed opacity-40",
              isActive
                ? "bg-blue-deep shadow-sticker-blue scale-[1.02] text-white"
                : "text-ink-soft hover:text-ink hover:bg-white/60 active:scale-95",
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-yellow" : "text-ink-soft")} />
            <div className="flex flex-col text-left leading-none">
              <span className="text-sm font-black">{item.label}</span>
              <span
                className={cn(
                  "text-[10px] font-bold opacity-80",
                  isActive ? "text-white" : "text-ink-soft",
                )}
              >
                {item.sublabel}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
