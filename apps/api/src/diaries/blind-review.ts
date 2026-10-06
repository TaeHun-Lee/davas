import type { WatchParticipantStatus } from '@davas/shared';

type ReactionContent = {
  accountId: string;
  isBlind?: boolean | null;
  ratingScale: number | null;
  reviewText: string | null;
  headline?: string | null;
};

type Participation = { accountId: string; status: WatchParticipantStatus };

/** A rating alone counts: the point of a blind review is not to sway the other person's score. */
export function hasWrittenReaction(reaction: ReactionContent | undefined) {
  return Boolean(
    reaction &&
    (reaction.ratingScale !== null || reaction.reviewText?.trim() || reaction.headline?.trim()),
  );
}

/**
 * Which people's reviews stay hidden from `viewerId`.
 *
 * - Someone who watched (confirmed or still asked to confirm) sees blind reviews once they
 *   have written their own.
 * - Anyone else who can see the record (a space member who was not there) sees them once
 *   every watcher has written theirs, counting people still asked to confirm, so they cannot
 *   peek before the reveal and the review does not lock again when someone confirms.
 *
 * The viewer's own review is never hidden from them.
 */
export function hiddenReviewAccountIds({
  viewerId,
  reactions,
  participants,
}: {
  viewerId: string;
  reactions: ReactionContent[];
  participants: Participation[];
}) {
  const byAccount = new Map(reactions.map((reaction) => [reaction.accountId, reaction]));
  const viewerWatched = participants.some(
    (participant) => participant.accountId === viewerId && participant.status !== 'DECLINED',
  );
  const unlocked = viewerWatched
    ? hasWrittenReaction(byAccount.get(viewerId))
    : participants
        .filter((participant) => participant.status !== 'DECLINED')
        .every((participant) => hasWrittenReaction(byAccount.get(participant.accountId)));

  const hidden = new Set<string>();
  if (unlocked) return hidden;
  for (const reaction of reactions) {
    if (reaction.isBlind && reaction.accountId !== viewerId && hasWrittenReaction(reaction)) {
      hidden.add(reaction.accountId);
    }
  }
  return hidden;
}
