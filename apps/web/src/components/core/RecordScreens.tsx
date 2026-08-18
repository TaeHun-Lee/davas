'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { MediaType, ViewingMethod } from '@davas/shared';
import {
  CoreApiError,
  listRecords,
  type RecordCardData,
} from '../../lib/api/core';
import { getFriends } from '../../lib/api/friends';
import {
  AsyncState,
  CoreAppShell,
  EmptyState,
  MediaTypeControl,
  RecordCard,
  SearchField,
  SearchIcon,
  TaskShell,
  ViewingMethodControl,
} from './CoreUi';
import { HomeRecommendations } from './HomeRecommendations';
import { WatchEventDetailScreen } from './WatchEventDetailScreen';

function useRecords(
  scope: 'friends' | 'mine',
  filters: { q?: string; mediaType?: MediaType; viewingMethod?: ViewingMethod },
) {
  const { q, mediaType, viewingMethod } = filters;
  const [items, setItems] = useState<RecordCardData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [key, setKey] = useState(0);
  const [moreBusy, setMoreBusy] = useState(false);
  const [error, setError] = useState<CoreApiError | null>(null);
  const load = useCallback(
    async (next?: string) => {
      try {
        if (next) setMoreBusy(true);
        else setStatus('loading');
        setError(null);
        const page = await listRecords(scope, {
          q,
          mediaType,
          viewingMethod,
          cursor: next,
          limit: 20,
        });
        setItems((old) => (next ? [...old, ...page.items] : page.items));
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus('ready');
      } catch (cause) {
        setError(cause instanceof CoreApiError ? cause : null);
        setStatus('error');
      } finally {
        setMoreBusy(false);
      }
    },
    [scope, q, mediaType, viewingMethod],
  );
  useEffect(() => {
    void load();
  }, [load, key]);
  return {
    items,
    cursor,
    hasMore,
    status,
    error,
    moreBusy,
    retry: () => setKey((value) => value + 1),
    loadMore: () => cursor && load(cursor),
  };
}

function RecordList({
  scope,
  filters = {},
  compact = false,
  returnTo,
}: {
  scope: 'friends' | 'mine';
  filters?: {
    q?: string;
    mediaType?: MediaType;
    viewingMethod?: ViewingMethod;
  };
  compact?: boolean;
  returnTo?: string;
}) {
  const data = useRecords(scope, filters);
  const [hasFriends, setHasFriends] = useState<boolean | null>(null);
  useEffect(() => {
    if (scope === 'friends')
      void getFriends()
        .then((value) => setHasFriends(value.friends.length > 0))
        .catch(() => setHasFriends(null));
  }, [scope]);
  if (data.status === 'loading')
    return compact ? (
      <div className="home-feed-loading" aria-label="친구 기록 불러오는 중">
        <span />
        <span />
      </div>
    ) : (
      <AsyncState kind="loading" />
    );
  if (data.status === 'error')
    return compact ? (
      <section className="home-feed-message" role="status" aria-live="polite">
        <div>
          <h3>친구 기록을 불러오지 못했어요.</h3>
          <p>추천 작품은 그대로 둘러볼 수 있어요.</p>
        </div>
        <button type="button" onClick={data.retry}>다시 시도</button>
      </section>
    ) : (
      <section role="status" aria-live="polite">
        <EmptyState
          title={
            scope === 'friends'
              ? '친구 기록을 불러오지 못했어요'
              : '내 기록을 불러오지 못했어요'
          }
          description={
            data.error?.status && data.error.status >= 500
              ? '서버에서 기록을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.'
              : '연결 상태를 확인하고 다시 시도해 주세요.'
          }
          action={
            <button
              type="button"
              className="secondary-button"
              onClick={data.retry}
            >
              다시 시도
            </button>
          }
        />
      </section>
    );
  if (!data.items.length) {
    const filtered = Boolean(
      filters.q || filters.mediaType || filters.viewingMethod,
    );
    const noFriends = scope === 'friends' && hasFriends === false;
    return (
      <EmptyState
        title={
          filtered
            ? '조건에 맞는 기록이 없어요'
            : noFriends
              ? '아직 연결된 친구가 없어요.'
              : scope === 'friends'
                ? '아직 공유된 기록이 없어요.'
                : '아직 남긴 기록이 없어요.'
        }
        description={
          filtered
            ? '검색어나 필터를 바꿔 다시 찾아보세요.'
            : noFriends
              ? '친구를 초대하면 서로의 영화·드라마 기록을 볼 수 있어요.'
              : scope === 'friends'
                ? '친구들은 아직 기록을 공유하지 않았어요. 내 첫 기록을 남겨보세요.'
                : '본 영화나 드라마를 첫 기록으로 남겨보세요.'
        }
        action={
          <Link
            className="primary-button"
            href={noFriends ? '/friends' : '/records/new?step=find'}
          >
            {noFriends ? '친구 초대하기' : '본 작품 기록하기'}
          </Link>
        }
      />
    );
  }
  return (
    <>
      <div className="space-y-4">
        {data.items.map((item) => (
          <RecordCard
            key={item.id}
            item={item}
            returnTo={returnTo ?? (scope === 'mine' ? '/me' : '/')}
          />
        ))}
      </div>
      {data.hasMore ? (
        <button
          className="secondary-button mt-5 w-full"
          disabled={data.moreBusy}
          onClick={data.loadMore}
        >
          {data.moreBusy ? '불러오는 중…' : '더 보기'}
        </button>
      ) : null}
    </>
  );
}

