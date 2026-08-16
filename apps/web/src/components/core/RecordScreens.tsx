'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { MediaType, ViewingMethod } from '@davas/shared';
import {
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
  TaskShell,
  ViewingMethodControl,
} from './CoreUi';
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
  const load = useCallback(
    async (next?: string) => {
      try {
        if (next) setMoreBusy(true);
        else setStatus('loading');
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
      } catch {
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
    moreBusy,
    retry: () => setKey((value) => value + 1),
    loadMore: () => cursor && load(cursor),
  };
}

function RecordList({
  scope,
  filters = {},
}: {
  scope: 'friends' | 'mine';
  filters?: {
    q?: string;
    mediaType?: MediaType;
    viewingMethod?: ViewingMethod;
  };
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
    return <AsyncState kind="error" onRetry={data.retry} />;
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
            href={noFriends ? '/friends' : '/records/new'}
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
            returnTo={scope === 'mine' ? '/me' : '/'}
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
      <h1 className="page-title">친구 기록</h1>
      <p className="page-description">
        친구들과 최근 본 작품과 감상을 나눠보세요.
      </p>
      <div className="mt-5">
        <Link href="/search?scope=friends" aria-label="친구 기록 검색">
          <SearchField
            value=""
            onChange={() => undefined}
            label="친구 기록 검색"
            placeholder="작품이나 친구 이름으로 기록 찾기"
          />
        </Link>
      </div>
      <Link href="/records/new" className="wide-cta mt-4">
        <span>＋ 본 작품 기록하기</span>
        <span aria-hidden="true">›</span>
      </Link>
      <h2 className="section-title mb-3 mt-7">최근 공유된 기록</h2>
      <RecordList scope="friends" />
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
      fallback={scope === 'mine' ? '/me' : '/'}
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
      <div className="mt-5">
        <span className="field-label">작품 종류</span>
        <MediaTypeControl
          value={mediaType}
          onChange={(value) => update({ mediaType: value })}
        />
      </div>
      <div className="mt-4">
        <span className="field-label">본 곳</span>
        <ViewingMethodControl
          includeAll
          value={viewingMethod}
          onChange={(value) => update({ viewingMethod: value })}
        />
      </div>
      <p className="page-description mb-4 mt-5">
        검색어와 두 필터를 모두 만족하는 기록이에요.
      </p>
      <RecordList
        scope={scope}
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
