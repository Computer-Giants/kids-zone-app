# 0001. Core Database Schema and Migrations

**Date**: 2026-10-14  
**Status**: In Progress

## Summary

This decision defines the foundational database schema and versioned migration strategy for Kid Zone. We structure the database across fifty four core tables using Drizzle ORM and apply versioned migrations to Supabase Postgres through the Supabase MCP interface. This approach keeps TypeScript schema types as our single source of truth while ensuring that every table enforces row level security to protect child privacy.

## Context

Kid Zone provides a rich Catholic learning environment for children between the ages of three and fifteen. The platform brings together sacred Scripture, saint biographies, catechism lessons, church puzzles, and an append only rewards ledger. The application design relies on strict theological and privacy rules. No unreviewed faith material may reach a child, and children never possess credentials or store personal identifying data on the server.

A parent holds the account and manages child profiles through a household record. Progress and rewards link directly to a non null child identifier, and ledger entries function like an immutable bank ledger where balances are computed sums rather than mutable counters. Because children browse content without passwords, row level security policies on Postgres must act as the primary security perimeter rather than application query filters.

To support this architecture, we require a database foundation that guarantees strict type safety, predictable schema versioning, foreign key integrity, and remote execution reliability. The database schema spans fifty four tables across church accounts, shared content, Bible, saints, catechism, interactive games, and reward progress.

## Requirements

**User stories**:

- As a developer, I want a single typed schema definition in TypeScript so that all database access across the monorepo is type safe and aligned with our data model.
- As a parent, I want my household and child data protected by database level security policies so that no other household can view or alter our family records.
- As a child, I want to access published stories, saints, and quizzes without storing personal details or encountering draft content.

**Acceptance criteria**:

- **AC-1**: All fifty four MVP tables defined in the data model exist in `packages/db/src/schema/` with typed primary keys, required non null columns, foreign key relations, and check constraints.
- **AC-2**: Content publishing workflow enforces status transitions from draft to submitted to approved and published, ensuring check constraints prevent publishing without reviewer identifiers and timestamps.
- **AC-3**: Child records and all user owned progress rows mandate a non null child identifier, with cascading deletions tied to parent household removals.
- **AC-4**: Rewards ledger and activity events are append only tables where deletions and updates are prohibited, and unique indexes guarantee event idempotency.
- **AC-5**: Row level security is enabled on every table in the public schema, and policies restrict child and household data access strictly to authenticated household owners.
- **AC-6**: Full text search and trigram indexes on saints are configured to enable typo tolerant search across saint names, taglines, and patronages.
- **AC-7**: Database migrations are versioned sequentially in SQL files and applied to Supabase Postgres via the Supabase MCP interface.

## Options considered

### Option 1: Direct Drizzle push without versioned migration files

Run direct schema synchronization (`drizzle-kit push`) against the remote database whenever schemas change.

**Pros**:

- Quickest way to iterate during early prototyping.
- Avoids generating and tracking intermediate SQL files in source control.

**Cons**:

- Dangerous in shared and production environments because changes apply without human diff inspection.
- Lacks a reproducible migration history for rolling forward or auditing schema drift.

### Option 2: Versioned Drizzle migrations applied via Supabase MCP (Recommended)

Generate timestamped SQL migration files with Drizzle Kit and apply them to Supabase Postgres using the Supabase MCP interface and migration tracker.

**Pros**:

- Keeps TypeScript schema definitions in `packages/db` as the authoritative single source of truth.
- Produces plain SQL migrations that can be reviewed, tested, and tracked in Supabase migration tables.
- Bypasses local network restrictions on database connection ports by executing through the authenticated Supabase MCP toolset.

**Cons**:

- Requires generating SQL migration files whenever schema definitions change.

### Option 3: Supabase CLI native migrations alone

Write raw SQL migrations directly inside the `supabase/migrations/` directory without using Drizzle as a schema generator.

**Pros**:

- Native alignment with Supabase local development CLI tools.
- Direct control over Postgres specific extensions and procedural functions.

**Cons**:

- Breaks TypeScript end to end type safety, requiring separate manual type generation passes.
- Creates duplication between SQL definitions and application data validators.

## Decision

**Chosen option**: Option 2: Versioned Drizzle migrations applied via Supabase MCP.

We maintain all table definitions in TypeScript inside `packages/db/src/schema/`, generate versioned SQL migrations into `packages/db/drizzle/`, and apply migrations directly to Supabase Postgres using the Supabase MCP tools.

**Implementation skills**: `drizzle-best-practices` (`jsmastery-pro/skills`, `.agents/skills/drizzle-best-practices/`) · `supabase` (`jsmastery-pro/skills`, `.agents/skills/supabase/`) · `supabase-postgres-best-practices` (`jsmastery-pro/skills`, `.agents/skills/supabase-postgres-best-practices/`)

## Rationale

Kid Zone requires strict compile time type safety across API routes, server actions, and background workers. Defining the schema in Drizzle provides automatic TypeScript inference while generating deterministic SQL DDL scripts. Applying these migrations through the Supabase MCP interface ensures reliable remote execution regardless of local TCP port restrictions while recording applied versions inside Supabase migration tracking.

