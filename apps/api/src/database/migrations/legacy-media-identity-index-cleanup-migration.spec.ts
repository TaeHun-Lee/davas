import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { DropLegacyMediaIdentityIndex1720671100000 } from './1720671100000-DropLegacyMediaIdentityIndex';

describe('legacy standalone media identity index cleanup migration', () => {
  it('uses catalog key columns instead of formatted index text', async () => {
    const statements: string[] = [];
    const queryRunner = {
      query: async (sql: string) => {
        statements.push(sql);
      },
    } as unknown as QueryRunner;

    const migration = new DropLegacyMediaIdentityIndex1720671100000();
    await migration.up(queryRunner);

    const sql = statements.join('\n');
    assert.match(sql, /pg_index/);
    assert.match(sql, /pg_attribute/);
    assert.match(sql, /indnkeyatts\s*=\s*2/);
    assert.match(sql, /conindid/);
    assert.match(sql, /ARRAY\['external_provider', 'external_id'\]/);
    assert.match(sql, /DROP INDEX IF EXISTS/);
    assert.doesNotMatch(sql, /pg_indexes/);
    assert.doesNotMatch(sql, /indexdef LIKE/);
  });

  it('does not recreate the incompatible two-column index on rollback', async () => {
    const statements: string[] = [];
    const queryRunner = {
      query: async (sql: string) => {
        statements.push(sql);
      },
    } as unknown as QueryRunner;

    await new DropLegacyMediaIdentityIndex1720671100000().down(queryRunner);
    assert.deepEqual(statements, []);
  });
});
