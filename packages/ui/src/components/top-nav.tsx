"use client";

import type { ReactNode } from "react";
import { BookOpen, Crown, Gamepad2, HeartHandshake, House, Lock } from "lucide-react";
import { cn } from "../lib/utils";

export type SectionKind = "home" | "bible" | "saints" | "fun" | "chat" | "parents";

export interface NavItemConfig {
  id: SectionKind;
  label: string;
  href: string;
  icon: typeof House;
  colorClass: string;
  activeUnderline: string;
}

export const NAV_SECTIONS: NavItemConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: House,
    colorClass: "hover:text-orange text-ink",
    activeUnderline: "bg-orange",
  },
  {
    id: "bible",
    label: "Bible Stories",
    href: "/bible",
    icon: BookOpen,
    colorClass: "hover:text-blue-deep text-ink",
    activeUnderline: "bg-blue",
  },
  {
    id: "saints",
    label: "Saints & Faith",
    href: "/saints",
    icon: Crown,
    colorClass: "hover:text-yellow-deep text-ink",
    activeUnderline: "bg-yellow-deep",
  },
  {
    id: "fun",
    label: "Games & Puzzles",
    href: "/fun",
    icon: Gamepad2,
    colorClass: "hover:text-green-deep text-ink",
    activeUnderline: "bg-green",
  },
  {
    id: "chat",
    label: "Youth Chat",
    href: "/chat",
    icon: HeartHandshake,
    colorClass: "hover:text-violet-deep text-ink",
    activeUnderline: "bg-violet",
  },
];

export interface TopNavProps {
  activeSection?: SectionKind;
  onSectionClick?: (section: SectionKind) => void;
  onParentGateClick?: () => void;
  brandSlot?: ReactNode;
  rightSlot?: ReactNode;
  logoSrc?: string;
  className?: string;
}

export function TopNav({
  activeSection = "home",
  onSectionClick,
  onParentGateClick,
  brandSlot,
  rightSlot,
  logoSrc = "/images/favicon.svg",
  className,
}: TopNavProps) {
  return (
    <header
      role="banner"
      className={cn(
        "border-sand-border sticky top-0 z-40 h-20 w-full border-b-2 bg-white shadow-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          {brandSlot ?? (
            <a
              href="/"
              onClick={(e) => {
                if (onSectionClick) {
                  e.preventDefault();
                  onSectionClick("home");
                }
              }}
              className="text-decoration-none focus-accessible group flex items-center gap-2.5 rounded-xl"
              aria-label="Kid Zone Home"
            >
              {/* Kid Zone Logo Mark */}
              <img
                src={logoSrc}
                alt="Kid Zone logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-2xl object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-heading text-ink text-2xl font-black leading-none tracking-tight">
                  Kid<span className="text-orange">Zone</span>
                </span>
                <span className="font-body text-ink-soft text-xs font-bold uppercase tracking-wider">
                  Faith & Fun
                </span>
              </div>
            </a>
          )}
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden items-center gap-1 md:flex lg:gap-2">
          <ul role="list" className="m-0 flex list-none items-center gap-1 p-0 lg:gap-2">
            {NAV_SECTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (onSectionClick) {
                        e.preventDefault();
                        onSectionClick(item.id);
                      }
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-heading focus-accessible text-decoration-none relative flex min-h-[48px] items-center gap-2 rounded-xl px-3.5 py-2.5 text-base font-bold transition-all",
                      item.colorClass,
                      isActive ? "text-ink bg-sand/60 font-black" : "text-ink hover:bg-sand/30",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>

                    {/* Active underline indicator */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shadow-xs absolute -bottom-1 left-2.5 right-2.5 h-1.5 rounded-full",
                          item.activeUnderline,
                        )}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Parent Gate Access */}
        <div className="flex items-center gap-3">
          {rightSlot ?? (
            <a
              href="/parent"
              onClick={(e) => {
                if (onParentGateClick) {
                  e.preventDefault();
                  onParentGateClick();
                }
              }}
              aria-label="Parent settings and accounts"
              className="bg-slate-tint text-slate font-heading border-sand-border hover:text-ink hover:border-slate focus-accessible text-decoration-none flex min-h-[48px] min-w-[48px] cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all hover:bg-white"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Parents</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
