---
title: Raspberry Pi Production Deployment
status: active
last-verified: 2026-07-25
---

# Raspberry Pi Production Deployment

Davas production runs PostgreSQL, NestJS API, Next.js Web, and Caddy with Docker Compose. Caddy terminates HTTPS and routes `/api/*` and `/uploads/*` to API; all other requests go to Web.

## Host baseline

- Raspberry Pi OS 64-bit
- Stable power and wired LAN
- SSD-backed Docker data preferred over microSD-only storage
- SSH key authentication
- Docker Engine and Compose plugin
- External backup destination not stored on the same physical device

## DNS and router

Set `DOMAIN` to the DuckDNS hostname and keep DuckDNS pointed at the current public IP. Do not store the current public IP in repository docs.

Forward only:

- TCP `80` → Raspberry Pi `80`
- TCP `443` → Raspberry Pi `443`

Do not expose PostgreSQL `5432`, API `4000`, or Web `3000` on the public router.

## First-time configuration

```bash
cp .env.production.example .env.production
```

Set at minimum:

- `DOMAIN`
- `NEXT_PUBLIC_API_BASE_URL=https://<domain>/api`
- `POSTGRES_PASSWORD`
- `JWT_ACCESS_SECRET`
- `DAVAS_BOOTSTRAP_INVITE_CODE` for the first account only
- `TMDB_API_KEY` when live media search is required

Keep:

```env
TYPEORM_SYNC=false
COOKIE_SECURE=true
```

Remove the bootstrap invite values after the first invite is consumed.

## Safe release procedure

### 1. Backup before every schema-changing release

Take both a PostgreSQL custom-format dump and an uploads archive. Production Compose does not publish PostgreSQL `5432` to the host, so run the dump through the `db` service.

```bash
stamp="$(date +%Y%m%d-%H%M%S)"
mkdir -p "backups/$stamp"

docker compose --env-file .env.production -f docker-compose.prod.yml \
  exec -T db sh -c 'pg_dump --format=custom --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  > "backups/$stamp/davas.dump"

docker compose --env-file .env.production -f docker-compose.prod.yml \
  run --rm --no-deps -v "$PWD/backups/$stamp:/backup" api \
  sh -c 'tar -czf /backup/uploads.tar.gz -C /app/uploads .'
```

Copy `backups/$stamp` to storage outside the Raspberry Pi. Confirm that the destination contains non-empty `davas.dump` and `uploads.tar.gz` before proceeding.

`deploy/backup.sh` is for a scheduled helper/container where `DATABASE_URL` is reachable and the uploads volume is mounted at `UPLOADS_DIR` (default `/uploads`). It cannot connect through `127.0.0.1:5432` from the host unless PostgreSQL is deliberately published, which production Compose does not do.

### 2. Build without opening new application traffic

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d db
docker compose --env-file .env.production -f docker-compose.prod.yml build api web
```

### 3. Inspect and run compiled migrations

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npm run migration:show
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npm run migration:run
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npm run migration:show
```

`migration:show` must report no pending migrations before traffic opens.

Current chain:

1. `BaseSchema1720670300000`
2. `HighValueFlows1720670400000`
3. `CoreRecordContract1720670500000`
4. `FriendInvitesAndConsents1720670600000`

`BaseSchema` is additive and intentionally has a no-op `down` because its tables may predate migration tracking. Never use `TYPEORM_SYNC=true` as a production recovery shortcut.

### 4. Open traffic

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

Caddy requests and renews the HTTPS certificate automatically.

## Post-release verification

From the host:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl -I http://localhost
```

From another network:

```bash
curl -I https://<domain>
curl https://<domain>/api/health
```

Verify read-only flows before creating data:

1. `/login` and `/signup`
2. `/` friend records
3. `/records/new` media search entry
4. `/me`
5. `/friends`
6. `/settings`
7. `/manifest.webmanifest`, `/sw.js`, `/offline`

For schema releases, inspect API logs for `column ... does not exist` or `relation ... does not exist`. Those errors mean application code is running against a pre-migration schema.

## Operations

Logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

Code-only rebuild still follows the same build→health check sequence. If a release may contain schema changes, never use a blind `up -d --build` that skips the migration gate.

Stop services without deleting volumes:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

## Restore test

Restore backups regularly into a separate database:

```bash
createdb davas_restore_test
pg_restore --clean --if-exists --no-owner \
  --dbname=davas_restore_test \
  /backups/<stamp>/davas.dump
```

Also extract `uploads.tar.gz` into a temporary directory and verify representative files.

## Rollback

Choose one strategy before deployment.

### Exact rollback — recommended

1. Stop Caddy/Web/API traffic.
2. Restore the matching pre-release database dump and uploads archive.
3. Start the previous application images.
4. Run health and read-only flow checks.

This is the only exact rollback for migrations that transform legacy data.

### Migration revert — only for a reviewed single migration

Use `migration:revert` only when the exact migration's `down` behavior has been reviewed and no data transformation must be recovered. Do not assume “revert once” handles a release containing multiple migrations. Never revert `BaseSchema` expecting it to drop legacy tables.

## Security and attribution

- Secrets live only in `.env.production`; never commit them.
- Keep PostgreSQL and internal app ports off the public router.
- Back up DB and uploads together.
- Keep OS, Docker images, Next.js, NestJS, and upload dependencies patched.
- Davas uses the TMDB API but is not endorsed or certified by TMDB.
