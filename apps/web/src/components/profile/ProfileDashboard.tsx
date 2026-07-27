'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiResponseError, getMe, type AuthenticatedUser } from '../../lib/api/auth';
import { getDiaryDashboard } from '../../lib/api/diaries';
import type { DiaryDashboardView, DiaryListItemView } from '../diary/diary-dashboard-types';
import { AppShell } from '../layout/AppShell';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { ProfileActivitySection } from './ProfileActivitySection';
import { ProfileHeaderCard } from './ProfileHeaderCard';
import { ProfileListsSection } from './ProfileListsSection';
import { ProfileSettingsSection } from './ProfileSettingsSection';
import { ProfileStatsGrid } from './ProfileStatsGrid';

export type ProfileMetric = {
  label: string;
  value: string | null;
  unavailableLabel: string;
};

export type ProfileListCard = {
  id: string;
  title: string;
  subtitle: string;
  posterUrl?: string | null;
  posterGradient: string;
  countLabel: string;
};

export type ProfileView = {
  user: AuthenticatedUser;
  stats: {
    recordedMovies: ProfileMetric;
    diaryCount: ProfileMetric;
    receivedLikes: ProfileMetric;
    following: ProfileMetric;
  };
  activity: {
    wantToWatch: ProfileMetric;
    watched: ProfileMetric;
    writtenDiaries: ProfileMetric;
    likedPosts: ProfileMetric;
  };
  lists: ProfileListCard[];
};

function toMetric(label: string, value: number | null): ProfileMetric {
  return {
    label,
    value: value === null ? null : String(value),
    unavailableLabel: '준비중',
  };
}

function buildRecentListCard(item: DiaryListItemView): ProfileListCard {
  return {
    id: item.id,
    title: item.mediaTitle,
    subtitle: item.diaryTitle,
    posterUrl: item.posterUrl,
    posterGradient: item.posterGradient,
    countLabel: `${item.rating.toFixed(1)}점`,
  };
}

export function buildProfileView(
  user: AuthenticatedUser,
  dashboard: DiaryDashboardView,
): ProfileView {
  const diaryTotal = dashboard.summary.totalCount;
  const uniqueRecentMediaCount = new Set(dashboard.recentItems.map((item) => item.mediaId)).size;
  const recentListCards = dashboard.recentItems.slice(0, 4).map(buildRecentListCard);

  return {
    user,
    stats: {
      recordedMovies: toMetric('기록한 영화', diaryTotal),
      diaryCount: toMetric('작성한 다이어리', diaryTotal),
      receivedLikes: toMetric('받은 좋아요', null),
      following: toMetric('팔로잉', null),
    },
    activity: {
      wantToWatch: toMetric('보고싶어요', null),
      watched: toMetric('본 영화', uniqueRecentMediaCount || diaryTotal),
      writtenDiaries: toMetric('작성한 다이어리', diaryTotal),
      likedPosts: toMetric('좋아요한 글', null),
    },
    lists: recentListCards,
  };
}

export function ProfileDashboard() {
  const router = useRouter();
  const [view, setView] = useState<ProfileView | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    setStatus('loading');
    Promise.all([getMe(), getDiaryDashboard()])
      .then(([user, dashboard]) => {
        if (!mounted) return;
        setView(buildProfileView(user, dashboard));
        setStatus('ready');
      })
      .catch((error) => {
        if (!mounted) return;
        if (error instanceof ApiResponseError && error.status === 401) {
          router.replace('/login');
        } else {
          setStatus('error');
        }
      });

    return () => {
      mounted = false;
    };
  }, [router, retryKey]);

  if (status === 'error') {
    return (
      <AppShell>
        <section className="rounded-[24px] bg-white p-8 text-center">
          <h1 className="text-[18px] font-black text-[#23426f]">프로필을 불러오지 못했어요</h1>
          <p className="mt-2 text-[13px] font-bold text-[#65758a]">로그인 상태는 유지돼요.</p>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="mt-5 min-h-11 rounded-[16px] bg-[#284778] px-5 text-[13px] font-black text-white"
          >
            다시 시도
          </button>
        </section>
      </AppShell>
    );
  }

  if (status === 'loading' || !view) {
    return <MediaDetailLoadingIndicator label="프로필을 불러오는 중" />;
  }

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="profile-dashboard">
        <div className="relative flex h-[48px] items-center justify-center">
          <h1 className="text-[22px] font-black tracking-[-0.03em] text-[#23426f]">프로필</h1>
        </div>
        <ProfileHeaderCard user={view.user} />
        <ProfileStatsGrid stats={view.stats} />
        <ProfileActivitySection activity={view.activity} />
        <ProfileListsSection lists={view.lists} />
        <ProfileSettingsSection />
      </div>
    </AppShell>
  );
}
