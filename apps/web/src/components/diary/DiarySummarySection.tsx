import { SectionTitle } from '../home/SectionTitle';
import type { DiarySummary } from './diary-dashboard-types';
import { DiarySummaryCard } from './DiarySummaryCard';

type DiarySummarySectionProps = {
  summary: DiarySummary;
};

export function DiarySummarySection({ summary }: DiarySummarySectionProps) {
  return (
    <section aria-labelledby="diary-summary-title">
      <SectionTitle title="나의 다이어리 요약" actionLabel="더보기 ›" />
      <h2 id="diary-summary-title" className="sr-only">나의 다이어리 요약</h2>
      <div className="grid grid-cols-2 gap-3 min-[390px]:grid-cols-4">
        <DiarySummaryCard icon="▣" label="전체 기록" value={`${summary.totalCount}편`} caption="지금까지 쓴 기록" tone="blue" />
        <DiarySummaryCard icon="◷" label="이번 달" value={`${summary.monthlyCount}편`} caption="이번 달 작성" tone="red" />
        <DiarySummaryCard icon="★" label="평균 평점" value={summary.averageRating.toFixed(2)} caption="나의 평균 별점" tone="yellow" />
        <DiarySummaryCard icon="♬" label="최다 장르" value={summary.topGenre?.name ?? '-'} caption={summary.topGenre ? `${summary.topGenre.count}편` : '기록 없음'} tone="navy" />
      </div>
    </section>
  );
}
