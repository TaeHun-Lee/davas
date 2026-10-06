# Davas Agent Instructions

## Start here

For every code, documentation, migration, or deployment task:

1. Run `git status --short --branch` and preserve all existing changes.
2. Read `.agents/skills/davas-core-development/SKILL.md`.
3. Read `docs/README.md`, then only the task-specific references it maps.
4. State the Design → Work → Verify criterion before editing.

Do not create a second project instruction file such as `.hermes.md` or `CLAUDE.md`. This `AGENTS.md` is the portable harness entrypoint.

## Authority

When sources disagree, use this order:

1. Code, entities/migrations, package scripts, Compose, and Caddy for actual behavior
2. `docs/product/core-experience.md` for product scope, IA, UX, and intended contracts
3. `docs/architecture/system-overview.md` for the current code map
4. Development, operations, and verification runbooks
5. This file and the project Skill for workflow

If code and product design differ, do not silently choose one. Classify the difference as design change or implementation drift, update the relevant source of truth, and verify both in the same loop.

## Product boundary

The core value is a private, friend-based movie/drama record PWA.

Core IA:

- `/` friend records
- `/records/new` record creation
- `/me` my records
- `/friends` friend management
- `/settings` account/profile settings

Keep `Media.mediaType` (`MOVIE | TV`) separate from `Diary.viewingMethod` (`THEATER | OTT`). New records default to `FRIENDS`; new create accepts `FRIENDS | PRIVATE`; `SELECTED` exists for legacy compatibility only.

Do not expose or reintroduce public community, recommendation, popularity, watchlist, statistics, comments, reactions, notifications, person search, companion free text, place/mood/memory fields, or a separate media-detail flow into the core IA unless `docs/product/core-experience.md` is explicitly changed first. Legacy tables and APIs may remain for data compatibility.

## Change safety

The working tree can be dirty and contain untracked implementation work.

- Never run `git reset --hard`, `git checkout --`, or broad cleanup commands.
- Never overwrite or delete unrelated user changes.
- Read the full target file and its current diff before editing.
- Do not modify an existing TypeORM migration that may have run; add a new additive migration.
- Keep production `TYPEORM_SYNC=false`.
- Never commit secrets, `.env.production`, current public IPs, invite tokens, or credentials.
- Do not commit, push, deploy, or apply production migrations unless explicitly requested.

## Design → Work → Verify

### Design

- Identify the exact design section and observable acceptance criterion.
- Declare in-scope and out-of-scope behavior.
- Identify affected Web, API, shared, migration, docs, and tests.
- Choose the smallest change that proves the criterion.

### Work

- Implement only the declared scope.
- Keep route, DTO, service, entity, migration, shared type, and Web client contracts aligned.
- Put reusable Agent procedure in the project Skill, deterministic checks in `scripts/`, and durable facts in role-based docs.
- Do not create session prompts, status snapshots, or completed TODO documents under `docs/`.

### Verify

Run targeted checks first, then the full gate when the environment permits:

```bash
npm run docs:check
npm test
npm run lint
npm run build
```

Use `npm run verify` for the complete deterministic sequence. Database and browser criteria require the real PostgreSQL/browser environment described in `docs/verification/quality-gates.md`; static review is not a substitute.

## Test harness

- `npm test`: all discovered Shared/API/Web tests
- `npm run test:shared`: Shared only
- `npm run test:api`: API only
- `npm run test:web`: Web only
- `npm run docs:check`: docs, links, harness, Skill, stale-file guard
- `npm run verify`: docs → tests → lint/type → build
- `npm run verify:release`: full gate + production dependency audit

Do not place quoted `**` globs directly in `node --test` scripts. `scripts/run-tests.mjs` resolves concrete test files.

## Documentation rules

- `docs/product`: one active product source of truth
- `docs/architecture`: current structure and invariants
- `docs/development`: local workflows
- `docs/operations`: production runbooks
- `docs/verification`: completion gates and evidence
- `docs/harness`: Agent context and automation design

Update `docs/README.md` when adding, moving, or deleting a document. Keep one fact in one source. Git/PR/CI retains history; active docs must describe the current system.

## Completion report

Every final report must include:

- Done / In Progress / Blocked status
- Created / modified / deleted files
- Exact artifact paths
- Commands run, exit codes, and what they proved
- Remaining runtime or environment blockers
- Exact undo guidance for files changed in the task

Do not claim completion when a required gate is skipped, blocked, or failed.
