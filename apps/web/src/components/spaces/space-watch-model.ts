import type { WatchEvent, WatchParticipantStatus, WatchReaction } from '../../lib/api/watch-events';

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
  /** The headline when there is one, otherwise the review. */
  text: string | null;
  hasSpoiler: boolean;
  /** Blind and still hidden from the viewer. */
  locked: boolean;
  /** The viewer's own blind review, still hidden from someone who has not written yet. */
  waitingToOpen: boolean;
  likeCount: number;
};

/** A rating alone counts, as on the server. A locked review is always a written one. */
export function hasWrittenReaction(reaction: WatchReaction | undefined) {
  return Boolean(
    reaction &&
    (reaction.locked ||
      reaction.rating !== null ||
      reaction.headline?.trim() ||
      reaction.review?.trim()),
  );
}

/**
 * People who watched (or are still asked to confirm) and have not written yet, other than the
 * viewer. While anyone is on this list, a blind review stays closed for them.
 */
export function waitingWatchers(event: WatchEvent, myAccountId: string) {
  return event.participants.filter(
    (participant) =>
      participant.status !== 'DECLINED' &&
      participant.accountId !== myAccountId &&
      !hasWrittenReaction(
        event.reactions.find((reaction) => reaction.accountId === participant.accountId),
      ),
  );
}

export type BlindViewerRole = 'watcher' | 'pending' | 'outsider';

/** How the viewer relates to the record, which decides what opens a locked review for them. */
export function blindViewerRole(event: WatchEvent, myAccountId: string): BlindViewerRole {
  if (event.isMine) return 'watcher';
  const status = event.participants.find(
    (participant) => participant.accountId === myAccountId,
  )?.status;
  if (status === 'CONFIRMED') return 'watcher';
  return status === 'PENDING' ? 'pending' : 'outsider';
}

const LOCKED_HINTS: Record<BlindViewerRole, string> = {
  watcher: '내 리뷰를 남기면 열려요',
  pending: '함께 봤다고 확인하고 리뷰를 남기면 열려요',
  outsider: '함께 본 사람이 모두 리뷰를 남기면 열려요',
};

export function lockedReviewHint(role: BlindViewerRole) {
  return LOCKED_HINTS[role];
}

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
  const someoneHasNotWritten = waitingWatchers(event, myAccountId).length > 0;
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
        text: reaction?.headline?.trim() || reaction?.review?.trim() || null,
        hasSpoiler: reaction?.hasSpoiler ?? false,
        locked: reaction?.locked ?? false,
        waitingToOpen: Boolean(isMe && reaction?.isBlind && someoneHasNotWritten),
        likeCount: reaction?.likeCount ?? 0,
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
