export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type CalendarDayStateInput = {
  index: number;
  day: number;
  leadingDays: number;
  currentMonthDays: number;
  watchedDays: ReadonlySet<number>;
  diaryDays: ReadonlySet<number>;
  selectedDay?: number;
};

export function getCalendarDayState({
  index,
  day,
  leadingDays,
  currentMonthDays,
  watchedDays,
  diaryDays,
  selectedDay,
}: CalendarDayStateInput) {
  const currentMonth = index >= leadingDays && index < leadingDays + currentMonthDays;
  return {
    currentMonth,
    isWatched: currentMonth && watchedDays.has(day),
    hasDiary: currentMonth && diaryDays.has(day),
    selected: currentMonth && day === selectedDay,
  };
}
