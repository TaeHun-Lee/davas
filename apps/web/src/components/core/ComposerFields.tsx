'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import { OTT_SERVICES as SUBSCRIPTION_SERVICES, WATCH_EPISODE_MAX } from '@davas/shared';
import type { TheaterFormat } from '../../lib/api/watch-events';
import { seriesProgressSummary } from './composer-draft';

export const THEATER_FORMAT_LABELS: Record<TheaterFormat, string> = {
  STANDARD: '일반',
  IMAX: 'IMAX',
  FOUR_DX: '4DX',
  DOLBY: '돌비',
};

// The same services as the subscription settings, so every OTT someone subscribes to is one tap.
export const OTT_SERVICES: string[] = SUBSCRIPTION_SERVICES.map((service) => service.label);

/** An on/off setting with a visible label and description, announced as a switch. */
export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  icon,
  disabled = false,
  children,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  /** Shown but fixed, such as a notification that cannot be turned off. */
  disabled?: boolean;
  /** A small picture in front of the label, such as the blind switch's lock. */
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="composer-switch" data-checked={checked || undefined}>
      <div className="composer-switch-row">
        {icon ? (
          <span className="composer-switch-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p id={`${id}-label`} className="composer-switch-label">
            {label}
          </p>
          <p id={`${id}-description`} className="composer-switch-description">
            {description}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          className="composer-switch-control"
          disabled={disabled}
          onClick={() => onChange(!checked)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      {children}
    </div>
  );
}

/** A text field with a live "n/max" counter, for 한줄평, 소감 and 추억 메모. */
export function CountedField({
  label,
  value,
  max,
  onChange,
  placeholder,
  multiline = false,
  rows = 5,
  badge,
  tone,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  /** A short note beside the label, such as who can read the field. */
  badge?: ReactNode;
  /** `memo` gives the 추억 메모 box its warm paper colour. */
  tone?: 'memo';
}) {
  const id = useId();
  return (
    <div className="composer-field">
      <div className="composer-field-head">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {badge ? <span className="composer-field-badge">{badge}</span> : null}
        {/* Read after the field itself, so the count is found without being announced per key. */}
        <span id={`${id}-count`} className="composer-field-count">
          <span className="sr-only">글자 수 </span>
          {value.length}/{max}
        </span>
      </div>
      {multiline ? (
        <textarea
          id={id}
          className="text-area"
          data-tone={tone}
          aria-describedby={`${id}-count`}
          rows={rows}
          maxLength={max}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          className="date-input"
          aria-describedby={`${id}-count`}
          maxLength={max}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}

export function ChoiceChips<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns,
}: {
  legend: string;
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T | null) => void;
  /** Lays the chips out as an even grid of this many columns instead of wrapping pills. */
  columns?: number;
}) {
  return (
    <fieldset
      className="composer-chips"
      data-grid={columns ? true : undefined}
      style={columns ? ({ '--chip-columns': columns } as CSSProperties) : undefined}
    >
      <legend className="field-label">{legend}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            // Pressing the chosen chip again clears it, since every detail here is optional.
            onClick={() => onChange(value === option.value ? null : option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Where a series is up to: last episode watched, optional total, and "finished". */
export function SeriesProgress({
  watched,
  total,
  completed,
  onChange,
}: {
  watched: number | null;
  total: number | null;
  completed: boolean;
  onChange: (value: { watched: number | null; total: number | null; completed: boolean }) => void;
}) {
  const totalId = useId();
  const watchedId = useId();
  const clamp = (value: number) => Math.max(1, Math.min(total ?? 2000, value));
  const current = watched ?? 0;
  const summary = seriesProgressSummary(watched, total, completed);
  return (
    <fieldset className="series-progress">
      <legend className="field-label">본 회차 (선택)</legend>
      <div className="series-progress-row">
        {/* From 1화 the minus clears the episode, so a prefilled episode can be taken back. */}
        <button
          type="button"
          aria-label={current === 1 ? '본 회차 지우기' : '본 회차 하나 줄이기'}
          disabled={current < 1}
          onClick={() =>
            onChange({ watched: current > 1 ? clamp(current - 1) : null, total, completed: false })
          }
        >
          <span aria-hidden="true">−</span>
        </button>
        {/* Typed directly too: a daily drama past episode 100 should not take 100 taps. */}
        <label htmlFor={watchedId} className="series-progress-value">
          <span className="sr-only">본 회차</span>
          <input
            id={watchedId}
            type="number"
            inputMode="numeric"
            min={1}
            max={total ?? 2000}
            placeholder="미선택"
            value={watched ?? ''}
            onChange={(event) => {
              const raw = event.target.value;
              if (!raw) {
                onChange({ watched: null, total, completed: false });
                return;
              }
              const parsed = Number(raw);
              if (!Number.isInteger(parsed) || parsed < 1) return;
              const next = clamp(parsed);
              onChange({ watched: next, total, completed: total !== null && next === total });
            }}
          />
          {watched ? <span aria-hidden="true">화까지</span> : null}
        </label>
        <button
          type="button"
          aria-label="본 회차 하나 늘리기"
          disabled={total !== null && current >= total}
          onClick={() => {
            const next = clamp(current + 1);
            onChange({ watched: next, total, completed: total !== null && next === total });
          }}
        >
          <span aria-hidden="true">＋</span>
        </button>
      </div>
      {/* The summary below says the same in words, so the bar itself stays silent. */}
      {total && watched ? (
        <span className="series-progress-bar" aria-hidden="true">
          <span style={{ width: `${Math.round((watched / total) * 100)}%` }} />
        </span>
      ) : null}
      {summary ? <p className="series-progress-summary">{summary}</p> : null}
      <label htmlFor={totalId} className="series-progress-total">
        <span>전체 회차</span>
        <input
          id={totalId}
          className="date-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={WATCH_EPISODE_MAX}
          placeholder="모르면 비워 두세요"
          value={total ?? ''}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            const nextTotal =
              event.target.value && Number.isInteger(parsed) && parsed > 0
                ? Math.min(parsed, 2000)
                : null;
            onChange({
              watched: watched && nextTotal ? Math.min(watched, nextTotal) : watched,
              total: nextTotal,
              completed: Boolean(completed && nextTotal),
            });
          }}
        />
      </label>
      <label className="series-progress-done">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) =>
            onChange({
              watched: event.target.checked && total ? total : watched,
              total,
              completed: event.target.checked,
            })
          }
        />
        이번에 끝까지 다 봤어요
      </label>
    </fieldset>
  );
}
