import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('spaces onboarding and member management UI', () => {
  it('keeps spaces and friends as separate, cross-linked boundaries in the core shell', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    const friends = source('components/friends/FriendsScreen.tsx');
    assert.match(screen, /<CoreAppShell>/);
    assert.match(
      invite,
      /<TaskShell title="공간 초대" fallback=\{authenticated \? '\/spaces' : '\/login'\}>/,
    );
    assert.doesNotMatch(screen + invite, /layout\/AppShell/);
    assert.match(screen, /친구 관계와는\s+별도로 관리돼요/);
    assert.match(screen, /href="\/friends"/);
    assert.match(friends, /href="\/spaces"/);
  });

  it('provides labelled mobile controls and loading, empty, status, and error states', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    assert.match(screen, /aria-label="활성 공간 선택"/);
    assert.match(screen, /aria-label="공간 이름"/);
    assert.match(screen, /aria-label="공간 최대 인원"/);
    assert.match(screen, /aria-label="초대 링크 만료 시간"/);
    assert.match(screen, /aria-label="소유권을 이전할 멤버"/);
    assert.match(screen, /data-state="loading"/);
    assert.match(screen, /data-state="empty"/);
    assert.match(screen, /role="alert"/);
    assert.match(screen, /role="status"/);
    assert.match(screen, /min-h-1[12]/);
    assert.match(invite, /aria-busy/);
    assert.match(invite, /data-state="unavailable"/);
  });

  it('connects create, invite, transfer, leave, and close state transitions', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    assert.match(screen, /createSpace\(name\.trim\(\), maxMembers\)/);
    assert.match(screen, /createSpaceInvite/);
    assert.match(screen, /cancelSpaceInvite/);
    assert.match(screen, /transferSpaceOwnership/);
    assert.match(screen, /leaveSpace/);
    assert.match(screen, /closeSpace/);
    assert.match(screen, /\[2, 3, 4, 5\]/);
    assert.match(screen, /activeSpace\.members\.length >= activeSpace\.maxMembers/);
    assert.match(invite, /acceptSpaceInvite\(token\)/);
    assert.match(invite, /localStorage\.setItem\(ACTIVE_SPACE_KEY, accepted\.spaceId\)/);
  });

  it('hosts group choosing in the active space and links home to it', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const panel = source('components/spaces/GroupRecommendationPanel.tsx');
    const page = source('app/spaces/page.tsx');
    const home = source('components/core/HomeRecommendations.tsx');
    const middleware = source('middleware.ts');
    const routes = source('lib/core-routes.ts');

    assert.match(screen, /<GroupRecommendationPanel\s+space=\{activeSpace\}\s+myAccountId=/);
    assert.match(screen, /defaultServices=\{myOttServices\}/);
    assert.match(screen, /aria-label="공간 화면 전환"/);
    assert.match(screen, /aria-pressed=\{view === option\.value\}/);
    assert.match(page, /view === 'recommend' \? 'recommend' : 'timeline'/);
    assert.match(panel, /id="group-recommendation"/);
    assert.doesNotMatch(panel, /listSpaces|<select[^>]*selectSpace/);
    assert.match(home, /href="\/spaces\?view=recommend"/);
    assert.doesNotMatch(home, /href="\/explore"/);
    assert.match(middleware, /pathname === '\/spaces' \|\|/);
    assert.match(routes, /isSafeSpacesQuery/);
  });

  it('lets signed-out visitors review an invite, then log in or sign up and come back', () => {
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    const auth = source('components/auth/AuthUi.tsx');
    assert.match(invite, /getMe\(\)/);
    assert.match(invite, /data-state="signed-out"/);
    assert.match(invite, /\/login\?returnTo=\$\{returnTo\}/);
    assert.match(invite, /\/signup\?returnTo=\$\{returnTo\}/);
    assert.match(invite, /authenticated \? \(/);
    assert.match(auth, /router\.replace\(\s*safeReturn\(params\.get\('returnTo'\)/);
  });

  it('keeps the core header sticky by clipping instead of hiding root overflow', () => {
    const css = source('app/globals.css');
    assert.match(css, /html \{[^}]*overflow-x: clip;/);
    assert.match(css, /body \{[^}]*overflow-x: clip;/);
    assert.match(css, /\.core-header,\s*\.back-header\s*\{\s*position: sticky;/);
  });
});
