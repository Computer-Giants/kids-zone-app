# Verify: Application shell and animated guide mascot · spec 0003 · updated 2026-10-14

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Load home page on desktop browser (viewport >= 768px) → expect 80px sticky top bar with logo, section text links, active orange underline, and parents lock button → AC-1
- [x] Shrink viewport to mobile (width 375px) → expect top navigation hides and 72px fixed bottom tab bar appears with safe area bottom clearance → AC-2
- [x] Tap Bible tab on mobile bottom bar → expect active tab receives circular blue tint pill background and bold blue deep label text → AC-3
- [x] Inspect mobile bottom tab touch targets with developer tools → expect touch areas measure at least 64 by 56 pixels → AC-4
- [x] Observe mascot lamb in hero section → expect vector SVG character with blinking eyes every 4 seconds, gentle ear wiggles, and breathing wool body → AC-5
- [x] Tap the guide lamb → expect celebration hop bounce animation and dynamic speech bubble updating with faith encouragement tips → AC-5, AC-6
- [x] Tap the speech bubble close button ✕ → expect speech bubble dismisses without covering main content or buttons → AC-6
- [x] Turn on prefers reduced motion in browser devtools → expect all SVG keyframe animations (blinking, ear wiggles, hops, sparkles) to freeze into calm static poses → AC-7

## Commands

- [x] `pnpm typecheck` → expect clean exit with zero errors across all 10 packages → AC-7
- [x] `pnpm lint` → expect clean exit with zero ESLint errors across all packages → AC-7

## Acceptance-criteria coverage

- AC-1: covered by step "Load home page on desktop browser"
- AC-2: covered by step "Shrink viewport to mobile"
- AC-3: covered by step "Tap Bible tab on mobile bottom bar"
- AC-4: covered by step "Inspect mobile bottom tab touch targets"
- AC-5: covered by steps "Observe mascot lamb in hero section" and "Tap the guide lamb"
- AC-6: covered by steps "Tap the guide lamb" and "Tap the speech bubble close button"
- AC-7: covered by steps "Turn on prefers reduced motion", `pnpm typecheck`, and `pnpm lint`
