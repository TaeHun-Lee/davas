import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('spaces onboarding and member management UI', () => {
  it('keeps spaces and legacy friends as separate navigation boundaries', () => {
    const header = source('components/layout/DavasHeader.tsx');
    const screen = source('components/spaces/SpacesScreen.tsx');
    assert.match(header, /href: '\/spaces'.*공유 공간/);
    assert.match(header, /href: '\/friends'.*친구 관리/);
    assert.match(screen, /친구 관계와는 별도로 관리돼요/);
    assert.match(screen, /href="\/friends"/);
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

    assert.match(screen, /<GroupRecommendationPanel space=\{activeSpace\} myAccountId=/);
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
});
