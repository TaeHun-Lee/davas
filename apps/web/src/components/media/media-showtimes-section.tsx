'use client';

import { seoulToday, type MediaShowtimesResponse } from '@davas/shared';
import { useEffect, useState } from 'react';
import { getMediaShowtimes } from '../../lib/api/media';
import { THEATER_FORMAT_LABELS } from '../core/ComposerFields';
import { showtimeDateLabel, showtimeRegions, showtimesReadLabel } from './media-showtimes-model';

const card =
  'rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]';
const title = 'text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[var(--heading)]';
const chip = (on: boolean) =>
  `shrink-0 rounded-full px-3 py-1.5 text-[12px] font-extrabold ${on ? 'bg-[#216bd8] text-white' : 'bg-[#f1f5fb] text-[#3c4a5e]'}`;
// A theater list long enough to need scrolling folds after this many.
const FOLDED = 5;

/**
 * "극장에서 볼 수 있는 곳": where a film plays in Seoul and Gyeonggi this week, day by day,
 * theaters the viewer has records at first. Shown only when it plays somewhere. KOBIS's terms
 * ask for its data on its own with the source named, so this card holds nothing else.
 */
export function TheaterShowtimesCard({ mediaId, enabled }: { mediaId: string; enabled: boolean }) {
  const [showtimes, setShowtimes] = useState<MediaShowtimesResponse | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [unfolded, setUnfolded] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setShowtimes(null);
    getMediaShowtimes(mediaId)
      .then((response) => {
        if (!active) return;
        setShowtimes(response);
        setDate(response.dates[0]?.date ?? null);
      })
      .catch(() => {
        if (active) setShowtimes(null);
      });
    return () => {
      active = false;
    };
  }, [enabled, mediaId]);

  if (!enabled || !showtimes?.dates.length) return null;
  const day = showtimes.dates.find((item) => item.date === date) ?? showtimes.dates[0];
  const regions = showtimeRegions(day.theaters);
  const theaters = day.theaters.filter((theater) => !region || theater.region === region);
  const visible = unfolded ? theaters : theaters.slice(0, FOLDED);
  const today = seoulToday();
  const read = showtimesReadLabel(showtimes.updatedAt);

  return (
    <section className={card} aria-labelledby="theater-showtimes-title">
      <h3 id="theater-showtimes-title" className={title}>
        극장에서 볼 수 있는 곳
      </h3>
      <div
        className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1"
        role="group"
        aria-label="상영 날짜"
      >
        {showtimes.dates.map((item) => {
          const label = showtimeDateLabel(item.date, today);
          return (
            <button
              key={item.date}
              type="button"
              aria-pressed={item.date === day.date}
              className={chip(item.date === day.date)}
              onClick={() => {
                setDate(item.date);
                setUnfolded(false);
              }}
            >
              {label.name} {label.day}
            </button>
          );
        })}
      </div>
      {regions.length > 1 ? (
        <div className="mt-2 flex gap-1.5" role="group" aria-label="지역">
          {[null, ...regions].map((item) => (
            <button
              key={item ?? 'all'}
              type="button"
              aria-pressed={region === item}
              className={chip(region === item)}
              onClick={() => {
                setRegion(item);
                setUnfolded(false);
              }}
            >
              {item ?? '전체'}
            </button>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-[12px] font-extrabold text-[#2f4d73]">
        {region ?? '서울·경기'} {theaters.length}곳에서 상영해요
      </p>
      <ul
        className="mt-2 space-y-2"
        aria-label={`${showtimeDateLabel(day.date, today).name} 상영 극장`}
      >
        {visible.map((theater) => (
          <li key={theater.code} className="rounded-[16px] bg-[#f6f9fd] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <strong className="min-w-0 truncate text-[14px] font-black text-[var(--heading)]">
                {theater.name}
              </strong>
              {theater.visits > 0 ? (
                <span className="shrink-0 rounded-full bg-[#eaf1ff] px-2 py-0.5 text-[11px] font-extrabold text-[#1c5ab5]">
                  자주 가는 곳
                </span>
              ) : null}
              {theater.homepageUrl ? (
                <a
                  href={theater.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto shrink-0 text-[12px] font-extrabold text-[var(--blue)]"
                  aria-label={`${theater.name} 예매하러 가기`}
                >
                  예매 ›
                </a>
              ) : null}
            </div>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--muted)]">
              {theater.region} {theater.area}
            </p>
            <div className="mt-2 space-y-1.5">
              {theater.screenings.map((screening) => (
                <div key={`${screening.screen}-${screening.format}`} className="flex gap-2">
                  <span className="w-[86px] shrink-0 truncate pt-1 text-[11px] font-bold text-[#5f6b7a]">
                    {screening.screen}
                    {screening.format ? (
                      <span className="ml-1 rounded bg-[#1f2b3d] px-1 py-px text-[10px] font-black text-white">
                        {THEATER_FORMAT_LABELS[screening.format]}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex min-w-0 flex-wrap gap-1">
                    {screening.times.map((time) => (
                      <span
                        key={time}
                        className="rounded-[8px] bg-white px-2 py-1 text-[12px] font-extrabold text-[var(--heading)] ring-1 ring-[#e3eaf3]"
                      >
                        {time}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {theaters.length > FOLDED ? (
        <button
          type="button"
          className="mt-2 w-full rounded-[14px] bg-[#f1f5fb] py-2 text-[12px] font-extrabold text-[#2f4d73]"
          aria-expanded={unfolded}
          onClick={() => setUnfolded((value) => !value)}
        >
          {unfolded ? '접기' : `${theaters.length - FOLDED}곳 더 보기`}
        </button>
      ) : null}
      <p className="mt-3 text-[12px] font-semibold leading-[17px] text-[var(--muted)]">
        상영 정보: 영화진흥위원회 통합전산망(KOBIS){read ? ` · ${read}` : ''}. 극장 사정에 따라
        실제와 다를 수 있으니 예매 전에 극장에서 확인해 주세요.
      </p>
    </section>
  );
}
