import Link from 'next/link';
import { CommunityDiaryCard } from './CommunityDiaryCard';
import type { CommunityDiaryCard as CommunityDiaryCardType } from './community-types';

type PopularDiariesSectionProps = {
  items: CommunityDiaryCardType[];
};

export function PopularDiariesSection({ items }: PopularDiariesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-7" aria-labelledby="popular-diaries-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="popular-diaries-title" className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">인기 다이어리</h2>
        <Link href="/community?tab=popular" className="text-[12px] font-extrabold text-[#216bd8]" aria-label="인기 다이어리 전체 보기">
          전체 보기 ›
        </Link>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 min-[390px]:-mx-5 min-[390px]:px-5">
        <div className="flex w-max gap-3 pb-1">
          {items.slice(0, 5).map((item) => (
            <CommunityDiaryCard key={item.id} item={item} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
