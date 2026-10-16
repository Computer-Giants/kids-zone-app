# Validators Package

## Overview

Shared Zod validation schemas across front end, backend API, and database payloads. Enforces runtime contracts on inputs, nicknames, age bands, and puzzle configurations.

## Key files

| File            | Owns                                              |
| --------------- | ------------------------------------------------- |
| `src/index.ts`  | Shared Zod schemas and inferred TypeScript types  |
| `src/filter.ts` | Child nickname safety and Catholic content filter |

## Commands

```bash
# Run unit tests
pnpm test

# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Every external input entering apps/api or apps/web must validate against a schema here
- Age bands match `b3_7`, `b8_10`, `b11_15`
- Puzzle JSON configs are typed and validated here per puzzle kind

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
