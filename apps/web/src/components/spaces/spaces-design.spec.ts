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
    assert.match(
      screen,
      /<CoreAppShell headerLead=\{<SpaceSwitcher state=\{state\} onSelect=\{switchSpace\} \/>\}>/,
    );
    assert.match(
      invite,
      /<TaskShell title="공간 초대" fallback=\{authenticated \? '\/spaces' : '\/login'\}>/,
    );
    assert.doesNotMatch(screen + invite, /layout\/AppShell/);
    assert.match(screen, /예전 친구 관리 ›/);
    assert.match(screen, /href="\/friends"/);
    assert.match(friends, /href="\/spaces"/);
  });

  it('provides labelled mobile controls and loading, empty, status, and error states', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    // Switching spaces lives in the header; the page keeps every management control.
    assert.match(screen, /aria-label="공간 이름"/);
    assert.match(screen, /aria-label="공간 최대 인원"/);
    assert.match(screen, /aria-labelledby="space-invite-period"/);
    assert.match(screen, /aria-label="소유권을 이전할 멤버"/);
    assert.match(screen, /data-state="loading"/);
    assert.match(screen, /data-state="empty"/);
    assert.match(screen, /role="alert"/);
    assert.match(screen, /role="status"/);
    assert.match(source('app/globals.css'), /\.space-expiry button \{\n  min-height: 44px;/);
    assert.match(invite, /aria-busy/);
    assert.match(invite, /data-state="unavailable"/);
  });

  it('connects create, invite, transfer, leave, and close state transitions', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    assert.match(screen, /createSpace\(name\.trim\(\), maxMembers\)/);
    assert.match(screen, /createSpaceInvite/);
    assert.match(screen, /\{inviteDeadlineLabel\(invite\.expiresAt\)\}까지 쓸 수 있어요/);
    assert.match(screen, /cancelSpaceInvite/);
    assert.match(screen, /transferSpaceOwnership/);
    assert.match(screen, /leaveSpace/);
    assert.match(screen, /closeSpace/);
    // One option per allowed size, from the shared space size rule.
    assert.match(screen, /length: SPACE_MAX_MEMBERS - SPACE_MIN_MEMBERS \+ 1/);
    assert.match(screen, /activeSpace\.members\.length >= activeSpace\.maxMembers/);
    assert.match(invite, /acceptSpaceInvite\(token\)/);
    assert.match(invite, /localStorage\.setItem\(ACTIVE_SPACE_KEY, accepted\.spaceId\)/);
  });

  it('lays the space tab out as on the C안 board', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    // Members first (with renaming and inviting), then the space's four features.
    assert.ok(screen.indexOf('id="members-title"') < screen.indexOf('aria-label="공간 기능"'));
    for (const href of [
      '/spaces/wishes',
      '/spaces?view=recommend',
      '/spaces/memories',
      '/search?scope=space',
    ]) {
      assert.ok(screen.includes(`href: '${href}'`), href);
    }
    assert.match(screen, /공간 멤버 모두에게 바뀐 이름으로 보여요\./);
    assert.match(screen, /'공간을 만든 사람'/);
    assert.match(screen, /에 참여`/);
    assert.match(screen, /className="space-invite-button"/);
    // The timeline is its own screen now, not a card inside the space tab.
    assert.match(screen, /<TaskShell title="우리 공간 타임라인" fallback="\/">/);
    assert.doesNotMatch(source('components/spaces/SpaceTimeline.tsx'), /core-card p-5/);
  });

  it('hosts group choosing in the active space and links home to it', () => {
    const screen = source('components/spaces/SpacesScreen.tsx');
    const panel = source('components/spaces/GroupRecommendationPanel.tsx');
    const page = source('app/spaces/page.tsx');
    const home = source('components/core/HomeRecommendations.tsx');
    const middleware = source('middleware.ts');
    const routes = source('lib/core-routes.ts');

    assert.match(screen, /<TaskShell title="함께 고르기" fallback="\/spaces">/);
    assert.match(
      screen,
      /<GroupRecommendationPanel\s+key=\{state\.space\.id\}\s+space=\{state\.space\}/,
    );
    assert.match(screen, /defaultServices=\{state\.myOttServices\}/);
    assert.match(
      page,
      /view === 'recommend' \? 'recommend' : view === 'timeline' \? 'timeline' : 'space'/,
    );
    // The board's form: people, type, mood, runtime, rewatch and agreement, extras folded.
    assert.match(panel, /<legend>참여자<\/legend>/);
    assert.match(panel, /'둘 다'/);
    assert.match(panel, /누군가 이미 본 작품 제외/);
    assert.match(panel, /<details className="choose-more">/);
    assert.doesNotMatch(panel, /reason\.reasonCode\}\s*<\/code>/);
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

  it('opens an invite as one C안 card with a real decline dialog and a full state', () => {
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    assert.match(invite, /<p className="invite-eyebrow">공간 초대<\/p>/);
    assert.match(invite, /details\.members\.initials\.map/);
    assert.match(invite, /멤버 \{details\.members\.count\}명 · 최대 \{details\.members\.max\}명/);
    assert.match(invite, /님이 ‘\{details\.space\.name\}’ 공간에 초대했어요/);
    // Saying no asks in a dialog that keeps focus and closes on Esc.
    assert.match(invite, /role="alertdialog"/);
    assert.match(invite, /useFocusTrap\(true, dialogRef, onCancel\)/);
    assert.match(invite, /초대를 거절할까요\?/);
    // A full space still shows the invite, with joining switched off.
    assert.match(invite, /details\.status === 'FULL' \? 'full' : 'valid'/);
    assert.match(invite, /className="invite-join-disabled" disabled/);
  });

  it('keeps the core header sticky by clipping instead of hiding root overflow', () => {
    const css = source('app/globals.css');
    assert.match(css, /html \{[^}]*overflow-x: clip;/);
    assert.match(css, /body \{[^}]*overflow-x: clip;/);
    assert.match(css, /\.core-header,\s*\.back-header\s*\{\s*position: sticky;/);
  });
});
