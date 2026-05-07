"use client";

import { useState } from 'react';
import { MediaPosterItem, MediaPosterRowSection } from '../home/MediaPosterRowSection';
import { SectionTitle } from '../home/SectionTitle';
import { AppShell } from '../layout/AppShell';
import { MediaSearchResults } from '../media/MediaSearchResults';
import { SelectedMediaPanel } from '../media/SelectedMediaPanel';
import { selectMedia, type MediaSearchResult, type SelectedMedia } from '../../lib/api/media';
import { useMediaSearch } from '../../hooks/useMediaSearch';

type GenreTile = {
  title: string;
  gradient: string;
};

type ShortcutTone = 'red' | 'blue';

type Shortcut = {
  label: string;
  icon: 'flame' | 'spark' | 'chart' | 'actor' | 'director' | 'genre';
  tone: ShortcutTone;
};

const filters = ['전체', '영화', '드라마', '배우', '감독', '장르', '평점순'];

const popularWorks: MediaPosterItem[] = [
  { title: '저 먼 우주에서', meta: 'SF · 2023', rating: '4.8', gradient: 'from-[#07111f] via-[#15528e] to-[#b9d9ff]' },
  { title: '비 오는 오후', meta: '로맨스 · 2020', rating: '4.7', gradient: 'from-[#3b4354] via-[#8d6f54] to-[#ffd7a4]' },
  { title: '파도 너머로', meta: '드라마 · 2021', rating: '4.6', gradient: 'from-[#183d64] via-[#4f93bf] to-[#f5d8a8]' },
  { title: '침묵의 문', meta: '스릴러 · 2022', rating: '4.5', gradient: 'from-[#111827] via-[#1e3a5f] to-[#7aa8c7]' },
  { title: '그 해의 여름', meta: '청춘 · 2019', rating: '4.4', gradient: 'from-[#413029] via-[#c27f4e] to-[#ffd69a]' },
];

const genreTiles: GenreTile[] = [
  { title: '비 오는 날 보기 좋은 영화', gradient: 'from-[#1f2937] via-[#526173] to-[#c08b5e]' },
  { title: '몰입감 높은 스릴러', gradient: 'from-[#0f172a] via-[#1e3a5f] to-[#a6c8e7]' },
];

const shortcuts: Shortcut[] = [
  { label: '인기작', icon: 'flame', tone: 'red' },
  { label: '신작', icon: 'spark', tone: 'red' },
  { label: '평점순', icon: 'chart', tone: 'blue' },
  { label: '배우', icon: 'actor', tone: 'blue' },
  { label: '감독', icon: 'director', tone: 'blue' },
  { label: '장르', icon: 'genre', tone: 'blue' },
];

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.8" cy="8.8" r="5.7" stroke="#216BD8" strokeWidth="2" />
      <path d="m13.3 13.3 3.6 3.6" stroke="#216BD8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.1 11.6 2.6 14l2.4-.5 7.2-7.2-1.9-1.9-7.2 7.2Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.5 5.2 1.9 1.9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RecommendationStill() {
  return (
    <div data-design="recommendation-still" className="relative h-[132px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_14px_28px_rgba(20,45,83,0.16)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_70%_8%,rgba(255,255,255,0.55),transparent_8%),linear-gradient(to_top,rgba(7,15,31,0.72),transparent_58%)]" />
      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-end gap-1.5 px-3 pb-3 opacity-75">
        <span className="h-5 w-2 rounded-t bg-[#f2c77e]" />
        <span className="h-8 w-2.5 rounded-t bg-[#d6e7ff]" />
        <span className="h-6 w-2 rounded-t bg-[#f5b46b]" />
        <span className="h-10 w-3 rounded-t bg-[#a8c5e8]" />
        <span className="h-7 w-2.5 rounded-t bg-[#ffd79c]" />
      </div>
      <div className="absolute bottom-5 right-8 h-12 w-8 rounded-full bg-[#17223c] shadow-[0_0_0_8px_rgba(255,255,255,0.08)]" />
    </div>
  );
}

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

