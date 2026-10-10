'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { useActiveSpace } from '../../hooks/useActiveSpace';
import { useSpaceTimeline } from '../../hooks/useSpaceTimeline';
import { CoreApiError } from '../../lib/api/core';
import type { SpaceView } from '../../lib/api/spaces';
import {
  getPendingConfirmations,
  respondToWatchParticipation,
  type WatchEvent,
} from '../../lib/api/watch-events';
import { TimelineCard } from '../spaces/SpaceWatchGroupCard';
import { WishPickCard } from '../spaces/WishPickCard';
import { activeMembers } from '../spaces/space-ui';
import {
  pendingConfirmations,
  watchSourceSummary,
  withMyParticipation,
} from '../spaces/space-watch-model';
import { monthDayLabel } from '../../lib/dates';

const HOME_TIMELINE_LIMIT = 5;

/**
 * Home is built around the space the couple shares: what they want to watch tonight and what
 * they watched. The header's switcher says which space this is, so it is not repeated here.
 */
export function SpaceHome({ active }: { active: ReturnType<typeof useActiveSpace> }) {
  const { state, reload } = active;

  if (state.status === 'loading')
    return (
      <div className="home-feed-loading space-home" aria-label="우리 공간 불러오는 중">
        <span />
        <span />
      </div>
    );
  if (state.status === 'error')
    return (
      <section className="home-feed-message space-home" role="status" aria-live="polite">
        <div>
          <h2>우리 공간을 불러오지 못했어요.</h2>
          <p>추천 작품은 그대로 둘러볼 수 있어요.</p>
        </div>
        <button type="button" onClick={() => void reload()}>
          다시 시도
        </button>
      </section>
    );

  const space = state.space;
  if (!space)
    return (
      <section
        className="core-card space-home space-home-start"
        data-state="no-space"
        aria-labelledby="space-home-start-title"
      >
        <h2 id="space-home-start-title">둘만의 공간을 만들어 보세요</h2>
        <p>
          공간을 만들고 초대 링크를 보내면 함께 본 작품과 서로의 별점·리뷰가 이곳에 모여요. 공간에
          들어오기 전의 개인 기록은 자동으로 공유되지 않아요.
        </p>
        <Link href="/spaces" className="primary-button">
          공간 만들기
        </Link>
      </section>
    );

  const members = activeMembers(space);
  return (
    <div className="space-home">
      <h2 className="sr-only">{space.name}</h2>
      {members.length < 2 ? (
        <p className="space-home-nudge">
          아직 혼자 있는 공간이에요.{' '}
          <Link href="/spaces">초대 링크를 만들어 함께 볼 사람을 불러 보세요.</Link>
        </p>
      ) : null}
      {members.length > 1 ? (
        <WishPickCard key={space.id} spaceId={space.id} variant="home" />
      ) : null}
      <SpaceHomeTimeline key={space.id} space={space} myAccountId={state.myAccountId} />
    </div>
  );
}

