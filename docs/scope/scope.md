# Scope: Kid Zone

A Catholic learning platform for children aged 3 to 15 covering Bible, saints, catechism, stories, quizzes, and church puzzles. Parents hold the account, a priest reviews all published content, and a friendly lamb guides the child.

**Build approach:** Tracer Bullet (vertical slices built end to end through every layer so each slice works completely).
**Workflow:** Beta (after develop, run check verify then write test suites). Child data and authentication features carry the GA tag for extra review rigor.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| #   | Feature                                     | Phase      | Status      |
| --- | ------------------------------------------- | ---------- | ----------- |
| 1   | Monorepo tooling and workspace standards    | Foundation | done        |
| 2   | Core database schema and migrations         | Foundation | done        |
| 3   | Design system and UI foundation             | Foundation | done        |
| 4   | Application shell and animated guide mascot | Foundation | done        |
| 4b  | Brand assets and SEO metadata               | Foundation | done        |
| 5   | Parent authentication and household setup   | Slice 1    | done        |
| 6   | Child profiles and parent gate              | Slice 1    | done        |
| 7   | Profile switcher and guest mode             | Slice 1    | done        |
| 8   | Bible reader and verse of the day           | Slice 2    | done        |
| 9   | Saint of the day and life stories           | Slice 2    | done        |
| 10  | Quizzes and lamb guide feedback             | Slice 3    | done        |
| 11  | Church puzzles engine                       | Slice 3    | done        |
| 12  | Rewards ledger and streak tracking          | Slice 4    | done        |
| 13  | Leaderboard and daily review                | Slice 4    | done        |
| 14  | Privacy first analytics and habit tracking  | Slice 4    | done        |
| 15  | Church tour interactive scenes              | Phase 2    | in-progress |
| 16  | Digital colouring studio                    | Deferred   | planned     |
| 17  | Challenges and parish prize shop            | Deferred   | planned     |
| 18  | Moderated community chat                    | Deferred   | planned     |
| 19  | Faith AI guide                              | Deferred   | planned     |
| 20  | Throwback family memories                   | Deferred   | planned     |

---

## Foundations

### 1. Monorepo tooling and workspace standards · done

Set up Turborepo, pnpm workspaces, TypeScript strict checking, ESLint presets, Prettier formatting, and workspace context files.
**Done when:** root typecheck, lint, and build pass cleanly across all packages and apps.

- [x] Monorepo workspace configuration: `/audit`
- [x] Lint and format configuration: `/develop tooling`
- [x] TypeScript verification across packages: `/test`
      Code in `./`

### 2. Core database schema and migrations · done · GA

Define Drizzle table schemas for the 54 MVP tables documented in the data model, configure relations, and generate baseline SQL migrations.
**Done when:** all MVP tables exist in packages/db with proper primary keys, foreign keys, and row level security policies applied. (basis: docs/data-model.md)

- [x] Design it (spec): [0001](../specs/0001-core-database-schema-and-migrations.md)
- [x] Build it: /develop core database schema and migrations
  - [x] Schema generation and clean SQL migration files (AC-1, AC-3)
  - [x] Supabase schema migration and table deployment (AC-1, AC-4, AC-7)
  - [x] Auth triggers, search extensions, and RLS policies (AC-2, AC-5, AC-6)
- [x] Verify it: /check verify core database schema and migrations
- [x] Test it: /test core database schema and migrations
- [x] Review it (fresh model): /check review core database schema and migrations
- [ ] Document it: /document core database schema and migrations
      Code in `packages/db/src/schema/`

### 3. Design system and UI foundation · done

Establish color tokens, typography scales, touch target minimums of 48px, accessible buttons, and the lamb mascot component based on the design specification.
**Done when:** packages/ui exports accessible base components and Tailwind v4 theme variables matching design.json. (basis: docs/design.json)

- [x] Design it (spec): [0002](../specs/0002-design-system-and-ui-foundation.md)
- [x] Build it: /develop design system and UI foundation
  - [x] Color tokens and Tailwind v4 theme variables (AC-1)
  - [x] Typography and font loading setup (AC-2)
  - [x] Accessible Button component with sticker shadows (AC-3, AC-4, AC-6)
  - [x] MascotLamb and SectionCard components (AC-5, AC-6)
