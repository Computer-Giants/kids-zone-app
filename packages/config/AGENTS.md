# Config Package

## Overview

Centralized tool configurations shared across the monorepo workspaces. Exports ESLint presets, Prettier settings, and base TypeScript configs.

## Key files

| File                 | Owns                                                  |
| -------------------- | ----------------------------------------------------- |
| `eslint/base.mjs`    | Base ESLint rules for Node and libraries              |
| `eslint/next.mjs`    | ESLint configuration for Next.js applications         |
| `tsconfig/base.json` | Base TypeScript compiler options                      |
| `prettier.mjs`       | Shared Prettier formatting rules with Tailwind plugin |

## Commands

```bash
# Validated via root commands
pnpm lint
```

## Conventions

- Workspaces extend configuration files from here rather than duplicating rule definitions
- Prettier and ESLint rules keep strict formatting consistent across all packages

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
