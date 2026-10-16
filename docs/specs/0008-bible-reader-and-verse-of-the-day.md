# 0008. Bible Reader and Verse of the Day

**Date**: 2026-10-15
**Status**: In Progress

## Summary

This specification defines the Catholic Bible reading view, daily liturgical verse presentation, and audio read aloud experience for Kid Zone. It tailors Holy Scripture to children across three distinct age bands through illustrated retellings, curated key verses with practical meanings, and full chapter Scripture text. Children can listen to stories and verses through audio playback, switch reading levels freely, and read downloaded chapters offline without network connectivity.

## Context

Catholic children encounter the Bible at very different developmental stages. A four year old learns salvation history through pictures and short bedtime stories. A nine year old grasps memorable key verses with moral guidance. A thirteen year old can read full chapters of sacred Scripture. Providing a single uniform text either overwhelms young children or bores older youths.

Furthermore, Catholic children frequently use mobile devices in church halls, school buses, or family road trips with poor internet connectivity. In keeping with our strict child data and offline rules, reading must function offline for up to 14 days without collecting personal credentials. When an account is absent, progress remains on the local device, while authenticated children log idempotent activity events upon reconnection.

We need a dedicated Bible reader route, automated age band tailoring, full support for the 73 Catholic canonical books, and accessible text to speech read aloud controls.

## Requirements

**User stories**:

- As a Catholic child, I want to read the Bible in a way that matches my age so that Scripture is engaging, understandable, and inspiring.
- As a young child (Little Lambs, 3 to 7), I want to read illustrated Bible retellings with audio narration so that I can follow along before I read fluently.
- As an intermediate child (Seekers, 8 to 10), I want to see key verses with simple meanings so that I understand how God's Word applies to my daily life.
- As an older child (Disciples, 11 to 15), I want to read full Catholic Scripture chapters so that I can study God's Word and prepare for confirmation.
- As a child on a family journey without cellular data, I want to read cached Bible chapters offline so that I can continue my daily Bible habit.
- As a visiting family exploring the app as a guest, I want to read Scripture and hear stories without registering an account.

**Acceptance criteria**:

- **AC-1**: Navigating to `/bible` renders the Verse of the Day card for today's date alongside the Catholic canonical book selector, presenting all 73 Catholic books ordered canonically with Old Testament, Deuterocanonical, and New Testament sections.
- **AC-2**: Children in the Little Lambs age band (3 to 7) view illustrated kid retellings by default, with picture covers and simplified page text.
- **AC-3**: Children in the Seekers age band (8 to 10) view curated key verses with clear practical meanings and reflection thoughts.
- **AC-4**: Children in the Disciples age band (11 to 15) view full chapter Scripture text from the Douay Rheims Catholic translation with canonical verse numbering.
- **AC-5**: A prominent reading mode switcher enables children and parents to switch between Story Retelling, Key Verses, and Full Chapter modes on any chapter.
- **AC-6**: An accessible audio player supports read aloud, playing pre recorded human audio for kid retellings and browser native Web Speech API for chapter Scripture text, respecting system reduced motion and quiet modes.
- **AC-7**: Visited Bible chapters and retellings are cached in browser storage for up to 14 days, permitting offline reading without server requests.
- **AC-8**: Completing a reading records progress in `activity_events` with unique idempotency keys for logged in children, and in local device storage for guest children with zero server database rows.

## Options considered

### Option 1: Tri mode age band presentation with public domain Douay Rheims full text (Recommended)

Present three reading modes tailored to age bands (Illustrated Story Retelling for 3 to 7, Key Verses with meaning for 8 to 10, Full Chapter Scripture for 11 to 15). Provide a mode toggle on every passage so children can explore beyond their default band. Full text uses the public domain Catholic Douay Rheims Challoner revision stored in the database, with canonical citations matching modern Catholic lectionaries.

**Pros**:

- Zero copyright friction or recurring license costs for storing full chapters offline.
- Every age group receives developmentally tailored content without locking out curious children.
- Seed data covers all 73 Catholic canonical books, including deuterocanonical texts.

**Cons**:

- Douay Rheims English uses archaic grammar ("thee", "thou"), making kid retellings and key verse explanations vital for younger readers.

### Option 2: Dual mode presentation with licensed RSV 2CE text

Offer a simpler two tier interface (Stories for 3 to 10, Full Text for 11 to 15) using the modern Revised Standard Version Second Catholic Edition via an external API.

