'use client';

import { useState, type FormEvent } from 'react';
import { WATCH_COMMENT_MAX_LENGTH } from '@davas/shared';
import { CoreApiError } from '../../lib/api/core';
import {
  createWatchComment,
  deleteWatchComment,
  setReviewLike,
  type WatchCommentView,
  type WatchReaction,
} from '../../lib/api/watch-events';

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof CoreApiError && error.body.message ? error.body.message : fallback;

export function relativeTime(iso: string, now = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function ThumbIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 11v9H4v-9ZM7 11l4-7a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" />
    </svg>
  );
}

/** One person's review. A locked (blind) review shows only that it exists. */
export function ReviewCard({
  watchEventId,
  reaction,
  name,
  isMe,
  waitingFor,
  lockedHint,
  onEdit,
  onLikeChange,
}: {
  watchEventId: string;
  reaction: WatchReaction;
  name: string;
  isMe: boolean;
  /** Who still has to write before my blind review opens, for the "공개 대기" badge. */
  waitingFor: string | null;
  /** What opens a locked review for this viewer, which depends on whether they watched. */
  lockedHint: string;
  /** Opens my review for editing in place; only passed for the viewer's own review. */
  onEdit?: () => void;
  onLikeChange: (next: { likeCount: number; likedByMe: boolean }) => void;
}) {
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function toggleLike() {
    if (!reaction.id || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await setReviewLike(watchEventId, reaction.id, !reaction.likedByMe);
      onLikeChange({ likeCount: result.likeCount, likedByMe: result.liked });
    } catch (caught) {
      setError(errorMessage(caught, '좋아요를 저장하지 못했어요.'));
    } finally {
      setBusy(false);
    }
  }

  if (reaction.locked) {
    return (
      <article className="review-card" data-locked="true" aria-label={`${name}님 리뷰, 잠겨 있음`}>
        <div className="review-card-head">
          <span className="review-avatar" aria-hidden="true">
            {name.slice(0, 1)}
          </span>
          <strong>{name}</strong>
          <span className="review-rating" role="img" aria-label="별점 가려짐">
            ★ ?.?
          </span>
        </div>
        <div className="review-lock">
          <span aria-hidden="true" className="review-lock-icon">
            <svg viewBox="0 0 24 24">
              <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
            </svg>
          </span>
          <span>
            <strong>{name}님 리뷰가 잠겨 있어요</strong>
            <span>{lockedHint}</span>
          </span>
        </div>
        <div className="review-actions">
          <button
            type="button"
            className="review-like"
            disabled
            aria-label="잠긴 리뷰에는 좋아요를 누를 수 없어요"
          >
            <ThumbIcon />
            좋아요
          </button>
          <span className="review-like-hint" aria-hidden="true">
            리뷰가 열리면 좋아요를 누를 수 있어요
          </span>
        </div>
      </article>
    );
  }

  const hasText = Boolean(reaction.headline || reaction.review);
  const hidden = reaction.hasSpoiler && !spoilerOpen && !isMe;
  const meta = [
    reaction.updatedAt ? relativeTime(reaction.updatedAt) : null,
    reaction.isBlind ? '블라인드로 남김' : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <article className="review-card" data-me={isMe || undefined}>
      <div className="review-card-head">
        <span className="review-avatar" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
        <strong>
          {name}
          {meta ? <span className="review-when"> · {meta}</span> : null}
        </strong>
        {isMe && reaction.isBlind && waitingFor ? (
          <span className="review-badge">{waitingFor}님이 남기면 공개돼요</span>
        ) : null}
        <span className="review-rating">
          {reaction.rating === null ? '별점 없음' : `★ ${reaction.rating.toFixed(1)}`}
        </span>
      </div>
      {hidden ? (
        <button type="button" className="review-spoiler" onClick={() => setSpoilerOpen(true)}>
          스포일러가 있어요 · 눌러서 보기
        </button>
      ) : hasText ? (
        <div className="review-body">
          {reaction.headline ? <p className="review-headline">{reaction.headline}</p> : null}
          {reaction.review ? <p className="review-text">{reaction.review}</p> : null}
        </div>
      ) : (
        <p className="review-text review-empty">별점만 남겼어요.</p>
      )}
      <div className="review-actions">
        {isMe || !reaction.id ? (
          <span className="review-like-count">
            <ThumbIcon />
            좋아요 {reaction.likeCount}
          </span>
        ) : (
          <button
            type="button"
            className="review-like"
            aria-pressed={reaction.likedByMe}
            disabled={busy}
            onClick={toggleLike}
            aria-label={`${name}님 리뷰 좋아요${reaction.likedByMe ? ' 취소' : ''}, 지금 ${reaction.likeCount}개`}
          >
            <ThumbIcon />
            좋아요 {reaction.likeCount}
          </button>
        )}
        {onEdit ? (
          <button type="button" className="review-edit" onClick={onEdit}>
            고치기
          </button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="form-error mt-2">
          {error}
        </p>
      ) : null}
    </article>
  );
}

