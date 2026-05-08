"use client";

function SpoilerIcon() {
  return <span className="grid size-6 place-items-center rounded-full bg-[#fff1f0] text-[13px] font-black text-[#ff5a52]">!</span>;
}

function GlobeIcon() {
  return <span className="text-[16px]" aria-hidden="true">🌐</span>;
}

function TagIcon() {
  return <span className="text-[16px]" aria-hidden="true">🏷️</span>;
}

export function DiaryOptionRow({
  containsSpoiler,
  onToggleSpoiler,
  visibility,
  onChangeVisibility,
  tags,
}: {
  containsSpoiler: boolean;
  onToggleSpoiler: () => void;
  visibility: 'PUBLIC' | 'PRIVATE';
  onChangeVisibility: (visibility: 'PUBLIC' | 'PRIVATE') => void;
  tags: string[];
}) {
  return (
    <section className="grid grid-cols-3 gap-2">
      <button type="button" onClick={onToggleSpoiler} className="flex items-center justify-center gap-2 rounded-[18px] bg-white px-2 py-3 text-[11px] font-extrabold text-[#59677d] shadow-[0_10px_22px_rgba(31,65,114,0.06)]">
        <SpoilerIcon />
        스포일러 포함
        <span className={`ml-auto h-5 w-9 rounded-full p-0.5 transition ${containsSpoiler ? 'bg-[#ff5a52]' : 'bg-[#d8e0ec]'}`}>
          <span className={`block size-4 rounded-full bg-white transition ${containsSpoiler ? 'translate-x-4' : ''}`} />
        </span>
      </button>
      <label className="flex items-center justify-center gap-2 rounded-[18px] bg-white px-2 py-3 text-[11px] font-extrabold text-[#59677d] shadow-[0_10px_22px_rgba(31,65,114,0.06)]">
        <GlobeIcon />
        <select value={visibility} onChange={(event) => onChangeVisibility(event.target.value as 'PUBLIC' | 'PRIVATE')} className="bg-transparent font-extrabold outline-none">
          <option value="PUBLIC">공개</option>
          <option value="PRIVATE">비공개</option>
        </select>
      </label>
      <button type="button" className="flex items-center justify-center gap-2 rounded-[18px] bg-white px-2 py-3 text-[11px] font-extrabold text-[#59677d] shadow-[0_10px_22px_rgba(31,65,114,0.06)]">
        <TagIcon />
        {tags.length > 0 ? `${tags.length}개 태그` : '태그 추가'}
        <span aria-hidden="true">⌄</span>
      </button>
    </section>
  );
}
