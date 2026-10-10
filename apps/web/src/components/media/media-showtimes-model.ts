import type { TheaterShowtimes } from '@davas/shared';

const DAY_MS = 24 * 60 * 60 * 1000;

/** "오늘 10.10", "내일 10.11", then the weekday: "월 10.12". */
export function showtimeDateLabel(date: string, today: string) {
  const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10);
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
  return {
    name: date === today ? '오늘' : date === tomorrow ? '내일' : weekday,
    day: `${Number(date.slice(5, 7))}.${Number(date.slice(8, 10))}`,
  };
}

/** "10월 10일 12:00 기준" for when the schedules were read. */
export function showtimesReadLabel(updatedAt: string | null) {
  if (!updatedAt) return null;
  const read = new Date(updatedAt);
  const day = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
  }).format(read);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(read);
  return `${day} ${time} 기준`;
}

/** The regions a day's theaters are in, Seoul first. */
export function showtimeRegions(theaters: TheaterShowtimes[]) {
  return [...new Set(theaters.map((theater) => theater.region))].sort(
    (a, b) => Number(b === '서울') - Number(a === '서울') || a.localeCompare(b, 'ko'),
  );
}
