# Kid Zone data model

Source of truth for the database design. The Drizzle schema in `packages/db/src/schema/` implements the **MVP** tables below. Update this file whenever the schema changes.

## Principles

1. **No server record without an account.** Guests can read and play everything, but anything we would save about a person needs a parent account. Guest streaks and scores stay on the device and are imported when a parent signs up. Every user-owned table has a non-null `child_id`.
2. **Children never have credentials.** Parents own accounts (`profiles` > `households` > `children`). Children use a nickname and a preset avatar.
3. **Nothing reaches a child unreviewed.** Content flows `draft` > `submitted` > `approved` (reviewer) > `published` (admin). A check constraint stops any row being `published` without a reviewer, a publisher and a publish time. Child-facing queries read `status = 'published'` only.
4. **Age guides, it does not block.** Every content row has `min_age` and `max_age` (3 to 15). They sort and recommend. Children may browse any band. Chat is the one exception (see below).
5. **Open lists are tables, closed lists are enums.** Story kinds, topics and patronages are rows admins can add. Roles, statuses and puzzle types are enums.
6. **Append-only where money-like.** `ledger_entries` and `activity_events` are never edited. Corrections are new rows. Balances are sums.
7. **Bible text is referenced, never copied.** Stories and featured verses store a canonical reference (book, chapter, verse range). Text is looked up in the child's chosen translation.

## Decisions log

| Area                               | Decision                                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audience                           | Open to any Catholic family. Parish is optional and only groups people.                                                                                                   |
| Parishes                           | Admins create approved parishes. Parents can suggest one, which stays `pending` until an admin approves it.                                                               |
| Child access                       | Guest mode, with the option to save progress by joining under a parent.                                                                                                   |
| Ages                               | Bands 3-7, 8-10, 11-15, derived from `birth_date`. Birthday stored for birthday wishes. At 16 the profile becomes `graduated` (history kept).                             |
| Content by band                    | Default band from age, overridable in settings (parent gate). Children can browse any band.                                                                               |
| Staff roles                        | parent, contributor, reviewer, moderator, admin. Parish admin is scoped through `parish_admins`.                                                                          |
| Publishing                         | Admin publishes after a priest or catechist approves. Contributors submit.                                                                                                |
| Parish posts                       | App admin approves every post. `submitted_by`, `approved_by` and `approved_at` give accountability.                                                                       |
| Bible                              | Full text, curated key verses, kid retellings and verse of the day. Reading mode is switchable, with an age-based default.                                                |
| Translations                       | Two English translations (standard and easy). Other languages later, by adding rows.                                                                                      |
| Read-aloud                         | Recorded voice for stories and lessons. Device text-to-speech for full Bible text.                                                                                        |
| Saints                             | Story, virtue, feast day, patronage, prayer, fun facts, century and country. Browse by calendar, patronage, virtue, map and search. Simple and very graphic.              |
| Catechism                          | Core beliefs, prayers, Mass and Church year, sacrament prep. Focus on the sacraments and the holiness of the church.                                                      |
| Puzzles (MVP)                      | Word search, matching, scramble, fill-in-the-blank. Church-centric. Colouring is phase 2.                                                                                 |
| Quizzes                            | Four question types. Complexity follows age: the younger, the simpler.                                                                                                    |
| Stories                            | Open set of kinds. Original virtue stories, parables, Church history and miracles, bedtime with a prayer.                                                                 |
| Rewards                            | Streaks, badges, stars, journey map and coins. Coins come from everyday activity (small) and challenges (bigger).                                                         |
| Prize delivery                     | Digital, shipping, or pickup at a parish.                                                                                                                                 |
| Chat                               | Open rooms by age band or topic, plus parish rooms. **Ages 11-15 only**, free text with heavy filtering, monitoring and flagging.                                         |
| Platform                           | Mobile-first, fully responsive PWA. Offline is for reading only; progress and coins wait for a connection.                                                                |
| Languages                          | Built for many (`locale` on every content row). English only in the MVP; Nigerian Pidgin first after launch.                                                              |
| Remembering                        | Daily review of past questions and random quizzes. Both earn coins, capped per day.                                                                                       |
| Leaderboard                        | Always on, by real age band, nicknames only, ranked by weekly stars. A parent can hide their child.                                                                       |
| Nicknames                          | Typed by the parent and run through the blocklist (`filter_terms`).                                                                                                       |
| AI (later)                         | Answers older children's questions, all ages, simplified by band. Off until a priest or catechist-graded test passes for each band. A named exception to the review rule. |
| Throwback Kings and Queens (later) | A parent uploads a photo each year, stored privately and shown back to the family. No public sharing. The one place a child's photo is held.                              |
| Content sources                    | Gathered from existing Catholic material by the core team; every row records its source (`source_note`). A priest reviews against the original.                           |
| Compliance                         | Deferred until the MVP is finished. Closed group only until then; photos, chat and AI stay off until it's done.                                                           |

