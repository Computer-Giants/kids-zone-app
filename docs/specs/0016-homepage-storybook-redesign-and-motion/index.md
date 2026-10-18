# 0016. Homepage Storybook Redesign and Motion Architecture

**Date**: 2026-10-18  
**Status**: In Progress

## Summary

This specification defines the comprehensive redesign of the Kid Zone web homepage into an engaging storybook experience inspired by Catholic children picture books and modern mobile learning applications. It introduces organic wavy section transitions between contrasting cream and sand canvases, a living vector lamb guide without enclosing card borders, a floating tooltip speech bubble with typewriter text and mouth animation on tap, an authentic daily analytics quest hub grounded in database habit metrics, auth aware primary navigation, an autoshowing dismissible floating application download card with mobile clearance, and smooth card expansion transitions using motion spring physics.

## Requirements

**User stories**:

- As a young Catholic child visiting the homepage, I want to see a friendly living lamb companion talking directly to me with floating tips, so that I feel welcomed, guided, and excited to explore my faith without feeling boxed in.
- As a child or parent returning to the application, I want an auth aware call to action and a rich daily quest analytics hub, so that I can see my streak days and weekly stars, and jump straight into my scripture reading or daily review.
- As a child tapping any learning feature card, I want the card to respond with tactile motion and spring physics, feeling physical, playful, and responsive.
- As a parent browsing on a tablet or desktop, I want a floating download badge with a QR code and store links that clears the mobile navigation bar and stays dismissed in session storage once closed.

**Acceptance criteria**:

- **AC-1**: The primary hero action is auth aware: guests see "Begin Your Journey" routing to `/signup`; signed in households with no selected child see "Choose Child Profile" routing to `/profiles`; signed in households with an active child see "Continue [Child Name]'s Journey" routing directly to `/bible`.
- **AC-2**: The Guide Lamb displays without an enclosing background card container; its speech bubble floats above the lamb as an absolute tooltip with zero vertical layout push; the vector lamb mouth animates in sync with typewriter text only upon user interaction (tapping the lamb or mood buttons) and rests quietly to honor the calm ambient animation rule.
- **AC-3**: A floating card appears in the bottom right viewport displaying a stylized QR code pointing to `/download`, copy stating "Scan to get the Kid Zone app", and official store badges; the card is positioned above the mobile bottom tab bar (`bottom-24 sm:bottom-6`) to prevent collision, and tapping close persists dismissal in `sessionStorage` for the entire browser session.
- **AC-4**: The Daily Quest and Review hub contains authentic analytics cards grounded in actual database tables: active daily streak days from `child_streaks`, weekly stars sum from `rewards_ledger`, today's scripture of the day card, and the spaced repetition warmup card with due review count; guests see encouraging starter values ("Start Day 1", "Earn Stars", "3 Reviews Ready").
- **AC-5**: Tapping any learning feature card triggers a shared layout spring expansion transition via the approved `motion` package where the pressed card smoothly expands outward into the screen as the destination route opens.
- **AC-6**: Major page sections use static storybook document flow with organic wavy SVG top dividers between alternating cream (`#fffaf0`) and sand (`#fff1d6`) backgrounds, ensuring smooth mobile touch scrolling without sticky overflow clipping.
- **AC-7**: The accessible sticker button system is preserved and highlighted across the page with solid vibrant fills, forty eight pixel minimum tap targets, and tactile sticker shadows that depress on active touch.
- **AC-8**: All interactive elements and motion effects respect accessibility standards: WCAG AA color contrast, screen reader `aria-live="polite"` announcing completed speech tips without character chatter, and immediate bypass of expansion animations and typewriter loops when `prefers-reduced-motion` is active.

## Decision

**Chosen option**: Option 1: Storybook Motion Architecture with Natural Storybook Wave Flow and Grounded Habit Analytics

The Kid Zone homepage will be rebuilt using natural storybook wave section transitions, an unconstrained floating Guide Lamb with interaction triggered typewriter mouth movement, a database grounded habit analytics hub, and motion spring transitions.

**Implementation skills**: `improve-ui` (`ibelick`, `~/.gemini/config/skills/improve-ui/`), `improve-animations` (`Emil Kowalski`, `~/.gemini/config/skills/improve-animations/`), `architect` (`.agents/skills/architect/`)

## Feature design

**Component and state architecture**:

