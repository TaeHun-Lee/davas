import type { CommunityDashboardResponse, CommunityDiaryDetail, CommunityTab } from '../../components/community/community-types';

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

export type CommunityDashboardParams = {
  tab?: CommunityTab;
  q?: string;
};

export async function getCommunityDashboard(params: CommunityDashboardParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.tab) searchParams.set('tab', params.tab);
  if (params.q?.trim()) searchParams.set('q', params.q.trim());
  const query = searchParams.toString();
  const response = await fetch(`${getApiBaseUrl()}/community/dashboard${query ? `?${query}` : ''}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('community dashboard failed');
  }

  return (await response.json()) as CommunityDashboardResponse;
}

export async function getCommunityDiary(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/community/diaries/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('community diary failed');
  }

  return (await response.json()) as CommunityDiaryDetail;
}
