'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { mediaTypeLabel } from '../../lib/api/core';
import type { WatchEvent } from '../../lib/api/watch-events';
import { Poster } from '../core/CoreUi';
import { WatchPhoto } from '../core/WatchPhoto';
import {
  blindViewerRole,
  lockedReviewHint,
  reactionRows,
  watchedDayLabel,
  watchSourceSummary,
  type WatchReactionRow,
} from './space-watch-model';

const STRIP_SIZE = 3;

function rowText(row: WatchReactionRow, lockedHint: string) {
  if (row.status === 'PENDING') {
    return row.isMe ? '함께 봤는지 알려 주세요' : '함께 봤는지 확인을 기다리고 있어요';
  }
  if (row.locked) return `리뷰 잠김 · ${lockedHint}`;
  if (row.hasSpoiler && row.text) return '스포일러가 있는 리뷰예요';
  return row.text ?? (row.rating === null ? '아직 별점을 안 남겼어요' : '별점만 남겼어요');
}

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
  const lockedHint = lockedReviewHint(blindViewerRole(event, myAccountId));
  const together = rows.filter((row) => row.status === 'CONFIRMED').length > 1;
  const meta = [
    watchedDayLabel(event.watchedDate),
    watchSourceSummary(event),
    together ? '함께 봤어요' : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const titleId = `space-watch-${event.id}`;
  const likeTotal = rows.reduce((sum, row) => sum + row.likeCount, 0);
  const photos = event.photos ?? [];
  const extraPhotos = photos.length - STRIP_SIZE;

  return (
    <article className="core-card space-watch-card" aria-labelledby={titleId}>
      <p className="space-watch-meta">{meta}</p>
      <div className="space-watch-media">
        <Poster url={event.media.posterUrl} title={event.media.title} />
        <div className="min-w-0">
          <h3 id={titleId}>{event.media.title}</h3>
          <p>{mediaTypeLabel(event.media.mediaType)}</p>
        </div>
      </div>
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
      <ul className="space-watch-reactions" aria-label={`${event.media.title} 별점과 리뷰`}>
        {rows.map((row) => (
          <li
            key={row.accountId}
            data-me={row.isMe || undefined}
            data-locked={row.locked || undefined}
          >
            <span className="space-watch-avatar" aria-hidden="true">
              {row.name.slice(0, 1)}
            </span>
            <span className="space-watch-text">
              <b>{row.name}</b> {rowText(row, lockedHint)}
            </span>
            {row.locked ? (
              <span className="space-watch-rating" role="img" aria-label="별점 가려짐">
                ★ ?.?
              </span>
            ) : row.status === 'CONFIRMED' && row.rating !== null ? (
              <span className="space-watch-rating">★ {row.rating.toFixed(1)}</span>
            ) : row.isMe && row.status === 'CONFIRMED' ? (
              <Link
                href={writeReview}
                className="space-watch-rate"
                aria-label={`${event.media.title}에 내 별점 남기기`}
              >
                별점 남기기
              </Link>
            ) : null}
            {row.waitingToOpen ? (
              <span className="space-watch-badge">상대가 남기면 공개돼요</span>
            ) : null}
          </li>
        ))}
      </ul>
      {rows.some((row) => row.locked) &&
      rows.some((row) => row.isMe && row.status === 'CONFIRMED') ? (
        <Link href={writeReview} className="primary-button space-watch-write">
          내 리뷰 쓰기
        </Link>
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
