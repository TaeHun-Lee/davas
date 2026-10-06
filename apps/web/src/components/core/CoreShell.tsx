'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const tabs = [
  { href: '/', label: '친구 기록', icon: '◫' },
  { href: '/records/new', label: '기록하기', icon: '＋' },
  { href: '/me', label: '내 기록', icon: '▤' },
  { href: '/friends', label: '친구', icon: '●' },
];

export function CoreHeader() {
  return (
    <header className="core-header">
      <Link href="/" aria-label="친구 기록으로 이동">
        <Image
          src="/images/davas-logo-horizontal.png"
          alt="Davas"
          width={112}
          height={36}
          priority
          style={{ width: 'auto', height: 36 }}
          className="object-contain"
        />
      </Link>
      <Link href="/settings" className="core-avatar" aria-label="설정 열기">
        설정
      </Link>
    </header>
  );
}

export function CoreBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="core-bottom-nav" aria-label="주요 메뉴">
      {tabs.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="core-nav-item"
            aria-current={active ? 'page' : undefined}
            data-active={active}
          >
            <span aria-hidden="true" className="text-lg">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function CoreAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="desktop-canvas">
      <div className="core-shell">
        <CoreHeader />
        <main className="core-main">{children}</main>
        <CoreBottomNav />
      </div>
    </div>
  );
}

export function BackHeader({
  title,
  fallback,
  onBack,
  backDisabled = false,
}: {
  title: string;
  fallback: string;
  onBack?: () => void;
  backDisabled?: boolean;
}) {
  const router = useRouter();
  return (
    <header className="back-header">
      <button
        type="button"
        disabled={backDisabled}
        onClick={() => {
          if (onBack) {
            onBack();
            return;
          }
          if (history.length > 1) router.back();
          else router.push(fallback);
        }}
        aria-label="뒤로 가기"
      >
        ‹
      </button>
      <strong>{title}</strong>
      <span aria-hidden="true" />
    </header>
  );
}

export function TaskShell({
  title,
  fallback,
  onBack,
  backDisabled = false,
  children,
}: {
  title: string;
  fallback: string;
  onBack?: () => void;
  backDisabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="desktop-canvas">
      <div className="core-shell">
        <BackHeader title={title} fallback={fallback} onBack={onBack} backDisabled={backDisabled} />
        <main className="task-main">{children}</main>
      </div>
    </div>
  );
}
