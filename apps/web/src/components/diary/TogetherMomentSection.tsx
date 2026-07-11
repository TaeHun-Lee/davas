'use client';

import { useState } from 'react';

export type CompanionInput = { userId?: string; displayName: string };

export function TogetherMomentSection({ companions, onChangeCompanions, friendOptions = [], watchedPlace, onChangeWatchedPlace, mood, onChangeMood, memoryNote, onChangeMemoryNote }: { companions: CompanionInput[]; onChangeCompanions: (items: CompanionInput[]) => void; friendOptions?: Array<{ id: string; nickname: string }>; watchedPlace: string; onChangeWatchedPlace: (value: string) => void; mood: string; onChangeMood: (value: string) => void; memoryNote: string; onChangeMemoryNote: (value: string) => void }) {
  const [name, setName] = useState('');
  const moods = ['즐거웠어요', '뭉클했어요', '긴장했어요', '또 보고 싶어요'];
  function addName() { const displayName = name.trim(); if (!displayName || companions.some((item) => item.displayName === displayName)) return; onChangeCompanions([...companions, { displayName }]); setName(''); }
  return <section className="card-surface rounded-[22px] p-4" aria-labelledby="together-title">
    <h2 id="together-title" className="text-[15px] font-black text-[#1f2a44]">함께 본 순간 <span className="text-[11px] text-[#6b778c]">선택</span></h2>
    <label className="mt-4 block text-[12px] font-extrabold text-[#526078]">같이 본 사람</label>
    {friendOptions.length ? <div className="mt-2 flex flex-wrap gap-2" aria-label="친구에서 선택">{friendOptions.filter((friend) => !companions.some((item) => item.userId === friend.id)).map((friend) => <button key={friend.id} type="button" onClick={() => onChangeCompanions([...companions, { userId: friend.id, displayName: friend.nickname }])} className="min-h-11 rounded-full bg-[#f4f6fa] px-3 text-[12px] font-bold text-[#52677e]">+ {friend.nickname}</button>)}</div> : null}
    <div className="mt-2 flex gap-2"><input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addName(); } }} placeholder="친구 또는 이름" className="min-h-11 min-w-0 flex-1 rounded-[14px] border border-[#cdd8e6] px-3 text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#216bd8]" /><button type="button" onClick={addName} className="min-h-11 rounded-[14px] bg-[#284778] px-4 text-[12px] font-black text-white">추가</button></div>
    {companions.length ? <ul className="mt-2 flex flex-wrap gap-2">{companions.map((item) => <li key={`${item.userId ?? 'name'}-${item.displayName}`}><button type="button" onClick={() => onChangeCompanions(companions.filter((x) => x !== item))} aria-label={`${item.displayName} 삭제`} className="min-h-11 rounded-full bg-[#eef5ff] px-3 text-[12px] font-bold text-[#216bd8]">{item.displayName} ×</button></li>)}</ul> : null}
    <label className="mt-4 block text-[12px] font-extrabold text-[#526078]">장소<input value={watchedPlace} onChange={(event) => onChangeWatchedPlace(event.target.value)} maxLength={160} className="mt-2 min-h-11 w-full rounded-[14px] border border-[#cdd8e6] px-3 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#216bd8]" placeholder="집, 영화관, 여행지" /></label>
    <fieldset className="mt-4"><legend className="text-[12px] font-extrabold text-[#526078]">분위기</legend><div className="mt-2 flex flex-wrap gap-2">{moods.map((item) => <button key={item} type="button" aria-pressed={mood === item} onClick={() => onChangeMood(mood === item ? '' : item)} className={`min-h-11 rounded-full px-3 text-[11px] font-black ${mood === item ? 'bg-[#216bd8] text-white' : 'bg-[#eef3f8] text-[#526078]'}`}>{item}</button>)}</div></fieldset>
    <label className="mt-4 block text-[12px] font-extrabold text-[#526078]">추억 메모<textarea value={memoryNote} onChange={(event) => onChangeMemoryNote(event.target.value)} maxLength={1000} rows={3} className="mt-2 w-full rounded-[14px] border border-[#cdd8e6] p-3 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#216bd8]" placeholder="그날만의 기억을 짧게 남겨보세요" /></label>
  </section>;
}
