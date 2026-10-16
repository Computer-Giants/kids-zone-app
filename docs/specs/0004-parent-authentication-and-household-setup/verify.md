# Verify: parent authentication and household setup · spec 0004 · updated 2026-10-14

_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Visit `/signup` → enter parent email, strong password, optional name → submit → expect redirect to `/parent` dashboard with active household details → AC-1, AC-2
- [x] Visit `/login` → enter valid parent email and password → submit → expect redirect to `/parent` dashboard → AC-3, AC-5
- [x] Visit `/login` → select Magic Link tab → enter parent email → submit → expect confirmation message instructing parent to check email → AC-4
- [x] Visit `/parent` directly without an active session → expect redirect to `/login?next=%2Fparent` → AC-6
- [x] Click Sign Out on `/parent` dashboard → expect session cookies destroyed and redirect to `/` → AC-7
- [x] Inspect all auth pages and dashboard → confirm zero child credential inputs or forms exist → AC-8

## Commands

- [x] `pnpm run typecheck` → all packages pass TypeScript checking cleanly → AC-8
- [x] `pnpm run lint` → all packages pass ESLint without warnings or errors → AC-8
- [x] `pnpm run test` → all unit test suites execute and pass → AC-8
- [x] `pnpm --filter @kidzone/web build` → Next.js App Router compiles and statically prerenders all routes without errors → AC-5, AC-8

## Acceptance-criteria coverage

- AC-1 covered by UI / manual step 1 and Zod password validation
- AC-2 covered by UI / manual step 1 and database trigger `handle_new_user()`
- AC-3 covered by UI / manual step 2
- AC-4 covered by UI / manual step 3
- AC-5 covered by UI / manual step 2 and Commands step 4
- AC-6 covered by UI / manual step 4 and Playwright test `apps/web/e2e/auth.spec.ts`
- AC-7 covered by UI / manual step 5
- AC-8 covered by UI / manual step 6 and Commands steps 1-4
