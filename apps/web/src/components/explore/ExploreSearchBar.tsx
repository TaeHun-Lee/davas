type ExploreSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.8" cy="8.8" r="5.7" stroke="#216BD8" strokeWidth="2" />
      <path d="m13.3 13.3 3.6 3.6" stroke="#216BD8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ExploreSearchBar({ value, onChange }: ExploreSearchBarProps) {
  return (
    <div className="card-surface rounded-[18px] px-4 py-3">
      <label className="flex items-center gap-3 text-[13px] font-semibold leading-[18px] text-[#9aa6b8]">
        <SearchIcon />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="영화, 드라마, 배우를 검색해보세요"
          className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold leading-[18px] text-[#1f2a44] placeholder:text-[#9aa6b8] focus:outline-none"
        />
      </label>
    </div>
  );
}
