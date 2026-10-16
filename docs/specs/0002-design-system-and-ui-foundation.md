# 0002. Design System and UI Foundation

**Date**: 2026-10-14  
**Status**: In Progress

## Summary

This decision defines the core visual design tokens, typography scales, accessible button components, and lamb mascot reactions for Kid Zone. We encode the full design specification into Tailwind v4 variables inside packages/ui and export reusable React components that enforce child friendly usability rules. Every interactive element maintains a minimum tap target of forty eight pixels, sticker shadows supply tactile feedback without gradients, and motion strictly respects user accessibility preferences.

## Context

Kid Zone serves children between three and fifteen years old on a wide variety of mobile devices and screens. A six year old browsing on an inexpensive phone needs large clear controls, high contrast readable text, and predictable tactile cues. Generic web component libraries default to small thirty two pixel buttons, subtle grey text, and complex dropdown menus that frustrate young learners.

The application requirements established in the project documentation mandate a calm storybook look. Orange acts as the standout call to action colour telling the child what to do next, while distinct section hues identify Bible, saints, catechism, quizzes, games, and stories. The design specification explicitly forbids generic web patterns such as pulse animations, card wrapped headings, testimonial walls, and negative red error states.

Without a centralized design system package, frontend screens would inevitably invent inconsistent colours, violate contrast thresholds, or use undersized buttons. We need a single foundation in packages/ui that translates design.json into type safe components and Tailwind theme tokens consumed by apps/web.

## Requirements

**User stories**:

- As a young child, I want big colourful buttons and clear pictures so that I can explore stories and lessons without getting stuck.
- As a child with motor or vision differences, I want large tap targets, distinct focus outlines, and steady screens so that I can use the app comfortably.
- As a developer, I want prebuilt accessible UI components and design tokens so that every screen automatically adheres to our design guidelines.

**Acceptance criteria**:

- **AC-1**: All colour tokens from design.json (cream page surface, warm ink text, sand borders, orange standout, and six section hues) exist as Tailwind v4 theme variables in packages/ui.
- **AC-2**: Heading font Fredoka, body font Nunito, and scripture font Merriweather are configured in apps/web layout with smooth fallbacks, keeping body text at or above eighteen pixels.
- **AC-3**: Button component in packages/ui implements pill shape, solid fills, sticker shadows with zero blur, and distinct sizes where the smallest tap target is at least forty eight pixels.
- **AC-4**: Button variants support the standout orange primary action, section themes (bible, saints, quizzes, games, stories, chat, parent), and outline style with mandatory icon pairing on child facing screens.
- **AC-5**: Mascot component renders the friendly lamb guide with four moods (happy, thinking, celebrating, encouraging) using clean vector graphics, never showing sad reactions on incorrect answers.
- **AC-6**: Interactive controls provide high contrast focus rings with four pixel width in deep blue, and all motion stops or collapses to instant state changes when prefers reduced motion is active.
- **AC-7**: Monorepo packages typecheck and lint cleanly with zero errors when importing components from packages/ui.

## Options considered

### Option 1: Ad hoc Tailwind utility classes across screens

Write styling inline in apps/web pages using standard Tailwind utility classes without a shared component library.

**Pros**:

- Quick to start prototyping initial pages.
- Avoids creating an abstraction layer in packages/ui.

**Cons**:

- Guarantees token drift where different pages use slightly different hex colours.
- Fails to enforce minimum tap target sizes and sticker shadow physics across screens.
- Forces every developer to hand code accessible focus rings and reduced motion guards.

### Option 2: Stock Shadcn UI component installation

Install standard Shadcn UI components with their default zinc palette and Radix primitives.

**Pros**:

- Well tested keyboard navigation and Radix accessibility primitives.
- Familiar file structure for React developers.

**Cons**:

- Defaults to thirty two and forty pixel tap targets that violate our forty eight pixel minimum rule for children.
- Implements dark mode, subtle grays, and rounded rectangles instead of the required warm cream canvas, storybook pill buttons, and solid sticker shadows.
- Requires extensive overrides to remove disallowed pulse animations and gradient effects.

### Option 3: Custom token system and child tailored primitives in packages/ui (Recommended)

Encode design.json tokens directly into packages/ui styles.css using Tailwind v4 theme directives, and export custom Button and Mascot components built for children.

