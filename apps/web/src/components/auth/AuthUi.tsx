'use client';
import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '@davas/shared';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, ReactNode, useState } from 'react';
import { login, resetPassword } from '../../lib/api/auth';
import { getApiBaseUrl } from '../../lib/api/base-url';
import { CoreApiError } from '../../lib/api/core';
import { cancelAccountDeletion } from '../../lib/api/users';
import { safeCoreReturnTo } from '../../lib/core-routes';
const safeReturn = (value: string | null, fallback: string) => safeCoreReturnTo(value, fallback);
async function post(path: string, body: object) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(' ')
        : data.message || '요청을 처리하지 못했어요.',
    );
  return data;
}
const errorText = (cause: unknown, fallback: string) =>
  cause instanceof Error && cause.message ? cause.message : fallback;

/** `2026-11-06T…` → `2026년 11월 6일`, in Korea. */
const koreanDate = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="desktop-canvas flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-[430px]">{children}</div>
    </main>
  );
}
function Logo() {
  return (
    <Image
      src="/images/davas-logo.jpg"
      alt="Davas"
      width={112}
      height={112}
      priority
      className="mx-auto h-24 w-24 rounded-3xl object-contain"
    />
  );
}
function Field({
  label,
  name,
  type = 'text',
  minLength,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  minLength?: number;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        <input
          className="text-input pr-12"
          required
          name={name}
          type={password && visible ? 'text' : type}
          minLength={minLength}
          autoComplete={autoComplete}
        />
        {password ? (
          <button
            type="button"
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-[var(--blue)]"
          >
            {visible ? '숨김' : '보기'}
          </button>
        ) : null}
      </div>
    </label>
  );
}
export function LoginCard() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // A deletion-pending account: kept in memory only, to bring it back with the same login.
  const [pending, setPending] = useState<{
    email: string;
    password: string;
    until: string | null;
  } | null>(null);
  const enter = () => {
    router.replace(safeReturn(params.get('returnTo'), '/'));
    router.refresh();
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    try {
      await login(email, password);
      enter();
    } catch (cause) {
      if (cause instanceof CoreApiError && cause.body.code === 'ACCOUNT_DELETION_PENDING') {
        const until = (cause.body as { deletionScheduledFor?: string }).deletionScheduledFor;
        setPending({ email, password, until: until ?? null });
      } else {
        setError(errorText(cause, '로그인하지 못했어요.'));
      }
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    if (!pending) return;
    setBusy(true);
    setError('');
    try {
      await cancelAccountDeletion(pending.email, pending.password);
      await login(pending.email, pending.password);
      enter();
    } catch (cause) {
      setError(errorText(cause, '계정을 되살리지 못했어요. 다시 시도해 주세요.'));
    } finally {
      setBusy(false);
    }
  };
  if (pending)
    return (
      <section className="core-card p-7" aria-labelledby="pending-deletion-title">
        <Logo />
        <h1 id="pending-deletion-title" className="page-title mt-5 text-center">
          삭제를 기다리는 계정이에요
        </h1>
        <p className="page-description text-center">
          {pending.until ? `${koreanDate(pending.until)}에 ` : '곧 '}기록과 사진이 영구 삭제돼요.
          되살리면 지금 그대로 다시 쓸 수 있어요.
        </p>
        {error ? (
          <p className="form-error mt-4" role="alert">
            {error}
          </p>
        ) : null}
        <button className="commit-button mt-6" disabled={busy} onClick={restore}>
          {busy ? '되살리는 중…' : '계정 되살리기'}
        </button>
        <button
          className="secondary-button mt-3 w-full"
          disabled={busy}
          onClick={() => setPending(null)}
        >
          그대로 두기
        </button>
      </section>
    );
  const signup = new URLSearchParams();
  if (params.get('returnTo')) signup.set('returnTo', params.get('returnTo')!);
  return (
    <section className="core-card p-7">
      <Logo />
      <h1 className="page-title mt-5 text-center">다시 만나 반가워요</h1>
      <p className="page-description text-center">친구들과 본 작품을 기록하고 나눠보세요.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <Field label="이메일" name="email" type="email" autoComplete="email" />
        <Field
          label="비밀번호"
          name="password"
          type="password"
          minLength={8}
          autoComplete="current-password"
        />
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="commit-button" disabled={busy}>
          {busy ? '로그인 중…' : '로그인'}
        </button>
      </form>
      <p className="mt-3 text-center">
        <Link
          className="inline-flex min-h-11 items-center px-2 text-sm font-extrabold text-[var(--blue-ink)]"
          href="/password-reset"
        >
          비밀번호를 잊었어요
        </Link>
      </p>
      <p className="mt-4 text-center text-sm font-semibold text-[var(--muted)]">
        계정이 없나요?{' '}
        <Link
          className="inline-flex min-h-11 items-center px-2 font-extrabold text-[var(--blue)]"
          href={`/signup${signup.size ? `?${signup}` : ''}`}
        >
          계정 만들기
        </Link>
      </p>
    </section>
  );
}
/**
 * A forgotten password, reset with the recovery code made in 설정. There is no mail, so the
 * code is the only proof; it works once.
 */
