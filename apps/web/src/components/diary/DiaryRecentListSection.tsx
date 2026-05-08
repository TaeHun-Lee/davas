import { SectionTitle } from '../home/SectionTitle';
import type { DiaryListItemView } from './diary-dashboard-types';
import { DiaryListItem } from './DiaryListItem';

type DiaryRecentListSectionProps = {
  items: DiaryListItemView[];
};

export function DiaryRecentListSection({ items }: DiaryRecentListSectionProps) {
  return (
    <section className="pb-24" aria-labelledby="recent-diaries-title">
      <SectionTitle title="최근 작성한 다이어리" actionLabel="더보기 ›" />
      <h2 id="recent-diaries-title" className="sr-only">최근 작성한 다이어리</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <DiaryListItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
