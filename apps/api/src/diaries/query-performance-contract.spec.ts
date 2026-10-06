import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { MigrationInterface, QueryRunner } from 'typeorm';
import { CoreQueryIndexes1720670800000 } from '../database/migrations/1720670800000-CoreQueryIndexes';
import { FeedIndexSharedAtPredicate1720670900000 } from '../database/migrations/1720670900000-FeedIndexSharedAtPredicate';
import { FEED_FRIENDS_ACCESS_PREDICATE } from './diaries.service';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

async function migrationSql(migration: MigrationInterface, direction: 'up' | 'down' = 'up') {
  const statements: string[] = [];
  await migration[direction]({
    query: async (sql: string) => {
      statements.push(sql);
    },
  } as QueryRunner);
  return statements.join('\n');
}

describe('measured core query performance contract', () => {
  it('keeps the already-applied core query index migration immutable', async () => {
    const sql = await migrationSql(new CoreQueryIndexes1720670800000());
    assert.match(sql, /IDX_friendship_requester_receiver_status/);
    assert.match(sql, /IDX_friendship_receiver_requester_status/);
    assert.match(sql, /IDX_diary_visible_feed_cursor/);
    assert.match(sql, /NULLS LAST/);
    assert.doesNotMatch(sql, /["']?shared_at["']?\s+IS NOT NULL/);
    assert.doesNotMatch(sql, /IDX_diary_share_user_diary/);
  });

  it('adds the non-null feed predicate in a new reversible migration', async () => {
    const migration = new FeedIndexSharedAtPredicate1720670900000();
    const up = await migrationSql(migration);
    const down = await migrationSql(migration, 'down');

    assert.match(up, /DROP INDEX IF EXISTS "IDX_diary_visible_feed_cursor"/);
    assert.match(up, /["']?shared_at["']?\s+IS NOT NULL/);
    assert.match(up, /NULLS LAST/);
    assert.match(down, /DROP INDEX IF EXISTS "IDX_diary_visible_feed_cursor"/);
    assert.doesNotMatch(down, /["']?shared_at["']?\s+IS NOT NULL/);
  });

  it('keeps the friend-feed access SQL predicate structurally balanced', () => {
    const opening = [...FEED_FRIENDS_ACCESS_PREDICATE].filter(
      (character) => character === '(',
    ).length;
    const closing = [...FEED_FRIENDS_ACCESS_PREDICATE].filter(
      (character) => character === ')',
    ).length;
    assert.equal(closing, opening);
    assert.match(FEED_FRIENDS_ACCESS_PREDICATE, /OR EXISTS \(SELECT 1 FROM friendships/);
  });

  it('keeps TypeORM joined pagination SQL valid while excluding unshared rows', () => {
    const code = source('diaries/diaries.service.ts');
    assert.match(code, /andWhere\('diary\.sharedAt IS NOT NULL'\)/);
    assert.match(code, /orderBy\('diary\.sharedAt',\s*'DESC'\)/);
    assert.doesNotMatch(code, /orderBy\('diary\.sharedAt',\s*'DESC',/);
  });
});
