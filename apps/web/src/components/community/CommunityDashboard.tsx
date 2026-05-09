'use client';

import { useState } from 'react';
import { AppShell } from '../layout/AppShell';
import { useCommunityDashboard } from '../../hooks/useCommunityDashboard';
import { CommunitySearchBar } from './CommunitySearchBar';
import { CommunitySegmentTabs } from './CommunitySegmentTabs';
import { PopularTopicsSection } from './PopularTopicsSection';
import { PopularDiariesSection } from './PopularDiariesSection';
import { CommunityFeedSection } from './CommunityFeedSection';
import type { CommunityTab } from './community-types';

export function CommunityDashboard() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CommunityTab>('recommended');
  const { dashboard, status } = useCommunityDashboard(activeTab, query);

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="community-dashboard">
        <CommunitySearchBar value={query} onChange={setQuery} />
        <CommunitySegmentTabs activeTab={activeTab} onChange={setActiveTab} />
        {status === 'error' ? (
          <div className="mb-4 rounded-[22px] bg-white px-5 py-4 text-[13px] font-bold text-[#e85b6a] shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
            커뮤니티 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        ) : null}
        <PopularTopicsSection topics={dashboard.topics} />
        <PopularDiariesSection items={dashboard.popularDiaries} />
        <CommunityFeedSection items={dashboard.feed} tab={activeTab} isLoading={status === 'loading'} />
      </div>
    </AppShell>
  );
}
