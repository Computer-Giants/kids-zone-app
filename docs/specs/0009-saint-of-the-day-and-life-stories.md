# 0009. Saint of the Day and Life Stories

**Date**: 2026-10-16
**Status**: Complete

## Summary

This specification defines the Catholic Saint of the Day presentation, liturgical feast calendar mapping, illustrated life stories, and virtue learning experience for Kid Zone. Children discover daily saints matching today's feast day, explore random saints through an interactive discover button, browse patronages (such as patron of animals, music, and scholars), and read illustrated biographies tailored across three developmental age bands. Children can listen to stories with audio narration, view geographic shrine locations, and pray the saint's traditional prayer.

## Context

Catholic tradition honors the communion of saints as heavenly friends, guides, and models of Christian virtue. Children connect deeply with the heroic lives of saints like St. Francis of Assisi, St. Therese of Lisieux, St. Patrick, and St. Joan of Arc. However, children encounter saint biographies differently depending on their age:

- A five year old needs colorful picture stories focusing on kindness to animals and bedtime prayers.
- a nine year old connects with patronages, fun facts, and practical virtue challenges.
- A thirteen year old seeks historical context, geographical journeys, and authentic prayers.

Our strict child privacy and doctrinal integrity rules apply:

1. Nothing publishes unless a human reviewer approved it (`status = 'published'` in `contentMeta`).
2. Catholic feast days recur annually by month and day, with curated overrides in `saint_of_the_day` when multiple saints share a feast.
3. Unauthenticated guests read and listen freely, storing progress on their device with zero server records.
4. Audio read aloud operates cleanly in mobile web browsers with Web Speech API and pre-recorded page narration.

## Requirements

**User stories**:

- As a Catholic child, I want to see who today's Saint of the Day is so that I can celebrate feast days and learn about holy heroes.
- As an inquisitive child, I want to tap "Discover Another Saint" to explore random saints from history when today's saint is already familiar.
- As a young learner (Little Lambs, 3 to 7), I want to read an illustrated picture book story about the saint with audio narration.
- As an intermediate learner (Seekers, 8 to 10), I want to see what the saint is patron of, learn fun facts, and discover the virtues they practiced.
- As an older learner (Disciples, 11 to 15), I want to read the full historical biography, see where they lived, and pray their traditional prayer.
- As a guest exploring without an account, I want to read saint biographies and earn completion stars stored on my device.

**Acceptance criteria**:

- **AC-1**: Navigating to `/saints` displays the Saint of the Day hero card for the current calendar date matching `feast_month` and `feast_day` (or `saint_of_the_day` override), plus a "Discover Another Saint" action that loads a random published saint.
- **AC-2**: A catalog search and filter interface on `/saints` allows filtering saints by patronage (e.g. animals, scholars, musicians), historical era, and text search over names and aliases.
- **AC-3**: Navigating to `/saints/[slug]` displays the saint's header, feast date, patronages, birth and death years, era label, and country flags.
- **AC-4**: Children in the Little Lambs age band (3 to 7) view an illustrated life story by default with picture pages and simple narration.
- **AC-5**: Children in the Seekers age band (8 to 10) view memorable saint fun facts, virtue cards, and a kid friendly summary of their life.
- **AC-6**: Children in the Disciples age band (11 to 15) view the complete historical biography, shrine locations, and closing prayer.
- **AC-7**: An accessible audio player supports read aloud narration across all reading modes with play, pause, and speed controls.
- **AC-8**: Completing a saint story or biography records reading stars in `activity_events` with client idempotency keys for authenticated children, and saves progress to local device storage for guest children.

## Options considered

### Option 1: Hybrid calendar feast matching with curated override and random discovery (Recommended)

Match the current local month and day against `saints.feast_month` and `feast_day`. If an explicit date override exists in `saint_of_the_day`, use it. If no saint matches today's date or if the user taps "Discover Another Saint", deterministically select or randomly rotate through published saints. Provide tri mode age band adaptation (Illustrated Story for 3 to 7, Fun Facts and Virtues for 8 to 10, Complete Biography and Prayer for 11 to 15).

**Pros**:

