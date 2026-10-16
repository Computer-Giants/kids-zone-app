# Verify: Child Profiles and Parent Gate · spec 0005

## UI / manual

- [x] Click Parents padlock in top navigation header → opens Parent Gate modal overlay with 10-digit keypad (0–9), Clear, and Close buttons → AC-6
- [x] Unauthenticated direct navigation to `/parent` → redirected with HTTP 307 to `/login?next=%2Fparent` → AC-8
- [x] View avatar picker selector → renders Catholic preset avatar items (Lamb, Dove, Lion, Fish, Saints) → AC-4

## Commands

- [x] `pnpm --filter @kidzone/validators test` → all 13 child profile and Catholic safety blocklist validation tests pass → AC-2, AC-5
- [x] `pnpm --filter @kidzone/utils test` → all 8 `calculateAgeBand` pure function date mapping tests pass → AC-3
- [x] `pnpm --filter @kidzone/web test:e2e` → all 6 Playwright E2E browser tests pass, including Parent Gate keypad interaction and route protection → AC-6, AC-7, AC-8
- [x] `node -e "fetch('http://localhost:3001/parent', { redirect: 'manual' })"` → returns HTTP 307 redirect to `/login?next=%2Fparent` → AC-8
- [x] `node -e "fetch('http://localhost:8787/api/health')"` → returns `{ ok: true }` from running Hono API → AC-1

## Acceptance-criteria coverage

- AC-1: Parent child creation action & modal · met ✅
- AC-2: Nickname validation & Catholic safety filter · met ✅
- AC-3: Pure age band calculation function · met ✅
- AC-4: Catholic preset avatar picker · met ✅
- AC-5: Web Crypto 4-digit PIN hashing · met ✅
- AC-6: Accessible numeric keypad parent gate modal · met ✅
- AC-7: Household security passcode migration · met ✅
- AC-8: Child privacy invariants & route protection · met ✅
