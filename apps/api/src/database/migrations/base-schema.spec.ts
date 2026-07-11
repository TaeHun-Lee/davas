import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { BaseSchema1720670300000 } from './1720670300000-BaseSchema';
import { HighValueFlows1720670400000 } from './1720670400000-HighValueFlows';

function queryRecorder() {
  const statements: string[] = [];
  return {
    statements,
    runner: { query: async (sql: string) => { statements.push(sql); } } as QueryRunner,
  };
}

describe('database migrations', () => {
  it('can bootstrap an empty database before applying high-value upgrades', async () => {
    const { runner, statements } = queryRecorder();
    await new BaseSchema1720670300000().up(runner);
    await new HighValueFlows1720670400000().up(runner);

    const sql = statements.join('\n');
    const usersIndex = sql.indexOf('CREATE TABLE IF NOT EXISTS "users"');
    const diariesIndex = sql.indexOf('CREATE TABLE IF NOT EXISTS "diaries"');
    const inviteIndex = sql.indexOf('CREATE TABLE IF NOT EXISTS "invite_codes"');
    assert.ok(usersIndex >= 0 && diariesIndex > usersIndex && inviteIndex > diariesIndex);
    assert.match(sql, /"visibility" varchar\(20\) NOT NULL DEFAULT 'PUBLIC'/);
    assert.match(sql, /UPDATE "diaries" SET "visibility" = 'PRIVATE' WHERE "visibility" = 'PUBLIC'/);
    assert.match(sql, /INSERT INTO "watchlist_items"[\s\S]+FROM "media_favorites"/);
    assert.match(sql, /INSERT INTO "diary_reactions"[\s\S]+FROM "diary_likes"/);
  });

  it('does not drop legacy tables when the baseline migration is reverted', async () => {
    const { runner, statements } = queryRecorder();
    await new BaseSchema1720670300000().down(runner);
    assert.deepEqual(statements, []);
  });
});
