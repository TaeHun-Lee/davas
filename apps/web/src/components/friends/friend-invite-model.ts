import type { FriendInviteState } from '@davas/shared';

export type FriendInviteLoadResult = {
  state: FriendInviteState | null;
  authenticated: boolean;
  failed: boolean;
};

type ApiErrorLike = {
  body?: {
    code?: unknown;
  };
};

export function friendInviteStateAfterAcceptError(
  current: FriendInviteState,
  cause: unknown,
): FriendInviteState | null {
  const code = cause && typeof cause === 'object' ? (cause as ApiErrorLike).body?.code : undefined;
  if (code === 'FRIEND_INVITE_EXPIRED') return { status: 'EXPIRED' };
  if (!('inviter' in current) || !current.inviter) return null;
  if (code === 'FRIEND_INVITE_SELF') {
    return { status: 'SELF', inviter: current.inviter };
  }
  if (code === 'ALREADY_FRIENDS') {
    return { status: 'ALREADY_FRIENDS', inviter: current.inviter };
  }
  return null;
}

export async function loadFriendInvite(
  token: string,
  inspect: (token: string) => Promise<FriendInviteState>,
  authenticate: () => Promise<unknown>,
): Promise<FriendInviteLoadResult> {
  const [inspection, authenticated] = await Promise.all([
    inspect(token)
      .then((state) => ({ state, failed: false }))
      .catch(() => ({ state: null, failed: true })),
    authenticate()
      .then(() => true)
      .catch(() => false),
  ]);

  return {
    state: inspection.state,
    authenticated,
    failed: inspection.failed,
  };
}
