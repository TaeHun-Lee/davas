import { useEffect, useState } from 'react';
import { getCommunityDashboard } from '../lib/api/community';
import type { CommunityDashboardResponse, CommunityTab } from '../components/community/community-types';

export type CommunityDashboardStatus = 'loading' | 'ready' | 'error';

const emptyCommunityDashboard: CommunityDashboardResponse = {
  tab: 'recommended',
  topics: [],
  popularDiaries: [],
  feed: [],
};

export function useCommunityDashboard(tab: CommunityTab, q: string) {
  const [dashboard, setDashboard] = useState<CommunityDashboardResponse>(emptyCommunityDashboard);
  const [status, setStatus] = useState<CommunityDashboardStatus>('loading');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    getCommunityDashboard({ tab, q })
      .then((nextDashboard) => {
        if (!mounted) return;
        setDashboard(nextDashboard);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setDashboard({ ...emptyCommunityDashboard, tab });
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [tab, q]);

  return { dashboard, status };
}
