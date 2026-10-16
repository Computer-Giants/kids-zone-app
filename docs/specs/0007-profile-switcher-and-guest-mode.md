# 0007. Profile Switcher and Guest Mode

**Date**: 2026-10-15
**Status**: Accepted

## Summary

This specification defines the child profile selection screen, active child session persistence, optional child profile key unlock, and guest browsing mode for Kid Zone. It allows children to tap their avatar, enter their four digit child key if configured, and enter their tailored Catholic learning experience without credentials. Families without an account can explore reading and puzzles in guest mode with zero database records created, storing their progress on their local device.

## Context

Parents create household accounts and configure child profiles with avatars, nicknames, and optional child keys. However, until this feature is built, children have no direct way to choose their own avatar, switch between siblings on a shared family tablet, or establish their active age band context.

Furthermore, Catholic families exploring the app for the first time need to preview Bible stories, saint biographies, and church puzzles before committing to account creation. In keeping with our strict child privacy rules, guest interactions must run with zero server tracking and zero database persistence.

We need a dedicated profile selection view, a server cookie for active profile context, and a complete guest mode that lets families choose a reading level while keeping all data local.

## Requirements

**User stories**:

- As a child in a Catholic family, I want to tap my friendly saint avatar so that the app opens with Bible stories and quizzes appropriate for my age.
- As a child with older or younger siblings, I want to enter my four digit profile key so that my brother or sister cannot accidentally overwrite my learning progress.
- As a visiting parent or child without an account, I want to explore Bible stories and puzzles as a guest so that I can see how Kid Zone works before creating an account.
- As a parent, I want to switch from child mode back to parent controls using the Parent Gate passcode so that my children cannot alter household settings.

**Acceptance criteria**:

- **AC-1**: Navigating to /select-profile displays all child profiles belonging to the household, with their saint avatar, nickname, and derived age band label.
- **AC-2**: Tapping an unlocked child profile sets an HTTP cookie (kz_active_child) with the child profile ID and redirects to the Catholic learning home page.
- **AC-3**: Tapping a child profile protected by a key opens an accessible numeric keypad modal; entering the matching four digit key unlocks the profile and sets the active child cookie.
- **AC-4**: An incorrect profile key entry displays a gentle encouraging message without red error styling or lockout panic.
- **AC-5**: The application navigation displays the active child avatar pill with a quick action to switch profiles.
- **AC-6**: Guest exploration mode is accessible without logging in, presents age band choices (Little Lambs 3 to 7, Seekers 8 to 10, Disciples 11 to 15), sets the guest age band cookie, and never writes records to the database.
- **AC-7**: Navigating from child mode or profile selection to /parent requires entering the household Parent Gate passcode.

## Options considered

### Option 1: HTTP session cookie with server actions and client guest storage (Recommended)

Store the active child ID in an HTTP cookie managed by server actions, with child key verification performed on the server. Guest users store their selected age band in a cookie and local device storage.

**Pros**:

- Next.js server components can read the active child profile or guest age band immediately, rendering appropriate reading levels with zero client layout shift.
- Child keys are verified securely on the server against cryptographic hashes.
- Guest mode creates zero server database rows, fulfilling privacy rules.

**Cons**:

- Requires cookie synchronization between server actions and client navigation state.

### Option 2: Pure client side local storage state

Store the active profile ID and guest state entirely in browser localStorage, resolving profiles on the client after mount.

**Pros**:

- Simple client state management.

**Cons**:

- Causes visible flash of unstyled or mismatched content on server rendered pages while the client reads localStorage.
- Weakens security by exposing child key hashes to the client for validation.

### Option 3: Single active household session without individual child switching

Treat the parent session as a single shared context without distinct child profiles active in learning views.

**Pros**:

- Avoids switching logic.

**Cons**:

- Fails multi child families where siblings of different ages share one tablet and need different reading levels.

## Decision

**Chosen option**: Option 1: HTTP session cookie with server actions and client guest storage

Implement a dedicated /select-profile page, active profile server actions that set an HTTP cookie, a numeric child key unlock modal, and local device guest mode.

## Feature design

**Data model sketch**:

No new database tables are needed. The feature builds upon the existing tables in packages/db:

- `child_profiles`: `id`, `household_id`, `nickname`, `avatar_id`, `birth_date`, `pin_hash`.
- `households`: `id`, `parent_pin_hash`.

**Session cookies and local storage**:

| Key               | Storage mechanism                  | Content                                  | Purpose                                          |
| ----------------- | ---------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| kz_active_child   | HTTP cookie (SameSite Lax, Path /) | UUID of active child profile             | Identifies current learner for server components |
| kz_guest_age_band | HTTP cookie (SameSite Lax, Path /) | Age band string ("3-7", "8-10", "11-15") | Informs reading level for unauthenticated guests |
| kz_guest_progress | Browser localStorage               | Compact JSON map of completed read items | Retains guest reading checkmarks on device       |

**State transitions**:

