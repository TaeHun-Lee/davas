# Task completion
For code changes, run the smallest relevant checks first, then repository-level checks when shared contracts or multiple workspaces changed.
- API-only: `npm run lint --workspace @davas/api`, `npm test --workspace @davas/api`, `npm run build --workspace @davas/api`.
- Web-only: `npm run lint --workspace @davas/web`, `npm test --workspace @davas/web`, `npm run build --workspace @davas/web`.
- Shared package: `npm test --workspace @davas/shared`, `npm run build --workspace @davas/shared`, then affected API/Web checks.
- Cross-workspace/default: `npm run lint`, `npm test`, `npm run build`.
- Schema changes: add/verify a migration; run migration-focused tests and `migration:show:src`.
- Always inspect `git diff --check`, focused diff, and `git status --short`; preserve unrelated user changes.
- After source-code edits run `graphify update .`.
- Docs-only changes: validate relative links/format and `git diff --check`; application build/tests are unnecessary unless docs changed executable commands or generated contracts.