**Pros**:

- Modern, contemporary Catholic vocabulary for chapter reading.

**Cons**:

- Commercial API licensing restrictions and usage fees.
- External API dependence breaks 14 day offline reading guarantees and creates network fragility.

### Option 3: Curated featured verses only without full chapter text

Display only approved key verses and picture retellings, omitting full chapter Scripture text entirely.

**Pros**:

- Small database size and minimal seed data.

**Cons**:

- Older children and Catholic educators cannot read complete Bible chapters or look up liturgical readings.

## Decision

**Chosen option**: Option 1: Tri mode age band presentation with public domain Douay Rheims full text.

We will provide illustrated kid retellings for young children, curated key verses with practical meanings for middle childhood, and full Catholic chapter text for older children, backed by existing database tables and browser native read aloud speech synthesis.

**Implementation skills**: `drizzle-best-practices` (`packages/db`), `supabase` (`packages/auth`), `web-design-guidelines` (`packages/ui`)

## Rationale

Kid Zone serves children aged 3 through 15. A single reading level cannot satisfy both a toddler learning Genesis through Noah's Ark pictures and a teenager reading Paul's letters. By implementing three tailored reading modes with an accessible mode switcher, the application adapts to the child's natural reading level while encouraging growth.

The public domain Douay Rheims Challoner revision guarantees that Kid Zone can store and distribute full Catholic Scripture chapters offline without copyright fees or API service outages. The 73 book Catholic canon (including Tobit, Judith, Wisdom, Sirach, Baruch, and 1 and 2 Maccabees) is preserved completely.

Browser native Web Speech API provides text to speech playback on mobile devices without generating cloud audio costs or requiring large audio downloads for thousands of Scripture chapters.

## Feature design

**Data model sketch**:

Uses existing database tables defined in `packages/db/src/schema/bible.ts` and `fun.ts`:

- `bible_translations`: Translation metadata (`id`, `code`, `name`, `language`, `level`, `license`, `is_default`). Seeded with Douay Rheims (`drb`, level `formal`, default true).
- `bible_books`: 73 Catholic canonical books (`id` 1 to 73, `code`, `name`, `testament`, `is_deuterocanonical`, `chapters`).
- `bible_verses`: Full text indexed by (`translation_id`, `book_id`, `chapter`, `verse`).
- `featured_verses`: Curated key verses with `meaning`, `min_age`, `max_age`, `source_note`, and `status`.
- `verse_of_the_day`: Calendar mapping linking (`day`, `locale`) to `featured_verse_id`.
- `stories` and `story_pages`: Illustrated kid retellings linked to `bible_book_id` and chapter ranges.
- `child_preferences`: Stores child `reading_mode` and `translation_id`.

**State transitions**:

Reading session state machine:

- `idle`: Book or chapter selected, loading content from cache or server.
- `reading`: Content displayed in active mode (story, key verse, or full chapter).
- `speaking`: Text to speech or recorded audio actively playing, with current word or verse highlighted.
- `paused`: Audio paused by child or parent.
- `completed`: Child reaches end of chapter or story, triggering celebration state and recording activity event.

**API surface**:

| Endpoint                     | Method | Key inputs                                                      | Key outputs                                                                                           | Auth             | Key errors                               |
| ---------------------------- | ------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------- |
| /api/bible/books             | GET    | none                                                            | books: Array of 73 Catholic books with testament and chapter counts                                   | public           | 500 server error                         |
| /api/bible/chapter           | GET    | bookId: integer, chapter: integer, translationId: integer (opt) | book, chapter, verses: Array of verse text, retelling: Story (opt), keyVerses: Array of FeaturedVerse | public           | 400 invalid chapter, 404 book not found  |
| /api/bible/verse-of-the-day  | GET    | date: string (opt, YYYY-MM-DD), locale: string (opt)            | verse: FeaturedVerse, bookName, chapter, text, meaning                                                | public           | 404 not found                            |
| /api/bible/readings/complete | POST   | childId: uuid (opt), contentId: string, idempotencyKey: uuid    | status: success, starsAwarded: integer                                                                | optional session | 400 invalid payload, 409 duplicate event |

**Value sourcing**:

