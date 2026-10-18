# Verify: church tour interactive scenes · spec 0015 · updated 2026-10-18

_Steps derived from spec 0015 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Visit `/church-tour` in a browser → confirm five room sequence tabs display (Narthex, Nave, Sanctuary, Altar, Sacristy) and active room renders responsive vector illustration → AC-1, AC-6
- [ ] Inspect scene hotspots on phone, tablet, and desktop viewports → confirm glowing golden halo buttons maintain stable alignment using percentage coordinates and 48px tap targets → AC-2
- [ ] Tap any sacred item hotspot (such as the Tabernacle or Holy Water Font) → confirm bottom sheet dialog opens with title, sacred illustration badge, age tailored explanation, and "How we behave" Catholic reverence note → AC-3
- [ ] On the open item dialog, tap "Read Aloud" → confirm Web Speech API audio narration speaks the lesson with pause and stop controls → AC-4
- [ ] Tap "View in Catechism Glossary" on items with linked terms → confirm direct navigation to the catechism glossary entry → AC-5
- [ ] Tap "Walk Forward" and "Walk Back" buttons → confirm smooth horizontal transitions between adjacent scenes → AC-6
- [ ] As an unauthenticated guest learner, explore all five scenes and open item dialogs → confirm full exploration access with zero sign in prompts or database mutation errors → AC-7
- [ ] Complete inspection of all 14 items across all five rooms and tap "Claim 5 Stars" → confirm completion banner renders and 5 habit stars are awarded idempotently → AC-8

## Commands

- [ ] `pnpm --filter @kidzone/db test` → Catholic church tour data seed suite passes with 5 sequential scenes and 14 items → AC-1, AC-2
- [ ] `pnpm --filter @kidzone/validators test` → Church tour Zod validation suite passes for queries and completion payloads → AC-8
- [ ] `pnpm --filter @kidzone/api test` → Church tour API route test suite passes for scene lists, detail by slug, and completion rewards → AC-1, AC-7, AC-8
- [ ] `pnpm build` → Full production build and static page generation for `/church-tour` and `/church-tour/[slug]` succeeds → AC-1, AC-6

## Acceptance-criteria coverage

- AC-1: Covered by UI step 1 and API command test
- AC-2: Covered by UI step 2 and DB command test
- AC-3: Covered by UI step 3
- AC-4: Covered by UI step 4
- AC-5: Covered by UI step 5
- AC-6: Covered by UI step 1, step 6, and build command
- AC-7: Covered by UI step 7 and API guest test
- AC-8: Covered by UI step 8 and validators/API command tests
