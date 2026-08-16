# Davas Repository Instructions

## Scope

- This file applies to the entire repository.
- Keep shared rules here. Add a nested `AGENTS.md` only when a subtree has durable, genuinely different requirements; do not duplicate this file.
- Preserve unrelated user changes and existing dirty files.

## Repository Map

- This is an npm-workspaces monorepo. Use npm and the committed `package-lock.json`; do not switch package managers.
- `apps/api`: NestJS API, TypeORM, PostgreSQL, migrations, and API tests.
- `apps/web`: Next.js and React web/PWA application.
- `packages/shared`: TypeScript contracts shared by API and web.
- `deploy` and the Compose files: production and self-hosting configuration.

## Graphify

- Treat the currently installed Graphify skill as the source of truth for Graphify workflows, query preparation, CLI syntax, and recovery guidance.
- When the user invokes `/graphify`, follow the installed Graphify skill before doing anything else.
- Use Graphify first for repository-wide architecture, subsystem, cross-file relationship, documentation, ADR, SQL, and configuration questions.
- When `graphify-out/graph.json` exists, use the skill's query workflow. Use `graphify path` for relationships and `graphify explain` for a focused concept.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation. Read `graphify-out/GRAPH_REPORT.md` only for broad architecture reviews or when scoped queries are insufficient.
- Dirty `graphify-out/` files are expected after hooks, queries, or incremental updates. Do not discard them merely because they are dirty.
- Skip Graphify only when the task concerns stale or incorrect graph output, or the user explicitly asks not to use it.
- After modifying source code and running focused checks, run `graphify update .`. Follow the installed skill's recovery guidance if an intentional deletion or refactor triggers a shrink guard; do not force or rebuild blindly.

## Code Intelligence Routing

- Use Serena first for exact symbol definitions, references, implementations, symbol-level edits, and refactoring.
- Before Serena symbolic work, follow Serena's current `initial_instructions` and activate the `davas` project if it is not already active.
- Use ordinary file tools for documentation, configuration, generated-file inspection, and small line-local edits that are not symbol-level operations.
- Do not call Graphify and Serena for the same question by default. When Graphify identifies candidate files or symbols, use Serena only to inspect or verify those candidates.
- Use Graphify and Serena for discovery, but inspect the current relevant source before editing. Current source code, compiler diagnostics, tests, and lint results are authoritative.

## Editing Boundaries

- Do not edit generated or dependency output such as `node_modules/`, `dist/`, `.next/`, `coverage/`, or `apps/web/next-env.d.ts`.
- Do not manually edit Graphify caches or derived graph files; use the Graphify workflow that owns them.
- Never commit `.env` files, credentials, tokens, production secrets, or local deployment archives. Update the appropriate `.env.example` file when the public configuration contract changes.
- Keep reusable API/web contracts in `packages/shared`. When a shared export changes, build the shared package and validate affected consumers.

## Database and Deployment Safety

- Represent TypeORM schema changes with a migration and add or update focused migration tests.
- Never enable `TYPEORM_SYNC` in production or use schema synchronization as a recovery shortcut.
- Do not run production deployment, migration, rollback, volume-removal, or database-mutating commands merely to validate a code change.
- Before an explicitly requested production migration or rollback, follow `docs/deployment/raspberry-pi-duckdns.md`: back up the database and uploads, inspect migration state, and use the documented restore procedure for exact rollback.
- Do not expose PostgreSQL or internal app ports publicly.

## Validation

- Run the narrowest relevant checks first. Do not run every workspace test for a documentation-only change.
- API: `npm run test --workspace @davas/api`, `npm run lint --workspace @davas/api`, and `npm run build --workspace @davas/api` as relevant.
- Web: `npm run test --workspace @davas/web`, `npm run lint --workspace @davas/web`, and `npm run build --workspace @davas/web` as relevant.
- Shared: `npm run test --workspace @davas/shared` and `npm run build --workspace @davas/shared` as relevant.
- For cross-workspace changes, use the root `npm run test`, `npm run lint`, and `npm run build` scripts as appropriate.
- After editing, inspect the resulting git diff and report which checks were run, including any failures or checks intentionally skipped.
