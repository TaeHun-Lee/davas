import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('choosing together screens', () => {
  it('serves the shared list as a protected route reachable from home and spaces', () => {
    const page = source('app/spaces/wishes/page.tsx');
    const middleware = source('middleware.ts');
    const routes = source('lib/core-routes.ts');
    const home = source('components/core/SpaceHome.tsx');
    const spaces = source('components/spaces/SpacesScreen.tsx');
    assert.match(page, /<WishesScreen \/>/);
    assert.match(middleware, /pathname === '\/spaces\/wishes'/);
    assert.match(middleware, /'\/spaces\/wishes',/);
    assert.match(routes, /'\/spaces\/wishes'/);
    assert.match(home, /<WishPickCard key=\{space\.id\} spaceId=\{space\.id\} variant="home" \/>/);
    assert.match(spaces, /href="\/spaces\/wishes"/);
  });

  it('shows who added each title, whether everyone wants it, and where it streams', () => {
    const screen = source('components/spaces/WishesScreen.tsx');
    assert.match(screen, /memberCount === 2 \? '둘 다' : '모두'/);
    assert.match(screen, /구독 중인 OTT에서 볼 수 있어요/);
    assert.match(screen, /지금은 볼 수 있는 곳이 없어요/);
    assert.match(screen, /대여·구매로만 볼 수 있어요/);
    assert.match(screen, /aria-label="목록 보기 방식"/);
    assert.match(screen, /aria-pressed=\{item\.wantedByMe\}/);
    // TMDB's watch-provider data comes from JustWatch, which asks to be credited.
    assert.match(screen, /TMDB\(JustWatch 제공\)/);
  });

  it('lets the quick pick move on, follow a mood, and stay quiet on home when empty', () => {
    const card = source('components/spaces/WishPickCard.tsx');
    assert.match(card, /exclude/);
    assert.match(card, /다른 후보/);
    assert.match(card, /aria-label="오늘 기분"/);
    assert.match(card, /variant === 'home' && \(status === 'error'/);
    assert.match(card, /\/records\/new\?mediaId=/);
  });

  it('keeps "보고 싶어요" on the shared list when there is a space', () => {
    const modal = source('components/media/MediaDetailModal.tsx');
    const hook = source('hooks/useSpaceWish.ts');
    assert.match(modal, /useSpaceWish\(media\.id, isOpen\)/);
    assert.match(modal, /spaceWish\.wish \? spaceWish\.toggle\(\) : handleFavoriteToggle\(\)/);
    assert.match(hook, /chooseActiveSpace\(items, readActiveSpaceId\(\)\)/);
  });

  it('stores OTT subscriptions in settings and starts group choosing from them', () => {
    const settings = source('components/settings/SettingsScreen.tsx');
    const subscriptions = source('components/settings/OttSubscriptions.tsx');
    const panel = source('components/spaces/GroupRecommendationPanel.tsx');
    assert.match(settings, /<OttSubscriptions initial=\{user\.ottServices \?\? \[\]\} \/>/);
    assert.match(subscriptions, /updateMe\(\{ ottServices: selected \}\)/);
    assert.match(panel, /services: ottProviderNames\(services\)/);
    assert.match(panel, /OTT_SERVICES\.map/);
  });
});
