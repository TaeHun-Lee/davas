import { getDiaryCalendarDays } from './diary-dashboard-utils';
import type { DiaryCalendarMarker } from './diary-dashboard-types';

type DiaryMonthlyCalendarCardProps = {
  year: number;
  month: number;
  selectedDay?: number;
  markers: DiaryCalendarMarker[];
};

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function DiaryMonthlyCalendarCard({ year, month, selectedDay, markers }: DiaryMonthlyCalendarCardProps) {
  const days = getDiaryCalendarDays({ year, month, selectedDay, markers });

  return (
    <article className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(31,42,68,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-[#1f2a44]">이번 달 기록 캘린더</h3>
        <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[11px] font-bold text-[#216bd8]">{month}월</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#a2acba]">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => (
          <button
            key={day.key}
            type="button"
            aria-selected={day.selected}
            aria-label={`${day.day}일 기록 ${day.entryCount}개`}
            className={
              day.selected
                ? 'relative grid h-8 place-items-center rounded-full bg-[#216bd8] text-[12px] font-extrabold text-white'
                : day.currentMonth
                  ? 'relative grid h-8 place-items-center rounded-full text-[12px] font-bold text-[#4b5875]'
                  : 'relative grid h-8 place-items-center rounded-full text-[12px] font-semibold text-[#c5ccd8]'
            }
          >
            {day.day}
            {day.entryCount > 0 ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#ef5870]" /> : null}
          </button>
        ))}
      </div>
    </article>
  );
}