export function CommentsSection({
  watchEventId,
  comments,
  status,
  myAccountId,
  onChange,
  onRetry,
}: {
  watchEventId: string;
  comments: WatchCommentView[];
  status: 'loading' | 'ready' | 'error';
  myAccountId: string;
  /** Takes an update of the latest list, so two quick deletes or a post during a delete both stick. */
  onChange: (update: (current: WatchCommentView[]) => WatchCommentView[]) => void;
  onRetry: () => void;
}) {
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // A second tap on delete while the first is on its way does nothing.
  const [removing, setRemoving] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = content.trim();
    if (!text || busy) return;
    setBusy(true);
    setError('');
    try {
      const created = await createWatchComment(watchEventId, text);
      onChange((current) => [...current, created]);
      setContent('');
    } catch (caught) {
      setError(errorMessage(caught, '댓글을 남기지 못했어요.'));
    } finally {
      setBusy(false);
    }
  }

  async function remove(commentId: string) {
    if (removing) return;
    setRemoving(commentId);
    setError('');
    try {
      await deleteWatchComment(commentId);
      onChange((current) => current.filter((comment) => comment.id !== commentId));
    } catch (caught) {
      setError(errorMessage(caught, '댓글을 지우지 못했어요.'));
    } finally {
      setRemoving(null);
    }
  }

  return (
    <section className="comments-section" aria-labelledby="comments-title">
      <h2 id="comments-title" className="section-title">
        댓글 {status === 'ready' ? comments.length : ''}
      </h2>
      {status === 'loading' ? (
        <p className="page-description">댓글을 불러오는 중이에요…</p>
      ) : status === 'error' ? (
        <div className="home-feed-message mt-2" role="status">
          <div>
            <h3>댓글을 불러오지 못했어요.</h3>
            <p>기록과 리뷰는 그대로 볼 수 있어요.</p>
          </div>
          <button type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : comments.length ? (
        <ul className="comments-list">
          {comments.map((comment) => {
            const mine = comment.isMine || comment.author.id === myAccountId;
            const name = mine ? '나' : comment.author.nickname;
            return (
              <li key={comment.id} data-me={mine || undefined}>
                <span className="review-avatar" aria-hidden="true">
                  {name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="comments-meta">
                    <b>{name}</b> · {relativeTime(comment.createdAt)}
                  </p>
                  <p className="comments-text">{comment.content}</p>
                </div>
                {mine ? (
                  <button
                    type="button"
                    className="comments-delete"
                    aria-label="내 댓글 삭제"
                    disabled={removing === comment.id}
                    onClick={() => remove(comment.id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
                    </svg>
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="page-description">아직 댓글이 없어요. 그날 이야기를 나눠 보세요.</p>
      )}
      {/* Pinned to the bottom of the screen, so a comment can be written from anywhere. */}
      <div className="comments-bar">
        {error ? (
          <p role="alert" className="form-error mb-2">
            {error}
          </p>
        ) : null}
        <form className="comments-form" onSubmit={submit}>
          <label htmlFor="comment-input" className="sr-only">
            댓글 입력
          </label>
          <input
            id="comment-input"
            maxLength={WATCH_COMMENT_MAX_LENGTH}
            placeholder="댓글 남기기"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <button type="submit" aria-label="댓글 보내기" disabled={busy || !content.trim()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12l16-8-6 16-3-7Z" />
            </svg>
            <span className="comments-send-label" aria-hidden="true">
              보내기
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
