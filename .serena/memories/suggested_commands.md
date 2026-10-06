# Commands
Run from repository root unless noted.
- Install: `npm ci`
- Develop all workspaces: `npm run dev`
- Build all: `npm run build`
- Test all: `npm test`
- Lint/type-check all: `npm run lint`
- Format: `npm run format -- <explicit files>` (no directory-wide formatting); check: `npm run format:check`
- Full gate: `npm run verify`; release gate: `npm run verify:release`
- One workspace: `npm run <script> --workspace @davas/api`, `@davas/web`, or `@davas/shared`
- Docker local start/stop/logs: `npm run docker:up`, `npm run docker:down`, `npm run docker:logs`
- Source migrations: `npm run migration:show:src --workspace @davas/api`, then `migration:run:src` when approved.
- Production compiled migrations run inside the API image; follow `docs/operations.md`.
- Fast search: `rg <pattern> <path>`; files: `rg --files <path>`.
- Windows filesystem inspection: PowerShell `Get-ChildItem`, `Get-Content -Encoding utf8`.
- Git checks: `git status --short`, `git diff --check`, `git diff -- <paths>`.