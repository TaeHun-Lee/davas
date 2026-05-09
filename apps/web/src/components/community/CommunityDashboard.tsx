'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '../layout/AppShell';
import { useCommunityDashboard } from '../../hooks/useCommunityDashboard';
import { CommunitySearchBar } from './CommunitySearchBar';
import { CommunitySegmentTabs } from './CommunitySegmentTabs';
import { PopularTopicsSection } from './PopularTopicsSection';
import { PopularDiariesSection } from './PopularDiariesSection';
import { CommunityFeedSection } from './CommunityFeedSection';
import type { CommunityTab, CommunityTopic } from './community-types';
import { setCommunityDashboardQueryParam, toCommunityTab } from './community-dashboard-utils';

export function CommunityDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [topic, setTopic] = useState(searchParams.get('topic') ?? '');
  const [activeTab, setActiveTab] = useState<CommunityTab>(toCommunityTab(searchParams.get('tab')));
  const { dashboard, status } = useCommunityDashboard(activeTab, query, topic);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setTopic(searchParams.get('topic') ?? '');
    setActiveTab(toCommunityTab(searchParams.get('tab')));
  }, [searchParams]);

  function handleSearchChange(nextQuery: string) {
    setQuery(nextQuery);
    router.replace(setCommunityDashboardQueryParam(searchParams, { q: nextQuery, tab: activeTab, topic }), { scroll: false });
  }

  function handleTabChange(nextTab: CommunityTab) {
    setActiveTab(nextTab);
    router.replace(setCommunityDashboardQueryParam(searchParams, { q: query, tab: nextTab, topic }), { scroll: false });
  }

  function handleTopicSelect(topic: CommunityTopic) {
    const nextTopic = topic.label.replace(/^#/, '');
    setQuery('');
    setTopic(nextTopic);
    setActiveTab('recommended');
    router.replace(setCommunityDashboardQueryParam(searchParams, { q: '', tab: 'recommended', topic: nextTopic }), { scroll: false });
  }

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="community-dashboard">
        <CommunitySearchBar value={query} onChange={handleSearchChange} />
        <CommunitySegmentTabs activeTab={activeTab} onChange={handleTabChange} />
        {status === 'error' ? (
          <div className="mb-4 rounded-[22px] bg-white px-5 py-4 text-[13px] font-bold text-[#e85b6a] shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
            커뮤니티 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        ) : null}
        <PopularTopicsSection topics={dashboard.topics} onTopicSelect={handleTopicSelect} />
        <PopularDiariesSection items={dashboard.popularDiaries} />
        <CommunityFeedSection items={dashboard.feed} tab={activeTab} isLoading={status === 'loading'} />
      </div>
    </AppShell>
  );
}
