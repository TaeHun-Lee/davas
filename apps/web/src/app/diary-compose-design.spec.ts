import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('core record compose', () => {
  it('separates source kind from media type and forwards movie, tv, and multi search', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const hook = source('hooks/useMediaSearch.ts');
    assert.match(composer, /SourceKindControl/);
    assert.match(composer, /MediaTypeControl/);
    assert.match(hook, /searchMedia\(\{ query: trimmedQuery, type/);
  });

  it('keeps a per-user session draft while allowing repeated watches as new events', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /davas:draft:\$\{id\}/);
    assert.match(composer, /sessionStorage/);
    assert.match(composer, /createWatchEvent/);
    assert.doesNotMatch(composer, /POSSIBLE_REWATCH|allowDuplicate/);
  });

  it('uses the common half-star control and explicit space participant fields', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /WatchRatingControl/);
    assert.match(composer, /spaceIds/);
    assert.match(composer, /participantAccountIds/);
    assert.match(composer, /placeText/);
  });
});
