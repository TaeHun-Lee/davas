type ShortcutTone = 'red' | 'blue';

type Shortcut = {
  label: string;
  icon: 'flame' | 'spark' | 'chart' | 'actor' | 'director' | 'genre';
  tone: ShortcutTone;
};

const shortcuts: Shortcut[] = [
  { label: '인기작', icon: 'flame', tone: 'red' },
  { label: '신작', icon: 'spark', tone: 'red' },
  { label: '평점순', icon: 'chart', tone: 'blue' },
  { label: '배우', icon: 'actor', tone: 'blue' },
  { label: '감독', icon: 'director', tone: 'blue' },
  { label: '장르', icon: 'genre', tone: 'blue' },
];

function ShortcutIcon({ icon, tone }: { icon: Shortcut['icon']; tone: ShortcutTone }) {
  const color = tone === 'red' ? '#EF4444' : '#216BD8';

  if (icon === 'flame') {
    return <span className="text-[18px] leading-none text-[#ef4444]">●</span>;
  }

  if (icon === 'spark') {
    return <span className="text-[18px] leading-none text-[#ef4444]">✦</span>;
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {icon === 'chart' ? <path d="M4 14V9M10 14V5M16 14v-7" stroke={color} strokeWidth="2.2" strokeLinecap="round" /> : null}
      {icon === 'actor' ? <><circle cx="10" cy="7" r="3" stroke={color} strokeWidth="2" /><path d="M4.5 16c.9-3.4 2.8-5 5.5-5s4.6 1.6 5.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" /></> : null}
      {icon === 'director' ? <><path d="M5 15V5h8.5A2.5 2.5 0 0 1 16 7.5v5A2.5 2.5 0 0 1 13.5 15H5Z" stroke={color} strokeWidth="2" /><path d="M5 9.5h11" stroke={color} strokeWidth="2" /></> : null}
      {icon === 'genre' ? <><rect x="4" y="6" width="12" height="9" rx="2" stroke={color} strokeWidth="2" /><path d="m7 5 2 3M12 5l2 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" /></> : null}
    </svg>
  );
}

export function ExploreShortcutGrid() {
  return (
    <section className="mt-6">
      <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">탐색 바로가기</h2>
      <div className="quick-explore-grid mt-3 grid grid-cols-3 gap-3">
        {shortcuts.map((shortcut) => (
          <button key={shortcut.label} className="flex h-[72px] flex-col items-center justify-center gap-1 rounded-[18px] bg-white text-[12px] font-extrabold text-[#42506a] shadow-[0_8px_20px_rgba(31,65,114,0.075)] ring-1 ring-[#edf2f8]">
            <ShortcutIcon icon={shortcut.icon} tone={shortcut.tone} />
            <span>{shortcut.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
