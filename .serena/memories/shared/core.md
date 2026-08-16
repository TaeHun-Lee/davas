# Shared workspace
- Location: `packages/shared`; imported as `@davas/shared`.
- ESM TypeScript package exporting cross-workspace constants and literal-union types.
- Current durable contracts include media types, viewing methods, diary visibility, friendship status, reaction emoji, watchlist status/priority, app name, and legal-version constants.
- Add a contract here only when both API and web own the same wire-level meaning; avoid moving feature-internal types into shared.
- Changes require shared build/tests plus affected API and web checks; see `mem:task_completion`.