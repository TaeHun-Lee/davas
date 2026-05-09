import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function optionalSource(path: string) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

const searchFieldSource = optionalSource('../components/common/SearchField.tsx');
const homeDashboardSource = optionalSource('../components/home/HomeDashboard.tsx');
const exploreSearchBarSource = optionalSource('../components/explore/ExploreSearchBar.tsx');
const communitySearchBarSource = optionalSource('../components/community/CommunitySearchBar.tsx');
const diarySearchBarSource = optionalSource('../components/diary/DiarySearchBar.tsx');

const adapterSources = [homeDashboardSource, exploreSearchBarSource, communitySearchBarSource, diarySearchBarSource].join('\n');

describe('Davas shared search field design', () => {
  it('centralizes the mobile search input visual language in one reusable component', () => {
    assert.match(searchFieldSource, /export function SearchField/);
    assert.match(searchFieldSource, /export function SearchEntry/);
    assert.match(searchFieldSource, /type SearchFieldProps/);
    assert.match(searchFieldSource, /type SearchEntryProps/);
    assert.match(searchFieldSource, /type="search"/);
    assert.match(searchFieldSource, /currentColor/);
    assert.match(searchFieldSource, /trailing\?: ReactNode/);
    assert.match(searchFieldSource, /trailingDivider\?: boolean/);
    assert.match(searchFieldSource, /rounded-\[22px\]/);
    assert.match(searchFieldSource, /h-\[52px\]/);
    assert.match(searchFieldSource, /shadow-\[0_12px_30px_rgba\(31,42,68,0\.07\)\]/);
  });

  it('uses the shared search component on home, explore, community, and diary screens', () => {
    assert.match(homeDashboardSource, /SearchEntry/);
    assert.match(homeDashboardSource, /href="\/explore"/);
    assert.match(exploreSearchBarSource, /SearchField/);
    assert.match(communitySearchBarSource, /SearchField/);
    assert.match(diarySearchBarSource, /SearchField/);
    for (const placeholder of [
      '영화나 드라마를 검색해보세요',
      '영화, 드라마, 배우를 검색해보세요',
      '다른 사람들의 다이어리를 검색해보세요',
      '다이어리 제목이나 영화 제목으로 검색해보세요',
    ]) {
      assert.match(adapterSources, new RegExp(placeholder));
    }
    assert.doesNotMatch(adapterSources, /function SearchIcon/);
    assert.doesNotMatch(diarySearchBarSource, /⌕/);
  });
});