## MVP tables (54)

### Church and accounts

| Table               | Purpose                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `profiles`          | Parents and staff. `id` mirrors `auth.users.id`. Role: parent, contributor, reviewer, moderator, admin. |
| `parishes`          | `status` pending, approved or rejected. Approved rows need `approved_by` and `approved_at`.             |
| `households`        | One per parent. Optional `parish_id`. `timezone` sets streak day boundaries.                            |
| `children`          | Nickname, preset avatar, `birth_date`, PIN hash, status active or graduated, `show_on_leaderboard`.     |
| `child_preferences` | `age_band_override`, `reading_mode`, preferred translation. Null means use the age-based default.       |
| `parish_admins`     | Links a profile to one parish.                                                                          |
| `parish_posts`      | Announcements and events. Cannot be `published` without an approver.                                    |
| `content_reviews`   | Every review decision, with reviewer, notes and time.                                                   |
| `audit_log`         | Append-only staff actions.                                                                              |

### Shared content

| Table            | Purpose                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `media_assets`   | Images, SVGs and audio, with alt text and duration.                                                                   |
| `filter_terms`   | Admin-editable blocklist for nicknames now and chat later. Needed in phase 2 because the leaderboard shows nicknames. |
| `topics`         | Virtues, sacraments, commandments, seasons, themes.                                                                   |
| `content_topics` | Tags any content with any topic. `entity_id` is not a foreign key, so the app removes rows when content is deleted.   |

### Bible

`bible_translations` (license and source recorded per translation), `bible_books` (73 books, canonical order), `bible_verses` (composite key: translation, book, chapter, verse), `featured_verses`, `verse_of_the_day`.

### Saints

`saints`, `saint_fun_facts`, `saint_places` (map pins and timeline), `patronages`, `saint_patronages`, `saint_of_the_day` (override table; default follows the feast day). A saint's illustrated life story is a row in `stories` with `saint_id` set. Virtues are tags in `content_topics`.

### Catechism

`sacraments` (7), `glossary_terms`, `prayers`, `rosary_mysteries`, `mass_parts`, `liturgical_seasons` (colour only; date ranges are calculated in code because Easter moves), `catechism_courses`, `catechism_lessons`, `lesson_panels`. A lesson's recap is a quiz with `lesson_id` set.

### Fun

`story_kinds`, `stories`, `story_pages` (one short audio file per page), `puzzles` (type-specific `config` JSON, validated by Zod in `packages/validators`), `puzzle_links` (offer "Play a puzzle about this" from a saint, lesson or verse), `quizzes`, `quiz_questions`, `quiz_options`.

### Progress and coins

| Table                           | Purpose                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `activity_events`               | Append-only log. Unique `(child_id, idempotency_key)` stops double counting.                                                 |
| `child_progress`                | State per child and content item. Drives "Continue" and the journey map.                                                     |
| `streaks`                       | Current and longest streak.                                                                                                  |
| `coin_rules`                    | Earning rules (amount, minimum score, first-time-only, daily cap). Tunable without a deploy.                                 |
| `ledger_entries`                | Stars and coins. A partial unique index lets a first-time rule pay a child once per item.                                    |
| `badges`, `child_badges`        | Milestones. The rule is JSON; a background job awards from events.                                                           |
| `journeys`, `journey_nodes`     | The path of lessons, stories, quizzes and puzzles. Node state is derived from `child_progress`.                              |
| `quiz_attempts`, `quiz_answers` | History, so we can see which wrong answers are chosen. `kind` is quiz, random or review; `quiz_id` is null for the last two. |
| `review_items`                  | Daily review schedule: when each question next comes back for each child, with growing gaps.                                 |
| `leaderboard_weekly`            | Weekly stars by real age band, filled by a background job. Skips children a parent has hidden.                               |

## Later phases (not in the schema yet)