**Pros**:

- Directly realizes design.json with exact OKLCH and hex color pairings verified for WCAG AA contrast.
- Guarantees forty eight pixel minimum tap targets and fifty six pixel primary actions by default.
- Implements solid sticker shadow physics, active state press transitions, and lamb mascot moods natively.
- Consumed directly as source code across apps/web and future admin portals without bundle bloat.

**Cons**:

- Requires authoring and maintaining base components within the monorepo.

## Decision

**Chosen option**: Option 3: Custom token system and child tailored primitives in packages/ui.

We define all semantic and primitive tokens in `packages/ui/src/styles.css` using Tailwind v4 `@theme` directives, configure Google fonts in `apps/web/src/app/layout.tsx`, and export accessible `Button`, `SectionCard`, and `MascotLamb` components from `packages/ui`.

**Implementation skills**: `vercel-react-best-practices` (`jsmastery-pro/skills`, `.agents/skills/vercel-react-best-practices/`) · `vercel-composition-patterns` (`jsmastery-pro/skills`, `.agents/skills/vercel-composition-patterns/`) · `web-design-guidelines` (`jsmastery-pro/skills`, `.agents/skills/web-design-guidelines/`)

## Rationale

Children have fundamentally different ergonomic needs than adult office software users. Small tap targets lead to mis taps, thin fonts hinder reading comprehension, and red warning badges create anxiety. Grounding our UI in `design.json` ensures that every child facing screen provides warm cream surfaces, clear Fredoka headings, comfortable Nunito reading typography, and tactile sticker buttons. Centralizing these primitives in `packages/ui` guarantees consistency and accessibility across the entire application lifecycle.

## Feature design

**Token architecture**:

Tokens live in `packages/ui/src/styles.css` using modern CSS variables and Tailwind v4 `@theme`:

1. Canvas surfaces:
   - Page surface: `#fffaf0` (warm cream)
   - Card surface: `#ffffff` (crisp white)
   - Muted surface: `#fff1d6` (warm sand)
   - Border default: `#f0e2c0` (soft sand border)

2. Text colours:
   - Primary text: `#2b2d42` (warm ink, 12.9:1 contrast against cream)
   - Secondary text: `#5c5f7a` (soft ink, 5.9:1 contrast against cream)
   - Deep text accents: `#a63f08` (orange deep), `#2a52d8` (blue deep), `#16793c` (green deep)

3. Section palette (base, deep, and tint for each section):
   - Standout brand: orange `#ff7a1a`, orange deep `#a63f08`, orange tint `#ffe8d6`
   - Bible: blue `#3d8bff`, blue deep `#2a52d8`, blue tint `#e0ecff`
   - Saints and Catechism: yellow `#ffd23f`, yellow deep `#7a5a00`, yellow tint `#fff6cc`
   - Quizzes: red `#ec4466`, red deep `#b01f45`, red tint `#ffe1e8`
   - Games: green `#35c76a`, green deep `#16793c`, green tint `#dcf7e5`
   - Stories: indigo `#5b5bd6`, indigo deep `#3b3ba8`, indigo tint `#e6e6fb`
   - Chat: violet `#a259ff`, violet deep `#7127c9`, violet tint `#f0e4ff`
   - Parent gate: slate `#5f6475`, slate tint `#eceef3`

4. Sticker shadow mechanics:
   - Solid offset shadow with zero blur radius: `0 6px 0 [variant-deep-color]`
   - Hover state on fine pointer devices: translates up two pixels with eight pixel shadow
   - Active press state: translates down four pixels with two pixel shadow
   - Disabled state: half opacity with two pixel shadow and no pointer events

**Component inventory**:

- `Button`: Pill shaped interactive button supporting sizes `md` (56px height, 32px padding), `lg` (64px height, 40px padding), and `icon` (56px square). Variants include `primary` (orange standout), `bible`, `saints`, `quizzes`, `games`, `stories`, `chat`, `parent`, and `outline`.
- `MascotLamb`: SVG based character illustration supporting moods `happy`, `thinking`, `celebrating`, and `encouraging`.
- `SectionCard`: Rounded container with section tint background, section deep header, two pixel sand border, and card shadow.

**Typography configuration**:

Loaded in `apps/web/src/app/layout.tsx` via `next/font/google`:

- `Fredoka` (weights 500, 600, 700) mapped to `--font-fredoka`
- `Nunito` (weights 400, 600, 700, 800) mapped to `--font-nunito`
- `Merriweather` (weights 400, 700, italic) mapped to `--font-merriweather`

**Value sourcing**:

| Action            | Value produced / displayed     | Source                                                               |
| ----------------- | ------------------------------ | -------------------------------------------------------------------- |
| Page rendering    | Background and font variables  | CSS custom properties in `packages/ui/src/styles.css`                |
| Button styling    | Dimensions and sticker shadow  | Component props passed to `buttonVariants` in `packages/ui`          |
| Mascot expression | Vector facial feature and pose | Mood prop (`happy`, `thinking`, `celebrating`, `encouraging`)        |
| Focus indicator   | Deep blue outline              | Keyboard focus ring styles matching `tokens.accessibility.focusRing` |

**Key invariants**:

- Minimum tap target of any interactive control is forty eight pixels; buttons default to fifty six pixels.
- Body text size never drops below eighteen pixels (1.125rem).
- No gradient fills are applied to button backgrounds, card icons, or text.
- No pulse, ping, or breathing ambient animations are permitted anywhere in the stylesheet.
- Under `prefers-reduced-motion: reduce`, all transitions become instantaneous and hop animations are replaced by static icons.

**Security model**:

UI components are presentation only and execute within the client browser. No user input is directly evaluated or rendered as unescaped HTML.

**Critical test scenarios**:

- Tap target compliance: Primary and secondary buttons measure at least fifty six pixels high and forty eight pixels wide, verifies **AC-3**.
- Contrast validation: Warm ink on cream canvas and all button text variants achieve at least 4.5:1 contrast ratio for body text and 3:1 for large controls, verifies **AC-1**, **AC-4**.
- Mascot encouraging reaction: Calling MascotLamb with encouraging mood displays a gentle smile without red exclamation or sad eyebrows, verifies **AC-5**.
- Reduced motion: Toggling reduced motion in browser disables button press translateY transitions, verifies **AC-6**.

## Build plan

1. [x] Define Tailwind v4 theme variables and sticker shadow utilities in `packages/ui/src/styles.css`, satisfies **AC-1**, **AC-6**.
2. [x] Configure Fredoka, Nunito, and Merriweather Google fonts and body typography in `apps/web/src/app/layout.tsx` and `packages/ui`, satisfies **AC-2**.
3. [x] Implement accessible `Button` component with sticker shadows, variants, and 56px default sizing in `packages/ui/src/components/button.tsx`, satisfies **AC-3**, **AC-4**.
4. [x] Implement vector `MascotLamb` component with four child friendly moods in `packages/ui/src/components/mascot-lamb.tsx`, satisfies **AC-5**.
5. [x] Implement `SectionCard` container component for learning modules in `packages/ui/src/components/section-card.tsx`, satisfies **AC-1**, **AC-4**.
6. [x] Export all primitives from `packages/ui/src/index.ts` and verify monorepo compilation, satisfies **AC-7**.

## Consequences

**Positive**:

- Single source of truth in `packages/ui` guarantees child safety, high contrast, and accessible tap targets across every screen.
- Fast Tailwind v4 compilation with zero runtime CSS footprint.
- Delightful storybook feel with authentic tactile sticker buttons that children love pressing.

**Negative / tradeoffs**:

- Custom sticker shadows require explicit CSS utility classes and fine pointer hover media queries.
- Forty eight pixel minimum targets reduce information density on desktop viewports.

**Neutral**:

- Requires Google fonts network fetch on build or local font bundling in Next.js.

## References

**Project sources**:

- `docs/design.json`: Kid Zone design system version 0.3.0 tokens, typography, and motion rules
- `.agents/AGENTS.md`: Storybook design principles, forty eight pixel touch targets, and lamb mascot guidelines
- `packages/ui/AGENTS.md`: UI package conventions, token mapping, and export structure

**Practices & standards**:

- WCAG 2.1 AA non text contrast standard: 3:1 minimum for user interface controls and focus rings
- Ergonomics for young children: large targets, predictable physics, and zero negative red reinforcement