1. **Auth Aware Hero Banner (`apps/web/src/app/page.tsx`)**:
   - Checks active household learner session via client cookies (`kz_active_child`) or auth state.
   - Computes dynamic primary button label:
     - Unauthenticated guest: "Begin Your Journey" -> `/signup`
     - Authenticated without child: "Choose Child Profile" -> `/profiles`
     - Authenticated with child: "Continue [Child Name]'s Journey" -> `/bible`

2. **Living Vector Lamb Guide with Tooltip (`packages/ui/src/components/animated-lamb-guide.tsx`)**:
   - Strips the outer bordered card container so the vector lamb sits organically on the warm cream canvas.
   - Positioned tooltip bubble: Uses CSS absolute positioning with a floating pointer tail anchored above the lamb head, preventing layout reflow.
   - Typewriter engine: React hook `useTypewriter` emits `displayedText` character by character at thirty milliseconds per character alongside a boolean `isSpeaking`.
   - Vector mouth flap: When `isSpeaking` is true, the lamb SVG mouth toggles an open and close vertical scale keyframe (`scaleY(0.4)` to `scaleY(1.2)`), pausing in a gentle smile when typing finishes. Motion triggers only on user tap or mood selection, adhering to the calm animation rule.

3. **Floating QR Code Application Download Card (`apps/web/src/components/floating-app-banner.tsx`)**:
   - Fixed container at `bottom-24 sm:bottom-6 right-4 sm:right-6 z-40` with slide up entrance deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`), positioned to clear the 72px mobile bottom navigation bar.
   - Reads and writes `sessionStorage.getItem("kidzone_app_banner_dismissed")`. If present, renders nothing.
   - Contains high contrast SVG QR code pointing to `/download`, App Store badge, Google Play badge, and an accessible close button with a minimum forty eight pixel touch target.

4. **Authentic Learning Analytics & Quest Hub**:
   - Four distinct bento statistic cards:
     - Streak Card: Warm amber tint with flame glyph, current day streak number from `child_streaks` (guest default: "Day 1"), and "Active Faith Habit" label.
     - Weekly Stars Card: Golden yellow tint with star glyph, current weekly star count from `rewards_ledger` (guest default: "0 Stars"), and age band milestone note.
     - Scripture of the Day Card: Soft blue tint with open book glyph, showcasing today's sacred verse preview with read aloud audio trigger.
     - Spaced Repetition Warmup Card: Direct integration of `DailyReviewCard` with due review count, start button, and progress meter.

5. **Storybook Section Flow with Organic Waves**:
   - Section 1: Hero and Guide Lamb (cream background `#fffaf0`).
   - Section 2: Daily Quest & Analytics Hub with wavy top SVG mask (sand background `#fff1d6`).
   - Section 3: Learning Tracks Bento Grid with wavy top SVG mask (white background `#ffffff`).
   - Section 4: Parent Assurance & Button Showcase with wavy top SVG mask (cream background `#fffaf0`).
   - Uses standard document flow to guarantee that tall bento card grids (>1500px on mobile) scroll smoothly without sticky viewport trapping.

6. **Motion Shared Layout Card Expansion**:
   - Uses `motion/react` with `layoutId` attached to each feature card (`layoutId={`feature-card-${section}`}`).
   - On tap, the card expands smoothly over two hundred and eighty milliseconds with Quart Out deceleration curve (`cubic-bezier(0.16, 1, 0.3, 1)`), morphing scale and border radius into the destination page header before completing Next.js router push.

**Value sourcing**:

| Action / Surface          | Value displayed                                                                     | Source                                                                |
| ------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Hero primary button label | "Continue [Child Name]'s Journey" vs "Choose Child Profile" vs "Begin Your Journey" | Derived from `kz_active_child` cookie and auth session                |
| Hero primary link         | `/bible` vs `/profiles` vs `/signup`                                                | Derived from authentication status and active child profile presence  |
| Lamb speech text          | Tip string with typewriter animation                                                | `GUIDE_TIPS[guideMood]` client state dictionary                       |
| Lamb mouth movement       | Boolean `isSpeaking` driving SVG mouth scale                                        | `useTypewriter` hook state, triggered on user interaction             |
| Floating app banner       | Visibility boolean                                                                  | `sessionStorage` item `"kidzone_app_banner_dismissed"`                |
| Daily streak count        | Integer day streak                                                                  | Retrieved from `child_streaks` table (guest default: 0)               |
| Weekly star balance       | Integer star sum                                                                    | Computed sum from `rewards_ledger` for active week (guest default: 0) |
| Review cards due          | Integer due count                                                                   | Retrieved from `daily_reviews` query (guest default: 3)               |
| Scripture verse           | Daily Bible verse text                                                              | Retrieved from `verses_of_the_day` table                              |

