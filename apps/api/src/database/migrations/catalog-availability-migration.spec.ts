import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { CanonicalCatalogAvailability1720670900000 } from './1720670900000-CanonicalCatalogAvailability';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new CanonicalCatalogAvailability1720670900000();
  await migration.up({
    query: async (sql: string) => void up.push(sql),
  } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('canonical catalog and availability migration', () => {
  it('is registered in additive order with catalog boundary entities', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    const migrationNames = migrations.map((migration) => migration.name);
    assert.ok(
      migrationNames.includes('CanonicalCatalogAvailability1720670900000'),
    );
    assert.deepEqual(
      migrationNames.map((name) => Number(name.match(/\d+$/)?.[0])),
      migrationNames
        .map((name) => Number(name.match(/\d+$/)?.[0]))
        .sort((left, right) => left - right),
    );
    for (const name of [
      'ExternalContentRefEntity',
      'AvailabilityObservationEntity',
    ]) {
      assert.ok(
        entities.some((entity) => entity.name === name),
        name,
      );
    }
  });

  it('prevents duplicate provider ids while preserving canonical media ids', async () => {
    const sql = await statements();
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "external_content_refs"/);
    assert.match(sql.up, /UNIQUE \("provider", "external_id"\)/);
    assert.match(sql.up, /UNIQUE \("content_id", "provider"\)/);
    assert.match(sql.up, /INSERT INTO "external_content_refs"/);
    assert.match(sql.up, /FROM "media"/);
    assert.doesNotMatch(sql.up, /DROP TABLE.*"media"/i);
  });

  it('stores timestamped regional offer observations separately from watch sources', async () => {
    const sql = await statements();
    assert.match(
      sql.up,
      /CREATE TABLE IF NOT EXISTS "availability_observations"/,
    );
    assert.match(sql.up, /"observed_at" timestamptz NOT NULL/);
    assert.match(sql.up, /"expires_at" timestamptz NOT NULL/);
    assert.match(
      sql.up,
      /'AVAILABLE', 'NO_OFFERS', 'PROVIDER_FAILURE', 'UNMAPPED'/,
    );
    assert.match(sql.up, /'STREAM', 'RENT', 'BUY', 'FREE', 'ADS', 'NONE'/);
    assert.doesNotMatch(sql.up, /watch_sources/i);
    assert.match(sql.down, /DROP TABLE IF EXISTS "availability_observations"/);
  });
});
