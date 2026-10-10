import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { MediaTmdbPopularity1720671800000 } from './1720671800000-MediaTmdbPopularity';

describe('media TMDB popularity migration', () => {
  it('is registered', () => {
    const names = (createTypeOrmOptions().migrations as Array<new () => { name: string }>).map(
      (migration) => migration.name,
    );
    assert.ok(names.includes('MediaTmdbPopularity1720671800000'));
  });

  it('only adds a nullable popularity column', async () => {
    const up: string[] = [];
    const down: string[] = [];
    const migration = new MediaTmdbPopularity1720671800000();
    await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
    await migration.down({
      query: async (sql: string) => void down.push(sql),
    } as never as QueryRunner);
    assert.equal(up.length, 1);
    assert.match(up[0], /ADD COLUMN IF NOT EXISTS "tmdb_popularity" double precision$/);
    assert.doesNotMatch(up.join('\n'), /NOT NULL|DROP|UPDATE "|DELETE FROM/);
    assert.match(down.join('\n'), /DROP COLUMN IF EXISTS "tmdb_popularity"/);
  });
});