## Feature design

**Data model sketch**:

The schema comprises fifty four core tables partitioned across seven functional domains:

1. **Church and accounts** (9 tables):
   - `profiles`: mirrors Supabase `auth.users`, holding user role (parent, contributor, reviewer, moderator, admin).
   - `households`: family account root with parish link and timezone for streak boundaries.
   - `children`: nickname, avatar, birth date, status, and optional pin hash.
   - `child_preferences`: reading mode, age band override, translation choice.
   - `parishes`: parish registry with suggestion approval status.
   - `parish_admins`: links staff profiles to specific parishes.
   - `parish_posts`: announcements and events with reviewer accountability checks.
   - `content_reviews`: log of review decisions with reviewer notes and timestamps.
   - `audit_log`: immutable staff activity records.

2. **Shared content** (4 tables):
   - `media_assets`: images, audio recordings, and illustrations with alt text and duration.
   - `topics`: virtues, sacraments, commandments, seasons, and themes.
   - `content_topics`: polymorphic tags linking any content item to topics.
   - `filter_terms`: blocklist for nicknames and chat moderation.

3. **Bible** (5 tables):
   - `bible_translations`: license, attribution, reading level, and source notes.
   - `bible_books`: seventy three Catholic canonical books with testament and chapter counts.
   - `bible_verses`: composite key on translation, book, chapter, and verse.
   - `featured_verses`: curated verses with kid friendly explanations and age bands.
   - `verse_of_the_day`: calendar mapping to featured verses per locale.

4. **Saints** (6 tables):
   - `saints`: feast month and day, title, tagline, era, bio, and country codes.
   - `saint_fun_facts`: positional trivia snippets per saint.
   - `saint_places`: geographical coordinates and place kinds for maps and timelines.
   - `patronages`: patronage directory with slug and icon.
   - `saint_patronages`: many to many join between saints and patronages.
   - `saint_of_the_day`: daily saint assignment overriding standard feast days.

5. **Catechism** (9 tables):
   - `sacraments`: the seven Catholic sacraments with sign text and explanations.
   - `glossary_terms`: faith vocabulary with definitions and pronunciations.
   - `prayers`: traditional and daily prayers with audio narration links.
   - `rosary_mysteries`: joyful, luminous, sorrowful, and glorious mysteries.
   - `mass_parts`: four sections of the Mass with liturgical dialogue and actions.
   - `liturgical_seasons`: liturgical calendar seasons and liturgical vestment colors.
   - `catechism_courses`: sequential course modules.
   - `catechism_lessons`: individual lessons within courses.
   - `lesson_panels`: step by step illustrated panels with audio timings.

6. **Fun and learning** (8 tables):
   - `story_kinds`: open categories for stories (parables, saints, bedtime, virtues).
   - `stories`: illustrated stories with reading duration, saint, and Bible references.
   - `story_pages`: pages with text, illustration, and recorded audio assets.
   - `puzzles`: word search, tile matching, scramble, and fill in the blank configs.
   - `puzzle_links`: associative links offering puzzles from lessons, saints, or verses.
   - `quizzes`: lesson recaps and standalone quizzes with pass thresholds.
   - `quiz_questions`: multiple choice, picture choice, true false, and who am I prompts.
   - `quiz_options`: answer choices with correctness flags.

7. **Progress and rewards** (13 tables):
   - `activity_events`: immutable event log with idempotency keys.
   - `child_progress`: high water mark state per child and content item.
   - `streaks`: current streak, longest streak, and last active date.
   - `coin_rules`: rule book defining rewards, thresholds, and daily caps.
   - `ledger_entries`: append only coin and star transactions.
   - `badges`: milestone criteria defined as rule objects.
   - `child_badges`: earned milestone badges per child.
   - `journeys`: guided learning pathways across app sections.
   - `journey_nodes`: ordered steps along a learning path.
   - `quiz_attempts`: recorded quiz sessions.
   - `quiz_answers`: individual answer choices for mistake analysis.
   - `review_items`: spaced repetition schedule for question retention.
   - `leaderboard_weekly`: weekly star aggregates partitioned by age band.

**State transitions**:

Content lifecycle follows a strict review progression:
`draft` -> `submitted` -> `approved` -> `published` -> `archived`

Database constraints guarantee that no content row can enter `published` status unless `reviewed_by`, `published_by`, and `published_at` are non null.

**API surface**:

| Interface            | Mechanism                         | Key inputs                        | Key outputs                      | Auth requirement                        | Key errors                                 |
| -------------------- | --------------------------------- | --------------------------------- | -------------------------------- | --------------------------------------- | ------------------------------------------ |
| Database client      | `createDb()` in `packages/db`     | `DATABASE_URL`, `DATABASE_POOLED` | Drizzle ORM client instance      | Service or session token                | Missing connection string, pool exhaustion |
| Supabase migrations  | `apply_migration` in Supabase MCP | `name`, `query`                   | Migration success boolean        | Supabase project management credentials | SQL execution error, constraint violation  |
| Schema introspection | `list_tables` in Supabase MCP     | `schemas`, `verbose`              | Table definitions and RLS status | Supabase project management credentials | Schema not found                           |

