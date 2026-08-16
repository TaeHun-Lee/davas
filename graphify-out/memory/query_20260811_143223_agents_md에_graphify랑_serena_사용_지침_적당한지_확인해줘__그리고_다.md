---
type: "query"
date: "2026-08-11T14:32:23.674737+00:00"
question: "AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
contributor: "graphify"
outcome: "useful"
source_nodes: ["api/package.json", "web/package.json", "shared/package.json"]
---

# Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘

## Answer

Expanded from original query via graph vocab: [nestjs, react, next, typeorm, test, lint, shared, migration, web, api]. The graph confirmed three workspace boundaries: api/package.json, web/package.json, and shared/package.json. Policy text itself is excluded from the graph and was verified directly. The root routing has a precedence conflict: broad codebase questions route to Graphify while exact-symbol and edit tasks route to Serena; narrow the Graphify rule to repository-wide questions and reserve Serena for symbol-level work. Nested AGENTS files are optional; apps/api and deploy have the strongest case because migrations and production safety need local rules, while apps/web is useful only for real UI-specific conventions and packages/shared is currently too small.

## Outcome

- Signal: useful

## Source Nodes

- api/package.json
- web/package.json
- shared/package.json