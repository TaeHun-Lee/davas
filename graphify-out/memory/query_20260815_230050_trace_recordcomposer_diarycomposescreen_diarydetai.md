---
type: "query"
date: "2026-08-15T23:00:50.959249+00:00"
question: "Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
contributor: "graphify"
outcome: "useful"
source_nodes: ["RecordComposer()", "DiaryComposeScreen.tsx", "DiaryDetailScreen.tsx", "spaces.ts", "WatchEventsService", "SpaceWatchController"]
---

# Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers

## Answer

Expanded from original query via graph vocab: [composer, diary, record, spaces, share, participation, participant, rating, reactions, timeline, watch, rewatch]. The graph identified RecordComposer and DiaryComposeScreen as legacy compose paths, RecordDetailScreen and DiaryDetailScreen as detail paths, spaces.ts as the existing membership wrapper, and WatchEventsService plus SpaceWatchController as the implemented watch-event API for explicit shares, participant status, reactions, timeline, and comparisons.

## Outcome

- Signal: useful

## Source Nodes

- RecordComposer()
- DiaryComposeScreen.tsx
- DiaryDetailScreen.tsx
- spaces.ts
- WatchEventsService
- SpaceWatchController