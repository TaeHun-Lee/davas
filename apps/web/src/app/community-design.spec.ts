import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const src = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('Davas private friend records IA', () => {
  it('uses root for friend records and redirects legacy public community routes', () => {
    assert.match(src('app/page.tsx'), /FeedScreen/);
    assert.match(src('app/feed/page.tsx'), /redirect\('\/'\)/);
    assert.match(src('app/community/page.tsx'), /redirect\('\/'\)/);
  });

  it('keeps the private detail contract through the watch-event delegation', () => {
    const recordScreens = src('components/core/RecordScreens.tsx');
    const watchEventDetail = src(
      'components/core/WatchEventDetailScreen.tsx',
    );
    const activeDetail = `${recordScreens}\n${watchEventDetail}`;

    assert.doesNotMatch(
      activeDetail,
      /CommunityComments|Popular|followCommunity|likeCommunity/,
    );
    assert.match(
      recordScreens,
      /return <WatchEventDetailScreen id=\{id\} \/>/,
    );
    assert.match(watchEventDetail, /getWatchEvent\(id\)/);
    assert.match(
      watchEventDetail,
      /error instanceof CoreApiError && error\.status === 404/,
    );
    assert.match(watchEventDetail, /if \(status === 'missing'\)/);
    assert.match(watchEventDetail, /감상을 찾을 수 없어요/);
  });
});
