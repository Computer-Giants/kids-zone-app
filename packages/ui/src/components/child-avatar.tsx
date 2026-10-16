import React from "react";
import { cn } from "../lib/utils";

export type AvatarKey =
  // Catholic creatures & symbols
  | "lamb"
  | "dove"
  | "lion"
  | "fish"
  | "star"
  | "bell"
  | "olive"
  | "flame"
  // Patron saint emblems
  | "st-francis"
  | "st-michael"
  | "st-therese"
  | "st-joseph"
  | "st-peter"
  // Character badges
  | "cross"
  | "heart"
  | "shell"
  | "crown";

export interface AvatarDefinition {
  key: AvatarKey;
  label: string;
  category: "symbols" | "saints" | "badges";
  description: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const AVATAR_DEFINITIONS: AvatarDefinition[] = [
  // Catholic creatures & symbols
  {
    key: "lamb",
    label: "Little Lamb",
    category: "symbols",
    description: "Gentle guide and follower of the Good Shepherd",
    bgColor: "bg-cream",
    borderColor: "border-sand-border",
    textColor: "text-amber-900",
  },
  {
    key: "dove",
    label: "Holy Dove",
    category: "symbols",
    description: "Messenger of peace and the Holy Spirit",
    bgColor: "bg-blue-tint",
    borderColor: "border-blue/30",
    textColor: "text-blue-deep",
  },
  {
    key: "lion",
    label: "Brave Lion",
    category: "symbols",
    description: "Courageous Lion of Judah",
    bgColor: "bg-orange-tint",
    borderColor: "border-orange/30",
    textColor: "text-orange-deep",
  },
  {
    key: "fish",
    label: "Golden Fish",
    category: "symbols",
    description: "Ancient Ichthys symbol of Christian faith",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
  },
  {
    key: "star",
    label: "Shining Star",
    category: "symbols",
    description: "Star of Bethlehem guiding travelers to Christ",
    bgColor: "bg-yellow-tint",
    borderColor: "border-yellow/40",
    textColor: "text-yellow-deep",
  },
  {
    key: "bell",
    label: "Church Bell",
    category: "symbols",
    description: "Ringing joyous calls to prayer and Mass",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
  },
  {
    key: "olive",
    label: "Olive Branch",
    category: "symbols",
    description: "Sign of hope, blessing, and new life",
    bgColor: "bg-green-tint",
    borderColor: "border-green/30",
    textColor: "text-green-deep",
  },
  {
    key: "flame",
    label: "Flame of Hope",
    category: "symbols",
    description: "Pentecost fire of wisdom and charity",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-800",
  },

  // Patron saint emblems
  {
    key: "st-francis",
    label: "St. Francis",
    category: "saints",
    description: "Patron of creation and animals with a gentle bird",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    textColor: "text-lime-800",
  },
  {
    key: "st-michael",
    label: "St. Michael",
    category: "saints",
    description: "Courageous archangel defending truth with a shield",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800",
  },
  {
    key: "st-therese",
    label: "St. Therese",
    category: "saints",
    description: "The Little Flower showing God's love through simple roses",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
  },
  {
    key: "st-joseph",
    label: "St. Joseph",
    category: "saints",
    description: "Faithful guardian of the Holy Family holding a pure lily",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
    textColor: "text-stone-800",
  },
  {
    key: "st-peter",
    label: "St. Peter",
    category: "saints",
    description: "Golden keys of the Kingdom of Heaven",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
  },

  // Character badges
  {
    key: "cross",
    label: "Celtic Cross",
    category: "badges",
    description: "Eternal symbol of Christ's redemption and victory",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
  },
  {
    key: "heart",
    label: "Sacred Heart",
    category: "badges",
    description: "Infinite divine love and compassion",
    bgColor: "bg-red-tint",
    borderColor: "border-red/30",
    textColor: "text-red-deep",
  },
  {
    key: "shell",
    label: "Pilgrim Shell",
    category: "badges",
    description: "St. James shell of baptism and journeying with God",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-800",
  },
  {
    key: "crown",
    label: "Heavenly Crown",
    category: "badges",
    description: "Christ the King of peace and justice",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    textColor: "text-amber-900",
  },
];

export interface ChildAvatarProps {
  avatar: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
}

export function ChildAvatar({
  avatar,
  size = "md",
  className,
  showBorder = true,
}: ChildAvatarProps) {
  const def = AVATAR_DEFINITIONS.find((d) => d.key === avatar) ?? AVATAR_DEFINITIONS[0]!;

  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
    xl: "w-28 h-28 text-5xl",
  };

