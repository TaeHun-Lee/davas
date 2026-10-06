import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('four-tab core shell', () => {
  it('renders exactly the four navigation labels with home first and no drawer', () => {
    const code = source('components/core/CoreUi.tsx');
    const tabContract = code.slice(
      code.indexOf('const tabs'),
      code.indexOf('export function CoreHeader'),
    );
    for (const label of ['홈', '기록하기', '공간', '내 기록']) {
      assert.match(tabContract, new RegExp(label));
    }
    assert.equal((tabContract.match(/label:/g) ?? []).length, 4);
    assert.doesNotMatch(code, /hamburger|drawer|추천|채팅/);
    // The only header addition is the notification bell, which says how many are unread.
    assert.match(code, /href="\/notifications"/);
    assert.match(code, /`알림, 안 읽은 알림 \$\{unread\}개`/);
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
    const recommendations = source('components/core/HomeRecommendations.tsx');
    const css = source('app/globals.css');
    assert.match(recommendations, /carouselRef/);
    assert.match(recommendations, /scrollBy/);
    assert.match(recommendations, /이전.*추천/);
    assert.match(recommendations, /다음.*추천/);
    assert.match(css, /scroll-snap-type: x mandatory/);
    assert.doesNotMatch(css, /home-recommendation-row \{[^}]*margin-(right|left):-/);
  });

  it('opens recommendation detail before starting a new record', () => {
    const recommendations = source('components/core/HomeRecommendations.tsx');
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(recommendations, /\/records\/new\?step=find&detail=/);
    assert.doesNotMatch(recommendations, /\/records\/new\?mediaId=/);
    // The requested title is fetched first and only then decides whether the draft resumes.
    assert.ok(
      composer.indexOf('const requested = mediaId ?? detailMediaId') <
        composer.indexOf('canResumeDraft(saved, requested)'),
    );
    assert.match(composer, /next\.selected = asSelected\(media\)/);
  });

  it('centres home on the active space with independent space and recommendation errors', () => {
    const feed = source('components/core/RecordScreens.tsx');
    const home = source('components/core/SpaceHome.tsx');
    assert.match(feed, /<SpaceHome \/>\s*<HomeRecommendations \/>/);
    assert.doesNotMatch(feed, /친구들의 최근 기록|scope="friends" compact/);
    assert.match(home, /home-feed-message/);
    assert.match(home, /chooseActiveSpace\(items, readActiveSpaceId\(\)\)/);
    assert.match(home, /data-state="no-space"/);
    assert.match(home, /우리 공간 타임라인/);
    assert.match(home, /getPendingConfirmations\(space\.id\)/);
    assert.match(home, /pendingConfirmations\(\[\.\.\.byId\.values\(\)\], myAccountId\)/);
    assert.match(home, /respondToWatchParticipation\(event\.id, status\)/);
    assert.match(home, /<SpaceHomeTimeline key=\{space\.id\}/);
  });

  it('puts the space tab in the nav and keeps friends reachable under it', () => {
    const code = source('components/core/CoreUi.tsx');
    assert.match(code, /href: '\/spaces', label: '공간', icon: 'space', activeOn: \['\/friends'\]/);
    assert.doesNotMatch(code, /href: '\/friends'/);
  });

  it('defaults a new record to the active space and the partner of a two-person space', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const draft = source('components/core/composer-draft.ts');
    assert.match(draft, /chooseActiveSpace\(spaces, readActiveSpaceId\(\)\)/);
    assert.match(draft, /draft\.participantAccountIds = defaultWatchPartners\(space, accountId\)/);
    assert.match(composer, /draftWithDefaults\(spaceItems, id\)/);
    assert.match(composer, /개인 기록 · 나만 보기/);
    assert.match(composer, /shared \? '\/' : '\/me'/);
  });

  it('keeps the 430px shell, safe area and focus treatment in shared styles', () => {
    const css = source('app/globals.css');
    assert.match(css, /max-width: 430px/);
    assert.match(css, /safe-area-inset-bottom/);
    assert.match(css, /:focus-visible/);
    assert.match(css, /--commit: #d83b35/);
  });
});
