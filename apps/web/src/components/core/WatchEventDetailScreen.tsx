'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WATCH_HEADLINE_MAX_LENGTH, WATCH_REVIEW_MAX_LENGTH } from '@davas/shared';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { getMe } from '../../lib/api/auth';
import { CoreApiError, mediaTypeLabel } from '../../lib/api/core';
import { safeCoreReturnTo } from '../../lib/core-routes';
import {
  deleteWatchEvent,
  getWatchEvent,
  listWatchComments,
  respondToWatchParticipation,
  saveWatchReaction,
  type WatchCommentView,
  type WatchEvent,
  type WatchParticipantStatus,
  type WatchReaction,
  type WatchSourceKind,
} from '../../lib/api/watch-events';
import { CountedField, THEATER_FORMAT_LABELS, ToggleSwitch } from './ComposerFields';
import { AsyncState, EmptyState, Poster, TaskShell } from './CoreUi';
import { MyPhotosPanel } from './MyPhotosPanel';
import { WatchPhotoGallery } from './WatchPhotoGallery';
import { CommentsSection, ReviewCard } from './WatchReviews';
import { WatchRatingControl } from './WatchRatingControl';
import { blindViewerRole, lockedReviewHint, waitingWatchers } from '../spaces/space-watch-model';

const sourceLabels: Record<WatchSourceKind, string> = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV·소장',
  OTHER: '기타',
};

const participantLabels: Record<WatchParticipantStatus, string> = {
  PENDING: '응답 대기',
  CONFIRMED: '참여 확인',
  DECLINED: '참여 안 함',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// Back goes wherever the record was opened from, if it is a known screen (the same allow-list
// login uses, so new screens such as memories and notifications are covered).
const safeReturn = (value: string | null, mine: boolean) =>
  safeCoreReturnTo(value, mine ? '/me' : '/spaces');

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
  if (source) {
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
  }
  chips.push({
    label:
      watchEvent.visibility === 'PRIVATE'
        ? '나만 보기'
        : watchEvent.spaceIds.length > 1
          ? `공간 ${watchEvent.spaceIds.length}곳에 공유`
          : '공간에 공유',
  });
  return chips;
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  );
}

