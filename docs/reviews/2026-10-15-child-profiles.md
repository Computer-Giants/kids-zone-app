# Review, main (child-profiles), 2026-10-15

**Reviewed by**: Gemini 3.8 Flash (inline reviewer)
**Scope**: 12 files, uncommitted changes on main (Feature 6: Child Profiles and Parent Gate)
**Verdict**: Changes requested

## Summary

The Child Profiles and Parent Gate implementation delivers strong child privacy guarantees, complete Row Level Security isolation, and an accessible numeric keypad modal for family devices. Before merge, three major issues should be addressed: child profile deletion currently omits the required parent passcode verification, PIN and passcode hashing uses single-round static-salted SHA-256 with non-constant-time comparison instead of PBKDF2, and the safety blocklist substring filter suffers from the Scunthorpe problem, falsely rejecting common Catholic names like Michelle.

## Major

### 🟠 Child deletion omits parent passcode verification, `apps/web/src/app/parent/actions.ts:197` and `apps/web/src/app/parent/parent-dashboard-client.tsx:49`

**Problem**: `deleteChildAction` accepts only `childId` and deletes child records without verifying the household's security passcode. The client UI triggers deletion via a standard browser `confirm()` dialog.
**Why it matters**: Violates Spec 0005 AC-8 and key invariants ("Deleting a child profile requires parent gate passcode verification"). On shared family devices, curious children could accidentally delete their siblings' profiles and learning progress.
**Suggested fix**: Update `deleteChildAction` to accept `parentPasscode: string`, verify it against `households.parent_pin_hash`, and require the `ParentGateModal` before initiating deletion in the dashboard UI.

### 🟠 Weak PIN/passcode hashing and timing-vulnerable comparison, `apps/web/src/lib/crypto.ts:6-21`

**Problem**: 4-digit PINs and household passcodes are hashed with a single round of static-salted SHA-256 via `crypto.subtle.digest("SHA-256", ...)`, and `verifyPasscode` compares hashes using standard string equality `===`.
**Why it matters**: A 4-digit numeric PIN has only 10,000 combinations (0000–9999). Single-round static SHA-256 can be brute-forced across the entire keyspace in under one millisecond if database hashes leak. Standard `===` comparison is also subject to timing attacks.
**Suggested fix**: Use Web Crypto PBKDF2 with unique salts and high iteration counts (e.g. 100,000 iterations) as specified in Spec 0005, and use constant-time byte comparison for passcode verification.

### 🟠 False-positive name rejection in safety filter (Scunthorpe problem), `packages/validators/src/filter.ts:107-111`

**Problem**: `containsBlockedTerm` rejects any nickname that contains a blocked word of length >= 4 as a substring via `normalized.includes(term)`. Because "hell" is in `BLOCKED_TERMS`, traditional names like "Michelle", "Shelley", "Mitchell", and "Hellen" are rejected.
**Why it matters**: Catholic parents attempting to register their children with traditional Christian names will be blocked with an inappropriate word error.
**Suggested fix**: Enforce word boundary matching for general terms such as "hell", and limit full substring containment checks to severe, unambiguous slurs and obscenities.

## Minor

### 🟡 Date-only string parsing causes timezone boundary skew, `packages/utils/src/index.ts:32`

**Problem**: `calculateExactAge` parses ISO date strings (`"YYYY-MM-DD"`) using `new Date(birthDateInput)`. In JavaScript, date-only strings parse as UTC midnight, but the calculation calls local getters (`getFullYear()`, `getMonth()`, `getDate()`). In timezones with negative UTC offsets (e.g. America/New_York), this shifts the date to the prior day.
**Why it matters**: Children may be assigned the incorrect age band or graduation status on their birthday depending on server or browser timezone.
**Suggested fix**: Parse `YYYY-MM-DD` by splitting year, month, and day integers, or use UTC getters (`getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`) consistently.

### 🟡 Duplicate age calculation logic in schema validator, `packages/validators/src/index.ts:73-82`

**Problem**: `createChildSchema` duplicates age subtraction arithmetic inline in its Zod refinement instead of importing `calculateExactAge` from `@kidzone/utils`.
**Why it matters**: Violates the `.agents/AGENTS.md` project rule: "The band is derived from birth_date in one function. Never store it, never compute it twice."
**Suggested fix**: Import `calculateExactAge` from `@kidzone/utils` in `packages/validators` to keep age calculations centralized in a single pure function.

### 🟡 Generic incorrect passcode error during passcode setup, `packages/ui/src/components/parent-gate-modal.tsx:70-73`

**Problem**: In `ParentGateModal`, any exception thrown in `onSuccess` displays `"Incorrect passcode. Please try again."`, even in setup mode (`isSetupMode=true`).
**Why it matters**: Confuses parents configuring their initial passcode if an error occurs due to session expiry or network issues.
**Suggested fix**: Display a context-aware error message such as `"Failed to save passcode. Please try again."` when `isSetupMode` is true.

## Nits

- ⚪ `apps/web/src/app/parent/actions.ts:267`, `parent_gate_unlocked` cookie is set for 30 minutes upon passcode verification, but neither middleware nor page components inspect this cookie.
- ⚪ `apps/web/src/app/parent/actions.ts:75`, Household nickname uniqueness check is case-sensitive (`eq("nickname", parsed.data.nickname)`), allowing potential duplicates like "David" and "david".

## Strengths

- Strong child privacy architecture: Zero credentials, real names, phone numbers, or photos collected. Preset Catholic avatar picker offers friendly engagement with complete privacy preservation.
- Strict database isolation: Drizzle migration `0004` and `0002` apply complete Row Level Security policies on `children`, `households`, and `child_preferences`.
- Accessible UI design: Dual-navigation shell and tactile 56px keypad buttons on `ParentGateModal` ensure high usability across literacy and device levels.

## Test coverage

Test suite is configured and passing cleanly. Unit tests in `packages/validators/src/child.test.ts` cover nickname rules, avatar keys, and 4-digit PINs. Pure age band mapping is covered in `packages/utils/src/index.test.ts`. End-to-end tests in `apps/web/e2e/child-profile.spec.ts` verify the keypad interaction and unauthenticated route guards.
