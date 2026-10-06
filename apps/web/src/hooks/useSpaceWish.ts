'use client';

import { useCallback, useEffect, useState } from 'react';
import { listSpaces } from '../lib/api/spaces';
import { getWishStatus, setWish } from '../lib/api/wishes';
import { chooseActiveSpace, readActiveSpaceId } from '../components/spaces/space-ui';

type SpaceWishState = { spaceId: string; spaceName: string; wanted: boolean };

/**
 * "보고 싶어요" on a title, kept in the active space's shared list. `wish` stays null for
 * people without a space, so callers can fall back to the older personal watchlist.
 */
export function useSpaceWish(mediaId: string, enabled: boolean) {
  const [wish, setWishState] = useState<SpaceWishState | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    (async () => {
      try {
        const { items } = await listSpaces();
        const space = chooseActiveSpace(items, readActiveSpaceId());
        if (!space) {
          if (active) setWishState(null);
          return;
        }
        const status = await getWishStatus(space.id, mediaId);
        if (active)
          setWishState({ spaceId: space.id, spaceName: space.name, wanted: status.wantedByMe });
      } catch {
        if (active) setWishState(null);
      }
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
      setWishState({ ...wish, wanted: status.wantedByMe });
    } catch {
      // Keep the previous state; the button simply does not flip.
    } finally {
      setPending(false);
    }
  }, [mediaId, pending, wish]);

  return { wish, pending, toggle };
}
