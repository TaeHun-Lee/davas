'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { type MediaDetail } from '../../lib/api/media';
import {
  BasicInfoGrid,
  DetailInfoCard,
  MyRatingCard,
  StillCutStrip,
} from './media-detail-sections';

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1f4e82] shadow-[0_8px_18px_rgba(31,65,114,0.08)] ring-1 ring-[#edf2f8] transition"
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
        className="h-[158px] w-[106px] shrink-0 rounded-[16px] object-cover shadow-[0_16px_28px_rgba(21,38,69,0.18)] min-[390px]:h-[170px] min-[390px]:w-[114px]"
      />
    );
  }

  return (
    <div className="h-[158px] w-[106px] shrink-0 rounded-[16px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_16px_28px_rgba(21,38,69,0.18)] min-[390px]:h-[170px] min-[390px]:w-[114px]" />
  );
}

function GenreTags({ media }: { media: MediaDetail }) {
  const tags = media.genres.slice(0, 3);
  const fallbackTags = tags.length > 0 ? tags : [media.mediaType === 'TV' ? '드라마' : '영화'];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {fallbackTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[10px] font-extrabold text-[#2a5b8a]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
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
    media.overview ||
    '작품 소개가 아직 준비되지 않았어요. 기록을 작성하며 나만의 감상을 남겨보세요.'
  );
}

export function MediaDetailModal({
  media,
  isOpen,
  onClose,
  returnTo,
}: {
  media: MediaDetail;
  isOpen: boolean;
  onClose: () => void;
  returnTo?: string;
}) {
  const router = useRouter();
  const [shareLabel, setShareLabel] = useState('공유하기');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeDialog = useCallback(() => onClose(), [onClose]);
  useFocusTrap(isOpen, dialogRef, closeDialog);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setShareLabel('공유하기');
  }, [media.id]);

  if (!isOpen) return null;

  const detailTitle = media.mediaType === 'TV' ? '드라마 상세' : '영화 상세';
  const year = media.releaseDate?.slice(0, 4) ?? '연도 미상';
  const runtimeText = media.runtime ? `${media.runtime}분` : '러닝타임 준비 중';
  const tmdbRating = media.tmdbRating == null ? null : (media.tmdbRating / 2).toFixed(1);
  const fallbackReturn = returnTo ?? '/records/new';
  const detailUrl =
    typeof window === 'undefined' ? fallbackReturn : `${window.location.origin}${fallbackReturn}`;
  const recordUrl = `/records/new?mediaId=${encodeURIComponent(
    media.id,
  )}&returnTo=${encodeURIComponent(fallbackReturn)}`;

  async function handleShare() {
    const shareData = {
      title: media.title,
      text: `${media.title} 상세 보기`,
      url: detailUrl,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(detailUrl);
        setShareLabel('링크 복사됨');
      }
    } catch {
      setShareLabel('공유 실패');
    }
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex justify-center overflow-hidden bg-[#172947]/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={detailTitle}
      data-design="media-detail-modal"
    >
      <div className="relative h-dvh w-full max-w-[430px] overflow-x-hidden overflow-y-auto bg-[#f8fafd] px-4 pb-28 shadow-[0_0_40px_rgba(15,23,42,0.18)] min-[390px]:px-5">
        <header className="sticky top-0 z-20 -mx-4 flex h-[62px] items-center justify-between bg-[#f8fafd]/95 px-4 shadow-[0_8px_24px_rgba(31,65,114,0.06)] backdrop-blur min-[390px]:-mx-5 min-[390px]:px-5">
          <IconButton label="상세 닫기" onClick={onClose}>
            <span aria-hidden="true">‹</span>
          </IconButton>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-black text-[#1f4e82]">
            {detailTitle}
          </h2>
          <IconButton label={shareLabel} onClick={() => void handleShare()}>
            <ShareIcon />
          </IconButton>
        </header>

        <section className="relative z-[1] mt-4 flex gap-3 min-[390px]:gap-4">
          <Poster media={media} />
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="line-clamp-2 text-[24px] font-black leading-[29px] tracking-[-0.045em] text-[#1f4e82]">
              {media.title}
            </h1>
            <p className="mt-1 truncate text-[13px] font-bold text-[#8a94a6]">
              {media.originalTitle || media.title}
            </p>
            <p className="mt-2 text-[12px] font-extrabold text-[#6e7889]">
              {year} · {runtimeText}
            </p>
            <GenreTags media={media} />
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[17px] text-[#ff5a52]">★</span>
              <strong className="text-[20px] font-black text-[#1f4e82]">{tmdbRating ?? '-'}</strong>
              <span className="text-[11px] font-bold text-[#9aa6b8]">TMDB</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => router.push(recordUrl)}
          className="mt-5 flex h-[50px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#ff5a52] text-[13px] font-black text-white shadow-[0_12px_22px_rgba(255,90,82,0.28)]"
        >
          <span aria-hidden="true">✎</span> 기록하기
        </button>

        <div className="mt-5 space-y-3">
          <DetailInfoCard title="시놉시스">{fallbackOverview(media)}</DetailInfoCard>
        </div>
        <StillCutStrip media={media} />
        <div className="mt-5 grid gap-3 min-[390px]:grid-cols-2">
          <BasicInfoGrid media={media} />
          <MyRatingCard
            diaries={media.myDiaries ?? (media.myDiary ? [media.myDiary] : [])}
            averageRating={media.myAverageRating ?? media.myDiary?.rating ?? null}
          />
        </div>
      </div>
    </div>
  );
}
