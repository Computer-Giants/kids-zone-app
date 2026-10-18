# 0013. Leaderboard and Daily Review

**Date**: 2026-10-16
**Status**: Accepted

## Summary

This specification defines the weekly star leaderboard and spaced repetition daily review question engine for Kid Zone. The leaderboard ranks weekly stars partitioned strictly by real age band, displaying child nicknames only and honouring parent privacy settings without exception. Never ranked by coins or competitive percentages, the leaderboard celebrates participation and spiritual diligence. In tandem, the daily review engine reintroduces previously answered catechism and Bible quiz questions on expanding intervals (spaced repetition), turning learning into long term faith retention.

## Context

Catholic youth education benefits from healthy encouragement without toxic peer comparison or commercial game toxicity:

1. Leaderboard ranks weekly stars by real age band, never coins or percentage scores.
2. The leaderboard displays nicknames only and strictly honors `children.show_on_leaderboard = false` or parental blocklist filters.
3. The server ranks weekly stars via scheduled background jobs or materialized tables (`leaderboard_weekly`), preventing live table scans on the main database.
4. Daily review re introduces questions the child has already encountered. Correct answers lengthen the interval (for example: 1 day, 3 days, 7 days, 14 days, 30 days), cementing Catholic doctrine into lasting memory.
5. Review rounds provide a peaceful 3 to 5 question daily warmup accompanied by the gentle lamb mascot.

## Requirements

**User stories**:

- As a Catholic child, I want to see how many stars other children in my age group collected this week so that I feel part of a wider community of young Catholic learners.
- As a child, I want to review questions I learned earlier so that I remember Bible stories, liturgical colours, and holy prayers.
- As a parent, I want to be able to hide my child's nickname from public leaderboards with one simple switch in parental controls.
- As a parent, I want to be confident that other children only see my child's vetted nickname, with no private details or photographs exposed.

**Acceptance criteria**:

- **AC-1**: The weekly leaderboard partitions rankings strictly by real age band (`3 to 7`, `8 to 10`, `11 to 15`) derived from `birth_date`, never from parent age band overrides.
- **AC-2**: Children with `show_on_leaderboard = false` or unapproved nicknames are omitted from the weekly leaderboard.
- **AC-3**: The leaderboard table displays weekly stars only. Coins are never shown, ranked, or compared across children.
- **AC-4**: A background job or periodic sync populates `leaderboard_weekly` by summing star earnings from `ledger_entries` starting from the week's Monday 00:00 UTC.
- **AC-5**: The daily review system queries `review_items` for questions where `due_at <= NOW()` for the authenticated child, presenting a focused review set of 3 to 5 questions.
- **AC-6**: Correctly answering a review question increments `correct_streak` and recalculates `due_at = NOW() + interval_days` with exponential backoff intervals (1, 3, 7, 14, 30 days) using pure scheduling functions in `packages/utils`.
- **AC-7**: An incorrect review answer gently resets the review interval to 1 day without shaming, negative points, or penalty sounds.
- **AC-8**: Completing the daily review awards daily habit stars and records progress toward streak continuity.

## Options considered

### Option 1: Materialized weekly leaderboard with pure spaced repetition intervals (Recommended)

Store pre aggregated rankings in `leaderboard_weekly` and manage review item intervals through `review_items` with pure calculation functions in `packages/utils/src/review.ts`.

**Pros**:

- Zero expensive table scans during mobile client dashboard loads.
- Respects all safety rules: real age band grouping, nicknames only, parent opt out strictly honoured, no coin rankings.
- Spaced repetition algorithm is pure, deterministic, and easily tested with unit tests.
- Reuses the existing `review_items` table defined in `packages/db/src/schema/progress.ts`.

**Cons**:

- Weekly leaderboard updates at scheduled intervals rather than instantaneous real time live push (which is desirable as it reduces competitive fixation).

### Option 2: Live real time database aggregation across all child accounts

Run dynamic `GROUP BY` and `RANK()` queries on `ledger_entries` directly whenever any child visits the leaderboard.

**Pros**:

- Immediate reflection of newly earned stars.

**Cons**:

- Violates project rule: "Weekly stars by real age band, filled by a background job so the app never ranks on the fly."
- Substantial database performance penalty and lock contention as the child community grows.

## Decision

Adopt Option 1. Run weekly aggregation via scheduled background tasks writing to `leaderboard_weekly`. Review scheduling uses pure functions in `packages/utils` updating `review_items`.

## Build plan

1. **Utils**: Create pure spaced repetition interval calculators and week boundary helpers in `packages/utils/src/spaced-repetition.ts`.
2. **Database Queries**: Add weekly leaderboard ranking queries and daily review question selection helpers in `packages/db`.
3. **Jobs & API**: Add Inngest function in `packages/jobs` to aggregate weekly stars, and API endpoints `/api/leaderboard` and `/api/review/daily` in `apps/api`.
4. **UI Components**: Build `LeaderboardList`, `RankBadge`, and `DailyReviewCard` in `packages/ui`.
5. **Web Views**: Build `/leaderboard` and review runner in `apps/web`.
6. **Tests**: Add unit tests for spaced repetition intervals and E2E verification of leaderboard privacy filtering.

## Consequences

- Children enjoy healthy, calm encouragement without high pressure competition.
- Parents retain full sovereignty over their children's privacy.
- Long term doctrinal memory is systematically nurtured through gentle daily review.
