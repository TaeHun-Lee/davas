'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import {
  acceptSpaceInvite,
  inspectSpaceInvite,
  type SpaceInviteInspection,
} from '../../lib/api/spaces';
import { TaskShell } from '../core/CoreUi';
import { ACTIVE_SPACE_KEY, inviteStatusMessage, spaceErrorMessage } from './space-ui';

export function SpaceInviteScreen({ token }: { token: string }) {
  const [inspection, setInspection] = useState<SpaceInviteInspection | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [joinedSpaceId, setJoinedSpaceId] = useState<string | null>(null);

  // Login and signup bring the visitor back here so they can review the space before joining.
  const returnTo = encodeURIComponent(`/spaces/invite/${token}`);
  const loginHref = `/login?returnTo=${returnTo}`;
  const signupHref = `/signup?returnTo=${returnTo}`;

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      inspectSpaceInvite(token),
      getMe()
        .then(() => true)
        .catch(() => false),
    ])
      .then(([result, signedIn]) => {
        if (!active) return;
        setInspection(result);
        setAuthenticated(signedIn);
      })
      .catch((caught) => {
        if (active) setError(spaceErrorMessage(caught));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleAccept() {
    setBusy(true);
    setError('');
    try {
      const accepted = await acceptSpaceInvite(token);
      window.localStorage.setItem(ACTIVE_SPACE_KEY, accepted.spaceId);
      setJoinedSpaceId(accepted.spaceId);
    } catch (caught) {
      setError(spaceErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <TaskShell title="공간 초대" fallback={authenticated ? '/spaces' : '/login'}>
      <div aria-busy={loading || busy}>
        <h1 className="page-title">함께 기록할까요?</h1>

        {loading ? (
          <section data-state="loading" className="mt-5 core-card p-6 text-center">
            <p className="text-[14px] font-bold text-[#738096]">초대 상태를 확인하는 중이에요…</p>
          </section>
        ) : joinedSpaceId ? (
          <section role="status" data-state="accepted" className="mt-5 core-card p-6 text-center">
            <h2 className="text-[20px] font-black text-[#284778]">공간에 참여했어요.</h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#738096]">
              이제 이 공간에 명시적으로 공유된 감상 기록을 볼 수 있어요.
            </p>
            <Link
              href="/spaces"
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#456ca8] text-[14px] font-black text-white"
            >
              공간 열기
            </Link>
          </section>
        ) : inspection?.status === 'VALID' ? (
          <section className="mt-5 core-card p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3fb] text-[24px] font-black text-[#5575a6]">
              {inspection.space.name.slice(0, 1)}
            </div>
            <h2 className="mt-4 text-[20px] font-black text-[#284778]">{inspection.space.name}</h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#738096]">
              {inspection.inviter.nickname}님이 공유 공간으로 초대했어요.
            </p>
            <p className="mt-3 text-[12px] font-bold text-[#8a96a9]">
              {new Date(inspection.expiresAt).toLocaleString('ko-KR')}까지 수락 가능
            </p>
            <p className="mt-3 text-[12px] font-semibold leading-5 text-[#8a96a9]">
              참여하면 이 공간에 공유된 기록만 보여요. 내 예전 기록은 자동으로 공유되지 않아요.
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[13px] font-bold text-[#c4453c]"
              >
                {error}
              </p>
            ) : null}
            {authenticated ? (
              <>
                <button
                  type="button"
                  aria-label={`${inspection.space.name} 공간 초대 수락`}
                  disabled={busy}
                  onClick={handleAccept}
                  className="mt-5 min-h-12 w-full rounded-2xl bg-[#456ca8] text-[14px] font-black text-white disabled:opacity-50"
                >
                  {busy ? '참여하는 중…' : '초대 수락'}
                </button>
                <Link
                  href="/spaces"
                  className="mt-3 flex min-h-11 items-center justify-center text-[13px] font-black text-[#718098]"
                >
                  나중에 하기
                </Link>
              </>
            ) : (
              <div data-state="signed-out">
                <p className="mt-5 rounded-2xl bg-[#f3f7fc] px-4 py-3 text-[13px] font-bold leading-5 text-[#456ca8]">
                  참여하려면 로그인이 필요해요. 로그인하면 이 초대 화면으로 돌아와요.
                </p>
                <Link
                  href={loginHref}
                  className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-[#456ca8] text-[14px] font-black text-white"
                >
                  로그인하고 참여하기
                </Link>
                <Link
                  href={signupHref}
                  className="mt-3 flex min-h-11 items-center justify-center text-[13px] font-black text-[#5575a6]"
                >
                  계정이 없나요? 계정 만들기
                </Link>
                <p className="mt-1 text-[11px] font-semibold leading-4 text-[#9aa5b5]">
                  가입에는 가입 초대 코드가 필요해요. 가입을 마치면 이 화면으로 돌아와요.
                </p>
              </div>
            )}
          </section>
        ) : (
          <section data-state="unavailable" className="mt-5 core-card p-6 text-center">
            <h2 className="text-[19px] font-black text-[#284778]">
              {inspection ? inviteStatusMessage(inspection.status) : '초대를 확인할 수 없어요.'}
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#738096]">
              공간 소유자에게 새 초대 링크를 요청하거나 내 공간 목록을 확인해 주세요.
            </p>
            {error ? (
              <p role="alert" className="mt-4 text-[13px] font-bold text-[#c4453c]">
                {error}
              </p>
            ) : null}
            <Link
              href={authenticated ? '/spaces' : loginHref}
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#e9f0fa] text-[14px] font-black text-[#456ca8]"
            >
              {authenticated ? '내 공간 보기' : '로그인'}
            </Link>
          </section>
        )}
      </div>
    </TaskShell>
  );
}
