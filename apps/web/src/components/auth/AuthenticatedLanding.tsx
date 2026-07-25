'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DiaryDashboardView } from '../diary/diary-dashboard-types';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { getApiBaseUrl } from '../../lib/api/base-url';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { HomeDashboard, buildHomeDashboardView } from '../home/HomeDashboard';
import { AppShell } from '../layout/AppShell';
import { getWatchlist, type WatchlistItem } from '../../lib/api/watchlist';

type MeResponse = {
  user: {
    email: string;
    nickname: string;
  };
};

export function AuthenticatedLanding() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse['user'] | null>(null);
  const [dashboard, setDashboard] = useState<DiaryDashboardView | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      setIsLoading(true);
      setLoadError(false);
      try {
        const response = await fetch(`${getApiBaseUrl()}/auth/me`, { credentials: 'include' });
        if (response.status === 401) {
          router.replace('/login');
          return;
        }
        if (!response.ok) throw new Error('auth check failed');
        const data = (await response.json()) as MeResponse;
        const [diaryDashboard, watchlistResponse] = await Promise.all([getDiaryDashboard(), getWatchlist('ACTIVE')]);
        if (isMounted) {
          setUser(data.user);
          setDashboard(diaryDashboard);
          setWatchlist(watchlistResponse.items);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoadError(true);
          setIsLoading(false);
        }
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [router, retryKey]);

  if (loadError) {
    return <AppShell><section className="rounded-[24px] bg-white p-8 text-center shadow-[0_14px_30px_rgba(31,65,114,0.08)]"><h1 className="text-[18px] font-black text-[#23426f]">홈을 불러오지 못했어요</h1><p className="mt-2 text-[13px] font-bold text-[#65758a]">로그인 상태는 유지돼요. 네트워크를 확인하고 다시 시도해 주세요.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)} className="mt-5 min-h-11 rounded-[16px] bg-[#284778] px-5 text-[13px] font-black text-white">다시 시도</button></section></AppShell>;
  }

  if (isLoading || !dashboard) {
    return <MediaDetailLoadingIndicator label="인증 상태를 확인하는 중" />;
  }

  return <HomeDashboard user={user ?? undefined} view={buildHomeDashboardView(dashboard)} watchlist={watchlist} />;
}
