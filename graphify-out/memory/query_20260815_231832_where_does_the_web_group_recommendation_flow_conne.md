---
type: "query"
date: "2026-08-15T23:18:32.477512+00:00"
question: "Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ExploreDashboard", "useExploreRecommendations", "GroupRecommendationSessionRequest", "GroupRecommendationSessionResponse", "GroupRecommendationFeedbackRequest", "GroupRecommendationConsensus", "group-recommendations.service.ts", "recommendation-strategy-analysis.md"]
---

# Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?

## Answer

ExploreDashboard and useExploreRecommendations are the current individual discovery entry points. Group session request/response, feedback, consensus, decision, rewatch, and availability contracts live in packages/shared/src/index.ts and connect through group-recommendations controller/service. Product guidance is in docs/product/planning/recommendation-strategy-analysis.md; inspect those current sources before adding the Web flow.

## Outcome

- Signal: useful

## Source Nodes

- ExploreDashboard
- useExploreRecommendations
- GroupRecommendationSessionRequest
- GroupRecommendationSessionResponse
- GroupRecommendationFeedbackRequest
- GroupRecommendationConsensus
- group-recommendations.service.ts
- recommendation-strategy-analysis.md