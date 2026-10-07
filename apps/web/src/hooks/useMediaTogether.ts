'use client';

import type { SpaceReactionComparison } from '@davas/shared';
import { useEffect, useState } from 'react';
import { getMe } from '../lib/api/auth';
import {
  getMediaAvailability,
  refreshMediaAvailability,
  type MediaAvailability,
} from '../lib/api/media';
import { listSpaces } from '../lib/api/spaces';
import { compareSpaceReactions } from '../lib/api/watch-events';
import { chooseActiveSpace, readActiveSpaceId } from '../components/spaces/space-ui';

export type MediaTogether = {
  status: 'loading' | 'ready' | 'error';
  space: { id: string; name: string } | null;
  myAccountId: string;
  /** OTT_SERVICES keys this person subscribes to. */
  myServices: string[];
  comparison: SpaceReactionComparison | null;
};

export type MediaWatchable = {
  status: 'loading' | 'ready' | 'error';
  availability: MediaAvailability | null;
};

const loadingTogether: MediaTogether = {
  status: 'loading',
  space: null,
  myAccountId: '',
  myServices: [],
  comparison: null,
};

/**
 * What a title sheet shows about us: how the active space's members rated it, and where it
 * can be watched now. A stored availability answer that is missing or expired is looked up
 * again, so the sheet never shows a stale "볼 수 있어요".
 */
export function useMediaTogether(mediaId: string, enabled: boolean) {
  const [together, setTogether] = useState<MediaTogether & { mediaId: string }>({
    ...loadingTogether,
    mediaId: '',
  });
  const [watchable, setWatchable] = useState<MediaWatchable & { mediaId: string }>({
    status: 'loading',
    availability: null,
    mediaId: '',
  });

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    (async () => {
      try {
        const [me, { items }] = await Promise.all([getMe(), listSpaces()]);
        const space = chooseActiveSpace(items, readActiveSpaceId());
        const comparison = space ? await compareSpaceReactions(space.id, mediaId) : null;
        if (!active) return;
        setTogether({
          mediaId,
          status: 'ready',
          space: space ? { id: space.id, name: space.name } : null,
          myAccountId: me.id ?? '',
          myServices: me.ottServices ?? [],
          comparison,
        });
      } catch {
        if (active) setTogether({ ...loadingTogether, mediaId, status: 'error' });
      }
    })();
    (async () => {
      try {
        let availability = await getMediaAvailability(mediaId);
        if (availability.state === 'UNKNOWN' || availability.state === 'EXPIRED') {
          availability = await refreshMediaAvailability(mediaId);
        }
        if (active) setWatchable({ mediaId, status: 'ready', availability });
      } catch {
        if (active) setWatchable({ mediaId, status: 'error', availability: null });
      }
    })();
    return () => {
      active = false;
    };
  }, [enabled, mediaId]);

  return {
    together:
      together.mediaId === mediaId ? together : ({ ...loadingTogether } satisfies MediaTogether),
    watchable:
      watchable.mediaId === mediaId
        ? watchable
        : ({ status: 'loading', availability: null } satisfies MediaWatchable),
  };
}
