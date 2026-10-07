import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('design review fixes', () => {
  it('puts the title sheet on the C안 colours and order', () => {
    const modal = source('components/media/MediaDetailModal.tsx');
    const sections = source('components/media/media-detail-sections.tsx');
    assert.doesNotMatch(modal + sections, /#ff5a52/);
    assert.match(modal, /bg-\[var\(--blue\)\] text-\[15px\] font-black text-white/);
    assert.ok(modal.indexOf('<WatchableNowCard') < modal.indexOf('<OurReactionsCard'));
    assert.ok(modal.indexOf('<OurReactionsCard') < modal.indexOf('title="시놉시스"'));
    // Nothing about missing stills or the old "다이어리" wording reaches people.
    assert.doesNotMatch(sections, /API 연결/);
    assert.match(sections, /if \(stills\.length === 0\) return null;/);
    assert.doesNotMatch(modal, /다이어리/);
  });

  it('keeps readable text at 12px and greys at 4.5:1 on the space screens', () => {
    for (const path of [
      'components/spaces/SpacesScreen.tsx',
      'components/spaces/SpaceInviteScreen.tsx',
      'components/spaces/SpaceTimeline.tsx',
      'components/spaces/GroupRecommendationPanel.tsx',
      'components/media/media-detail-sections.tsx',
    ]) {
      const code = source(path);
      assert.doesNotMatch(code, /text-\[1[01]px\]/, path);
      assert.doesNotMatch(code, /text-\[#(8190a5|7b8799|8b96a8|738096|8a96a9|9aa5b5)\]/i, path);
      assert.doesNotMatch(code, /bg-\[#(456ca8|2f7eea)\]/i, path);
    }
  });

  it('shows the invite deadline, the search focus and a retry the way people expect', () => {
    assert.match(
      source('components/spaces/SpaceInviteScreen.tsx'),
      /\{inviteDeadlineLabel\(details\.expiresAt\)\}까지 참여할 수 있어요/,
    );
    const css = source('app/globals.css');
    assert.match(css, /\.search-field:focus-within \{\n  border-color: var\(--blue\);/);
    assert.match(
      css,
      /\.home-recommendation-tabs button \{\n  min-width: 76px;\n  min-height: 44px;/,
    );
    assert.match(css, /\.watch-rating-star-fill \{[^}]*color: #f2a516;/);
    assert.match(css, /\.my-review-prompt \.review-avatar/);
    assert.match(
      source('components/core/RecordComposer.tsx'),
      /setLoadAttempt\(\(value\) => value \+ 1\)/,
    );
    assert.match(source('components/core/WatchSearchResults.tsx'), /`\$\{items\.length\}개/);
  });
});

describe('design review, third round', () => {
  it('draws watched days as photo tiles inside a calendar card', () => {
    const calendar = source('components/spaces/SpaceCalendarView.tsx');
    assert.match(calendar, /<div className="calendar-card">/);
    assert.match(calendar, /className="calendar-day calendar-day-filled"/);
    assert.match(calendar, /className="calendar-day-date"/);
    assert.match(calendar, /`\$\{record\.authorName\}님 기록`/);
    // A day without records is a plain date, not a disabled button.
    assert.doesNotMatch(calendar, /disabled=\{!day\}/);
  });

  it('lays the year card and its saved image out as on the boards', () => {
    const card = source('components/spaces/YearRecapCard.tsx');
    const image = source('components/spaces/recap-image.ts');
    assert.match(card, /\{totals\.records\}편을 함께 봤어요/);
    assert.match(card, /<h3 className="recap-subtitle">별점 상위<\/h3>/);
    assert.match(card, /data-busiest=/);
    assert.match(image, /addColorStop\(0, ACCENT\)/);
    assert.match(image, /\.slice\(0, 6\)/);
    assert.match(image, /index % 2/);
    assert.doesNotMatch(image, /우리 기록 모아보기/);
  });

  it('gives the account cards the wordmark row, status tiles and focus on swap', () => {
    const auth = source('components/auth/AuthUi.tsx');
    assert.match(auth, /src="\/images\/davas-logo-horizontal\.png"/);
    assert.match(auth, /<StatusTile tone="done" \/>/);
    assert.match(auth, /<StatusTile tone="pending" \/>/);
    assert.match(auth, /ref=\{doneTitle\} tabIndex=\{-1\}/);
    assert.match(auth, /aria-label="비밀번호 보기"\s+aria-pressed=\{visible\}/);
  });

  it('lists 내 기록 in the record search cards', () => {
    const mine = source('components/core/RecordScreens.tsx');
    const screen = mine.slice(mine.indexOf('export function MineScreen'));
    assert.match(screen, /<WatchSearchResults\s+scope="mine"/);
    assert.doesNotMatch(screen.slice(0, screen.indexOf('\n}\n')), /새 기록 남기기|RecordList/);
  });
});

describe('design decisions: five tabs, the desktop layout and the title sheet', () => {
  it('raises recording in the middle of five tabs and adds 탐색', () => {
    const shell = source('components/core/CoreUi.tsx');
    assert.match(shell, /href: '\/explore', label: '탐색'/);
    assert.match(shell, /className="core-nav-raised"/);
    assert.match(
      source('app/globals.css'),
      /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\);/,
    );
  });

  it('turns the header and bottom bar into a sidebar from 1024px', () => {
    const shell = source('components/core/CoreUi.tsx');
    const css = source('app/globals.css');
    assert.match(shell, /<CoreSidebar lead=\{headerLead\} \/>/);
    assert.match(shell, /<CoreSidebar \/>/);
    assert.match(shell, /href="\/notifications"\s+className="core-sidebar-item"/);
    const desktop = css.slice(css.indexOf('@media (min-width: 1024px) {\n  .core-shell'));
    assert.match(desktop, /grid-template-columns: 248px minmax\(0, 1fr\);/);
    assert.match(desktop, /\.core-header,\n  \.core-bottom-nav \{\n    display: none;/);
    assert.match(desktop, /\.task-main\[data-wide\] > \.watch-gallery \{/);
    assert.match(desktop, /\.space-home > \.space-home-timeline \{/);
  });

  it('opens a title as a sheet that a drag down closes, centred on a computer', () => {
    const modal = source('components/media/MediaDetailModal.tsx');
    const css = source('app/globals.css');
    assert.match(modal, /className="media-sheet-backdrop"/);
    assert.match(modal, /onPointerMove=\{moveDrag\}/);
    assert.match(modal, /if \(distance > 120\) onClose\(\);/);
    assert.match(modal, /aria-labelledby="media-sheet-title"/);
    assert.match(css, /border-radius: 28px 28px 0 0;/);
    assert.match(css, /\.media-sheet \{\n    width: min\(100%, 560px\);/);
  });
});

describe('the explore and desktop boards', () => {
  it('lists explore results as cards with a count and a check on the chosen mood', () => {
    const screen = source('components/core/ExploreScreen.tsx');
    assert.match(screen, /className="section-title explore-count-title"/);
    assert.match(screen, /className="explore-mood-check"/);
    assert.match(screen, /className="secondary-button explore-together"/);
  });

  it('puts the timeline photos beside the title and the reviews side by side on a computer', () => {
    for (const path of [
      'components/spaces/SpaceWatchCard.tsx',
      'components/spaces/SpaceWatchGroupCard.tsx',
    ]) {
      const card = source(path);
      assert.ok(card.indexOf('className="space-watch-body"') < card.indexOf('space-watch-media'));
      assert.ok(card.indexOf('space-watch-photos') < card.indexOf('space-watch-reactions'));
    }
    const css = source('app/globals.css');
    const desktop = css.slice(css.indexOf('@media (min-width: 1024px) {\n  .core-shell'));
    assert.match(desktop, /\.space-watch-body \{\n    display: flex;/);
    assert.match(desktop, /\.record-reviews-list \{\n    display: grid;/);
    assert.match(desktop, /\.task-main\[data-wide\]:not\(:has\(> \.watch-gallery\)\)/);
    assert.match(desktop, /\.home-recommendations \{\n    display: none;/);
  });

  it('titles home and the space tab in the page and keeps a record under 홈', () => {
    assert.match(source('components/core/RecordScreens.tsx'), /className="home-explore-link"/);
    const spaces = source('components/spaces/SpacesScreen.tsx');
    assert.match(spaces, /className="space-overview-head"/);
    assert.match(spaces, /className="space-invite-row"/);
    assert.match(
      source('components/core/CoreUi.tsx'),
      /pathname\.startsWith\('\/records\/'\) && pathname !== '\/records\/new'/,
    );
    assert.match(
      source('components/media/MediaDetailModal.tsx'),
      /className="media-sheet-actions /,
    );
  });
});
