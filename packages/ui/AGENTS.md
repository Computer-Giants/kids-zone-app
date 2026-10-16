# UI Package

## Overview

Shared UI components, utility functions, and styling tokens for Kid Zone interfaces. Consumed as source by apps/web and other frontend surfaces.

## Key files

| File                                     | Owns                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/index.ts`                           | Barrel exports of buttons, mascot, cards, and icons                                        |
| `src/styles.css`                         | Tailwind v4 theme definitions and design token variables                                   |
| `src/components/button.tsx`              | Accessible pill button with sticker shadows and 56px minimum height                        |
| `src/components/mascot-lamb.tsx`         | Vector guide lamb illustration with four moods (happy, thinking, celebrating, encouraging) |
| `src/components/section-card.tsx`        | Learning module card with deep icon on tint background                                     |
| `src/components/app-shell.tsx`           | Responsive application shell with desktop top navigation and mobile bottom tab bar         |
| `src/components/animated-lamb-guide.tsx` | Interactive vector lamb mascot with blinking eyes and speech balloon hints                 |
| `src/components/child-avatar.tsx`        | Catholic preset saint avatar illustrations and badge presentation                          |
| `src/components/parent-gate-modal.tsx`   | Accessible numeric keypad modal guarding parent actions                                    |
| `src/lib/utils.ts`                       | Class merging helper `cn` combining clsx and tailwind-merge                                |

## Commands

```bash
# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Follow docs/design.json for palette tokens, typography, and spacing
- Components keep tap targets at or above 48px
- Buttons and interactive items support prefers-reduced-motion
- Avoid raw inline color values; map them to defined CSS variables

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