/** The header "…" menu: editing, recording the title again and deleting live here. */
function RecordMenu({
  watchEvent,
  onDelete,
}: {
  watchEvent: WatchEvent;
  onDelete: (menuButton: HTMLButtonElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key !== 'Escape') return;
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      const target = event.target as Node;
      if (!listRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [open]);

  return (
    <div className="record-menu">
      <button
        ref={buttonRef}
        type="button"
        aria-label="기록 메뉴"
        aria-expanded={open}
        aria-controls="record-menu-list"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreIcon />
      </button>
      {open ? (
        <ul id="record-menu-list" ref={listRef} className="record-menu-list">
          {watchEvent.isMine ? (
            <li>
              <Link href={`/records/${watchEvent.id}/edit`}>기록 수정하기</Link>
            </li>
          ) : null}
          <li>
            <Link href={`/records/new?mediaId=${watchEvent.media.id}`}>
              {watchEvent.isMine ? '이 작품 다시 기록하기' : '나도 이 작품 기록하기'}
            </Link>
          </li>
          {watchEvent.isMine ? (
            <li>
              <button
                type="button"
                data-tone="danger"
                onClick={() => {
                  setOpen(false);
                  onDelete(buttonRef.current);
                }}
              >
                기록 삭제하기
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

/** Deleting asks first in a real dialog: focus stays inside and Esc or the backdrop cancels. */
function DeleteDialog({
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  useFocusTrap(true, dialogRef, onCancel);
  return (
    <div
      className="sheet-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-watch-title"
        aria-describedby="delete-watch-description"
        className="sheet"
      >
        <h2 id="delete-watch-title" className="section-title">
          이 감상 기록을 삭제할까요?
        </h2>
        <p id="delete-watch-description" className="page-description">
          삭제하면 개인 기록과 공유 공간 타임라인에서 사라지고, 붙인 사진도 함께 지워져요.
        </p>
        {error ? (
          <p role="alert" className="form-error mt-2">
            {error}
          </p>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" className="secondary-button" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="danger-button" disabled={busy} onClick={onConfirm}>
            {busy ? '삭제 중…' : '삭제'}
          </button>
        </div>
      </section>
    </div>
  );
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
  const [editingReview, setEditingReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const autoOpened = useRef(false);

  // A saved notice clears itself; an error stays until it is dismissed or the next try.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const loadComments = useCallback(async () => {
    setCommentStatus('loading');
    try {
      setComments(await listWatchComments(id));
      setCommentStatus('ready');
    } catch {
      setCommentStatus('error');
    }
  }, [id]);

  const fillReviewFields = useCallback((reaction: WatchReaction | undefined) => {
    setRating(reaction?.rating ?? null);
    setHeadline(reaction?.headline ?? '');
    setReview(reaction?.review ?? '');
    setHasSpoiler(reaction?.hasSpoiler ?? false);
    setIsBlind(reaction?.isBlind ?? false);
  }, []);

  // `quiet` refreshes after an action without swapping the screen for a loader, so the
  // scroll position, an open spoiler and a half-written comment survive.
  const load = useCallback(
    async (options: { quiet?: boolean } = {}) => {
      if (!options.quiet) {
        setStatus('loading');
        setActionError('');
      }
      try {
        const [nextEvent, me] = await Promise.all([getWatchEvent(id), getMe()]);
        const accountId = me.id ?? '';
        setWatchEvent(nextEvent);
        setMyAccountId(accountId);
        fillReviewFields(nextEvent.reactions.find((reaction) => reaction.accountId === accountId));
        setStatus('ready');
      } catch (error) {
        if (options.quiet) {
          setActionError('반영했지만 최신 내용을 불러오지 못했어요. 새로고침해 주세요.');
          return;
        }
        setStatus(error instanceof CoreApiError && error.status === 404 ? 'missing' : 'error');
      }
    },
    [fillReviewFields, id],
  );

  useEffect(() => {
    void load();
    void loadComments();
  }, [load, loadComments]);

  // "내 리뷰 쓰기" on a timeline card links here with #my-review: open the form right away.
  useEffect(() => {
    if (status !== 'ready' || !watchEvent || autoOpened.current) return;
    if (window.location.hash !== '#my-review') return;
    autoOpened.current = true;
    const me = watchEvent.participants.find((participant) => participant.accountId === myAccountId);
    if (!watchEvent.isMine && me?.status !== 'CONFIRMED') return;
    setEditingReview(true);
    requestAnimationFrame(() =>
      document.getElementById('my-review')?.scrollIntoView({ block: 'center' }),
    );
  }, [myAccountId, status, watchEvent]);

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
      await load({ quiet: true });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '참여 상태를 저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  async function saveReaction(blindOffered: boolean) {
    if (busy) return;
    setBusy(true);
    setActionError('');
    try {
      await saveWatchReaction(id, {
        rating,
        headline: headline.trim() || null,
        review: review.trim() || null,
        hasSpoiler,
        isBlind: blindOffered && isBlind,
      });
      setNotice('내 별점과 리뷰를 저장했어요.');
      setEditingReview(false);
      await load({ quiet: true });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '내 반응을 저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'loading')
    return (
      <TaskShell title="기록" fallback="/spaces">
        <AsyncState kind="loading" />
      </TaskShell>
    );

  if (status === 'missing')
    return (
      <TaskShell title="기록" fallback="/spaces">
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
      <TaskShell title="기록" fallback="/spaces">
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
  // Under each photo in the viewer: "내가 올림", "민호님이 올림".
  const uploaderLabel = (accountId: string) => {
    if (accountId === myAccountId) return '내가 올림';
    const nickname =
      accountId === watchEvent.author.accountId
        ? watchEvent.author.nickname
        : watchEvent.participants.find((participant) => participant.accountId === accountId)
            ?.nickname;
    return `${nickname || '공간 멤버'}님이 올림`;
  };
  const watchers = watchEvent.participants.filter(
    (participant) => participant.status === 'CONFIRMED',
  );
  const askedOthers = watchEvent.participants.filter(
    (participant) => participant.status === 'PENDING' && participant.accountId !== myAccountId,
  );
  const myReaction = watchEvent.reactions.find((reaction) => reaction.accountId === myAccountId);
  const lockedNames = watchEvent.reactions
    .filter((reaction) => reaction.locked)
    .map((reaction) => nameOf(reaction.accountId, reaction.nickname));
  const lockedHint = lockedReviewHint(blindViewerRole(watchEvent, myAccountId));
  // Watchers who have not written yet, including people still asked to confirm, keep my blind
  // review closed for them.
  const notYetWritten = waitingWatchers(watchEvent, myAccountId);
  const waitingFor = notYetWritten.length
    ? notYetWritten
        .map((participant) => nameOf(participant.accountId, participant.nickname))
        .join(', ')
    : null;
  // The other watchers, who can unlock a blind review. Without them blind means nothing.
  const companions = watchEvent.participants.filter(
    (participant) => participant.status !== 'DECLINED' && participant.accountId !== myAccountId,
  );
  const companionNames = companions
    .map((participant) => nameOf(participant.accountId, participant.nickname))
    .join(', ');
  const blindOffered = watchEvent.visibility === 'SPACES' && companions.length > 0;
  const openedBlind =
    notYetWritten.length === 0 &&
    watchEvent.reactions.some(
      (reaction) => reaction.isBlind && !reaction.locked && reaction.accountId !== myAccountId,
    );
  const commentsShown = watchEvent.visibility === 'SPACES';

  const reviewEditor = (
    <section className="my-review-editor" id="my-review" aria-labelledby="my-review-title">
      <h3 id="my-review-title">{myReaction ? '내 리뷰 고치기' : '내 리뷰 쓰기'}</h3>
      <p className="page-description">
        {lockedNames.length && !myReaction
          ? `남기면 ${lockedNames.join(', ')}님 리뷰도 함께 열려요. `
          : null}
        {'내 반응은 작성자의 감상과 합쳐지지 않고 구성원별로 따로 저장돼요.'}
      </p>
      <div className="mt-3">
        <WatchRatingControl value={rating} onChange={setRating} name="my-watch-reaction-rating" />
      </div>
      <div className="mt-4">
        <CountedField
          label="한줄평 (선택)"
          max={WATCH_HEADLINE_MAX_LENGTH}
          value={headline}
          onChange={setHeadline}
        />
      </div>
      <div className="mt-4">
        <CountedField
          label="소감 (선택)"
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
        {blindOffered ? (
          <ToggleSwitch
            label="상대가 리뷰를 쓰면 공개(블라인드)"
            description={
              isBlind
                ? `${companionNames}님이 리뷰를 남기기 전까지 내 별점·한줄평·소감이 가려져요.`
                : `꺼져 있으면 저장하는 즉시 ${companionNames}님에게 보여요.`
            }
            checked={isBlind}
            onChange={setIsBlind}
          />
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
        <button
          type="button"
          className="secondary-button"
          disabled={busy}
          onClick={() => {
            fillReviewFields(myReaction);
            setEditingReview(false);
          }}
        >
          취소
        </button>
        <button
          type="button"
          className="commit-button"
          disabled={busy}
          onClick={() => saveReaction(blindOffered)}
        >
          {busy ? '저장 중…' : myReaction ? '내 리뷰 저장' : '내 리뷰 남기기'}
        </button>
      </div>
    </section>
  );

  return (
    <TaskShell
      title="기록"
      fallback={fallback}
      wide
      headerAction={
        <RecordMenu
          watchEvent={watchEvent}
          onDelete={(menuButton) => {
            // Focus returns to the menu button when the dialog closes.
            menuButton?.focus();
            setDeleteError('');
            setConfirmDelete(true);
          }}
        />
      }
    >
      {params.get('saved') ? (
        <p
          role="status"
          className="mb-3 rounded-2xl bg-[var(--blue-soft)] p-3 text-sm font-bold text-[var(--blue-ink)]"
        >
          {params.get('saved') === 'space'
            ? '선택한 공간에 이 감상만 공유했어요.'
            : '개인 감상으로 저장했어요.'}
        </p>
      ) : null}
      {notice ? (
        <p
          role="status"
          className="action-toast"
          data-tone="ok"
          data-above={commentsShown ? 'comments' : undefined}
        >
          <span>{notice}</span>
          <button type="button" aria-label="안내 닫기" onClick={() => setNotice('')}>
            <span aria-hidden="true">×</span>
          </button>
        </p>
      ) : null}
      {/* Shown over the bottom of the screen: the actions that fail sit far below the top. */}
      {actionError ? (
        <p
          role="alert"
          className="action-toast"
          data-tone="error"
          data-above={commentsShown ? 'comments' : undefined}
        >
          <span>{actionError}</span>
          <button type="button" aria-label="오류 안내 닫기" onClick={() => setActionError('')}>
            <span aria-hidden="true">×</span>
          </button>
        </p>
      ) : null}

      <WatchPhotoGallery
        photos={watchEvent.photos}
        title={watchEvent.media.title}
        watchedDate={watchEvent.watchedDate}
        uploaderLabel={uploaderLabel}
      />
      <section className="record-detail-head" aria-labelledby="record-detail-title">
        <div className="flex gap-3">
          <Poster url={watchEvent.media.posterUrl} title={watchEvent.media.title} />
          <div className="min-w-0 flex-1">
            <h1 id="record-detail-title">{watchEvent.media.title}</h1>
            <p className="record-detail-type">
              {[mediaTypeLabel(watchEvent.media.mediaType), watchEvent.media.releaseYear]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {watchers.length > 1 ? (
              <p className="record-detail-together">
                <span className="record-detail-avatars" aria-hidden="true">
                  {watchers.map((participant) => (
                    <span
                      key={participant.accountId}
                      data-me={participant.accountId === myAccountId || undefined}
                    >
                      {nameOf(participant.accountId, participant.nickname).slice(0, 1)}
                    </span>
                  ))}
                </span>
                함께 봤어요 ·{' '}
                {watchers
                  .map((participant) => nameOf(participant.accountId, participant.nickname))
                  .join(', ')}
              </p>
            ) : null}
            {askedOthers.length ? (
              <p className="record-detail-type">
                {askedOthers
                  .map(
                    (participant) =>
                      `${nameOf(participant.accountId, participant.nickname)} ${participantLabels[participant.status]}`,
                  )
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

      {/* The author and anyone who confirmed being there can add their own photos. */}
      {canReact && myAccountId ? (
        <MyPhotosPanel watchEvent={watchEvent} myAccountId={myAccountId} onSaved={setWatchEvent} />
      ) : null}

      {currentParticipant?.status === 'PENDING' ? (
        <section className="space-confirm-card mt-5" aria-labelledby="record-confirm-title">
          <p className="space-confirm-eyebrow">확인이 필요해요</p>
          <h2 id="record-confirm-title">함께 보셨나요?</h2>
          <p>
            {watchEvent.author.nickname || '공간 멤버'}님이 나를 함께 본 사람으로 넣었어요. 맞다면
            내 별점과 리뷰를 남길 수 있어요.
          </p>
          <div className="space-confirm-actions">
            <button
              type="button"
              className="primary-button"
              disabled={busy}
              onClick={() => respond('CONFIRMED')}
            >
              함께 봤어요
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={busy}
              onClick={() => respond('DECLINED')}
            >
              함께 보지 않았어요
            </button>
          </div>
        </section>
      ) : null}

      <section
        className="mt-6 record-reviews"
        data-opened={openedBlind || undefined}
        aria-labelledby="reviews-title"
      >
        <h2 id="reviews-title" className="section-title">
          {watchEvent.visibility === 'SPACES' ? '우리 리뷰' : '내 리뷰'}
        </h2>
        {openedBlind ? (
          <p className="blind-opened" role="status">
            <span aria-hidden="true">✦</span>
            {watchers.length === 2 ? '둘 다' : '모두'} 리뷰를 남겨서 블라인드 리뷰가 열렸어요
          </p>
        ) : null}
        <div className="mt-3 record-reviews-list">
          {watchEvent.reactions.map((reaction) =>
            reaction.accountId === myAccountId && editingReview ? (
              <div key={reaction.accountId}>{reviewEditor}</div>
            ) : (
              <ReviewCard
                key={reaction.accountId}
                watchEventId={watchEvent.id}
                reaction={reaction}
                name={nameOf(reaction.accountId, reaction.nickname)}
                isMe={reaction.accountId === myAccountId}
                waitingFor={waitingFor}
                lockedHint={lockedHint}
                onEdit={
                  reaction.accountId === myAccountId && canReact && reaction.id
                    ? () => setEditingReview(true)
                    : undefined
                }
                onLikeChange={(next) =>
                  setWatchEvent({
                    ...watchEvent,
                    reactions: watchEvent.reactions.map((item) =>
                      item.accountId === reaction.accountId ? { ...item, ...next } : item,
                    ),
                  })
                }
              />
            ),
          )}
          {canReact && !myReaction ? (
            editingReview ? (
              reviewEditor
            ) : (
              <article className="my-review-prompt" aria-label="내 리뷰, 아직 없음">
                <div className="review-card-head">
                  <span className="review-avatar" aria-hidden="true">
                    나
                  </span>
                  <strong>나</strong>
                </div>
                <p>
                  아직 내 리뷰가 없어요.
                  {lockedNames.length
                    ? ` 남기면 ${lockedNames.join(', ')}님 리뷰도 함께 열려요.`
                    : ' 별점만 남겨도 돼요.'}
                </p>
                <button
                  type="button"
                  className="commit-button"
                  onClick={() => setEditingReview(true)}
                >
                  내 리뷰 쓰기
                </button>
              </article>
            )
          ) : null}
        </div>
        {!watchEvent.reactions.length && !canReact ? (
          <p className="page-description mt-3">아직 남긴 리뷰가 없어요.</p>
        ) : null}
        {currentParticipant?.status === 'DECLINED' ? (
          <p className="page-description mt-3">
            참여를 거절한 감상에는 개인 반응을 남길 수 없어요.
          </p>
        ) : null}
      </section>

      {watchEvent.memoryNote ? (
        <section className="memory-note" aria-labelledby="memory-note-title">
          <div className="memory-note-head">
            <h2 id="memory-note-title">추억 메모</h2>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
              </svg>
              {watchEvent.visibility === 'SPACES' ? '공간 사람만 봐요' : '나만 봐요'}
            </span>
          </div>
          <p>{watchEvent.memoryNote}</p>
          <p className="memory-note-author">
            {watchEvent.author.accountId === myAccountId
              ? '내가 남김'
              : `${watchEvent.author.nickname || '공간 멤버'}님이 남김`}
          </p>
        </section>
      ) : null}

      {commentsShown ? (
        <CommentsSection
          watchEventId={watchEvent.id}
          comments={comments}
          status={commentStatus}
          myAccountId={myAccountId}
          onChange={setComments}
          onRetry={loadComments}
        />
      ) : null}

      {confirmDelete ? (
        <DeleteDialog
          busy={busy}
          error={deleteError}
          onCancel={() => {
            if (!busy) setConfirmDelete(false);
          }}
          onConfirm={async () => {
            setBusy(true);
            setDeleteError('');
            try {
              await deleteWatchEvent(watchEvent.id);
              router.replace(fallback);
            } catch (error) {
              setBusy(false);
              // Kept open next to the button that failed, so the failure is seen.
              setDeleteError(error instanceof Error ? error.message : '감상을 삭제하지 못했어요.');
            }
          }}
        />
      ) : null}
    </TaskShell>
  );
}
