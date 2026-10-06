import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { LegacyTmdbImageSafety1720671000000 } from './1720671000000-LegacyTmdbImageSafety';

async function migrationSql(direction: 'up' | 'down') {
  const statements: string[] = [];
  const migration = new LegacyTmdbImageSafety1720671000000();
  await migration[direction]({
    query: async (sql: string) => {
      statements.push(sql);
    },
  } as QueryRunner);
  return statements.join('\n');
}

describe('legacy TMDB image safety migration contract', () => {
  it('nulls unsafe TMDB poster and backdrop URLs without restoring untrusted data', async () => {
    const up = await migrationSql('up');
    const down = await migrationSql('down');

    assert.match(up, /UPDATE\s+"media"/);
    assert.match(up, /"external_provider"\s*=\s*'TMDB'/);
    assert.match(up, /"poster_url"[\s\S]*THEN NULL/);
    assert.match(up, /"backdrop_url"[\s\S]*THEN NULL/);
    assert.match(up, /image\[\.\]tmdb\[\.\]org\/t\/p\//);
    assert.equal(down, '');
  });
});