**Value sourcing**:

| Action                 | Value produced / displayed          | Source                                                            |
| ---------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| Account setup          | Profile record creation             | Supabase `auth.users` insert trigger via `handle_new_user()`      |
| Child creation         | Child identifier and household link | Parent input verified against `households.owner_id = auth.uid()`  |
| Age band determination | Content recommendation              | Pure function derivation from `children.birth_date`               |
| Progress tracking      | Idempotent event logging            | Client generated UUID passed to `activity_events.idempotency_key` |
| Star and coin balances | Reward totals                       | Sum calculation across immutable `ledger_entries` rows            |
| Saint search           | Typo tolerant search matches        | Postgres `pg_trgm` and `to_tsvector` GIN indexes on `saints.name` |

**Key invariants**:

- No child data row exists without a valid parent household (`children.household_id` references `households.id` with cascade deletion).
- Ledger entries are strictly append only (no update or delete operations allowed).
- Published content must contain verified human review references (`reviewed_by` and `published_by` required).
- Bible verses and liturgical seasons maintain canonical sorting through explicit position and chapter indexing.
- Row level security is enabled across all tables in the public schema.

**Security model**:

- Public reads are permitted only on rows where `status = 'published'` for content tables (stories, saints, lessons, quizzes, puzzles).
- User private data (households, children, progress, streaks, ledger entries) is restricted to the authenticated parent owning the household (`owner_id = auth.uid()`).
- Guest interactions remain local on client devices and write zero server records until a parent registers an account.
- Profiles are viewable and editable only by their authenticated owner.

**Configuration required**:

- `DATABASE_URL`: direct or session connection string pointing to Supabase Postgres.
- `DATABASE_POOLED`: boolean flag set to true when connecting through Supabase transaction pooler on serverless environments.

**Critical test scenarios**:

- Happy path: A parent registers an account, trigger creates their profile, household is initialized, and children can be added under that household, verifies **AC-1**, **AC-3**, **AC-5**.
- Content protection: An unapproved faith story in draft status cannot be retrieved by child queries, and check constraints prevent publishing without reviewer identifiers, verifies **AC-2**.
- Event idempotency: Submitting the same activity event twice with identical idempotency keys succeeds without creating duplicate ledger entries, verifies **AC-4**.
- Search match: Querying for saint names with minor typos returns the expected saint record via trigram indexing, verifies **AC-6**.
- Migration integrity: Executing versioned migrations through the Supabase MCP interface deploys all tables with active row level security, verifies **AC-7**.

## Build plan

1. [x] Generate and clean baseline SQL migrations for all fifty four MVP tables and enums, satisfies **AC-1**, **AC-3**.
2. [x] Apply initial core schema migration via Supabase MCP to establish church, content, Bible, saints, catechism, fun, and progress tables, satisfies **AC-1**, **AC-7**.
3. [x] Apply review, moderation, and leaderboard migrations via Supabase MCP including `filter_terms`, `review_items`, and `leaderboard_weekly`, satisfies **AC-1**, **AC-4**, **AC-7**.
4. [x] Configure Supabase authentication profile trigger and saint full text trigram search indexes, satisfies **AC-2**, **AC-6**.
5. [x] Enable row level security and household boundary policies across all user owned and content tables, satisfies **AC-5**.
6. [x] Verify remote schema structure and table counts using Supabase MCP introspection tools, satisfies **AC-1**, **AC-5**, **AC-7**.

## Consequences

**Positive**:

- Single source of truth in TypeScript prevents divergence between application logic and database schema.
- High performance typed queries with automated relations and joins across all fifty four domain tables.
- Robust privacy guarantees with database level security policies protecting family data.
- Repeatable versioned migration path fully executable through the Supabase MCP connection.

**Negative / tradeoffs**:

- Fifty four tables represent a comprehensive domain model requiring careful index management and query discipline.
- Append only ledger design requires aggregation queries rather than simple column reads to calculate current balances.

**Neutral**:

- Requires developers to run `pnpm db:generate` whenever table definitions change in `packages/db/src/schema/`.

## References

**Project sources**:

- `.agents/AGENTS.md`: Catholic faith principles, zero child personal data, RLS security rule, and tone guidelines
- `docs/data-model.md`: Fifty four MVP database tables, enum definitions, and schema relationships
- `docs/scope/scope.md`: Feature 2 scope requirements, Tracer Bullet build approach, and acceptance criteria
- `packages/db/src/schema/`: TypeScript Drizzle definitions for accounts, core, Bible, saints, catechism, fun, and progress

**Practices & standards**:

- Append only ledger accounting: balances derived as sums over immutable ledger rows with unique idempotency keys
- Defense in depth row level security: Postgres level policy enforcement rather than application query filters
- Tracer Bullet slice delivery: verified end to end schema deployment connecting ORM models to remote database
