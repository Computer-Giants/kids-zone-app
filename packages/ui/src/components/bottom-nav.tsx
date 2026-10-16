"use client";

import { BookOpen, Crown, Gamepad2, House, Lock } from "lucide-react";
import type { SectionKind } from "./top-nav";
import { cn } from "../lib/utils";

export interface BottomNavProps {
  activeSection?: SectionKind;
  onSectionClick?: (section: SectionKind) => void;
  onParentGateClick?: () => void;
  className?: string;
}

interface MobileTabItem {
  id: SectionKind;
  label: string;
  href: string;
  icon: typeof House;
  activeColor: string;
  activeBg: string;
}

const MOBILE_TABS: MobileTabItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: House,
    activeColor: "text-orange-deep",
    activeBg: "bg-orange-tint",
  },
  {
    id: "bible",
    label: "Bible",
    href: "/bible",
    icon: BookOpen,
    activeColor: "text-blue-deep",
    activeBg: "bg-blue-tint",
  },
  {
    id: "saints",
    label: "Saints",
    href: "/saints",
    icon: Crown,
    activeColor: "text-yellow-deep",
    activeBg: "bg-yellow-tint",
  },
  {
    id: "fun",
    label: "Fun",
    href: "/fun",
    icon: Gamepad2,
    activeColor: "text-green-deep",
    activeBg: "bg-green-tint",
  },
  {
    id: "parents",
    label: "Parents",
    href: "/parent",
    icon: Lock,
    activeColor: "text-slate",
    activeBg: "bg-slate-tint",
  },
];

export function BottomNav({
  activeSection = "home",
  onSectionClick,
  onParentGateClick,
  className,
}: BottomNavProps) {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={cn(
        "border-sand-border pb-safe fixed bottom-0 left-0 right-0 z-50 border-t-2 bg-white shadow-lg",
        className,
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-lg items-center justify-around px-2">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          const handleClick = (e: React.MouseEvent) => {
            if (tab.id === "parents" && onParentGateClick) {
              e.preventDefault();
              onParentGateClick();
              return;
            }

            if (onSectionClick) {
              e.preventDefault();
              onSectionClick(tab.id);
            }
          };

          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={handleClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "focus-accessible text-decoration-none flex min-h-[56px] min-w-[64px] flex-1 select-none flex-col items-center justify-center rounded-2xl transition-all",
                isActive ? tab.activeColor : "text-ink-soft hover:text-ink",
              )}
            >
              {/* Active Circular/Pill Tint Indicator */}
              <div
                className={cn(
                  "flex h-9 w-12 items-center justify-center rounded-full transition-all",
                  isActive ? tab.activeBg : "bg-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-transform",
                    isActive ? "scale-110" : "scale-100",
                  )}
                  aria-hidden="true"
                />
              </div>

              {/* Tab Label */}
              <span
                className={cn(
                  "font-heading mt-0.5 text-xs font-bold leading-tight",
                  isActive ? "font-black" : "font-medium",
                )}
              >
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