- [x] Verify it: /check verify design system and UI foundation
- [x] Test it: /test design system and UI foundation
- [ ] Review it (fresh model): /check review design system and UI foundation
- [ ] Document it: /document design system and UI foundation
      Code in `packages/ui/` and `apps/web/src/app/globals.css`

### 4. Application shell and animated guide mascot · done

Dual navigation application shell with 80px desktop header and 72px mobile bottom tab bar, paired with an interactive living SVG lamb guide with eye blinks, ear wiggles, and speech balloon tips.
**Done when:** desktop view displays sticky top navigation, mobile view displays fixed bottom tab bar with 64x56 tap targets, and the lamb guide blinks, reacts to taps, and offers speech hints. (basis: docs/design.json)

- [x] Design it (spec): [0003](../specs/0003-application-shell-and-animated-guide/index.md)
- [x] Build it: /develop application shell and animated guide mascot
  - [x] Animation keyframes and tab utility styles in packages/ui (AC-5, AC-7)
  - [x] AnimatedLambGuide vector component with blinking and speech bubble (AC-5, AC-6)
  - [x] TopNav desktop header and BottomNav mobile tab bar components (AC-1, AC-2, AC-3, AC-4)
  - [x] AppShell responsive layout and web application integration (AC-1, AC-2, AC-5)
  - [x] UI component exports, typecheck, and lint verification (AC-7)
- [x] Verify it: /check verify application shell and animated guide mascot
- [ ] Test it: /test application shell and animated guide mascot
- [ ] Review it (fresh model): /check review application shell and animated guide mascot
- [ ] Document it: /document application shell and animated guide mascot
      Code in `packages/ui/` and `apps/web/`

### 4b. Brand assets and SEO metadata · done

Configure Next.js 15 metadata, Open Graph cards, browser favicons, programmatic robots.txt, sitemap.xml, and Web App Manifest using the Kid Zone brand assets.
**Done when:** public pages render complete metadata with Open Graph and Twitter cards, browser favicons resolve natively, private family areas are disallowed from crawlers, and the sitemap and manifest pass validation.

- [x] Design it (spec): [0006](../specs/0006-brand-assets-and-seo-metadata.md)
- [x] Build it: /develop brand assets and SEO metadata
  - [x] Browser icon mirroring and root layout Metadata configuration (AC-1, AC-2, AC-3)
  - [x] Web App Manifest and JSON-LD structured data (AC-1, AC-6)
  - [x] Programmatic robots.txt and sitemap.xml with privacy boundaries (AC-4, AC-5)
- [x] Verify it: /check verify brand assets and SEO metadata
- [x] Test it: /test brand assets and SEO metadata
      Code in `apps/web/`

---

## Slice 1: Household and Child Profiles (The Walking Skeleton)

### 5. Parent authentication and household setup · done · GA

Parent email sign up and login via Supabase Auth, household record creation, and parent role assignment.
**Done when:** a parent can register, log in, view their household dashboard, and maintain a secure session. (basis: docs/project-doc.md)

- [x] Design it (spec): [0004](../specs/0004-parent-authentication-and-household-setup/index.md)
- [x] Build it: /develop parent authentication and household setup
  - [x] Database trigger update and household provisioning (AC-2)
  - [x] Auth server actions and PKCE callback handler (AC-1, AC-3, AC-4, AC-5, AC-7)
  - [x] Responsive login and sign up pages in apps/web (AC-1, AC-3, AC-4)
  - [x] Protected parent dashboard and session middleware (AC-5, AC-6)
  - [x] Typecheck, lint, and security verification (AC-8)
- [x] Verify it: /check verify parent authentication and household setup
- [x] Test it: /test parent authentication and household setup
- [x] Review it (fresh model): /check review parent authentication and household setup
- [ ] Document it: /document parent authentication and household setup
      Code in `apps/web/src/app/(auth)/` and `packages/auth/`

