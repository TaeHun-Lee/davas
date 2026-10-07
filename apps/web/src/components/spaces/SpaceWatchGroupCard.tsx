'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { CoreApiError } from '../../lib/api/core';
import { setReviewLike, type WatchEvent } from '../../lib/api/watch-events';
import { Poster } from '../core/CoreUi';
import { WatchPhoto } from '../core/WatchPhoto';
import { relativeTime } from '../core/WatchReviews';
import { ReactionBlock, SpaceWatchCard, type LikeState } from './SpaceWatchCard';
import {
  groupByline,
  groupCardSource,
  groupReactionRows,
  openedTogether,
  unlocksByWriting,
  type GroupReactionRow,
} from './space-watch-model';

const STRIP_SIZE = 3;

type CardProps = {
  events: WatchEvent[];
  myAccountId: string;
  returnTo: string;
  actions?: ReactNode;
};

/** A timeline card: one record as before, or every member's record of a title together. */
export function TimelineCard({ events, ...props }: CardProps) {
  if (events.length === 1) return <SpaceWatchCard event={events[0]} {...props} />;
  return <SpaceWatchGroupCard events={events} {...props} />;
}

/**
 * Members who each recorded the same title share one card: "주인님, 강생님이 기록을 남겼어요",
 * the title once, everyone's photos and one review per person, and a way into each record.
 */
function SpaceWatchGroupCard({ events, myAccountId, returnTo, actions }: CardProps) {
  const detailOf = (id: string) => `/records/${id}?returnTo=${encodeURIComponent(returnTo)}`;
  const lead = events.find((event) => event.isMine) ?? events[0];
  const rows = groupReactionRows(events, myAccountId);
  const unlockEvent = events.find((event) => unlocksByWriting(event, myAccountId));
  const source = groupCardSource(events);
  const titleId = `space-watch-${events[0].id}`;
  const photos = [
    ...new Map(
      events.flatMap((event) =>
        (event.photos ?? []).map((photo) => [photo.id, { photo, eventId: event.id }] as const),
      ),
    ).values(),
  ];
  const extraPhotos = photos.length - STRIP_SIZE;
  const authors = [
    ...new Map(events.map((event) => [event.author.accountId, event] as const)).values(),
  ];
  const latest = events
    .map((event) => event.createdAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const when = latest ? relativeTime(latest) : null;
  const [likes, setLikes] = useState<LikeState>({});
  const [likeBusy, setLikeBusy] = useState<string | null>(null);
  const [likeError, setLikeError] = useState('');
  const likeOf = (row: GroupReactionRow) =>
    (row.reactionId && likes[row.reactionId]) || { liked: row.likedByMe, count: row.likeCount };
  const likesOn = (event: WatchEvent) =>
    event.reactions.reduce(
      (sum, reaction) =>
        sum + ((reaction.id ? likes[reaction.id]?.count : undefined) ?? reaction.likeCount ?? 0),
      0,
    );
  const opened = openedTogether(rows);

  async function toggleLike(row: GroupReactionRow) {
    if (!row.reactionId || likeBusy) return;
    const current = likeOf(row);
    setLikeBusy(row.reactionId);
    setLikeError('');
    try {
      const result = await setReviewLike(row.eventId, row.reactionId, !current.liked);
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
  const shownRows = unlockEvent ? rows.filter((row) => !(row.isMe && !row.written)) : rows;
  const blocks = shownRows.map((row) => (
    <ReactionBlock
      key={row.accountId}
      row={row}
      like={likeOf(row)}
      likeBusy={likeBusy === row.reactionId}
      lockedHint={row.lockedHint}
      writeReview={`${detailOf(row.eventId)}#my-review`}
      title={lead.media.title}
      onLike={() => toggleLike(row)}
    />
  ));

  return (
    <article className="core-card space-watch-card" data-grouped="true" aria-labelledby={titleId}>
      <div className="space-watch-byline">
        <span className="space-watch-avatars" aria-hidden="true">
          {authors.slice(0, 3).map((event) => (
            <span
              key={event.author.accountId}
              className="space-watch-avatar"
              data-me={event.isMine || undefined}
            >
              {(event.isMine ? '나' : event.author.nickname || '공').slice(0, 1)}
            </span>
          ))}
        </span>
        <p>
          <b>{groupByline(events)}</b> 기록을 남겼어요{when ? ` · ${when}` : ''}
        </p>
      </div>
      {/* On a computer the title and the photos sit side by side. */}
      <div className="space-watch-body">
        <Link href={detailOf(lead.id)} className="space-watch-media">
          <Poster url={lead.media.posterUrl} title={lead.media.title} />
          <span className="min-w-0">
            <strong id={titleId}>{lead.media.title}</strong>
            {source.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            {source.place ? <span className="space-watch-place">{source.place}</span> : null}
          </span>
        </Link>
        {photos.length ? (
          <Link
            href={detailOf(photos[0].eventId)}
            className="space-watch-photos"
            aria-label={`${lead.media.title} 사진 ${photos.length}장 보기`}
          >
            {photos.slice(0, STRIP_SIZE).map(({ photo }, index) => (
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
      </div>
      {opened ? (
        <div className="space-watch-opened">
          <p>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
            </svg>
            {rows.length === 2 ? '둘 다' : '모두'} 리뷰를 남겨서 열렸어요
          </p>
          <ul className="space-watch-reactions" aria-label={`${lead.media.title} 별점과 리뷰`}>
            {blocks}
          </ul>
        </div>
      ) : (
        <ul className="space-watch-reactions" aria-label={`${lead.media.title} 별점과 리뷰`}>
          {blocks}
        </ul>
      )}
      {unlockEvent ? (
        <Link
          href={`${detailOf(unlockEvent.id)}#my-review`}
          className="primary-button space-watch-write"
        >
          내 리뷰 쓰기
        </Link>
      ) : null}
      {likeError ? (
        <p role="alert" className="form-error mt-2">
          {likeError}
        </p>
      ) : null}
      <div className="space-watch-actions">
        {events.map((event) => {
          const likeTotal = likesOn(event);
          return (
            <Link key={event.id} href={detailOf(event.id)} className="secondary-button">
              {event.isMine ? '내 기록' : `${event.author.nickname || '공간 멤버'}님 기록`}
              {likeTotal || event.commentCount ? (
                <span className="space-watch-counts">
                  {likeTotal ? ` · 좋아요 ${likeTotal}` : ''}
                  {event.commentCount ? ` · 댓글 ${event.commentCount}` : ''}
                </span>
              ) : null}
            </Link>
          );
        })}
        {actions}
      </div>
    </article>
  );
}
