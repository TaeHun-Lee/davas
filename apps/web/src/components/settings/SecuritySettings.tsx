'use client';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@davas/shared';
import { useState } from 'react';
import { changePassword, createRecoveryCode, type AuthenticatedUser } from '../../lib/api/auth';
import { koreanDate } from '../../lib/dates';

type Message = { tone: 'ok' | 'error'; text: string } | null;

const errorText = (cause: unknown, fallback: string) =>
  cause instanceof Error && cause.message ? cause.message : fallback;

/**
 * Changing the password, and the recovery code that resets a forgotten one. There is no mail,
 * so the code made here is the only way back in without the password.
 */
export function SecuritySettings({
  user,
  onUser,
}: {
  user: AuthenticatedUser;
  onUser: (user: AuthenticatedUser) => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codePassword, setCodePassword] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeMessage, setCodeMessage] = useState<Message>(null);
  const [code, setCode] = useState<string | null>(null);
  const mismatch = confirm.length > 0 && next !== confirm;

  async function savePassword() {
    setPasswordBusy(true);
    setPasswordMessage(null);
    try {
      onUser(await changePassword(current, next));
      setCurrent('');
      setNext('');
      setConfirm('');
      setPasswordMessage({
        tone: 'ok',
        text: '비밀번호를 바꿨어요. 다른 기기에서는 새 비밀번호로 다시 로그인해야 해요.',
      });
    } catch (cause) {
      setPasswordMessage({ tone: 'error', text: errorText(cause, '비밀번호를 바꾸지 못했어요.') });
    } finally {
      setPasswordBusy(false);
    }
  }

  async function makeCode() {
    setCodeBusy(true);
    setCodeMessage(null);
    try {
      const made = await createRecoveryCode(codePassword);
      setCode(made.recoveryCode);
      setCodePassword('');
      setCodeOpen(false);
      onUser({ ...user, recoveryCodeCreatedAt: made.createdAt });
    } catch (cause) {
      setCodeMessage({ tone: 'error', text: errorText(cause, '복구 코드를 만들지 못했어요.') });
    } finally {
      setCodeBusy(false);
    }
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCodeMessage({ tone: 'ok', text: '복구 코드를 복사했어요.' });
    } catch {
      setCodeMessage({ tone: 'error', text: '복사하지 못했어요. 코드를 직접 적어 두세요.' });
    }
  }

  return (
    <section className="core-card mt-5 p-5" aria-labelledby="security-settings-title">
      <h2 id="security-settings-title" className="section-title">
        비밀번호와 복구 코드
      </h2>

      <h3 className="settings-subtitle mt-4">비밀번호 바꾸기</h3>
      <div className="mt-2 space-y-3">
        <label className="block">
          <span className="field-label">지금 비밀번호</span>
          <input
            className="text-input"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="field-label">새 비밀번호 ({PASSWORD_MIN_LENGTH}자 이상)</span>
          <input
            className="text-input"
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            value={next}
            onChange={(event) => setNext(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="field-label">새 비밀번호 확인</span>
          <input
            className="text-input"
            type="password"
            autoComplete="new-password"
            aria-invalid={mismatch || undefined}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </label>
        {mismatch ? <p className="settings-hint">새 비밀번호 확인이 일치하지 않아요.</p> : null}
      </div>
      <button
        className="commit-button mt-4"
        disabled={
          passwordBusy ||
          current.length < PASSWORD_MIN_LENGTH ||
          next.length < PASSWORD_MIN_LENGTH ||
          next !== confirm
        }
        onClick={savePassword}
      >
        {passwordBusy ? '바꾸는 중…' : '비밀번호 바꾸기'}
      </button>
      {passwordMessage ? (
        <p
          className={passwordMessage.tone === 'ok' ? 'settings-ok mt-3' : 'form-error mt-3'}
          role={passwordMessage.tone === 'ok' ? 'status' : 'alert'}
        >
          {passwordMessage.text}
        </p>
      ) : null}

      <h3 className="settings-subtitle mt-6">복구 코드</h3>
      <p className="page-description">
        {user.recoveryCodeCreatedAt
          ? `${koreanDate(user.recoveryCodeCreatedAt)}에 만든 복구 코드가 있어요. 비밀번호를 잊으면 로그인 화면의 ‘비밀번호를 잊었어요’에서 이 코드로 새 비밀번호를 정할 수 있어요.`
          : '아직 복구 코드가 없어요. 메일로 비밀번호를 찾을 수 없어서, 비밀번호를 잊으면 이 코드로만 새 비밀번호를 정할 수 있어요.'}
      </p>
      {code ? (
        <div className="recovery-code-box mt-3" role="status">
          <p className="recovery-code" aria-label={`복구 코드 ${code.split('').join(' ')}`}>
            {code}
          </p>
          <p className="settings-hint">
            이 코드는 지금 한 번만 보여요. 안전한 곳에 적어 두세요. 한 번 쓰면 사라지고, 새로 만들면
            예전 코드는 쓸 수 없어요.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="secondary-button" onClick={copyCode}>
              복사하기
            </button>
            <button className="primary-button" onClick={() => setCode(null)}>
              다 적었어요
            </button>
          </div>
        </div>
      ) : codeOpen ? (
        <div className="mt-3">
          <label className="block">
            <span className="field-label">확인을 위해 지금 비밀번호를 입력해 주세요</span>
            <input
              autoFocus
              className="text-input"
              type="password"
              autoComplete="current-password"
              value={codePassword}
              onChange={(event) => setCodePassword(event.target.value)}
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="secondary-button" onClick={() => setCodeOpen(false)}>
              취소
            </button>
            <button
              className="primary-button"
              disabled={codeBusy || codePassword.length < PASSWORD_MIN_LENGTH}
              onClick={makeCode}
            >
              {codeBusy ? '만드는 중…' : '만들기'}
            </button>
          </div>
        </div>
      ) : (
        <button className="secondary-button mt-3 w-full" onClick={() => setCodeOpen(true)}>
          {user.recoveryCodeCreatedAt ? '새 복구 코드 만들기' : '복구 코드 만들기'}
        </button>
      )}
      {codeMessage ? (
        <p
          className={codeMessage.tone === 'ok' ? 'settings-ok mt-3' : 'form-error mt-3'}
          role={codeMessage.tone === 'ok' ? 'status' : 'alert'}
        >
          {codeMessage.text}
        </p>
      ) : null}
    </section>
  );
}
