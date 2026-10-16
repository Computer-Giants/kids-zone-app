# Web Application

## Overview

The Next.js 15 front end for Kid Zone, built with the App Router and React 19. It serves the child learning experience and parent views, styled mobile first with Tailwind v4.

## Key files

| File                              | Owns                                                   |
| --------------------------------- | ------------------------------------------------------ |
| `src/app/page.tsx`                | Main landing and child journey entry                   |
| `src/app/(auth)/login/page.tsx`   | Parent sign in with password and magic link tabs       |
| `src/app/(auth)/signup/page.tsx`  | Parent account creation with timezone detection        |
| `src/app/(auth)/actions.ts`       | Server actions for parent sign up, login, and sign out |
| `src/app/parent/page.tsx`         | Protected parent household dashboard                   |
| `src/app/auth/callback/route.ts`  | PKCE code exchange for session cookies                 |
| `src/app/select-profile/page.tsx` | Child profile switcher and guest exploration entry     |
| `src/lib/child-session.ts`        | Active child session cookie and guest age band helpers |
| `src/lib/api.ts`                  | Typed RPC client connecting to the Hono API            |
| `src/middleware.ts`               | Supabase session refresh and route guards              |

## Commands

```bash
# Start local dev
pnpm dev

# Build production bundle
pnpm build

# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Mobile first layout, tested against small mobile screens
- Minimum 48px tap targets for every touchable element
- Use design tokens from packages/ui rather than raw color utilities
- Orange marks the primary next action; wrong answers remain encouraging and never red
- Database calls stay on the server, never directly in components

## Gotchas

- Motion answers user action or marks progress, with the dove on main page load as the single exception
- Child pages never include third party tracking scripts

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
