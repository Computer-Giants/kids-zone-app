# 0004. Parent Authentication and Household Setup

**Date**: 2026-10-14  
**Status**: Accepted

## Summary

This decision defines the parent authentication and household initialization architecture for Kid Zone. We establish a secure parent only authentication system using Supabase Auth with server cookie session management via `@supabase/ssr`. Parents register using email and password with magic link support, and their family household is provisioned automatically upon registration. Children never hold accounts or credentials; parent accounts provide the protective boundary around all child data.

## Requirements

**User stories**:

- As a parent, I want to create an account with my email and a secure password so that I can manage learning profiles for my children.
- As a parent, I want the option to sign in with a magic link so that I can quickly access my account on mobile devices without remembering passwords.
- As a parent, I want my household to be automatically created upon registration so that I can immediately reach my household dashboard.
- As a parent, I want immediate access to explore the household dashboard while my email confirmation link arrives in the background.
- As a parent, I want to sign out securely on shared family tablets so that children cannot alter account settings.

**Acceptance criteria**:

- **AC-1**: Sign up form accepts parent email, password, and optional full name, creates a Supabase Auth user, and validates password strength via Zod.
- **AC-2**: Upon successful sign up, a `profiles` record and an associated `households` record are automatically created with role `parent` and default timezone.
- **AC-3**: Parent sign in form supports email and password authentication with clear inline validation and accessible error states.
- **AC-4**: Magic link authentication sends a one time login email OTP and provides clear instructions for the parent to check their inbox.
- **AC-5**: Next.js 15 App Router middleware and server actions manage PKCE session cookies via `@supabase/ssr`, refreshing expired tokens seamlessly.
- **AC-6**: Protected household dashboard at `/parent` redirects unauthenticated visitors to `/login?next=/parent`.
- **AC-7**: Dedicated sign out action destroys session cookies and redirects cleanly to the public home page.
- **AC-8**: Children are strictly excluded from authentication: no child credentials, emails, or login endpoints are created.

## Decision

**Chosen option**: Option 3: Supabase Auth with email, password, and magic link SSR cookies.

We implement parent authentication in `apps/web` and `packages/auth` using Supabase Auth and `@supabase/ssr`. Parents register with email and password or magic link. A database trigger and server action automatically provision the parent's `profiles` record and unique `households` row upon registration. Unauthenticated visits to `/parent` redirect to `/login`, and all child data remains protected behind the parent account.