### 6. Child profiles and parent gate · done · GA

Parent creates child profiles with a nickname checked against the filter blocklist, birth date with derived age band, preset avatar, and optional 4-digit PIN.
**Done when:** child profiles are created under the household without collecting real names, age bands derive correctly, and an accessible parent gate passcode protects settings. (basis: docs/data-model.md)

- [x] Design it (spec): [0005](../specs/0005-child-profiles-and-parent-gate/index.md)
- [x] Build it: /develop child profiles and parent gate
  - [x] Household passcode migration and pure age band derivation (AC-3, AC-7)
  - [x] Nickname validation and Catholic safety filter (AC-2, AC-5)
  - [x] Catholic preset avatar collection and selector in packages/ui (AC-4)
  - [x] Accessible numeric keypad parent gate modal (AC-6)
  - [x] Child profile management views and server actions in apps/web (AC-1, AC-5, AC-8)
- [x] Verify it: /check verify child profiles and parent gate
- [x] Test it: /test child profiles and parent gate
- [x] Review it (fresh model): /check review child profiles and parent gate
- [ ] Document it: /document child profiles and parent gate
      Code in `apps/web/`, `packages/validators/`, `packages/utils/`, and `packages/db/`

### 7. Profile switcher and guest mode · done · GA

Profile selection screen where children choose their avatar, enter their PIN if configured, and enter the learning experience with guest browsing available without an account.
**Done when:** switching children changes the active age band context and guest users can browse content without writing server records. (basis: .agents/AGENTS.md)

- [x] Design it (spec): [0007](../specs/0007-profile-switcher-and-guest-mode.md)
- [x] Build it: /develop profile switcher and guest mode
  - [x] Active child and guest age band server actions with session cookies (AC-2, AC-3, AC-6)
  - [x] ChildPinModal numeric keypad component with encouraging feedback (AC-3, AC-4)
  - [x] Dedicated /select-profile screen with avatar cards and guest exploration (AC-1, AC-6)
  - [x] AppShell active avatar pill, profile switcher action, and parent gate guard (AC-5, AC-7)
  - [x] Client device progress tracking for guest mode (AC-6)
- [x] Verify it: /check verify profile switcher and guest mode
- [x] Test it: /test profile switcher and guest mode
      Code in `apps/web/`

---

## Slice 2: Core Learning Content

### 8. Bible reader and verse of the day · done

Bible reading view displaying curated key verses, kid retellings, full chapter text with device text to speech, and daily featured verses.
**Done when:** child sees age tailored Bible content, can switch reading modes, and read aloud plays cleanly on mobile devices. (basis: docs/data-model.md)

- [x] Design it (spec): [0008](../specs/0008-bible-reader-and-verse-of-the-day.md)
- [x] Build it: /develop bible reader and verse of the day
  - [x] Canonical Catholic book index and Douay Rheims Scripture data seeds (AC-1, AC-4)
  - [x] Hono API endpoints for books, chapter text, and Verse of the Day (AC-1, AC-4)
  - [x] Bible reader UI components and tri mode reading switcher in apps/web (AC-1, AC-2, AC-3, AC-5)
  - [x] Web Speech API and human narration read aloud audio playback (AC-6)
  - [x] 14 day offline Cache Storage and reading progress tracking (AC-7, AC-8)
- [x] Verify it: /check verify bible reader and verse of the day
- [x] Test it: /test bible reader and verse of the day
      Code in `apps/web/` and `apps/api/`

### 9. Saint of the day and life stories · done

Saint profile cards by feast day with illustrated story pages, recorded audio narration, patronages, prayers, and virtue tags.
**Done when:** the saint of the day displays correctly for today's date and tapping their story opens an illustrated page reader with audio playback. (basis: docs/design.json)

