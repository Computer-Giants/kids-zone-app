# Rationale: 0004 Parent Authentication and Household Setup

## Context

Kid Zone is a Catholic learning app where child safety and family privacy are foundational. Children aged three to fifteen use the app to learn Scripture, explore the lives of saints, and play faith games. In accordance with our core privacy mandate, children never possess credentials, email addresses, phone numbers, or public profiles. Every child profile lives strictly under a parent account.

Parents need an intuitive, accessible way to create an account, log in across devices, manage their family household, and access parent restricted settings protected behind arithmetic gates. When a parent signs up, a dedicated household must be established immediately without requiring complex multi step onboarding, allowing the parent to immediately transition into creating child profiles.

## Options considered

### Option 1: Custom credentials with self managed JWT cookies

Implement custom user registration, bcrypt password hashing, and signed JWT session cookies directly inside Next.js API routes.

**Pros**:

- Full control over cookie format and tokens.
- No dependency on Supabase Auth services.

**Cons**:

- Requires custom implementation of secure password hashing, reset tokens, rate limiting, and email verification.
- Adds significant security maintenance burden for sensitive parent credentials.
- Does not integrate with Supabase native Postgres Row Level Security `auth.uid()`.

### Option 2: Third party social OAuth only (Google / Apple)

Require parents to log in exclusively using Google or Apple sign in buttons.

**Pros**:

- No password management required.
- Fast one tap mobile sign in.

**Cons**:

- Excludes parents who prefer not to link third party tech accounts.
- Adds third party trackers and external scripts to login flows, conflicting with privacy principles.
- Complicates local and offline dev setups.

### Option 3: Supabase Auth with email, password, and magic link SSR cookies (Recommended)

Leverage Supabase Auth with `@supabase/ssr` cookies, supporting both email with password and passwordless magic links.

**Pros**:

- Native integration with Postgres Row Level Security via `auth.uid()`.
- Supports standard passwords and convenient magic link email verification.
- Zero client side trackers or external ad scripts.
- Secure HTTP only session cookies compatible with Next.js 15 App Router server actions.
- Automatic profile creation via database trigger.

**Cons**:

- Requires configured Supabase project environment variables.

## Rationale

Supabase Auth seamlessly binds our Next.js frontend to Postgres Row Level Security. By creating `profiles` and `households` rows in the database, we ensure every parent has a secure household container ready to receive child profiles. Supporting both passwords and magic links offers flexibility for parents on both mobile phones and desktop computers while maintaining zero third party trackers.

## References

**Project sources**:

- `docs/project-doc.md`: Parent account ownership, reviewer doctrine, and zero child data principles
- `.agents/AGENTS.md`: Children never have credentials, real names, or emails
- `docs/data-model.md`: `profiles`, `households`, and `children` schema definitions
- `packages/db/src/schema/accounts.ts`: Drizzle table schemas for profiles and households
- `packages/auth/src/server.ts`: Next.js 15 SSR Supabase client utilities
