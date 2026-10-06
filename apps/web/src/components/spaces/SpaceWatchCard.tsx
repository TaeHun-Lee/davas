'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { mediaTypeLabel } from '../../lib/api/core';
import type { WatchEvent } from '../../lib/api/watch-events';
import { Poster } from '../core/CoreUi';
import { reactionRows, watchedDayLabel, watchSourceSummary } from './space-watch-model';

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
  const rows = reactionRows(event, myAccountId);
  const together = rows.filter((row) => row.status === 'CONFIRMED').length > 1;
  const meta = [
    watchedDayLabel(event.watchedDate),
    watchSourceSummary(event),
    together ? '함께 봤어요' : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const titleId = `space-watch-${event.id}`;

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
      <ul className="space-watch-reactions" aria-label={`${event.media.title} 별점과 리뷰`}>
        {rows.map((row) => (
          <li key={row.accountId} data-me={row.isMe || undefined}>
            <span className="space-watch-avatar" aria-hidden="true">
              {row.name.slice(0, 1)}
            </span>
            <span className="space-watch-text">
              <b>{row.name}</b>{' '}
              {row.status === 'PENDING'
                ? row.isMe
                  ? '함께 봤는지 알려 주세요'
                  : '함께 봤는지 확인을 기다리고 있어요'
                : (row.review ??
                  (row.rating === null ? '아직 별점을 안 남겼어요' : '별점만 남겼어요'))}
            </span>
            {row.status === 'CONFIRMED' && row.rating !== null ? (
              <span className="space-watch-rating">★ {row.rating.toFixed(1)}</span>
            ) : row.isMe && row.status === 'CONFIRMED' ? (
              <Link
                href={detail}
                className="space-watch-rate"
                aria-label={`${event.media.title}에 내 별점 남기기`}
              >
                별점 남기기
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="space-watch-actions">
        <Link href={detail} className="secondary-button">
          자세히 보기
        </Link>
        {actions}
      </div>
    </article>
  );
}