export function ResetPasswordCard() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get('newPassword'));
    if (newPassword !== String(form.get('newPasswordConfirm'))) {
      setError('새 비밀번호 확인이 일치하지 않아요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await resetPassword({
        email: String(form.get('email')),
        recoveryCode: String(form.get('recoveryCode')),
        newPassword,
      });
      setDone(true);
    } catch (cause) {
      setError(errorText(cause, '비밀번호를 바꾸지 못했어요.'));
    } finally {
      setBusy(false);
    }
  };
  if (done)
    return (
      <section className="core-card p-7 text-center" aria-labelledby="reset-done-title">
        <Logo />
        <h1 id="reset-done-title" className="page-title mt-5">
          새 비밀번호로 바꿨어요
        </h1>
        <p className="page-description">
          사용한 복구 코드는 이제 쓸 수 없어요. 로그인한 뒤 설정에서 새 복구 코드를 만들어 두세요.
        </p>
        <Link className="commit-button mt-6" href="/login">
          로그인하기
        </Link>
      </section>
    );
  return (
    <section className="core-card p-7" aria-labelledby="reset-title">
      <Logo />
      <h1 id="reset-title" className="page-title mt-5 text-center">
        비밀번호 다시 정하기
      </h1>
      <p className="page-description text-center">
        설정에서 만들어 둔 복구 코드로 새 비밀번호를 정할 수 있어요.
      </p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <Field label="이메일" name="email" type="email" autoComplete="email" />
        <Field label="복구 코드" name="recoveryCode" autoComplete="off" />
        <Field
          label="새 비밀번호 (8자 이상)"
          name="newPassword"
          type="password"
          minLength={8}
          autoComplete="new-password"
        />
        <Field
          label="새 비밀번호 확인"
          name="newPasswordConfirm"
          type="password"
          minLength={8}
          autoComplete="new-password"
        />
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="commit-button" disabled={busy}>
          {busy ? '바꾸는 중…' : '새 비밀번호로 바꾸기'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm font-semibold text-[var(--muted)]">
        복구 코드가 없으면 이 화면으로는 바꿀 수 없어요. 서버를 운영하는 사람에게 도움을 요청해
        주세요.
      </p>
      <p className="mt-2 text-center">
        <Link
          className="inline-flex min-h-11 items-center px-2 text-sm font-extrabold text-[var(--blue-ink)]"
          href="/login"
        >
          로그인으로 돌아가기
        </Link>
      </p>
    </section>
  );
}

