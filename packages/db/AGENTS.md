# Database Package

## Overview

The Drizzle ORM layer connecting to Supabase Postgres. It acts as the single source of truth for all database tables, columns, relations, and migrations.

## Key files

| File                    | Owns                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `src/index.ts`          | Database client factory and singleton instance                   |
| `src/schema/index.ts`   | Barrel export of all domain schemas                              |
| `src/schema/columns.ts` | Shared column helpers for lifecycle status, age bands, and dates |

## Commands

```bash
# Generate SQL migration files
pnpm generate

# Apply migrations to database
pnpm migrate

# Open local Drizzle Studio
pnpm studio
```

## Conventions

- Update docs/data-model.md whenever altering schemas
- Use shared helpers from src/schema/columns.ts for review status and timestamps
- Maintain non-null child_id on all user owned data rows
- Every table must have row level security enabled in Supabase

## Gotchas

- Run pnpm db:generate after schema edits to produce versioned SQL before migrating

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
