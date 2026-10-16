# 0014. Privacy First Analytics and Habit Tracking

**Date**: 2026-10-16
**Status**: Proposed

## Summary

This specification defines the privacy first analytics and aggregated telemetry framework for Kid Zone. Strict project rules forbid third party advertising scripts, fingerprinting, behavioral tracking, or identifying personal data collection for children. This architecture routes all activity metrics through an internal append only event pipeline into aggregated counts, daily habit completion totals, and anonymized averages. Parents receive transparent insights into family spiritual habits without exposing child identities, external trackers, or privacy risks.

## Context

Most modern learning apps deploy third party trackers (such as Google Analytics, Mixpanel, or Facebook Pixel) that harvest device fingerprints, advertising IDs, and detailed behavioral paths. In a Catholic app designed for children aged 3 to 15, safeguarding childhood innocence and digital privacy is an absolute theological and legal commitment.

As established in `.agents/AGENTS.md`:

1. "No ads, no third party trackers, no analytics that identify a child. Measure with counts and averages only."
2. "Children never have credentials, a real name, an email, a phone, an address, a school, or a precise location."
3. "Never add a tracker, ad or third party script to a page a child sees."
4. "The server's clock decides what counts, never the device's."

At the same time, we need clear operational visibility into which stories, saints, quizzes, and puzzles help children learn, where children get stuck, and how families build daily prayer and learning streaks. This requires an internal, self hosted telemetry model that records aggregated events without identifying personal footprints.

## Requirements

**User stories**:

- As a parish catechist or content curator, I want to see aggregated completion counts and average quiz scores across age bands so that I know which lessons are effective and which need simpler wording.
- As a parent, I want to see my household's weekly reading and learning habit progress in the parent portal without third party trackers watching my children.
- As an engineer, I want server side event logging with structured redaction via `@kidzone/observability` so that errors and telemetry never leak child identifiers.
- As a child, I want to explore holy stories and play sacred puzzles in peace, without commercial advertising scripts, tracking beacons, or cookies following me.

**Acceptance criteria**:

- **AC-1**: Child facing pages and components in `apps/web` contain zero external tracking tags, analytics scripts, or third party pixels.
- **AC-2**: Telemetry events emitted on activity completion (reading finished, quiz submitted, puzzle completed) flow to an internal API endpoint (`/api/telemetry/event`), validated strictly by Zod schemas in `packages/validators`.
- **AC-3**: Telemetry payloads record only anonymous event identifiers: event type, content entity type, content ID, coarse age band (3 to 7, 8 to 10, 11 to 15), duration bracket in seconds, and completion status. IP addresses, user agent fingerprints, and child UUIDs are discarded before writing.
- **AC-4**: In guest mode, reading and puzzle completion events remain completely local on the client device or send anonymized counter pings without user identifiers.
- **AC-5**: Internal error reporting and structured telemetry logs use `@kidzone/observability` (Pino) with automatic redaction of authentication tokens, child nicknames, and parent emails.
- **AC-6**: A scheduled Inngest background job in `packages/jobs` aggregates daily activity events into rolling summary counts (total completions, average time per story, completion percentage by age band), eliminating row level query burdens.
- **AC-7**: The parent dashboard displays family learning habit summaries (total holy verses read, saint stories explored, current family streak) computed solely from internal database relations.

## Options considered

### Option 1: Self hosted internal event pipeline with anonymous aggregation (Recommended)

Build an internal telemetry endpoint (`/api/telemetry/event`) in Hono that validates events with Zod, strips IP and client identifiers, and logs structured metrics using `@kidzone/observability` and lightweight rollups.

**Pros**:

- 100% compliant with strict project rules: zero third party trackers, zero cookies, zero child profiling.
- Total data ownership on existing Supabase and Vercel infrastructure with zero external SaaS costs.
- Integrates seamlessly with existing `activity_events` and `@kidzone/jobs` Inngest workflows.
- Lightweight and fast on low cost mobile devices.

**Cons**:

- Does not offer pre built commercial funnel exploration interfaces (admin views must be built in house).

### Option 2: Privacy focused external service (e.g. Plausible or PostHog self hosted)

Install a third party privacy oriented analytics script onto web pages to track sessions and pageviews.

**Pros**:

- Ready made dashboards for bounce rates and page hits.

**Cons**:

- Incurs risk of violating the strict rule: "Never add a tracker, ad or third party script to a page a child sees."
- Additional client bundle size on cheap phones with spotty connections.

## Decision

**Chosen option**: Option 1: Self hosted internal event pipeline with anonymous aggregation.

All child learning telemetry stays strictly first party. Events are processed by `apps/api`, redacted by `packages/observability`, and aggregated into clean counts and averages by `packages/jobs`.

## Build plan

1. **Validators (`packages/validators/src/telemetry.ts`)**: Define Zod schemas for internal telemetry events: `telemetryEventSchema` covering event type, age band, duration bucket, and content reference (satisfies AC-2, AC-3).
2. **Observability (`packages/observability/src/telemetry.ts`)**: Add standardized event sanitization functions that strip network headers, IP addresses, and personal keys before logging (satisfies AC-3, AC-5).
3. **API Route (`apps/api/src/routes/telemetry.ts`)**: Mount `POST /api/telemetry/event` in Hono to receive first party event pings and write anonymized telemetry logs (satisfies AC-2, AC-3).
4. **Client Telemetry Helper (`apps/web/src/lib/telemetry.ts`)**: Provide a lightweight, zero dependency `sendTelemetry` helper that dispatches fire and forget event pings when children complete stories, quizzes, or puzzles (satisfies AC-1, AC-4).
5. **Background Rollups (`packages/jobs/src/jobs/aggregate-metrics.ts`)**: Create an Inngest scheduled job calculating daily completion counts and averages by age band (satisfies AC-6).
6. **Parent Dashboard (`apps/web/src/app/parent/page.tsx`)**: Expose household habit statistics (books opened, puzzles solved, weekly streak days) derived from secure household relations (satisfies AC-7).

## Consequences

- Full fidelity operational visibility into content engagement without compromising child privacy or divine trust.
- Zero external tracking code deployed to children's browsers or mobile devices.
- Seamless compatibility with Slice 4 rewards ledger and streak tracking.
