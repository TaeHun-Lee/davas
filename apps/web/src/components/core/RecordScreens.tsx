'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { MediaType, ViewingMethod, WatchSourceKind } from '@davas/shared';
import { CoreApiError, listRecords, type RecordCardData } from '../../lib/api/core';
import { getFriends } from '../../lib/api/friends';
import {
  AsyncState,
  CoreAppShell,
  EmptyState,
  MediaTypeControl,
  RecordCard,
  SearchField,
  TaskShell,
  ViewingMethodControl,
} from './CoreUi';
import { useActiveSpace } from '../../hooks/useActiveSpace';
import { SpaceSwitcher } from '../spaces/SpaceSwitcher';
import { HomeRecommendations } from './HomeRecommendations';
import { SpaceHome } from './SpaceHome';
import { WatchEventDetailScreen } from './WatchEventDetailScreen';
import { WatchSearchResults } from './WatchSearchResults';

type SearchScope = 'mine' | 'space' | 'friends';

const SCOPES: Array<{ value: SearchScope; label: string }> = [
  { value: 'mine', label: '내 기록' },
  { value: 'space', label: '우리 공간' },
  { value: 'friends', label: '친구' },
];

const SOURCE_KINDS: Array<{ value: WatchSourceKind | null; label: string }> = [
  { value: null, label: '전체' },
  { value: 'THEATER', label: '극장' },
  { value: 'OTT', label: 'OTT' },
  { value: 'TV_OWNED', label: 'TV·소장' },
  { value: 'OTHER', label: '기타' },
];

function useRecords(
  scope: 'friends' | 'mine',
  filters: { q?: string; mediaType?: MediaType; viewingMethod?: ViewingMethod },
) {
  const { q, mediaType, viewingMethod } = filters;
  const [items, setItems] = useState<RecordCardData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
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
  returnTo,
}: {
  scope: 'friends' | 'mine';
  filters?: {
    q?: string;
    mediaType?: MediaType;
    viewingMethod?: ViewingMethod;
  };
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
  if (data.status === 'loading') return <AsyncState kind="loading" />;
  if (data.status === 'error')
    return (
      <section role="status" aria-live="polite">
        <EmptyState
          title={
            scope === 'friends' ? '친구 기록을 불러오지 못했어요' : '내 기록을 불러오지 못했어요'
          }
          description={
            data.error?.status && data.error.status >= 500
              ? '서버에서 기록을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.'
              : '연결 상태를 확인하고 다시 시도해 주세요.'
          }
          action={
            <button type="button" className="secondary-button" onClick={data.retry}>
              다시 시도
            </button>
          }
        />
      </section>
    );
  if (!data.items.length) {
    const filtered = Boolean(filters.q || filters.mediaType || filters.viewingMethod);
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
          <Link className="primary-button" href={noFriends ? '/friends' : '/records/new?step=find'}>
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

/**
 * Home, as on the C안 board: the space switcher in the header, then the space's quick pick,
 * timeline and recommendations. Recording starts from the bottom bar's 기록하기.
 */
export function FeedScreen() {
  const active = useActiveSpace();
  return (
    <CoreAppShell headerLead={<SpaceSwitcher state={active.state} onSelect={active.select} />}>
      <h1 className="sr-only">홈</h1>
      <SpaceHome active={active} />
      <HomeRecommendations />
    </CoreAppShell>
  );
}

export function MineScreen() {
  return (
    <CoreAppShell>
      <h1 className="page-title">내 기록</h1>
      <p className="page-description">공개 여부와 관계없이 내가 본 작품을 모아봐요.</p>
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

/**
 * Record search. 내 기록 and 우리 공간 search titles, the people on a record, place, service,
 * memory notes and reviews (as the viewer sees them); 친구 searches friends' older records.
 */
export function SearchScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const rawScope = params.get('scope');
  const scope: SearchScope =
    rawScope === 'friends' ? 'friends' : rawScope === 'space' ? 'space' : 'mine';
  const [q, setQ] = useState(params.get('q') ?? '');
  const mediaType = (params.get('mediaType') as MediaType | null) || null;
  const viewingMethod = (params.get('viewingMethod') as ViewingMethod | null) || null;
  const sourceKind = (params.get('sourceKind') as WatchSourceKind | null) || null;
  const hasFilters = Boolean(q || mediaType || (scope === 'friends' ? viewingMethod : sourceKind));
  // Words alone are not a filter; the chips are.
  const filterOn = Boolean(mediaType || (scope === 'friends' ? viewingMethod : sourceKind));
  const [countLabel, setCountLabel] = useState<string | null>(null);
  const returnParams = new URLSearchParams(params.toString());
  returnParams.set('scope', scope);
  const returnTo = `/search?${returnParams.toString()}`;
  const update = (next: {
    q?: string;
    mediaType?: MediaType | null;
    viewingMethod?: ViewingMethod | null;
    sourceKind?: WatchSourceKind | null;
  }) => {
    const p = new URLSearchParams(params.toString());
    p.set('scope', scope);
    const values = { q, mediaType, viewingMethod, sourceKind, ...next };
    Object.entries(values).forEach(([key, value]) => (value ? p.set(key, value) : p.delete(key)));
    router.replace(`/search?${p}`);
  };
  // A new scope keeps the words and the title type; the way-watched filter differs per scope.
  const changeScope = (next: SearchScope) => {
    const p = new URLSearchParams();
    p.set('scope', next);
    if (q) p.set('q', q);
    if (mediaType) p.set('mediaType', mediaType);
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
      title={scope === 'friends' ? '친구 기록 검색' : '기록 검색'}
      fallback={scope === 'friends' ? '/friends' : '/me'}
    >
      <div className="segmented record-search-scope" role="group" aria-label="검색 범위">
        {SCOPES.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={scope === option.value}
            onClick={() => changeScope(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <SearchField
        value={q}
        onChange={setQ}
        label="기록 검색"
        placeholder={
          scope === 'friends' ? '작품 제목 또는 친구 이름' : '제목, 함께 본 사람, 장소, 메모, 리뷰'
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
          <MediaTypeControl value={mediaType} onChange={(value) => update({ mediaType: value })} />
        </div>
        <div className="record-search-filter-row">
          <span className="field-label">관람 방식</span>
          {scope === 'friends' ? (
            <ViewingMethodControl
              includeAll
              label="관람 방식"
              value={viewingMethod}
              onChange={(value) => update({ viewingMethod: value })}
            />
          ) : (
            <div className="segmented" role="group" aria-label="관람 방식">
              {SOURCE_KINDS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={sourceKind === option.value}
                  onClick={() => update({ sourceKind: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="record-search-summary">
        <h2>검색 결과</h2>
        {scope === 'friends' ? (
          <span>{filterOn ? '필터 적용 중' : '최신순'}</span>
        ) : countLabel ? (
          <span>{countLabel}</span>
        ) : null}
      </div>
      {scope === 'friends' ? (
        <RecordList
          scope="friends"
          returnTo={returnTo}
          filters={{
            q: params.get('q') ?? undefined,
            mediaType: mediaType ?? undefined,
            viewingMethod: viewingMethod ?? undefined,
          }}
        />
      ) : (
        <WatchSearchResults
          scope={scope}
          q={params.get('q') ?? ''}
          mediaType={mediaType}
          sourceKind={sourceKind}
          returnTo={returnTo}
          onCount={setCountLabel}
        />
      )}
    </TaskShell>
  );
}

export function RecordDetailScreen({ id }: { id: string }) {
  return <WatchEventDetailScreen id={id} />;
}
