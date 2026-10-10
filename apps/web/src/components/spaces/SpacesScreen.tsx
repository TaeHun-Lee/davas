'use client';

import {
  seoulToday,
  SPACE_INVITE_MAX_HOURS,
  SPACE_MAX_MEMBERS,
  SPACE_MIN_MEMBERS,
  SPACE_NAME_MAX_LENGTH,
} from '@davas/shared';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useActiveSpace } from '../../hooks/useActiveSpace';
import {
  cancelSpaceInvite,
  closeSpace,
  createSpace,
  createSpaceInvite,
  leaveSpace,
  renameSpace,
  transferSpaceOwnership,
  type SpaceInvite,
  type SpaceView,
} from '../../lib/api/spaces';
import { CoreAppShell, TaskShell } from '../core/CoreUi';
import { GroupRecommendationPanel } from './GroupRecommendationPanel';
import { monthDayLabel } from '../../lib/dates';
import {
  activeMembers,
  inviteDeadlineLabel,
  rememberActiveSpace,
  spaceErrorMessage,
} from './space-ui';
import { SpaceSwitcher } from './SpaceSwitcher';
import { SpaceTimeline } from './SpaceTimeline';

/** `/spaces` shows the space; `?view=timeline` and `?view=recommend` open its full screens. */
export type SpacesView = 'space' | 'timeline' | 'recommend';

type ActiveSpace = ReturnType<typeof useActiveSpace>;

const INVITE_EXPIRY_OPTIONS = [
  { hours: 24, label: '24시간' },
  { hours: 72, label: '3일' },
  { hours: SPACE_INVITE_MAX_HOURS, label: '7일' },
] as const;

export function SpacesScreen({ initialView = 'space' }: { initialView?: SpacesView }) {
  const active = useActiveSpace();
  if (initialView === 'timeline') return <SpaceTimelineScreen active={active} />;
  if (initialView === 'recommend') return <ChooseTogetherScreen active={active} />;
  return <SpaceOverview active={active} />;
}

/** The space's whole timeline, reached from the home timeline's "전체". */
function SpaceTimelineScreen({ active }: { active: ActiveSpace }) {
  const { state } = active;
  return (
    <TaskShell title="우리 공간 타임라인" fallback="/">
      <SpaceGate active={active}>
        {state.status === 'ready' && state.space ? (
          <SpaceTimeline
            key={state.space.id}
            spaceId={state.space.id}
            spaceName={state.space.name}
            myAccountId={state.myAccountId}
          />
        ) : null}
      </SpaceGate>
    </TaskShell>
  );
}

/** 함께 고르기 on its own screen, as on the C안 board. */
function ChooseTogetherScreen({ active }: { active: ActiveSpace }) {
  const { state } = active;
  return (
    <TaskShell title="함께 고르기" fallback="/spaces">
      <SpaceGate active={active} empty="함께 고르기는 공간을 만들고 멤버를 초대한 뒤 쓸 수 있어요.">
        {state.status === 'ready' && state.space ? (
          <GroupRecommendationPanel
            key={state.space.id}
            space={state.space}
            myAccountId={state.myAccountId}
            defaultServices={state.myOttServices}
          />
        ) : null}
      </SpaceGate>
    </TaskShell>
  );
}

/** Loading, error and "no space yet" for the space's full screens. */
function SpaceGate({
  active,
  empty = '공간에 공유된 기록이 여기에 모여요.',
  children,
}: {
  active: ActiveSpace;
  empty?: string;
  children: ReactNode;
}) {
  const { state, reload } = active;
  if (state.status === 'loading')
    return (
      <section data-state="loading" className="space-panel" aria-busy="true">
        <p className="space-panel-hint">공간을 불러오는 중이에요…</p>
      </section>
    );
  if (state.status === 'error')
    return (
      <section className="space-panel" role="alert">
        <p className="space-panel-hint">공간을 불러오지 못했어요.</p>
        <button
          type="button"
          className="secondary-button mt-3 w-full"
          onClick={() => void reload()}
        >
          다시 시도
        </button>
      </section>
    );
  if (!state.space)
    return (
      <section data-state="empty" className="space-panel">
        <h2 className="space-panel-title">아직 참여 중인 공간이 없어요</h2>
        <p className="space-panel-hint">{empty}</p>
        <Link href="/spaces" className="primary-button mt-4 w-full">
          공간 만들기
        </Link>
      </section>
    );
  return <>{children}</>;
}

