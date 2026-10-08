import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { ExternalContentRefMediaType1720671600000 } from './1720671600000-ExternalContentRefMediaType';
import { RecommendationSessionDecision1720671700000 } from './1720671700000-RecommendationSessionDecision';

async function statements(migration: {
  up(queryRunner: QueryRunner): Promise<void>;
  down(queryRunner: QueryRunner): Promise<void>;
}) {
  const up: string[] = [];
  const down: string[] = [];
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('external ref media type and recommendation decision migrations', () => {
  it('are the two newest migrations, in order', () => {
    const names = (createTypeOrmOptions().migrations as Array<new () => { name: string }>).map(
      (migration) => migration.name,
    );
    assert.deepEqual(names.slice(-2), [
      'ExternalContentRefMediaType1720671600000',
      'RecommendationSessionDecision1720671700000',
    ]);
  });

  it('keys provider links by media type, filling it from the linked title first', async () => {
    const sql = await statements(new ExternalContentRefMediaType1720671600000());
    const fill = sql.up.indexOf('SET "media_type" = "media"."media_type"');
    const notNull = sql.up.indexOf('ALTER COLUMN "media_type" SET NOT NULL');
    assert.ok(fill > 0 && notNull > fill, 'backfill before NOT NULL');
    assert.match(sql.up, /DROP CONSTRAINT IF EXISTS "UQ_external_content_ref_provider_id"/);
    assert.match(sql.up, /UNIQUE \("provider", "media_type", "external_id"\)/);
    assert.doesNotMatch(sql.up, /DELETE|DROP TABLE/);
    assert.match(sql.down, /UNIQUE \("provider", "external_id"\)/);
    assert.match(sql.down, /DROP COLUMN IF EXISTS "media_type"/);
  });

  it('only adds the decided title and close time to sessions', async () => {
    const sql = await statements(new RecommendationSessionDecision1720671700000());
    assert.doesNotMatch(sql.up, /DROP|RENAME|ALTER COLUMN|UPDATE "|DELETE FROM/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "decided_exposure_id" uuid/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "closed_at" timestamptz/);
    assert.match(sql.up, /REFERENCES "recommendation_exposures"\("id"\) ON DELETE SET NULL/);
    assert.match(sql.down, /DROP COLUMN IF EXISTS "decided_exposure_id"/);
    assert.match(sql.down, /DROP COLUMN IF EXISTS "closed_at"/);
  });
});