function SpaceHomeTimeline({ space, myAccountId }: { space: SpaceView; myAccountId: string }) {
  const timeline = useSpaceTimeline(space.id, HOME_TIMELINE_LIMIT);
  // Requests are fetched on their own: one older than the five newest records still shows.
  const [asked, setAsked] = useState<WatchEvent[]>([]);
  useEffect(() => {
    let active = true;
    getPendingConfirmations(space.id)
      .then(({ items }) => {
        if (active) setAsked(items);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [space.id]);
  const byId = new Map([...asked, ...timeline.items].map((event) => [event.id, event]));
  const pending = pendingConfirmations([...byId.values()], myAccountId);

  return (
    <>
      {pending.map((event) => (
        <PendingConfirmation
          key={event.id}
          event={event}
          myAccountId={myAccountId}
          onAnswered={(next) => {
            setAsked((current) => current.map((item) => (item.id === event.id ? next : item)));
            timeline.updateItem(event.id, () => next);
          }}
        />
      ))}
      <section className="space-home-timeline" aria-labelledby="space-home-timeline-title">
        <div className="home-section-heading">
          <div>
            <h2 id="space-home-timeline-title" className="section-title">
              우리 공간 타임라인
            </h2>
            <p>함께 본 작품을 서로의 별점과 함께 모았어요.</p>
          </div>
          <Link href="/spaces?view=timeline">
            전체 <span aria-hidden="true">›</span>
          </Link>
        </div>
        {timeline.status === 'loading' ? (
          <div className="home-feed-loading" aria-label="공간 타임라인 불러오는 중">
            <span />
            <span />
          </div>
        ) : timeline.status === 'error' || timeline.status === 'forbidden' ? (
          <div className="home-feed-message" role="status" aria-live="polite">
            <div>
              <h3>타임라인을 불러오지 못했어요.</h3>
              <p>
                {timeline.status === 'forbidden'
                  ? '공간에서 나왔거나 공간이 종료됐을 수 있어요.'
                  : '연결 상태를 확인하고 다시 시도해 주세요.'}
              </p>
            </div>
            <button type="button" onClick={timeline.reload}>
              다시 시도
            </button>
          </div>
        ) : timeline.status === 'empty' ? (
          <section className="core-card empty-state" data-state="empty">
            <h3>아직 함께 남긴 기록이 없어요</h3>
            <p>본 작품을 기록하면 {space.name}에 바로 공유돼요.</p>
            <Link className="primary-button" href="/records/new?step=find">
              첫 기록 남기기
            </Link>
          </section>
        ) : (
          <div className="space-y-3">
            {timeline.cards.map((events) => (
              <TimelineCard
                key={events[0].id}
                events={events}
                myAccountId={myAccountId}
                returnTo="/"
              />
            ))}
            {timeline.hasMore ? (
              <Link href="/spaces?view=timeline" className="secondary-button w-full">
                이전 기록 더 보기
              </Link>
            ) : null}
            <Link href="/spaces/memories" className="wish-pick-empty">
              <span>
                <strong>우리 기록 모아보기</strong>
                <span>올해 함께 본 작품과 1년 전 오늘을 모아 봐요.</span>
              </span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function PendingConfirmation({
  event,
  myAccountId,
  onAnswered,
}: {
  event: WatchEvent;
  myAccountId: string;
  onAnswered: (next: WatchEvent) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const author = event.author.nickname || '공간 멤버';
  const source = watchSourceSummary(event);
  const titleId = `space-confirm-${event.id}`;

  async function answer(status: 'CONFIRMED' | 'DECLINED') {
    setBusy(true);
    setError('');
    try {
      await respondToWatchParticipation(event.id, status);
      onAnswered(withMyParticipation(event, myAccountId, status));
    } catch (caught) {
      const code = caught instanceof CoreApiError ? caught.body.code : undefined;
      setError(
        code === 'WATCH_PARTICIPATION_FINALIZED'
          ? '이미 응답한 요청이에요. 새로고침하면 최신 상태가 보여요.'
          : '응답을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-confirm-card" aria-labelledby={titleId}>
      <p className="space-confirm-eyebrow">확인이 필요해요</p>
      <h2 id={titleId}>‘{event.media.title}’ 함께 보셨나요?</h2>
      <p>
        {author}님이 {monthDayLabel(event.watchedDate)}
        {source ? ` · ${source}` : ''} 기록에 나를 함께 본 사람으로 넣었어요. 맞다면 내 별점과
        리뷰도 남길 수 있어요.
      </p>
      {error ? (
        <p role="alert" className="form-error mt-2">
          {error}
        </p>
      ) : null}
      <div className="space-confirm-actions">
        <button
          type="button"
          className="primary-button"
          disabled={busy}
          onClick={() => answer('CONFIRMED')}
        >
          함께 봤어요
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={busy}
          onClick={() => answer('DECLINED')}
        >
          아니에요
        </button>
      </div>
    </section>
  );
}