export function SignupCard() {
  const router = useRouter();
  const params = useSearchParams();
  const friendInviteToken = params.get('friendInviteToken') ?? '';
  const [inviteCode, setInviteCode] = useState('');
  const [validated, setValidated] = useState(Boolean(friendInviteToken));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const validate = async () => {
    setBusy(true);
    setError('');
    try {
      await post('/invites/validate', { code: inviteCode });
      setValidated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '초대 코드를 확인하지 못했어요.');
    } finally {
      setBusy(false);
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    if (password !== String(form.get('passwordConfirm'))) {
      setError('비밀번호 확인이 일치하지 않아요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await post('/auth/signup', {
        ...(friendInviteToken ? { friendInviteToken } : { inviteCode }),
        nickname: String(form.get('nickname')),
        email: String(form.get('email')),
        password,
        termsAccepted: true,
        termsVersion: CURRENT_TERMS_VERSION,
        privacyVersion: CURRENT_PRIVACY_VERSION,
      });
      // A safe returnTo (for example a space invite) wins over the default landing screen.
      router.replace(safeReturn(params.get('returnTo'), friendInviteToken ? '/' : '/records/new'));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '계정을 만들지 못했어요.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="core-card p-7">
      <Logo />
      <h1 className="page-title mt-5 text-center">계정 만들기</h1>
      <p className="page-description text-center">친구들과 기록을 나눌 최소 정보만 받아요.</p>
      {!friendInviteToken ? (
        <div className="mt-6">
          <label className="field-label" htmlFor="invite-code">
            가입 초대 코드
          </label>
          <div className="flex gap-2">
            <input
              id="invite-code"
              className="text-input min-w-0"
              value={inviteCode}
              disabled={validated}
              onChange={(event) => {
                setInviteCode(event.target.value.toUpperCase());
                setValidated(false);
              }}
            />
            <button
              className="secondary-button shrink-0"
              disabled={busy || !inviteCode.trim() || validated}
              onClick={validate}
            >
              {validated ? '확인됨' : '코드 확인'}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl bg-[var(--blue-soft)] p-4 text-sm font-bold text-[var(--blue-ink)]">
          친구 초대 링크로 가입하고 있어요. 가입하면 바로 친구로 연결돼요.
        </p>
      )}
      {error ? (
        <p className="form-error mt-4" role="alert">
          {error}
        </p>
      ) : null}
      {validated ? (
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Field label="닉네임 (2~20자)" name="nickname" minLength={2} />
          <p className="-mt-2 text-xs font-semibold text-[var(--muted)]">
            친구 기록 카드에 이 이름이 보여요.
          </p>
          <Field label="이메일" name="email" type="email" />
          <Field label="비밀번호 (8자 이상)" name="password" type="password" minLength={8} />
          <Field label="비밀번호 확인" name="passwordConfirm" type="password" minLength={8} />
          <label className="flex min-h-11 items-start gap-3 text-sm font-semibold leading-6 text-[var(--text)]">
            <input required type="checkbox" className="mt-1 h-5 w-5 accent-[var(--blue)]" />
            <span>
              <Link className="font-extrabold text-[var(--blue)]" href="/terms">
                이용약관
              </Link>
              과{' '}
              <Link className="font-extrabold text-[var(--blue)]" href="/privacy">
                개인정보처리방침
              </Link>
              에 동의합니다.
            </span>
          </label>
          <button className="commit-button" disabled={busy}>
            {busy ? '가입 중…' : '계정 만들기'}
          </button>
        </form>
      ) : (
        <p className="page-description rounded-2xl bg-[var(--soft-card)] p-4">
          초대 코드를 확인하면 계정 정보를 입력할 수 있어요.
        </p>
      )}
      <p className="mt-4 text-center text-sm font-semibold text-[var(--muted)]">
        이미 계정이 있나요?{' '}
        <Link
          className="inline-flex min-h-11 items-center px-2 font-extrabold text-[var(--blue)]"
          href={`/login${params.get('returnTo') ? `?returnTo=${encodeURIComponent(params.get('returnTo')!)}` : ''}`}
        >
          로그인하기
        </Link>
      </p>
    </section>
  );
}