**Implementation skills**: `supabase` (`.agents/skills/supabase/`) · `supabase-postgres-best-practices` (`.agents/skills/supabase-postgres-best-practices/`) · `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)

## Feature design

**Authentication flow anatomy**:

1. **Sign Up (`/signup`)**:
   - Form fields: Email address, Password, Full Name (optional).
   - Validation: Email format, password minimum 8 characters with at least one number.
   - Action: `signUpParentAction()` calls `supabase.auth.signUp()`.
   - Provisioning: Database trigger `on_auth_user_created` creates `public.profiles` (`role = 'parent'`) and `public.households` (`owner_id = user.id`, `timezone = 'UTC'`).
   - Redirect: Redirects to `/parent` dashboard with a reminder banner to verify email within 24 hours.

2. **Sign In (`/login`)**:
   - Form tab 1: Email and Password login.
   - Form tab 2: Magic Link email request.
   - Action: `signInParentAction()` calls `supabase.auth.signInWithPassword()`.
   - Magic link action: `signInMagicLinkAction()` calls `supabase.auth.signInWithOtp()`.
   - Redirect: Redirects to `/parent` or the specified `next` destination parameter.

3. **Auth Callback (`/auth/callback`)**:
   - Next.js route handler exchanging the PKCE `code` parameter for a persistent session via `supabase.auth.exchangeCodeForSession()`.
   - Redirects to `/parent`.

4. **Sign Out**:
   - Action: `signOutParentAction()` calls `supabase.auth.signOut()` and deletes session cookies.
   - Redirects to `/`.

5. **Parent Dashboard (`/parent`)**:
   - Protected layout checking active session.
   - Displays Household Summary card: Family title, registered parent email, household timezone.
   - Displays Children list (initial empty state inviting the parent to create their first child profile in Feature 6).
   - Quick sign out button.

**API and Server Action surface**:

| Function / Route        | Method        | Inputs                          | Outputs / Behavior                             | Auth Requirement     |
| ----------------------- | ------------- | ------------------------------- | ---------------------------------------------- | -------------------- |
| `/login`                | GET           | `next?: string`                 | Renders sign in form                           | Public               |
| `/signup`               | GET           | None                            | Renders sign up form                           | Public               |
| `/auth/callback`        | GET           | `code: string`                  | Exchanges PKCE code for session cookies        | Public               |
| `/parent`               | GET           | None                            | Renders parent household dashboard             | Authenticated parent |
| `signUpParentAction`    | Server Action | `{ email, password, fullName }` | Creates user, profile, household; sets session | Public               |
| `signInParentAction`    | Server Action | `{ email, password }`           | Authenticates parent; sets session             | Public               |
| `signInMagicLinkAction` | Server Action | `{ email }`                     | Sends magic link email OTP                     | Public               |
| `signOutParentAction`   | Server Action | None                            | Clears session cookies; redirects to `/`       | Authenticated parent |

**Value sourcing**:

| Action               | Value produced / displayed             | Source                                         |
| -------------------- | -------------------------------------- | ---------------------------------------------- |
| Sign up registration | New `auth.users` row                   | Supabase Auth API response                     |
| Profile record       | `profiles.id`, `profiles.email`        | `auth.users.id` and `auth.users.email`         |
| Household record     | `households.id`, `households.owner_id` | Auto generated UUID and `profiles.id`          |
| Household timezone   | `households.timezone`                  | Client detected timezone via `Intl` or `'UTC'` |
| Session verification | Authenticated parent user              | `@supabase/ssr` `supabase.auth.getUser()`      |

**Security and authorization model**:

- **Row Level Security (RLS)**: Enforced on `profiles` and `households`. Parents can only query and update rows where `id = auth.uid()` or `owner_id = auth.uid()`.
- **Session cookies**: Stored with `HttpOnly`, `Secure`, `SameSite=Lax` cookie flags.
- **Child privacy guarantee**: Children never have authentication credentials. No child login route or child credential table exists.

**Critical test scenarios**:

- Parent registration: Submitting `/signup` creates the user, profile, and household, and redirects to `/parent`, verifies **AC-1**, **AC-2**.
- Password login: Submitting valid parent credentials at `/login` signs in and opens `/parent`, verifies **AC-3**, **AC-5**.
- Invalid credentials: Submitting wrong password displays friendly error text without disclosing system internals, verifies **AC-3**.
- Unauthenticated access: Direct navigation to `/parent` without session cookies redirects to `/login?next=%2Fparent`, verifies **AC-6**.
- Sign out: Clicking sign out from the parent dashboard clears cookies and redirects to `/`, verifies **AC-7**.

## Build plan

- [x] 1. Update database trigger `handle_new_user()` in `supabase/sql/auth.sql` and apply migration to auto create `households` row alongside `profiles`, satisfies **AC-2**.
- [x] 2. Implement parent auth server actions (`signUpParentAction`, `signInParentAction`, `signInMagicLinkAction`, `signOutParentAction`) in `apps/web/src/app/(auth)/actions.ts`, satisfies **AC-1**, **AC-3**, **AC-4**, **AC-7**.
- [x] 3. Create auth callback route handler in `apps/web/src/app/auth/callback/route.ts` for PKCE code exchange, satisfies **AC-5**.
- [x] 4. Create responsive parent login and sign up pages in `apps/web/src/app/(auth)/login/page.tsx` and `apps/web/src/app/(auth)/signup/page.tsx`, satisfies **AC-1**, **AC-3**, **AC-4**.
- [x] 5. Implement protected parent household dashboard in `apps/web/src/app/parent/page.tsx` displaying household status, timezone, and sign out, satisfies **AC-6**.
- [x] 6. Configure Next.js middleware in `apps/web/src/middleware.ts` protecting `/parent` routes, satisfies **AC-5**, **AC-6**.
- [x] 7. Verify monorepo typecheck and lint pass with zero errors, satisfies **AC-8**.

## Consequences

**Positive**:

- Establishes a secure parent account foundation protecting all subsequent child profiles.
- Automatic household provisioning eliminates confusing onboarding friction.
- Seamless Next.js 15 App Router server actions with `@supabase/ssr` cookies.

**Negative / tradeoffs**:

- Requires active Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

**Neutral**:

- Background email verification allows parents to start immediately while confirming email in the background.