| Phase                           | Tables                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 2: Inside the Church tour | `church_tour_scenes`, `church_tour_items` (tap positions, linked to `glossary_terms`, with a "how we behave" note)                                                                                                                        |
| Throwback Kings and Queens      | `child_memories` (child, year, private photo path, caption). Private storage bucket readable only by that household, short-lived links, location data stripped on upload, deletable by the parent, never cached offline, no share button. |
| After chat: the AI              | `ai_answers` (child, age band, question, answer, model, time) as a log. The graded test set also needs its own table.                                                                                                                     |
| Phase 2: Colouring              | `child_artworks` (stores the chosen colour per region as a small JSON map, not an image; downloaded as PNG or PDF in the browser; saving needs an account)                                                                                |
| Challenges and prize shop       | `challenges`, `challenge_tasks`, `challenge_progress`, `challenge_prizes`, `prizes`, `prize_stock`, `redemptions`, `child_inventory`, `delivery_addresses`                                                                                |
| Chat (ages 11-15 only)          | `chat_rooms`, `room_members`, `messages`, `reactions`, `reports`, `moderation_actions`, `message_flags`, `safeguarding_alerts` (`filter_terms` is already in the MVP)                                                                     |

**Challenges and prizes.** Types are weekly, competition and hunt, scoped to everyone or one parish. A redemption is `fulfilment_method` digital, ship or pickup. A parent approves every physical redemption. Stock is reserved in one transaction on approval. A parish admin can see and update pickups for their own parish only. Cancellation returns coins with a new ledger entry. `ledger_entries.challenge_id` is already present and gets its foreign key when `challenges` ships.

**Chat.** Rooms have `min_age >= 11`, enforced by a constraint. Eligibility uses the age worked out from `birth_date`, never `age_band_override`. Messages start `pending`, pass the filter, then become `visible` or `held`. Held and flagged messages go to a moderator queue. Serious categories create a `safeguarding_alerts` row and a parent email. Children cannot edit or delete messages. Parents can read their own children's messages. Add presets and emoji tables only if younger bands ever get chat.

## Search

Saints need full-text search plus typo tolerance. Run once as custom SQL (like `supabase/sql/auth.sql`), after the first migration:

```sql
create extension if not exists pg_trgm;
create index if not exists saints_name_fts_idx on public.saints
  using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(tagline, '')));
create index if not exists saints_name_trgm_idx on public.saints using gin (name gin_trgm_ops);
```

Search should also match `saints.search_aliases`, patronage labels and topic names.

## Changes from earlier plans

- Saint panels and Bible story pages are merged into `stories` and `story_pages`.
- `virtues` is generalised into `topics` and `content_topics`.
- Age band override, reading mode and translation moved from `children` into `child_preferences`.
- Content status uses `draft`, `submitted`, `approved`, `published`, `archived` (replaces `in_review`).
- `parishes` has a `status` so parents can suggest parishes.
- Daily review and random quizzes added `review_items`, two activity types, and a nullable `quiz_attempts.quiz_id`.
- Every content row gained `source_note`.
- The leaderboard added `leaderboard_weekly` and `children.show_on_leaderboard`. `filter_terms` moved from the chat phase into the MVP.

## Applying the schema

1. Run `pnpm setup` with the planned modules first. It deletes the payments block and rewrites the `@template` scope. The new schema files contain no module markers except the payments block in `index.ts`.
2. Copy the files into `packages/db/src/schema/` (replacing `index.ts`).
3. `pnpm db:generate`, review the migration, then `pnpm db:migrate`.
4. Run `supabase/sql/auth.sql`. The signup trigger inserts a profile with the default role, which is now `parent`.
5. Run the search SQL above.
6. Update `packages/auth/src/index.ts`: the `Role` type still lists only `user` and `admin`. The new roles are not a strict ladder (a reviewer is not above a moderator), so replace the ranking with an allow-list check where `admin` always passes.
7. Seed reference data: the 73 `bible_books`, the 7 `sacraments`, `liturgical_seasons`, `story_kinds` and starter `topics`.

## Open items

- **Parent weekly email:** not chosen. Add it if wanted; it needs no new tables.
- **Second guardian:** `households.owner_id` is unique, so one parent account per household. Add `household_guardians` if two parents should share a household.
- **Row-level security:** every table holding child data needs RLS and a test proving one household cannot read another's (an `AGENTS.md` rule). Not written yet.
- **Zod schemas** for `puzzles.config`, `quiz_questions.config` and `badges.rule` in `packages/validators`.
- **Bible licensing:** record license and source in `bible_translations` before loading any verses.
