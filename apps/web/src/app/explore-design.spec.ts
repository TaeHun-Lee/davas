import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('explore flow contract', () => {
  it('makes group choosing primary while retaining supporting discovery sections', () => {
    const page = source('app/explore/page.tsx');
    const dashboard = source('components/explore/ExploreDashboard.tsx');
    assert.match(page, /<ExploreDashboard \/>/);
    assert.match(dashboard, /<GroupRecommendationPanel \/>/);
    assert.match(dashboard, /<TodayRecommendationSection/);
    assert.match(dashboard, /<GenreRecommendationSection/);
    assert.match(dashboard, /visibleTrendingItems/);
  });

  it('uses media selections before the record write step', () => {
    assert.match(source('components/core/RecordComposer.tsx'), /await selectMedia\(item\)/);
  });

  it('forwards media type and provides TMDB next-page loading', () => {
    const hook = source('hooks/useMediaSearch.ts');
    const api = source('lib/api/media.ts');
    assert.match(hook, /type, page: 1/);
    assert.match(api, /params\.set\('type', type\)/);
    assert.match(hook, /page \+ 1/);
  });
});
