# 0003. Application Shell and Animated Guide Mascot

**Date**: 2026-10-14  
**Status**: Accepted

## Summary

This decision defines the global responsive application shell and the full animated SVG guide mascot for Kid Zone. We establish a dual navigation architecture featuring an eighty pixel top header on desktop and a seventy two pixel bottom tab bar on mobile screens. We also build a living vector lamb guide that blinks, offers speech hints, and celebrates achievements while strictly respecting motion sensitivity preferences.

## Requirements

**User stories**:

- As a child using a phone, I want large navigation tabs along the bottom of my screen so that I can easily switch between Bible stories, saints, and fun games with my thumb.
- As a child on a laptop or desktop, I want a clear top header with large text buttons so that I can find my way around without getting lost.
- As a child learning a lesson, I want the friendly lamb guide to talk to me, blink, and celebrate my wins so that learning feels welcoming and alive.
- As a parent, I want a dedicated settings link behind an arithmetic gate so that my child cannot accidentally change household accounts or leave the app.

**Acceptance criteria**:

- **AC-1**: Desktop viewport renders a fixed top bar of eighty pixels height containing the app logo, large section text buttons, active section indicator underlines, and a parent gate button.
- **AC-2**: Mobile viewport renders a fixed bottom tab bar of seventy two pixels height with safe area inset padding, featuring four primary tabs (Home, Bible, Saints, Fun) with thirty two pixel icons above fourteen pixel labels.
- **AC-3**: Active mobile tabs highlight with a forty eight pixel circular tint background in the section colour and display bold deep section text.
- **AC-4**: All navigation tab targets measure at least forty eight by forty eight pixels, with mobile tabs providing sixty four by fifty six pixels minimum touch area.
- **AC-5**: Mascot guide is built as a complete SVG vector component supporting live animations (gentle breathing, eye blinks, ear wiggles, and one shot celebration hops).
- **AC-6**: Mascot guide includes an optional speech bubble delivering interactive guidance, hint text, and gentle encouragement without covering main actions.
- **AC-7**: All animations collapse to instant static states when prefers reduced motion is active, and monorepo typecheck and lint pass with zero errors.

## Decision

**Chosen option**: Option 3: Modular SVG vector component with CSS keyframes and speech bubble.

We implement the responsive `AppShell` with desktop `TopNav` and mobile `BottomNav` in `packages/ui` and `apps/web`, and build `AnimatedLambGuide` as an expressive vector SVG with native CSS animations and interactive speech bubble capabilities.

**Implementation skills**: `vercel-react-best-practices` (`jsmastery-pro/skills`, `.agents/skills/vercel-react-best-practices/`) · `vercel-composition-patterns` (`jsmastery-pro/skills`, `.agents/skills/vercel-composition-patterns/`) · `web-design-guidelines` (`jsmastery-pro/skills`, `.agents/skills/web-design-guidelines/`)

## Rationale

See [rationale.md](rationale.md) for full context, options comparison, and decision rationale.

## Feature design

**Navigation layout anatomy**:

1. **Desktop Top Bar** (`TopNav`):
   - Position: `sticky top-0 z-40 w-full`
   - Height: 80px (`h-20`)
   - Canvas: white card surface (`bg-white`) with bottom border in soft sand (`border-b-2 border-sand-border`)
   - Left: Kid Zone brand mark with golden halo icon and Fredoka logo type
   - Center: Navigation tabs with section hover accents:
     - Home (Standout orange)
     - Children's Bible (Blue deep)
     - Saints and Catechism (Yellow deep)
     - Fun and Puzzles (Red and Green)
     - Youth Chat (Violet deep)
   - Active indicator: 4px solid underline in section base colour
   - Right: Parent gate button with slate styling and lock icon

2. **Mobile Bottom Tab Bar** (`BottomNav`):
   - Position: `fixed bottom-0 left-0 right-0 z-50`
   - Height: 72px (`h-[72px]`) plus safe area inset bottom
   - Canvas: white surface with top border (`border-t-2 border-sand-border shadow-lg`)
   - Four primary tabs:
     - Home (House icon, orange deep active)
     - Bible (BookOpen icon, blue deep active)
     - Saints (Crown icon, yellow deep active)
     - Fun (Gamepad2 icon, green deep active)
   - Far right tab: Parent entry (Shield or UserCog icon, slate active)
   - Target geometry: Each tab has `min-w-[64px] min-h-[56px]`
   - Active visual: 48px circular tint pill behind the 32px icon, bold 14px label

3. **Content safe padding**:
   - Web application layout wraps page views in a main container with `pb-28 sm:pb-8` so bottom mobile navigation never obscures content or interactive buttons.

**Animated SVG guide mascot anatomy** (`AnimatedLambGuide`):

1. Vector structure:
   - Floating aura background: gentle circular glow in warm sand
   - Body wool cloud: 5 overlapping white circles with 3px sand border
   - Feet and hooves: dark slate rounded pegs
   - Floppy ears: animated with `@keyframes lamb-ear-wiggle`
   - Head and face: warm sand rounded ellipse with rosy cheeks
   - Eyes: animated with `@keyframes lamb-blink` showing catchlights and pupil movement
   - Mouth and nose: mood expressive paths (gentle smile, thinking curve, joyful open mouth)
   - Celebration sparkles: rotating stars and particles for wins

