"use client";

import type { ReactNode } from "react";
import { TopNav, type SectionKind } from "./top-nav";
import { BottomNav } from "./bottom-nav";
import { cn } from "../lib/utils";

export interface AppShellProps {
  children: ReactNode;
  activeSection?: SectionKind;
  onSectionClick?: (section: SectionKind) => void;
  onParentGateClick?: () => void;
  brandSlot?: ReactNode;
  rightSlot?: ReactNode;
  logoSrc?: string;
  className?: string;
}

export function AppShell({
  children,
  activeSection = "home",
  onSectionClick,
  onParentGateClick,
  brandSlot,
  rightSlot,
  logoSrc = "/images/favicon.svg",
  className,
}: AppShellProps) {
  return (
    <div className={cn("bg-cream text-ink flex min-h-screen flex-col", className)}>
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="focus:bg-orange focus:font-heading sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Desktop Top Header Bar (hidden on mobile, visible on medium+ screens) */}
      <div className="hidden md:block">
        <TopNav
          activeSection={activeSection}
          onSectionClick={onSectionClick}
          onParentGateClick={onParentGateClick}
          brandSlot={brandSlot}
          rightSlot={rightSlot}
          logoSrc={logoSrc}
        />
      </div>

      {/* Main Page Content with Safe Bottom Clearance */}
      <main id="main-content" className="w-full flex-1 pb-28 md:pb-12">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar (visible on small/mobile screens, hidden on md+) */}
      <div className="md:hidden">
        <BottomNav
          activeSection={activeSection}
          onSectionClick={onSectionClick}
          onParentGateClick={onParentGateClick}
        />
      </div>
    </div>
  );
}
