import type { DiaryCalendarMarker, DiaryGenreRatio } from './diary-dashboard-types';
import { DiaryGenreRatioCard } from './DiaryGenreRatioCard';
import { DiaryMonthlyCalendarCard } from './DiaryMonthlyCalendarCard';

type DiaryInsightGridProps = {
  year: number;
  month: number;
  selectedDay?: number;
  calendarMarkers: DiaryCalendarMarker[];
  genreRatios: DiaryGenreRatio[];
};

export function DiaryInsightGrid({ year, month, selectedDay, calendarMarkers, genreRatios }: DiaryInsightGridProps) {
  return (
    <section className="mt-5 grid grid-cols-1 gap-4 min-[390px]:grid-cols-2" aria-label="다이어리 통계">
      <DiaryMonthlyCalendarCard year={year} month={month} selectedDay={selectedDay} markers={calendarMarkers} />
      <DiaryGenreRatioCard items={genreRatios} />
    </section>
  );
}
