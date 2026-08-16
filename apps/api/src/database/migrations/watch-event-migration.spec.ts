import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { WatchEventsAndPersonalReactions1720670800000 } from './1720670800000-WatchEventsAndPersonalReactions';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new WatchEventsAndPersonalReactions1720670800000();
  await migration.up({
    query: async (sql: string) => void up.push(sql),
  } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('watch event and personal reaction migration', () => {
  it('is registered in additive order with every new entity', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    const migrationNames = migrations.map((migration) => migration.name);
    assert.ok(
      migrationNames.includes('WatchEventsAndPersonalReactions1720670800000'),
    );
    assert.deepEqual(
      migrationNames.map((name) => Number(name.match(/\d+$/)?.[0])),
      migrationNames
        .map((name) => Number(name.match(/\d+$/)?.[0]))
        .sort((left, right) => left - right),
    );
    for (const name of [
      'WatchParticipantEntity',
      'WatchReactionEntity',
      'WatchSourceEntity',
      'WatchShareEntity',
    ]) {
      assert.ok(
        entities.some((entity) => entity.name === name),
        name,
      );
    }
  });

  it('separates shares, participant state, personal ratings/reviews, and watch-time source', async () => {
    const sql = await statements();
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "watch_event_shares"/);
    assert.match(sql.up, /UNIQUE \("diary_id", "space_id"\)/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "watch_participants"/);
    assert.match(sql.up, /'PENDING', 'CONFIRMED', 'DECLINED'/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "watch_reactions"/);
    assert.match(sql.up, /"rating_scale" BETWEEN 1 AND 10/);
    assert.match(sql.up, /"review_text" text/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "watch_sources"/);
    assert.match(sql.up, /'THEATER', 'OTT', 'TV_OWNED', 'OTHER'/);
    assert.doesNotMatch(sql.up, /availability/i);
  });

  it('backfills legacy author participation and reaction without rewriting FRIENDS or SELECTED', async () => {
    const sql = await statements();
    assert.match(sql.up, /INSERT INTO "watch_participants"/);
    assert.match(sql.up, /SELECT "id", "user_id", 'CONFIRMED'/);
    assert.match(sql.up, /INSERT INTO "watch_reactions"/);
    assert.match(sql.up, /ROUND\("rating" \* 2\) BETWEEN 1 AND 10/);
    assert.match(sql.up, /THEN ROUND\("rating" \* 2\)::smallint\s+ELSE NULL/);
    assert.doesNotMatch(sql.up, /UPDATE "diaries" SET "visibility"/);
    assert.match(sql.down, /DROP TABLE IF EXISTS "watch_event_shares"/);
  });
});
