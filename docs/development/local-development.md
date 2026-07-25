---
title: Local Development
status: active
last-verified: 2026-07-25
---

# Local Development

## Prerequisites

- Node.js 20 LTS
- npm 10+
- Docker Engine + Compose plugin
- TMDB key only when live media search is required

Install workspace dependencies once:

```bash
npm ci
```

## Option A — full Docker Compose

```bash
npm run docker:up
```

This builds and runs:

- PostgreSQL 16: `localhost:5432`
- NestJS API: <http://localhost:4000/api>
- Swagger: <http://localhost:4000/api/docs>
- Next.js Web: <http://localhost:3000>

View logs and stop:

```bash
npm run docker:logs
npm run docker:down
```

> **Data deletion:** `docker compose down -v` permanently removes the local PostgreSQL and uploads volumes. Use it only when a clean database is explicitly required.

Local Compose builds production-style images but sets `TYPEORM_SYNC=true` for disposable local development. It is not a production migration rehearsal.

## Option B — native Web/API with Docker PostgreSQL

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up -d db
npm run dev
```

Relevant environment files:

- `apps/api/.env`: DB, JWT, TMDB, API port
- `apps/web/.env.local`: `NEXT_PUBLIC_API_BASE_URL`
- `.env.production`: production Compose only; never commit it

The API serves under `/api`; uploads are exposed under `/uploads`.

## Database modes

### Fast local entity sync

The default local examples use:

```env
TYPEORM_SYNC=true
```

Use only with disposable local data.

### Migration rehearsal

Set `TYPEORM_SYNC=false`, build API artifacts, then run the compiled data source:

```bash
npm run build --workspace @davas/api
npm run migration:show --workspace @davas/api
npm run migration:run --workspace @davas/api
npm run migration:show --workspace @davas/api
```

Source-mode migration commands are available for migration development:

```bash
npm run migration:show:src --workspace @davas/api
npm run migration:run:src --workspace @davas/api
npm run migration:revert:src --workspace @davas/api
```

Do not edit an existing migration after it may have been applied. Add a new migration.

## Test and quality commands

```bash
npm run docs:check
npm test
npm run lint
npm run build
```

Targeted tests:

```bash
npm run test:shared
npm run test:api
npm run test:web
```

Full gate:

```bash
npm run verify
```

The deterministic runner in `scripts/run-tests.mjs` discovers test files before invoking Node. Do not put quoted `**` globs directly in `node --test` scripts; Node treats them as literal paths on this environment.

See [`../verification/quality-gates.md`](../verification/quality-gates.md) for proof boundaries and manual QA.

## Common failures

### API cannot connect to PostgreSQL

```bash
docker compose ps
docker compose logs db
```

Confirm `DB_HOST=localhost` for native API and `DB_HOST=db` inside Compose.

### TMDB search fails

Set `TMDB_API_KEY` in `apps/api/.env` or `.env.production`. The browser must never call TMDB directly.

### Migration command reports `ECONNREFUSED`

This is an environment precondition failure. Start PostgreSQL and verify the connection before judging the migration itself.

### Tests report no matching files

Run the project scripts rather than a quoted glob:

```bash
npm test
```

The harness resolves concrete test file paths.
