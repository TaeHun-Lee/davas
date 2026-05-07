'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';

const cardClass =
  'w-full max-w-[430px] rounded-[30px] bg-white px-8 py-10 shadow-[0_18px_45px_rgba(52,76,103,0.16)] sm:px-10';

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

async function postAuth(path: '/auth/login' | '/auth/signup', body: object) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join('\n') : data.message;
    throw new Error(message || '요청 처리 중 오류가 발생했습니다.');
  }
  return data;
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f6fb] px-5 py-10 text-[#2f4058]">
      <BackgroundDecorations />
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
}

function DavasLogo() {
  return (
    <div className="flex justify-center">
      <Image
        src="/images/davas-logo.jpg"
        alt="Davas"
        width={150}
        height={150}
        priority
        className="h-[118px] w-[118px] object-contain sm:h-[136px] sm:w-[136px]"
      />
    </div>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f7897]">{children}</span>;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="3" />
      <path d="M8 10V8a4 4 0 1 1 8 0v2" />
    </svg>
  );
}

function UserIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 7h2l1.4-2h3.2L15 7h2a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" />
      <circle cx="12" cy="13.5" r="3" />
    </svg>
  );
}

function AuthInput({
  icon,
  name,
  placeholder,
  type = 'text',
  showEye = false,
}: {
  icon: ReactNode;
  name: string;
  placeholder: string;
  type?: string;
  showEye?: boolean;
}) {
  return (
    <div className="relative">
      <Icon>{icon}</Icon>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="h-12 w-full rounded-[15px] border border-[#dce5ef] bg-white px-12 text-[15px] text-[#2f4058] shadow-[0_5px_15px_rgba(58,84,112,0.06)] outline-none transition placeholder:text-[#98a9ba] focus:border-[#ff524a] focus:ring-4 focus:ring-[#ff524a]/10"
      />
      {showEye ? (
        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d8299]" aria-label="비밀번호 보기">
          <EyeIcon />
        </button>
      ) : null}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 py-1 text-sm text-[#9aa8b8]">
      <span className="h-px flex-1 bg-[#e2e8f0]" />
      <span>또는</span>
      <span className="h-px flex-1 bg-[#e2e8f0]" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.6l-3.6-2.8c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1V17A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.4V7H2.1a11 11 0 0 0 0 10l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.3c1.6 0 3.1.6 4.2 1.7l3.2-3.2A10.7 10.7 0 0 0 12 1 11 11 0 0 0 2.1 7l3.7 2.8c.9-2.6 3.3-4.5 6.2-4.5Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <path d="M16.4 13c0-2.5 2.1-3.7 2.2-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.6-1.8 3.2-.5 7.8 1.3 10.4.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8s2.3-1.3 3.2-2.5c1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1.1-2.8-4.3ZM14 5.6c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.2.7-3 1.6-.6.8-1.2 2-1.1 3.1 1.1.1 2.3-.5 3-1.4Z" />
    </svg>
  );
}

function SocialButton({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <button type="button" className="flex h-12 w-full items-center justify-center gap-3 rounded-[15px] border border-[#dce5ef] bg-white text-[15px] font-semibold text-[#42566d] shadow-[0_5px_15px_rgba(58,84,112,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(58,84,112,0.1)]">
      {icon}
      {children}
    </button>
  );
}

function BackgroundDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-[#92a7bd]" aria-hidden="true">
      <div className="absolute -left-10 top-16 h-16 w-72 -rotate-12 rounded-xl border-4 border-current opacity-20"><div className="flex h-full items-center justify-around px-4">{Array.from({ length: 7 }).map((_, index) => <span key={index} className="h-8 w-5 rounded-sm border-2 border-current" />)}</div></div>
      <div className="absolute right-4 top-10 h-14 w-64 rotate-12 rounded-xl border-4 border-current opacity-20"><div className="flex h-full items-center justify-around px-3">{Array.from({ length: 6 }).map((_, index) => <span key={index} className="h-7 w-4 rounded-sm border-2 border-current" />)}</div></div>
      <div className="absolute bottom-14 left-16 h-32 w-40 -rotate-12 rounded-2xl border-4 border-current opacity-15"><div className="h-9 rounded-t-xl border-b-4 border-current bg-current/10" /><div className="mx-auto mt-7 h-0 w-0 border-y-[18px] border-l-[30px] border-y-transparent border-l-current opacity-70" /></div>
      <div className="absolute -right-8 bottom-28 h-72 w-72 rounded-full border-[22px] border-current opacity-10"><div className="ml-[105px] mt-[82px] h-0 w-0 border-y-[45px] border-l-[74px] border-y-transparent border-l-current" /></div>
      <div className="absolute left-[12%] top-[30%] text-3xl opacity-20">✦</div><div className="absolute right-[12%] top-[28%] text-2xl opacity-20">♡</div><div className="absolute bottom-[18%] right-[24%] text-2xl opacity-20">✦</div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-xl bg-[#fff1f0] px-4 py-3 text-sm font-medium text-[#d83b35]">{message}</p>;
}

export function LoginCard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await postAuth('/auth/login', {
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={cardClass}>
      <DavasLogo />
      <div className="mt-6 text-center"><h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#2f557f]">환영합니다</h1><p className="mt-3 text-[15px] leading-6 text-[#74869a]">영화와 드라마를 보고 다이어리를 작성해보세요.</p></div>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AuthInput icon={<MailIcon />} name="email" placeholder="이메일" type="email" />
        <AuthInput icon={<LockIcon />} name="password" placeholder="비밀번호" type="password" showEye />
        <div className="flex items-center justify-between pt-1 text-sm"><label className="flex items-center gap-2 text-[#73869a]"><input type="checkbox" className="h-4 w-4 rounded border-[#9bacbd] accent-[#ff524a]" />로그인 상태 유지</label><a href="#" className="font-semibold text-[#ff524a] hover:text-[#e94640]">비밀번호를 잊으셨나요?</a></div>
        <ErrorMessage message={error} />
        <button disabled={isSubmitting} className="h-12 w-full rounded-[15px] bg-[#ff524a] text-[16px] font-bold text-white shadow-[0_10px_20px_rgba(255,82,74,0.25)] transition hover:bg-[#ee4740] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? '로그인 중...' : '로그인'}</button>
        <Divider />
        <SocialButton icon={<GoogleMark />}>Google로 계속하기</SocialButton>
        <SocialButton icon={<AppleMark />}>Apple로 계속하기</SocialButton>
      </form>
      <p className="mt-7 text-center text-sm text-[#74869a]">계정이 없으신가요? <Link href="/signup" className="font-bold text-[#ff524a]">회원가입</Link></p>
    </section>
  );
}

export function SignupCard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const passwordConfirm = String(form.get('passwordConfirm') ?? '');
    if (password !== passwordConfirm) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);
    try {
      await postAuth('/auth/signup', {
        nickname: String(form.get('nickname') ?? ''),
        email: String(form.get('email') ?? ''),
        password,
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={cardClass}>
      <DavasLogo />
      <div className="mt-6 text-center"><h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#2f557f]">계정을 만들어보세요</h1><p className="mt-3 text-[15px] leading-6 text-[#74869a]">Davas에 가입하고<br />리뷰와 다이어리를 기록해보세요.</p></div>
      <button className="relative mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[#b9c7d8] bg-[#eef4fa] text-[#83a2c3]" type="button"><UserIcon className="h-10 w-10" /><span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff524a] text-white shadow-[0_7px_14px_rgba(255,82,74,0.25)]"><CameraIcon /></span></button>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <AuthInput icon={<UserIcon />} name="nickname" placeholder="닉네임" />
        <AuthInput icon={<MailIcon />} name="email" placeholder="이메일" type="email" />
        <AuthInput icon={<LockIcon />} name="password" placeholder="비밀번호" type="password" showEye />
        <AuthInput icon={<LockIcon />} name="passwordConfirm" placeholder="비밀번호 확인" type="password" showEye />
        <label className="flex items-start gap-2 pt-1 text-sm leading-5 text-[#73869a]"><input name="terms" type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-[#9bacbd] accent-[#ff524a]" /><span><span className="font-semibold text-[#ff524a]">이용약관 및 개인정보처리방침</span>에 동의합니다</span></label>
        <ErrorMessage message={error} />
        <button disabled={isSubmitting} className="h-12 w-full rounded-[15px] bg-[#ff524a] text-[16px] font-bold text-white shadow-[0_10px_20px_rgba(255,82,74,0.25)] transition hover:bg-[#ee4740] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? '가입 중...' : '회원가입'}</button>
      </form>
      <p className="mt-7 text-center text-sm text-[#74869a]">이미 계정이 있으신가요? <Link href="/login" className="font-bold text-[#ff524a]">로그인</Link></p>
    </section>
  );
}
