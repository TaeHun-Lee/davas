import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { AccountLifecycleNotificationOutbox1720671000000 } from './1720671000000-AccountLifecycleNotificationOutbox';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new AccountLifecycleNotificationOutbox1720671000000();
  await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
  await migration.down({ query: async (sql: string) => void down.push(sql) } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('account lifecycle, notification preference, and outbox migration', () => {
  it('is registered in additive order with the new entities', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    const migrationNames = migrations.map((migration) => migration.name);
    assert.ok(
      migrationNames.includes('AccountLifecycleNotificationOutbox1720671000000'),
    );
    assert.deepEqual(
      migrationNames.map((name) => Number(name.match(/\d+$/)?.[0])),
      migrationNames
        .map((name) => Number(name.match(/\d+$/)?.[0]))
        .sort((left, right) => left - right),
    );
    for (const name of [
      'NotificationPreferenceEntity',
      'TransactionOutboxEntity',
    ]) {
      assert.ok(entities.some((entity) => entity.name === name), name);
    }
  });

  it('adds a recoverable account state without removing existing user data', async () => {
    const sql = await statements();
    assert.match(sql.up, /ADD COLUMN IF NOT EXISTS "status"/);
    assert.match(sql.up, /'ACTIVE', 'DELETION_PENDING', 'DELETED'/);
    assert.match(sql.up, /"deletion_requested_at" timestamptz/);
    assert.match(sql.up, /"deletion_scheduled_for" timestamptz/);
    assert.doesNotMatch(sql.up, /DROP TABLE.*"users"/i);
  });

  it('protects required preferences and notification/outbox idempotency', async () => {
    const sql = await statements();
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "notification_preferences"/);
    assert.match(sql.up, /"category" NOT IN \('SPACE_INVITE', 'WATCH_PARTICIPATION'\)/);
    assert.match(sql.up, /"idempotency_key" varchar\(180\)/);
    assert.match(sql.up, /UQ_notification_idempotency_key/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "transaction_outbox"/);
    assert.match(sql.up, /UQ_transaction_outbox_idempotency/);
    assert.match(sql.up, /"payload" jsonb NOT NULL/);
  });
});
