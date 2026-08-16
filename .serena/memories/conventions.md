# Conventions
- TypeScript strict mode; shared alias `@davas/shared` resolves to `packages/shared/src/index.ts`.
- Prettier: single quotes, semicolons, trailing commas.
- API feature layout: Nest module/controller/service, feature DTOs, TypeORM entities in `apps/api/src/database/entities`, migrations in `database/migrations`.
- API tests are colocated and use Node `node:test` through `tsx`; do not assume Jest globals.
- Web uses Next App Router under `apps/web/src/app`; reusable UI is grouped by feature under `src/components`; server calls live under `src/lib/api`; reusable query/state logic under `src/hooks`.
- Dynamic TMDB/user-upload image hosts intentionally use native `img`; web ESLint disables `@next/next/no-img-element` to avoid unsafe broad remote-host allowlists.
- Preserve domain ownership and permission checks; do not bypass services by directly mutating another feature’s tables.
- Keep product direction only in `docs/product/README.md`; do not add duplicate prompt/status/design documents.