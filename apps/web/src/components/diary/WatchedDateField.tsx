function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="12" height="11" rx="3" stroke="#8b96a8" strokeWidth="1.6" />
      <path d="M6 2.8v3M12 2.8v3M4.2 7.5h9.6" stroke="#8b96a8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function WatchedDateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-[22px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
      <span className="text-[14px] font-black text-[#1f2a44]">관람 날짜</span>
      <span className="mt-3 flex items-center gap-3 rounded-[18px] bg-[#f6f9fd] px-4 py-3">
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-extrabold text-[#2f415f] outline-none"
        />
        <CalendarIcon />
      </span>
    </label>
  );
}
