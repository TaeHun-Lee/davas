'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { listRecords, mediaTypeLabel, type RecordCardData } from '../../lib/api/core';
import { type MediaDetail } from '../../lib/api/media';
import { addWatchlist, removeWatchlist } from '../../lib/api/watchlist';
import {
  BasicInfoGrid,
  DetailInfoCard,
  FriendRecordsCard,
  MyRatingCard,
  StillCutStrip,
  type FriendRecordsStatus,
} from './media-detail-sections';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMediaTogether } from '../../hooks/useMediaTogether';
import { useSpaceWish } from '../../hooks/useSpaceWish';
import { TheaterShowtimesCard } from './media-showtimes-section';
import { OurReactionsCard, WatchableNowCard } from './media-together-sections';

function IconButton({
  label,
  children,
  onClick,
  pressed,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(31,65,114,0.08)] ring-1 ring-[#edf2f8] transition ${pressed ? 'text-[#8f2620]' : 'text-[var(--heading)]'}`}
    >
      {children}
    </button>
  );
}

function Poster({ media }: { media: MediaDetail }) {
  if (media.posterUrl) {
    return (
      <img
        src={media.posterUrl}
        alt={`${media.title} 포스터`}
        className="h-[108px] w-[72px] shrink-0 rounded-[14px] object-cover shadow-[0_16px_28px_rgba(21,38,69,0.18)]"
      />
    );
  }

  return (
    <div className="h-[108px] w-[72px] shrink-0 rounded-[14px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_16px_28px_rgba(21,38,69,0.18)]" />
  );
}

