import { getCalendarDayState } from './home-utils';

export type MonthlyWatchCalendarSectionProps = {
  yearMonthLabel: string;
  days: number[];
  watchedDays: ReadonlySet<number>;
  diaryDays: ReadonlySet<number>;
  selectedDay: number;
  leadingDays?: number;
  currentMonthDays?: number;
};

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function MonthlyWatchCalendarSection({
  yearMonthLabel,
  days,
  watchedDays,
  diaryDays,
  selectedDay,
  leadingDays = 3,
  currentMonthDays = 31,
}: MonthlyWatchCalendarSectionProps) {
  return (
    <section className="card-surface mt-6 rounded-[22px] p-4 max-[374px]:p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">이번 달 관람 기록</h2>
          <div className="mt-2 flex gap-3 text-[10px] font-bold text-[#8b96a8]"><span><b className="text-[#216bd8]">●</b> 관람한 날</span><span><b className="text-[#ff5050]">●</b> 기록한 다이어리</span></div>
        </div>
        <div className="text-xs font-extrabold text-[#536179]">‹ {yearMonthLabel} ›</div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-extrabold text-[#9aa6b8]">
        {weekdays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-[#59667a]">
        {days.map((day, index) => {
          const { currentMonth, isWatched, hasDiary, selected } = getCalendarDayState({
            index,
            day,
            leadingDays,
            currentMonthDays,
            watchedDays,
            diaryDays,
            selectedDay,
          });
          return (
            <div key={`${day}-${index}`} className="relative flex h-7 items-center justify-center">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${selected ? 'bg-[#216bd8] text-white' : isWatched ? 'bg-[#eaf1ff] text-[#216bd8]' : currentMonth ? '' : 'text-[#c1cad7]'}`}>{day}</span>
              {hasDiary ? <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#ff5050]" /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
