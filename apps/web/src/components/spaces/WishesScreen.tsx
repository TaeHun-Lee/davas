'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { OTT_SERVICES } from '@davas/shared';
import { useActiveSpace } from '../../hooks/useActiveSpace';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import { mediaTypeLabel } from '../../lib/api/core';
import { selectMedia, type MediaSearchResult } from '../../lib/api/media';
import { listWishes, setWish, type SpaceWishItem } from '../../lib/api/wishes';
import { AsyncState, EmptyState, Poster, SearchField, TaskShell } from '../core/CoreUi';
import { activeMembers, wantedByLabel } from './space-ui';
import { WishPickCard } from './WishPickCard';

type Filter = 'all' | 'everyone' | 'watchable';

const serviceLabels = (keys: string[]) =>
  OTT_SERVICES.filter((service) => keys.includes(service.key))
    .map((service) => service.label)
    .join(', ');

function whereText(item: SpaceWishItem) {
  const { availability } = item;
  if (availability.onSpaceServices) {
    return `구독 중인 OTT에서 볼 수 있어요 · ${serviceLabels(availability.services)}`;
  }
  if (availability.services.length) {
    return `구독하지 않은 서비스에서 볼 수 있어요 · ${serviceLabels(availability.services)}`;
  }
  if (availability.state === 'AVAILABLE') return '대여·구매로만 볼 수 있어요';
  if (availability.state === 'NO_OFFERS') return '지금은 볼 수 있는 곳이 없어요';
  return '볼 수 있는 곳을 아직 확인하지 못했어요';
}

