type CommunitySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="2" />
      <path d="m15.2 15.2 4.3 4.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CommunitySearchBar({ value, onChange }: CommunitySearchBarProps) {
  return (
    <label className="mb-4 flex h-[52px] items-center rounded-[20px] bg-white px-4 text-[#8e9aaf] shadow-[0_10px_26px_rgba(31,65,114,0.08)]">
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="다른 사람들의 다이어리를 검색해보세요"
        className="min-w-0 flex-1 bg-transparent px-3 text-[13px] font-bold text-[#1f2a44] outline-none placeholder:text-[#9aa6b8]"
      />
      <span className="mr-3 h-6 w-px bg-[#e5ebf4]" aria-hidden="true" />
      <span className="text-[#8e9aaf]" aria-hidden="true">
        <FilterIcon />
      </span>
    </label>
  );
}
