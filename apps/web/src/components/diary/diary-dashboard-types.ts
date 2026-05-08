export type DiaryFilterTab = '전체' | '최근' | '평점순' | '캘린더';

export type DiarySummary = {
  totalCount: number;
  monthlyCount: number;
  averageRating: number;
  topGenre: { name: string; count: number } | null;
};

export type DiaryGenreRatio = {
  genre: string;
  count: number;
  percentage: number;
  iconKind: 'sf' | 'drama' | 'thriller' | 'action' | 'etc';
};

export type DiaryCalendarMarker = {
  day: number;
  count: number;
};

export type DiaryCalendarDay = {
  key: string;
  day: number;
  currentMonth: boolean;
  selected: boolean;
  today: boolean;
  entryCount: number;
};

export type DiaryListItemView = {
  id: string;
  mediaId: string;
  mediaTitle: string;
  diaryTitle: string;
  watchedDate: string;
  rating: number;
  contentPreview: string;
  posterUrl?: string | null;
  posterGradient: string;
  genreNames: string[];
  isBookmarked?: boolean;
};
