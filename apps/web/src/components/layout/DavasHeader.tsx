'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMe, normalizeProfileImageUrl, type AuthenticatedUser } from '../../lib/api/auth';
import { DefaultProfileAvatar } from '../profile/DefaultProfileAvatar';

const drawerItems = [
  { href: '/', label: '홈', description: '나의 기록 홈' },
  { href: '/explore', label: '탐색', description: '작품 검색과 추천' },
  { href: '/community', label: '커뮤니티', description: '다른 사람의 기록' },
  { href: '/diary', label: '다이어리', description: '내 감상 기록' },
  { href: '/profile', label: '프로필', description: '계정과 설정' },
];

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 7H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 12H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 17H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DavasLogoMark() {
  return (
    <img
      data-design="davas-horizontal-logo"
      src="/images/davas-logo-horizontal.png"
      alt="Davas"
      className="h-[34px] w-auto object-contain"
    />
  );
}

function ProfileAvatar({ user }: { user: AuthenticatedUser | null }) {
  const displayName = user?.nickname || '필름메이트';
  const profileImageUrl = normalizeProfileImageUrl(user?.profileImageUrl);

  return (
    <span
      data-design="profile-avatar"
      className="relative h-9 w-9 overflow-hidden rounded-full bg-[#f8d8c9] shadow-[0_6px_14px_rgba(31,65,114,0.13)] ring-2 ring-white"
    >
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <DefaultProfileAvatar initial={displayName} className="text-[14px]" />
      )}
    </span>
  );
}

export function DavasHeader() {
  const [isElevated, setIsElevated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const updateHeaderElevation = () => {
      setIsElevated(window.scrollY > 0);
    };

    updateHeaderElevation();
    window.addEventListener('scroll', updateHeaderElevation, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderElevation);
    };
  }, []);

  useEffect(() => {
    getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null));
  }, []);

  const elevationClass = isElevated ? 'shadow-[0_8px_22px_rgba(31,42,68,0.06)]' : 'shadow-none';

  return (
    <>
      <header
        data-elevated={isElevated}
        className={`fixed left-1/2 top-0 z-[60] flex h-[64px] w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-[#f6f8fc]/95 px-5 min-[390px]:px-6 backdrop-blur transition-shadow duration-200 ${elevationClass}`}
      >
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setIsDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#58677d] transition hover:bg-white/80"
        >
          <MenuIcon />
        </button>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <DavasLogoMark />
        </div>

        <Link href="/profile" aria-label="프로필 화면으로 이동" className="flex h-10 w-10 items-center justify-center rounded-full">
          <ProfileAvatar user={user} />
        </Link>

        <span
          aria-hidden="true"
          data-design="sticky-header-gradient"
          className={`pointer-events-none absolute inset-x-0 -bottom-5 h-5 bg-[linear-gradient(180deg,rgba(246,248,252,0.72)_0%,rgba(246,248,252,0)_100%)] transition-opacity duration-200 ${isElevated ? 'opacity-100' : 'opacity-0'}`}
        />
      </header>

      <div
        aria-hidden={!isDrawerOpen}
        data-design="left-drawer-overlay"
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 z-[70] bg-[#16233c]/32 transition-opacity duration-200 ${isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        data-design="left-drawer-panel"
        aria-label="왼쪽 메뉴"
        className={`fixed left-0 top-0 z-[71] h-screen w-[300px] max-w-[82vw] bg-white px-5 pb-8 pt-5 shadow-[18px_0_40px_rgba(20,38,70,0.18)] transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <DavasLogoMark />
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setIsDrawerOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4f7fb] text-[#6f7c91]"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="mt-8 space-y-2" aria-label="주요 메뉴">
          {drawerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsDrawerOpen(false)}
              className="block rounded-[20px] bg-[#f7f9fd] px-4 py-3 text-[#1f2a44] transition hover:bg-[#edf3fb]"
            >
              <span className="block text-[15px] font-black tracking-[-0.02em]">{item.label}</span>
              <span className="mt-1 block text-[12px] font-bold text-[#8b96a8]">{item.description}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
