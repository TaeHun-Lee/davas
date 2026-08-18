import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const serviceSource = readFileSync(
  join(process.cwd(), 'src', 'diaries', 'diaries.service.ts'),
  'utf8',
);

describe('friend diary feed query', () => {
  it('keeps the raw FRIENDS visibility predicate parentheses balanced', () => {
    const match = serviceSource.match(
      /`(diary\.visibility = 'FRIENDS' AND \([^`]+)`/,
    );
    assert.ok(match, 'friend feed visibility predicate should exist');

    let depth = 0;
    for (const character of match[1]) {
      if (character === '(') depth += 1;
      if (character === ')') depth -= 1;
      assert.ok(depth >= 0, 'predicate must not close a parenthesis too early');
    }

    assert.equal(depth, 0, 'predicate must close every opened parenthesis');
    assert.match(match[1], /EXISTS \(SELECT 1 FROM friendships/);
  });
});
