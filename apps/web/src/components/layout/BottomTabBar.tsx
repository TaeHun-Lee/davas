"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabName = 'home' | 'explore' | 'community' | 'diary' | 'profile';

type TabItem = {
  href: string;
  label: string;
  name: TabName;
};

const tabs: TabItem[] = [
  { href: '/', label: '홈', name: 'home' },
  { href: '/explore', label: '탐색', name: 'explore' },
  { href: '/community', label: '커뮤니티', name: 'community' },
  { href: '/diary', label: '다이어리', name: 'diary' },
  { href: '/profile', label: '프로필', name: 'profile' },
];

function renderTabIcon(name: TabName, isActive: boolean) {
  const stroke = isActive ? '#216BD8' : '#8E9AAF';
  const fill = isActive ? '#216BD8' : 'none';
  const common = { width: 25, height: 25, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3.5 10.8 12 4l8.5 6.8" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 10.5V20h11v-9.5" fill={isActive ? '#EAF1FF' : 'none'} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M10 20v-5h4v5" fill={isActive ? fill : 'none'} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'explore':
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.2" stroke={stroke} strokeWidth="2" />
          <path d="m15.3 15.3 4.2 4.2" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'community':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3.2" stroke={stroke} strokeWidth="2" />
          <circle cx="16.5" cy="10" r="2.6" stroke={stroke} strokeWidth="2" />
          <path d="M3.8 20c.7-3.8 2.8-5.8 5.2-5.8s4.5 2 5.2 5.8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M14.5 15.2c2.6.2 4.5 1.9 5.1 4.8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'diary':
      return (
        <svg {...common}>
          <path d="M6 4.5h10.5A2.5 2.5 0 0 1 19 7v13H7.5A2.5 2.5 0 0 1 5 17.5V5.5c0-.6.4-1 1-1Z" fill={isActive ? '#EAF1FF' : 'none'} stroke={stroke} strokeWidth="2" />
          <path d="M8.5 4.5V20" stroke={stroke} strokeWidth="2" />
          <path d="M11 9h5M11 13h4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.8" stroke={stroke} strokeWidth="2" />
          <path d="M5.5 20c.9-4.2 3.3-6.4 6.5-6.4s5.6 2.2 6.5 6.4" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[30px] bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3 shadow-[0_-16px_36px_rgba(33,62,105,0.16)] backdrop-blur">
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex h-[62px] flex-col items-center justify-center gap-1 text-[11px] font-bold leading-[14px] transition ${
                isActive ? 'text-[#216bd8]' : 'text-[#8e9aaf]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {renderTabIcon(tab.name, isActive)}
              <span>{tab.label}</span>
              {isActive ? <span className="absolute bottom-0 h-[3px] w-9 rounded-full bg-[#216bd8]" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
