# Jobs Package

## Overview

Background job workflows orchestrated via Inngest. Handles asynchronous tasks like milestone badge awarding, streak updates, email triggers, and scheduled operations.

## Key files

| File           | Owns                                                          |
| -------------- | ------------------------------------------------------------- |
| `src/index.ts` | Inngest client, function definitions, and Hono server adapter |

## Commands

```bash
# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Every background job runs via Inngest step functions for durability and idempotency
- Functions are exported in the `functions` array and served by apps/api
- Keep job step handlers idempotent using unique event keys

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
