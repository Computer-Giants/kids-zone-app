# Utils Package

## Overview

Pure utility functions without side effects or database dependencies. Provides formatting, sleep helpers, unit conversions, and type guards.

## Key files

| File           | Owns                                                                               |
| -------------- | ---------------------------------------------------------------------------------- |
| `src/index.ts` | Currency formatting, age band calculation, guest device storage, and `assertNever` |

## Commands

```bash
# Run unit tests
pnpm test

# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Every function must remain pure and free from database calls or side effects
- Money calculations operate in minor units (integers)
- Exhaustive conditionals use `assertNever` to guarantee compile time coverage
- Age band calculation in `calculateAgeBand` is the single pure source of truth for age bands across the entire application

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
