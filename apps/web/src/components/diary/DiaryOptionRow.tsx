"use client";

function SpoilerIcon() {
  return <span className="grid size-6 place-items-center rounded-full bg-[#fff1f0] text-[13px] font-black text-[#ff5a52]">!</span>;
}

function GlobeIcon() {
  return <span className="text-[16px]" aria-hidden="true">🌐</span>;
}

export function DiaryOptionRow({
  containsSpoiler,
  onToggleSpoiler,
  visibility,
  onChangeVisibility,
}: {
  containsSpoiler: boolean;
  onToggleSpoiler: () => void;
  visibility: 'PRIVATE' | 'FRIENDS' | 'SELECTED';
  onChangeVisibility: (visibility: 'PRIVATE' | 'FRIENDS' | 'SELECTED') => void;
}) {
  return (
    <section className="grid grid-cols-2 gap-2">
      <button type="button" onClick={onToggleSpoiler} className="flex min-w-0 items-center justify-start gap-2 rounded-[18px] bg-white px-3 py-3 text-[11px] font-extrabold text-[#59677d] shadow-[0_10px_22px_rgba(31,65,114,0.06)]">
        <SpoilerIcon />
        <span className="whitespace-nowrap">스포일러 포함</span>
        <span className={`ml-auto h-5 w-9 shrink-0 overflow-hidden rounded-full p-0.5 transition ${containsSpoiler ? 'bg-[#ff5a52]' : 'bg-[#d8e0ec]'}`}>
          <span className={`block size-4 rounded-full bg-white transition ${containsSpoiler ? 'translate-x-[14px]' : ''}`} />
        </span>
      </button>
      <label className="flex min-w-0 items-center justify-center gap-2 rounded-[18px] bg-white px-3 py-3 text-[11px] font-extrabold text-[#59677d] shadow-[0_10px_22px_rgba(31,65,114,0.06)]">
        <GlobeIcon />
        <select aria-label="공개 범위" value={visibility} onChange={(event) => onChangeVisibility(event.target.value as 'PRIVATE' | 'FRIENDS' | 'SELECTED')} className="min-h-11 min-w-0 bg-transparent font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216bd8]">
          <option value="PRIVATE">나만 보기</option>
          <option value="FRIENDS">친구 공개</option>
          <option value="SELECTED">선택한 친구</option>
        </select>
      </label>
    </section>
  );
}
