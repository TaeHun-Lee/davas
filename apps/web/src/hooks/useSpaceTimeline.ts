'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CoreApiError } from '../lib/api/core';
import { getSpaceTimeline, type WatchEvent } from '../lib/api/watch-events';

export type SpaceTimelineStatus = 'loading' | 'ready' | 'empty' | 'forbidden' | 'error';

export function useSpaceTimeline(spaceId: string, limit = 20) {
  const [items, setItems] = useState<WatchEvent[]>([]);
  const [status, setStatus] = useState<SpaceTimelineStatus>('loading');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [moreBusy, setMoreBusy] = useState(false);
  // Switching spaces while a page is in flight must not let the old space's answer win.
  const latestRequest = useRef(0);

  const load = useCallback(
    async (nextCursor?: string) => {
      const request = ++latestRequest.current;
      if (nextCursor) setMoreBusy(true);
      else setStatus('loading');
      try {
        const page = await getSpaceTimeline(spaceId, { cursor: nextCursor, limit });
        if (request !== latestRequest.current) return;
        setItems((current) => (nextCursor ? [...current, ...page.items] : page.items));
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setStatus(page.items.length || nextCursor ? 'ready' : 'empty');
      } catch (error) {
        if (request !== latestRequest.current) return;
        setStatus(error instanceof CoreApiError && error.status === 404 ? 'forbidden' : 'error');
      } finally {
        if (request === latestRequest.current) setMoreBusy(false);
      }
    },
    [limit, spaceId],
  );

  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(false);
    void load();
  }, [load]);

  const updateItem = useCallback((id: string, change: (item: WatchEvent) => WatchEvent) => {
    setItems((current) => current.map((item) => (item.id === id ? change(item) : item)));
  }, []);

  return {
    items,
    status,
    cursor,
    hasMore,
    moreBusy,
    reload: () => load(),
    loadMore: () => (cursor ? load(cursor) : undefined),
    updateItem,
  };
}