export function WishesScreen() {
  const { state } = useActiveSpace();
  const [items, setItems] = useState<SpaceWishItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [filter, setFilter] = useState<Filter>('all');
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [pickKey, setPickKey] = useState(0);
  const space = state.status === 'ready' ? state.space : null;

  const load = useCallback(async () => {
    if (!space) return;
    setStatus('loading');
    try {
      setItems((await listWishes(space.id)).items);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [space]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggle(mediaId: string, wanted: boolean) {
    if (!space) return;
    setBusyId(mediaId);
    setError('');
    try {
      await setWish(space.id, mediaId, wanted);
      await load();
      setPickKey((key) => key + 1);
    } catch {
      setError('목록을 바꾸지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusyId('');
    }
  }

  if (state.status === 'loading')
    return (
      <TaskShell title="같이 보고 싶어요" fallback="/spaces">
        <AsyncState kind="loading" loadingLabel="공간 불러오는 중" />
      </TaskShell>
    );
  if (state.status === 'error' || !space)
    return (
      <TaskShell title="같이 보고 싶어요" fallback="/spaces">
        <EmptyState
          title={state.status === 'error' ? '공간을 불러오지 못했어요' : '먼저 공간이 필요해요'}
          description="같이 보고 싶어요 목록은 공간 사람들과 함께 채워요."
          action={
            <Link className="primary-button" href="/spaces">
              공간으로 가기
            </Link>
          }
        />
      </TaskShell>
    );

  const memberCount = activeMembers(space).length;
  const everyoneLabel = memberCount === 2 ? '둘 다' : '모두';
  const unwatched = items.filter((item) => !item.watched);
  const counts = {
    all: items.length,
    everyone: unwatched.filter((item) => item.wantedByAll).length,
    watchable: unwatched.filter((item) => item.availability.onSpaceServices).length,
  };
  const visible = items.filter((item) =>
    filter === 'everyone'
      ? item.wantedByAll && !item.watched
      : filter === 'watchable'
        ? item.availability.onSpaceServices && !item.watched
        : true,
  );

  return (
    <TaskShell title="같이 보고 싶어요" fallback="/spaces">
      <p className="wishes-intro">
        &lsquo;{space.name}&rsquo; 공간에서 함께 채우는 목록이에요. {everyoneLabel} 담으면 표시돼요.
      </p>
      <WishPickCard spaceId={space.id} variant="list" refreshKey={pickKey} />

      <div className="wishes-toolbar">
        <div role="group" aria-label="목록 보기 방식" className="wishes-filter">
          {(
            [
              ['all', `전체 ${counts.all}`],
              ['everyone', `${everyoneLabel} ${counts.everyone}`],
              ['watchable', `볼 수 있음 ${counts.watchable}`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="secondary-button wishes-add-toggle"
          aria-expanded={adding}
          onClick={() => setAdding((value) => !value)}
        >
          {adding ? '담기 닫기' : '＋ 작품 담기'}
        </button>
      </div>

      {adding ? <WishSearch onAdd={(mediaId) => toggle(mediaId, true)} /> : null}

      {error ? (
        <p role="alert" className="form-error mt-3">
          {error}
        </p>
      ) : null}

      {status === 'loading' && !items.length ? (
        <AsyncState kind="loading" loadingLabel="같이 보고 싶어요 목록 불러오는 중" />
      ) : status === 'error' ? (
        <AsyncState kind="error" onRetry={load} errorTitle="목록을 불러오지 못했어요" />
      ) : !items.length ? (
        <EmptyState
          title="아직 담긴 작품이 없어요"
          description="보고 싶은 작품을 담아 두면, 함께 볼 때 여기서 바로 골라요."
          action={
            <button type="button" className="primary-button" onClick={() => setAdding(true)}>
              첫 작품 담기
            </button>
          }
        />
      ) : !visible.length ? (
        <p className="page-description mt-4">이 조건에 맞는 작품이 아직 없어요.</p>
      ) : (
        <ul className="wishes-list" aria-label="같이 보고 싶어요 목록">
          {visible.map((item) => (
            <li key={item.media.id} data-watched={item.watched || undefined}>
              <Poster url={item.media.posterUrl} title={item.media.title} />
              <div className="min-w-0">
                <div className="wishes-title-row">
                  <strong>{item.media.title}</strong>
                  <span
                    className="wishes-who"
                    role="img"
                    aria-label={wantedByLabel(
                      item.wantedBy.map((person) => ({
                        isMe: person.accountId === state.myAccountId,
                        nickname: person.nickname,
                      })),
                    )}
                  >
                    {item.wantedBy.map((person) => (
                      <span
                        key={person.accountId}
                        aria-hidden="true"
                        data-me={person.accountId === state.myAccountId || undefined}
                      >
                        {person.accountId === state.myAccountId
                          ? '나'
                          : (person.nickname || '멤').slice(0, 1)}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="wishes-meta">
                  {[mediaTypeLabel(item.media.mediaType), item.media.releaseYear]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className="wishes-badges">
                  {item.watched ? <span data-tone="done">봤어요</span> : null}
                  {item.wantedByAll && !item.watched ? (
                    <span data-tone="everyone">{everyoneLabel} 보고 싶어요</span>
                  ) : null}
                  <span
                    className="wishes-where"
                    data-ok={item.availability.onSpaceServices || undefined}
                  >
                    {whereText(item)}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="wishes-toggle"
                aria-pressed={item.wantedByMe}
                disabled={busyId === item.media.id}
                onClick={() => void toggle(item.media.id, !item.wantedByMe)}
                aria-label={
                  item.wantedByMe
                    ? `${item.media.title} 내 담기 취소`
                    : `${item.media.title} 나도 보고 싶어요`
                }
              >
                {item.wantedByMe ? '담음' : '나도'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="wishes-source">
        볼 수 있는 곳 정보: TMDB(JustWatch 제공). 서비스 사정에 따라 실제와 다를 수 있어요.
      </p>
    </TaskShell>
  );
}

// Adding a title twice is harmless: the server keeps one wish per person and title.
function WishSearch({ onAdd }: { onAdd: (mediaId: string) => Promise<void> }) {
  const [query, setQuery] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const results = useMediaSearch(query, 'multi');

  async function add(item: MediaSearchResult) {
    const key = `${item.mediaType}-${item.externalId}`;
    setBusyKey(key);
    setError('');
    try {
      const selected = await selectMedia(item);
      await onAdd(selected.id);
    } catch {
      setError('작품을 담지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusyKey('');
    }
  }

  return (
    <section className="core-card wishes-search" aria-label="같이 볼 작품 찾기">
      <SearchField
        value={query}
        onChange={setQuery}
        label="담을 작품 제목"
        placeholder="영화나 드라마 제목"
      />
      {error ? (
        <p role="alert" className="form-error mt-2">
          {error}
        </p>
      ) : null}
      {results.status === 'idle' ? (
        <p className="page-description">제목을 두 글자 이상 입력해 주세요.</p>
      ) : results.status === 'searching' && !results.items.length ? (
        <p className="page-description">찾는 중…</p>
      ) : results.status === 'empty' ? (
        <p className="page-description">맞는 작품을 찾지 못했어요.</p>
      ) : results.status === 'error' ? (
        <p className="form-error mt-2">검색하지 못했어요.</p>
      ) : (
        <ul className="wishes-search-results">
          {results.items.slice(0, 8).map((item) => {
            const key = `${item.mediaType}-${item.externalId}`;
            return (
              <li key={key}>
                <Poster url={item.posterUrl} title={item.title} />
                <div className="min-w-0">
                  <strong>{item.title}</strong>
                  <span>
                    {[mediaTypeLabel(item.mediaType), item.releaseDate?.slice(0, 4)]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={busyKey === key}
                  onClick={() => void add(item)}
                  aria-label={`${item.title} 같이 보고 싶어요에 담기`}
                >
                  {busyKey === key ? '담는 중…' : '담기'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
