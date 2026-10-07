'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMe, logout, normalizeProfileImageUrl } from '../../lib/api/auth';
import {
  deleteMe,
  deleteProfileImage,
  exportMyData,
  updateMe,
  uploadProfileImage,
} from '../../lib/api/users';
import { purgeSessionDrafts } from '../../lib/api/core';
import { AsyncState, TaskShell } from '../core/CoreUi';
import { NotificationSettings } from './NotificationSettings';
import { OttSubscriptions } from './OttSubscriptions';
import { SecuritySettings } from './SecuritySettings';

/** Hands the JSON over as a file named for today, without leaving the page. */
function saveJson(data: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
export function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Awaited<ReturnType<typeof getMe>> | null>(null);
  const [nickname, setNickname] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [exportError, setExportError] = useState('');
  useEffect(() => {
    getMe()
      .then((value) => {
        setUser(value);
        setNickname(value.nickname);
      })
      .catch(() => setError('프로필을 불러오지 못했어요.'));
  }, []);
  if (!user)
    return (
      <TaskShell title="설정" fallback="/">
        {error ? (
          <p className="form-error">{error}</p>
        ) : (
          <AsyncState kind="loading" loadingLabel="내 정보 불러오는 중" />
        )}
      </TaskShell>
    );
  const save = async () => {
    setBusy('save');
    setError('');
    try {
      const next = await updateMe({ nickname });
      setUser(next);
    } catch {
      setError('변경 내용을 저장하지 못했어요.');
    } finally {
      setBusy('');
    }
  };
  const signout = async () => {
    setBusy('logout');
    await logout().catch(() => undefined);
    purgeSessionDrafts();
    router.replace('/login');
  };
  const download = async () => {
    setBusy('export');
    setExportError('');
    try {
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
      saveJson(await exportMyData(), `davas-my-data-${day}.json`);
    } catch {
      setExportError('내 데이터를 내려받지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy('');
    }
  };
  const remove = async () => {
    setBusy('delete');
    setError('');
    try {
      await deleteMe(password);
      purgeSessionDrafts();
      router.replace('/login');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '계정을 삭제하지 못했어요.');
    } finally {
      setBusy('');
    }
  };
  return (
    <TaskShell title="설정" fallback="/">
      <section className="core-card p-5">
        <h1 className="section-title">프로필</h1>
        <div className="mt-4 flex items-center gap-4">
          {user.profileImageUrl ? (
            <img
              src={normalizeProfileImageUrl(user.profileImageUrl) ?? ''}
              alt="내 프로필"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--blue-soft)] text-2xl font-black text-[var(--blue-ink)]">
              {user.nickname.slice(0, 1)}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <label className="secondary-button cursor-pointer">
              사진 선택
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setBusy('image');
                  try {
                    setUser(await uploadProfileImage(file));
                  } catch {
                    setError('사진을 저장하지 못했어요.');
                  } finally {
                    setBusy('');
                  }
                }}
              />
            </label>
            {user.profileImageUrl ? (
              <button
                className="danger-button"
                onClick={async () => {
                  setUser(await deleteProfileImage());
                }}
              >
                사진 삭제
              </button>
            ) : null}
          </div>
        </div>
        <label className="mt-5 block">
          <span className="field-label">닉네임</span>
          <input
            className="text-input"
            minLength={2}
            maxLength={20}
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </label>
        <button
          className="commit-button mt-4"
          disabled={
            busy === 'save' || nickname.trim() === user.nickname || nickname.trim().length < 2
          }
          onClick={save}
        >
          {busy === 'save' ? '저장 중…' : '변경 내용 저장'}
        </button>
        {error ? <p className="form-error mt-3">{error}</p> : null}
      </section>
      <OttSubscriptions initial={user.ottServices ?? []} />
      <NotificationSettings />
      <SecuritySettings user={user} onUser={setUser} />
      <section className="core-card mt-5 p-5" aria-labelledby="my-data-title">
        <h2 id="my-data-title" className="section-title">
          내 데이터
        </h2>
        <p className="page-description">
          내 계정, 기록, 리뷰, 공간과 같이 보고 싶어요 목록을 JSON 파일 하나로 내려받아요. 사진
          파일은 목록만 들어 있어요.
        </p>
        <button
          className="secondary-button mt-4 w-full"
          disabled={busy === 'export'}
          onClick={download}
        >
          {busy === 'export' ? '준비하는 중…' : '내 데이터 내려받기'}
        </button>
        {exportError ? (
          <p className="form-error mt-3" role="alert">
            {exportError}
          </p>
        ) : null}
      </section>
      <section className="core-card mt-5 divide-y divide-[var(--border)] px-4">
        <Link
          className="flex min-h-14 items-center justify-between text-sm font-bold text-[var(--heading)]"
          href="/terms"
        >
          이용약관 <span>›</span>
        </Link>
        <Link
          className="flex min-h-14 items-center justify-between text-sm font-bold text-[var(--heading)]"
          href="/privacy"
        >
          개인정보처리방침 <span>›</span>
        </Link>
        <button
          className="flex min-h-14 w-full items-center text-sm font-bold text-[var(--blue)]"
          disabled={busy === 'logout'}
          onClick={signout}
        >
          로그아웃
        </button>
      </section>
      <section className="core-card mt-5 p-5">
        <h2 className="section-title text-[var(--danger)]">위험 영역</h2>
        {/* The server keeps a 30-day grace period; the copy says so instead of "irreversible". */}
        <p className="page-description">
          계정을 삭제하면 30일 동안 삭제 대기 상태가 돼요. 그동안 같은 이메일과 비밀번호로
          로그인하면 되살릴 수 있고, 30일이 지나면 기록·사진·친구 연결이 영구 삭제돼요.
        </p>
        <button className="danger-button mt-4 w-full" onClick={() => setDeleteOpen(true)}>
          계정 삭제
        </button>
      </section>
      {deleteOpen ? (
        <section className="core-card mt-4 p-5" aria-labelledby="delete-account-title">
          <h2 id="delete-account-title" className="section-title">
            계정을 삭제할까요?
          </h2>
          <p className="page-description">
            30일 안에 다시 로그인하면 되살릴 수 있어요. 확인을 위해 지금 비밀번호를 입력해 주세요.
          </p>
          <label className="mt-4 block">
            <span className="field-label">비밀번호</span>
            <input
              autoFocus
              className="text-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="secondary-button" onClick={() => setDeleteOpen(false)}>
              취소
            </button>
            <button
              className="danger-button"
              disabled={busy === 'delete' || password.length < 8}
              onClick={remove}
            >
              계정 삭제
            </button>
          </div>
        </section>
      ) : null}
    </TaskShell>
  );
}