- [x] Design it (spec): [0009](../specs/0009-saint-of-the-day-and-life-stories.md)
- [x] Build it: /develop saint of the day and life stories
  - [x] Catholic saints, patronages, and illustrated story seeds (AC-1, AC-2, AC-3)
  - [x] Hono API endpoints for daily saint, random saint, and catalog (AC-1, AC-2)
  - [x] SaintCard, PatronageBadge, and story reader UI in apps/web (AC-1, AC-3, AC-4, AC-5, AC-6)
  - [x] Web Speech API audio narration and completion tracking (AC-7, AC-8)
- [x] Verify it: /check verify saint of the day and life stories
- [x] Test it: /test saint of the day and life stories
      Code in `apps/web/` and `apps/api/`

---

## Slice 3: Interactive Play and Reinforcement

### 10. Quizzes and lamb guide feedback · done

Four question quiz engine linked to catechism lessons, featuring encouraging lamb mascot reactions on wrong answers and celebratory animations on completion.
**Done when:** quizzes adapt question complexity to age band, never display red or negative scores on incorrect answers, and award stars upon finish. (basis: docs/design.json)

- [x] Design it (spec): [0010](../specs/0010-quizzes-and-lamb-guide-feedback.md)
- [x] Build it: /develop quizzes and lamb guide feedback
  - [x] Seed catechism and scripture quizzes with 4 questions each (AC-1, AC-3)
  - [x] Hono API endpoints for quizzes and answer evaluation (AC-1, AC-2)
  - [x] QuizCard, QuizOptionButton, and lamb mascot reactions in apps/web (AC-2, AC-4, AC-5, AC-6)
  - [x] Lesson reciprocal navigation and completion tracking (AC-7, AC-8)
- [x] Verify it: /check verify quizzes and lamb guide feedback
- [x] Test it: /test quizzes and lamb guide feedback
      Code in `apps/web/` and `packages/validators/`

### 11. Church puzzles engine · done

Word search, tile matching, and scramble puzzles with Catholic church themes and Zod validated configurations.
**Done when:** child can complete a puzzle on mobile touch screens with clear win states and gentle hints. (basis: docs/data-model.md)

- [x] Design it (spec): [0011](../specs/0011-church-puzzles-engine.md)
- [x] Build it: /develop church puzzles engine
  - [x] Zod puzzle configuration schemas in packages/validators (AC-2)
  - [x] Church puzzle seed data in packages/db (AC-1, AC-2)
  - [x] WordSearchBoard, TileMatchingGrid, and WordScrambleBoard UI components (AC-3, AC-4, AC-5, AC-6)
  - [x] Puzzle catalog page, hint mechanics, and completion tracking (AC-1, AC-7, AC-8)
- [x] Verify it: /check verify church puzzles engine
- [x] Test it: /test church puzzles engine
      Code in `apps/web/` and `packages/validators/`

---

## Slice 4: Rewards and Daily Habits

### 12. Rewards ledger and streak tracking · done

Append only ledger tracking spendable coins and permanent stars, with daily streak calculations respecting the household timezone.
**Done when:** activity completions log idempotent events, ledger entries calculate balances correctly, and daily caps prevent over earning. (basis: .agents/AGENTS.md)

- [x] Design it (spec): [0012](../specs/0012-rewards-ledger-and-streak-tracking.md)
- [x] Build it: /develop rewards ledger and streak tracking
  - [x] Pure streak calculation and daily cap helpers in packages/utils (AC-3, AC-6)
  - [x] Default coin rules in packages/db and ledger transaction logic in apps/api (AC-1, AC-2, AC-4, AC-5)
  - [x] StreakBadge, RewardSummaryBar, and child dashboard reward views in apps/web (AC-7, AC-8)
- [x] Verify it: /check verify rewards ledger and streak tracking
- [x] Test it: /test rewards ledger and streak tracking
      Code in `packages/db/` and `apps/api/`

### 13. Leaderboard and daily review · done

Weekly star rankings partitioned by real age band showing nicknames only, paired with a spaced repetition daily question review loop.
**Done when:** weekly stars rank children within their age band, hidden children are omitted, and review questions return on increasing intervals. (basis: docs/data-model.md)

