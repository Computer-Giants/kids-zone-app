# Kid Zone

A Catholic learning app for children 3 to 15: Bible, saints, catechism, stories,
quizzes and puzzles. Parents hold the account, a priest reviews everything, a lamb
guides. "Kid Zone" is a working name.

Why any of these rules exist is in `docs/project-doc.md`. This file is the rules
themselves.

## Stack

pnpm + Turborepo monorepo. `apps/web` is Next.js 15 (App Router), React 19,
Tailwind v4. `apps/api` is Hono with a typed RPC client. `apps/admin` is the
content dashboard. Drizzle on Supabase Postgres, Supabase Auth, Inngest for jobs,
Resend and React Email, Pino. TypeScript strict. Packages are consumed as source.

If you're not certain about an API, read the docs inside the installed package
rather than going from memory.

## How we work

Spec driven. Nothing gets built without a spec.

- `docs/project-doc.md`: what this app is and every decision behind it. Read the
  part you need. Don't ask me to paste it.
- `docs/data-model.md`: the tables. Update it in the same change as the schema.
- `docs/design.json`: the look. Read it before any UI work.
- `docs/specs/phase-NN.md`: one per phase, written just before it starts.
  Behaviour and an acceptance check, never filenames.
- This file: always true, read on every prompt.

**Starting a phase.** Read this file and that phase's spec. Build what the spec
asks and stop.

**Dropped into a fresh context?** Look at which files exist in `docs/specs/`,
then the git log. The last commit is the last phase that passed. Tell me what
you've worked out before building on it.

