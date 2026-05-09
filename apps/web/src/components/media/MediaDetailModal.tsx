"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { MediaDetail } from '../../lib/api/media';
import { BasicInfoGrid, DetailInfoCard, MyRatingCard, StillCutStrip } from './media-detail-sections';
import { getTmdbGenreNames } from './media-genres';

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1f4e82] shadow-[0_8px_18px_rgba(31,65,114,0.08)] ring-1 ring-[#edf2f8]">
      {children}
    </button>
  );
}

function Poster({ media }: { media: MediaDetail }) {
  if (media.posterUrl) {
    return <img src={media.posterUrl} alt={`${media.title} 포스터`} className="h-[158px] w-[106px] shrink-0 rounded-[16px] object-cover shadow-[0_16px_28px_rgba(21,38,69,0.18)] min-[390px]:h-[170px] min-[390px]:w-[114px]" />;
  }

  return <div className="h-[158px] w-[106px] shrink-0 rounded-[16px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_16px_28px_rgba(21,38,69,0.18)] min-[390px]:h-[170px] min-[390px]:w-[114px]" />;
}

function GenreTags({ media }: { media: MediaDetail }) {
  const tags = (media.genres?.length ? media.genres : getTmdbGenreNames({ genreIds: media.genreIds ?? [], mediaType: media.mediaType })).slice(0, 3);
  const fallbackTags = tags.length > 0 ? tags : [media.mediaType === 'TV' ? '드라마' : '영화'];
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {fallbackTags.map((tag) => (
        <span key={tag} className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[10px] font-extrabold text-[#2a5b8a]">{tag}</span>
      ))}
    </div>
  );
}

function StarIcon() {
  return <span className="text-[17px] leading-none text-[#ff5a52]">★</span>;
}

function fallbackOverview(media: MediaDetail) {
  return media.overview || '작품 소개가 아직 준비되지 않았어요. 다이어리를 작성하며 나만의 감상을 남겨보세요.';
}

export function MediaDetailModal({ media, isOpen, onClose, returnTo }: { media: MediaDetail | null; isOpen: boolean; onClose: () => void; returnTo?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !media) {
    return null;
  }

  const detailTitle = media.mediaType === 'TV' ? '드라마 상세' : '영화 상세';
  const year = media.releaseDate?.slice(0, 4) ?? '연도 미상';
  const runtimeText = media.runtime ? `${media.runtime}분` : '러닝타임 준비 중';
  const overview = fallbackOverview(media);
  const tmdbRating = media.tmdbRating == null ? null : (media.tmdbRating / 2).toFixed(1);
  const diaryUrl = `/diary/new?mediaId=${encodeURIComponent(media.id)}&returnTo=${encodeURIComponent(returnTo ?? `/explore?detail=${media.id}`)}`;

  return (
    <div className="fixed inset-0 z-[80] flex justify-center overflow-hidden bg-[#172947]/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={detailTitle} data-design="media-detail-modal">
      <div data-design="media-detail-scroll-shell" className="relative h-dvh w-full max-w-[430px] overflow-x-hidden overflow-y-auto bg-[#f8fafd] px-4 pb-28 pt-0 shadow-[0_0_40px_rgba(15,23,42,0.18)] min-[390px]:px-5">
        <header className="sticky top-0 z-20 -mx-4 flex h-[62px] items-center justify-between bg-[#f8fafd]/95 px-4 shadow-[0_8px_24px_rgba(31,65,114,0.06)] backdrop-blur min-[390px]:-mx-5 min-[390px]:px-5">
          <IconButton label="상세 닫기" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </IconButton>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-black leading-[22px] tracking-[-0.025em] text-[#1f4e82]">{detailTitle}</h2>
          <div className="flex gap-2">
            <IconButton label="찜하기"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 3.8h8A1.2 1.2 0 0 1 15.2 5v11L10 13.1 4.8 16V5A1.2 1.2 0 0 1 6 3.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg></IconButton>
            <IconButton label="공유하기"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 13V3.8m0 0L6.6 7.2M10 3.8l3.4 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10.5v4.7h10v-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></IconButton>
          </div>
        </header>

        <section className="relative z-[1] mt-4 flex gap-3 min-[390px]:gap-4">
          <Poster media={media} />
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="line-clamp-2 text-[24px] font-black leading-[29px] tracking-[-0.045em] text-[#1f4e82]">{media.title}</h1>
            <p className="mt-1 truncate text-[13px] font-bold leading-[18px] text-[#8a94a6]">{media.originalTitle || media.title}</p>
            <p className="mt-2 text-[12px] font-extrabold leading-[17px] text-[#6e7889]">{year} · {runtimeText}</p>
            <GenreTags media={media} />
            <div className="mt-3 flex items-center gap-1.5">
              <StarIcon />
              <strong className="text-[20px] font-black leading-none text-[#1f4e82]">{tmdbRating ?? '-'}</strong>
              <span className="text-[11px] font-bold text-[#9aa6b8]">(TMDB{media.tmdbVoteCount ? ` · ${media.tmdbVoteCount.toLocaleString()}명` : ''})</span>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-2.5 min-[375px]:grid-cols-[1.25fr_0.75fr]">
          <button type="button" onClick={() => router.push(diaryUrl)} className="flex h-[50px] items-center justify-center gap-2 rounded-[16px] bg-[#ff5a52] text-[13px] font-black text-white shadow-[0_12px_22px_rgba(255,90,82,0.28)]">
            <span aria-hidden="true">✎</span> 리뷰·다이어리 작성
          </button>
          <button type="button" className="flex h-[50px] items-center justify-center gap-1.5 rounded-[16px] bg-white text-[13px] font-black text-[#1f4e82] shadow-[0_10px_22px_rgba(31,65,114,0.08)] ring-1 ring-[#edf2f8]">
            ♡ 찜하기
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <DetailInfoCard title="시놉시스">{overview}</DetailInfoCard>
        </div>

        <StillCutStrip media={media} />

        <div className="mt-5 grid gap-3 min-[390px]:grid-cols-2">
          <BasicInfoGrid media={media} />
          <MyRatingCard />
        </div>
      </div>
    </div>
  );
}
