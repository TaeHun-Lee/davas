#!/bin/sh
set -eu
umask 077
stamp="$(date +%Y%m%d-%H%M%S)"
root="${BACKUP_DIR:-/backups}"
mkdir -p "$root/$stamp"
pg_dump --format=custom --no-owner --file="$root/$stamp/davas.dump" "${DATABASE_URL:?DATABASE_URL is required}"
tar -czf "$root/$stamp/uploads.tar.gz" -C "${UPLOADS_DIR:-/uploads}" .
find "$root" -mindepth 1 -maxdepth 1 -type d -mtime +"${BACKUP_RETENTION_DAYS:-14}" -exec rm -rf {} \;
echo "$root/$stamp"
