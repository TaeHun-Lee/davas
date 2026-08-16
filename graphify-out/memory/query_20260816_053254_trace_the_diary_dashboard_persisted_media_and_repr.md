---
type: "query"
date: "2026-08-16T05:32:54.553476+00:00"
question: "Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DiariesDashboardService", "diaries.module.ts", "diaries.dashboard.spec.ts", ".saveRepresentativePoster()", "MediaEntity"]
---

# Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes

## Answer

Expanded from original query via graph vocab: [diaries, diary, dashboard, media, poster, representative, selected, selection, watch, watched, image, catalog]. Graphify located DiariesDashboardService, its saveRepresentativePoster and getDashboard paths, diaries.module.ts, diaries.dashboard.spec.ts, and MediaEntity; focused execution showed the behavior still passed and both failures came from a source-text regex that required the TypeOrmModule.forFeature array to stay on one line after watch entities were added.

## Outcome

- Signal: useful

## Source Nodes

- DiariesDashboardService
- diaries.module.ts
- diaries.dashboard.spec.ts
- .saveRepresentativePoster()
- MediaEntity