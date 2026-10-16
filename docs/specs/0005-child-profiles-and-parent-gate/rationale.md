# Rationale: 0005. Child Profiles and Parent Gate

## Context

Kid Zone is a Catholic learning app for children aged 3 to 15. Protecting child privacy is fundamental: children never hold credentials, accounts, email addresses, or phone numbers. Parents hold the account and manage child profiles under their household.

Two core capabilities are needed:

1. Enabling parents to create and manage learning profiles for each of their children, specifying a nickname, an avatar, and a birth date so content is pitched at the right learning level.
2. Protecting administrative settings and profile management behind a parent gate so children cannot delete profiles, alter household subscriptions, or reconfigure family rules.

Forces at play:

- Literacy diversity: Not all parents have strong arithmetic skills or formal education. A complex math challenge (such as multi digit multiplication) could lock well meaning parents out of their household settings. A clean numeric passcode or key provides universal accessibility.
- Sibling dynamics: In families with multiple children sharing a device, older children often want to protect their progress, streaks, and quiz results from younger siblings who might tap randomly. An optional four digit PIN per profile provides gentle protection without frustrating toddlers.
- Dynamic age progression: As children grow, their age band should advance automatically without manual database updates or stale stored age fields.

## Options considered

### Option 1: Direct parent portal child management with pure age calculation and numeric parent gate passcode (Chosen)

Child profiles are created and managed directly inside the parent dashboard. Age band is calculated on demand using a pure function from `birth_date`. The parent gate uses a simple four digit security passcode with a large numeric keypad, backed by the parent's account password if forgotten.

**Pros**:

- Fully accessible to parents of all literacy levels.
- Children never hold credentials; household RLS policies enforce isolation.
- Age band is computed on the fly, eliminating data drift as children age.
- Optional PIN per child gives older children privacy from siblings.

**Cons**:

- Requires adding a `parent_pin_hash` field to the household record.

### Option 2: Math challenge parent gate without household passcode

Generate randomized multiplication or addition problems (e.g. 8 × 7 or 34 + 19) whenever an adult gate is triggered.

**Pros**:

- Requires no stored passcode in the database.

**Cons**:

- Fails accessibility for parents with dyscalculia or limited arithmetic schooling.
- Older children (aged 11 to 15) who are strong at math can easily solve the equations and bypass the gate.

### Option 3: Account password re-entry on every parent gate challenge

Require the parent to retype their full Supabase account password whenever opening parent settings.

**Pros**:

- Uses existing account credentials.

**Cons**:

- Cumbersome on shared family mobile devices and tablets where long passwords are slow to type.
- Inaccessible for parents using magic link login who may not have set a static password.

## Rationale

Option 1 provides the optimal balance of security, child safety, and parental accessibility. A simple four digit household passcode allows quick entry on family tablets while preventing young children from altering household settings. Providing an optional child PIN lets families balance frictionless entry for preschoolers with milestone protection for teenagers.
