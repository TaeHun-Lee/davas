---
name: davas-core-development
description: Use when changing Davas product behavior, routes, Web/API contracts, TypeORM schema, deployment docs, tests, or Agent harness. Enforces the active core-experience source of truth, dirty-worktree preservation, progressive context loading, and Design → Work → Verify evidence.
version: 1.0.0
author: Davas
license: MIT
metadata:
  hermes:
    tags: [davas, nextjs, nestjs, typeorm, pwa, design-work-verify]
    related_skills: []
---

# Davas Core Development

## Overview

This Skill turns the Davas product source of truth into a predictable implementation workflow. It keeps the agent on the current four-route core experience, preserves legacy data without exposing legacy IA, and requires real verification before completion.

The always-on rules live in [`../../../AGENTS.md`](../../../AGENTS.md). This Skill contains the task procedure and progressively loads only the references needed for the current change.

## When to use

Use for:

- Product, IA, UX, route, or copy changes
- Record, media, friend, auth, consent, or account contracts
- Shared enums, DTOs, services, entities, and TypeORM migrations
- Next.js PWA, middleware, offline, or accessibility work
- Local development, production deployment, backup, or rollback changes
- Test runner, documentation validator, or Agent harness changes

Do not use for a question that only asks for an explanation and changes no project artifact.

## Context loader

Read in this order and stop once enough context is available.

| Change type | Required references |
| --- | --- |
| Any implementation | `AGENTS.md`, `docs/README.md` |
| Product/UX/route | `docs/product/core-experience.md` relevant section |
| API/DB/migration | Product §9 + `docs/architecture/system-overview.md` |
| Local tooling | `docs/development/local-development.md` |
| Production | `docs/operations/raspberry-pi-deployment.md` |
| Completion | `docs/verification/quality-gates.md` |
| Harness/docs structure | `docs/harness/agent-harness.md` |

Do not load every document by default. The product design is large; use its table of contents or relevant headings.

## Phase 0 — Baseline

1. Run `git status --short --branch`.
2. Identify existing modified, deleted, and untracked files that overlap the task.
3. Read current diffs for overlapping tracked files.
4. Inspect the actual route/controller/entity/config before trusting descriptive docs.
5. Record environment preconditions: dependencies, PostgreSQL, TMDB, browser/device.

**Complete when:** every pre-existing overlapping change is accounted for and no user work will be overwritten.

## Phase 1 — Design

1. Quote or reference the exact product acceptance criterion.
2. Define an observable result.
3. Declare scope boundaries.
4. Map the change across layers:
   - Shared type
   - Migration/entity
   - DTO/controller/service/access policy
   - Web API client/state/component/route
   - Tests and docs
5. Choose targeted and full verification commands.

### Core invariants

- Four primary destinations: `/`, `/records/new`, `/me`, `/friends`
- Settings is reached through the header avatar, not a fifth tab
- `MOVIE/TV` describes media; `THEATER/OTT` describes each record
- New create requires media, viewing method, watched date
- Rating and review are optional
- Default visibility is `FRIENDS`; create also allows `PRIVATE`
- Legacy `SELECTED` remains readable by persisted targets but cannot be newly created
- Filters and access control run on the server
- Lists never leak spoiler review text
- `clientRequestId` replay is idempotent; same key with different payload conflicts
- Existing migrations are immutable; new schema work is additive

**Complete when:** the criterion, scope, affected layers, and proof method are explicit.

## Phase 2 — Work

### Product and Web

- Keep `page.tsx` thin; place behavior in feature components and API clients.
- Preserve 430px shell, 360/390/430 responsive behavior, focus-visible, 44px targets, and reduced motion.
- Top-level screens use core header/nav; task screens use back header and safe fallback.
- Preserve session draft on failure/back; purge on success, explicit discard, logout, and account deletion.
- Do not reintroduce hidden legacy features into navigation or core cards.

### API and data

