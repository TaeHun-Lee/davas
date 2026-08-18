import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('four-tab core shell', () => {
  it('renders exactly the four navigation labels with home first and no drawer', () => {
    const code = source('components/core/CoreUi.tsx');
    const tabContract = code.slice(
      code.indexOf('const tabs'),
      code.indexOf('export function CoreHeader'),
    );
    for (const label of ['홈', '기록하기', '내 기록', '친구']) {
      assert.match(tabContract, new RegExp(label));
    }
    assert.equal((tabContract.match(/label:/g) ?? []).length, 4);
    assert.doesNotMatch(code, /hamburger|drawer|추천|채팅|알림/);
  });

  it('uses accessible vector icons for home navigation and settings', () => {
    const code = source('components/core/CoreUi.tsx');
    assert.match(code, /CoreNavIcon/);
    assert.match(code, /data-icon="settings"/);
    assert.match(code, /aria-label="설정 열기"/);
    assert.doesNotMatch(code, />\s*설정\s*</);
  });

  it('keeps home task-first and sends record creation to TMDB search', () => {
    const feed = source('components/core/RecordScreens.tsx');
    assert.match(feed, /<h1 className="sr-only">홈<\/h1>/);
    assert.match(feed, /href="\/records\/new\?step=find"/);
    assert.match(feed, /<SearchIcon className="wide-cta-icon"/);
    assert.doesNotMatch(feed, /home-search-link|home-intro/);
  });

  it('provides padded movie and drama carousel controls', () => {
    const recommendations = source(
      'components/core/HomeRecommendations.tsx',
    );
    const css = source('app/globals.css');
    assert.match(recommendations, /carouselRef/);
    assert.match(recommendations, /scrollBy/);
    assert.match(recommendations, /이전.*추천/);
    assert.match(recommendations, /다음.*추천/);
    assert.match(css, /scroll-snap-type: x mandatory/);
    assert.doesNotMatch(
      css,
      /home-recommendation-row \{[^}]*margin-(right|left):-/,
    );
  });

  it('opens recommendation detail before starting a new record', () => {
    const recommendations = source(
      'components/core/HomeRecommendations.tsx',
    );
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(recommendations, /\/records\/new\?step=find&detail=/);
    assert.doesNotMatch(recommendations, /\/records\/new\?mediaId=/);
    assert.ok(
      composer.indexOf("const mediaId = params.get('mediaId')") <
        composer.indexOf('const saved = sessionStorage.getItem'),
    );
    assert.match(composer, /resumedDraft\.selected\s*=/);
  });

  it('keeps independent compact recommendation and friend-feed errors', () => {
    const feed = source('components/core/RecordScreens.tsx');
    assert.match(feed, /home-feed-message/);
    assert.match(feed, /<RecordList scope="friends" compact \/>/);
    assert.match(feed, /<HomeRecommendations \/>/);
  });

  it('keeps the 430px shell, safe area and focus treatment in shared styles', () => {
    const css = source('app/globals.css');
    assert.match(css, /max-width: 430px/);
    assert.match(css, /safe-area-inset-bottom/);
    assert.match(css, /:focus-visible/);
    assert.match(css, /--commit: #d83b35/);
  });
});
