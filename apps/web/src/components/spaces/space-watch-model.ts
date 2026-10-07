import type {
  TheaterFormat,
  WatchEvent,
  WatchParticipantStatus,
  WatchReaction,
  WatchTimelineGroup,
} from '../../lib/api/watch-events';

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
  /** For the viewer's own blind review: who still has to write before it opens. */
  waitingFor: string | null;
  likeCount: number;
  likedByMe: boolean;
  /** Null for a legacy review kept only on the old diary row; it cannot be liked. */
  reactionId: string | null;
  headline: string | null;
  review: string | null;
  isBlind: boolean;
  /** Has a rating, headline or review; a locked review always has one. */
  written: boolean;
};

const FORMAT_LABELS: Record<TheaterFormat, string> = {
  STANDARD: '일반',
  IMAX: 'IMAX',
  FOUR_DX: '4DX',
  DOLBY: '돌비',
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
 * The timeline card's two lines under the title, as on the C안 board: when, how and how far
 * ("10월 4일 · 극장 · IMAX", "10월 5일 · 넷플릭스 · 8화까지"), then where.
 */
export function watchCardSource(event: WatchEvent) {
  const source = event.source;
  const parts = [watchedDayLabel(event.watchedDate)];
  if (source) {
    parts.push(
      source.kind === 'OTT' && source.providerName
        ? source.providerName
        : SOURCE_LABELS[source.kind],
    );
    if (source.kind === 'THEATER' && source.theaterFormat) {
      parts.push(FORMAT_LABELS[source.theaterFormat]);
    }
    if (source.completed) parts.push('끝까지 다 봤어요');
    else if (source.episodeWatched) parts.push(`${source.episodeWatched}화까지`);
  }
  return { line: parts.join(' · '), place: source?.placeText || null };
}

/**
 * Every watcher has written and at least one of them chose blind: the card shows the
 * reviews together under "둘 다 리뷰를 남겨서 열렸어요".
 */
export function openedTogether(rows: WatchReactionRow[]) {
  return (
    rows.length > 1 &&
    rows.every((row) => row.status === 'CONFIRMED' && row.written && !row.locked) &&
    rows.some((row) => row.isBlind)
  );
}

/**
 * One row per person who watched (or is asked to confirm watching), author first and
 * the viewer labelled "나". Declined people are left out: they said they were not there.
 */
export function reactionRows(event: WatchEvent, myAccountId: string): WatchReactionRow[] {
  const waiting = waitingWatchers(event, myAccountId);
  const waitingNames = waiting
    .map(
      (participant) =>
        participant.nickname ||
        (participant.accountId === event.author.accountId ? event.author.nickname : undefined) ||
        '공간 멤버',
    )
    .join(', ');
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
        waitingToOpen: Boolean(isMe && reaction?.isBlind && waiting.length > 0),
        waitingFor: isMe && reaction?.isBlind && waiting.length ? waitingNames : null,
        likeCount: reaction?.likeCount ?? 0,
        likedByMe: reaction?.likedByMe ?? false,
        reactionId: reaction?.id ?? null,
        headline: reaction?.headline?.trim() || null,
        review: reaction?.review?.trim() || null,
        isBlind: reaction?.isBlind ?? false,
        written: hasWrittenReaction(reaction),
      };
    });
  return rows.sort(
    (a, b) =>
      Number(b.accountId === event.author.accountId) -
      Number(a.accountId === event.author.accountId),
  );
}

/**
 * A watcher who has not written opens the locked reviews by writing: the card offers it once
 * instead of the viewer's own "not yet" line.
 */
export function unlocksByWriting(event: WatchEvent, myAccountId: string) {
  const rows = reactionRows(event, myAccountId);
  return (
    blindViewerRole(event, myAccountId) === 'watcher' &&
    rows.some((row) => row.locked) &&
    !rows.some((row) => row.isMe && row.written)
  );
}

/**
 * The timeline's cards, each holding its records oldest first. Records already on an earlier
 * card are skipped, in case a new record regrouped a title between two page loads. A page
 * without groups (an older server) shows one card per record.
 */
export function timelineCards(
  items: WatchEvent[],
  groups: WatchTimelineGroup[] | undefined,
): WatchEvent[][] {
  if (!groups?.length) return items.map((item) => [item]);
  const byId = new Map(items.map((item) => [item.id, item]));
  const seen = new Set<string>();
  return groups
    .map((group) =>
      group.watchEventIds.flatMap((id) => {
        const event = byId.get(id);
        if (!event || seen.has(id)) return [];
        seen.add(id);
        return [event];
      }),
    )
    .filter((card) => card.length > 0);
}

/** "주인님, 강생님이": everyone who left a record on the card, first writer first. */
export function groupByline(events: WatchEvent[]) {
  const names = new Map<string, string>();
  for (const event of events) {
    if (!names.has(event.author.accountId)) {
      names.set(event.author.accountId, event.author.nickname || '공간 멤버');
    }
  }
  return `${[...names.values()].map((name) => `${name}님`).join(', ')}이`;
}

/** The card's lines under the title: one when every record agrees, otherwise each record's. */
export function groupCardSource(events: WatchEvent[]) {
  const sources = events.map(watchCardSource);
  return {
    lines: [...new Set(sources.map((source) => source.line))],
    place: [...new Set(sources.map((source) => source.place).filter(Boolean))].join(' · ') || null,
  };
}

export type GroupReactionRow = WatchReactionRow & {
  /** The record this row comes from: likes and "별점 남기기" go there. */
  eventId: string;
  lockedHint: string;
};

/**
 * One row per person across the card's records. A person's own record speaks for them, and a
 * row where they wrote something beats an empty one, so someone listed as a companion on the
 * other record still shows the review they wrote on their own.
 */
export function groupReactionRows(events: WatchEvent[], myAccountId: string): GroupReactionRow[] {
  const rows = new Map<string, { row: GroupReactionRow; score: number }>();
  for (const event of events) {
    const lockedHint = lockedReviewHint(blindViewerRole(event, myAccountId));
    for (const row of reactionRows(event, myAccountId)) {
      const score = (row.written ? 2 : 0) + (row.accountId === event.author.accountId ? 1 : 0);
      const current = rows.get(row.accountId);
      if (!current || score > current.score) {
        rows.set(row.accountId, { row: { ...row, eventId: event.id, lockedHint }, score });
      }
    }
  }
  return [...rows.values()].map(({ row }) => row);
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
