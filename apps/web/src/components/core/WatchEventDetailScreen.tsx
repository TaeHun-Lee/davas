'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import { CoreApiError, getRecord } from '../../lib/api/core';
import {
  deleteWatchEvent,
  getWatchEvent,
  respondToWatchParticipation,
  saveWatchReaction,
  type WatchEvent,
  type WatchParticipantStatus,
  type WatchSourceKind,
} from '../../lib/api/watch-events';
import { AsyncState, EmptyState, Poster, TaskShell } from './CoreUi';
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

export function WatchEventDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [watchEvent, setWatchEvent] = useState<WatchEvent | null>(null);
  const [myAccountId, setMyAccountId] = useState('');
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'missing' | 'error'
  >('loading');
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    setActionError('');
    try {
      const [rawEvent, me, legacyRecord] = await Promise.all([
        getWatchEvent(id),
        getMe(),
        getRecord(id).catch(() => null),
      ]);
      const hasAuthorReaction = rawEvent.reactions.some(
        (reaction) => reaction.accountId === rawEvent.author.accountId,
      );
      const nextEvent =
        legacyRecord &&
        !hasAuthorReaction &&
        (legacyRecord.rating !== null || legacyRecord.content.trim())
          ? {
              ...rawEvent,
              reactions: [
                {
                  accountId: rawEvent.author.accountId,
                  nickname: rawEvent.author.nickname,
                  rating: legacyRecord.rating,
                  review: legacyRecord.content.trim() || null,
                  updatedAt: legacyRecord.updatedAt,
                },
                ...rawEvent.reactions,
              ],
            }
          : rawEvent;
      const accountId = me.id ?? '';
      const myReaction = nextEvent.reactions.find(
        (reaction) => reaction.accountId === accountId,
      );
      setWatchEvent(nextEvent);
      setMyAccountId(accountId);
      setRating(myReaction?.rating ?? null);
      setReview(myReaction?.review ?? '');
      setStatus('ready');
    } catch (error) {
      setStatus(
        error instanceof CoreApiError && error.status === 404
          ? 'missing'
          : 'error',
      );
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function respond(
    nextStatus: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>,
  ) {
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
      setActionError(
        error instanceof Error ? error.message : '참여 상태를 저장하지 못했어요.',
      );
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
        review: review.trim() || null,
      });
      setNotice('내 별점과 리뷰를 저장했어요. 다른 사람의 반응과 분리되어 보여요.');
      await load();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : '내 반응을 저장하지 못했어요.',
      );
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
  const canReact =
    watchEvent.isMine || currentParticipant?.status === 'CONFIRMED';
  const fallback = safeReturn(params.get('returnTo'), watchEvent.isMine);
  const source = watchEvent.source;

  return (
    <TaskShell title="감상 상세" fallback={fallback}>
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
        <p role="status" className="mb-3 rounded-2xl bg-[#eef7f1] p-3 text-sm font-bold text-[#327653]">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" className="form-error mb-3">{actionError}</p>
      ) : null}

      <article className="core-card p-4">
        <div className="record-author">
          <span className="avatar-small">
            {(watchEvent.author.nickname || '나').slice(0, 1)}
          </span>
          <div>
            <strong>{watchEvent.author.nickname || '이름 없는 멤버'}</strong>
            <p>{watchEvent.watchedDate.replaceAll('-', '.')}에 봤어요</p>
          </div>
        </div>
        <div className="record-media">
          <Poster
            url={watchEvent.media.posterUrl}
            title={watchEvent.media.title}
          />
          <div className="min-w-0 flex-1">
            <h1>{watchEvent.media.title}</h1>
            <div className="badge-row">
              <span>{watchEvent.media.mediaType === 'TV' ? '드라마' : '영화'}</span>
              {source ? <span>{sourceLabels[source.kind]}</span> : null}
              <span>
                {watchEvent.visibility === 'PRIVATE'
                  ? '개인 기록'
                  : `공간 ${watchEvent.spaceIds.length}곳 공유`}
              </span>
            </div>
          </div>
        </div>
        {source?.providerName || source?.placeText ? (
          <p className="page-description mt-4">
            {[source.providerName, source.placeText].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </article>

      <section className="core-card mt-4 p-4">
        <h2 className="section-title">함께 본 사람</h2>
        <ul className="mt-3 space-y-2">
          {watchEvent.participants.map((participant) => (
            <li
              key={participant.accountId}
              className="flex min-h-11 items-center justify-between rounded-xl bg-white px-3 text-sm font-bold shadow-sm"
            >
              <span>{participant.nickname || (participant.accountId === myAccountId ? '나' : '공간 멤버')}</span>
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

      {canReact ? (
        <section className="core-card mt-4 p-4">
          <h2 className="section-title">내 별점과 리뷰</h2>
          <p className="page-description">
            내 반응은 작성자의 감상과 합쳐지지 않고 구성원별로 따로 저장돼요.
          </p>
          <div className="mt-3">
            <WatchRatingControl
              value={rating}
              onChange={setRating}
              name="my-watch-reaction-rating"
            />
          </div>
          <textarea
            aria-label="내 리뷰"
            className="text-area mt-3"
            maxLength={500}
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />
          <button
            type="button"
            className="commit-button mt-3"
            disabled={busy}
            onClick={saveReaction}
          >
            {busy ? '저장 중…' : '내 반응 저장'}
          </button>
        </section>
      ) : currentParticipant?.status === 'DECLINED' ? (
        <p className="page-description mt-4">참여를 거절한 감상에는 개인 반응을 남길 수 없어요.</p>
      ) : null}

      <section className="core-card mt-4 p-4">
        <h2 className="section-title">구성원 반응</h2>
        {watchEvent.reactions.length ? (
          <div className="mt-3 space-y-3">
            {watchEvent.reactions.map((reaction) => (
              <article key={reaction.accountId} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{reaction.nickname || (reaction.accountId === myAccountId ? '나' : '공간 멤버')}</strong>
                  <span className="text-sm font-black text-[var(--blue)]">
                    {reaction.rating === null ? '별점 없음' : `★ ${reaction.rating.toFixed(1)}`}
                  </span>
                </div>
                <p className="page-description mt-2 whitespace-pre-wrap">
                  {reaction.review || '남긴 리뷰가 없어요.'}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="page-description mt-3">아직 남긴 반응이 없어요.</p>
        )}
      </section>

      <Link
        href={`/records/new?mediaId=${watchEvent.media.id}`}
        className="primary-button mt-4 w-full"
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
        <section role="dialog" aria-modal="true" aria-labelledby="delete-watch-title" className="core-card mt-4 p-5">
          <h2 id="delete-watch-title" className="section-title">이 감상 기록을 삭제할까요?</h2>
          <p className="page-description">삭제하면 개인 기록과 공유 공간 타임라인에서 사라져요.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="secondary-button" autoFocus onClick={() => setConfirmDelete(false)}>취소</button>
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
                  setActionError(error instanceof Error ? error.message : '감상을 삭제하지 못했어요.');
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
