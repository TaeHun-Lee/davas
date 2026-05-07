export type StatKind = 'diary' | 'watch' | 'rating' | 'genre';

export type HomeStat = {
  label: string;
  value: string;
  unit?: string;
  helper: string;
  kind: StatKind;
};

function NotebookIcon() {
  return (
    <svg data-design="stat-diary-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="7.3" y="4.2" width="12.4" height="17.6" rx="2.4" fill="#2F7EEA" />
      <path d="M10.1 4.2h8a2.1 2.1 0 0 1 2.1 2.1v13.2a2.1 2.1 0 0 1-2.1 2.1h-8V4.2Z" fill="#DDEBFF" />
      <path d="M7.3 6.2c0-1.1.9-2 2-2h1.4v17.5H9.3a2 2 0 0 1-2-2V6.2Z" fill="#1F63C9" />
      <rect x="12.1" y="8.2" width="5.5" height="3.8" rx="1" fill="#FFFFFF" opacity="0.94" />
      <path d="M12.2 15.3h5.3M12.2 17.5h3.9" stroke="#2F7EEA" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M8.4 21.3c1.1.8 7.4.9 10.2.2" stroke="#BFD4F8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarWatchIcon() {
  return (
    <svg data-design="stat-calendar-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="6" y="6.4" width="16" height="15.1" rx="3" fill="#2F7EEA" />
      <path d="M6 10.5h16" stroke="#DDEBFF" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 4.7v3.4M18 4.7v3.4" stroke="#2F7EEA" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="9.3" y="13" width="3.2" height="3.2" rx=".9" fill="white" opacity="0.96" />
      <rect x="15.1" y="13" width="3.2" height="3.2" rx=".9" fill="#EF4444" />
      <path d="m16.2 13.8 1.35.8-1.35.8v-1.6Z" fill="white" />
      <path d="M9.4 18.5h8.9" stroke="#DDEBFF" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg data-design="stat-rating-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.37l-5.7 2.99 1.09-6.35-4.62-4.5 6.38-.93L12 2.8Z" fill="#EF4444" />
    </svg>
  );
}

function MasksIcon() {
  return (
    <svg data-design="stat-genre-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M5.3 7.6c4.2-1.8 7.8-1.8 11.5 0-.1 6.7-2 10.9-5.8 12.1-3.8-1.2-5.6-5.4-5.7-12.1Z" fill="#2F7EEA" />
      <path d="M12 8.2c3.7-1.4 7.4-1.1 10.8.9-.5 6.2-2.7 10.1-6.4 11-2-.7-3.5-2.3-4.4-4.8V8.2Z" fill="#EF4444" />
      <circle cx="9.2" cy="11.8" r="1" fill="white" />
      <circle cx="13.1" cy="11.8" r="1" fill="white" />
      <path d="M8.5 15.9c1.3 1 3.5 1 4.8 0" stroke="white" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="16" cy="12.2" r=".9" fill="white" />
      <circle cx="19.5" cy="12.5" r=".9" fill="white" />
      <path d="M15.7 16.5c1.1-1 3.1-1 4.1 0" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function StatIcon({ kind }: { kind: StatKind }) {
  const circleTone = kind === 'rating' || kind === 'genre' ? 'stat-icon-circle-red bg-[#fff2f2]' : 'stat-icon-circle-blue bg-[#f1f6ff]';

  return (
    <span className={`stat-icon-circle flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${circleTone}`}>
      {kind === 'diary' ? <NotebookIcon /> : null}
      {kind === 'watch' ? <CalendarWatchIcon /> : null}
      {kind === 'rating' ? <StarIcon /> : null}
      {kind === 'genre' ? <MasksIcon /> : null}
    </span>
  );
}

export type HomeStatsGridProps = {
  stats: HomeStat[];
};

export function HomeStatsGrid({ stats }: HomeStatsGridProps) {
  return (
    <section className="stats-grid mt-4 grid grid-cols-2 gap-[10px]">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card flex min-h-[76px] items-center gap-3 rounded-[18px] bg-white px-3.5 py-3 shadow-[0_5px_14px_rgba(21,38,69,0.07)] ring-1 ring-[#edf2f8] max-[374px]:gap-2.5 max-[374px]:px-3">
          <StatIcon kind={stat.kind} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-[#243047] leading-[14px]">{stat.label}</p>
            <p className="mt-[4px] whitespace-nowrap text-[21px] font-extrabold leading-[24px] tracking-[-0.03em] text-[#111827] max-[374px]:text-[20px]">
              {stat.value}
              {stat.unit ? <span className="ml-1 align-baseline text-[12px] font-semibold tracking-[-0.015em] text-[#27334a]">{stat.unit}</span> : null}
            </p>
            <p className="mt-[4px] truncate text-[10px] font-semibold leading-[12px] text-[#9aa4b2]">{stat.helper}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
