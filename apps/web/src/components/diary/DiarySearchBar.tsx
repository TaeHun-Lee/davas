import { SearchField } from '../common/SearchField';

type DiarySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DiarySearchBar({ value, onChange }: DiarySearchBarProps) {
  return (
    <SearchField
      value={value}
      onChange={onChange}
      placeholder="다이어리 제목이나 영화 제목으로 검색해보세요"
      className="mt-4"
    />
  );
}
