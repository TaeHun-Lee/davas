import { CommunityDiaryCard } from './CommunityDiaryCard';
import type { CommunityDiaryCard as CommunityDiaryCardType, CommunityTab } from './community-types';

type CommunityFeedSectionProps = {
  items: CommunityDiaryCardType[];
  tab: CommunityTab;
  isLoading?: boolean;
};

function emptyMessage(tab: CommunityTab) {
  if (tab === 'following') return '팔로잉 피드는 관계 기능 연결 후 표시됩니다.';
  return '아직 공개 다이어리가 없어요.';
}

export function CommunityFeedSection({ items, tab, isLoading = false }: CommunityFeedSectionProps) {
  return (
    <section className="pb-3" aria-labelledby="community-feed-title">
      <h2 id="community-feed-title" className="mb-3 text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">커뮤니티 피드</h2>
      {isLoading ? <div className="h-[124px] rounded-[22px] bg-white shadow-[0_12px_28px_rgba(31,65,114,0.06)]" aria-label="커뮤니티 피드를 불러오는 중" /> : null}
      {!isLoading && items.length === 0 ? (
        <p className="rounded-[22px] bg-white px-5 py-8 text-center text-[13px] font-bold text-[#8b96a8] shadow-[0_12px_28px_rgba(31,65,114,0.06)]">{emptyMessage(tab)}</p>
      ) : null}
      <div className="space-y-3">
        {items.map((item) => (
          <CommunityDiaryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
