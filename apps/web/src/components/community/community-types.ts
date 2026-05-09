export type CommunityTab = 'recommended' | 'popular' | 'following' | 'latest';

export type CommunityTopic = {
  label: string;
  count: number;
};

export type CommunityDiaryCard = {
  id: string;
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  media: {
    id: string;
    title: string;
    releaseYear: string | null;
    posterUrl: string | null;
  };
  diaryTitle: string;
  contentPreview: string;
  rating: number;
  commentCount: number;
  createdAt: string;
};

export type CommunityDiaryDetail = CommunityDiaryCard & {
  content: string;
  watchedDate: string;
  hasSpoiler: boolean;
  media: CommunityDiaryCard['media'] & {
    genreNames: string[];
  };
};

export type CommunityDashboardResponse = {
  tab: CommunityTab;
  topics: CommunityTopic[];
  popularDiaries: CommunityDiaryCard[];
  feed: CommunityDiaryCard[];
};
