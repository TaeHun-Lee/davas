'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import {
  acceptSpaceInvite,
  declineSpaceInvite,
  inspectSpaceInvite,
  type SpaceInviteInspection,
} from '../../lib/api/spaces';
import { TaskShell } from '../core/CoreUi';
import {
  ACTIVE_SPACE_KEY,
  inviteDeadlineLabel,
  inviteStatusMessage,
  spaceErrorMessage,
} from './space-ui';

export function SpaceInviteScreen({ token }: { token: string }) {
  const [inspection, setInspection] = useState<SpaceInviteInspection | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [joinedSpaceId, setJoinedSpaceId] = useState<string | null>(null);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [declined, setDeclined] = useState(false);

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

  async function handleDecline() {
    setBusy(true);
    setError('');
    try {
      await declineSpaceInvite(token);
      setDeclined(true);
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
            <p className="text-[14px] font-bold text-[var(--muted)]">
              초대 상태를 확인하는 중이에요…
            </p>
          </section>
        ) : joinedSpaceId ? (
          <section role="status" data-state="accepted" className="mt-5 core-card p-6 text-center">
            <h2 className="text-[20px] font-black text-[var(--heading)]">공간에 참여했어요.</h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
              이제 이 공간에 명시적으로 공유된 감상 기록을 볼 수 있어요.
            </p>
            <Link
              href="/spaces"
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[var(--blue)] text-[14px] font-black text-white"
            >
              공간 열기
            </Link>
          </section>
        ) : declined ? (
          <section role="status" data-state="declined" className="mt-5 core-card p-6 text-center">
            <h2 className="text-[20px] font-black text-[var(--heading)]">초대를 거절했어요.</h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
              초대한 사람에게 거절했다고 알렸어요. 마음이 바뀌면 새 초대 링크를 받아 참여할 수
              있어요.
            </p>
            <Link
              href="/"
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[var(--blue)] text-[14px] font-black text-white"
            >
              홈으로
            </Link>
          </section>
        ) : inspection?.status === 'VALID' ? (
          <section className="mt-5 core-card p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3fb] text-[24px] font-black text-[var(--blue-ink)]">
              {inspection.space.name.slice(0, 1)}
            </div>
            <h2 className="mt-4 text-[20px] font-black text-[var(--heading)]">
              {inspection.space.name}
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
              {inspection.inviter.nickname}님이 공유 공간으로 초대했어요.
            </p>
            <p className="mt-3 text-[12px] font-bold text-[var(--muted)]">
              {inviteDeadlineLabel(inspection.expiresAt)}까지 참여할 수 있어요
            </p>
            <p className="mt-3 text-[12px] font-semibold leading-5 text-[var(--muted)]">
              참여하면 이 공간에 공유된 기록만 보여요. 내 예전 기록은 자동으로 공유되지 않아요.
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[13px] font-bold text-[var(--danger)]"
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
                  className="mt-5 min-h-12 w-full rounded-2xl bg-[var(--blue)] text-[14px] font-black text-white disabled:opacity-50"
                >
                  {busy ? '참여하는 중…' : '초대 수락'}
                </button>
                {confirmDecline ? (
                  <div className="mt-4 rounded-2xl bg-[#fff6f5] p-4 text-left">
                    <p className="text-[13px] font-bold leading-5 text-[#8f2a24]">
                      거절하면 이 링크로는 다시 참여할 수 없고, {inspection.inviter.nickname}님에게
                      거절했다고 알려요.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDecline(false)}
                        className="min-h-11 rounded-xl bg-white text-[13px] font-black text-[#53637b]"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handleDecline}
                        className="min-h-11 rounded-xl bg-[#c4453c] text-[13px] font-black text-white disabled:opacity-50"
                      >
                        {busy ? '거절하는 중…' : '거절하기'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/spaces"
                      className="flex min-h-11 items-center justify-center text-[13px] font-black text-[var(--muted)]"
                    >
                      나중에 하기
                    </Link>
                    <button
                      type="button"
                      aria-label={`${inspection.space.name} 공간 초대 거절`}
                      onClick={() => setConfirmDecline(true)}
                      className="min-h-11 rounded-xl text-[13px] font-black text-[var(--danger)]"
                    >
                      초대 거절
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div data-state="signed-out">
                <p className="mt-5 rounded-2xl bg-[#f3f7fc] px-4 py-3 text-[13px] font-bold leading-5 text-[var(--blue-ink)]">
                  참여하려면 로그인이 필요해요. 로그인하면 이 초대 화면으로 돌아와요.
                </p>
                <Link
                  href={loginHref}
                  className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-[var(--blue)] text-[14px] font-black text-white"
                >
                  로그인하고 참여하기
                </Link>
                <Link
                  href={signupHref}
                  className="mt-3 flex min-h-11 items-center justify-center text-[13px] font-black text-[var(--blue-ink)]"
                >
                  계정이 없나요? 계정 만들기
                </Link>
                <p className="mt-1 text-[12px] font-semibold leading-4 text-[var(--muted)]">
                  가입에는 가입 초대 코드가 필요해요. 가입을 마치면 이 화면으로 돌아와요.
                </p>
              </div>
            )}
          </section>
        ) : (
          <section data-state="unavailable" className="mt-5 core-card p-6 text-center">
            <h2 className="text-[19px] font-black text-[var(--heading)]">
              {inspection ? inviteStatusMessage(inspection.status) : '초대를 확인할 수 없어요.'}
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
              공간 소유자에게 새 초대 링크를 요청하거나 내 공간 목록을 확인해 주세요.
            </p>
            {error ? (
              <p role="alert" className="mt-4 text-[13px] font-bold text-[var(--danger)]">
                {error}
              </p>
            ) : null}
            <Link
              href={authenticated ? '/spaces' : loginHref}
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#e9f0fa] text-[14px] font-black text-[var(--blue-ink)]"
            >
              {authenticated ? '내 공간 보기' : '로그인'}
            </Link>
          </section>
        )}
      </div>
    </TaskShell>
  );
}
