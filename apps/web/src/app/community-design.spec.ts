import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('Davas private friend records IA', () => {
  it('uses root for friend records and redirects legacy public community routes', () => {
    assert.match(source('app/page.tsx'), /FeedScreen/);
    assert.match(source('app/feed/page.tsx'), /redirect\('\/'\)/);
    assert.match(source('app/community/page.tsx'), /redirect\('\/'\)/);
  });

  it('keeps public-SNS features out of the active record screens', () => {
    const core = [
      source('components/core/RecordListScreens.tsx'),
      source('components/core/RecordDetailScreen.tsx'),
    ].join('\n');
    assert.doesNotMatch(core, /CommunityComments|Reaction|Popular|followCommunity|likeCommunity/);
    assert.match(core, /RECORD_NOT_FOUND/);
  });
});