- Preserves the authentic Catholic liturgical calendar without requiring complex external moveable feast calculation APIs.
- Random exploration allows children to learn about saints throughout the year, not just on their annual feast day.
- Fully backed by existing tables in `packages/db/src/schema/saints.ts` and `fun.ts`.
- Adapts cleanly to all three age bands.

**Cons**:

- Moveable liturgical feasts (e.g. feast days tied to Easter or Pentecost) require manual entries in `saint_of_the_day`.

### Option 2: External liturgical calendar API integration

Query an external liturgical API service (e.g. Roman Catholic Calendar API) on each page load to determine today's saint.

**Pros**:

- Handles moveable feasts automatically.

**Cons**:

- Introduces external third party network dependencies, latency, and subscription costs.
- Breaks offline reading capability.
- API data lacks custom kid friendly retellings and virtue tagging.

### Option 3: Uniform single story without age band switching

Present one fixed biography text for each saint with no age band customization.

**Pros**:

- Simpler data requirements and fewer story pages to write.

**Cons**:

- Fails both 4 year olds (too text heavy) and 14 year olds (too juvenile), violating core project guidelines.

## Decision

**Chosen option**: Option 1: Hybrid calendar feast matching with curated override and random discovery.

We will deliver daily liturgical saint discovery, random exploration, tri mode age tailoring, and Web Speech audio narration, using existing database tables and Hono API endpoints.

**Implementation skills**: `drizzle-best-practices` (`packages/db`), `supabase` (`packages/auth`), `web-design-guidelines` (`packages/ui`)

## Rationale

The Catholic communion of saints spans thousands of inspiring figures across two millennia. Matching feast days roots the child in the liturgical rhythm of the Church. Adding random discovery allows children to explore their baptismal patron saint or explore heroes on quiet days without major feasts. Tailoring stories across the three age bands honors developmental reading abilities while keeping the child safe and inspired.

## Feature design

**Data model sketch**:

Uses existing database tables defined in `packages/db/src/schema/saints.ts` and `fun.ts`:

- `saints`: `id` (UUID PK), `slug` (text unique), `name` (text), `title` (text), `tagline` (text), `feastMonth` (smallint), `feastDay` (smallint), `feastNote` (text), `birthYear` (integer), `deathYear` (integer), `eraLabel` (text), `countryCodes` (text[]), `searchAliases` (text[]), `prayer` (text), `portraitAssetId` (UUID FK), `...contentMeta()`.
- `saint_of_the_day`: `day` (date string PK), `saintId` (UUID FK), `setBy` (UUID FK).
- `patronages`: `id` (integer PK), `slug` (text unique), `label` (text), `iconAssetId` (UUID FK).
- `saint_patronages`: `saintId` (UUID FK), `patronageId` (integer FK).
- `saint_fun_facts`: `id` (UUID PK), `saintId` (UUID FK), `position` (smallint), `text` (text).
- `saint_places`: `id` (UUID PK), `saintId` (UUID FK), `kind` (placeKind enum), `placeName` (text), `countryCode` (text), `latitude` (double), `longitude` (double), `note` (text).
- `stories` & `story_pages`: `id` (UUID PK), `title`, `summary`, `saintId` (UUID FK), `kindId` (storyKinds 'saint').

**API surface**:

| Endpoint                      | Method | Key inputs                                                                                                    | Key outputs                                                                         | Auth             | Key errors                               |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------- | ---------------------------------------- |
| /api/saints/today             | GET    | date: string (opt, YYYY-MM-DD)                                                                                | saint: Saint, patronages: Array, story: Story (opt), funFacts: Array                | public           | 500 server error                         |
| /api/saints/random            | GET    | none                                                                                                          | saint: Saint, patronages: Array                                                     | public           | 404 no published saints                  |
| /api/saints                   | GET    | search: string (opt), patronage: string (opt), era: string (opt), limit: integer (opt), offset: integer (opt) | saints: Array, total: integer                                                       | public           | 400 invalid query                        |
| /api/saints/:slug             | GET    | slug: string                                                                                                  | saint: Saint, patronages: Array, places: Array, funFacts: Array, story: Story (opt) | public           | 404 saint not found                      |
| /api/saints/readings/complete | POST   | contentId: string, idempotencyKey: string (UUID), childId: string (opt)                                       | status: string, starsAwarded: integer, guest: boolean                               | optional session | 400 invalid payload, 409 duplicate event |

