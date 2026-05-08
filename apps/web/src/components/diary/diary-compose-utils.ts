export function clampRating(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(5, Math.max(0, Math.round(value * 10) / 10));
}

export function ratingFromPointer({ clientX, left, width }: { clientX: number; left: number; width: number }) {
  if (width <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
  return clampRating(ratio * 5);
}

export function formatDisplayDate(value: string) {
  return value.replaceAll('-', '.');
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
