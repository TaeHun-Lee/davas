import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { CommunityTab } from './community-types';

export function toCommunityTab(tab: string | null): CommunityTab {
  return tab === 'popular' || tab === 'following' || tab === 'latest' ? tab : 'recommended';
}

export function setCommunityDashboardQueryParam(
  searchParams: ReadonlyURLSearchParams,
  next: { q?: string; tab?: CommunityTab },
) {
  const params = new URLSearchParams(searchParams.toString());
  const tab = next.tab ?? toCommunityTab(params.get('tab'));
  const q = next.q ?? params.get('q') ?? '';

  if (tab === 'recommended') {
    params.delete('tab');
  } else {
    params.set('tab', tab);
  }

  if (q.trim()) {
    params.set('q', q.trim());
  } else {
    params.delete('q');
  }

  const queryString = params.toString();
  return queryString ? `/community?${queryString}` : '/community';
}
