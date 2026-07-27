import type { DiaryVisibility, FriendshipStatus, MediaType, ViewingMethod } from './index.js';

export type CoreDiaryVisibility = Exclude<DiaryVisibility, 'SELECTED'>;

export type ApiErrorBody = {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
  preferredGenres: string[];
};

export type MeResponse = { user: AuthenticatedUser };
export type UserResponse = { user: AuthenticatedUser };
export type LogoutResponse = { ok: boolean };
export type DeleteResult = { id: string; deleted: true };
export type AccountDeletionResponse = void;

export type UpdateMeInput = {
  nickname?: string;
  bio?: string | null;
  preferredGenres?: string[];
};

export type RecordAuthor = {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
};

export type RecordMedia = {
  id: string;
  title: string;
  originalTitle: string | null;
  posterUrl: string | null;
  releaseYear: string | null;
  mediaType: MediaType;
};

export type RecordCardData = {
  id: string;
  author: RecordAuthor;
  media: RecordMedia;
  viewingMethod: ViewingMethod | null;
  watchedDate: string;
  rating: number | null;
  reviewPreview: string | null;
  hasSpoiler: boolean;
  visibility: DiaryVisibility;
  sharedAt: string | null;
  createdAt: string;
  isMine: boolean;
};

export type RecordDetailData = RecordCardData & {
  content: string;
  updatedAt: string;
  selectedUserIds?: string[];
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type RecordFilters = {
  q?: string;
  mediaType?: MediaType;
  viewingMethod?: ViewingMethod;
  cursor?: string;
  limit?: number;
};

export type RecordCreateInput = {
  mediaId: string;
  viewingMethod: ViewingMethod;
  watchedDate: string;
  rating?: number | null;
  content?: string;
  hasSpoiler?: boolean;
  visibility?: CoreDiaryVisibility;
  clientRequestId: string;
  allowDuplicate?: boolean;
};

export type RecordUpdateInput = Partial<
  Pick<
    RecordCreateInput,
    'mediaId' | 'viewingMethod' | 'watchedDate' | 'rating' | 'content' | 'hasSpoiler' | 'visibility'
  >
>;

export const MEDIA_SEARCH_TYPES = ['movie', 'tv', 'multi'] as const;
export type MediaSearchType = (typeof MEDIA_SEARCH_TYPES)[number];

export type MediaSearchRequest = {
  q?: string;
  query?: string;
  type?: MediaSearchType;
  page?: number;
  language?: string;
  region?: string;
};

export type MediaSearchResult = {
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  genreIds: number[];
  country: string | null;
};

export type MediaSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: MediaSearchResult[];
};

export type MediaSelectionInput = Pick<
  MediaSearchResult,
  'externalProvider' | 'externalId' | 'mediaType'
>;

export type MediaSelectionResponse = {
  id: string;
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: MediaType;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  shortPlot: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  tagline: string | null;
  releaseDate: string | null;
  genres: string[];
  country: string | null;
  countries: string[];
  runtime: number | null;
  tmdbRating: string | null;
  tmdbVoteCount: number | null;
  director: string | null;
  creators: string[];
  cast: string[];
  certification: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SelectedMedia = MediaSelectionResponse;

export type MyMediaDiary = {
  id: string;
  rating: number;
  title: string;
  contentPreview: string;
  watchedDate: string;
  updatedAt: string;
};

export type MediaDetail = {
  id: string;
  externalProvider: string;
  externalId: string;
  mediaType: MediaType;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  tagline: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  country: string | null;
  countries: string[];
  tmdbRating: number | null;
  tmdbVoteCount: number | null;
  director: string | null;
  creators: string[];
  numberOfEpisodes: number | null;
  numberOfSeasons: number | null;
  cast: string[];
  stillCuts: string[];
  certification: string | null;
  myDiary: MyMediaDiary | null;
  myDiaries: MyMediaDiary[];
  myAverageRating: number | null;
  watchlistItemId: string | null;
  watchlistStatus: 'ACTIVE' | 'WATCHED' | null;
};

export type FriendRelationship = 'NONE' | 'FRIEND' | 'SENT' | 'RECEIVED';

export type FriendUser = {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  relationship?: FriendRelationship;
  requestId?: string | null;
};

export type FriendRow = {
  id: string;
  status: FriendshipStatus;
  direction: 'SENT' | 'RECEIVED';
  user: FriendUser;
};

export type FriendshipMutationResponse = {
  id: string;
  pairKey: string;
  requesterId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
};

export type FriendsResponse = {
  friends: FriendRow[];
  received: FriendRow[];
  sent: FriendRow[];
};

export type FriendInviteState = {
  status: 'VALID' | 'EXPIRED' | 'SELF' | 'ALREADY_FRIENDS';
  inviter?: FriendUser;
  expiresAt?: string;
};
