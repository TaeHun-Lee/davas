'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import {
  cancelSpaceInvite,
  closeSpace,
  createSpace,
  createSpaceInvite,
  leaveSpace,
  listSpaces,
  transferSpaceOwnership,
  type SpaceInvite,
  type SpaceView,
} from '../../lib/api/spaces';
import { AppShell } from '../layout/AppShell';
import { chooseActiveSpace, spaceErrorMessage } from './space-ui';
import { SpaceTimeline } from './SpaceTimeline';

const ACTIVE_SPACE_KEY = 'davas:active-space-id';

export function SpacesScreen() {
  const [spaces, setSpaces] = useState<SpaceView[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [myAccountId, setMyAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [expiresInHours, setExpiresInHours] = useState(168);
  const [invite, setInvite] = useState<SpaceInvite | null>(null);
  const [newOwnerId, setNewOwnerId] = useState('');
  const [dangerAction, setDangerAction] = useState<'leave' | 'close' | null>(
    null,
  );

  const reload = useCallback(async (preferredSpaceId?: string | null) => {
    setLoading(true);
    setError('');
    try {
      const [{ items }, me] = await Promise.all([listSpaces(), getMe()]);
      const preferred =
        preferredSpaceId ?? window.localStorage.getItem(ACTIVE_SPACE_KEY);
      const selected = chooseActiveSpace(items, preferred);
      setSpaces(items);
      setActiveSpaceId(selected?.id ?? null);
      setMyAccountId(me.id ?? null);
      if (selected) window.localStorage.setItem(ACTIVE_SPACE_KEY, selected.id);
      else window.localStorage.removeItem(ACTIVE_SPACE_KEY);
    } catch (caught) {
      setError(spaceErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const activeSpace = useMemo(
    () => chooseActiveSpace(spaces, activeSpaceId),
    [activeSpaceId, spaces],
  );
  const isOwner = Boolean(
    activeSpace &&
      (activeSpace.ownerAccountId === myAccountId ||
        activeSpace.members.some(
          (member) =>
            member.accountId === myAccountId && member.role === 'OWNER',
        )),
  );
  const ownershipCandidates =
    activeSpace?.members.filter(
      (member) => member.accountId !== myAccountId,
    ) ?? [];
  const inviteUrl =
    invite && typeof window !== 'undefined'
      ? `${window.location.origin}/spaces/invite/${encodeURIComponent(invite.token)}`
      : '';

  function selectSpace(spaceId: string) {
    setActiveSpaceId(spaceId);
    setInvite(null);
    setNewOwnerId('');
    setDangerAction(null);
    setError('');
    setNotice('');
    window.localStorage.setItem(ACTIVE_SPACE_KEY, spaceId);
  }

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (caught) {
      setError(spaceErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(async () => {
      const created = await createSpace(name.trim(), maxMembers);
      setName('');
      setNotice('공간을 만들었어요. 초대 링크로 멤버를 불러보세요.');
      await reload(created.id);
    });
  }

  async function handleCreateInvite() {
    if (!activeSpace) return;
    await runAction(async () => {
      const created = await createSpaceInvite(
        activeSpace.id,
        expiresInHours,
      );
      setInvite(created);
      setNotice('초대 링크를 만들었어요. 만료 전에 한 명에게 공유해 주세요.');
    });
  }

  async function handleCopyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice('초대 링크를 복사했어요.');
    } catch {
      setError('링크를 복사하지 못했어요. 아래 주소를 길게 눌러 복사해 주세요.');
    }
  }

  async function handleCancelInvite() {
    if (!activeSpace || !invite) return;
    await runAction(async () => {
      await cancelSpaceInvite(activeSpace.id, invite.id);
      setInvite(null);
      setNotice('초대를 취소했어요. 이 링크로는 더 이상 참여할 수 없어요.');
    });
  }

  async function handleTransferOwnership() {
    if (!activeSpace || !newOwnerId) return;
    await runAction(async () => {
      await transferSpaceOwnership(activeSpace.id, newOwnerId);
      setNewOwnerId('');
      setNotice('소유권을 이전했어요. 이제 일반 멤버로 참여 중이에요.');
      await reload(activeSpace.id);
    });
  }

  async function handleLeave() {
    if (!activeSpace) return;
    await runAction(async () => {
      await leaveSpace(activeSpace.id);
      setDangerAction(null);
      setInvite(null);
      await reload(null);
    });
  }

  async function handleClose() {
    if (!activeSpace) return;
    await runAction(async () => {
      await closeSpace(activeSpace.id);
      setDangerAction(null);
      setInvite(null);
      await reload(null);
    });
  }

  return (
    <AppShell>
      <div className="pb-8 pt-6" aria-busy={loading || busy}>
        <header>
          <p className="text-[12px] font-black text-[#607eae]">함께 보는 사람들</p>
          <h1 className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#1f2a44]">
            공유 공간
          </h1>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#738096]">
            한 공간을 먼저 골라 멤버와 감상 기록을 나눠요. 친구 관계와는 별도로 관리돼요.
          </p>
          <Link
            href="/friends"
            className="mt-3 inline-flex min-h-11 items-center text-[13px] font-black text-[#5575a6] underline underline-offset-4"
          >
            기존 친구 관리로 이동
          </Link>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[13px] font-bold leading-5 text-[#c4453c]"
          >
            {error}
          </p>
        ) : null}
        {notice ? (
          <p
            role="status"
            className="mt-4 rounded-2xl bg-[#eef7f1] px-4 py-3 text-[13px] font-bold leading-5 text-[#327653]"
          >
            {notice}
          </p>
        ) : null}

        {loading ? (
          <section
            data-state="loading"
            className="mt-5 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
          >
            <p className="text-[14px] font-bold text-[#738096]">공간을 불러오는 중이에요…</p>
          </section>
        ) : (
          <>
            <section className="mt-5 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
              <h2 className="text-[17px] font-black text-[#284778]">내 공간</h2>
              {spaces.length > 0 ? (
                <label className="mt-4 block text-[13px] font-black text-[#53637b]">
                  활성 공간 선택
                  <select
                    aria-label="활성 공간 선택"
                    value={activeSpaceId ?? ''}
                    onChange={(event) => selectSpace(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[15px] font-bold text-[#253552]"
                  >
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id}>
                        {space.name} · {space.members.length}/{space.maxMembers}명
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div data-state="empty" className="py-5 text-center">
                  <p className="text-[15px] font-black text-[#344866]">아직 참여 중인 공간이 없어요.</p>
                  <p className="mt-2 text-[13px] font-semibold leading-5 text-[#7b8799]">
                    새 공간은 소유자 한 명으로 시작해요. 초대로 2~5명이 함께할 수 있어요.
                  </p>
                </div>
              )}
            </section>

            <form
              onSubmit={handleCreate}
              className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]"
            >
              <h2 className="text-[17px] font-black text-[#284778]">새 공간 만들기</h2>
              <label className="mt-4 block text-[13px] font-black text-[#53637b]">
                공간 이름
                <input
                  aria-label="공간 이름"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="예: 주말 영화 모임"
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[15px] font-bold outline-none focus:border-[#6c8cc0]"
                />
              </label>
              <label className="mt-3 block text-[13px] font-black text-[#53637b]">
                최대 인원 (2~5명)
                <select
                  aria-label="공간 최대 인원"
                  value={maxMembers}
                  onChange={(event) => setMaxMembers(Number(event.target.value))}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[15px] font-bold"
                >
                  {[2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>
                      {count}명
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={busy || !name.trim()}
                className="mt-4 min-h-12 w-full rounded-2xl bg-[#456ca8] px-4 text-[14px] font-black text-white disabled:opacity-50"
              >
                공간 만들기
              </button>
            </form>

            {activeSpace ? (
              <>
                <SpaceTimeline
                  spaceId={activeSpace.id}
                  spaceName={activeSpace.name}
                />
                <section className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[18px] font-black text-[#284778]">{activeSpace.name}</h2>
                      <p className="mt-1 text-[12px] font-bold text-[#8190a5]">
                        멤버 {activeSpace.members.length}/{activeSpace.maxMembers}명 · 최대 5명
                      </p>
                    </div>
                    <span className="rounded-full bg-[#edf3fb] px-3 py-1 text-[11px] font-black text-[#5575a6]">
                      {isOwner ? '소유자' : '멤버'}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[13px] font-black text-[#53637b]">멤버 목록</h3>
                  <ul className="mt-2 space-y-2" aria-label="공간 멤버 목록">
                    {activeSpace.members.map((member) => (
                      <li
                        key={member.accountId}
                        className="flex min-h-12 items-center justify-between rounded-2xl bg-[#f7f9fd] px-4"
                      >
                        <span className="text-[14px] font-bold text-[#344866]">
                          {member.nickname || '이름 없는 멤버'}
                          {member.accountId === myAccountId ? ' (나)' : ''}
                        </span>
                        <span className="text-[11px] font-black text-[#7587a2]">
                          {member.role === 'OWNER' ? '소유자' : '멤버'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {isOwner ? (
                  <section className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
                    <h2 className="text-[17px] font-black text-[#284778]">초대 관리</h2>
                    <p className="mt-2 text-[13px] font-semibold leading-5 text-[#7b8799]">
                      링크 하나는 한 명만 수락할 수 있어요. 정원은 최대 5명이에요.
                    </p>
                    <label className="mt-4 block text-[13px] font-black text-[#53637b]">
                      초대 링크 만료
                      <select
                        aria-label="초대 링크 만료 시간"
                        value={expiresInHours}
                        onChange={(event) => setExpiresInHours(Number(event.target.value))}
                        className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[14px] font-bold"
                      >
                        <option value={24}>24시간</option>
                        <option value={72}>3일</option>
                        <option value={168}>7일</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      disabled={busy || activeSpace.members.length >= activeSpace.maxMembers}
                      onClick={handleCreateInvite}
                      className="mt-3 min-h-12 w-full rounded-2xl bg-[#456ca8] px-4 text-[14px] font-black text-white disabled:opacity-50"
                    >
                      초대 링크 만들기
                    </button>
                    {activeSpace.members.length >= activeSpace.maxMembers ? (
                      <p role="status" className="mt-2 text-[12px] font-bold text-[#b05d39]">
                        공간 정원이 모두 차서 지금은 초대할 수 없어요.
                      </p>
                    ) : null}
                    {invite ? (
                      <div className="mt-4 rounded-2xl bg-[#f7f9fd] p-4">
                        <label className="block text-[12px] font-black text-[#53637b]">
                          생성된 초대 링크
                          <input
                            aria-label="생성된 초대 링크"
                            readOnly
                            value={inviteUrl}
                            className="mt-2 min-h-12 w-full rounded-xl border border-[#dce4ef] bg-white px-3 text-[12px] text-[#53637b]"
                          />
                        </label>
                        <p className="mt-2 text-[11px] font-bold text-[#8190a5]">
                          {new Date(invite.expiresAt).toLocaleString('ko-KR')} 만료
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-label="초대 링크 복사"
                            onClick={handleCopyInvite}
                            className="min-h-11 rounded-xl bg-[#e9f0fa] text-[13px] font-black text-[#456ca8]"
                          >
                            링크 복사
                          </button>
                          <button
                            type="button"
                            aria-label="초대 취소"
                            onClick={handleCancelInvite}
                            disabled={busy}
                            className="min-h-11 rounded-xl bg-[#fff1f0] text-[13px] font-black text-[#c4453c]"
                          >
                            초대 취소
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                <section className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
                  <h2 className="text-[17px] font-black text-[#284778]">멤버십 관리</h2>
                  {isOwner && ownershipCandidates.length > 0 ? (
                    <div className="mt-4">
                      <label className="block text-[13px] font-black text-[#53637b]">
                        새 소유자
                        <select
                          aria-label="소유권을 이전할 멤버"
                          value={newOwnerId}
                          onChange={(event) => setNewOwnerId(event.target.value)}
                          className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[14px] font-bold"
                        >
                          <option value="">멤버 선택</option>
                          {ownershipCandidates.map((member) => (
                            <option key={member.accountId} value={member.accountId}>
                              {member.nickname || '이름 없는 멤버'}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        aria-label="공간 소유권 이전"
                        disabled={busy || !newOwnerId}
                        onClick={handleTransferOwnership}
                        className="mt-3 min-h-12 w-full rounded-2xl bg-[#e9f0fa] text-[13px] font-black text-[#456ca8] disabled:opacity-50"
                      >
                        소유권 이전
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    aria-label={isOwner ? '공간 종료 시작' : '공간 탈퇴 시작'}
                    onClick={() => setDangerAction(isOwner ? 'close' : 'leave')}
                    className="mt-4 min-h-12 w-full rounded-2xl bg-[#fff1f0] text-[13px] font-black text-[#c4453c]"
                  >
                    {isOwner ? '공간 종료' : '공간 탈퇴'}
                  </button>
                  {dangerAction ? (
                    <div
                      role="group"
                      aria-label={dangerAction === 'close' ? '공간 종료 확인' : '공간 탈퇴 확인'}
                      className="mt-3 rounded-2xl border border-[#f4cbc7] bg-[#fff8f7] p-4"
                    >
                      <p className="text-[13px] font-bold leading-5 text-[#91443d]">
                        {dangerAction === 'close'
                          ? '공간을 종료하면 모든 멤버의 접근과 남은 초대가 즉시 중단돼요.'
                          : '탈퇴하면 이 공간의 공유 기록을 즉시 볼 수 없어요.'}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDangerAction(null)}
                          className="min-h-11 rounded-xl bg-white text-[13px] font-black text-[#63738b]"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={dangerAction === 'close' ? handleClose : handleLeave}
                          className="min-h-11 rounded-xl bg-[#c4453c] text-[13px] font-black text-white disabled:opacity-50"
                        >
                          {dangerAction === 'close' ? '종료 확인' : '탈퇴 확인'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </section>
              </>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