- Validate at DTO boundary and normalize again in service logic where required.
- Derive record title from Media; do not trust client title.
- Apply access policy before returning record existence.
- Keep cursor ordering deterministic.
- Use transactions/locks for invite consumption and account deletion where contracts require atomicity.
- Add migrations after the current registered chain; never edit old migration behavior.

### Documentation and harness

- Product rules belong in `docs/product/core-experience.md` only.
- Current code maps belong in architecture docs.
- Commands belong in development/operations/verification runbooks.
- Repeated Agent behavior belongs in this Skill.
- Mechanical checks belong in `scripts/`.
- Do not create one-time prompt, status, revalidation, or completed TODO documents.

**Complete when:** implementation and its durable docs/tests agree without unrelated changes.

## Phase 3 — Verify

### Fast targeted gate

Run the smallest relevant scope first:

```bash
npm run docs:check
npm run test:shared
npm run test:api
npm run test:web
```

Choose only scopes affected by the change, but always run docs check for documentation/harness work.

### Full deterministic gate

```bash
npm run verify
```

This runs docs, tests, lint/type-check, and build. Record exit codes and assertion counts.

Before a production release, run `npm run verify:release`. High/Critical dependency advisories block release even when code tests pass.

### Environment-bound gate

When required, additionally verify:

- PostgreSQL migration show/run/show
- Empty and legacy database paths
- Authenticated multi-user access matrix
- TMDB search with configured key
- 360/390/430 browser QA
- Android PWA install/update/offline behavior

A missing DB, key, browser, or device is `BLOCKED`, not `PASS` or product `FAIL`.

**Complete when:** every declared criterion has real evidence or an explicit blocker; historical results are not reused.

## Change map

| Requirement | Likely files |
| --- | --- |
| Shared enum/contract | `packages/shared/src/index.ts` |
| Record create/filter/access | `apps/api/src/diaries/`, `apps/web/src/components/core/`, `apps/web/src/lib/api/core.ts` |
| Media search | `apps/api/src/media/`, `apps/web/src/hooks/useMediaSearch.ts` |
| Friend requests/invites | `apps/api/src/friends/`, `apps/web/src/components/friends/` |
| Auth/signup consent | `apps/api/src/auth/`, `apps/api/src/invites/`, `apps/web/src/components/auth/` |
| Schema | `apps/api/src/database/entities/`, new migration, `typeorm.config.ts` |
| PWA | `apps/web/src/app/manifest.ts`, `public/sw.js`, `components/pwa/` |
| Deployment | `docker-compose.prod.yml`, `deploy/`, operations docs |
| Harness | `AGENTS.md`, this Skill, `scripts/`, harness/verification docs |

## Common pitfalls

1. **Using an old IA component as product evidence.** Legacy code remains intentionally. Check current routes and core components.
2. **Treating PRIVATE as the current default.** That was an older design. Current create default is FRIENDS.
3. **Reusing watched place as viewing method.** `viewingMethod` is a dedicated normalized field.
4. **Deleting legacy tables during UI cleanup.** Hide from core IA; preserve data/API until a separate migration policy exists.
5. **Blind `up -d --build` in production.** Schema releases require backup, build, migration show/run/show, then traffic.
6. **Quoted Node test globs.** Use `scripts/run-tests.mjs`, which passes concrete files.
7. **Claiming browser/DB completion from static tests.** Mark environment gates blocked until run.
8. **Writing status history into docs.** Use Git/CI artifacts; keep active docs current.
9. **Duplicating this Skill for another harness.** `AGENTS.md` points to one canonical project Skill.

## Verification checklist

- [ ] Starting dirty state recorded
- [ ] Product criterion and scope boundary identified
- [ ] Current code inspected before editing
- [ ] Shared/API/Web/migration contracts aligned where applicable
- [ ] Existing migrations left unchanged
- [ ] Relevant docs updated in the same change
- [ ] Targeted tests executed
- [ ] `npm run docs:check` passed
- [ ] Full `npm run verify` passed or exact blockers recorded
- [ ] DB/browser/device evidence recorded when required
- [ ] Created/modified/deleted files and undo steps reported
