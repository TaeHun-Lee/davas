'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { timelineCards } from '../components/spaces/space-watch-model';
import { CoreApiError } from '../lib/api/core';
import {
  getSpaceTimeline,
  type WatchEvent,
  type WatchTimelineGroup,
} from '../lib/api/watch-events';

export type SpaceTimelineStatus = 'loading' | 'ready' | 'empty' | 'forbidden' | 'error';

/** `limit` counts cards: records of one title share a card. */
export function useSpaceTimeline(spaceId: string, limit = 20) {
  const [items, setItems] = useState<WatchEvent[]>([]);
  const [groups, setGroups] = useState<WatchTimelineGroup[]>([]);
  const [status, setStatus] = useState<SpaceTimelineStatus>('loading');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [moreBusy, setMoreBusy] = useState(false);
  const [moreError, setMoreError] = useState(false);
  // Switching spaces while a page is in flight must not let the old space's answer win.
  const latestRequest = useRef(0);

  const load = useCallback(
    async (nextCursor?: string) => {
      const request = ++latestRequest.current;
      setMoreError(false);
      if (nextCursor) setMoreBusy(true);
      else setStatus('loading');
      try {
        const page = await getSpaceTimeline(spaceId, { cursor: nextCursor, limit });
        if (request !== latestRequest.current) return;
        setItems((current) => (nextCursor ? [...current, ...page.items] : page.items));
        const pageGroups = page.groups ?? [];
        setGroups((current) => (nextCursor ? [...current, ...pageGroups] : pageGroups));
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus(page.items.length || nextCursor ? 'ready' : 'empty');
      } catch (error) {
        if (request !== latestRequest.current) return;
        const forbidden = error instanceof CoreApiError && error.status === 404;
        // A failed "load more" keeps the records already on screen and offers another try.
        if (nextCursor && !forbidden) setMoreError(true);
        else setStatus(forbidden ? 'forbidden' : 'error');
      } finally {
        if (request === latestRequest.current) setMoreBusy(false);
      }
    },
    [limit, spaceId],
  );

  useEffect(() => {
    setItems([]);
    setGroups([]);
    setCursor(null);
    setHasMore(false);
    void load();
  }, [load]);

  const updateItem = useCallback((id: string, change: (item: WatchEvent) => WatchEvent) => {
    setItems((current) => current.map((item) => (item.id === id ? change(item) : item)));
  }, []);

  const cards = useMemo(() => timelineCards(items, groups), [items, groups]);

  return {
    items,
    cards,
    status,
    cursor,
    hasMore,
    moreBusy,
    moreError,
    reload: () => load(),
    loadMore: () => (cursor ? load(cursor) : undefined),
    updateItem,
  };
}
