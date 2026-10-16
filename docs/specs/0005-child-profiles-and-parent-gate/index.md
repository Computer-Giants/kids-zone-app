# 0005. Child Profiles and Parent Gate

**Date**: 2026-10-15  
**Status**: Accepted

## Summary

This decision defines how parents create and manage learning profiles for their children while keeping child data completely private. Parents add children by picking a preset Catholic avatar, entering a nickname checked against a safety filter, providing a birth date to derive the age band, and optionally setting a four digit child profile key. Household administrative actions and profile switches to parent mode are protected by an accessible parent gate passcode that works for parents of all literacy levels.

## Requirements

**User stories**:

- As a parent, I want to add a profile for my child under my household account so they can learn with age appropriate Catholic content.
- As a parent, I want to choose a friendly preset Catholic avatar for each child so they have a recognizable learning companion without uploading personal photos.
- As a parent, I want an optional four digit key on my child profile so siblings cannot alter each other's progress or streak data.
- As a parent, I want a simple parent gate passcode on the device so my children cannot accidentally access household settings or delete profiles.
- As a parent, I want to enter my child's birth date knowing their age band is calculated automatically on the server without storing static age tags.

**Acceptance criteria**:

- **AC-1**: Parent can add a child profile under their household with a nickname, preset avatar, birth date, and optional four digit child PIN.
- **AC-2**: Nickname is validated against length (between 2 and 30 characters), character set, household uniqueness, and an in memory Catholic safety blocklist filter in packages/validators.
- **AC-3**: Age band is calculated dynamically from birth date in a single pure function `calculateAgeBand(birthDate, referenceDate)` in packages/utils, mapping ages 2 to 7 to `b3_7`, 8 to 10 to `b8_10`, and 11 to 15 to `b11_15`. Age band is never stored as a database column.
- **AC-4**: Preset avatar picker offers a rich Catholic palette combining animals and symbols (Lamb, Dove, Lion, Fish, Star, Bell, Olive, Flame), saint emblems (St. Francis, St. Michael, St. Therese, St. Joseph, St. Peter), and character badges.
- **AC-5**: Optional four digit child PIN is hashed with Web Crypto before storage, allowing quick tap access for toddlers while protecting older children from sibling interference.
- **AC-6**: Accessible parent gate modal requires a four digit household security passcode with numeric keypad buttons for all literacy levels, with account login password as fallback.
- **AC-7**: Household security passcode is set and updated by the parent, stored as `parent_pin_hash` on the households table.
- **AC-8**: Child privacy invariants are strictly enforced: no credentials, real names, emails, phones, or third party trackers exist for any child. Row Level Security limits child data access to the owning household.

## Decision

**Chosen option**: Option 1: Direct parent portal child management with pure age calculation and numeric parent gate passcode.

We implement child profile creation and management inside the parent portal in apps/web. Child records link to the parent's household row. Age bands are derived in packages/utils using a pure date calculation function. The parent gate presents a clean numeric keypad asking for the household passcode, avoiding complex arithmetic so parents of all literacy levels can use it with ease.

**Implementation skills**: `supabase` (`.agents/skills/supabase/`) · `supabase-postgres-best-practices` (`.agents/skills/supabase-postgres-best-practices/`) · `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)

## Feature design

**Data model sketch**:

```sql
-- Migration update to public.households
ALTER TABLE public.households
  ADD COLUMN IF NOT EXISTS parent_pin_hash text;

