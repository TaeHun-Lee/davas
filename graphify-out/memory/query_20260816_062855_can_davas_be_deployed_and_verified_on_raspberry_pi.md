---
type: "query"
date: "2026-08-16T06:28:55.842823+00:00"
question: "Can Davas be deployed and verified on Raspberry Pi?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Raspberry Pi DuckDNS deployment", "backup.sh", "HealthController", "typeorm.config.ts"]
---

# Q: Can Davas be deployed and verified on Raspberry Pi?

## Answer

Expanded from original query via graph vocab: [raspberry, deployment, docker, compose, migrations, backup, duckdns, health]. Davas has a Raspberry Pi Docker Compose path using Caddy HTTPS, private PostgreSQL, Nest API, Next web, backup guidance, compiled TypeORM migration show-run-show ordering, and /api/health checks. Actual Raspberry Pi deployment has not yet been smoke-tested. Before rollout, replace production secrets, change the example bootstrap invite expiry dated 2026-08-01, back up database/uploads, and verify migrations on real PostgreSQL.

## Outcome

- Signal: useful

## Source Nodes

- Raspberry Pi DuckDNS deployment
- backup.sh
- HealthController
- typeorm.config.ts