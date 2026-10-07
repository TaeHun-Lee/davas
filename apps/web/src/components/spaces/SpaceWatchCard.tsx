'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { CoreApiError } from '../../lib/api/core';
import { setReviewLike, type WatchEvent } from '../../lib/api/watch-events';
import { Poster } from '../core/CoreUi';
import { WatchPhoto } from '../core/WatchPhoto';
import { relativeTime } from '../core/WatchReviews';
import {
  blindViewerRole,
  lockedReviewHint,
  openedTogether,
  reactionRows,
  watchCardSource,
  type WatchReactionRow,
} from './space-watch-model';

const STRIP_SIZE = 3;

export type LikeState = Record<string, { liked: boolean; count: number }>;

function ThumbIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={filled || undefined}>
      <path d="M7 11v9H4v-9ZM7 11l4-7a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
    </svg>
  );
}

/**
 * A space timeline card, as on the C안 board: who left it and when, the title with when,
 * how and where it was watched, the photo strip, and each watcher's review in full with a
 * like on the card. Opened blind reviews sit together under "둘 다 리뷰를 남겨서 열렸어요".
 */
export function SpaceWatchCard({
  event,
  myAccountId,
  returnTo,
  actions,
}: {
  event: WatchEvent;
  myAccountId: string;
  returnTo: string;
  actions?: ReactNode;
}) {
  const detail = `/records/${event.id}?returnTo=${encodeURIComponent(returnTo)}`;
  // Opens the record with its review form already open.
  const writeReview = `${detail}#my-review`;
  const rows = reactionRows(event, myAccountId);
  const role = blindViewerRole(event, myAccountId);
  const lockedHint = lockedReviewHint(role);
  // A watcher who has not written opens the locked reviews by writing: offer it once.
  const writeToUnlock =
    role === 'watcher' &&
    rows.some((row) => row.locked) &&
    !rows.some((row) => row.isMe && row.written);
  const source = watchCardSource(event);
  const titleId = `space-watch-${event.id}`;
  const photos = event.photos ?? [];
  const extraPhotos = photos.length - STRIP_SIZE;
  const [likes, setLikes] = useState<LikeState>({});
  const [likeBusy, setLikeBusy] = useState<string | null>(null);
  const [likeError, setLikeError] = useState('');
  const likeOf = (row: WatchReactionRow) =>
    (row.reactionId && likes[row.reactionId]) || { liked: row.likedByMe, count: row.likeCount };
  const likeTotal = rows.reduce((sum, row) => sum + likeOf(row).count, 0);
  const opened = openedTogether(rows);
  const author = event.isMine ? '내가' : `${event.author.nickname || '공간 멤버'}님이`;
  const when = event.createdAt ? relativeTime(event.createdAt) : null;

  async function toggleLike(row: WatchReactionRow) {
    if (!row.reactionId || likeBusy) return;
    const current = likeOf(row);
    setLikeBusy(row.reactionId);
    setLikeError('');
    try {
      const result = await setReviewLike(event.id, row.reactionId, !current.liked);
      setLikes((value) => ({
        ...value,
        [row.reactionId!]: { liked: result.liked, count: result.likeCount },
      }));
    } catch (caught) {
      setLikeError(
        caught instanceof CoreApiError && caught.body.message
          ? caught.body.message
          : '좋아요를 저장하지 못했어요.',
      );
    } finally {
      setLikeBusy(null);
    }
  }

  // When "내 리뷰 쓰기" is offered, my own "not yet" line would only repeat it.
  const shownRows = writeToUnlock ? rows.filter((row) => !(row.isMe && !row.written)) : rows;
  const blocks = shownRows.map((row) => (
    <ReactionBlock
      key={row.accountId}
      row={row}
      like={likeOf(row)}
      likeBusy={likeBusy === row.reactionId}
      lockedHint={lockedHint}
      writeReview={writeReview}
      title={event.media.title}
      onLike={() => toggleLike(row)}
    />
  ));

  return (
    <article className="core-card space-watch-card" aria-labelledby={titleId}>
      <div className="space-watch-byline">
        <span className="space-watch-avatar" data-me={event.isMine || undefined} aria-hidden="true">
          {(event.isMine ? '나' : event.author.nickname || '공').slice(0, 1)}
        </span>
        <p>
          <b>{author}</b> 기록을 남겼어요{when ? ` · ${when}` : ''}
        </p>
      </div>
      <Link href={detail} className="space-watch-media">
        <Poster url={event.media.posterUrl} title={event.media.title} />
        <span className="min-w-0">
          <strong id={titleId}>{event.media.title}</strong>
          <span>{source.line}</span>
          {source.place ? <span className="space-watch-place">{source.place}</span> : null}
        </span>
      </Link>
      {photos.length ? (
        <Link
          href={detail}
          className="space-watch-photos"
          aria-label={`${event.media.title} 사진 ${photos.length}장 보기`}
        >
          {photos.slice(0, STRIP_SIZE).map((photo, index) => (
            <span key={photo.id} className="space-watch-photo">
              <WatchPhoto photo={photo} variant="thumb" alt="" />
              {index === STRIP_SIZE - 1 && extraPhotos > 0 ? (
                <span className="space-watch-photo-more" aria-hidden="true">
                  +{extraPhotos}
                </span>
              ) : null}
            </span>
          ))}
        </Link>
      ) : null}
      {opened ? (
        <div className="space-watch-opened">
          <p>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
            </svg>
            {rows.length === 2 ? '둘 다' : '모두'} 리뷰를 남겨서 열렸어요
          </p>
          <ul className="space-watch-reactions" aria-label={`${event.media.title} 별점과 리뷰`}>
            {blocks}
          </ul>
        </div>
      ) : (
        <ul className="space-watch-reactions" aria-label={`${event.media.title} 별점과 리뷰`}>
          {blocks}
        </ul>
      )}
      {writeToUnlock ? (
        <Link href={writeReview} className="primary-button space-watch-write">
          내 리뷰 쓰기
        </Link>
      ) : null}
      {likeError ? (
        <p role="alert" className="form-error mt-2">
          {likeError}
        </p>
      ) : null}
      <div className="space-watch-actions">
        <Link href={detail} className="secondary-button">
          자세히 보기
          {likeTotal || event.commentCount ? (
            <span className="space-watch-counts">
              {likeTotal ? ` · 좋아요 ${likeTotal}` : ''}
              {event.commentCount ? ` · 댓글 ${event.commentCount}` : ''}
            </span>
          ) : null}
        </Link>
        {actions}
      </div>
    </article>
  );
}

