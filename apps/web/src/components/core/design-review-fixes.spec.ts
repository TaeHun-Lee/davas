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