**The acceptance check is mine to run, by hand, in a browser.** That is the
sign-off. You may also write and run automated tests (Vitest and Playwright are
already installed; don't add another runner).

**Before saying a phase is done:** typecheck, lint, test, build. Anything
verifiable from a terminal is yours. Anything needing a browser is mine.

**When a phase comes out wrong, I reset rather than patch.** If a spec is
ambiguous, say so _before_ you build.

## How to talk to me

Short. If a sentence isn't telling me something I need, cut it.

**Ask with an answer attached.** One question at a time, and say which way you'd
go and why. Never pick a direction silently, never build both.

**When you need something only I can give you** (a key, a value in `.env`, a
decision about the faith) say exactly what and where, then stop.

**No walls of text.** When a phase is done, say what it does and what the check
should show, in a few lines.

**Plain English.** **Say when something didn't work.** A failure worked around
quietly costs me an hour later.

## The rule everything rests on

**Nothing we publish reaches a child unless a human reviewer approved it.**

Status flows `draft` > `submitted` > `approved` (reviewer) > `published` (admin).

- Child-facing reads see `published` rows only, enforced by policy, not by a
  `where` in the route.
- Content you write or seed is placeholder. Mark it clearly and leave it `draft`.
  Never publish faith content, and never write doctrine you can't point a source
  for. If you're unsure whether something is accurate, say so.
- Every content row records its source. The reviewer sees the original next to the
  child's simplified text.

Two features reach children without a prior review. They are named exceptions with
their own controls below: **chat** and the **AI**. Don't build either before its
phase. Don't invent a third exception.

## Child data

- **No server record without an account.** Guests read and play; their progress
  stays on the device. Every user-owned table has a non-null `child_id`.
- Children never have credentials, a real name, an email, a phone, an address, a
  school, or a precise location. A parent types the nickname and it passes the
  filter, because other children see it.
- **The one photo exception:** Throwback photos, uploaded by a parent, in a private
  bucket readable only by that household, location data stripped, deletable by the
  parent, never shown to another child, no share-to-social button. No photo is
  stored anywhere else.
- No ads, no third-party trackers, no analytics that identify a child. Measure
  with counts and averages only.
- Anything leaving the app from a child's screen sits behind a parent gate.
- Compliance work is deferred until the MVP is finished. Until then the app runs
  with a closed group only, and photos, chat and the AI stay off.

## Age

- Three bands: 3-7, 8-10, 11-15. The band is derived from `birth_date` in **one**
  function. Never store it, never compute it twice.
- Age guides and recommends. It never hides content. A parent can change the
  default; children can browse any band.
- **Chat and anything age-restricted uses real age**, never the override.
- Reading level by band: 3-7 grade 1-2, 8-10 grade 3-5, 11-15 grade 6-8.

## Rewards

- The ledger is append-only. Corrections are new rows. Balances are sums.
- Stars measure progress and are never spent. Coins are spendable.
- Earning rules live in `coin_rules`, with daily caps. Don't hard-code amounts.
- The server's clock decides what counts, never the device's.
- The leaderboard ranks weekly stars by real age band, shows nicknames only, and
  honours a parent's hide setting. Never rank by coins.

## Offline

Offline is for reading only. Quizzes, puzzles, review, chat and the AI need a
connection. Reading done offline is recorded on reconnect, using the idempotency
key. Drop any cached copy the app hasn't been able to check for 14 days. Never
cache photos.

## Chat (later phase)

- Ages 11 to 15 only. Rooms by age band, topic or parish. No private messages.
- Every free-text message starts `pending`, passes the filter, then becomes
  `visible` or `held`. Held and flagged messages go to the moderator queue.
- Children can't edit or delete messages. Removal is a moderator action, logged.
- Serious categories create a safeguarding alert and notify the parent.

## The AI (later phase)

- Switched off until a priest or catechist has graded a set of real questions for
  **each age band** and it reaches the agreed score.
- All ages, with answers simplified by band. Every answer is labelled as coming
  from an AI and sends the child to a parent or priest for anything unsure.
- Every question and answer is logged with the band and model.
- **One place constructs the AI client.** Anywhere else silently skips logging.

## How the code is laid out

You pick the file structure. These are about behaviour.

- **Database access happens in server code**, not in components.
- **Who may read a row is decided by a policy**, never by application code. If a
  query needs a `where` clause to return the right rows, the policy is wrong.
- **Row-level security is on for every table.** A table without it returns
  everything, silently. A check must fail the build if any table lacks it.
- **Calculations are pure functions**: age band, streaks, coin earning, review
  scheduling, leaderboard rank, journey node state. No fetching inside them.
- Content tables use the shared helpers in `packages/db/src/schema/columns.ts`.
  Don't hand-roll status, review or age columns.
- Bible text is referenced by canonical reference, never copied into content.

## Conventions

Strict TypeScript, no `any`. If a type is genuinely awkward, tell me rather than
casting. Comment the decisions, not the syntax. One obvious way to do something
beats a configurable one.

Validate every external input with Zod (shared schemas in `packages/validators`).
Env vars go in `.env.example` and the app's `env.ts`; never read `process.env`
ad hoc. Commits follow Conventional Commits. Add a changeset when a package's
public behaviour changes. Run `pnpm db:generate` after editing the schema, then
`pnpm db:migrate`.

## The interface

Read `docs/design.json`. In short: a six-year-old on a cheap phone is the user.
One main action per screen, tap targets of at least 48px, short sentences, an
icon with every label. Tokens live in `packages/ui/src/styles.css`; no hard-coded
colours. Orange is the one thing to do next. Wrong answers are gentle, never red.
WCAG AA, read-aloud on every lesson and story, `prefers-reduced-motion` respected.

Nothing moves without a reason: motion answers a tap or marks a win. The one
exception is the dove on page load. No pulsing, no flashing, no ambient animation.

There's a frontend design skill that activates on its own for UI work. Use it,
but `design.json` overrules it. It will reach for flourish and density; this is a
tool for children and it should stay calm and big.

## Things not to do

Breaking one of these is worse than not finishing.

- **Never publish content.** You draft; a human reviews; an admin publishes.
- **Never invent faith content to fill a gap.** Missing text? Leave it `draft`
  and say so. Absent beats approximate.
- **Never collect a child's real name, photo, email or phone.** The Throwback
  photo is the only photo, and only a parent uploads it.
- **Never add a tracker, ad or third-party script** to a page a child sees.
- **Don't install a package without asking.** Name it, say what for, wait.
- **Don't build ahead of the current phase.** No scaffolding for what's coming.
- **Don't shame a child.** No red for wrong answers, no negative scores, no
  "you failed".
- **Don't weaken a check to make it pass.** A check that can't run must fail
  loudly.
- **Don't leave the build broken.** Tell me about a failure instead of working
  around it.
- **Don't read from the database in a loop.** Name your columns, limit list reads,
  subscribe instead of polling.