**Key invariants**:

- The primary call to action remains the single orange standout button on the screen.
- Minimum tap targets for all clickable buttons, cards, and close triggers are forty eight pixels or greater.
- The floating speech tooltip never alters the geometric dimensions of the hero layout.
- The floating download banner never obscures the mobile bottom tab bar navigation.
- Dismissing the application download banner immediately sets session storage and hides the banner across all route transitions within that session.
- Motion animations and typewriter text effects are completely bypassed when `prefers-reduced-motion: reduce` is detected.

**Security model**:

- The homepage remains fully accessible to unauthenticated guests and search crawlers without requiring login.
- Child profile nicknames displayed on the auth aware hero button are retrieved strictly from the authenticated parent household session; no other household data is readable.

**Configuration required**:

- Add package dependency `motion` to `apps/web/package.json` for React 19 motion primitives.

**Critical test scenarios**:

- Guest hero rendering: Unauthenticated visitor sees "Begin Your Journey" linking to `/signup`, verifies **AC-1**.
- Authenticated household without child: Signed in parent without an active child profile sees "Choose Child Profile" linking to `/profiles`, verifies **AC-1**.
- Authenticated household with active child: Signed in parent with active child "Leo" sees "Continue Leo's Journey" linking to `/bible`, verifies **AC-1**.
- Tooltip speech without layout shift: Tapping Guide Lamb mood changes speech text with typewriter animation while hero bounding boxes remain motionless, verifies **AC-2**.
- Floating download card mobile clearance and dismissal: Banner appears above mobile bottom nav (`bottom-24`), dismisses cleanly on close button click, and does not reappear after route change in the same session, verifies **AC-3**.
- Analytics cards presentation: Daily quest hub shows streak, star count, scripture of the day, and spaced review with correct icons and colors, verifies **AC-4**.
- Card expansion touch: Tapping a learning card initiates smooth spring expansion and navigates to the target section, verifies **AC-5**.
- Storybook wave scrolling: Scrolling the page shows each wavy section smoothly transitioning over contrasting backgrounds without clipping, verifies **AC-6**.
- Reduced motion fallback: Enabling reduced motion preference renders full text instantly with zero typewriter delay and standard instantaneous navigation, verifies **AC-8**.

## Build plan

1. [x] Add `motion` dependency to `apps/web/package.json` and verify clean build, satisfies **AC-5**.
2. [x] Create reusable `WaveDivider` SVG component in `packages/ui` supporting configurable fill colors and orientations, satisfies **AC-6**.
3. [x] Enhance `AnimatedLambGuide` in `packages/ui`: remove card wrapper, add absolute tooltip speech bubble, integrate `useTypewriter` hook, and add animated mouth flapping vector keyframe synchronized with speech typing, satisfies **AC-2**, **AC-8**.
4. [x] Build `FloatingAppBanner` component with stylized QR code, App Store and Google Play badges, mobile navigation clearance, and session storage persistence, satisfies **AC-3**.
5. [x] Build `AnalyticsQuestHub` component featuring streak flame card, weekly stars counter, scripture verse preview, and spaced repetition review bar with guest fallback states, satisfies **AC-4**.
6. [x] Implement auth aware state on the hero section: check household session and active child profile to render personalized continue button, satisfies **AC-1**.
7. [x] Rebuild `apps/web/src/app/page.tsx` with storybook wave section transitions, enriched bento learning cards with motion shared layout, and the accessible sticker button showcase, satisfies **AC-5**, **AC-6**, **AC-7**, **AC-8**.
8. [x] Verify end to end functionality with unit tests, TypeScript typechecking, and manual browser verification, satisfies **AC-1** through **AC-8**.

## Consequences

**Positive**:

- The homepage transforms into a vibrant, tactile, storybook adventure that delights young Catholic children.
- No more awkward card within card nesting or layout shifting speech balloons.
- Children immediately see their daily progress and streak habits, encouraging regular faith practice.
- Parents can easily install the app on mobile devices via the QR code while enjoying a clean browsing experience if they dismiss it.
- Mobile viewports scroll smoothly with full card accessibility and zero bottom tab bar collisions.

**Negative / tradeoffs**:

- Adding the `motion` package adds a small bundle size increment to the web application.

## Follow-up

- [ ] Verify mobile Safari viewport behavior with wave dividers to confirm smooth rendering.
- [ ] Ensure SVG QR code renders crisply across high density retina displays.

## Rationale

Reasoning, alternatives considered, and architectural tradeoffs are documented in [rationale.md](rationale.md).
