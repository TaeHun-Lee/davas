export function DiaryTitleField({ value, fallbackTitle, onChange }: { value: string; fallbackTitle: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-[22px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
      <span className="text-[14px] font-black text-[#1f2a44]">다이어리 제목</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={fallbackTitle}
        maxLength={80}
        className="mt-3 w-full rounded-[18px] bg-[#f6f9fd] px-4 py-3 text-[15px] font-extrabold text-[#2f415f] outline-none placeholder:text-[#a1acba]"
      />
    </label>
  );
}
