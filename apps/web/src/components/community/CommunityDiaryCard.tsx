import Link from 'next/link';
import { normalizeProfileImageUrl } from '../../lib/api/auth';
import type { CommunityDiaryCard as CommunityDiaryCardType } from './community-types';

type CommunityDiaryCardProps = {
  item: CommunityDiaryCardType;
  compact?: boolean;
};

function Poster({ title, posterUrl, className }: { title: string; posterUrl: string | null; className: string }) {
  if (posterUrl) {
    return <img src={posterUrl} alt={`${title} 포스터`} className={`${className} object-cover`} />;
  }
  return <div className={`${className} bg-[linear-gradient(145deg,#edf3fb_0%,#f8fbff_100%)]`} aria-label={`${title} 포스터 없음`} />;
}

function Avatar({ nickname, imageUrl }: { nickname: string; imageUrl: string | null }) {
  const profileImageUrl = normalizeProfileImageUrl(imageUrl);
  if (profileImageUrl) {
    return <img src={profileImageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf1ff] text-[10px] font-black text-[#216bd8]" aria-hidden="true">
      {nickname.slice(0, 1)}
    </span>
  );
}

export function CommunityDiaryCard({ item, compact = false }: CommunityDiaryCardProps) {
  return (
    <article className={`min-w-0 rounded-[22px] bg-white p-3 shadow-[0_12px_28px_rgba(31,65,114,0.08)] ${compact ? 'w-[184px]' : ''}`}>
      <div className="flex gap-3">
        <Link href={`/diary/${item.id}`} aria-label={`${item.media.title} 다이어리 보기`}>
          <Poster title={item.media.title} posterUrl={item.media.posterUrl} className={`${compact ? 'h-[112px] w-[74px]' : 'h-[124px] w-[82px]'} shrink-0 overflow-hidden rounded-[16px]`} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/community/authors/${item.author.id}`} className="flex items-center gap-1.5" aria-label={`${item.author.nickname} 작성자 프로필 보기`}>
            <Avatar nickname={item.author.nickname} imageUrl={item.author.profileImageUrl} />
            <span className="truncate text-[11px] font-extrabold text-[#6d7890]">{item.author.nickname}</span>
          </Link>
          <Link href={`/diary/${item.id}`} className="block" aria-label={`${item.media.title} 다이어리 보기`}>
            <h3 className="mt-2 truncate text-[14px] font-extrabold leading-[18px] text-[#1f2a44]">{item.media.title}</h3>
            <p className="mt-1 line-clamp-3 text-[11px] font-semibold leading-[16px] text-[#7f8aa0]">{item.hasSpoiler ? '스포일러가 포함된 기록입니다.' : item.contentPreview}</p>
          </Link>
          <div className="mt-3 flex items-center gap-3 text-[11px] font-extrabold text-[#8a95a8]">
            <span className="text-[#ff5a52]">★ {item.rating.toFixed(1)}</span>
            <span>댓글 {item.commentCount}</span>
            <span className={item.isLiked ? 'text-[#216bd8]' : ''}>좋아요 {item.likeCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
