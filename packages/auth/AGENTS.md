# Auth Package

## Overview

Supabase authentication integration for Kid Zone. Handles sessions, cookies on Next.js server components, browser clients, and role verification for staff and parents.

## Key files

| File                | Owns                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `src/index.ts`      | Role types (`parent`, `contributor`, `reviewer`, `moderator`, `admin`) and permission helpers |
| `src/server.ts`     | Server Supabase client with cookie stores                                                     |
| `src/client.ts`     | Browser Supabase client                                                                       |
| `src/middleware.ts` | Next.js middleware session refresh handler                                                    |

## Commands

```bash
# Run TypeScript verification
pnpm typecheck
```

## Conventions

- Role checks use the `hasRole` helper with allow lists where admin always passes
- Children do not hold credentials or user accounts; parents hold the parent account
- Use cookie based server client in server actions and route handlers

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