2. Guide Speech Bubble:
   - Positioned above or beside the lamb with an SVG speech arrow pointing toward the head
   - White card background with 2px sand border and soft shadow
   - Font: Nunito 16px/1.4 text ink with bold highlights
   - Optional close button or interactive next tip prompt
   - Aria live polite announcement so screen readers voice the guide's hint

**API surface**:

| Component           | Key props                                                                        | Key outputs                    | Auth / Role              |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------ | ------------------------ |
| `AppShell`          | `children: ReactNode`, `activeSection?: SectionKind`                             | Full responsive layout wrapper | Public and authenticated |
| `TopNav`            | `activeSection?: SectionKind`, `onParentGateClick?: () => void`                  | Desktop top bar navigation     | Public and authenticated |
| `BottomNav`         | `activeSection?: SectionKind`, `onParentGateClick?: () => void`                  | Mobile bottom tab bar          | Public and authenticated |
| `AnimatedLambGuide` | `mood: LambMood`, `speechText?: string`, `onTap?: () => void`, `size?: LambSize` | Interactive living SVG guide   | Public and authenticated |

**Value sourcing**:

| Action            | Value produced / displayed            | Source                                                |
| ----------------- | ------------------------------------- | ----------------------------------------------------- |
| Route navigation  | Active tab selection                  | Next.js `usePathname()` hook                          |
| Mascot animation  | Keyframe motion state                 | CSS keyframes defined in `packages/ui/src/styles.css` |
| Guide tip         | Guidance text inside balloon          | Screen specific hint or mascot guidance prop          |
| Parent gate entry | Mathematical modal or settings access | Parent gate callback or `/parent` route               |

**Key invariants**:

- Bottom navigation bar is always visible on viewports below 640px width.
- Minimum tap target of all mobile tabs is at least sixty four by fifty six pixels.
- The lamb mascot never displays sad or angry facial expressions; mistakes trigger encouragement.
- Under `prefers-reduced-motion: reduce`, all keyframe animations cease and the lamb displays a calm static pose.
- The parent gate button remains visually distinct in slate neutral tones.

**Security model**:

Navigation and mascot guide are purely client UI components. Access to parent restricted sections triggers the parent gate challenge before navigation completes.

**Critical test scenarios**:

- Mobile navigation: Resizing viewport to 375px renders the bottom tab bar with 72px height and 48px+ tap targets, verifies **AC-2**, **AC-4**.
- Desktop navigation: Resizing viewport to 1024px renders the top header bar and hides the bottom mobile bar, verifies **AC-1**.
- Mascot blinking and speech: Rendering AnimatedLambGuide with a hint displays the speech balloon and SVG blinking keyframes, verifies **AC-5**, **AC-6**.
- Reduced motion: Emulating reduced motion disables SVG ear wiggles and eye blinking keyframes, verifies **AC-7**.

## Build plan

- [x] 1. Define mascot animation keyframes (`@keyframes lamb-blink`, `@keyframes lamb-ear-wiggle`, `@keyframes lamb-hop`) and tab utility styles in `packages/ui/src/styles.css`, satisfies **AC-5**, **AC-7**.
- [x] 2. Implement `AnimatedLambGuide` component with interactive vector blinking, mood expressions, and speech bubble in `packages/ui/src/components/animated-lamb-guide.tsx`, satisfies **AC-5**, **AC-6**.
- [x] 3. Implement `TopNav` desktop header bar component with logo, section links, and parent gate access in `packages/ui/src/components/top-nav.tsx`, satisfies **AC-1**, **AC-4**.
- [x] 4. Implement `BottomNav` mobile bottom tab bar component with 72px height, 64x56 tap targets, and section tint active indicators in `packages/ui/src/components/bottom-nav.tsx`, satisfies **AC-2**, **AC-3**, **AC-4**.
- [x] 5. Implement `AppShell` responsive layout component unifying `TopNav`, `BottomNav`, and main content padding in `packages/ui/src/components/app-shell.tsx`, satisfies **AC-1**, **AC-2**.
- [x] 6. Integrate `AppShell` into `apps/web/src/app/layout.tsx` and showcase `AnimatedLambGuide` on `apps/web/src/app/page.tsx`, satisfies **AC-1**, **AC-2**, **AC-5**.
- [x] 7. Export components from `packages/ui/src/index.ts` and verify monorepo typecheck and lint with zero errors, satisfies **AC-7**.

## Consequences

**Positive**:

- Solves mobile and desktop navigation ergonomics completely without hamburger menus.
- Brings the lamb guide to life with lightweight native SVG and CSS animations.
- Delivers an immediate sense of wonder and warmth for children opening the app.

**Negative / tradeoffs**:

- Bottom navigation occupies seventy two pixels of vertical viewport space on mobile devices.
- Detailed SVG vector markup requires slightly more code than a flat raster image.

**Neutral**:

- Requires client side path matching using `usePathname()` to highlight the currently active tab.
