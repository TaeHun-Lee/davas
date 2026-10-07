'use client';

import { useState } from 'react';
import { useSpaceTimeline } from '../../hooks/useSpaceTimeline';
import { CoreApiError } from '../../lib/api/core';
import {
  compareSpaceReactions,
  type SpaceReactionComparison,
  type WatchReaction,
} from '../../lib/api/watch-events';
import { TimelineCard } from './SpaceWatchGroupCard';
import { watchedDayLabel } from './space-watch-model';

/** One person's reaction in the comparison panel, with the same blind and spoiler rules as the cards. */
function ComparedReaction({ reaction, isMe }: { reaction: WatchReaction; isMe: boolean }) {
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const name = isMe ? '나' : reaction.nickname || '공간 멤버';
  if (reaction.locked) {
    return (
      <li
        className="rounded-xl bg-white p-3 text-[12px] text-[#52677e]"
        aria-label={`${name}님 리뷰, 잠겨 있음`}
      >
        <strong>{name}</strong>
        <span className="ml-2 font-black text-[#2f6fb4]" role="img" aria-label="별점 가려짐">
          ★ ?.?
        </span>
        <p className="mt-1 font-semibold">잠긴 리뷰예요</p>
      </li>
    );
  }
  const hasText = Boolean(reaction.headline || reaction.review);
  const hidden = reaction.hasSpoiler && !spoilerOpen && !isMe;
  return (
    <li className="rounded-xl bg-white p-3 text-[12px] text-[#52677e]">
      <strong>{name}</strong>
      <span className="ml-2 font-black text-[#2f6fb4]">
        {reaction.rating === null ? '별점 없음' : `★ ${reaction.rating.toFixed(1)}`}
      </span>
      {!hasText ? (
        <p className="mt-1 font-semibold">리뷰 없음</p>
      ) : hidden ? (
        <button
          type="button"
          className="mt-1 block font-black text-[var(--blue-ink)]"
          onClick={() => setSpoilerOpen(true)}
        >
          스포일러가 있어요 · 눌러서 보기
        </button>
      ) : (
        <>
          {reaction.headline ? (
            <p className="mt-1 font-black text-[var(--heading)]">{reaction.headline}</p>
          ) : null}
          {reaction.review ? (
            <p className="mt-1 whitespace-pre-wrap font-semibold">{reaction.review}</p>
          ) : null}
        </>
      )}
    </li>
  );
}

export function SpaceTimeline({
  spaceId,
  spaceName,
  myAccountId,
}: {
  spaceId: string;
  spaceName: string;
  myAccountId: string;
}) {
  const timeline = useSpaceTimeline(spaceId);
  const { cards, status, cursor, hasMore, moreBusy, moreError } = timeline;
  const [comparison, setComparison] = useState<SpaceReactionComparison | null>(null);
  const [comparisonBusy, setComparisonBusy] = useState(false);
  const [comparisonError, setComparisonError] = useState('');

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
    // Its own screen under the "우리 공간 타임라인" header, so the cards sit on the page.
    <section aria-labelledby="space-timeline-title">
      <h1 id="space-timeline-title" className="sr-only">
        우리 공간 타임라인
      </h1>
      <p className="text-[13px] font-bold text-[var(--muted)]">
        {spaceName}에 공유된 기록만 보여요. 같은 작품은 한 카드로 모아 보여요.
      </p>

      {status === 'loading' ? (
        <div data-state="loading" className="mt-4 space-y-3" aria-label="공간 타임라인 불러오는 중">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-[#f2f5fa] motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : null}
      {status === 'empty' ? (
        <div data-state="empty" className="mt-4 rounded-2xl bg-[#f7f9fd] p-5 text-center">
          <p className="text-[14px] font-black text-[var(--heading)]">아직 공유된 감상이 없어요.</p>
          <p className="mt-2 text-[12px] font-bold leading-5 text-[var(--muted)]">
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
          <button type="button" className="secondary-button mt-3" onClick={timeline.reload}>
            다시 시도
          </button>
        </div>
      ) : null}

      {status === 'ready' ? (
        <div className="mt-4 space-y-3">
          {cards.map((events) => (
            <TimelineCard
              key={events[0].id}
              events={events}
              myAccountId={myAccountId}
              returnTo="/spaces"
              actions={
                <button
                  type="button"
                  className="secondary-button"
                  disabled={comparisonBusy}
                  onClick={() => showComparison(events[0].media.id)}
                >
                  구성원 반응 비교
                </button>
              }
            />
          ))}
          {hasMore && cursor ? (
            <button
              type="button"
              className="secondary-button w-full"
              disabled={moreBusy}
              onClick={timeline.loadMore}
            >
              {moreBusy ? '불러오는 중…' : '이전 감상 더 보기'}
            </button>
          ) : null}
          {moreError ? (
            <p role="alert" className="text-center text-[12px] font-bold text-[#a93530]">
              이전 감상을 더 불러오지 못했어요. 다시 눌러 주세요.
            </p>
          ) : null}
        </div>
      ) : null}

      {comparisonError ? (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-[#fff1f0] p-3 text-[12px] font-bold text-[#a93530]"
        >
          {comparisonError}
        </p>
      ) : null}
      {comparison ? (
        <section
          className="mt-4 rounded-2xl border border-[#dce4ef] bg-white p-4"
          aria-label="작품별 구성원 반응 비교"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[14px] font-black text-[var(--heading)]">작품별 구성원 반응</h3>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[13px] font-black text-[var(--blue-ink)]"
              onClick={() => setComparison(null)}
            >
              닫기
            </button>
          </div>
          {comparison.events.length ? (
            <div className="mt-3 space-y-3">
              {comparison.events.map((event) => (
                <article key={event.watchEventId} className="rounded-xl bg-[#f7f9fd] p-3">
                  <p className="text-[12px] font-black text-[var(--blue-ink)]">
                    {watchedDayLabel(event.watchedDate)} 감상
                  </p>
                  {event.reactions.length ? (
                    <ul className="mt-2 space-y-2">
                      {event.reactions.map((reaction) => (
                        <ComparedReaction
                          key={reaction.accountId}
                          reaction={reaction}
                          isMe={reaction.accountId === myAccountId}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-[12px] font-bold text-[var(--muted)]">
                      확인된 참여자의 반응이 아직 없어요.
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[12px] font-bold text-[var(--muted)]">
              비교할 공유 감상이 없어요.
            </p>
          )}
        </section>
      ) : null}
    </section>
  );
}
