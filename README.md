# kidzone

Next.js + Hono + Drizzle + Supabase monorepo (pnpm + Turborepo).

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in values
pnpm db:generate && pnpm db:migrate
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:8787/api/health

## Modules included

- auth
- email
- jobs
- observability

## Hosting

Vercel (set the project Root Directory to `apps/web`; deploy `apps/api` as a second Vercel project).

See `AGENTS.md` for repo conventions.
