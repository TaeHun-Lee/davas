'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { WATCH_HEADLINE_MAX_LENGTH, WATCH_REVIEW_MAX_LENGTH } from '@davas/shared';
import { getMe } from '../../lib/api/auth';
import { CoreApiError } from '../../lib/api/core';
import {
  deleteWatchEvent,
  getWatchEvent,
  listWatchComments,
  respondToWatchParticipation,
  saveWatchReaction,
  type WatchCommentView,
  type WatchEvent,
  type WatchParticipantStatus,
  type WatchSourceKind,
} from '../../lib/api/watch-events';
import { CountedField, THEATER_FORMAT_LABELS, ToggleSwitch } from './ComposerFields';
import { AsyncState, EmptyState, Poster, TaskShell } from './CoreUi';
import { WatchPhotoGallery } from './WatchPhotoGallery';
import { CommentsSection, ReviewCard } from './WatchReviews';
import { WatchRatingControl } from './WatchRatingControl';

const sourceLabels: Record<WatchSourceKind, string> = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV/소장',
  OTHER: '기타',
};

const participantLabels: Record<WatchParticipantStatus, string> = {
  PENDING: '응답 대기',
  CONFIRMED: '참여 확인',
  DECLINED: '참여 안 함',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const safeReturn = (value: string | null, mine: boolean) => {
  if (
    value &&
    (/^\/$/.test(value) ||
      /^\/me$/.test(value) ||
      /^\/spaces$/.test(value) ||
      /^\/diary$/.test(value) ||
      /^\/search\?scope=(friends|mine)/.test(value))
  )
    return value;
  return mine ? '/me' : '/spaces';
};

function dayChip(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

function detailChips(watchEvent: WatchEvent) {
  const source = watchEvent.source;
  const chips: Array<{ label: string; accent?: boolean }> = [
    { label: dayChip(watchEvent.watchedDate) },
  ];
  if (!source) return chips;
  chips.push({ label: sourceLabels[source.kind] });
  if (source.providerName) chips.push({ label: source.providerName });
  if (source.placeText) chips.push({ label: source.placeText });
  if (source.theaterFormat && source.theaterFormat !== 'STANDARD') {
    chips.push({ label: THEATER_FORMAT_LABELS[source.theaterFormat], accent: true });
  }
  if (source.seatText) chips.push({ label: `좌석 ${source.seatText}` });
  if (source.completed) chips.push({ label: '끝까지 다 봤어요', accent: true });
  else if (source.episodeWatched) {
    chips.push({
      label: source.episodeTotal
        ? `${source.episodeTotal}화 중 ${source.episodeWatched}화까지`
        : `${source.episodeWatched}화까지`,
    });
  }
  return chips;
}

export function WatchEventDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [watchEvent, setWatchEvent] = useState<WatchEvent | null>(null);
  const [myAccountId, setMyAccountId] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [comments, setComments] = useState<WatchCommentView[]>([]);
  const [commentStatus, setCommentStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [rating, setRating] = useState<number | null>(null);
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [isBlind, setIsBlind] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadComments = useCallback(async () => {
    setCommentStatus('loading');
    try {
      setComments(await listWatchComments(id));
      setCommentStatus('ready');
    } catch {
      setCommentStatus('error');
    }
  }, [id]);

  const load = useCallback(async () => {
    setStatus('loading');
    setActionError('');
    try {
      const [nextEvent, me] = await Promise.all([getWatchEvent(id), getMe()]);
      const accountId = me.id ?? '';
      const myReaction = nextEvent.reactions.find((reaction) => reaction.accountId === accountId);
      setWatchEvent(nextEvent);
      setMyAccountId(accountId);
      setRating(myReaction?.rating ?? null);
      setHeadline(myReaction?.headline ?? '');
      setReview(myReaction?.review ?? '');
      setHasSpoiler(myReaction?.hasSpoiler ?? false);
      setIsBlind(myReaction?.isBlind ?? false);
      setStatus('ready');
    } catch (error) {
      setStatus(error instanceof CoreApiError && error.status === 404 ? 'missing' : 'error');
    }
  }, [id]);

  useEffect(() => {
    void load();
    void loadComments();
  }, [load, loadComments]);

  async function respond(nextStatus: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>) {
    if (busy) return;
    setBusy(true);
    setActionError('');
    try {
      await respondToWatchParticipation(id, nextStatus);
      setNotice(
        nextStatus === 'CONFIRMED'
          ? '함께 본 감상으로 확인했어요. 이제 내 별점과 리뷰를 남길 수 있어요.'
          : '참여 요청을 거절했어요.',
      );
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '참여 상태를 저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  async function saveReaction() {
    if (busy) return;
    setBusy(true);
    setActionError('');
    try {
      await saveWatchReaction(id, {
        rating,
        headline: headline.trim() || null,
        review: review.trim() || null,
        hasSpoiler,
        isBlind: watchEvent?.visibility === 'SPACES' && isBlind,
      });
      setNotice('내 별점과 리뷰를 저장했어요.');
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '내 반응을 저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'loading')
    return (
      <TaskShell title="감상 상세" fallback="/spaces">
        <AsyncState kind="loading" />
      </TaskShell>
    );

  if (status === 'missing')
    return (
      <TaskShell title="감상 상세" fallback="/spaces">
        <EmptyState
          title="감상을 찾을 수 없어요"
          description="존재하지 않거나 볼 권한이 없는 감상이에요. 공간에서 탈퇴했다면 공유 감상에 더 이상 접근할 수 없어요."
          action={
            <Link className="primary-button" href="/spaces">
              내 공간 확인
            </Link>
          }
        />
      </TaskShell>
    );

  if (status === 'error' || !watchEvent)
    return (
      <TaskShell title="감상 상세" fallback="/spaces">
        <AsyncState kind="error" onRetry={load} />
      </TaskShell>
    );

  const currentParticipant = watchEvent.participants.find(
    (participant) => participant.accountId === myAccountId,
  );
  const canReact = watchEvent.isMine || currentParticipant?.status === 'CONFIRMED';
  const fallback = safeReturn(params.get('returnTo'), watchEvent.isMine);
  const nameOf = (accountId: string, nickname?: string) =>
    accountId === myAccountId ? '나' : nickname || '공간 멤버';
  const watchers = watchEvent.participants.filter(
    (participant) => participant.status === 'CONFIRMED',
  );
  const myReaction = watchEvent.reactions.find((reaction) => reaction.accountId === myAccountId);
  const someoneLocked = watchEvent.reactions.some((reaction) => reaction.locked);
  // Watchers who have not written yet keep my blind review closed for them.
  const notYetWritten = watchers.filter(
    (participant) =>
      participant.accountId !== myAccountId &&
      !watchEvent.reactions.some((reaction) => reaction.accountId === participant.accountId),
  );
  const waitingFor = notYetWritten.length
    ? notYetWritten
        .map((participant) => nameOf(participant.accountId, participant.nickname))
        .join(', ')
    : null;

  return (
    <TaskShell title="기록" fallback={fallback}>
      {params.get('saved') ? (
        <p
          role="status"
          className="mb-3 rounded-2xl bg-[var(--blue-soft)] p-3 text-sm font-bold text-[var(--blue)]"
        >
          {params.get('saved') === 'space'
            ? '선택한 공간에 이 감상만 공유했어요.'
            : '개인 감상으로 저장했어요.'}
        </p>
      ) : null}
      {notice ? (
        <p
          role="status"
          className="mb-3 rounded-2xl bg-[#eef7f1] p-3 text-sm font-bold text-[#327653]"
        >
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" className="form-error mb-3">
          {actionError}
        </p>
      ) : null}

      <WatchPhotoGallery photos={watchEvent.photos} title={watchEvent.media.title} />

      <section className="record-detail-head" aria-labelledby="record-detail-title">
        <div className="flex gap-3">
          <Poster url={watchEvent.media.posterUrl} title={watchEvent.media.title} />
          <div className="min-w-0 flex-1">
            <h1 id="record-detail-title">{watchEvent.media.title}</h1>
            <p className="record-detail-type">
              {watchEvent.media.mediaType === 'TV' ? '드라마' : '영화'} ·{' '}
              {watchEvent.visibility === 'PRIVATE'
                ? '개인 기록'
                : `공간 ${watchEvent.spaceIds.length}곳 공유`}
            </p>
            {watchers.length > 1 ? (
              <p className="record-detail-together">
                함께 봤어요 ·{' '}
                {watchers
                  .map((participant) => nameOf(participant.accountId, participant.nickname))
                  .join(', ')}
              </p>
            ) : null}
          </div>
        </div>
        <ul className="record-detail-chips" aria-label="감상 정보">
          {detailChips(watchEvent).map((chip) => (
            <li key={chip.label} data-accent={chip.accent || undefined}>
              {chip.label}
            </li>
          ))}
        </ul>
      </section>

      {watchEvent.participants.length > 1 || currentParticipant?.status === 'PENDING' ? (
        <section className="core-card mt-4 p-4">
          <h2 className="section-title">함께 본 사람</h2>
          <ul className="mt-3 space-y-2">
            {watchEvent.participants.map((participant) => (
              <li
                key={participant.accountId}
                className="flex min-h-11 items-center justify-between rounded-xl bg-white px-3 text-sm font-bold shadow-sm"
              >
                <span>{nameOf(participant.accountId, participant.nickname)}</span>
                <span className="text-xs text-[var(--muted)]">
                  {participantLabels[participant.status]}
                </span>
              </li>
            ))}
          </ul>
          {currentParticipant?.status === 'PENDING' ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="secondary-button"
                disabled={busy}
                onClick={() => respond('DECLINED')}
              >
                함께 보지 않았어요
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={busy}
                onClick={() => respond('CONFIRMED')}
              >
                함께 봤어요
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="mt-6" aria-labelledby="reviews-title">
        <h2 id="reviews-title" className="section-title">
          {watchEvent.visibility === 'SPACES' ? '우리 리뷰' : '내 리뷰'}
        </h2>
        {watchEvent.reactions.length ? (
          <div className="mt-3 space-y-3">
            {watchEvent.reactions.map((reaction) => (
              <ReviewCard
                key={reaction.accountId}
                watchEventId={watchEvent.id}
                reaction={reaction}
                name={nameOf(reaction.accountId, reaction.nickname)}
                isMe={reaction.accountId === myAccountId}
                waitingFor={waitingFor}
                onLikeChange={(next) =>
                  setWatchEvent({
                    ...watchEvent,
                    reactions: watchEvent.reactions.map((item) =>
                      item.accountId === reaction.accountId ? { ...item, ...next } : item,
                    ),
                  })
                }
              />
            ))}
          </div>
        ) : (
          <p className="page-description mt-3">아직 남긴 리뷰가 없어요.</p>
        )}
      </section>

      {canReact ? (
        <section className="core-card mt-4 p-4" aria-labelledby="my-review-title">
          <h2 id="my-review-title" className="section-title">
            {myReaction ? '내 리뷰 고치기' : '내 리뷰 쓰기'}
          </h2>
          <p className="page-description">
            {someoneLocked && !myReaction ? '내 리뷰를 남기면 잠긴 리뷰도 함께 열려요. ' : null}
            {'내 반응은 작성자의 감상과 합쳐지지 않고 구성원별로 따로 저장돼요.'}
          </p>
          <div className="mt-3">
            <WatchRatingControl
              value={rating}
              onChange={setRating}
              name="my-watch-reaction-rating"
            />
          </div>
          <div className="mt-4">
            <CountedField
              label="한줄평"
              max={WATCH_HEADLINE_MAX_LENGTH}
              value={headline}
              onChange={setHeadline}
            />
          </div>
          <div className="mt-4">
            <CountedField
              label="소감"
              multiline
              max={WATCH_REVIEW_MAX_LENGTH}
              value={review}
              onChange={setReview}
            />
          </div>
          <div className="mt-4 space-y-3">
            <ToggleSwitch
              label="스포일러 포함"
              description="켜면 목록에서 내용이 가려지고, 눌러야 보여요."
              checked={hasSpoiler}
              onChange={setHasSpoiler}
            />
            {watchEvent.visibility === 'SPACES' ? (
              <ToggleSwitch
                label="상대가 리뷰를 쓰면 공개(블라인드)"
                description="함께 본 사람이 리뷰를 남기기 전까지 내 별점·한줄평·소감이 가려져요."
                checked={isBlind}
                onChange={setIsBlind}
              />
            ) : null}
          </div>
          <button
            type="button"
            className="commit-button mt-4"
            disabled={busy}
            onClick={saveReaction}
          >
            {busy ? '저장 중…' : myReaction ? '내 리뷰 저장' : '내 리뷰 남기기'}
          </button>
        </section>
      ) : currentParticipant?.status === 'DECLINED' ? (
        <p className="page-description mt-4">참여를 거절한 감상에는 개인 반응을 남길 수 없어요.</p>
      ) : null}

      {watchEvent.memoryNote ? (
        <section className="memory-note" aria-labelledby="memory-note-title">
          <div className="memory-note-head">
            <h2 id="memory-note-title">추억 메모</h2>
            <span>{watchEvent.visibility === 'SPACES' ? '공간 사람만 봐요' : '나만 봐요'}</span>
          </div>
          <p>{watchEvent.memoryNote}</p>
          <p className="memory-note-author">
            {watchEvent.author.accountId === myAccountId
              ? '내가 남김'
              : `${watchEvent.author.nickname || '공간 멤버'}님이 남김`}
          </p>
        </section>
      ) : null}

      {watchEvent.visibility === 'SPACES' ? (
        <CommentsSection
          watchEventId={watchEvent.id}
          comments={comments}
          status={commentStatus}
          myAccountId={myAccountId}
          onChange={setComments}
          onRetry={loadComments}
        />
      ) : null}

      <Link
        href={`/records/new?mediaId=${watchEvent.media.id}`}
        className="primary-button mt-6 w-full"
      >
        이 작품 다시 감상 기록하기
      </Link>
      {watchEvent.isMine ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link className="secondary-button" href={`/records/${watchEvent.id}/edit`}>
            수정
          </Link>
          <button className="danger-button" onClick={() => setConfirmDelete(true)}>
            삭제
          </button>
        </div>
      ) : null}
      {confirmDelete ? (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-watch-title"
          className="core-card mt-4 p-5"
        >
          <h2 id="delete-watch-title" className="section-title">
            이 감상 기록을 삭제할까요?
          </h2>
          <p className="page-description">삭제하면 개인 기록과 공유 공간 타임라인에서 사라져요.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="secondary-button" autoFocus onClick={() => setConfirmDelete(false)}>
              취소
            </button>
            <button
              className="danger-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await deleteWatchEvent(watchEvent.id);
                  router.replace('/me');
                } catch (error) {
                  setBusy(false);
                  setConfirmDelete(false);
                  setActionError(
                    error instanceof Error ? error.message : '감상을 삭제하지 못했어요.',
                  );
                }
              }}
            >
              삭제 확인
            </button>
          </div>
        </section>
      ) : null}
    </TaskShell>
  );
}
