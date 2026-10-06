import type { WatchEvent, WatchParticipantStatus } from '../../lib/api/watch-events';

const SOURCE_LABELS = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV·소장',
  OTHER: '기타',
} as const;

export type WatchReactionRow = {
  accountId: string;
  name: string;
  isMe: boolean;
  status: Exclude<WatchParticipantStatus, 'DECLINED'>;
  rating: number | null;
  review: string | null;
};

/** `2026-10-04` → `10월 4일`. Falls back to the raw value for anything unexpected. */
export function watchedDayLabel(date: string) {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  return match ? `${Number(match[1])}월 ${Number(match[2])}일` : date;
}

export function watchSourceSummary(event: WatchEvent) {
  const source = event.source;
  if (!source) return null;
  return [SOURCE_LABELS[source.kind], source.providerName || source.placeText]
    .filter(Boolean)
    .join(' · ');
}

/**
 * One row per person who watched (or is asked to confirm watching), author first and
 * the viewer labelled "나". Declined people are left out: they said they were not there.
 */
export function reactionRows(event: WatchEvent, myAccountId: string): WatchReactionRow[] {
  const rows = event.participants
    .filter((participant) => participant.status !== 'DECLINED')
    .map((participant) => {
      const reaction = event.reactions.find((item) => item.accountId === participant.accountId);
      const isMe = participant.accountId === myAccountId;
      const isAuthor = participant.accountId === event.author.accountId;
      return {
        accountId: participant.accountId,
        name: isMe
          ? '나'
          : participant.nickname || (isAuthor ? event.author.nickname : undefined) || '공간 멤버',
        isMe,
        status: participant.status as WatchReactionRow['status'],
        rating: reaction?.rating ?? null,
        review: reaction?.review?.trim() || null,
      };
    });
  return rows.sort(
    (a, b) =>
      Number(b.accountId === event.author.accountId) -
      Number(a.accountId === event.author.accountId),
  );
}

/** Records someone else logged with the viewer as a companion, still waiting for a yes/no. */
export function pendingConfirmations(items: WatchEvent[], myAccountId: string) {
  return items.filter(
    (item) =>
      !item.isMine &&
      item.participants.some(
        (participant) => participant.accountId === myAccountId && participant.status === 'PENDING',
      ),
  );
}

export function withMyParticipation(
  event: WatchEvent,
  myAccountId: string,
  status: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>,
): WatchEvent {
  return {
    ...event,
    participants: event.participants.map((participant) =>
      participant.accountId === myAccountId ? { ...participant, status } : participant,
    ),
  };
}
