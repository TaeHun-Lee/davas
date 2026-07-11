# Raspberry Pi DuckDNS deployment

This deployment runs Davas with Docker Compose, PostgreSQL, the Nest API, the Next.js web app, and Caddy for HTTPS.

## DNS

DuckDNS should point the subdomain to the public IP of the Raspberry Pi network.

- Subdomain: `davas.duckdns.org`
- Public IP currently registered: `14.36.8.228`

On the home router, forward these ports to the Raspberry Pi:

- TCP `80` -> Raspberry Pi TCP `80`
- TCP `443` -> Raspberry Pi TCP `443`

Do not expose PostgreSQL (`5432`) or the app internals (`3000`, `4000`) to the router.

## First deploy

Install Docker and the Compose plugin on the Raspberry Pi, then run from the project root:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and replace at least:

- `POSTGRES_PASSWORD`
- `JWT_ACCESS_SECRET`
- `TMDB_API_KEY`, if media search should use TMDB

Then start the production stack:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Before the first start or each schema-changing release, back up the database and uploads, then run migrations from the API image. Never enable `TYPEORM_SYNC` in production.

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npm run migration:show
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npm run migration:run
```

`BaseSchema1720670300000` first creates missing legacy tables with additive `CREATE ... IF NOT EXISTS` statements, so a brand-new PostgreSQL volume and a synchronize-created legacy database use the same migration chain. `HighValueFlows1720670400000` then narrows legacy `PUBLIC` diaries to `PRIVATE`, copies favorites to active watchlist items, and copies likes to `HEART` reactions. Review row counts before opening the updated service.

The baseline migration intentionally has a no-op `down` because those tables may contain data that predates TypeORM migrations. Never attempt an exact rollback by dropping them; restore the matching pre-migration dump instead.

Caddy will request and renew the HTTPS certificate automatically. After the containers are healthy, open:

```text
https://davas.duckdns.org
```

## Operations

View logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

Rebuild after code changes:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Stop the stack:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Database data, Caddy certificates, and uploaded files are stored in Docker volumes.

## Backup and rollback

Take both a PostgreSQL custom-format dump and an uploads archive before migration. `deploy/backup.sh` is designed for a cron container or host job with `DATABASE_URL`, `UPLOADS_DIR`, and `BACKUP_DIR` mounted. Test restore on a separate database:

```bash
createdb davas_restore_test
pg_restore --clean --if-exists --no-owner --dbname=davas_restore_test /backups/<stamp>/davas.dump
```

For an application rollback, stop web/API traffic, run `npm run migration:revert` once, restore the matching DB dump and uploads archive, then start the previous images. Migration rollback does not make records public again; restoring the pre-migration dump is required for an exact rollback.

## Checks

From the Raspberry Pi:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl -I http://localhost
```

From another network:

```bash
curl -I https://davas.duckdns.org
curl https://davas.duckdns.org/api/health
```

If HTTPS does not issue, check that DuckDNS still points to the current public IP and that router port forwarding for `80` and `443` reaches this Raspberry Pi.
