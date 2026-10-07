'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  MediaType,
  WatchSearchResponse,
  WatchSearchScope,
  WatchSourceKind,
} from '@davas/shared';
import { useActiveSpace } from '../../hooks/useActiveSpace';
import { searchWatchEvents } from '../../lib/api/watch-events';
import { watchCardSource } from '../spaces/space-watch-model';
import { AsyncState, EmptyState, Poster } from './CoreUi';
import { MATCH_LABELS, searchSnippet } from './record-search-model';

type Item = WatchSearchResponse['items'][number];

/**
 * Results of a record search over my records (`mine`) or the active space's (`space`): the
 * title, when and how it was watched, and where the words were found.
 */
export function WatchSearchResults({
  scope,
  q,
  mediaType,
  sourceKind,
  returnTo,
  onCount,
}: {
  scope: WatchSearchScope;
  q: string;
  mediaType: MediaType | null;
  sourceKind: WatchSourceKind | null;
  returnTo: string;
  /** "2개", or "20개 이상" while more pages wait; null while nothing is shown. */
  onCount?: (label: string | null) => void;
}) {
  const { state } = useActiveSpace();
  const spaceId = state.status === 'ready' ? (state.space?.id ?? null) : null;
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [moreBusy, setMoreBusy] = useState(false);
  // Typing quickly must not let an older answer land last.
  const latestRequest = useRef(0);
  const waitingForSpace = scope === 'space' && state.status === 'loading';
  const noSpace = scope === 'space' && state.status !== 'loading' && !spaceId;

  const load = useCallback(
    async (next?: string) => {
      if (waitingForSpace || noSpace) return;
      const request = ++latestRequest.current;
      if (next) setMoreBusy(true);
      else setStatus('loading');
      try {
        const page = await searchWatchEvents({
          scope,
          spaceId: scope === 'space' ? (spaceId ?? undefined) : undefined,
          q: q || undefined,
          mediaType: mediaType ?? undefined,
          sourceKind: sourceKind ?? undefined,
          cursor: next,
          limit: 20,
        });
        if (request !== latestRequest.current) return;
        setItems((current) => (next ? [...current, ...page.items] : page.items));
        setCursor(page.nextCursor);
        setStatus('ready');
      } catch {
        if (request === latestRequest.current) setStatus('error');
      } finally {
        setMoreBusy(false);
      }
    },
    [scope, spaceId, q, mediaType, sourceKind, waitingForSpace, noSpace],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    onCount?.(status === 'ready' ? `${items.length}개${cursor ? ' 이상' : ''}` : null);
  }, [onCount, status, items.length, cursor]);

  if (noSpace)
    return (
      <EmptyState
        title="먼저 공간이 필요해요"
        description="공간에 공유한 기록을 이 범위에서 찾을 수 있어요."
        action={
          <Link className="primary-button" href="/spaces">
            공간으로 가기
          </Link>
        }
      />
    );
  if (status === 'loading' || waitingForSpace) return <AsyncState kind="loading" />;
  if (status === 'error')
    return (
      <EmptyState
        title="기록을 찾지 못했어요"
        description="연결 상태를 확인하고 다시 시도해 주세요."
        action={
          <button type="button" className="secondary-button" onClick={() => void load()}>
            다시 시도
          </button>
        }
      />
    );
  if (!items.length)
    return (
      <EmptyState
        title={q ? `‘${q}’에 맞는 기록이 없어요` : '조건에 맞는 기록이 없어요'}
        description="제목, 함께 본 사람, 장소, OTT, 추억 메모, 리뷰에서 찾아요."
      />
    );

  return (
    <>
      <ul className="search-results" aria-label="검색 결과">
        {items.map(({ watchEvent, match }) => {
          const snippet = match && match.field !== 'title' ? searchSnippet(match.text, q) : null;
          return (
            <li key={watchEvent.id}>
              <Link
                href={`/records/${encodeURIComponent(watchEvent.id)}?returnTo=${encodeURIComponent(returnTo)}`}
                className="search-result"
              >
                <Poster url={watchEvent.media.posterUrl} title={watchEvent.media.title} />
                <span className="min-w-0">
                  <strong>{watchEvent.media.title}</strong>
                  <span>{watchCardSource(watchEvent).line}</span>
                  <span>
                    {watchEvent.isMine
                      ? '내 기록'
                      : `${watchEvent.author.nickname || '공간 멤버'}님 기록`}
                  </span>
                  {snippet ? (
                    <span className="search-match">
                      <b>{MATCH_LABELS[match!.field]}</b> {snippet.before}
                      {snippet.hit ? <mark>{snippet.hit}</mark> : null}
                      {snippet.after}
                    </span>
                  ) : null}
                </span>
                <span aria-hidden="true">›</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {cursor ? (
        <button
          type="button"
          className="secondary-button mt-4 w-full"
          disabled={moreBusy}
          onClick={() => void load(cursor)}
        >
          {moreBusy ? '불러오는 중…' : '더 보기'}
        </button>
      ) : null}
    </>
  );
}
