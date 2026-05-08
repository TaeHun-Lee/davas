import { SectionTitle } from '../home/SectionTitle';
import type { DiaryListItemView } from './diary-dashboard-types';
import { DiaryListItem } from './DiaryListItem';

type DiaryRecentListSectionProps = {
  items: DiaryListItemView[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DiaryRecentListSection({
  items,
  title = '최근 작성한 다이어리',
  description,
  emptyTitle = '검색 결과가 없어요',
  emptyDescription = '다른 제목이나 작품명으로 다시 검색해보세요',
}: DiaryRecentListSectionProps) {
  return (
    <section className="pb-24" aria-labelledby="recent-diaries-title">
      <SectionTitle title={title} />
      <h2 id="recent-diaries-title" className="sr-only">{title}</h2>
      {description ? <p className="mb-3 text-[12px] font-semibold text-[#8a95a5]">{description}</p> : null}
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <DiaryListItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] bg-white px-5 py-8 text-center shadow-[0_14px_34px_rgba(31,42,68,0.07)]">
          <p className="text-[15px] font-extrabold text-[#1f2a44]">{emptyTitle}</p>
          <p className="mt-2 text-[12px] font-semibold text-[#8a95a5]">{emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
