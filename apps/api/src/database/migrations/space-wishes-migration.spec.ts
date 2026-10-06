import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { SpaceWishesAndSubscriptions1720671300000 } from './1720671300000-SpaceWishesAndSubscriptions';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new SpaceWishesAndSubscriptions1720671300000();
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('space wishes and subscriptions migration', () => {
  it('is the newest migration and registers the wish entity', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    assert.equal(migrations.at(-1)?.name, 'SpaceWishesAndSubscriptions1720671300000');
    assert.ok(entities.some((entity) => entity.name === 'SpaceWishEntity'));
  });

  it('adds a defaulted subscription column and a one-row-per-member wish table', async () => {
    const sql = await statements();
    assert.doesNotMatch(sql.up, /DROP|RENAME|ALTER COLUMN/);
    assert.match(sql.up, /"ott_services" text\[\] NOT NULL DEFAULT '\{\}'/);
    assert.match(sql.up, /UNIQUE \("space_id", "media_id", "account_id"\)/);
    assert.match(sql.up, /REFERENCES "spaces"\("id"\) ON DELETE CASCADE/);
    assert.match(sql.down, /DROP TABLE IF EXISTS "space_wishes"/);
    assert.match(sql.down, /DROP COLUMN IF EXISTS "ott_services"/);
  });
});
