import { SearchField } from '../common/SearchField';

type ExploreSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ExploreSearchBar({ value, onChange }: ExploreSearchBarProps) {
  return <SearchField value={value} onChange={onChange} placeholder="영화, 드라마, 배우를 검색해보세요" />;
}
