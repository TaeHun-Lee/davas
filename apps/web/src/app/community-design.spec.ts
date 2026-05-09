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
const utilsSource = optionalSource('../components/community/community-dashboard-utils.ts');
const cardSource = optionalSource('../components/community/CommunityDiaryCard.tsx');
const detailPageSource = optionalSource('./diary/[id]/page.tsx');
const detailSource = optionalSource('../components/community/CommunityDiaryDetail.tsx');

const combinedCommunitySource = [dashboardSource, searchBarSource, tabsSource, topicsSource, popularSource, feedSource, apiSource, utilsSource, cardSource, detailPageSource, detailSource].join('\n');

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

  it('supports Slice 4 URL-addressable community search and tab state', () => {
    assert.match(dashboardSource, /useSearchParams/);
    assert.match(dashboardSource, /useRouter/);
    assert.match(dashboardSource, /toCommunityTab\(searchParams\.get\('tab'\)\)/);
    assert.match(dashboardSource, /searchParams\.get\('q'\) \?\? ''/);
    assert.match(dashboardSource, /setCommunityDashboardQueryParam\(searchParams, \{ q: nextQuery, tab: activeTab \}\)/);
    assert.match(dashboardSource, /setCommunityDashboardQueryParam\(searchParams, \{ q: query, tab: nextTab \}\)/);
    assert.match(utilsSource, /export function toCommunityTab/);
    assert.match(utilsSource, /export function setCommunityDashboardQueryParam/);
    assert.match(utilsSource, /params\.set\('tab', tab\)/);
    assert.match(utilsSource, /params\.delete\('q'\)/);
  });

  it('supports Slice 5 actionable topic and popular diary navigation without inert controls', () => {
    assert.match(dashboardSource, /handleTopicSelect/);
    assert.match(dashboardSource, /<PopularTopicsSection topics=\{dashboard\.topics\} onTopicSelect=\{handleTopicSelect\} \/>/);
    assert.match(topicsSource, /onTopicSelect: \(topic: CommunityTopic\) => void/);
    assert.match(topicsSource, /button/);
    assert.match(topicsSource, /aria-label=\{`\$\{topic\.label\} 토픽으로 검색`\}/);
    assert.match(popularSource, /import Link from 'next\/link'/);
    assert.match(popularSource, /href="\/community\?tab=popular"/);
    assert.doesNotMatch(popularSource, /<span className="text-\[12px\] font-extrabold text-\[#216bd8\]">전체 보기/);
    assert.match(cardSource, /import Link from 'next\/link'/);
    assert.match(cardSource, /normalizeProfileImageUrl/);
    assert.match(cardSource, /href=\{`\/diary\/\$\{item\.id\}`\}/);
    assert.doesNotMatch(cardSource, /\/edit/);
    assert.match(detailPageSource, /CommunityDiaryDetail/);
    assert.match(detailPageSource, /params\?: Promise<\{ id: string \}>/);
    assert.match(detailSource, /getCommunityDiary/);
    assert.match(apiSource, /export async function getCommunityDiary/);
    assert.match(apiSource, /\/community\/diaries\/\$\{id\}/);
  });
});
