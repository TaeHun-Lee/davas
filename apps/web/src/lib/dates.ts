/** `2026-10-04` → `10월 4일`; anything that is not a date is shown as given. */
export function monthDayLabel(date: string) {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  return match ? `${Number(match[1])}월 ${Number(match[2])}일` : date;
}

/** `2026-11-06T…` → `2026년 11월 6일`, in Korea. */
export function koreanDate(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}
