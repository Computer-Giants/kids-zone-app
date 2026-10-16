# API Service

## Overview

The backend API built with Hono on Node. It exposes typed RPC routes consumed by apps/web, validates external data, and triggers background jobs.

## Key files

| File                 | Owns                                     |
| -------------------- | ---------------------------------------- |
| `src/server.ts`      | Node HTTP server setup and entry         |
| `src/app.ts`         | Main Hono application and route registry |
| `src/routes/jobs.ts` | Job triggers and Inngest integrations    |

## Commands

```bash
# Start local dev with tsx watch
pnpm dev

# Bundle with tsup
pnpm build

# Run unit tests
pnpm test
```

## Conventions

- Validate every input payload with shared Zod schemas from packages/validators
- Enforce data access through database policies rather than manual route filters
- Child facing queries read only published content rows
- Keep business math and streaks as pure functions

## Gotchas

- Unauthenticated guest progress stays on device and never writes child records without an account

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
