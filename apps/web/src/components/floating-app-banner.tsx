"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "@kidzone/ui";

const STORAGE_KEY = "kidzone_app_banner_dismissed";

export function FloatingAppBanner() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Only access sessionStorage on the client
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Mobile app download"
      className="border-sand-border shadow-card-hover fixed bottom-24 right-4 z-40 max-w-[280px] rounded-3xl border-2 bg-white p-4 transition-all duration-300 ease-out sm:bottom-6 sm:right-6 sm:max-w-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-orange-tint text-orange-deep flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-heading text-ink text-sm font-bold">Kid Zone App</h4>
            <p className="font-body text-ink-soft text-xs">For tablet and phone</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-ink-soft hover:bg-sand hover:text-ink focus-visible:outline-blue-deep flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl focus-visible:outline-4"
          aria-label="Dismiss app download banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Stylized QR Code and Download Instructions */}
      <div className="border-sand-border bg-cream mt-3 flex items-center gap-3 rounded-2xl border p-3">
        {/* High contrast SVG QR Code Pattern */}
        <div className="border-sand-border shadow-xs shrink-0 rounded-xl border bg-white p-1.5">
          <svg
            viewBox="0 0 48 48"
            width="56"
            height="56"
            className="text-ink block"
            aria-hidden="true"
          >
            {/* Top-left position marker */}
            <rect
              x="4"
              y="4"
              width="14"
              height="14"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect x="7" y="7" width="8" height="8" rx="1.5" fill="currentColor" />

            {/* Top-right position marker */}
            <rect
              x="30"
              y="4"
              width="14"
              height="14"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect x="33" y="7" width="8" height="8" rx="1.5" fill="currentColor" />

            {/* Bottom-left position marker */}
            <rect
              x="4"
              y="30"
              width="14"
              height="14"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect x="7" y="33" width="8" height="8" rx="1.5" fill="currentColor" />

            {/* Data bits representation */}
            <rect x="22" y="6" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="22" y="14" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="6" y="22" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="14" y="22" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="22" y="22" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="30" y="22" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="38" y="22" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="22" y="30" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="30" y="30" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="38" y="34" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="22" y="38" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="34" y="40" width="4" height="4" rx="1" fill="currentColor" />
          </svg>
        </div>

        <div className="flex flex-col justify-center gap-1">
          <span className="font-heading text-ink text-xs font-bold leading-snug">
            Scan with your camera
          </span>
          <p className="font-body text-ink-soft text-[11px] leading-tight">
            Install on Apple iPad and Android tablets
          </p>
        </div>
      </div>

      {/* Store Badges Row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link
          href="/download"
          className="border-sand-border text-ink shadow-xs hover:bg-sand focus-visible:outline-blue-deep flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border bg-white px-2 py-1.5 text-xs font-bold focus-visible:outline-4"
        >
          {/* Apple Logo SVG */}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.876 2.532.03.047 1.294.07 2.308-1.086 1.013-1.155.893-2.618.893-2.618zm1.942 4.148c-.066-.046-2.122-1.228-2.138-3.418-.016-2.19 1.84-3.23 1.905-3.268-.052-.162-.782-2.73-2.613-2.73-.835 0-1.554.496-2.182.496-.64 0-1.428-.485-2.38-.485-1.597 0-3.324 1.306-3.324 3.793 0 2.487 1.769 5.86 3.518 5.86.671 0 1.258-.453 1.954-.453.696 0 1.222.453 1.928.453 1.557 0 2.802-1.782 3.332-2.793z" />
          </svg>
          <span>App Store</span>
        </Link>

        <Link
          href="/download"
          className="border-sand-border text-ink shadow-xs hover:bg-sand focus-visible:outline-blue-deep flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border bg-white px-2 py-1.5 text-xs font-bold focus-visible:outline-4"
        >
          {/* Google Play Logo SVG */}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M1.5 1.5l7 6.5-7 6.5V1.5zm8.2 7.7l1.8 1.7-8.5 4.6 6.7-6.3zm1.8-1.7l1.8 1-1.8 1-1.5-1 1.5-1zm-1.8-1.7L3 1.2l8.5 4.6-1.8 1.7z" />
          </svg>
          <span>Google Play</span>
        </Link>
      </div>
    </aside>
  );
}
