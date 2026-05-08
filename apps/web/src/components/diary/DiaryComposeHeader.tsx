"use client";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11.3 4.1 6.4 9l4.9 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DiaryComposeHeader({ onBack, onSaveDraft }: { onBack?: () => void; onSaveDraft?: () => void }) {
  return (
    <header className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-[#f5f8fc]/95 px-5 py-3 backdrop-blur">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="grid size-10 place-items-center rounded-full bg-white text-[#1f2a44] shadow-[0_8px_20px_rgba(31,65,114,0.08)]"
      >
        <BackIcon />
      </button>
      <h1 className="text-[17px] font-black tracking-[-0.03em] text-[#1f2a44]">리뷰 다이어리 작성</h1>
      <button
        type="button"
        onClick={onSaveDraft}
        className="rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#748197] shadow-[0_8px_20px_rgba(31,65,114,0.07)]"
      >
        임시저장
      </button>
    </header>
  );
}
