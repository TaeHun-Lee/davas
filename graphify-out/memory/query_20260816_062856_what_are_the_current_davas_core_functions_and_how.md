---
type: "query"
date: "2026-08-16T06:28:56.092270+00:00"
question: "What are the current Davas core functions and how are they delivered?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["WatchEventsService", "SpaceMembershipEntity", "GroupRecommendationSessionRequest", "NotificationsService", "RecordScreens.tsx"]
---

# Q: What are the current Davas core functions and how are they delivered?

## Answer

Expanded from original query via graph vocab: [spaces, watch, events, reactions, recommendations, catalog, availability, friends, records, account, notifications, outbox]. Davas is a private small-group movie and drama viewing journal: repeat watch events, participant confirmation, personal reactions, explicit sharing into 2-5 member spaces, space timelines/reaction comparison, and privacy-preserving group recommendations. Next.js/PWA calls a NestJS modular-monolith REST API backed by PostgreSQL/TypeORM, with TMDB catalog/availability adapters and account/notification/outbox persistence. External availability quality, outbox delivery workers, and some account/operations automation remain partial.

## Outcome

- Signal: useful

## Source Nodes

- WatchEventsService
- SpaceMembershipEntity
- GroupRecommendationSessionRequest
- NotificationsService
- RecordScreens.tsx