```
[ Unauthenticated Visitor ]
       |
       +---> [ Guest Mode Selected ] ---> Sets kz_guest_age_band ---> [ Learning Home (Guest) ]
       |
       +---> [ Parent Logs In ] ---> Redirects to [ Select Profile Screen (/select-profile) ]
                                                            |
                                      +---------------------+---------------------+
                                      |                                           |
                               [ Child Tapped ]                           [ Child with Key ]
                                      |                                           |
                                      |                                    [ Keypad Modal ]
                                      |                                           |
                                      +<------------------------------------------+
                                      |
                              Sets kz_active_child
                                      |
                           [ Learning Home (Child) ]
                                      |
                     +----------------+----------------+
                     |                                 |
              [ Switch Child ]                 [ Parent Portal Tapped ]
                     |                                 |
            Clears active child                 [ Parent Gate Keypad ]
                     |                                 |
           Back to /select-profile             Validates Parent Passcode
                                                       |
                                               [ Parent Dashboard ]
```

**API and action surface**:

| Function or action     | Method        | Key inputs                          | Key outputs      | Auth requirement        | Key errors                      |
| ---------------------- | ------------- | ----------------------------------- | ---------------- | ----------------------- | ------------------------------- |
| selectChildAction      | Server Action | childId: string                     | success: boolean | Authenticated parent    | Profile not found, unauthorized |
| unlockChildPinAction   | Server Action | childId: string, pin: string        | success: boolean | Authenticated parent    | Invalid key (gentle message)    |
| clearActiveChildAction | Server Action | none                                | success: boolean | Public or Authenticated | none                            |
| setGuestAgeBandAction  | Server Action | ageBand: "3-7" \| "8-10" \| "11-15" | success: boolean | Public                  | Invalid age band                |

**Value sourcing**:

| Action or surface                | Value produced or displayed        | Source                                                                         |
| -------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| Profile cards on /select-profile | Nickname, avatar, derived age band | child_profiles table filtered by household_id, age derived via deriveAgeBand   |
| Key challenge indicator          | Has four digit key (boolean)       | Computed on server (pin_hash is not null), never sending hash to client        |
| Active learner context           | Current child profile              | kz_active_child cookie matched against database profile                        |
| Reading level text               | Age tailored content               | Derived age band from active child birth date, or kz_guest_age_band for guests |
| Device progress for guest        | Completed readings                 | Local device localStorage (kz_guest_progress)                                  |

**Key invariants**:

- Guests never trigger database write operations; all guest progress remains in device storage.
- Real age band is always calculated dynamically from birth date using deriveAgeBand; never stored in a database column.
- Returning from child mode to /parent always requires the household Parent Gate passcode.
- The active child profile cookie must belong to the logged in parent household; mismatched cookies are cleared.

**Security and privacy model**:

- Profile keys prevent siblings from tampering with another child profile.
- Parent Gate passcode protects parent settings and email records from children.
- No personal identifiable information is displayed on profile cards (avatars and safety filtered nicknames only).

**Configuration required**:

- None (uses existing Supabase session and cryptographic utilities).

**Critical test scenarios**:

- Happy path child selection: A parent logs in, sees their child profiles, taps an unlocked child avatar, and is redirected to the home page with their avatar in the header, verifies **AC-1**, **AC-2**, **AC-5**.
- Keypad unlock: Tapping a protected child profile opens the keypad modal, entering the valid four digit key unlocks the session, verifies **AC-3**.
- Invalid key entry: Entering an incorrect four digit key displays an encouraging message without red error banners, verifies **AC-4**.
- Guest exploration: Visiting without an account allows selecting an age band and viewing reading materials with zero database rows created, verifies **AC-6**.
- Parent gate guard: Tapping the Parent Portal link from child mode opens the parent gate modal and rejects incorrect passcodes, verifies **AC-7**.

## Build plan

1. Create server actions in apps/web/src/app/select-profile/actions.ts for active child selection, child key verification, profile clearing, and guest age band setting, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-6**.
2. Create ChildPinModal component in packages/ui with accessible four digit numeric keypad and encouraging feedback styling, satisfies **AC-3**, **AC-4**.
3. Create the /select-profile page in apps/web rendering household child avatar cards, key challenge triggers, and guest mode entry, satisfies **AC-1**, **AC-6**.
4. Update AppShell and navigation header in packages/ui and apps/web to show the active child avatar pill, profile switch action, and parent gate guard, satisfies **AC-5**, **AC-7**.
5. Add client hook and helper for guest local device progress tracking in packages/utils, satisfies **AC-6**.
6. Create comprehensive Playwright E2E test suite in apps/web/e2e/profile-switcher.spec.ts covering profile switching, key unlock, guest mode, and parent gate protection, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**.

## Consequences

**Positive**:

- Children can independently select their profiles with a child friendly tactile experience.
- Siblings can protect their learning journey and stars using simple four digit keys.
- Visiting families can explore faith learning immediately as guests without privacy risks or database clutter.
- Parents retain full control over household settings behind the Parent Gate passcode.

**Negative / tradeoffs**:

- Parents must remember to unlock via Parent Gate when switching back to administrative views.
- Guest progress does not synchronize across multiple devices until an account is registered.

**Neutral**:

- The kz_active_child cookie expires with the browser session or when explicitly switched.

## Follow-up

- [ ] Connect guest device progress import when an account is subsequently created in a future slice.
