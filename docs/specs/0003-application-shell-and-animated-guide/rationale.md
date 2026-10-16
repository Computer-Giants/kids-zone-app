# 0003. Application Shell and Animated Guide Mascot: Rationale

**Date**: 2026-10-14  
**Status**: Accepted

## Context

Kid Zone is designed specifically for children who navigate primarily on smartphones and tablets. Standard desktop websites hide primary navigation behind hamburger menus, nested dropdowns, and tiny icons that young learners cannot easily reach or understand. On mobile touchscreens, children hold devices with two hands and navigate predominantly using their thumbs along the bottom half of the display.

Our visual design specification requires clear persistent navigation with minimum tap targets of sixty four by fifty six pixels on mobile and eighty pixels on desktop. Primary learning destinations including Home, Bible, Saints, and Fun must remain visible at all times without requiring complex gestures. In addition, the parent gate entry must remain distinct so children recognize it as an area meant only for adults.

The guide mascot serves as the child's friendly companion throughout their faith journey. Rather than a static flat image, the mascot must feel alive as a genuine guide. The lamb needs organic vector animation including eye blinks, gentle ear wiggles, and celebratory hops, paired with a dynamic speech balloon that delivers tips and encouragement. All animations must execute smoothly without third party runtime overhead and must instantly freeze into calm static poses when reduced motion is preferred.

## Options considered

### Option 1: Generic third party Lottie JSON animation files

Download pre recorded Lottie animations and run them with the Lottie web runtime player.

**Pros**:

- Allows animators to export directly from Adobe After Effects.
- Delivers complex multi layer motion.

**Cons**:

- Introduces a large third party runtime script on child facing pages.
- Makes programmatic mood switching and dynamic speech bubble attachments awkward and heavy.
- Does not easily adapt to our custom OKLCH design token color palette.

### Option 2: Static images with CSS translation wrappers

Use flat PNG or SVG images and animate only the outer container with simple CSS slide and fade classes.

**Pros**:

- Very simple to implement.
- Minimal CSS footprint.

**Cons**:

- The character feels like a cardboard cutout rather than an alive living companion.
- Does not allow independent eye blinking, ear wiggling, or expressive mouth reactions.
- Fails the user requirement for an engaging animated guide.

### Option 3: Modular SVG vector component with CSS keyframes and speech bubble (Recommended)

Build the lamb mascot as a pure React SVG component with layered vector groups animated via lightweight CSS keyframes and state driven moods.

**Pros**:

- Zero external dependencies: pure SVG and CSS running natively in the browser.
- Full independent control over facial features, blinking eyes, ear tilts, and celebration sparkles.
- Perfect integration with Tailwind v4 theme variables and design.json colors.
- Effortless accessible motion control: one media query freezes all internal vector keyframes.
- Easily embeds interactive speech bubbles and tap reactions.

**Cons**:

- Requires careful authoring of vector SVG paths and coordinates.

## Rationale

Children respond warmly to expressive characters that react to their presence. Building the guide as a layered SVG component gives us high fidelity character animation with zero external runtime libraries. Blinking eyes, ear wiggles, and celebration hops happen through efficient GPU accelerated CSS keyframes. Pairing this living guide with a responsive dual navigation shell ensures the application feels like a premier mobile first Catholic learning app.

## References

**Project sources**:

- `docs/design.json`: Section navigation rules, mobile bottom tab bar specifications, and lamb mascot character guide
- `.agents/AGENTS.md`: Storybook design aesthetic, forty eight pixel touch targets, and gentle encouraging mascot tone
- `docs/specs/0002-design-system-and-ui-foundation.md`: Base color tokens, typography, and button primitives

**Practices & standards**:

- Mobile touch ergonomics: Bottom thumb zone navigation for primary interactive destinations
- WCAG 2.1 AA accessible non text contrast and reduced motion compliance
