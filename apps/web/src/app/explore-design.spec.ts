import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('explore flow contract', () => {
  it('serves 탐색 as a core tab: title search, what is popular and moods', () => {
    const page = source('app/explore/page.tsx');
    const screen = source('components/core/ExploreScreen.tsx');
    const middleware = source('middleware.ts');
    assert.match(page, /<ExploreScreen \/>/);
    assert.match(screen, /<CoreAppShell>/);
    assert.match(screen, /useMediaSearch\(query, 'multi'\)/);
    assert.match(screen, /getTrendingRecommendations\(\{ limit: 20 \}\)/);
    assert.match(screen, /getGenreRecommendations\(mood, \{ limit: 8 \}\)/);
    for (const preset of ['light-comedy', 'immersive-thriller', 'good-cry', 'chills']) {
      assert.ok(screen.includes(`preset: '${preset}'`), preset);
    }
    // A title opens the same sheet as everywhere else; group choosing stays in the space.
    assert.match(screen, /<MediaDetailModal/);
    assert.match(screen, /href="\/spaces\?view=recommend"/);
    assert.doesNotMatch(screen, /GroupRecommendationPanel/);
    // /explore no longer bounces to the composer and needs a signed-in visitor.
    assert.doesNotMatch(middleware, /pathname === '\/explore'\s*\?/);
    assert.match(middleware, /pathname === '\/explore' \|\|/);
  });

  it('uses media selections and detail confirmation before the record write step', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /await selectMedia\(item\)/);
    assert.match(composer, /await getMediaDetail\(selected\.id\)/);
    assert.match(composer, /<MediaDetailModal/);
  });

  it('forwards media type and provides TMDB next-page loading', () => {
    const hook = source('hooks/useMediaSearch.ts');
    const api = source('lib/api/media.ts');
    assert.match(hook, /type, page: 1/);
    assert.match(api, /params\.set\('type', type\)/);
    assert.match(hook, /page \+ 1/);
  });
});
