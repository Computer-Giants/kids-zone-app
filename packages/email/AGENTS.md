# Email Package

## Overview

Transactional email templates and delivery using React Email and Resend. Sends notices, parent communications, and account alerts.

## Key files

| File                        | Owns                                                    |
| --------------------------- | ------------------------------------------------------- |
| `src/index.ts`              | Resend client singleton and `sendEmail` helper function |
| `src/templates/welcome.tsx` | Welcome email React component template                  |

## Commands

```bash
# Preview templates locally in the browser
pnpm preview

# Run TypeScript checks
pnpm typecheck
```

## Conventions

- Build email layouts with React Email components
- Communications sent to families address parents; children do not have emails
- Secrets `RESEND_API_KEY` and `EMAIL_FROM` must be defined in the environment

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
