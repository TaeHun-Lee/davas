'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../layout/AppShell';
import { getCommunityDiary } from '../../lib/api/community';
import type { CommunityDiaryDetail as CommunityDiaryDetailType } from './community-types';
import { CommunityCommentsSection } from './CommunityCommentsSection';

type CommunityDiaryDetailProps = {
  diaryId: string;
};

type DetailStatus = 'loading' | 'ready' | 'error';

function Poster({ diary }: { diary: CommunityDiaryDetailType }) {
  if (diary.media.posterUrl) {
    return <img src={diary.media.posterUrl} alt={`${diary.media.title} 포스터`} className="h-[168px] w-[112px] rounded-[22px] object-cover shadow-[0_16px_32px_rgba(31,42,68,0.14)]" />;
  }
  return <div className="h-[168px] w-[112px] rounded-[22px] bg-[linear-gradient(145deg,#edf3fb_0%,#f8fbff_100%)]" aria-label={`${diary.media.title} 포스터 없음`} />;
}

export function CommunityDiaryDetail({ diaryId }: CommunityDiaryDetailProps) {
  const [diary, setDiary] = useState<CommunityDiaryDetailType | null>(null);
  const [status, setStatus] = useState<DetailStatus>('loading');
  const [showSpoilerContent, setShowSpoilerContent] = useState(false);

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    getCommunityDiary(diaryId)
      .then((nextDiary) => {
        if (!mounted) return;
        setDiary(nextDiary);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setDiary(null);
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [diaryId]);

  return (
    <AppShell>
      <article className="overflow-x-hidden pb-8" data-design="community-diary-detail">
        <Link href="/community" className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#216bd8] shadow-[0_10px_24px_rgba(31,65,114,0.08)]">
          커뮤니티로 돌아가기
        </Link>
        {status === 'loading' ? <div className="h-[360px] rounded-[28px] bg-white shadow-[0_14px_34px_rgba(31,65,114,0.06)]" aria-label="공개 다이어리를 불러오는 중" /> : null}
        {status === 'error' ? <p className="rounded-[24px] bg-white px-5 py-8 text-center text-[13px] font-bold text-[#e85b6a] shadow-[0_12px_28px_rgba(31,65,114,0.06)]">공개 다이어리를 불러오지 못했어요.</p> : null}
        {diary && status === 'ready' ? (
          <>
          <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_36px_rgba(31,42,68,0.08)]">
            <div className="flex gap-4">
              <Poster diary={diary} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-extrabold text-[#216bd8]">{diary.author.nickname}</p>
                <h1 className="mt-2 text-[20px] font-black leading-[26px] tracking-[-0.03em] text-[#1f2a44]">{diary.media.title}</h1>
                <p className="mt-1 text-[13px] font-bold text-[#66758c]">{diary.diaryTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-extrabold text-[#8a95a8]">
                  <span className="text-[#ff5a52]">★ {diary.rating.toFixed(1)}</span>
                  <span>{diary.watchedDate}</span>
                  <span>댓글 {diary.commentCount}</span>
                </div>
              </div>
            </div>
            {diary.media.genreNames.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {diary.media.genreNames.map((genre) => (
                  <span key={genre} className="rounded-full bg-[#eef5ff] px-3 py-1 text-[11px] font-extrabold text-[#216bd8]">{genre}</span>
                ))}
              </div>
            ) : null}
            {diary.hasSpoiler && !showSpoilerContent ? (
              <div className="mt-5 rounded-[22px] bg-[#fff6ec] p-4">
                <p className="text-[13px] font-extrabold text-[#9b5c17]">스포일러가 포함된 기록입니다.</p>
                <button type="button" onClick={() => setShowSpoilerContent(true)} className="mt-3 rounded-full bg-[#1f2a44] px-4 py-2 text-[12px] font-black text-white">
                  내용 보기
                </button>
              </div>
            ) : (
              <p className="mt-5 whitespace-pre-wrap text-[14px] font-semibold leading-[22px] text-[#4b5870]">{diary.content}</p>
            )}
          </div>
          <CommunityCommentsSection diaryId={diary.id} />
          </>
        ) : null}
      </article>
    </AppShell>
  );
}
