"use client";

import React, { useState } from "react";
import { AVATAR_DEFINITIONS, ChildAvatar, type AvatarKey } from "./child-avatar";
import { cn } from "../lib/utils";

export interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatarKey: AvatarKey) => void;
  className?: string;
}

export function AvatarPicker({ selectedAvatar, onSelect, className }: AvatarPickerProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "symbols" | "saints" | "badges">(
    "all",
  );

  const categories = [
    { id: "all", label: "All Avatars" },
    { id: "symbols", label: "Symbols & Creatures" },
    { id: "saints", label: "Patron Saints" },
    { id: "badges", label: "Badges" },
  ] as const;

  const filteredAvatars =
    activeCategory === "all"
      ? AVATAR_DEFINITIONS
      : AVATAR_DEFINITIONS.filter((a) => a.category === activeCategory);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Avatar categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "font-heading focus-accessible min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
              activeCategory === cat.id
                ? "bg-slate shadow-xs text-white"
                : "bg-slate-tint text-ink-soft hover:text-ink border-sand-border border hover:bg-white",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Avatars Grid */}
      <div
        className="bg-slate-tint/40 border-sand-border grid grid-cols-3 gap-3 rounded-2xl border-2 p-3 sm:grid-cols-4 md:grid-cols-6"
        role="radiogroup"
        aria-label="Select an avatar"
      >
        {filteredAvatars.map((avatar) => {
          const isSelected = selectedAvatar === avatar.key;
          return (
            <button
              key={avatar.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(avatar.key)}
              title={`${avatar.label}: ${avatar.description}`}
              className={cn(
                "focus-accessible group relative flex min-h-[64px] min-w-[64px] cursor-pointer flex-col items-center justify-center rounded-xl p-2 transition-all",
                isSelected
                  ? "shadow-card-hover border-orange ring-orange/30 scale-105 border-2 bg-white ring-2"
                  : "hover:scale-102 border-2 border-transparent hover:bg-white",
              )}
            >
              <ChildAvatar
                avatar={avatar.key}
                size="md"
                showBorder={!isSelected}
                className={isSelected ? "border-orange border-2" : ""}
              />
              <span className="font-heading text-ink mt-1 max-w-full truncate text-center text-[11px] font-bold">
                {avatar.label}
              </span>
              {isSelected && (
                <span
                  className="bg-orange shadow-xs absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
