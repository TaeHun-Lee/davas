---
type: "query"
date: "2026-08-16T05:43:26.434977+00:00"
question: "Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
contributor: "graphify"
outcome: "useful"
source_nodes: ["account-lifecycle-notification-outbox.spec.ts", "catalog-availability-migration.spec.ts", "to-be-integration.spec.ts", "spaces.service.spec.ts", "SpaceMembershipEntity"]
---

# Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture

## Answer

Expanded from the original task via graph vocab: account, lifecycle, notification, outbox, catalog, availability, migration, space, membership, watch, integration, spec. The graph identified the five affected ordering specs plus spaces.service.spec.ts and SpaceMembershipEntity; Serena then confirmed Array.toSorted TS2550/TS7006 diagnostics and the ACTIVE-literal return narrowing behind TS2322.

## Outcome

- Signal: useful

## Source Nodes

- account-lifecycle-notification-outbox.spec.ts
- catalog-availability-migration.spec.ts
- to-be-integration.spec.ts
- spaces.service.spec.ts
- SpaceMembershipEntity