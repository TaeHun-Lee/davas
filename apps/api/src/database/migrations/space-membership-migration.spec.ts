import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { SpacesMembershipInvites1720670700000 } from './1720670700000-SpacesMembershipInvites';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new SpacesMembershipInvites1720670700000();
  await migration.up({
    query: async (sql: string) => void up.push(sql),
  } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('spaces, memberships, and invites migration', () => {
  it('is additive, ordered, and registered with all three entities', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;

    const migrationNames = migrations.map((migration) => migration.name);
    assert.ok(
      migrationNames.includes('SpacesMembershipInvites1720670700000'),
    );
    assert.deepEqual(
      migrationNames.map((name) => Number(name.match(/\d+$/)?.[0])),
      migrationNames
        .map((name) => Number(name.match(/\d+$/)?.[0]))
        .sort((left, right) => left - right),
    );
    assert.ok(entities.some((entity) => entity.name === 'SpaceEntity'));
    assert.ok(
      entities.some((entity) => entity.name === 'SpaceMembershipEntity'),
    );
    assert.ok(entities.some((entity) => entity.name === 'SpaceInviteEntity'));
  });

  it('creates capacity, role/status, membership uniqueness, and hashed-token constraints', async () => {
    const sql = await statements();
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "spaces"/);
    assert.match(sql.up, /"max_members" BETWEEN 2 AND 5/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "space_memberships"/);
    assert.match(sql.up, /UNIQUE \("space_id", "account_id"\)/);
    assert.match(sql.up, /"role" IN \('OWNER', 'MEMBER'\)/);
    assert.match(sql.up, /UQ_space_active_owner/);
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "space_invites"/);
    assert.match(sql.up, /"token_hash" varchar\(64\) NOT NULL UNIQUE/);
    assert.doesNotMatch(sql.up, /"token" varchar/);
    assert.match(sql.up, /"revoked_at" timestamptz/);
    assert.match(sql.up, /"used_by_account_id" uuid/);
    assert.match(sql.down, /DROP TABLE IF EXISTS "space_invites"/);
    assert.match(sql.down, /DROP TABLE IF EXISTS "spaces"/);
  });
});
