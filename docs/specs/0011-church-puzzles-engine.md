# 0011. Church Puzzles Engine

**Date**: 2026-10-16
**Status**: Proposed

## Summary

This specification defines the interactive Catholic puzzle engine for Kid Zone. Spanning Word Search, Sacred Tile Matching, and Word Scramble challenges, church puzzles reinforce Catholic sacred symbols, liturgy, Bible vocabulary, and saints through tactile mobile friendly play. All puzzle configurations are governed by strict Zod schemas in `packages/validators`, ensuring type safety and tamper proof gameplay. Children enjoy gentle hints on demand, tap targets optimized for small fingers, and celebratory win states that award progress stars.

## Context

Interactive games offer young children an intuitive way to learn the sacred vocabulary of the Catholic Church: altar, chalice, tabernacle, vestments, crucifix, and rosary. However, many commercial children's games are cluttered with ads, microtransactions, flashing timers, and aggressive fail states that distract from spiritual formation.

Kid Zone introduces a peaceful, tactile church puzzle environment:

1. Three distinct puzzle types cater to different developmental motor skills and ages: Tile Matching for young learners, Word Scramble for early readers, and Word Search for confident readers.
2. Every puzzle configuration is strictly validated with Zod discriminated unions in `packages/validators`.
3. Tap targets meet our 48px standard, working effortlessly on budget touch screen devices.
4. Puzzles link contextually to saints, Bible chapters, and catechism lessons through `puzzle_links`, offering children playful reinforcement after reading.

## Requirements

**User stories**:

- As a Catholic child, I want to play church puzzles so that I can have fun while learning about sacred church objects and Bible words.
- As a young learner (Little Lambs, 3 to 7), I want to play sacred tile matching games with pictures of church items so that I can learn what is inside a Catholic church.
- As an intermediate learner (Seekers, 8 to 10), I want to unscramble church words and find words in a letter grid with gentle hints when I get stuck.
- As an older learner (Disciples, 11 to 15), I want challenging Catholic word searches with liturgical terms and saint names.
- As a parent, I want wholesome church games without ads, third party trackers, timers, or stressful penalties.
- As a guest explorer, I want to solve puzzles and earn stars saved on my device.

**Acceptance criteria**:

- **AC-1**: Navigating to `/fun` (or `/puzzles`) displays categorized puzzle collections (Word Search, Tile Matching, Word Scramble) with difficulty badges (1 to 3) and theme tags (Church, Bible, Saints).
- **AC-2**: Puzzle configurations are strictly validated by Zod discriminated union schemas (`wordSearchConfig`, `tileMatchingConfig`, `wordScrambleConfig`) in `packages/validators`.
- **AC-3**: Word Search displays an accessible touch grid (minimum 44x44px cell targets) with drag or multi-tap word selection, an interactive word bank, and gentle highlighted line styling on found words.
- **AC-4**: Sacred Tile Matching displays a grid of face down cards featuring sacred items (e.g. chalice, monstrance, altar bells, candle), with smooth flip animations and non-punitive mismatch resets.
- **AC-5**: Word Scramble displays letter tile chips with tap-to-place mechanics, clear backspace controls, and Catholic definition hints.
- **AC-6**: A prominent "Ask the Lamb for a Hint" action highlights a starting letter or reveals a matched tile without deducting stars or penalizing the child.
- **AC-7**: Completing all words or tiles triggers celebratory lamb mascot feedback (`mood = 'celebrating'`) with sparkles and victory sounds respecting device quiet modes.
- **AC-8**: Puzzle completion mutations record idempotent events in `activity_events` for authenticated children and save locally for guest learners.

## Options considered

### Option 1: Tri modal puzzle engine with Zod validated JSON configurations (Recommended)

Support Word Search, Tile Matching, and Word Scramble backed by the `puzzles` table with a discriminated `config` JSON column validated by Zod. Build modular React components with touch gesture and tap accessibility in `packages/ui`.

**Pros**:

- Combines three classic puzzle formats in a single unified schema and player framework.
- Zod discriminated unions guarantee runtime type safety and prevent malformed content.
- Touch friendly controls optimized for mobile web.
- Contextual linking to saints and catechism lessons via `puzzle_links`.

**Cons**:

- Word search grid generation requires deterministic coordinate seeding to avoid offensive accidental letter collisions.

### Option 2: Pre rendered static canvas games

Render games inside a HTML5 `<canvas>` element using an external game engine (e.g. Phaser).

**Pros**:

- High frame rate arcade animations.

**Cons**:

- Severely compromises web accessibility (screen readers cannot inspect canvas pixels).
- Heavy bundle size for low end mobile devices.
- Incompatible with server side rendering and responsive Tailwind styling.

### Option 3: Separate database tables for each puzzle format

Create dedicated tables `word_search_puzzles`, `matching_puzzles`, and `scramble_puzzles`.

**Pros**:

- Highly specific relational columns.

**Cons**:

- Triples schema maintenance overhead and fragments the unified `puzzles` catalog and progress tracking.

## Decision

**Chosen option**: Option 1: Tri modal puzzle engine with Zod validated JSON configurations.

We will provide Word Search, Tile Matching, and Word Scramble puzzles using the single `puzzles` table, validated by Zod schemas in `packages/validators` and rendered with accessible DOM components.

**Implementation skills**: `drizzle-best-practices` (`packages/db`), `web-design-guidelines` (`packages/ui`)

## Rationale