- [x] Design it (spec): [0013](../specs/0013-leaderboard-and-daily-review.md)
- [x] Build it: /develop leaderboard and daily review
  - [x] Pure spaced repetition interval logic in packages/utils (AC-6, AC-7)
  - [x] Weekly stars aggregation job in packages/jobs and API routes in apps/api (AC-1, AC-2, AC-3, AC-4)
  - [x] Daily review card, runner, and leaderboard views in apps/web (AC-5, AC-8)
- [x] Verify it: /check verify leaderboard and daily review
- [x] Test it: /test leaderboard and daily review
      Code in `packages/jobs/` and `apps/web/`

### 14. Privacy first analytics and habit tracking · done

Self hosted anonymous telemetry pipeline and household habit metrics, adhering to zero child tracking rules.
**Done when:** client emits zero third party trackers, activity pings pass through anonymous server aggregation, and parent views display household habit statistics. (basis: .agents/AGENTS.md)

- [x] Design it (spec): [0014](../specs/0014-privacy-first-analytics-and-habit-tracking.md)
- [x] Build it: /develop privacy first analytics and habit tracking
  - [x] Anonymous telemetry schema in packages/validators (AC-2, AC-3)
  - [x] Structured event redaction in packages/observability and API route in apps/api (AC-3, AC-5)
  - [x] Daily rollups job in packages/jobs and parent habit dashboard in apps/web (AC-6, AC-7)
- [x] Verify it: /check verify privacy first analytics and habit tracking
- [x] Test it: /test privacy first analytics and habit tracking
      Code in `packages/observability/`, `apps/api/`, and `apps/web/`

---

## Deferred

### 15. Church tour interactive scenes · in progress

Explore Catholic church architecture and sacred objects in five illustrated scenes with interactive halo hotspots, age adapted explanations, and reverence guidance. (Phase 2)
**Done when:** children can navigate between five illustrated scenes, tap glowing halo spots on sacred items, view age adapted explanations and reverence notes, listen to Web Speech narration, link to glossary terms, and complete the tour to earn habit stars. (basis: docs/data-model.md)

- [x] Design it (spec): [0015](../specs/0015-church-tour-interactive-scenes.md)
- [ ] Build it: /develop church tour interactive scenes
  - [ ] Database schema and seed data in packages/db (AC-1, AC-2)
  - [ ] Input validators and API routes in packages/validators and apps/api (AC-1, AC-7, AC-8)
  - [ ] UI components with audio and reverence guidance in packages/ui (AC-2, AC-3, AC-4, AC-5)
  - [ ] Web viewer page with smooth horizontal navigation in apps/web (AC-1, AC-6, AC-8)
- [ ] Verify it: /check verify church tour interactive scenes
- [ ] Test it: /test church tour interactive scenes
      Code in `packages/db/`, `packages/validators/`, `apps/api/`, `packages/ui/`, and `apps/web/`

### 16. Digital colouring studio

Interactive colouring book saving fill region selections as compact JSON maps. (Phase 2)

### 17. Challenges and parish prize shop

Parish competitions and physical reward redemptions with parent gate approval. (Later phase)

### 18. Moderated community chat

Topic and parish chat rooms for ages 11 to 15 with strict blocklist filtering and moderator queues. (Later phase)

### 19. Faith AI guide

AI question answering verified by priest graded benchmarks across all age bands. (Later phase)

### 20. Throwback family memories

Private annual photo upload viewable only by the family household. (Later phase)

---

## References

### Project sources

- `.agents/AGENTS.md`: Catholic faith principles, zero child personal data, RLS security rule, and tone guidelines
- `.agents/data-model.md`: 54 MVP database tables, enum definitions, and schema relationships
- `docs/design.json`: Visual design system version 0.3.0, lamb mascot guide, dove page load motion, and touch targets
- `docs/project-doc.md`: Founding app goals, reviewer workflow, and age band reading levels

### Practices and standards

- Tracer Bullet integration: Build complete vertical paths connecting database, logic, and interface to retire architecture risk early
- Child privacy safeguard: No server child records without a parent account, zero external trackers, and server derived age bands
- Append only ledger accounting: Balances computed as sums over immutable ledger entries with idempotency keys
