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
