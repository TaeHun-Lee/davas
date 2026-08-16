---
type: "query"
date: "2026-08-15T23:36:10.553863+00:00"
question: "Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
contributor: "graphify"
outcome: "useful"
source_nodes: ["app.module.ts", "typeorm.config.ts", "entities/index.ts", "SpacesModule", "DiariesModule", "MediaModule", "RecommendationsModule", "NotificationsModule", "WatchEventsService", "DiaryAccessService"]
---

# Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.

## Answer

Expanded via graph vocab: app, module, typeorm, migration, shared, space, audience, watch, availability, reaction, outbox, notification. The graph connects app.module.ts, typeorm.config.ts, entities/index.ts, Spaces/Diaries/Media/Recommendations/Notifications modules, WatchEventsService, DiaryAccessService, GroupRecommendationsService, TransactionOutboxService, and the new domain entities; current source and tests remain authoritative for registration, access enforcement, event payloads, and migration constraints.

## Outcome

- Signal: useful

## Source Nodes

- app.module.ts
- typeorm.config.ts
- entities/index.ts
- SpacesModule
- DiariesModule
- MediaModule
- RecommendationsModule
- NotificationsModule
- WatchEventsService
- DiaryAccessService
- GroupRecommendationsService
- TransactionOutboxService