A unified puzzle schema validated by Zod provides maximum flexibility for authors to create church themed games without altering database tables. Using accessible DOM elements (buttons, grids, cards) instead of canvas games ensures compliance with WCAG AA accessibility standards, supports screen readers, and respects `prefers-reduced-motion` settings.

## Feature design

**Data model sketch**:

Uses existing database tables defined in `packages/db/src/schema/fun.ts`:

- `puzzles`: `id` (UUID PK), `slug` (text unique), `type` (puzzleType enum: word_search, matching, scramble, fill_blank), `title` (text), `instructions` (text opt), `difficulty` (smallint 1 to 3), `coverAssetId` (UUID FK opt), `config` (jsonb not null), `...contentMeta()`.
- `puzzle_links`: `puzzleId` (UUID FK), `entityType` (contentEntity enum: bible_chapter, saint, catechism_lesson), `entityId` (UUID).

**Zod Configuration Schemas** (`packages/validators`):

- `wordSearchConfigSchema`: `{ grid: string[][], words: Array<{ word: string, hint: string, start: [number, number], end: [number, number] }> }`
- `tileMatchingConfigSchema`: `{ pairs: Array<{ id: string, label: string, imageAssetUrl?: string, matchId: string }> }`
- `wordScrambleConfigSchema`: `{ scrambled: string, targetWord: string, clue: string, letterBank: string[] }`

**API surface**:

| Endpoint              | Method | Key inputs                                                             | Key outputs                                           | Auth             | Key errors                               |
| --------------------- | ------ | ---------------------------------------------------------------------- | ----------------------------------------------------- | ---------------- | ---------------------------------------- |
| /api/puzzles          | GET    | type: string (opt), difficulty: integer (opt)                          | puzzles: Array of Puzzle summaries                    | public           | 500 server error                         |
| /api/puzzles/:slug    | GET    | slug: string                                                           | puzzle: Puzzle with validated config                  | public           | 404 puzzle not found                     |
| /api/puzzles/complete | POST   | puzzleId: string, idempotencyKey: string (UUID), childId: string (opt) | status: string, starsAwarded: integer, guest: boolean | optional session | 400 invalid payload, 409 duplicate event |

**Value sourcing**:

| Action                  | Value produced / displayed           | Source                                                                                    |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Load puzzle catalog     | Catalog cards and difficulty filters | Query `puzzles` where `status = 'published'`                                              |
| Render puzzle board     | Grid cells, tiles, or letter chips   | Parsed and validated `puzzles.config` JSON via Zod schema                                 |
| Validate word discovery | Highlighted found words              | Calculated match against `config.words` coordinate bounds                                 |
| Validate tile match     | Matched card pairs                   | Match check between selected tile `matchId` attributes                                    |
| Award puzzle stars      | Star balance increase                | Append row to `activity_events` with type `puzzle_completed` using client idempotency key |

**Key invariants**:

- Nothing published reaches a child unless a reviewer approved it: all puzzles must have `status = 'published'` in contentMeta.
- Every puzzle configuration must strictly pass its corresponding Zod schema validation before rendering.
- No timer may count down to failure; children can take as much time as they need.
- Hints never deduct stars or penalize the player.
- Guest children earn device stored stars with zero server records.

**Security model**:

- Public read access for all `published` puzzles.
- Solution data is held in client memory during play; completion is validated on the server by verifying that the puzzle exists and is published.
- Completion mutations require valid child session cookies or local device acknowledgment.

**Configuration required**:

None. Uses existing Supabase Postgres connection and `@kidzone/validators`.

**Critical test scenarios**:

- Happy path: Child opens `/fun`, selects 'Sacred Altar Vessels' matching game, flips card pairs until all are matched, and celebrates win with lamb mascot, verifying **AC-1**, **AC-4**, **AC-7**.
- Word search interaction: Child drags across 'CHALICE' in letter grid, observes word crossed off word bank, and receives completion stars upon finding all words, verifying **AC-3**, **AC-7**.
- Gentle hint: Child taps hint button when paused, seeing a starting letter illuminated without penalty, verifying **AC-6**.
- Zod schema validation: Attempting to parse an invalid puzzle config throws a structured Zod error, verifying **AC-2**.

## Build plan

1. Define Zod configuration schemas for Word Search, Tile Matching, and Word Scramble in `packages/validators/src/puzzle.ts`, satisfies **AC-2**.
2. Seed initial Catholic church puzzles (Altar Vessels Matching, Saints Word Search, Holy Week Scramble) in `packages/db`, satisfies **AC-1**, **AC-2**.
3. Implement typed Hono API endpoints for puzzle catalog and completion in `apps/api/src/routes/puzzles.ts`, satisfies **AC-1**.
4. Create WordSearchBoard, TileMatchingGrid, and WordScrambleBoard components in `packages/ui`, satisfies **AC-3**, **AC-4**, **AC-5**, **AC-6**.
5. Build `/fun` catalog page and `/fun/[slug]` interactive puzzle runner in `apps/web` with celebratory win screen, satisfies **AC-1**, **AC-7**, **AC-8**.

## Consequences

**Positive**:

- Catholic sacred objects and liturgical vocabulary become accessible and memorable through hands-on play.
- Zero ads, trackers, timers, or anxiety inducing mechanics.
- Highly performant, accessible DOM based architecture working across all mobile devices.

**Negative / tradeoffs**:

- Generating large word search grids requires careful layout validation to fit on small mobile screens.

**Neutral**:

- New puzzles can be easily added over time by inserting Zod validated JSON configurations.

## Follow-up

- [ ] Submit seed puzzle vocabulary and sacred object pairings for priest review before publishing.
