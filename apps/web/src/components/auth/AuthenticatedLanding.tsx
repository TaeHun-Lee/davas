'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DiaryDashboardView } from '../diary/diary-dashboard-types';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { HomeDashboard, buildHomeDashboardView } from '../home/HomeDashboard';

type MeResponse = {
  user: {
    email: string;
    nickname: string;
  };
};

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

export function AuthenticatedLanding() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse['user'] | null>(null);
  const [dashboard, setDashboard] = useState<DiaryDashboardView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/auth/me`, { credentials: 'include' });
        if (!response.ok) {
          router.replace('/login');
          return;
        }
        const data = (await response.json()) as MeResponse;
        const diaryDashboard = await getDiaryDashboard();
        if (isMounted) {
          setUser(data.user);
          setDashboard(diaryDashboard);
          setIsLoading(false);
        }
      } catch {
        router.replace('/login');
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading || !dashboard) {
    return <MediaDetailLoadingIndicator label="인증 상태를 확인하는 중" />;
  }

  return <HomeDashboard user={user ?? undefined} view={buildHomeDashboardView(dashboard)} />;
}