**Value sourcing**:

| Action                    | Value produced / displayed                | Source                                                                                                                       |
| ------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Load Saint of the Day     | Daily featured saint                      | Query `saint_of_the_day` where `day = localDate`, joining `saints`, or query `saints` matching `feast_month` and `feast_day` |
| Fallback Saint of the Day | Deterministic featured saint              | Hash of calendar date selecting an approved published `saints` row                                                           |
| Random Saint Discovery    | Random saint card                         | Query `saints` with `status = 'published'` ordered randomly with limit 1                                                     |
| Patronage badges          | Patron list (e.g. "Animals", "Musicians") | Query `saint_patronages` joining `patronages`                                                                                |
| Illustrated life story    | Multi page story pages and audio          | Query `stories` joining `story_pages` where `saint_id = saint.id`                                                            |
| Saint places & shrine     | Geographic pin locations                  | Query `saint_places` where `saint_id = saint.id`                                                                             |
| Record completion         | Reading stars and activity log            | Append row to `activity_events` for authenticated children, or return local response for guests                              |

**Key invariants**:

- Nothing published reaches a child unless a reviewer approved it: all saint records, stories, and fun facts must have `status = 'published'` in contentMeta.
- Every saint records their feast month and day for annual liturgical recurrence.
- Unauthenticated guests can read biographies and stories with zero server database rows created.
- Feast dates without an explicit feast day fall back deterministically or provide random discovery without broken states.
- Audio playback respects device silent modes and pause controls.

**Security model**:

- Public read access for all `published` saints, patronages, stories, and places.
- Row level security enforces that queries return only rows where `status = 'published'`.
- Guest exploration creates zero server records.
- Completion mutations require valid child session cookies or local device acknowledgment.

**Configuration required**:

None. Uses existing Supabase Postgres connection and browser native Web Speech synthesis.

**Critical test scenarios**:

- Happy path: Child visits `/saints`, sees Saint of the Day for today, taps "Discover Another Saint" to explore, selects St. Francis of Assisi, toggles age reading modes, and listens to audio read aloud, verifying **AC-1**, **AC-3**, **AC-4**, **AC-7**.
- Catalog search and filter: Child filters catalog by patronage "Animals" and searches "Francis", viewing matching saint cards, verifying **AC-2**.
- Age band tailoring: Little Lambs profile defaults to illustrated story; Disciples profile defaults to full historical biography with closing prayer, verifying **AC-4**, **AC-6**.
- Guest mode reading completion: Guest child completes reading, receives celebration feedback with lamb mascot, and saves progress to local device storage, verifying **AC-8**.

## Build plan

1. Seed initial Catholic saints, patronages, fun facts, and illustrated saint stories in `packages/db`, satisfies **AC-1**, **AC-2**, **AC-3**.
2. Implement typed Hono API endpoints for daily saint, random saint, catalog search, and saint details in `apps/api/src/routes/saints.ts`, satisfies **AC-1**, **AC-2**.
3. Create reusable SaintCard, PatronageBadge, and SaintStoryReader UI components in `packages/ui`, satisfies **AC-1**, **AC-3**, **AC-7**.
4. Build the `/saints` catalog page and `/saints/[slug]` biography page in `apps/web` with age band tailoring and reading switcher, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**.
5. Implement Web Speech API read aloud integration for saint stories and prayers in `apps/web`, satisfies **AC-7**.
6. Implement reading completion progress tracking with idempotency keys for children and local storage for guests, satisfies **AC-8**.

## Consequences

**Positive**:

- Catholic children discover patron saints and historical holy heroes through engaging age tailored stories.
- Daily feast day integration reinforces Catholic liturgical rhythms throughout the calendar year.
- Zero external API dependencies or licensing costs.
- Children can explore saints across history anytime via random exploration.

**Negative / tradeoffs**:

- Moveable Catholic feasts require manual overrides in the `saint_of_the_day` table.
- Initial seed data must be carefully verified against authentic Catholic hagiography.

**Neutral**:

- Saint illustrations and audio narrations can be incrementally enriched over subsequent phases.

## Follow-up

- [ ] Submit seed saint stories for human Catholic reviewer signoff before moving to published state.
