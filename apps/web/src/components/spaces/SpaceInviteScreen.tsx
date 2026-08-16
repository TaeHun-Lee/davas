'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  acceptSpaceInvite,
  inspectSpaceInvite,
  type SpaceInviteInspection,
} from '../../lib/api/spaces';
import { AppShell } from '../layout/AppShell';
import { inviteStatusMessage, spaceErrorMessage } from './space-ui';

const ACTIVE_SPACE_KEY = 'davas:active-space-id';

export function SpaceInviteScreen({ token }: { token: string }) {
  const [inspection, setInspection] = useState<SpaceInviteInspection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [joinedSpaceId, setJoinedSpaceId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    inspectSpaceInvite(token)
      .then((result) => {
        if (active) setInspection(result);
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
    <AppShell>
      <div className="pb-8 pt-6" aria-busy={loading || busy}>
        <p className="text-[12px] font-black text-[#607eae]">공유 공간 초대</p>
        <h1 className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#1f2a44]">
          함께 기록할까요?
        </h1>

        {loading ? (
          <section
            data-state="loading"
            className="mt-5 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
          >
            <p className="text-[14px] font-bold text-[#738096]">초대 상태를 확인하는 중이에요…</p>
          </section>
        ) : joinedSpaceId ? (
          <section
            role="status"
            data-state="accepted"
            className="mt-5 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
          >
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
          <section className="mt-5 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3fb] text-[24px] font-black text-[#5575a6]">
              {inspection.space.name.slice(0, 1)}
            </div>
            <h2 className="mt-4 text-[20px] font-black text-[#284778]">
              {inspection.space.name}
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#738096]">
              {inspection.inviter.nickname}님이 공유 공간으로 초대했어요.
            </p>
            <p className="mt-3 text-[12px] font-bold text-[#8a96a9]">
              {new Date(inspection.expiresAt).toLocaleString('ko-KR')}까지 수락 가능
            </p>
            {error ? (
              <p role="alert" className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[13px] font-bold text-[#c4453c]">
                {error}
              </p>
            ) : null}
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
          </section>
        ) : (
          <section
            data-state="unavailable"
            className="mt-5 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
          >
            <h2 className="text-[19px] font-black text-[#284778]">
              {inspection
                ? inviteStatusMessage(inspection.status)
                : '초대를 확인할 수 없어요.'}
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
              href="/spaces"
              className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#e9f0fa] text-[14px] font-black text-[#456ca8]"
            >
              내 공간 보기
            </Link>
          </section>
        )}
      </div>
    </AppShell>
  );
}