-- Existing children table in packages/db/src/schema/accounts.ts
-- id: uuid primaryKey
-- household_id: uuid notNull references households(id) on delete cascade
-- nickname: text notNull
-- avatar: text notNull (preset key, e.g. "lamb", "dove", "lion", "fish")
-- birth_date: date notNull (stored as YYYY-MM-DD string)
-- pin_hash: text nullable (hashed 4-digit child key)
-- show_on_leaderboard: boolean notNull default true
-- status: enum ('active', 'graduated') notNull default 'active'
-- graduated_at: timestamp with time zone
```

**API surface**:

| Action                       | Kind          | Key inputs                        | Key outputs      | Auth             | Key errors                                           |
| ---------------------------- | ------------- | --------------------------------- | ---------------- | ---------------- | ---------------------------------------------------- |
| `createChildAction`          | Server Action | nickname, avatar, birthDate, pin? | childId, ageBand | Parent Session   | 400 (Bad input, profanity), 409 (Duplicate nickname) |
| `updateChildAction`          | Server Action | childId, nickname, avatar, pin?   | success          | Parent Session   | 400 (Invalid input), 403 (Not household child)       |
| `deleteChildAction`          | Server Action | childId, parentPasscode           | success          | Parent Session   | 403 (Invalid passcode or ownership)                  |
| `setParentPasscodeAction`    | Server Action | passcode, currentPassword         | success          | Parent Session   | 400 (Invalid format), 403 (Password mismatch)        |
| `verifyParentPasscodeAction` | Server Action | passcode                          | isValid, token   | Public / Session | 401 (Incorrect passcode)                             |

**Value sourcing**:

| Action                       | Value produced or displayed | Source                                                                    |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `createChildAction`          | Age band badge              | Derived in packages/utils via `calculateAgeBand(birthDate, now)`          |
| `createChildAction`          | `household_id`              | Resolved from authenticated parent session in `profiles` and `households` |
| `createChildAction`          | `pin_hash`                  | Web Crypto PBKDF2 hash of 4-digit input, or null                          |
| `setParentPasscodeAction`    | `parent_pin_hash`           | Web Crypto PBKDF2 hash of 4-digit passcode stored in `households`         |
| `verifyParentPasscodeAction` | Unlock state                | Verified against `households.parent_pin_hash` for active household        |

**Key invariants**:

- Children never hold authentication credentials, real names, email addresses, phone numbers, or uploaded images.
- A household cannot have two active children with the same nickname.
- Age band is never written to a database column. It is always calculated dynamically from `birth_date`.
- Deleting a child profile requires parent gate passcode verification.

**Security model**:

- Row Level Security policies enforce that only the household owner can read, insert, update, or delete child rows.
- Child nicknames pass an in memory safety filter before reaching the database.
- Parent passcode protects transitions from child learning screens to the parent portal.

**Critical test scenarios**:

- Happy path: Parent creates a child profile with nickname "David", avatar "lamb", and birth date; child appears on dashboard with derived age band `b8_10`, verifies **AC-1**, **AC-3**, **AC-4**.
- Blocklist filter: Submitting an inappropriate nickname returns a friendly validation error without saving to the database, verifies **AC-2**.
- Age calculation: Dates for children aged 2 through 15 map to their exact age bands in `calculateAgeBand`, verifies **AC-3**.
- Sibling key protection: Setting a 4-digit child PIN hashes the value and prevents unauthorized access, verifies **AC-5**.
- Accessible parent gate: Entering the 4-digit household passcode unlocks parent settings; entering an incorrect passcode shows an encouraging retry prompt, verifies **AC-6**, **AC-7**.
- Privacy protection: Child records omit personal identifiers and enforce household isolation policies, verifies **AC-8**.

## Build plan

1. Add `parent_pin_hash` column migration to `households` table and update Drizzle schema, satisfies **AC-7**.
2. Implement `calculateAgeBand` pure function with tests in `packages/utils`, satisfies **AC-3**.
3. Create child profile validation schemas and safety term blocklist in `packages/validators`, satisfies **AC-2**, **AC-5**.
4. Build Catholic preset avatar collection and selector component in `packages/ui`, satisfies **AC-4**.
5. Build accessible numeric keypad Parent Gate modal component in `packages/ui`, satisfies **AC-6**.
6. Implement server actions for child creation, updating, deletion, and passcode verification in `apps/web`, satisfies **AC-1**, **AC-5**, **AC-7**, **AC-8**.
7. Build child profile management views and creation form in `apps/web/src/app/parent/`, satisfies **AC-1**, **AC-4**, **AC-6**.
8. Verify end to end creation and gate unlock flows with automated unit and browser tests, satisfies **AC-1** through **AC-8**.

## Consequences

**Positive**:

- Complete compliance with child privacy rules and Catholic family expectations.
- Simple numeric passcode makes the parent gate fully accessible to parents of all literacy levels.
- Pure age calculation ensures children automatically transition between age bands on their birthdays without manual database updates.

**Negative / tradeoffs**:

- Parents must remember their 4-digit passcode, though account password fallback provides a safe recovery mechanism.
- In memory blocklist requires periodic review to keep safety terms updated.

## Follow-up

- [ ] Add avatar illustrations for all selected Catholic symbols to packages/ui vector library.
- [ ] Schedule review of blocklist filter terms with catechist or review team.

## Rationale

See [rationale.md](./rationale.md) for context and alternative options evaluated.
