'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { CoreApiError } from '../../lib/api/core';
import {
  compareSpaceReactions,
  getSpaceTimeline,
  type SpaceReactionComparison,
  type WatchEvent,
} from '../../lib/api/watch-events';

export function SpaceTimeline({
  spaceId,
  spaceName,
}: {
  spaceId: string;
  spaceName: string;
}) {
  const [items, setItems] = useState<WatchEvent[]>([]);
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'empty' | 'forbidden' | 'error'
  >('loading');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [moreBusy, setMoreBusy] = useState(false);
  const [comparison, setComparison] =
    useState<SpaceReactionComparison | null>(null);
  const [comparisonBusy, setComparisonBusy] = useState(false);
  const [comparisonError, setComparisonError] = useState('');

  const load = useCallback(
    async (nextCursor?: string) => {
      if (nextCursor) setMoreBusy(true);
      else setStatus('loading');
      try {
        const page = await getSpaceTimeline(spaceId, {
          cursor: nextCursor,
          limit: 20,
        });
        setItems((current) =>
          nextCursor ? [...current, ...page.items] : page.items,
        );
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus(
          page.items.length || nextCursor ? 'ready' : 'empty',
        );
      } catch (error) {
        setStatus(
          error instanceof CoreApiError && error.status === 404
            ? 'forbidden'
            : 'error',
        );
      } finally {
        setMoreBusy(false);
      }
    },
    [spaceId],
  );

  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(false);
    setComparison(null);
    void load();
  }, [load]);

  async function showComparison(mediaId: string) {
    setComparisonBusy(true);
    setComparisonError('');
    try {
      setComparison(await compareSpaceReactions(spaceId, mediaId));
    } catch (error) {
      setComparison(null);
      setComparisonError(
        error instanceof CoreApiError && error.status === 404
          ? '공간을 찾을 수 없거나 더 이상 접근할 수 없어요.'
          : '구성원 반응을 불러오지 못했어요.',
      );
    } finally {
      setComparisonBusy(false);
    }
  }

  return (
    <section
      className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
      aria-labelledby="active-space-timeline-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="active-space-timeline-title" className="text-[17px] font-black text-[#284778]">
            활성 공간 타임라인
          </h2>
          <p className="mt-1 text-[12px] font-bold text-[#8190a5]">
            {spaceName}에 명시적으로 공유된 감상만 보여요.
          </p>
        </div>
        <Link
          href="/records/new"
          className="inline-flex min-h-11 items-center rounded-xl bg-[#456ca8] px-3 text-[12px] font-black text-white"
        >
          감상 기록
        </Link>
      </div>

      {status === 'loading' ? (
        <div data-state="loading" className="mt-4 space-y-3" aria-label="공간 타임라인 불러오는 중">
          {[0, 1].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-[#f2f5fa] motion-reduce:animate-none" />
          ))}
        </div>
      ) : null}
      {status === 'empty' ? (
        <div data-state="empty" className="mt-4 rounded-2xl bg-[#f7f9fd] p-5 text-center">
          <p className="text-[14px] font-black text-[#344866]">아직 공유된 감상이 없어요.</p>
          <p className="mt-2 text-[12px] font-bold leading-5 text-[#7b8799]">
            기록 작성에서 이 공간을 선택하면 그 기록만 여기에 나타나요.
          </p>
        </div>
      ) : null}
      {status === 'forbidden' ? (
        <div data-state="forbidden" className="mt-4 rounded-2xl bg-[#fff1f0] p-4 text-center">
          <p className="text-[13px] font-black text-[#a93530]">
            공간을 찾을 수 없거나 접근 권한이 없어요.
          </p>
          <p className="mt-2 text-[12px] font-bold text-[#8b5b57]">
            탈퇴하거나 공간이 종료되면 타임라인과 공유 감상 접근이 즉시 차단돼요.
          </p>
        </div>
      ) : null}
      {status === 'error' ? (
        <div data-state="error" className="mt-4 rounded-2xl bg-[#fff8f7] p-4 text-center">
          <p className="text-[13px] font-black text-[#a93530]">타임라인을 불러오지 못했어요.</p>
          <button type="button" className="secondary-button mt-3" onClick={() => load()}>
            다시 시도
          </button>
        </div>
      ) : null}

      {status === 'ready' ? (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl bg-[#f7f9fd] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-[#607eae]">
                    {item.author.nickname || '공간 멤버'} · {item.watchedDate}
                  </p>
                  <h3 className="mt-1 truncate text-[16px] font-black text-[#284778]">
                    {item.media.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-black text-[#5575a6]">
                  반응 {item.reactions.length}
                </span>
              </div>
              <p className="mt-2 text-[12px] font-bold text-[#738096]">
                참여 확인 {item.participants.filter((participant) => participant.status === 'CONFIRMED').length}명
                {item.participants.some((participant) => participant.status === 'PENDING')
                  ? ' · 응답 대기 있음'
                  : ''}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/records/${item.id}?returnTo=${encodeURIComponent('/spaces')}`}
                  className="secondary-button"
                >
                  상세·참여 응답
                </Link>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={comparisonBusy}
                  onClick={() => showComparison(item.media.id)}
                >
                  구성원 반응 비교
                </button>
              </div>
            </article>
          ))}
          {hasMore && cursor ? (
            <button
              type="button"
              className="secondary-button w-full"
              disabled={moreBusy}
              onClick={() => load(cursor)}
            >
              {moreBusy ? '불러오는 중…' : '이전 감상 더 보기'}
            </button>
          ) : null}
        </div>
      ) : null}

      {comparisonError ? (
        <p role="alert" className="mt-4 rounded-2xl bg-[#fff1f0] p-3 text-[12px] font-bold text-[#a93530]">
          {comparisonError}
        </p>
      ) : null}
      {comparison ? (
        <section className="mt-4 rounded-2xl border border-[#dce4ef] bg-white p-4" aria-label="작품별 구성원 반응 비교">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[14px] font-black text-[#284778]">작품별 구성원 반응</h3>
            <button type="button" className="text-[12px] font-black text-[#607eae]" onClick={() => setComparison(null)}>
              닫기
            </button>
          </div>
          {comparison.events.length ? (
            <div className="mt-3 space-y-3">
              {comparison.events.map((event) => (
                <article key={event.watchEventId} className="rounded-xl bg-[#f7f9fd] p-3">
                  <p className="text-[12px] font-black text-[#607eae]">{event.watchedDate} 감상</p>
                  {event.reactions.length ? (
                    <ul className="mt-2 space-y-2">
                      {event.reactions.map((reaction) => (
                        <li key={reaction.accountId} className="rounded-xl bg-white p-3 text-[12px] text-[#52677e]">
                          <strong>{reaction.nickname || '공간 멤버'}</strong>
                          <span className="ml-2 font-black text-[#2f6fb4]">
                            {reaction.rating === null ? '별점 없음' : `${reaction.rating.toFixed(1)}점`}
                          </span>
                          <p className="mt-1 whitespace-pre-wrap font-semibold">
                            {reaction.review || '리뷰 없음'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-[12px] font-bold text-[#8190a5]">확인된 참여자의 반응이 아직 없어요.</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[12px] font-bold text-[#8190a5]">비교할 공유 감상이 없어요.</p>
          )}
        </section>
      ) : null}
    </section>
  );
}
