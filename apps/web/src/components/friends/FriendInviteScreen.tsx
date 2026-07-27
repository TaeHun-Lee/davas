'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import {
  acceptFriendInvite,
  inspectFriendInvite,
  type FriendInviteState,
} from '../../lib/api/friends';
import { AsyncState, EmptyState, TaskShell } from '../core/CoreUi';
import { friendInviteStateAfterAcceptError, loadFriendInvite } from './friend-invite-model';

export function FriendInviteScreen({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<FriendInviteState | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setState(null);
    setLoadFailed(false);
    void loadFriendInvite(token, inspectFriendInvite, () => getMe({ auth: 'optional' })).then(
      (result) => {
        if (!active) return;
        setState(result.state);
        setAuthenticated(result.authenticated);
        setLoadFailed(result.failed);
      },
    );
    return () => {
      active = false;
    };
  }, [reloadKey, token]);

  if (!state) {
    return (
      <TaskShell title="친구 초대" fallback={authenticated ? '/friends' : '/login'}>
        {loadFailed ? (
          <EmptyState
            title="초대 링크를 확인하지 못했어요"
            description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            action={
              <button
                type="button"
                className="secondary-button"
                onClick={() => setReloadKey((value) => value + 1)}
              >
                다시 시도
              </button>
            }
          />
        ) : (
          <AsyncState kind="loading" />
        )}
      </TaskShell>
    );
  }

  if (state.status === 'EXPIRED') {
    return (
      <TaskShell title="친구 초대" fallback={authenticated ? '/friends' : '/login'}>
        <EmptyState
          title="초대 링크가 만료됐어요"
          description="초대한 친구에게 새 링크를 요청해 주세요."
          action={
            <Link className="secondary-button" href={authenticated ? '/friends' : '/login'}>
              {authenticated ? '친구 화면으로' : '로그인으로'}
            </Link>
          }
        />
      </TaskShell>
    );
  }

  if (state.status === 'SELF') {
    return (
      <TaskShell title="친구 초대" fallback="/friends">
        <EmptyState
          title="내 초대 링크예요"
          description="이 링크를 친구에게 보내 연결해 보세요."
          action={
            <Link className="secondary-button" href="/friends">
              친구 화면으로
            </Link>
          }
        />
      </TaskShell>
    );
  }

  if (state.status === 'ALREADY_FRIENDS') {
    return (
      <TaskShell title="친구 초대" fallback="/friends">
        <EmptyState
          title="이미 친구예요"
          description="친구 기록에서 서로의 최근 감상을 확인해 보세요."
          action={
            <Link className="primary-button" href="/">
              친구 기록 보기
            </Link>
          }
        />
      </TaskShell>
    );
  }

  const accept = async () => {
    if (!authenticated) {
      router.push(`/login?returnTo=${encodeURIComponent(`/friends/invite/${token}`)}`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await acceptFriendInvite(token);
      router.replace('/');
    } catch (cause) {
      const nextState = friendInviteStateAfterAcceptError(state, cause);
      if (nextState) setState(nextState);
      else setError('친구 연결을 완료하지 못했어요. 링크 상태를 다시 확인해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TaskShell title="친구 초대" fallback={authenticated ? '/friends' : '/login'}>
      <section className="core-card p-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--blue-soft)] text-2xl font-black text-[var(--blue)]">
          {state.inviter?.nickname.slice(0, 1)}
        </span>
        <h1 className="page-title mt-4">
          {state.inviter?.nickname}님과
          <br />
          영화·드라마 기록을 나눌까요?
        </h1>
        <p className="page-description">연결하면 서로 친구 공개 기록을 볼 수 있어요.</p>
        {error ? (
          <p className="form-error mt-4" role="alert">
            {error}
          </p>
        ) : null}
        <button className="commit-button mt-6" disabled={busy} onClick={accept}>
          {busy ? '연결 중…' : '친구로 연결하기'}
        </button>
        {!authenticated ? (
          <Link
            className="secondary-button mt-3 w-full"
            href={`/signup?friendInviteToken=${encodeURIComponent(token)}`}
          >
            처음이라면 계정 만들기
          </Link>
        ) : null}
        <Link
          className="mt-3 flex min-h-11 items-center justify-center text-sm font-bold text-[var(--muted)]"
          href={authenticated ? '/friends' : '/login'}
        >
          나중에 하기
        </Link>
      </section>
    </TaskShell>
  );
}
