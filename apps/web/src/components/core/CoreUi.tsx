'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MediaType, ViewingMethod } from '@davas/shared';
import type { ReactNode } from 'react';
import {
  mediaTypeLabel,
  viewingMethodLabel,
  visibilityLabel,
  type RecordCardData,
} from '../../lib/api/core';

const tabs = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/records/new', label: '기록하기', icon: 'add' },
  { href: '/me', label: '내 기록', icon: 'records' },
  { href: '/friends', label: '친구', icon: 'friends' },
] as const;

function CoreNavIcon({ icon }: { icon: (typeof tabs)[number]['icon'] }) {
  const paths = {
    home: <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.25v-6.4h-6.5V21H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />,
    add: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
    records: <><path d="M5 4.5h14v15H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    friends: <><circle cx="9" cy="9" r="3" /><circle cx="16.5" cy="10" r="2.5" /><path d="M3.5 19c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M14 15c3.5-.4 5.5.9 6 4" /></>,
  } as const;

  return (
    <svg className="core-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export function CoreHeader() {
  return (
    <header className="core-header">
      <Link href="/" aria-label="홈으로 이동">
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
      <Link href="/settings" className="core-icon-button" aria-label="설정 열기">
        <svg data-icon="settings" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.7 3.5h4.6l.6 2.1c.5.2.9.4 1.3.7l2.1-.6 2.3 4-1.6 1.5v1.6l1.6 1.5-2.3 4-2.1-.6c-.4.3-.8.5-1.3.7l-.6 2.1H9.7l-.6-2.1c-.5-.2-.9-.4-1.3-.7l-2.1.6-2.3-4L5 12.8v-1.6L3.4 9.7l2.3-4 2.1.6c.4-.3.8-.5 1.3-.7l.6-2.1Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Link>
    </header>
  );
}

export function CoreBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="core-bottom-nav" aria-label="주요 메뉴">
      {tabs.map((tab) => {
        const active =
          tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="core-nav-item"
            aria-current={active ? 'page' : undefined}
            data-active={active}
          >
            <CoreNavIcon icon={tab.icon} />
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
}: {
  title: string;
  fallback: string;
  onBack?: () => void;
}) {
  const router = useRouter();
  return (
    <header className="back-header">
      <button
        type="button"
        onClick={() => {
          if (onBack) { onBack(); return; }
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
  children,
}: {
  title: string;
  fallback: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="desktop-canvas">
      <div className="core-shell">
        <BackHeader title={title} fallback={fallback} onBack={onBack} />
        <main className="task-main">{children}</main>
      </div>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  onSubmit?: () => void;
}) {
  return (
    <form
      className="search-field"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <label className="sr-only" htmlFor={`search-${label}`}>
        {label}
      </label>
      <span aria-hidden="true">⌕</span>
      <input
        id={`search-${label}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="검색어 지우기"
        >
          ×
        </button>
      ) : null}
    </form>
  );
}

export function MediaTypeControl({
  value,
  onChange,
  includeAll = true,
}: {
  value: MediaType | null;
  onChange: (value: MediaType | null) => void;
  includeAll?: boolean;
}) {
  const options: Array<{ value: MediaType | null; label: string }> = [
    ...(includeAll ? [{ value: null, label: '전체' }] : []),
    { value: 'MOVIE', label: '영화' },
    { value: 'TV', label: '드라마' },
  ];
  return (
    <div className="segmented" role="group" aria-label="작품 종류">
      {options.map((option) => (
        <button
          type="button"
          key={option.label}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ViewingMethodControl({
  value,
  onChange,
  includeAll = false,
  label = '본 곳',
}: {
  value: ViewingMethod | null;
  onChange: (value: ViewingMethod | null) => void;
  includeAll?: boolean;
  label?: string;
}) {
  const options: Array<{ value: ViewingMethod | null; label: string }> = [
    ...(includeAll ? [{ value: null, label: '전체' }] : []),
    { value: 'THEATER', label: '영화관' },
    { value: 'OTT', label: 'OTT' },
  ];
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.label}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Poster({ url, title }: { url: string | null; title: string }) {
  return url ? (
    <Image
      unoptimized
      src={url}
      alt={`${title} 포스터`}
      width={82}
      height={123}
      className="poster"
    />
  ) : (
    <div
      className="poster poster-empty"
      role="img"
      aria-label={`${title} 포스터 없음`}
    >
      {title.slice(0, 1)}
    </div>
  );
}

export function RecordCard({
  item,
  returnTo,
}: {
  item: RecordCardData;
  returnTo?: string;
}) {
  const detail = `/records/${item.id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
  return (
    <article className="core-card record-card">
      <div className="record-author">
        <span className="avatar-small">{item.author.nickname.slice(0, 1)}</span>
        <div>
          <strong>
            {item.author.nickname}
            {item.isMine ? ' · 내 기록' : ''}
          </strong>
          <p>{item.watchedDate.replaceAll('-', '.')}에 봤어요</p>
        </div>
      </div>
      <div className="record-media">
        <Poster url={item.media.posterUrl} title={item.media.title} />
        <div className="min-w-0 flex-1">
          <h3>{item.media.title}</h3>
          <p>
            {[item.media.originalTitle, item.media.releaseYear]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <div className="badge-row">
            <span>{mediaTypeLabel(item.media.mediaType)}</span>
            <span>{viewingMethodLabel(item.viewingMethod)}</span>
            {item.isMine ? (
              <span>{visibilityLabel(item.visibility)}</span>
            ) : null}
          </div>
          {item.rating !== null ? (
            <p className="rating">★ {item.rating}</p>
          ) : null}
        </div>
      </div>
      {item.hasSpoiler ? (
        <p className="spoiler-preview">
          스포일러가 있는 리뷰예요. 상세에서 내용을 확인할 수 있어요.
        </p>
      ) : item.reviewPreview ? (
        <p className="review-preview">{item.reviewPreview}</p>
      ) : null}
      <div className="card-actions">
        <Link href={detail}>자세히 보기</Link>
        <Link href={`/records/new?mediaId=${item.media.id}`}>
          나도 기록하기
        </Link>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="core-card empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
export function AsyncState({
  kind,
  onRetry,
}: {
  kind: 'loading' | 'error';
  onRetry?: () => void;
}) {
  return kind === 'loading' ? (
    <div className="space-y-3" aria-label="기록 불러오는 중">
      {[0, 1, 2].map((value) => (
        <div key={value} className="skeleton-card" />
      ))}
    </div>
  ) : (
    <EmptyState
      title="기록을 불러오지 못했어요"
      description="연결을 확인하고 다시 시도해 주세요."
      action={
        <button type="button" className="secondary-button" onClick={onRetry}>
          다시 시도
        </button>
      }
    />
  );
}
