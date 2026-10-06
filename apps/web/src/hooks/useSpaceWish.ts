'use client';

import { useCallback, useEffect, useState } from 'react';
import { listSpaces } from '../lib/api/spaces';
import { getWishStatus, setWish } from '../lib/api/wishes';
import { chooseActiveSpace, readActiveSpaceId } from '../components/spaces/space-ui';

type SpaceWishState = { spaceId: string; spaceName: string; wanted: boolean };

/**
 * "보고 싶어요" on a title, kept in the active space's shared list. `wish` stays null for
 * people without a space, so callers can fall back to the older personal watchlist, but only
 * once `loading` is false: until the lookup for this title answers, nobody knows yet whether
 * a tap belongs on the shared list or the personal one.
 */
export function useSpaceWish(mediaId: string, enabled: boolean) {
  const [result, setResult] = useState<{ mediaId: string; wish: SpaceWishState | null } | null>(
    null,
  );
  const [pending, setPending] = useState(false);
  const wish = result?.mediaId === mediaId ? result.wish : null;
  const loading = enabled && result?.mediaId !== mediaId;

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    (async () => {
      let next: SpaceWishState | null = null;
      try {
        const { items } = await listSpaces();
        const space = chooseActiveSpace(items, readActiveSpaceId());
        if (space) {
          const status = await getWishStatus(space.id, mediaId);
          next = { spaceId: space.id, spaceName: space.name, wanted: status.wantedByMe };
        }
      } catch {
        // Without an answer the personal watchlist is the only list left to offer.
      }
      if (active) setResult({ mediaId, wish: next });
    })();
    return () => {
      active = false;
    };
  }, [enabled, mediaId]);

  const toggle = useCallback(async () => {
    if (!wish || pending) return;
    setPending(true);
    try {
      const status = await setWish(wish.spaceId, mediaId, !wish.wanted);
      setResult({ mediaId, wish: { ...wish, wanted: status.wantedByMe } });
    } catch {
      // Keep the previous state; the button simply does not flip.
    } finally {
      setPending(false);
    }
  }, [mediaId, pending, wish]);

  return { wish, loading, pending, toggle };
}