export function ReactionBlock({
  row,
  like,
  likeBusy,
  lockedHint,
  writeReview,
  title,
  onLike,
}: {
  row: WatchReactionRow;
  like: { liked: boolean; count: number };
  likeBusy: boolean;
  lockedHint: string;
  writeReview: string;
  title: string;
  onLike: () => void;
}) {
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const avatar = (
    <span className="space-watch-avatar" data-me={row.isMe || undefined} aria-hidden="true">
      {row.name.slice(0, 1)}
    </span>
  );

  // Not written yet: one quiet line instead of an empty review.
  if (row.status === 'PENDING' || !row.written) {
    return (
      <li className="space-watch-empty" data-me={row.isMe || undefined}>
        {avatar}
        <span>
          {row.status === 'PENDING'
            ? row.isMe
              ? '함께 봤는지 알려 주세요'
              : `${row.name}님이 함께 봤는지 확인을 기다리고 있어요`
            : row.isMe
              ? '아직 내 별점을 안 남겼어요'
              : `${row.name}님은 아직 리뷰를 안 남겼어요`}
        </span>
        {row.isMe && row.status === 'CONFIRMED' ? (
          <Link
            href={writeReview}
            className="space-watch-rate"
            aria-label={`${title}에 내 별점 남기기`}
          >
            별점 남기기
          </Link>
        ) : null}
      </li>
    );
  }

  if (row.locked) {
    return (
      <li className="space-watch-review" data-locked="true">
        <div className="space-watch-review-head">
          {avatar}
          <b>{row.name}</b>
          <span className="space-watch-rating" role="img" aria-label="별점 가려짐">
            ★ ?.?
          </span>
          <button
            type="button"
            className="space-watch-like"
            disabled
            aria-label="잠긴 리뷰에는 좋아요를 누를 수 없어요"
          >
            <ThumbIcon />
          </button>
        </div>
        <div className="space-watch-lock">
          <span className="space-watch-lock-icon" aria-hidden="true">
            <LockIcon />
          </span>
          <span>
            <strong>{row.name}님 리뷰가 잠겨 있어요</strong>
            <span>{lockedHint}</span>
          </span>
        </div>
      </li>
    );
  }

  const hidden = row.hasSpoiler && !spoilerOpen && !row.isMe;
  return (
    <li className="space-watch-review" data-me={row.isMe || undefined}>
      <div className="space-watch-review-head">
        {avatar}
        <b>{row.name}</b>
        {row.rating !== null ? (
          <span className="space-watch-rating">★ {row.rating.toFixed(1)}</span>
        ) : null}
        {row.waitingFor ? (
          <span className="space-watch-badge">
            <LockIcon />
            {row.waitingFor}님이 남기면 공개돼요
          </span>
        ) : null}
        {row.isMe || !row.reactionId ? (
          <span className="space-watch-like-count" aria-label={`좋아요 ${like.count}개`}>
            <ThumbIcon />
            {like.count}
          </span>
        ) : (
          <button
            type="button"
            className="space-watch-like"
            aria-pressed={like.liked}
            disabled={likeBusy}
            onClick={onLike}
            aria-label={`${row.name}님 리뷰 좋아요${like.liked ? ' 취소' : ''}, 지금 ${like.count}개`}
          >
            <ThumbIcon filled={like.liked} />
            {like.count}
          </button>
        )}
      </div>
      {hidden ? (
        <button type="button" className="space-watch-spoiler" onClick={() => setSpoilerOpen(true)}>
          스포일러가 있어요 · 눌러서 보기
        </button>
      ) : row.headline || row.review ? (
        <div className="space-watch-review-body">
          {row.headline ? <p className="space-watch-headline">{row.headline}</p> : null}
          {row.review ? <p className="space-watch-review-text">{row.review}</p> : null}
        </div>
      ) : (
        <p className="space-watch-review-text space-watch-muted">별점만 남겼어요</p>
      )}
    </li>
  );
}
