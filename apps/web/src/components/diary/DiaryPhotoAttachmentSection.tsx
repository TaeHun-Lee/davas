function PhotoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="15" rx="5" stroke="#2f7eea" strokeWidth="1.8" />
      <path d="m7 16 3.2-3.2 2.6 2.6 1.7-1.7L18 17" stroke="#ff5a52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16.5" cy="9.5" r="1.4" fill="#2f7eea" />
    </svg>
  );
}

export function DiaryPhotoAttachmentSection() {
  return (
    <section className="flex items-center justify-between gap-3 rounded-[22px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-[#eef5ff]"><PhotoIcon /></span>
        <span className="min-w-0">
          <span className="block text-[14px] font-black text-[#1f2a44]">사진 첨부</span>
          <span className="mt-1 block text-[11px] font-bold leading-[16px] text-[#8b96a8]">감상 순간을 사진으로 함께 남겨보세요. JPG, PNG 최대 5장</span>
        </span>
      </div>
      <button type="button" className="shrink-0 rounded-full bg-[#eef5ff] px-4 py-2 text-[12px] font-extrabold text-[#2f7eea]">추가</button>
    </section>
  );
}
