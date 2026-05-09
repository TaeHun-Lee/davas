import { SearchField } from '../common/SearchField';

type CommunitySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function FilterIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CommunitySearchBar({ value, onChange }: CommunitySearchBarProps) {
  return (
    <SearchField
      value={value}
      onChange={onChange}
      placeholder="다른 사람들의 다이어리를 검색해보세요"
      className="mb-4"
      inputClassName="font-bold"
      trailingDivider
      trailing={<FilterIcon />}
    />
  );
}
