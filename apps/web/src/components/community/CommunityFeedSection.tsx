import { CommunityDiaryCard } from './CommunityDiaryCard';
import type { CommunityDiaryCard as CommunityDiaryCardType } from './community-types';
import Link from 'next/link';

type CommunityFeedSectionProps = {
  items: CommunityDiaryCardType[];
  isLoading?: boolean;
};

export function CommunityFeedSection({ items, isLoading = false }: CommunityFeedSectionProps) {
  return (
    <section className="pb-3" aria-labelledby="community-feed-title">
      <h2
        id="community-feed-title"
        className="mb-3 text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]"
      >
        허용된 기록
      </h2>
      {isLoading ? (
        <div
          className="h-[124px] rounded-[22px] bg-white shadow-[0_12px_28px_rgba(31,65,114,0.06)]"
          aria-label="커뮤니티 피드를 불러오는 중"
        />
      ) : null}
      {!isLoading && items.length === 0 ? (
        <div className="rounded-[22px] bg-white px-5 py-8 text-center shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
          <p className="text-[13px] font-bold text-[#65758a]">친구가 공유한 기록이 아직 없어요.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link
              href="/friends"
              className="flex min-h-11 items-center rounded-[14px] bg-[#284778] px-4 text-[12px] font-black text-white"
            >
              친구 찾기
            </Link>
            <Link
              href="/explore?intent=record"
              className="flex min-h-11 items-center rounded-[14px] bg-[#eef5ff] px-4 text-[12px] font-black text-[#216bd8]"
            >
              기록 남기기
            </Link>
          </div>
        </div>
      ) : null}
      <div className="space-y-3">
        {items.map((item) => (
          <CommunityDiaryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
