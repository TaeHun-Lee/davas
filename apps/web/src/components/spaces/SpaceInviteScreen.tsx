'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
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

type InviteWithDetails = Extract<SpaceInviteInspection, { status: 'VALID' | 'FULL' }>;

function CheckTile({ tone }: { tone: 'joined' | 'declined' }) {
  return (
    <span className="invite-tile" data-tone={tone} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="m5 12 5 5 9-10" />
      </svg>
    </span>
  );
}

/** Saying no asks first in a real dialog: focus stays inside and Esc or the backdrop cancels. */
function DeclineDialog({
  inviter,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  inviter: string;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  useFocusTrap(true, dialogRef, onCancel);
  return (
    <div
      className="sheet-backdrop invite-dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="decline-title"
        aria-describedby="decline-description"
        className="invite-dialog"
      >
        <h2 id="decline-title">초대를 거절할까요?</h2>
        <p id="decline-description">
          거절하면 이 링크로는 다시 참여할 수 없고, {inviter}님에게 거절했다고 알려요
        </p>
        {error ? (
          <p role="alert" className="form-error mt-2">
            {error}
          </p>
        ) : null}
        <div className="invite-dialog-actions">
          <button type="button" className="invite-quiet-button" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="invite-decline-confirm"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? '거절하는 중…' : '거절하기'}
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * Someone opened an invite link: one card, as on the C안 boards, saying who invited them to
 * which space, how full it is and until when it can be used, with join and decline.
 */
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
      setConfirmDecline(false);
      setDeclined(true);
    } catch (caught) {
      setError(spaceErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const details: InviteWithDetails | null =
    inspection?.status === 'VALID' || inspection?.status === 'FULL' ? inspection : null;
  const inviterName = details?.inviter.nickname ?? '초대한 사람';

  return (
    <TaskShell title="공간 초대" fallback={authenticated ? '/spaces' : '/login'}>
      <div aria-busy={loading || busy} className="invite-page">
        {loading ? (
          <section data-state="loading" className="invite-card">
            <p className="invite-meta">초대 상태를 확인하는 중이에요…</p>
          </section>
        ) : joinedSpaceId ? (
          <section role="status" data-state="accepted" className="invite-card">
            <CheckTile tone="joined" />
            <h1 className="invite-title">공간에 참여했어요</h1>
            <p className="invite-body">이제 이 공간에 공유된 기록을 볼 수 있어요.</p>
            <Link href="/spaces" className="primary-button invite-main-action">
              공간 열기
            </Link>
          </section>
        ) : declined ? (
          <section role="status" data-state="declined" className="invite-card">
            <CheckTile tone="declined" />
            <h1 className="invite-title">초대를 거절했어요</h1>
            <p className="invite-body">
              {inviterName}님에게 거절했다고 알렸어요. 이 링크로는 다시 참여할 수 없어요.
            </p>
            <Link href="/" className="primary-button invite-main-action">
              홈으로
            </Link>
          </section>
        ) : details ? (
          <section
            className="invite-card"
            data-state={details.status === 'FULL' ? 'full' : 'valid'}
            aria-labelledby="invite-title"
          >
            <p className="invite-eyebrow">공간 초대</p>
            <p className="invite-faces" aria-hidden="true">
              {details.members.initials.map((initial, index) => (
                <span key={index} data-tone={index % 5}>
                  {initial}
                </span>
              ))}
            </p>
            <h1 id="invite-title" className="invite-title">
              {details.inviter.nickname}님이 ‘{details.space.name}’ 공간에 초대했어요
            </h1>
            <p className="invite-meta">
              멤버 {details.members.count}명 · 최대 {details.members.max}명
            </p>
            <p className="invite-meta">
              {inviteDeadlineLabel(details.expiresAt)}까지 참여할 수 있어요
            </p>
            {details.status === 'FULL' ? (
              <p role="status" className="invite-full-notice">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18ZM12 8v5M12 16h.01" />
                </svg>
                <span>{inviteStatusMessage('FULL')}</span>
              </p>
            ) : null}
            {/* While the decline dialog is open, its own error line speaks instead. */}
            {error && !confirmDecline ? (
              <p role="alert" className="form-error invite-error">
                {error}
              </p>
            ) : null}
            {details.status === 'FULL' ? (
              <>
                <button type="button" className="invite-join-disabled" disabled>
                  참여하기
                </button>
                <Link
                  href={authenticated ? '/' : loginHref}
                  className="secondary-button invite-second-action"
                >
                  {authenticated ? '홈으로' : '로그인'}
                </Link>
              </>
            ) : authenticated ? (
              <>
                <button
                  type="button"
                  aria-label={`${details.space.name} 공간에 참여하기`}
                  disabled={busy}
                  onClick={handleAccept}
                  className="primary-button invite-main-action"
                >
                  {busy ? '참여하는 중…' : '참여하기'}
                </button>
                <button
                  type="button"
                  aria-label={`${details.space.name} 공간 초대 거절`}
                  disabled={busy}
                  onClick={() => {
                    setError('');
                    setConfirmDecline(true);
                  }}
                  className="invite-quiet-button invite-second-action"
                >
                  초대 거절
                </button>
              </>
            ) : (
              <div data-state="signed-out">
                <p className="invite-login-note">
                  참여하려면 로그인이 필요해요. 로그인하면 이 초대 화면으로 돌아와요.
                </p>
                <Link href={loginHref} className="primary-button invite-main-action">
                  로그인하고 참여하기
                </Link>
                <Link href={signupHref} className="invite-text-link">
                  계정이 없나요? 계정 만들기
                </Link>
                <p className="invite-note">
                  가입에는 가입 초대 코드가 필요해요. 가입을 마치면 이 화면으로 돌아와요.
                </p>
              </div>
            )}
            <p className="invite-note">
              참여하면 이 공간에 공유된 기록만 보여요. 내 예전 기록은 자동으로 공유되지 않아요.
            </p>
          </section>
        ) : (
          <section data-state="unavailable" className="invite-card">
            <h1 className="invite-title">
              {inspection && inspection.status !== 'VALID'
                ? inviteStatusMessage(inspection.status)
                : '초대를 확인할 수 없어요.'}
            </h1>
            <p className="invite-body">
              공간 소유자에게 새 초대 링크를 요청하거나 내 공간 목록을 확인해 주세요.
            </p>
            {error ? (
              <p role="alert" className="form-error invite-error">
                {error}
              </p>
            ) : null}
            <Link
              href={authenticated ? '/spaces' : loginHref}
              className="secondary-button invite-main-action"
            >
              {authenticated ? '내 공간 보기' : '로그인'}
            </Link>
          </section>
        )}
      </div>
      {confirmDecline && details ? (
        <DeclineDialog
          inviter={inviterName}
          busy={busy}
          error={error}
          onCancel={() => {
            if (!busy) setConfirmDecline(false);
          }}
          onConfirm={() => void handleDecline()}
        />
      ) : null}
    </TaskShell>
  );
}
