import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { FEED_FRIENDS_ACCESS_PREDICATE } from './diaries.service';

const serviceSource = readFileSync(
  join(process.cwd(), 'src', 'diaries', 'diaries.service.ts'),
  'utf8',
);
const queryDtoSource = readFileSync(
  join(process.cwd(), 'src', 'diaries', 'dto', 'diary-list-query.dto.ts'),
  'utf8',
);

describe('friend diary feed query', () => {
  it('keeps the raw FRIENDS visibility predicate parentheses balanced', () => {
    let depth = 0;
    for (const character of FEED_FRIENDS_ACCESS_PREDICATE) {
      if (character === '(') depth += 1;
      if (character === ')') depth -= 1;
      assert.ok(depth >= 0, 'predicate must not close a parenthesis too early');
    }

    assert.equal(depth, 0, 'predicate must close every opened parenthesis');
    assert.match(FEED_FRIENDS_ACCESS_PREDICATE, /^diary\.visibility = 'FRIENDS' AND \(/);
    assert.match(FEED_FRIENDS_ACCESS_PREDICATE, /EXISTS \(SELECT 1 FROM friendships/);
    assert.match(serviceSource, /\.where\(FEED_FRIENDS_ACCESS_PREDICATE, \{ viewerId: userId \}\)/);
  });

  it('supports an exact media filter without changing the visibility predicate', () => {
    assert.match(queryDtoSource, /@IsOptional\(\)\s+@IsUUID\(\)\s+mediaId\?: string/);
    assert.match(serviceSource, /diary\.mediaId = :mediaId'[\s\S]*mediaId: query\.mediaId/);
  });

  it('does not reveal the complete selected-recipient list to a viewer', () => {
    assert.match(serviceSource, /diary\.userId === viewerId && diary\.visibility === 'SELECTED'/);
  });
});
