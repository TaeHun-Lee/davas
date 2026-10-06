import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { NotificationSubjects1720671400000 } from './1720671400000-NotificationSubjects';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new NotificationSubjects1720671400000();
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('notification subjects migration', () => {
  it('is the newest migration', () => {
    const migrations = createTypeOrmOptions().migrations as Array<new () => { name: string }>;
    assert.equal(migrations.at(-1)?.name, 'NotificationSubjects1720671400000');
  });

  it('adds a nullable title link and an unread index without touching existing rows', async () => {
    const sql = await statements();
    assert.doesNotMatch(sql.up, /DROP|RENAME|ALTER COLUMN|UPDATE/);
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "media_id" uuid/);
    assert.match(sql.up, /REFERENCES "media"\("id"\) ON DELETE CASCADE/);
    assert.match(sql.up, /WHERE "read_at" IS NULL/);
    assert.match(sql.down, /DROP COLUMN IF EXISTS "media_id"/);
  });
});
