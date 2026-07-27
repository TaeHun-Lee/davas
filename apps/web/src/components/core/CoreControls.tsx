'use client';

import type { MediaType, ViewingMethod } from '@davas/shared';
import type { ReactNode } from 'react';

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
        <button type="button" onClick={() => onChange('')} aria-label="검색어 지우기">
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

export function AsyncState({ kind, onRetry }: { kind: 'loading' | 'error'; onRetry?: () => void }) {
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