export function ExploreDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [isSelectingMedia, setIsSelectingMedia] = useState(false);
  const search = useMediaSearch(searchQuery);
  const isSearchMode = searchQuery.trim().length >= 2;

  async function handleSelectMedia(item: MediaSearchResult) {
    setIsSelectingMedia(true);
    try {
      const media = await selectMedia(item);
      setSelectedMedia(media);
    } finally {
      setIsSelectingMedia(false);
    }
  }

  return (
    <AppShell>
      <div className="card-surface rounded-[18px] px-4 py-3">
        <label className="flex items-center gap-3 text-[13px] font-semibold leading-[18px] text-[#9aa6b8]">
          <SearchIcon />
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedMedia(null);
            }}
            placeholder="영화, 드라마, 배우를 검색해보세요"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold leading-[18px] text-[#1f2a44] placeholder:text-[#9aa6b8] focus:outline-none"
          />
        </label>
      </div>

      <section className="explore-filter-row -mx-1 mt-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        <div className="flex gap-2">
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold leading-[16px] shadow-[0_6px_14px_rgba(31,65,114,0.07)] ${
                index === 0 ? 'bg-[#216bd8] text-white' : 'border border-[#edf2f8] bg-white text-[#59677d]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {isSearchMode ? <MediaSearchResults items={search.items} status={search.status} query={searchQuery} onSelect={handleSelectMedia} /> : null}
      {isSearchMode ? <SelectedMediaPanel media={selectedMedia} isSaving={isSelectingMedia} /> : null}

      {!isSearchMode ? (
        <>
          <SectionTitle title="오늘의 추천" />
          <section data-design="today-recommendation-card" className="today-recommendation-card card-surface rounded-[24px] p-4 shadow-[0_14px_32px_rgba(31,65,114,0.09)]">
            <div className="grid grid-cols-[1.16fr_0.84fr] gap-3 max-[374px]:grid-cols-1">
              <RecommendationStill />
              <div className="flex min-w-0 flex-col py-1 max-[374px]:py-0">
                <h1 className="text-[20px] font-black leading-[25px] tracking-[-0.035em] text-[#172947]">푸른 밤의 기록</h1>
                <p className="mt-1.5 text-[12px] font-bold leading-[16px] text-[#8b96a8]">드라마 · 2023</p>
                <p className="mt-3 text-[12px] font-semibold leading-[18px] text-[#747f91]">잊고 있던 꿈을 다시 마주하게 된 한 사람의 이야기.</p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button className="h-[34px] rounded-full border border-[#e8eef6] bg-white px-3 text-[11px] font-extrabold text-[#536179] shadow-[0_5px_12px_rgba(31,65,114,0.05)]">상세 보기 ›</button>
                  <button className="flex h-[34px] items-center justify-center gap-1.5 rounded-full bg-[#2f7eea] px-3 text-[11px] font-extrabold text-white shadow-[0_8px_18px_rgba(47,126,234,0.26)]"><PencilIcon /> 다이어리 쓰기</button>
                </div>
              </div>
            </div>
            <div className="carousel-indicator mt-3.5 flex justify-center gap-[5px]">
              <span className="h-[5px] w-[22px] rounded-full bg-[#2f7eea]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#dbe5f3]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#dbe5f3]" />
            </div>
          </section>

          <MediaPosterRowSection
            title="지금 많이 찾는 작품"
            items={popularWorks}
            itemClassName="w-[72px]"
            posterClassName="h-[108px] w-[72px] rounded-[15px]"
          />

          <section className="card-surface mt-6 rounded-[24px] p-4">
            <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">장르별 추천</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {genreTiles.map((tile) => (
                <article key={tile.title} className={`relative h-[118px] overflow-hidden rounded-[20px] bg-gradient-to-br ${tile.gradient} p-3 shadow-[0_12px_24px_rgba(17,35,64,0.14)]`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,13,28,0.72),transparent_58%)]" />
                  <h3 className="relative z-10 mt-12 max-w-[112px] text-[14px] font-extrabold leading-[18px] text-white drop-shadow">{tile.title}</h3>
                  <button className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[18px] font-black text-[#216bd8]">›</button>
                </article>
              ))}
            </div>
          </section>

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
        </>
      ) : null}
    </AppShell>
  );
}
