import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { AccountRecoveryAndInviteDeclines1720671500000 } from './1720671500000-AccountRecoveryAndInviteDeclines';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new AccountRecoveryAndInviteDeclines1720671500000();
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('account recovery and invite decline migration', () => {
  it('is registered right after the notification subjects', () => {
    const names = (createTypeOrmOptions().migrations as Array<new () => { name: string }>).map(
      (migration) => migration.name,
    );
    const index = names.indexOf('AccountRecoveryAndInviteDeclines1720671500000');
    assert.equal(names[index - 1], 'NotificationSubjects1720671400000');
  });

  it('only adds columns, with existing accounts on session version 0 and no code', async () => {
    const sql = await statements();
    assert.doesNotMatch(sql.up, /DROP|RENAME|ALTER COLUMN|UPDATE/);
    assert.match(sql.up, /"session_version" integer NOT NULL DEFAULT 0/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "recovery_code_hash" varchar\(100\)/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "declined_at" timestamptz/);
    assert.match(sql.up, /REFERENCES "users"\("id"\) ON DELETE SET NULL/);
    for (const column of [
      'session_version',
      'recovery_code_hash',
      'recovery_code_created_at',
      'declined_at',
      'declined_by_account_id',
    ]) {
      assert.match(sql.down, new RegExp(`DROP COLUMN IF EXISTS "${column}"`));
    }
  });
});
