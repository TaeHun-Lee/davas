/**
 * Calendar dates in Davas are Korean dates. Comparing them with `toISOString()` (UTC) treats
 * today as tomorrow between 00:00 and 09:00 KST, so every "today" check goes through here.
 */
export function seoulToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Whether a `YYYY-MM-DD` date is later than today in Korea. */
export function isAfterSeoulToday(date: string, now = new Date()) {
  return date > seoulToday(now);
}