export function FeedScreen() {
  return (
    <CoreAppShell>
      <h1 className="sr-only">홈</h1>
      <Link
        href="/records/new?step=find"
        className="wide-cta home-record-cta"
        aria-label="TMDB에서 본 작품을 검색해 기록하기"
      >
        <span className="wide-cta-label">
          <SearchIcon className="wide-cta-icon" />
          본 작품 기록하기
        </span>
        <span aria-hidden="true">›</span>
      </Link>
      <HomeRecommendations />
      <div className="home-section-heading home-friend-heading">
        <div>
          <h2 className="section-title">친구들의 최근 기록</h2>
          <p>친구들이 남긴 최신 감상을 확인해 보세요.</p>
        </div>
        <Link href="/friends">친구 <span aria-hidden="true">›</span></Link>
      </div>
      <RecordList scope="friends" compact />
    </CoreAppShell>
  );
}

export function MineScreen() {
  return (
    <CoreAppShell>
      <h1 className="page-title">내 기록</h1>
      <p className="page-description">
        공개 여부와 관계없이 내가 본 작품을 모아봐요.
      </p>
      <div className="mt-5">
        <Link href="/search?scope=mine" aria-label="내 기록 검색">
          <SearchField
            value=""
            onChange={() => undefined}
            label="내 기록 검색"
            placeholder="내 기록 검색"
          />
        </Link>
      </div>
      <Link href="/records/new" className="secondary-button mt-4 w-full">
        ＋ 새 기록 남기기
      </Link>
      <h2 className="section-title mb-3 mt-7">최근 본 작품</h2>
      <RecordList scope="mine" />
    </CoreAppShell>
  );
}

export function SearchScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const scope = params.get('scope') === 'mine' ? 'mine' : 'friends';
  const [q, setQ] = useState(params.get('q') ?? '');
  const mediaType = (params.get('mediaType') as MediaType | null) || null;
  const viewingMethod =
    (params.get('viewingMethod') as ViewingMethod | null) || null;
  const hasFilters = Boolean(q || mediaType || viewingMethod);
  const returnParams = new URLSearchParams(params.toString());
  returnParams.set('scope', scope);
  const returnTo = `/search?${returnParams.toString()}`;
  const update = (next: {
    q?: string;
    mediaType?: MediaType | null;
    viewingMethod?: ViewingMethod | null;
  }) => {
    const p = new URLSearchParams(params.toString());
    p.set('scope', scope);
    const values = { q, mediaType, viewingMethod, ...next };
    Object.entries(values).forEach(([key, value]) =>
      value ? p.set(key, value) : p.delete(key),
    );
    router.replace(`/search?${p}`);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      const p = new URLSearchParams(params.toString());
      p.set('scope', scope);
      if (q) p.set('q', q);
      else p.delete('q');
      router.replace(`/search?${p}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [q, params, router, scope]);
  return (
    <TaskShell
      title={scope === 'mine' ? '내 기록 검색' : '친구 기록 검색'}
      fallback={scope === 'mine' ? '/me' : '/friends'}
    >
      <SearchField
        value={q}
        onChange={setQ}
        label="기록 검색"
        placeholder={
          scope === 'mine'
            ? '작품 제목으로 내 기록 찾기'
            : '작품 제목 또는 친구 이름'
        }
      />
      <section className="record-search-filters" aria-label="검색 필터">
        <div className="record-search-filter-heading">
          <div>
            <h2>필터</h2>
            <p>작품 종류와 관람 방식을 함께 선택할 수 있어요.</p>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQ('');
                router.replace(`/search?scope=${scope}`);
              }}
            >
              초기화
            </button>
          ) : null}
        </div>
        <div className="record-search-filter-row">
          <span className="field-label">작품 종류</span>
          <MediaTypeControl
            value={mediaType}
            onChange={(value) => update({ mediaType: value })}
          />
        </div>
        <div className="record-search-filter-row">
          <span className="field-label">관람 방식</span>
          <ViewingMethodControl
            includeAll
            label="관람 방식"
            value={viewingMethod}
            onChange={(value) => update({ viewingMethod: value })}
          />
        </div>
      </section>
      <div className="record-search-summary">
        <h2>검색 결과</h2>
        <span>{hasFilters ? '필터 적용 중' : '최신순'}</span>
      </div>
      <RecordList
        scope={scope}
        returnTo={returnTo}
        filters={{
          q: params.get('q') ?? undefined,
          mediaType: mediaType ?? undefined,
          viewingMethod: viewingMethod ?? undefined,
        }}
      />
    </TaskShell>
  );
}

export function RecordDetailScreen({ id }: { id: string }) {
  return <WatchEventDetailScreen id={id} />;
}
