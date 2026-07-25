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
