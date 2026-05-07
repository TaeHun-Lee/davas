'use client';

import { useEffect, useState } from 'react';

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 7H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 12H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 17H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function ProfileAvatar() {
  return (
    <div
      data-design="profile-avatar"
      className="relative h-9 w-9 overflow-hidden rounded-full bg-[#f8d8c9] shadow-[0_6px_14px_rgba(31,65,114,0.13)] ring-2 ring-white"
    >
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="avatar-bg" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#fbe2d6" />
            <stop offset="1" stopColor="#f6aaa8" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" fill="url(#avatar-bg)" />
        <circle cx="40" cy="37" r="16" fill="#f3c0a4" />
        <path d="M18 78c4.3-17.5 16.5-24.4 22-24.4s18.2 6.9 22.6 24.4" fill="#2E6DD8" />
        <path d="M21 41c1-17.8 12.6-29.2 27-26.4 10.8 2.1 18.4 14.2 12.4 33.1-5.4-11.4-8.2-18-21.8-19.2-7.8.9-12.2 5.1-17.6 12.5Z" fill="#27334A" />
        <path d="M31.5 43.8c4.3 5 13.2 5.1 17.2 0" stroke="#9D5A52" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34.4" cy="35.8" r="2" fill="#26334A" />
        <circle cx="47.2" cy="35.8" r="2" fill="#26334A" />
      </svg>
    </div>
  );
}

export function DavasHeader() {
  const [isElevated, setIsElevated] = useState(false);

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

  const elevationClass = isElevated ? 'shadow-[0_8px_22px_rgba(31,42,68,0.06)]' : 'shadow-none';

  return (
    <header
      data-elevated={isElevated}
      className={`fixed left-1/2 top-0 z-[60] flex h-[64px] w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-[#f6f8fc]/95 px-5 min-[390px]:px-6 backdrop-blur transition-shadow duration-200 ${elevationClass}`}
    >
      <button
        type="button"
        aria-label="메뉴 열기"
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#58677d] transition hover:bg-white/80"
      >
        <MenuIcon />
      </button>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <DavasLogoMark />
      </div>

      <button type="button" aria-label="프로필 보기" className="flex h-10 w-10 items-center justify-center rounded-full">
        <ProfileAvatar />
      </button>

      <span
        aria-hidden="true"
        data-design="sticky-header-gradient"
        className={`pointer-events-none absolute inset-x-0 -bottom-5 h-5 bg-[linear-gradient(180deg,rgba(246,248,252,0.72)_0%,rgba(246,248,252,0)_100%)] transition-opacity duration-200 ${isElevated ? 'opacity-100' : 'opacity-0'}`}
      />
    </header>
  );
}
