'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMe } from '../../lib/api/auth';
import {
  cancelSpaceInvite,
  closeSpace,
  createSpace,
  createSpaceInvite,
  leaveSpace,
  listSpaces,
  renameSpace,
  transferSpaceOwnership,
  type SpaceInvite,
  type SpaceView,
} from '../../lib/api/spaces';
import { CoreAppShell } from '../core/CoreUi';
import { GroupRecommendationPanel } from './GroupRecommendationPanel';
import { ACTIVE_SPACE_KEY, chooseActiveSpace, spaceErrorMessage } from './space-ui';
import { SpaceTimeline } from './SpaceTimeline';

export type SpacesView = 'timeline' | 'recommend';

const VIEW_OPTIONS: Array<{ value: SpacesView; label: string }> = [
  { value: 'timeline', label: '기록 타임라인' },
  { value: 'recommend', label: '함께 고르기' },
];

export function SpacesScreen({ initialView = 'timeline' }: { initialView?: SpacesView }) {
  const [view, setView] = useState<SpacesView>(initialView);
  const [spaces, setSpaces] = useState<SpaceView[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [myAccountId, setMyAccountId] = useState<string | null>(null);
  const [myOttServices, setMyOttServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [expiresInHours, setExpiresInHours] = useState(168);
  const [invite, setInvite] = useState<SpaceInvite | null>(null);
  const [newOwnerId, setNewOwnerId] = useState('');
  const [dangerAction, setDangerAction] = useState<'leave' | 'close' | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  const reload = useCallback(async (preferredSpaceId?: string | null) => {
    setLoading(true);
    setError('');
    try {
      const [{ items }, me] = await Promise.all([listSpaces(), getMe()]);
      const preferred = preferredSpaceId ?? window.localStorage.getItem(ACTIVE_SPACE_KEY);
      const selected = chooseActiveSpace(items, preferred);
      setSpaces(items);
      setActiveSpaceId(selected?.id ?? null);
      setMyAccountId(me.id ?? null);
      setMyOttServices(me.ottServices ?? []);
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
        (member) => member.accountId === myAccountId && member.role === 'OWNER',
      )),
  );
  const ownershipCandidates =
    activeSpace?.members.filter((member) => member.accountId !== myAccountId) ?? [];
  const inviteUrl =
    invite && typeof window !== 'undefined'
      ? `${window.location.origin}/spaces/invite/${encodeURIComponent(invite.token)}`
      : '';

  // Arriving from the home "함께 고르기" link lands below the space picker, so bring the
  // panel into view once, after the first load (not again on later reloads).
  const scrolledToPanel = useRef(false);
  useEffect(() => {
    if (scrolledToPanel.current || loading || initialView !== 'recommend' || !activeSpace) return;
    scrolledToPanel.current = true;
    document.getElementById('space-view-switch')?.scrollIntoView({ block: 'start' });
  }, [activeSpace, initialView, loading]);

  function changeView(next: SpacesView) {
    setView(next);
    window.history.replaceState(
      null,
      '',
      next === 'recommend' ? '/spaces?view=recommend' : '/spaces',
    );
  }

  function selectSpace(spaceId: string) {
    setActiveSpaceId(spaceId);
    setInvite(null);
    setNewOwnerId('');
    setDangerAction(null);
    setRenaming(false);
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

  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeSpace) return;
    await runAction(async () => {
      await renameSpace(activeSpace.id, spaceName.trim());
      setRenaming(false);
      setNotice('공간 이름을 바꿨어요.');
      await reload(activeSpace.id);
    });
  }

  async function handleCreateInvite() {
    if (!activeSpace) return;
    await runAction(async () => {
      const created = await createSpaceInvite(activeSpace.id, expiresInHours);
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
    <CoreAppShell>
      <div aria-busy={loading || busy}>
        <header>
          <h1 className="page-title">공유 공간</h1>
          <p className="page-description">
            한 공간을 먼저 골라 멤버와 감상 기록을 나누고, 함께 볼 작품을 골라요. 친구 관계와는
            별도로 관리돼요.
          </p>
          <Link
            href="/friends"
            className="mt-3 inline-flex min-h-11 items-center text-[13px] font-black text-[var(--blue-ink)] underline underline-offset-4"
          >
            기존 친구 관리로 이동
          </Link>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[13px] font-bold leading-5 text-[var(--danger)]"
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
          <section data-state="loading" className="mt-5 core-card p-6 text-center">
            <p className="text-[14px] font-bold text-[var(--muted)]">공간을 불러오는 중이에요…</p>
          </section>
        ) : (
          <>
            <section className="mt-5 core-card p-5">
              <h2 className="text-[17px] font-black text-[var(--heading)]">내 공간</h2>
              {spaces.length > 0 ? (
                <label className="mt-4 block text-[13px] font-black text-[#53637b]">
                  활성 공간 선택
                  <select
                    aria-label="활성 공간 선택"
                    value={activeSpaceId ?? ''}
                    onChange={(event) => selectSpace(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[15px] font-bold text-[var(--heading)]"
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
                  <p className="text-[15px] font-black text-[var(--heading)]">
                    아직 참여 중인 공간이 없어요.
                  </p>
                  <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
                    새 공간은 소유자 한 명으로 시작해요. 초대로 2~5명이 함께할 수 있어요.
                  </p>
                  {view === 'recommend' ? (
                    <p className="mt-2 text-[13px] font-bold leading-5 text-[var(--blue-ink)]">
                      함께 고르기는 공간을 만들고 멤버를 초대한 뒤 쓸 수 있어요.
                    </p>
                  ) : null}
                </div>
              )}
            </section>

            <form onSubmit={handleCreate} className="mt-4 core-card p-5">
              <h2 className="text-[17px] font-black text-[var(--heading)]">새 공간 만들기</h2>
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
                className="mt-4 min-h-12 w-full rounded-2xl bg-[var(--blue)] px-4 text-[14px] font-black text-white disabled:opacity-50"
              >
                공간 만들기
              </button>
            </form>

            {activeSpace ? (
              <>
                <Link href="/spaces/wishes" className="wish-pick-empty mt-4">
                  <span>
                    <strong>같이 보고 싶어요</strong>
                    <span>공간에서 함께 채우는 목록과 오늘 볼 작품 빠른 추천</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </Link>
                <Link href="/spaces/memories" className="wish-pick-empty mt-2">
                  <span>
                    <strong>우리 기록 모아보기</strong>
                    <span>올해 함께 본 작품, 1년 전 오늘, 보고 있는 드라마</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </Link>
                <div
                  role="group"
                  id="space-view-switch"
                  aria-label="공간 화면 전환"
                  className="mt-4 grid scroll-mt-24 grid-cols-2 gap-1 rounded-2xl bg-[#eef3fa] p-1"
                >
                  {VIEW_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={view === option.value}
                      onClick={() => changeView(option.value)}
                      className={`min-h-11 rounded-xl text-[13px] font-black ${
                        view === option.value
                          ? 'bg-white text-[var(--heading)] shadow-[0_4px_12px_rgba(31,65,114,0.10)]'
                          : 'text-[var(--muted)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {/* Both views stay mounted so switching keeps an in-progress recommendation. */}
                <div hidden={view !== 'timeline'}>
                  {/* Keyed by space so a comparison panel never outlives the space it came from. */}
                  <SpaceTimeline
                    key={activeSpace.id}
                    spaceId={activeSpace.id}
                    spaceName={activeSpace.name}
                    myAccountId={myAccountId ?? ''}
                  />
                </div>
                <div hidden={view !== 'recommend'} className="mt-4">
                  <GroupRecommendationPanel
                    space={activeSpace}
                    myAccountId={myAccountId ?? ''}
                    defaultServices={myOttServices}
                  />
                </div>
                <section className="mt-4 core-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[18px] font-black text-[var(--heading)]">
                        {activeSpace.name}
                      </h2>
                      <p className="mt-1 text-[12px] font-bold text-[var(--muted)]">
                        멤버 {activeSpace.members.length}/{activeSpace.maxMembers}명 · 최대 5명
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#edf3fb] px-3 py-1 text-[12px] font-black text-[var(--blue-ink)]">
                      {isOwner ? '소유자' : '멤버'}
                    </span>
                  </div>
                  {/* Only the owner renames the space, as only the owner manages invites. */}
                  {isOwner && renaming ? (
                    <form className="mt-3" onSubmit={handleRename}>
                      <label className="block text-[13px] font-black text-[#53637b]">
                        새 공간 이름
                        <input
                          autoFocus
                          required
                          maxLength={80}
                          value={spaceName}
                          onChange={(event) => setSpaceName(event.target.value)}
                          className="mt-2 min-h-12 w-full rounded-2xl border border-[#dce4ef] bg-[#f8faff] px-4 text-[14px] font-bold"
                        />
                      </label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRenaming(false)}
                          className="min-h-11 rounded-xl bg-[#f1f5fb] text-[13px] font-black text-[#53637b]"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          disabled={
                            busy || !spaceName.trim() || spaceName.trim() === activeSpace.name
                          }
                          className="min-h-11 rounded-xl bg-[var(--blue)] text-[13px] font-black text-white disabled:opacity-50"
                        >
                          이름 저장
                        </button>
                      </div>
                    </form>
                  ) : isOwner ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSpaceName(activeSpace.name);
                        setRenaming(true);
                      }}
                      className="mt-3 min-h-11 rounded-xl bg-[#f1f5fb] px-4 text-[13px] font-black text-[var(--blue-ink)]"
                    >
                      공간 이름 바꾸기
                    </button>
                  ) : null}
                  <h3 className="mt-5 text-[13px] font-black text-[#53637b]">멤버 목록</h3>
                  <ul className="mt-2 space-y-2" aria-label="공간 멤버 목록">
                    {activeSpace.members.map((member) => (
                      <li
                        key={member.accountId}
                        className="flex min-h-12 items-center justify-between rounded-2xl bg-[#f7f9fd] px-4"
                      >
                        <span className="text-[14px] font-bold text-[var(--heading)]">
                          {member.nickname || '이름 없는 멤버'}
                          {member.accountId === myAccountId ? ' (나)' : ''}
                        </span>
                        <span className="text-[12px] font-black text-[var(--muted)]">
                          {member.role === 'OWNER' ? '소유자' : '멤버'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {isOwner ? (
                  <section className="mt-4 core-card p-5">
                    <h2 className="text-[17px] font-black text-[var(--heading)]">초대 관리</h2>
                    <p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--muted)]">
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
                      className="mt-3 min-h-12 w-full rounded-2xl bg-[var(--blue)] px-4 text-[14px] font-black text-white disabled:opacity-50"
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
                        <p className="mt-2 text-[12px] font-bold text-[var(--muted)]">
                          {new Date(invite.expiresAt).toLocaleString('ko-KR')} 만료
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-label="초대 링크 복사"
                            onClick={handleCopyInvite}
                            className="min-h-11 rounded-xl bg-[#e9f0fa] text-[13px] font-black text-[var(--blue-ink)]"
                          >
                            링크 복사
                          </button>
                          <button
                            type="button"
                            aria-label="초대 취소"
                            onClick={handleCancelInvite}
                            disabled={busy}
                            className="min-h-11 rounded-xl bg-[#fff1f0] text-[13px] font-black text-[var(--danger)]"
                          >
                            초대 취소
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                <section className="mt-4 core-card p-5">
                  <h2 className="text-[17px] font-black text-[var(--heading)]">멤버십 관리</h2>
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
                        className="mt-3 min-h-12 w-full rounded-2xl bg-[#e9f0fa] text-[13px] font-black text-[var(--blue-ink)] disabled:opacity-50"
                      >
                        소유권 이전
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    aria-label={isOwner ? '공간 종료 시작' : '공간 탈퇴 시작'}
                    onClick={() => setDangerAction(isOwner ? 'close' : 'leave')}
                    className="mt-4 min-h-12 w-full rounded-2xl bg-[#fff1f0] text-[13px] font-black text-[var(--danger)]"
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
    </CoreAppShell>
  );
}
