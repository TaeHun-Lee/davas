import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('record search experience', () => {
  it('uses a semantic search field with a vector magnifier', () => {
    const ui = source('components/core/CoreUi.tsx');
    assert.match(ui, /export function SearchIcon/);
    assert.match(ui, /role="search"/);
    assert.match(ui, /type="search"/);
    assert.match(ui, /enterKeyHint="search"/);
    assert.match(ui, /<SearchIcon className="search-field-icon"/);
    assert.doesNotMatch(ui, />⌕</);
  });

  it('keeps both filter rows visible with pressed semantics and reset affordance', () => {
    const ui = source('components/core/CoreUi.tsx');
    const screens = source('components/core/RecordScreens.tsx');
    assert.match(ui, /aria-pressed/);
    assert.match(screens, /작품 종류/);
    assert.match(screens, /관람 방식/);
    assert.match(screens, /mediaType/);
    assert.match(screens, /viewingMethod/);
    assert.match(screens, />\s*초기화/);
  });

  it('returns friend search to the friend tab and preserves search context', () => {
    const screens = source('components/core/RecordScreens.tsx');
    assert.match(screens, /fallback=\{scope === 'friends' \? '\/friends' : '\/me'\}/);
    assert.match(screens, /const returnTo = `\/search\?\$\{returnParams\.toString\(\)\}`/);
    assert.match(screens, /returnTo=\{returnTo\}/);
  });

  it('makes the friend tab the dedicated entry to friend record search', () => {
    const friends = source('components/friends/FriendsScreen.tsx');
    const home = source('components/core/RecordScreens.tsx');
    assert.match(friends, /href="\/search\?scope=friends"/);
    assert.match(friends, />친구 기록 검색</);
    assert.match(friends, /작품 제목이나 친구 이름으로 찾아보세요/);
    assert.doesNotMatch(home, /home-search-link/);
  });

  it('uses different friend and mine placeholders and URL query state', () => {
    const code = source('components/core/RecordScreens.tsx');
    assert.match(code, /작품 제목 또는 친구 이름/);
    // My and the space's records are searched by more than the title.
    assert.match(code, /제목, 함께 본 사람, 장소, 메모, 리뷰/);
    assert.match(code, /URLSearchParams/);
  });
});
