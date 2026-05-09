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
    isFollowed: boolean;
    isMine: boolean;
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
  hasSpoiler: boolean;
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

export type CommunityComment = {
  id: string;
  diaryId: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};

export type CommunityCommentsResponse = {
  diaryId: string;
  items: CommunityComment[];
};

export type CommunityDashboardResponse = {
  tab: CommunityTab;
  topics: CommunityTopic[];
  popularDiaries: CommunityDiaryCard[];
  feed: CommunityDiaryCard[];
  topic?: string;
};