  const iconScale = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      aria-label={def.label}
      className={cn(
        "shadow-xs flex shrink-0 select-none items-center justify-center rounded-full transition-transform",
        def.bgColor,
        showBorder && `border-2 ${def.borderColor}`,
        sizeClasses[size],
        className,
      )}
    >
      <AvatarIcon avatarKey={def.key} className={iconScale[size]} />
    </div>
  );
}

function AvatarIcon({ avatarKey, className }: { avatarKey: AvatarKey; className?: string }) {
  switch (avatarKey) {
    case "lamb":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="14" fill="#FAF8F5" stroke="#4A3B32" strokeWidth="2.5" />
          <ellipse
            cx="12"
            cy="18"
            rx="4"
            ry="7"
            fill="#F4EBE1"
            stroke="#4A3B32"
            strokeWidth="2"
            transform="rotate(-25 12 18)"
          />
          <ellipse
            cx="28"
            cy="18"
            rx="4"
            ry="7"
            fill="#F4EBE1"
            stroke="#4A3B32"
            strokeWidth="2"
            transform="rotate(25 28 18)"
          />
          <circle cx="16" cy="19" r="2" fill="#2C2420" />
          <circle cx="24" cy="19" r="2" fill="#2C2420" />
          <path d="M18 24 Q20 26 22 24" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "dove":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M8 20 C10 12 20 10 26 14 C30 16 34 16 36 18 C33 22 28 24 24 24 L28 32 C23 30 20 26 18 24 C14 24 10 23 8 20 Z"
            fill="#E8F1F5"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="16" r="1.5" fill="#1E3A8A" />
          <path d="M12 18 Q16 14 20 16" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "lion":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <circle cx="20" cy="20" r="10" fill="#FDE68A" />
          <circle cx="16" cy="18" r="1.5" fill="#78350F" />
          <circle cx="24" cy="18" r="1.5" fill="#78350F" />
          <polygon points="19,21 21,21 20,23" fill="#D97706" />
          <path d="M17 25 Q20 27 23 25" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "fish":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path d="M10 20 Q20 10 32 26" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 20 Q20 30 32 14" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="15" cy="20" r="1.5" fill="#047857" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <polygon
            points="20,6 23,15 33,16 25,23 28,32 20,27 12,32 15,23 7,16 17,15"
            fill="#FDE047"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M20 8 C15 8 13 14 12 24 L28 24 C27 14 25 8 20 8 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="2"
          />
          <line
            x1="9"
            y1="24"
            x2="31"
            y2="24"
            stroke="#B45309"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="28" r="2.5" fill="#92400E" />
        </svg>
      );
    case "olive":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path d="M10 28 Q20 20 30 10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse
            cx="16"
            cy="18"
            rx="4"
            ry="2"
            fill="#86EFAC"
            stroke="#15803D"
            strokeWidth="1.5"
            transform="rotate(-40 16 18)"
          />
          <ellipse
            cx="24"
            cy="14"
            rx="4"
            ry="2"
            fill="#86EFAC"
            stroke="#15803D"
            strokeWidth="1.5"
            transform="rotate(30 24 14)"
          />
          <ellipse
            cx="22"
            cy="22"
            rx="4"
            ry="2"
            fill="#86EFAC"
            stroke="#15803D"
            strokeWidth="1.5"
            transform="rotate(-20 22 22)"
          />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M20 7 C22 14 29 18 29 25 C29 30 25 33 20 33 C15 33 11 30 11 25 C11 19 17 15 20 7 Z"
            fill="#F87171"
            stroke="#DC2626"
            strokeWidth="2"
          />
          <path
            d="M20 16 C22 20 25 22 25 26 C25 29 23 31 20 31 C17 31 15 29 15 26 C15 23 18 20 20 16 Z"
            fill="#FEF08A"
          />
        </svg>
      );
    case "st-francis":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="14" fill="#ECFCCB" stroke="#65A30D" strokeWidth="2" />
          <path d="M14 26 C14 21 17 17 21 17 C25 17 28 21 28 26 Z" fill="#A16207" />
          <circle cx="21" cy="13" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M25 11 Q29 8 32 12" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "st-michael":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M20 7 L31 11 V22 C31 28 26 33 20 35 C14 33 9 28 9 22 V11 Z"
            fill="#DBEAFE"
            stroke="#1D4ED8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="20"
            y1="12"
            x2="20"
            y2="28"
            stroke="#1D4ED8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="18"
            x2="26"
            y2="18"
            stroke="#1D4ED8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "st-therese":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="7" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
          <path d="M20 13 C18 9 22 9 20 13 Z" fill="#FDA4AF" />
          <circle cx="16" cy="18" r="4" fill="#FDA4AF" />
          <circle cx="24" cy="18" r="4" fill="#FDA4AF" />
          <circle cx="20" cy="23" r="4" fill="#FDA4AF" />
          <circle cx="20" cy="20" r="2.5" fill="#FFE4E6" />
        </svg>
      );
    case "st-joseph":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path d="M20 30 V12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M20 12 C18 8 12 10 16 16 C18 19 20 22 20 22 C20 22 22 19 24 16 C28 10 22 8 20 12 Z"
            fill="#FAFAF9"
            stroke="#78716C"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="14" r="1.5" fill="#EAB308" />
        </svg>
      );
    case "st-peter":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="15" cy="16" r="4" stroke="#CA8A04" strokeWidth="2" fill="none" />
          <line
            x1="18"
            y1="18"
            x2="28"
            y2="28"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="25"
            x2="28"
            y2="22"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="25" cy="16" r="4" stroke="#CA8A04" strokeWidth="2" fill="none" />
          <line
            x1="22"
            y1="18"
            x2="12"
            y2="28"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="25"
            x2="12"
            y2="22"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <circle cx="20" cy="18" r="6" stroke="#9333EA" strokeWidth="2" fill="none" />
          <line
            x1="20"
            y1="8"
            x2="20"
            y2="32"
            stroke="#9333EA"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="18"
            x2="28"
            y2="18"
            stroke="#9333EA"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M20 31 C10 24 8 16 13 12 C17 9 20 13 20 13 C20 13 23 9 27 12 C32 16 30 24 20 31 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="20"
            y1="6"
            x2="20"
            y2="11"
            stroke="#B91C1C"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="17"
            y1="8"
            x2="23"
            y2="8"
            stroke="#B91C1C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shell":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 28 C12 18 16 12 20 12 C24 12 28 18 28 28 Z"
            fill="#CCFBF1"
            stroke="#0D9488"
            strokeWidth="2"
          />
          <line x1="20" y1="12" x2="20" y2="28" stroke="#0D9488" strokeWidth="1.5" />
          <line x1="20" y1="12" x2="16" y2="28" stroke="#0D9488" strokeWidth="1.5" />
          <line x1="20" y1="12" x2="24" y2="28" stroke="#0D9488" strokeWidth="1.5" />
        </svg>
      );
    case "crown":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
          <polygon
            points="10,26 10,16 15,21 20,13 25,21 30,16 30,26"
            fill="#FDE68A"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="15" r="1.5" fill="#D97706" />
          <circle cx="20" cy="12" r="1.5" fill="#D97706" />
          <circle cx="30" cy="15" r="1.5" fill="#D97706" />
        </svg>
      );
  }
}
