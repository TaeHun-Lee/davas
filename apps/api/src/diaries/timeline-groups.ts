/** What grouping needs to know about one record shared to a space. */
export type TimelineShare = {
  shareId: string;
  sharedAt: Date;
  diaryId: string;
  mediaId: string;
  authorId: string;
  watchedDate: string;
};

export type TimelineGroup = {
  /** Oldest viewing first. */
  shares: TimelineShare[];
  /** The newest share: it places the card on the timeline and in the page cursor. */
  latest: TimelineShare;
};

export type TimelinePosition = { sharedAt: string; id: string };

// Plain code-unit order, so sorting and the cursor's `<` agree on ids.
const compareText = (left: string, right: string) => (left < right ? -1 : left > right ? 1 : 0);

function compareChronological(left: TimelineShare, right: TimelineShare) {
  return (
    compareText(left.watchedDate, right.watchedDate) ||
    left.sharedAt.getTime() - right.sharedAt.getTime() ||
    compareText(left.shareId, right.shareId)
  );
}

function compareNewest(left: TimelineShare, right: TimelineShare) {
  return (
    right.sharedAt.getTime() - left.sharedAt.getTime() || compareText(right.shareId, left.shareId)
  );
}

/**
 * The space timeline's cards. Records of the same title share one card, so two people who
 * both wrote about a film see it once with both names. A member recording the title again
 * (a rewatch, or the next episodes) starts a new card, which the others' records of that
 * later viewing then join. Cards come newest first, placed by their newest record.
 */
export function groupTimeline(shares: TimelineShare[]): TimelineGroup[] {
  const open = new Map<string, TimelineShare[]>();
  const groups: TimelineShare[][] = [];
  for (const share of [...shares].sort(compareChronological)) {
    const current = open.get(share.mediaId);
    if (current && !current.some((item) => item.authorId === share.authorId)) {
      current.push(share);
      continue;
    }
    const next = [share];
    groups.push(next);
    open.set(share.mediaId, next);
  }
  return groups
    .map((items) => ({
      shares: items,
      latest: [...items].sort(compareNewest)[0],
    }))
    .sort((left, right) => compareNewest(left.latest, right.latest));
}

/** Cards after `cursor` (the previous page's last card), `limit` of them. */
export function timelinePage(
  groups: TimelineGroup[],
  cursor: TimelinePosition | null,
  limit: number,
) {
  const after = cursor
    ? groups.filter((group) => {
        const at = group.latest.sharedAt.getTime();
        const cursorAt = new Date(cursor.sharedAt).getTime();
        return at < cursorAt || (at === cursorAt && group.latest.shareId < cursor.id);
      })
    : groups;
  return { page: after.slice(0, limit), hasMore: after.length > limit };
}
