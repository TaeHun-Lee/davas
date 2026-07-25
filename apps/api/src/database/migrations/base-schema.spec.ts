import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('runs production migrations from compiled files retained in the runtime image', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };
    const dockerfile = readFileSync(join(process.cwd(), 'Dockerfile'), 'utf8');

    for (const script of ['migration:show', 'migration:run', 'migration:revert']) {
      assert.match(packageJson.scripts[script], /typeorm migration:(?:show|run|revert) -d dist\/database\/data-source\.js/);
      assert.doesNotMatch(packageJson.scripts[script], /typeorm-ts-node|src\/database/);
    }
    assert.match(dockerfile, /COPY --from=builder \/app\/apps\/api\/dist \.\/apps\/api\/dist/);
  });
});
