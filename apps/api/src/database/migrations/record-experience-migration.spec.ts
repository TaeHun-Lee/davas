import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { RecordExperience1720671200000 } from './1720671200000-RecordExperience';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new RecordExperience1720671200000();
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('record experience migration', () => {
  it('is registered after the earlier migrations and registers the photo and like entities', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    assert.equal(
      migrations.findIndex((migration) => migration.name === 'RecordExperience1720671200000'),
      14,
    );
    for (const name of ['WatchPhotoEntity', 'WatchReviewLikeEntity']) {
      assert.ok(
        entities.some((entity) => entity.name === name),
        name,
      );
    }
  });

  it('only adds columns and tables, with defaults that keep existing rows valid', async () => {
    const sql = await statements();
    assert.doesNotMatch(sql.up, /DROP|RENAME|ALTER COLUMN/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "is_blind" boolean NOT NULL DEFAULT false/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "headline" varchar\(40\)/);
    assert.match(sql.up, /"theater_format" IN \('STANDARD', 'IMAX', 'FOUR_DX', 'DOLBY'\)/);
    assert.match(sql.up, /"episode_watched" <= "episode_total"/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "watch_photos"/);
    assert.match(sql.up, /"position" BETWEEN 0 AND 9/);
    assert.match(
      sql.up,
      /FOREIGN KEY \("diary_id"\) REFERENCES "diaries"\("id"\) ON DELETE CASCADE/,
    );
    assert.match(sql.up, /UNIQUE \("watch_reaction_id", "account_id"\)/);
    // Constraint creation is wrapped so a rerun does not fail on an existing constraint.
    assert.match(sql.up, /EXCEPTION WHEN duplicate_object THEN NULL/);
  });

  it('can be reverted in reverse order', async () => {
    const sql = await statements();
    assert.ok(
      sql.down.indexOf('DROP TABLE IF EXISTS "watch_review_likes"') <
        sql.down.indexOf('DROP TABLE IF EXISTS "watch_photos"'),
    );
    assert.match(sql.down, /DROP COLUMN IF EXISTS "is_blind"/);
  });
});
