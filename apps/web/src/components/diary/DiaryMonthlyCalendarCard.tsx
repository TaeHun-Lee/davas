import { useState } from 'react';
import { getDiaryCalendarDays } from './diary-dashboard-utils';
import type { DiaryCalendarMarker } from './diary-dashboard-types';

type DiaryMonthlyCalendarCardProps = {
  year: number;
  month: number;
  selectedDay?: number;
  markers: DiaryCalendarMarker[];
  onDaySelect?: (day: number) => void;
  onMonthChange?: (offset: -1 | 1) => void;
  onMonthSelect?: (year: number, month: number) => void;
  onSelectAll?: () => void;
};

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

export function DiaryMonthlyCalendarCard({
  year,
  month,
  selectedDay,
  markers,
  onDaySelect,
  onMonthChange,
  onMonthSelect,
  onSelectAll,
}: DiaryMonthlyCalendarCardProps) {
  const days = getDiaryCalendarDays({ year, month, selectedDay, markers });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  const handleMonthPickerToggle = () => {
    setPickerYear(year);
    setMonthPickerOpen((open) => !open);
  };

  const handleMonthSelect = (monthOption: number) => {
    onMonthSelect?.(pickerYear, monthOption);
    setMonthPickerOpen(false);
  };

  return (
    <article className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(31,42,68,0.07)]">
      <div className="mb-4 flex flex-col gap-3">
        <h3 className="text-[15px] font-extrabold leading-snug text-[#1f2a44]">이번 달 기록 캘린더</h3>
        <div className="relative flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="이전 달 보기"
            onClick={() => onMonthChange?.(-1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f6fb] text-[14px] font-extrabold text-[#526078]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="월 선택 팝업 열기"
            aria-expanded={monthPickerOpen}
            onClick={handleMonthPickerToggle}
            className="min-w-[64px] rounded-full bg-[#eef5ff] px-3 py-1.5 text-[12px] font-extrabold leading-none text-[#216bd8]"
          >
            {month}월
          </button>
          <button
            type="button"
            aria-label="다음 달 보기"
            onClick={() => onMonthChange?.(1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f6fb] text-[14px] font-extrabold text-[#526078]"
          >
            ›
          </button>
          {monthPickerOpen ? (
            <div
              role="dialog"
              aria-label="월 선택 팝업"
              className="absolute left-1/2 top-10 z-10 w-[188px] -translate-x-1/2 rounded-[20px] bg-white p-3 shadow-[0_16px_34px_rgba(31,42,68,0.18)] ring-1 ring-[#e7edf7]"
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="이전 연도 보기"
                  onClick={() => setPickerYear((currentYear) => currentYear - 1)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f6fb] text-[13px] font-extrabold text-[#526078]"
                >
                  ‹
                </button>
                <span className="text-[12px] font-extrabold text-[#1f2a44]">{pickerYear}년</span>
                <button
                  type="button"
                  aria-label="다음 연도 보기"
                  onClick={() => setPickerYear((currentYear) => currentYear + 1)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f6fb] text-[13px] font-extrabold text-[#526078]"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {monthOptions.map((monthOption) => (
                  <button
                    key={monthOption}
                    type="button"
                    aria-label={`${pickerYear}년 ${monthOption}월 선택`}
                    onClick={() => handleMonthSelect(monthOption)}
                    className={
                      pickerYear === year && monthOption === month
                        ? 'rounded-full bg-[#216bd8] px-2 py-1.5 text-[11px] font-extrabold text-white'
                        : 'rounded-full bg-[#f6f8fc] px-2 py-1.5 text-[11px] font-bold text-[#526078]'
                    }
                  >
                    {monthOption}월
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="달력 전체 선택"
          onClick={onSelectAll}
          className="self-center rounded-full bg-[#f8fbff] px-3 py-1 text-[11px] font-bold text-[#6f7b8f]"
        >
          월 전체 보기
        </button>
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
            disabled={!day.currentMonth}
            onClick={() => day.currentMonth && onDaySelect?.(day.day)}
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
