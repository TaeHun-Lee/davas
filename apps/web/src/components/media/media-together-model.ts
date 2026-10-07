import { OTT_SERVICES, ottServiceForProvider, type SpaceReactionComparison } from '@davas/shared';
import type { MediaAvailability } from '../../lib/api/media';

export type ReactionPerson = {
  accountId: string;
  name: string;
  isMe: boolean;
  rating: number | null;
  headline: string | null;
  review: string | null;
  locked: boolean;
  hasSpoiler: boolean;
  /** How many of the space's records of this title this person reacted to. */
  watchCount: number;
  latestRecordId: string;
};

/**
 * One entry per member who reacted to the title in the space: their latest reaction (records
 * arrive newest first) and how many times they watched it, me first. Blind reviews arrive
 * already locked for this viewer, and the average leaves them out.
 */
export function ourReactions(comparison: SpaceReactionComparison, myAccountId: string) {
  const people = new Map<string, ReactionPerson>();
  for (const event of comparison.events) {
    for (const reaction of event.reactions) {
      const known = people.get(reaction.accountId);
      if (known) {
        known.watchCount += 1;
        continue;
      }
      people.set(reaction.accountId, {
        accountId: reaction.accountId,
        name: reaction.accountId === myAccountId ? '나' : reaction.nickname || '공간 멤버',
        isMe: reaction.accountId === myAccountId,
        rating: reaction.rating,
        headline: reaction.headline,
        review: reaction.review,
        locked: reaction.locked,
        hasSpoiler: reaction.hasSpoiler,
        watchCount: 1,
        latestRecordId: event.watchEventId,
      });
    }
  }
  const list = [...people.values()].sort((left, right) => Number(right.isMe) - Number(left.isMe));
  const ratings = list.flatMap((person) =>
    person.rating !== null && !person.locked ? [person.rating] : [],
  );
  const average = ratings.length
    ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10
    : null;
  return { people: list, average, recordCount: comparison.events.length };
}

const OFFER_GROUPS: Array<[string[], string]> = [
  [['STREAM'], '정액제'],
  [['FREE', 'ADS'], '무료'],
  [['RENT'], '대여'],
  [['BUY'], '구매'],
];

/** TMDB's provider name as the service is called here ("Netflix" → "넷플릭스"). */
export const providerLabel = (provider: string) => {
  const key = ottServiceForProvider(provider);
  return OTT_SERVICES.find((service) => service.key === key)?.label ?? provider;
};

/**
 * The offers grouped by how they can be watched (정액제·무료·대여·구매), each service once, and
 * which subscription services I already pay for carry the title.
 */
export function watchableGroups(availability: MediaAvailability | null, myServices: string[]) {
  const subscribed = (label: string) =>
    OTT_SERVICES.some((service) => service.label === label && myServices.includes(service.key));
  const groups = OFFER_GROUPS.map(([types, label]) => ({
    label,
    providers: [
      ...new Set(
        (availability?.offers ?? [])
          .filter((offer) => types.includes(offer.offerType))
          .map((offer) => providerLabel(offer.provider)),
      ),
    ].map((name) => ({ name, subscribed: subscribed(name) })),
  })).filter((group) => group.providers.length);
  const onMine =
    groups
      .find((group) => group.label === '정액제')
      ?.providers.filter((provider) => provider.subscribed)
      .map((provider) => provider.name) ?? [];
  return { groups, onMine };
}
