'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMe } from '../lib/api/auth';
import { listSpaces, type SpaceView } from '../lib/api/spaces';
import {
  chooseActiveSpace,
  readActiveSpaceId,
  rememberActiveSpace,
} from '../components/spaces/space-ui';

export type ActiveSpaceState =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      spaces: SpaceView[];
      space: SpaceView | null;
      myAccountId: string;
      myOttServices: string[];
    };

/** The space the person last looked at, shared by home, the shared list and the media sheet. */
export function useActiveSpace() {
  const [state, setState] = useState<ActiveSpaceState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const [{ items }, me] = await Promise.all([listSpaces(), getMe()]);
      const space = chooseActiveSpace(items, readActiveSpaceId());
      rememberActiveSpace(space?.id ?? null);
      setState({
        status: 'ready',
        spaces: items,
        space,
        myAccountId: me.id ?? '',
        myOttServices: me.ottServices ?? [],
      });
    } catch {
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const select = useCallback((spaceId: string) => {
    rememberActiveSpace(spaceId);
    setState((current) =>
      current.status === 'ready'
        ? { ...current, space: chooseActiveSpace(current.spaces, spaceId) }
        : current,
    );
  }, []);

  return { state, reload: load, select };
}
