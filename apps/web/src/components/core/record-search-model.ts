import type { WatchSearchMatchField } from '@davas/shared';

export const MATCH_LABELS: Record<WatchSearchMatchField, string> = {
  title: '제목',
  people: '함께 본 사람',
  place: '장소',
  service: 'OTT',
  memo: '추억 메모',
  review: '리뷰',
};

/**
 * A short piece of `text` around the searched words, split so the words can be marked. When
 * the words are not found as typed (the server also matches with spaces removed), the start
 * of the text is shown instead.
 */
export function searchSnippet(text: string, q: string, room = 44) {
  const flat = text.replace(/\s+/g, ' ').trim();
  const words = q.trim();
  const index = words ? flat.toLowerCase().indexOf(words.toLowerCase()) : -1;
  if (index < 0) {
    return { before: flat.length > room ? `${flat.slice(0, room)}…` : flat, hit: '', after: '' };
  }
  const start = Math.max(0, index - 14);
  const end = Math.min(flat.length, index + words.length + room - 14);
  return {
    before: `${start > 0 ? '…' : ''}${flat.slice(start, index)}`,
    hit: flat.slice(index, index + words.length),
    after: `${flat.slice(index + words.length, end)}${end < flat.length ? '…' : ''}`,
  };
}
