'use client';

import { seoulToday } from '@davas/shared';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSpaceCalendar, type SpaceCalendar } from '../../lib/api/memories';
import { AsyncState, Poster } from '../core/CoreUi';
import { WatchPhoto } from '../core/WatchPhoto';
import { monthDayLabel } from '../../lib/dates';
import { monthGrid, seoulMonth, shiftMonth } from './memories-model';
import { mediaTypeLabel } from '../../lib/api/core';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const SOURCE_LABELS: Record<string, string> = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV·소장',
  OTHER: '기타',
};
const RETURN_TO = '/spaces/memories?view=calendar';

/** A month of the space's shared records on a calendar; a day opens its records below. */
export function SpaceCalendarView({ spaceId }: { spaceId: string }) {
  const thisMonth = seoulMonth();
  const today = seoulToday();
  const [month, setMonth] = useState(thisMonth);
  const [data, setData] = useState<SpaceCalendar | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selected, setSelected] = useState<string | null>(null);
  // Paging months quickly must not let an older month's answer land last.
  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    const request = ++latestRequest.current;
    setStatus('loading');
    try {
      const next = await getSpaceCalendar(spaceId, month);
      if (request !== latestRequest.current) return;
      setData(next);
      setSelected(next.days.at(-1)?.date ?? null);
      setStatus('ready');
    } catch {
      if (request === latestRequest.current) setStatus('error');
    }
  }, [spaceId, month]);

  useEffect(() => {
    void load();
  }, [load]);

  const byDate = new Map((data?.month === month ? data.days : []).map((day) => [day.date, day]));
  const total = [...byDate.values()].reduce((sum, day) => sum + day.records.length, 0);
  const [year, monthNumber] = month.split('-').map(Number);
  const selectedDay = selected ? byDate.get(selected) : undefined;

  return (
    <section className="calendar" aria-labelledby="calendar-title">
      <div className="calendar-card">
        <div className="calendar-month" role="group" aria-label="달 고르기">
          <button
            type="button"
            onClick={() => setMonth((value) => shiftMonth(value, -1))}
            aria-label="지난달 보기"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <h2 id="calendar-title" aria-live="polite">
            {year}년 {monthNumber}월
          </h2>
          <button
            type="button"
            onClick={() => setMonth((value) => shiftMonth(value, 1))}
            disabled={month >= thisMonth}
            aria-label="다음 달 보기"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        {status === 'error' ? (
          <AsyncState kind="error" onRetry={load} errorTitle="달력을 불러오지 못했어요" />
        ) : (
          <>
            <p className="sr-only" role="status">
              {status === 'loading' ? '불러오는 중…' : `이 달에 공간에 남긴 기록 ${total}개`}
            </p>
            <div className="calendar-weekdays" aria-hidden="true">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-grid" data-loading={status === 'loading' || undefined}>
              {monthGrid(month).map((date, index) => {
                if (!date) return <span key={`blank-${index}`} aria-hidden="true" />;
                const day = byDate.get(date);
                const first = day?.records[0];
                const weekday = index % 7;
                const tone = weekday === 0 ? 'sun' : weekday === 6 ? 'sat' : undefined;
                // A day without records is just a date; a day with records is its first
                // record's photo or poster, with the date on it and how many more there are.
                if (!day || !first)
                  return (
                    <span
                      key={date}
                      className="calendar-day"
                      data-tone={tone}
                      data-today={date === today || undefined}
                    >
                      {Number(date.slice(8))}
                    </span>
                  );
                return (
                  <button
                    key={date}
                    type="button"
                    className="calendar-day calendar-day-filled"
                    aria-pressed={selected === date}
                    aria-label={`${monthDayLabel(date)}, 기록 ${day.records.length}개`}
                    data-today={date === today || undefined}
                    onClick={() => setSelected(date)}
                  >
                    {first.coverPhoto ? (
                      <WatchPhoto photo={first.coverPhoto} variant="thumb" alt="" />
                    ) : first.posterUrl ? (
                      <img src={first.posterUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="calendar-day-fallback" aria-hidden="true">
                        {[...first.title][0]}
                      </span>
                    )}
                    <span className="calendar-day-date" aria-hidden="true">
                      {Number(date.slice(8))}
                    </span>
                    {day.records.length > 1 ? (
                      <span className="calendar-day-more" aria-hidden="true">
                        +{day.records.length - 1}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {status !== 'error' && selectedDay ? (
        <section className="calendar-list" aria-labelledby="calendar-day-title">
          <h2 id="calendar-day-title">{monthDayLabel(selectedDay.date)}</h2>
          <ul>
            {selectedDay.records.map((record) => (
              <li key={record.watchEventId}>
                <Link
                  href={`/records/${encodeURIComponent(record.watchEventId)}?returnTo=${encodeURIComponent(RETURN_TO)}`}
                >
                  <Poster url={record.posterUrl} title={record.title} />
                  <span className="min-w-0">
                    <strong>{record.title}</strong>
                    <span>
                      {[
                        mediaTypeLabel(record.mediaType),
                        record.sourceKind ? SOURCE_LABELS[record.sourceKind] : null,
                        record.isMine
                          ? '내 기록'
                          : record.authorName
                            ? `${record.authorName}님 기록`
                            : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : status === 'ready' && total === 0 ? (
        <p className="page-description mt-4">
          이 달에는 공간에 남긴 기록이 없어요. 다른 달을 넘겨 보세요.
        </p>
      ) : null}
    </section>
  );
}