function MemberFace({ name, isMe }: { name: string; isMe: boolean }) {
  return (
    <span className="space-member-face" data-me={isMe || undefined} aria-hidden="true">
      {[...(name.trim() || '멤')][0]}
    </span>
  );
}

const FEATURES = [
  {
    href: '/spaces/wishes',
    label: '같이 보고 싶어요',
    tone: 'wish',
    icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  },
  {
    href: '/spaces?view=recommend',
    label: '함께 고르기',
    tone: 'pick',
    icon: 'M9 6a3 3 0 1 0 0 6a3 3 0 1 0 0-6ZM16.5 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5ZM3.5 19c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M14 15c3.5-.4 5.5.9 6 4',
  },
  {
    href: '/spaces/memories',
    label: '우리 기록 모아보기',
    tone: 'memories',
    icon: 'M5 6h14v14H5ZM5 10h14M9 4v4M15 4v4',
  },
  {
    href: '/search?scope=space',
    label: '기록 검색',
    tone: 'search',
    icon: 'M10.5 5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 1 0 0-11ZM15 15l4 4',
  },
] as const;

/**
 * The space tab, as on the C안 board: who is in the space (with renaming and inviting for the
 * owner), what the space can do, and then managing it.
 */
function SpaceOverview({ active }: { active: ActiveSpace }) {
  const { state, reload, select } = active;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState(SPACE_MAX_MEMBERS);
  const [creating, setCreating] = useState(false);
  const [expiresInHours, setExpiresInHours] = useState<number>(SPACE_INVITE_MAX_HOURS);
  const [invite, setInvite] = useState<SpaceInvite | null>(null);
  const [newOwnerId, setNewOwnerId] = useState('');
  const [dangerAction, setDangerAction] = useState<'leave' | 'close' | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  const ready = state.status === 'ready' ? state : null;
  const activeSpace = ready?.space ?? null;
  const myAccountId = ready?.myAccountId ?? '';
  const isOwner = Boolean(
    activeSpace &&
    (activeSpace.ownerAccountId === myAccountId ||
      activeSpace.members.some(
        (member) => member.accountId === myAccountId && member.role === 'OWNER',
      )),
  );
  const members = activeSpace ? activeMembers(activeSpace) : [];
  const full = Boolean(activeSpace && members.length >= activeSpace.maxMembers);
  const ownershipCandidates = members.filter((member) => member.accountId !== myAccountId);
  const ownerName = members.find((member) => member.role === 'OWNER')?.nickname;
  const inviteUrl =
    invite && typeof window !== 'undefined'
      ? `${window.location.origin}/spaces/invite/${encodeURIComponent(invite.token)}`
      : '';

  function switchSpace(spaceId: string) {
    select(spaceId);
    setInvite(null);
    setNewOwnerId('');
    setDangerAction(null);
    setRenaming(false);
    setError('');
    setNotice('');
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
      setCreating(false);
      rememberActiveSpace(created.id);
      await reload();
      setNotice('공간을 만들었어요. 초대 링크로 멤버를 불러보세요.');
    });
  }

  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeSpace) return;
    await runAction(async () => {
      await renameSpace(activeSpace.id, spaceName.trim());
      setRenaming(false);
      await reload();
      setNotice('공간 이름을 바꿨어요.');
    });
  }

  async function handleCreateInvite() {
    if (!activeSpace) return;
    await runAction(async () => {
      setInvite(await createSpaceInvite(activeSpace.id, expiresInHours));
      setNotice('초대 링크를 만들었어요. 만료 전에 한 명에게 보내 주세요.');
    });
  }

  async function handleCopyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice('초대 링크를 복사했어요.');
    } catch {
      setError('링크를 복사하지 못했어요. 링크 주소를 길게 눌러 복사해 주세요.');
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
      await reload();
      setNotice('소유권을 넘겼어요. 이제 일반 멤버로 참여 중이에요.');
    });
  }

  async function handleLeave() {
    if (!activeSpace) return;
    await runAction(async () => {
      await leaveSpace(activeSpace.id);
      setDangerAction(null);
      setInvite(null);
      rememberActiveSpace(null);
      await reload();
    });
  }

  async function handleClose() {
    if (!activeSpace) return;
    await runAction(async () => {
      await closeSpace(activeSpace.id);
      setDangerAction(null);
      setInvite(null);
      rememberActiveSpace(null);
      await reload();
    });
  }

  const createForm = (
    <form onSubmit={handleCreate} className="space-create-form">
      <label className="block">
        <span className="field-label">공간 이름</span>
        <input
          aria-label="공간 이름"
          required
          maxLength={SPACE_NAME_MAX_LENGTH}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="예: 주말 영화 모임"
          className="text-input"
        />
      </label>
      <label className="mt-3 block">
        <span className="field-label">
          최대 인원 ({SPACE_MIN_MEMBERS}~{SPACE_MAX_MEMBERS}명)
        </span>
        <select
          aria-label="공간 최대 인원"
          value={maxMembers}
          onChange={(event) => setMaxMembers(Number(event.target.value))}
          className="text-input"
        >
          {Array.from(
            { length: SPACE_MAX_MEMBERS - SPACE_MIN_MEMBERS + 1 },
            (_, index) => SPACE_MIN_MEMBERS + index,
          ).map((count) => (
            <option key={count} value={count}>
              {count}명
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={busy || !name.trim()} className="primary-button mt-4 w-full">
        공간 만들기
      </button>
    </form>
  );

  return (
    <CoreAppShell headerLead={<SpaceSwitcher state={state} onSelect={switchSpace} />}>
      {/* The header names the space on a phone; the desktop board puts it in the page. */}
      <div className="space-overview-head">
        <h1>{activeSpace ? activeSpace.name : '공간'}</h1>
        {activeSpace ? (
          <p>
            공간 · {members.length}명{ownerName ? ` · ${ownerName}님이 만든 공간` : ''}
          </p>
        ) : null}
      </div>
      <div aria-busy={state.status === 'loading' || busy} className="space-overview">
        {error ? (
          <p role="alert" className="space-banner" data-tone="error">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="space-banner" data-tone="done">
            {notice}
          </p>
        ) : null}

        {state.status === 'loading' ? (
          <section data-state="loading" className="space-panel">
            <p className="space-panel-hint">공간을 불러오는 중이에요…</p>
          </section>
        ) : state.status === 'error' ? (
          <section className="space-panel" role="alert">
            <p className="space-panel-hint">공간을 불러오지 못했어요.</p>
            <button
              type="button"
              className="secondary-button mt-3 w-full"
              onClick={() => void reload()}
            >
              다시 시도
            </button>
          </section>
        ) : !activeSpace ? (
          <section data-state="empty" className="space-panel" aria-labelledby="space-start-title">
            <h2 id="space-start-title" className="space-panel-title">
              둘만의 공간을 만들어 보세요
            </h2>
            <p className="space-panel-hint">
              새 공간은 나 혼자로 시작해요. 초대 링크로 {SPACE_MIN_MEMBERS}~{SPACE_MAX_MEMBERS}명이
              함께할 수 있어요. 공간에 들어오기 전의 개인 기록은 자동으로 공유되지 않아요.
            </p>
            <div className="mt-4">{createForm}</div>
          </section>
        ) : (
          <>
            <section className="space-panel" aria-labelledby="members-title">
              <div className="space-panel-head">
                <h2 id="members-title" className="space-panel-title space-members-title">
                  멤버
                  <span className="space-count-pill" data-full={full || undefined}>
                    {members.length} / {activeSpace.maxMembers}명
                  </span>
                </h2>
                {isOwner && !renaming ? (
                  <button
                    type="button"
                    className="space-rename-button"
                    onClick={() => {
                      setSpaceName(activeSpace.name);
                      setRenaming(true);
                    }}
                  >
                    공간 이름 바꾸기
                  </button>
                ) : null}
              </div>

              {/* Only the owner renames the space, as only the owner manages invites. */}
              {isOwner && renaming ? (
                <form className="space-rename" onSubmit={handleRename}>
                  <label htmlFor="space-rename-input">공간 이름</label>
                  <div className="space-rename-row">
                    <input
                      id="space-rename-input"
                      autoFocus
                      required
                      maxLength={SPACE_NAME_MAX_LENGTH}
                      value={spaceName}
                      onChange={(event) => setSpaceName(event.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={busy || !spaceName.trim() || spaceName.trim() === activeSpace.name}
                    >
                      이름 저장
                    </button>
                  </div>
                  <div className="space-rename-foot">
                    <span>공간 멤버 모두에게 바뀐 이름으로 보여요.</span>
                    <button type="button" onClick={() => setRenaming(false)}>
                      취소
                    </button>
                  </div>
                </form>
              ) : null}

              <ul className="space-member-list" aria-label="공간 멤버 목록">
                {members.map((member) => {
                  const isMe = member.accountId === myAccountId;
                  const owner = member.role === 'OWNER';
                  const nickname = member.nickname || '이름 없는 멤버';
                  return (
                    <li key={member.accountId}>
                      <MemberFace name={nickname} isMe={isMe} />
                      <span className="space-member-text">
                        <strong>
                          {nickname}
                          {isMe ? ' (나)' : ''}
                        </strong>
                        <span>
                          {owner
                            ? '공간을 만든 사람'
                            : member.joinedAt
                              ? `${monthDayLabel(seoulToday(new Date(member.joinedAt)))}에 참여`
                              : '멤버'}
                        </span>
                      </span>
                      <span className="space-role-chip" data-owner={owner || undefined}>
                        {owner ? '소유자' : '멤버'}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {isOwner ? (
                invite ? (
                  <div className="space-invite-box">
                    <label className="block">
                      <span className="field-label">초대 링크</span>
                      <input
                        aria-label="생성된 초대 링크"
                        readOnly
                        value={inviteUrl}
                        onFocus={(event) => event.target.select()}
                        className="text-input"
                      />
                    </label>
                    <p className="space-panel-hint mt-2">
                      {inviteDeadlineLabel(invite.expiresAt)}까지 쓸 수 있어요. 한 명만 참여할 수
                      있어요.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        aria-label="초대 링크 복사"
                        onClick={handleCopyInvite}
                        className="primary-button"
                      >
                        링크 복사
                      </button>
                      <button
                        type="button"
                        aria-label="초대 취소"
                        onClick={handleCancelInvite}
                        disabled={busy}
                        className="danger-button"
                      >
                        초대 취소
                      </button>
                    </div>
                  </div>
                ) : full ? (
                  <p role="status" className="space-full-note">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18ZM12 8v5M12 16h.01" />
                    </svg>
                    <span>공간 정원이 모두 차서 지금은 초대할 수 없어요.</span>
                  </p>
                ) : (
                  <div className="space-invite-row">
                    <span id="space-invite-period" className="space-invite-label">
                      초대 링크 기간
                    </span>
                    <div
                      className="space-expiry"
                      role="group"
                      aria-labelledby="space-invite-period"
                    >
                      {INVITE_EXPIRY_OPTIONS.map((option) => (
                        <button
                          key={option.hours}
                          type="button"
                          aria-pressed={expiresInHours === option.hours}
                          onClick={() => setExpiresInHours(option.hours)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={busy || activeSpace.members.length >= activeSpace.maxMembers}
                      onClick={handleCreateInvite}
                      className="space-invite-button"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M10 6a3 3 0 1 0 0 6a3 3 0 1 0 0-6ZM4.5 19c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M18.5 8v6M15.5 11h6" />
                      </svg>
                      초대 링크 만들기
                    </button>
                  </div>
                )
              ) : null}
            </section>

            <nav aria-label="공간 기능" className="space-features">
              {FEATURES.map((feature) => (
                <Link key={feature.href} href={feature.href}>
                  <span className="space-feature-icon" data-tone={feature.tone} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={feature.icon} />
                    </svg>
                  </span>
                  <span className="space-feature-label">{feature.label}</span>
                  <span aria-hidden="true">›</span>
                </Link>
              ))}
            </nav>

            <SpaceManagement
              space={activeSpace}
              isOwner={isOwner}
              busy={busy}
              creating={creating}
              onToggleCreate={() => setCreating((value) => !value)}
              createForm={createForm}
              ownershipCandidates={ownershipCandidates}
              newOwnerId={newOwnerId}
              onNewOwner={setNewOwnerId}
              onTransfer={handleTransferOwnership}
              dangerAction={dangerAction}
              onDanger={setDangerAction}
              onLeave={handleLeave}
              onClose={handleClose}
            />
          </>
        )}
      </div>
    </CoreAppShell>
  );
}

/** Making another space, handing the space over, and leaving or closing it. */
function SpaceManagement({
  space,
  isOwner,
  busy,
  creating,
  onToggleCreate,
  createForm,
  ownershipCandidates,
  newOwnerId,
  onNewOwner,
  onTransfer,
  dangerAction,
  onDanger,
  onLeave,
  onClose,
}: {
  space: SpaceView;
  isOwner: boolean;
  busy: boolean;
  creating: boolean;
  onToggleCreate: () => void;
  createForm: ReactNode;
  ownershipCandidates: SpaceView['members'];
  newOwnerId: string;
  onNewOwner: (accountId: string) => void;
  onTransfer: () => void;
  dangerAction: 'leave' | 'close' | null;
  onDanger: (action: 'leave' | 'close' | null) => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const [transferring, setTransferring] = useState(false);
  const transferable = isOwner && ownershipCandidates.length > 0;
  return (
    <section className="space-panel space-manage" aria-labelledby="space-manage-title">
      <h2 id="space-manage-title" className="space-panel-title">
        공간 관리
      </h2>
      <ul className="space-manage-list">
        <li>
          <button
            type="button"
            className="space-manage-row"
            aria-expanded={creating}
            aria-controls="space-manage-create"
            onClick={onToggleCreate}
          >
            <ManageIcon tone="create" path={MANAGE_ICONS.create} />
            <span className="space-manage-label">새 공간 만들기</span>
            <span className="space-manage-chevron" aria-hidden="true">
              ›
            </span>
          </button>
          {creating ? (
            <div id="space-manage-create" className="space-manage-panel">
              {createForm}
            </div>
          ) : null}
        </li>
        {transferable ? (
          <li>
            <button
              type="button"
              className="space-manage-row"
              aria-expanded={transferring}
              aria-controls="space-manage-transfer"
              onClick={() => setTransferring((value) => !value)}
            >
              <ManageIcon tone="plain" path={MANAGE_ICONS.transfer} />
              <span className="space-manage-label">소유권 넘기기</span>
              <span className="space-manage-chevron" aria-hidden="true">
                ›
              </span>
            </button>
            {transferring ? (
              <div id="space-manage-transfer" className="space-manage-panel">
                <select
                  aria-label="소유권을 이전할 멤버"
                  value={newOwnerId}
                  onChange={(event) => onNewOwner(event.target.value)}
                  className="text-input"
                >
                  <option value="">넘겨받을 멤버 선택</option>
                  {ownershipCandidates.map((member) => (
                    <option key={member.accountId} value={member.accountId}>
                      {member.nickname || '이름 없는 멤버'}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy || !newOwnerId}
                  onClick={onTransfer}
                  className="secondary-button mt-2 w-full"
                >
                  소유권 넘기기
                </button>
              </div>
            ) : null}
          </li>
        ) : null}
        <li>
          <button
            type="button"
            className="space-manage-row"
            data-tone="danger"
            aria-expanded={dangerAction !== null}
            aria-controls="space-manage-danger"
            onClick={() => onDanger(dangerAction ? null : isOwner ? 'close' : 'leave')}
          >
            <ManageIcon tone="danger" path={MANAGE_ICONS.exit} />
            <span className="space-manage-label">{isOwner ? '공간 종료' : '공간 나가기'}</span>
          </button>
          {dangerAction ? (
            <div
              id="space-manage-danger"
              role="group"
              aria-label={dangerAction === 'close' ? '공간 종료 확인' : '공간 나가기 확인'}
              className="space-danger-confirm"
            >
              <p>
                {dangerAction === 'close'
                  ? `‘${space.name}’을 종료하면 모든 멤버의 접근과 남은 초대가 바로 중단돼요.`
                  : `‘${space.name}’에서 나가면 이 공간의 공유 기록을 바로 볼 수 없어요.`}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onDanger(null)} className="secondary-button">
                  취소
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={dangerAction === 'close' ? onClose : onLeave}
                  className="danger-button"
                >
                  {dangerAction === 'close' ? '종료 확인' : '나가기 확인'}
                </button>
              </div>
            </div>
          ) : null}
        </li>
      </ul>
      {/* Friends stay a separate, older boundary from spaces. */}
      <Link href="/friends" className="space-friends-link">
        예전 친구 관리 ›
      </Link>
    </section>
  );
}

const MANAGE_ICONS = {
  create: 'M12 5v14M5 12h14',
  transfer: 'M4 8h13M14 5l3 3-3 3M20 16H7M10 13l-3 3 3 3',
  exit: 'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
} as const;

function ManageIcon({ tone, path }: { tone: 'create' | 'plain' | 'danger'; path: string }) {
  return (
    <span className="space-manage-icon" data-tone={tone} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </span>
  );
}
