# Observability Package

## Overview

Structured logging and error reporting utilities built on Pino. Provides sanitized log outputs with automatic redaction of sensitive credentials.

## Key files

| File           | Owns                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| `src/index.ts` | Pino logger singleton, childLogger creator, and exception reporting seam |

## Commands

```bash
# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Use `logger` or `childLogger` for backend logging rather than raw console statements
- Sensitive authorization tokens, passwords, and secrets are automatically redacted
- Children have no personal identifiers logged; measure activity with aggregated metrics only

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
