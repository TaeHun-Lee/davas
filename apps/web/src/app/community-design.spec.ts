import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function optionalSource(path: string) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

const communityPageSource = source('./community/page.tsx');
const dashboardSource = optionalSource('../components/community/CommunityDashboard.tsx');
const searchBarSource = optionalSource('../components/community/CommunitySearchBar.tsx');
const tabsSource = optionalSource('../components/community/CommunitySegmentTabs.tsx');
const topicsSource = optionalSource('../components/community/PopularTopicsSection.tsx');
const popularSource = optionalSource('../components/community/PopularDiariesSection.tsx');
const feedSource = optionalSource('../components/community/CommunityFeedSection.tsx');
const apiSource = optionalSource('../lib/api/community.ts');
const hookSource = optionalSource('../hooks/useCommunityDashboard.ts');

const combinedCommunitySource = [dashboardSource, searchBarSource, tabsSource, topicsSource, popularSource, feedSource, apiSource].join('\n');

describe('Davas community screen design', () => {
  it('routes /community to the designed community dashboard instead of a placeholder', () => {
    assert.match(communityPageSource, /CommunityDashboard/);
    assert.match(communityPageSource, /Suspense/);
    assert.match(communityPageSource, /<Suspense fallback=\{null\}>/);
    assert.doesNotMatch(communityPageSource, /PlaceholderPage/);
    assert.match(dashboardSource, /AppShell/);
    assert.match(dashboardSource, /data-design="community-dashboard"/);
    assert.match(dashboardSource, /overflow-x-hidden/);
  });

  it('matches the supplied community IA with reusable mobile sections', () => {
    for (const componentName of [
      'CommunitySearchBar',
      'CommunitySegmentTabs',
      'PopularTopicsSection',
      'PopularDiariesSection',
      'CommunityFeedSection',
    ]) {
      assert.match(dashboardSource, new RegExp(componentName));
    }
    assert.match(searchBarSource, /다른 사람들의 다이어리를 검색해보세요/);
    for (const label of ['추천', '인기', '팔로잉', '최신']) {
      assert.match(tabsSource, new RegExp(label));
    }
    assert.match(topicsSource, /지금 인기 있는 토픽/);
    assert.match(popularSource, /인기 다이어리/);
    assert.match(feedSource, /커뮤니티 피드/);
  });

  it('uses the community dashboard API instead of design mock content', () => {
    assert.match(apiSource, /export async function getCommunityDashboard/);
    assert.match(apiSource, /\/community\/dashboard/);
    assert.match(apiSource, /credentials: 'include'/);
    assert.match(hookSource, /getCommunityDashboard/);
    assert.match(dashboardSource, /useCommunityDashboard/);
    for (const forbidden of ['라라랜드', '인터스텔라', '민트초코', '영화덕후', '우주여행자', '128', '201']) {
      assert.doesNotMatch(combinedCommunitySource, new RegExp(forbidden));
    }
    assert.doesNotMatch(combinedCommunitySource, /likeCount|bookmark|팔로우|좋아요/);
  });
});
