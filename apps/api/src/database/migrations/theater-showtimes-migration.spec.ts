import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { TheaterShowtimes1720671900000 } from './1720671900000-TheaterShowtimes';

describe('theater showtimes migration', () => {
  it('is the newest migration', () => {
    const names = (createTypeOrmOptions().migrations as Array<new () => { name: string }>).map(
      (migration) => migration.name,
    );
    assert.equal(names.at(-1), 'TheaterShowtimes1720671900000');
  });

  it('only creates its own tables, and drops them in reverse', async () => {
    const up: string[] = [];
    const down: string[] = [];
    const migration = new TheaterShowtimes1720671900000();
    await migration.up({ query: async (sql: string) => void up.push(sql) } as never as QueryRunner);
    await migration.down({
      query: async (sql: string) => void down.push(sql),
    } as never as QueryRunner);

    const created = up.flatMap((sql) => [...sql.matchAll(/CREATE TABLE IF NOT EXISTS "(\w+)"/g)]);
    assert.deepEqual(
      created.map((match) => match[1]),
      ['kobis_theaters', 'kobis_movies', 'kobis_showtimes', 'kobis_sync_runs'],
    );
    assert.doesNotMatch(up.join('\n'), /ALTER TABLE|DROP|UPDATE "|DELETE FROM/);
    assert.match(up.join('\n'), /REFERENCES "kobis_theaters" \("code"\) ON DELETE CASCADE/);
    assert.deepEqual(
      down.map((sql) => sql.match(/DROP TABLE IF EXISTS "(\w+)"/)?.[1]),
      ['kobis_sync_runs', 'kobis_showtimes', 'kobis_movies', 'kobis_theaters'],
    );
  });
});