| Action                         | Value produced / displayed                  | Source                                                                                            |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Load Bible book index          | List of 73 books and sections               | Query `bible_books` ordered by `id` ascending                                                     |
| Display Verse of the Day       | Daily verse reference, text, and meaning    | Query `verse_of_the_day` matching current local date, joining `featured_verses` and `bible_books` |
| Fallback daily verse           | Fallback verse when date has no entry       | Deterministic hash of current day selecting an approved `featured_verses` row                     |
| Display kid retelling          | Story title, pictures, and simplified pages | Query `stories` and `story_pages` where `bible_book_id` and chapter match                         |
| Display chapter verses         | Numbered Scripture text                     | Query `bible_verses` where `book_id` and `chapter` match active translation                       |
| Determine initial reading mode | Story vs Key Verse vs Full Chapter          | Active child age band from `kz_active_child` or `kz_guest_age_band` cookie                        |
| Record completion              | Reading stars and streak update             | Append row to `activity_events` using client idempotency key                                      |

**Key invariants**:

- Nothing published reaches a child unless a reviewer approved it: all featured verses and stories must have `status = 'published'` in contentMeta.
- Bible text is referenced by canonical reference, never copied into custom doctrine.
- The Catholic canon includes all 73 books: deuterocanonical books must never be omitted or hidden.
- Unauthenticated guests can read all Scripture without writing server database records.
- Offline cached copies older than 14 days must be discarded.
- Audio playback must respect device silent mode and user pause actions.

**Security model**:

- Public read access permitted for all `published` Bible translations, books, verses, featured verses, and retellings.
- Row level security enforces that child queries return only `published` content rows.
- Unauthenticated guests read freely with zero user tracking and zero database persistence.
- Writing completion events requires a valid child session matching the household owner, or stays in local storage.

**Configuration required**:

None. Uses existing Supabase Postgres connection and browser native Web Speech synthesis.

**Critical test scenarios**:

- Happy path: Child opens `/bible`, sees today's Verse of the Day, selects Genesis chapter 1, toggles between story retelling and chapter verses, and listens to audio read aloud, verifying **AC-1**, **AC-4**, **AC-5**, **AC-6**.
- Age band tailoring: Child with age 5 profile opens a passage and sees illustrated kid retelling; child with age 13 profile opens the same passage and sees Douay Rheims chapter verses, verifying **AC-2**, **AC-4**.
- Offline reading: Device disconnects network, opens previously viewed Scripture chapter from browser cache, completes reading, and synchronizes activity event on reconnect, verifying **AC-7**, **AC-8**.
- Guest mode exploration: Visiting parent without account reads Scripture and switches reading modes with zero database records created, verifying **AC-8**.

## Build plan

1. Seed canonical data for the 73 Catholic Bible books and baseline Douay Rheims translation metadata in `packages/db`, satisfies **AC-1**.
2. Seed initial curated featured verses and kid Bible stories with Catholic safety review markers, satisfies **AC-2**, **AC-3**.
3. Implement typed Hono API endpoints for books, chapter text, and Verse of the Day in `apps/api/src/routes/bible.ts`, satisfies **AC-1**, **AC-4**.
4. Create accessible Bible reader components in `packages/ui` (BookSelector, ChapterNavigation, ReadingModeToggle, VerseCard, AudioPlayer), satisfies **AC-1**, **AC-5**, **AC-6**.
5. Build the `/bible` and `/bible/[book]/[chapter]` pages in `apps/web` with server rendering, age band tailoring, and mode switching, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**.
6. Implement browser native Web Speech API read aloud hook with play, pause, and speed controls in `apps/web`, satisfies **AC-6**.
7. Implement offline Cache Storage helper and service worker chapter caching with 14 day retention in `apps/web`, satisfies **AC-7**.
8. Implement reading completion tracking with idempotency keys for children and localStorage for guests in `apps/web`, satisfies **AC-8**.

## Consequences

**Positive**:

- Catholic children of all ages gain accessible, scripture based learning tailored to their reading abilities.
- Full offline reading allows children to read Scripture during travel or in locations with weak connectivity.
- Zero licensing fees or API subscription costs.
- Fully preserves the 73 book Catholic biblical canon.

**Negative / tradeoffs**:

- Douay Rheims full text features traditional 18th century phrasing, requiring kid retellings and key verse explanations to bridge comprehension for younger children.
- Web Speech API voice quality varies across different mobile operating systems and device models.

**Neutral**:

- Requires seeding initial chapter text and featured verses into database migrations or seed scripts.

## Follow-up

- [ ] Obtain Catholic priest review and approval for initial kid retelling story texts before publishing.
