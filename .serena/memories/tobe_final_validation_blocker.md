# Davas TO-BE final validation blocker

Recorded: 2026-08-16 Asia/Seoul.

## Run
- Run ID: run_d91a02f14e72
- Original Tasks 1-9: all completed.
- Final coordinator validation began after Graphify/Serena docs-source audit.

## Confirmed audit
- Graphify paths connect WatchEventsService -> SpaceAccessService, GroupRecommendationsService -> SpaceAccessService, and WatchEventsService -> TransactionOutboxService.
- Planning docs were reread in full.
- docs/product/implementation-coverage.md has one broken local link: ../../apps/api/src/media/adapters/tmdb.adapter.ts; actual metadata adapter is apps/api/src/media/adapters/tmdb-metadata.adapter.ts.
- git diff --check succeeded with only LF/CRLF warnings.

## Full test failure
Root npm run test failed.
- API: apps/api/src/diaries/diaries.dashboard.spec.ts has 2 failures:
  - loads the dashboard from persisted diary and media rows instead of mock fixtures
  - stores the selected media representative poster on the server before showing diary thumbnails
- Web: apps/web/src/app/community-design.spec.ts has 1 failure because RecordScreens.tsx now delegates RecordDetailScreen to WatchEventDetailScreen while the old test searches RecordScreens.tsx directly for RECORD_NOT_FOUND.
- API total at failure: 180/182 passing. Web failure followed in root output.
- Full lint/build were not run because test must be repaired first.

## Correction tasks
- Task A task_1d79993a890b, dispatch ctx_b30b41a3e86c, terminal term_32c599b1-c9a8-412a-8728-a6b457fc28ba.
- Task B task_e2197a2396ed, dispatch ctx_8f91dfca82d4, terminal term_8e86f5fd-54fa-4636-986a-d6ffe15ebb0e.
- Task C task_dd1185ed2903 is ready for the coverage-link correction after A/B.

## Blocker
Both A/B worker-start calls returned ready/input_accepted and exact owned connected terminals, but for 60 minutes worker-read remained source=terminal, fallbackReason=session_not_reported, with the prompt only visible as [Pasted Content ...] after MCP startup interruption. No worker_done, escalation, or question message arrived. Current installed orchestration guidance says a ready worker must be waited/read and must not be stopped/released/restarted merely due timeout or TUI idle. Therefore they were intentionally left owned and active; no manual prompt injection or terminal manipulation was performed.

## Safe resume
1. Reload current orchestration skill and bind/check run_d91a02f14e72.
2. Inspect both exact dispatches with worker-show and worker-read.
3. If Orca now proves failed/stopped, use worker-start replacement with --retry-of and explicit current worktree + agent. If still ready/running, follow current recovery guidance; do not manually inject or close.
4. Process valid worker_done FIFO: judge result, reuse/release before Delivery ack.
5. After A/B complete, run Task C (prefer immediate reuse of the second settled exact worker if lifecycle allows).
6. Then rerun root npm run test, npm run lint, npm run build. Any code failure becomes a new delegated A-D-I-V correction task.
7. Run final docs/source audit, local-link check, git diff --check, and Graphify update if source/docs changed.
