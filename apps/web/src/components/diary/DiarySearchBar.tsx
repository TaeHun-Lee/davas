type DiarySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DiarySearchBar({ value, onChange }: DiarySearchBarProps) {
  return (
    <label className="mt-4 flex h-[52px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_12px_30px_rgba(31,42,68,0.07)]">
      <span aria-hidden="true" className="text-[20px] text-[#216bd8]">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="다이어리 제목이나 영화 제목으로 검색해보세요"
        className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#1f2a44] outline-none placeholder:text-[#a2acba]"
      />
    </label>
  );
}
