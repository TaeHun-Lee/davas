'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../layout/AppShell';
import { followCommunityDiaryAuthor, getCommunityDiary, likeCommunityDiary, unfollowCommunityDiaryAuthor, unlikeCommunityDiary } from '../../lib/api/community';
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
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const [isLikePending, setIsLikePending] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

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

  async function handleFollowToggle() {
    if (!diary || diary.author.isMine || isFollowPending) return;
    setIsFollowPending(true);
    setFollowError(null);
    try {
      const result = diary.author.isFollowed ? await unfollowCommunityDiaryAuthor(diary.id) : await followCommunityDiaryAuthor(diary.id);
      setDiary((current) => {
        if (!current) return current;
        return {
          ...current,
          author: {
            ...current.author,
            isFollowed: result.isFollowed,
          },
        };
      });
    } catch {
      setFollowError('팔로우 상태를 변경하지 못했어요. 로그인 상태를 확인해주세요.');
    } finally {
      setIsFollowPending(false);
    }
  }

  async function handleLikeToggle() {
    if (!diary || isLikePending) return;
    setIsLikePending(true);
    setLikeError(null);
    try {
      const result = diary.isLiked ? await unlikeCommunityDiary(diary.id) : await likeCommunityDiary(diary.id);
      setDiary((current) => {
        if (!current) return current;
        const delta = result.isLiked === current.isLiked ? 0 : result.isLiked ? 1 : -1;
        return {
          ...current,
          isLiked: result.isLiked,
          likeCount: Math.max(0, current.likeCount + delta),
        };
      });
    } catch {
      setLikeError('좋아요 상태를 변경하지 못했어요. 로그인 상태를 확인해주세요.');
    } finally {
      setIsLikePending(false);
    }
  }

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
                <div className="flex items-center gap-2">
                  <Link href={`/community/authors/${diary.author.id}`} className="min-w-0 flex-1 truncate text-[12px] font-extrabold text-[#216bd8]">
                    {diary.author.nickname}
                  </Link>
                  {!diary.author.isMine ? (
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      disabled={isFollowPending}
                      className={`h-8 rounded-full px-3 text-[11px] font-black transition ${diary.author.isFollowed ? 'bg-[#eef3fb] text-[#4c5b73]' : 'bg-[#216bd8] text-white shadow-[0_8px_18px_rgba(33,107,216,0.24)]'} disabled:opacity-60`}
                    >
                      {diary.author.isFollowed ? '팔로잉' : '팔로우'}
                    </button>
                  ) : null}
                </div>
                <h1 className="mt-2 text-[20px] font-black leading-[26px] tracking-[-0.03em] text-[#1f2a44]">{diary.media.title}</h1>
                <p className="mt-1 text-[13px] font-bold text-[#66758c]">{diary.diaryTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-extrabold text-[#8a95a8]">
                  <span className="text-[#ff5a52]">★ {diary.rating.toFixed(1)}</span>
                  <span>{diary.watchedDate}</span>
                  <span>댓글 {diary.commentCount}</span>
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    disabled={isLikePending}
                    className={`rounded-full px-2 py-0.5 font-black transition ${diary.isLiked ? 'bg-[#eef5ff] text-[#216bd8]' : 'bg-[#f4f6fb] text-[#7b8798]'} disabled:opacity-60`}
                  >
                    좋아요 {diary.likeCount}
                  </button>
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
            {followError ? <p className="mt-4 text-[12px] font-bold text-[#e85b6a]">{followError}</p> : null}
            {likeError ? <p className="mt-2 text-[12px] font-bold text-[#e85b6a]">{likeError}</p> : null}
          </div>
          <CommunityCommentsSection diaryId={diary.id} />
          </>
        ) : null}
      </article>
    </AppShell>
  );
}