function GenreTags({ media }: { media: MediaDetail }) {
  const tags = media.genres.slice(0, 3);
  const fallbackTags = tags.length > 0 ? tags : [mediaTypeLabel(media.mediaType)];
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {fallbackTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[12px] font-extrabold text-[#2a5b8a]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function StarIcon() {
  return <span className="text-[17px] leading-none text-[#b63b36]">★</span>;
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 13V3.8m0 0L6.6 7.2M10 3.8l3.4 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 10.5v4.7h10v-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function fallbackOverview(media: MediaDetail) {
  return (
    media.overview || '작품 소개가 아직 준비되지 않았어요. 보고 나서 우리만의 감상을 남겨 보세요.'
  );
}

type MediaDetailModalProps = {
  media: MediaDetail;
  isOpen: boolean;
  onClose: () => void;
  returnTo?: string;
  recordHref?: string;
  recordLabel?: string;
  onRecord?: () => void;
};

export function MediaDetailModal({
  media,
  isOpen,
  onClose,
  returnTo,
  recordHref,
  recordLabel = '이 작품 기록하기',
  onRecord,
}: MediaDetailModalProps) {
  const router = useRouter();
  const [watchlistItemId, setWatchlistItemId] = useState(media.watchlistItemId ?? null);
  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const [shareLabel, setShareLabel] = useState('공유하기');
  const [friendRecords, setFriendRecords] = useState<RecordCardData[]>([]);
  const [friendRecordsStatus, setFriendRecordsStatus] = useState<FriendRecordsStatus>('loading');
  const [friendRecordsCursor, setFriendRecordsCursor] = useState<string | null>(null);
  const [friendRecordsHasMore, setFriendRecordsHasMore] = useState(false);
  const [isFriendRecordsLoadingMore, setIsFriendRecordsLoadingMore] = useState(false);
  const [friendRecordsLoadMoreError, setFriendRecordsLoadMoreError] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ startY: number; distance: number } | null>(null);
  const closeDialog = useCallback(() => onClose(), [onClose]);
  useFocusTrap(isOpen, dialogRef, closeDialog);
  // With a space, "보고 싶어요" goes on the space's shared list; without one it stays personal.
  // Until the space lookup answers, the button waits instead of using the personal list.
  const spaceWish = useSpaceWish(media.id, isOpen);
  // How my space rated the title and where it can be watched now.
  const { together, watchable } = useMediaTogether(media.id, isOpen);
  const wanted = spaceWish.wish
    ? spaceWish.wish.wanted
    : !spaceWish.loading && Boolean(watchlistItemId);
  const wishPending = spaceWish.loading || (spaceWish.wish ? spaceWish.pending : isFavoritePending);
  const wishLabel = spaceWish.wish ? '같이 보고 싶어요' : '보고 싶어요';
  const toggleWish = () => {
    if (spaceWish.loading) return;
    return spaceWish.wish ? spaceWish.toggle() : handleFavoriteToggle();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setWatchlistItemId(media.watchlistItemId ?? null);
    setShareLabel('공유하기');
  }, [media.id, media.watchlistItemId]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setFriendRecords([]);
    setFriendRecordsStatus('loading');
    setFriendRecordsCursor(null);
    setFriendRecordsHasMore(false);
    setFriendRecordsLoadMoreError(false);
    listRecords('friends', { mediaId: media.id, limit: 12 })
      .then((response) => {
        if (!active) return;
        setFriendRecords(response.items.filter((record) => !record.isMine));
        setFriendRecordsCursor(response.nextCursor);
        setFriendRecordsHasMore(response.hasMore);
        setFriendRecordsStatus('ready');
      })
      .catch(() => {
        if (active) setFriendRecordsStatus('error');
      });
    return () => {
      active = false;
    };
  }, [isOpen, media.id]);

  async function loadMoreFriendRecords() {
    if (isFriendRecordsLoadingMore || !friendRecordsHasMore || !friendRecordsCursor) {
      return;
    }
    setIsFriendRecordsLoadingMore(true);
    setFriendRecordsLoadMoreError(false);
    try {
      const response = await listRecords('friends', {
        mediaId: media.id,
        cursor: friendRecordsCursor,
        limit: 12,
      });
      const visible = response.items.filter((record) => !record.isMine);
      setFriendRecords((current) =>
        Array.from(new Map([...current, ...visible].map((record) => [record.id, record])).values()),
      );
      setFriendRecordsCursor(response.nextCursor);
      setFriendRecordsHasMore(response.hasMore);
    } catch {
      setFriendRecordsLoadMoreError(true);
    } finally {
      setIsFriendRecordsLoadingMore(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  const detailTitle = media.mediaType === 'TV' ? '드라마 상세' : '영화 상세';
  const year = media.releaseDate?.slice(0, 4) ?? '연도 미상';
  const runtimeText = media.runtime ? `${media.runtime}분` : '러닝타임 준비 중';
  const overview = fallbackOverview(media);
  const tmdbRating = media.tmdbRating == null ? null : (media.tmdbRating / 2).toFixed(1);
  const detailReturnTo = returnTo ?? `/records/new?step=find&detail=${media.id}`;
  const detailUrl =
    typeof window === 'undefined' ? detailReturnTo : `${window.location.origin}${detailReturnTo}`;
  const recordUrl =
    recordHref ??
    `/records/new?mediaId=${encodeURIComponent(media.id)}&returnTo=${encodeURIComponent(detailReturnTo)}`;

  async function handleFavoriteToggle() {
    if (isFavoritePending) return;
    const previous = watchlistItemId;
    setIsFavoritePending(true);
    try {
      if (watchlistItemId) {
        await removeWatchlist(watchlistItemId);
        setWatchlistItemId(null);
      } else {
        const result = await addWatchlist(media.id);
        setWatchlistItemId(result.id);
      }
    } catch {
      setWatchlistItemId(previous);
    } finally {
      setIsFavoritePending(false);
    }
  }

  async function handleShare() {
    const shareData = { title: media.title, text: `${media.title} 상세 보기`, url: detailUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(detailUrl);
        setShareLabel('링크 복사됨');
      }
    } catch {
      setShareLabel('공유 실패');
    }
  }

  // Dragging the handle down past a short distance closes the sheet, as phones do.
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: event.clientY, distance: 0 };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Without capture the drag still follows moves over the handle.
    }
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !sheetRef.current) return;
    drag.current.distance = Math.max(0, event.clientY - drag.current.startY);
    sheetRef.current.style.transform = `translateY(${drag.current.distance}px)`;
  };
  const endDrag = () => {
    const distance = drag.current?.distance ?? 0;
    drag.current = null;
    if (distance > 120) onClose();
    else if (sheetRef.current) sheetRef.current.style.transform = '';
  };

  return (
    <div
      ref={dialogRef}
      className="media-sheet-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-sheet-title"
      data-design="media-detail-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* As on the C안 board: a sheet from the bottom on a phone, a centred window on a
          computer, with the same content. */}
      <div ref={sheetRef} className="media-sheet" data-design="media-detail-scroll-shell">
        <div
          className="media-sheet-handle"
          aria-hidden="true"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span />
        </div>
        <div className="media-sheet-tools">
          <IconButton label={shareLabel} onClick={() => void handleShare()}>
            <ShareIcon />
          </IconButton>
          <IconButton label={`${detailTitle} 닫기`} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </div>

        <section className="relative z-[1] mt-1 flex gap-3 min-[390px]:gap-4">
          <Poster media={media} />
          <div className="min-w-0 flex-1 pt-1">
            <h2
              id="media-sheet-title"
              className="line-clamp-2 text-[22px] font-black leading-[28px] tracking-[-0.04em] text-[var(--heading)]"
            >
              {media.title}
            </h2>
            <p className="mt-1 truncate text-[13px] font-bold leading-[18px] text-[var(--muted)]">
              {media.originalTitle || media.title}
            </p>
            <p className="mt-2 text-[12px] font-extrabold leading-[17px] text-[var(--muted)]">
              {year} · {runtimeText}
            </p>
            <GenreTags media={media} />
            <div className="mt-3 flex items-center gap-1.5">
              <StarIcon />
              <strong className="text-[20px] font-black leading-none text-[var(--heading)]">
                {tmdbRating ?? '-'}
              </strong>
              <span className="text-[12px] font-bold text-[var(--muted)]">
                (TMDB{media.tmdbVoteCount ? ` · ${media.tmdbVoteCount.toLocaleString()}명` : ''})
              </span>
            </div>
          </div>
        </section>

        <div className="media-sheet-actions mt-5 grid grid-cols-1 gap-2.5 min-[375px]:grid-cols-[1.25fr_0.75fr]">
          <button
            type="button"
            onClick={() => (onRecord ? onRecord() : router.push(recordUrl))}
            className="flex h-[52px] items-center justify-center rounded-[16px] bg-[var(--blue)] text-[15px] font-black text-white shadow-[0_12px_24px_rgba(33,107,216,0.22)]"
          >
            {recordLabel}
          </button>
          <button
            type="button"
            aria-pressed={wanted}
            disabled={wishPending}
            onClick={() => void toggleWish()}
            className={`flex h-[52px] items-center justify-center gap-1.5 rounded-[16px] text-[14px] font-black shadow-[0_10px_22px_rgba(31,65,114,0.08)] ring-1 transition ${wanted ? 'bg-[#ffe7e5] text-[#8f2620] ring-[#f6c9c5]' : 'bg-white text-[var(--heading)] ring-[#edf2f8]'}`}
          >
            {wanted ? `♥ ${wishLabel}` : `♡ ${wishLabel}`}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <WatchableNowCard
            status={watchable.status}
            availability={watchable.availability}
            myServices={together.myServices}
          />
          <TheaterShowtimesCard
            mediaId={media.id}
            enabled={isOpen && media.mediaType === 'MOVIE'}
          />
          {/* With a space, its members' reactions; without one, the older friends' records. */}
          {together.status === 'ready' && !together.space ? (
            <FriendRecordsCard
              records={friendRecords}
              status={friendRecordsStatus}
              returnTo={detailReturnTo}
              hasMore={friendRecordsHasMore}
              isLoadingMore={isFriendRecordsLoadingMore}
              loadMoreError={friendRecordsLoadMoreError}
              onLoadMore={() => void loadMoreFriendRecords()}
            />
          ) : (
            <OurReactionsCard
              status={together.status}
              spaceName={together.space?.name ?? ''}
              comparison={together.comparison}
              myAccountId={together.myAccountId}
              returnTo={detailReturnTo}
            />
          )}
          <DetailInfoCard title="시놉시스">{overview}</DetailInfoCard>
          <BasicInfoGrid media={media} />
          <MyRatingCard
            diaries={media.myDiaries ?? (media.myDiary ? [media.myDiary] : [])}
            averageRating={media.myAverageRating ?? media.myDiary?.rating ?? null}
          />
        </div>

        <StillCutStrip media={media} />
      </div>
    </div>
  );
}
