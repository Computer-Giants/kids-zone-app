# 0012. Rewards Ledger and Streak Tracking

**Date**: 2026-10-16
**Status**: Proposed

## Summary

This specification defines the rewards ledger and daily habit streak tracking system for Kid Zone. Operating on an append only model in Postgres, the ledger tracks spendable coins and permanent stars earned through spiritual exploration, reading, quizzes, and church puzzles. Day boundaries and streak continuity strictly honour the household timezone, preventing false resets for international families. Daily caps defined in configurable database rules protect children from over earning or compulsive screen time, ensuring joyful and spiritually balanced daily engagement.

## Context

Spiritual habits in childhood thrive on daily consistency, positive encouragement, and clear boundaries. As established in the core project rules:

1. The ledger is append only. Corrections are recorded as new rows. Balances are calculated as sums.
2. Stars measure permanent spiritual progress and are never spent. Coins are spendable in future parish or reward shops.
3. Earning rules live in `coin_rules` with daily caps, configurable without application redeployments. Amounts are never hard coded in client screens.
4. The server's clock decides what counts, never the device's clock.
5. Daily streaks use the household's timezone (`households.timezone`) to determine calendar day boundaries.
6. Guests earn progress indicators stored locally on the device; only authenticated children write to `activity_events` and `ledger_entries`.

## Requirements

**User stories**:

- As a Catholic child, I want to see my stars grow when I read the Bible and finish puzzles so that I feel encouraged in my faith journey.
- As a Catholic child, I want to see my daily prayer and learning streak so that I build a joyful daily habit of visiting Jesus.
- As a parent, I want earning limits per day so that my child focuses on genuine contemplation rather than compulsive coin farming.
- As a parent living across time zones, I want day resets to match our local family bedtime and morning routine.
- As a guest explorer, I want to view my current session stars on my device without requiring server accounts.

**Acceptance criteria**:

- **AC-1**: Completing any valid activity (Bible chapter reading, saint story, quiz attempt, or church puzzle) submits an idempotent completion event with client UUID `idempotency_key` and server timestamp.
- **AC-2**: The server evaluates active `coin_rules` matching the activity type. If `first_time_only` applies, the rule awards coins or stars at most once per content item for that child via a partial unique index.
- **AC-3**: Daily caps defined on `coin_rules` are enforced by summing credits earned under that rule within the child's local calendar day. Once reached, further activities in that category yield zero additional coins for that day.
- **AC-4**: All currency transactions append immutable rows to `ledger_entries` with currency (`star` or `coin`), positive amount, reference to `event_id`, and explanatory reason. Negative balances are rejected by database check constraints.
- **AC-5**: Balances for stars and coins are computed as pure sum aggregations (`SUM(amount)`) grouped by currency, with cached summaries exposed to child dashboard views.
- **AC-6**: Pure streak calculation function in `packages/utils` calculates `current` and `longest` streak from consecutive active days using `households.timezone` (defaulting to `UTC` if unset). A missed day resets `current` to 1 upon the next activity, preserving `longest`.
- **AC-7**: Streak milestone rewards (for example, 3 day, 7 day, and 30 day streaks) trigger congratulatory notifications with the friendly lamb mascot and award bonus stars via dedicated ledger entries.
- **AC-8**: An authenticated child profile view in `apps/web` displays the child's current star count, coin balance, and flaming heart streak badge with zero negative or shaming states.

## Options considered

### Option 1: Append only Postgres ledger with timezone aware pure streak calculation (Recommended)

Store every transaction as an immutable row in `ledger_entries` linked to `activity_events`. Use pure timezone conversion functions in `packages/utils` to determine calendar days from `households.timezone`. Enforce daily caps directly during transaction creation.

**Pros**:

- Full auditability: balances are verifiable sums that can never become desynchronized or corrupted.
- Complies strictly with project guidelines: immutable ledger, no hard coded reward amounts, server clock authoritative.
- Pure calculation functions can be exhaustively unit tested without database dependencies.
- Replay attacks or double taps are thwarted by composite unique index `(child_id, idempotency_key)` and first time unique indexes.

**Cons**:

- Requires computing aggregate sums on balance checks (mitigated by indexed lookups and light read load).

### Option 2: Mutable balance counters on the children table

Update integer columns `stars` and `coins` directly on the `children` record with `UPDATE children SET coins = coins + 5`.

**Pros**:

- Slightly simpler read queries (`SELECT stars, coins FROM children`).

**Cons**:

- Strictly violates project rule: "The ledger is append-only. Corrections are new rows. Balances are sums."
- Destroys auditability and risks race conditions on concurrent activity completions.

## Decision

Adopt Option 1. The ledger is append only in `ledger_entries`, with earning rules read dynamically from `coin_rules`. Day boundaries for streaks are calculated in pure functions using `households.timezone`.

## Build plan

1. **Utils**: Add pure streak calculation and daily cap window helpers in `packages/utils/src/rewards.ts` with comprehensive unit tests.
2. **Database Seeds**: Ensure default `coin_rules` are seeded in `packages/db` for Bible reading, saint stories, quizzes, and church puzzles, with reasonable daily caps.
3. **API Service**: Implement `/api/rewards/balance` and activity reward dispatching in `apps/api` with transactional ledger entry creation and idempotency enforcement.
4. **UI Components**: Create `StreakBadge`, `RewardSummaryBar`, and celebratory coin earning toasts in `packages/ui`.
5. **Web Views**: Integrate rewards and streak indicators into the child dashboard, navigation header, and activity completion modals in `apps/web`.
6. **E2E Tests**: Verify streak progression and rewards balance calculations across simulated days.

## Consequences

- Children and parents always see consistent, tamper proof progress records.
- Earning parameters can be tuned by administrators by adjusting `coin_rules` rows without redeploying code.
