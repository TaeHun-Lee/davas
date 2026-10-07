export const DAVAS_APP_NAME = 'Davas';

export type MediaType = 'MOVIE' | 'TV';
export const MEDIA_TYPES = ['MOVIE', 'TV'] as const;
export const VIEWING_METHODS = ['THEATER', 'OTT'] as const;
export type ViewingMethod = (typeof VIEWING_METHODS)[number];
export const DIARY_VISIBILITIES = ['PRIVATE', 'FRIENDS', 'SELECTED'] as const;
export type DiaryVisibility = (typeof DIARY_VISIBILITIES)[number];
export const CORE_DIARY_VISIBILITIES = ['PRIVATE', 'FRIENDS'] as const;

export const CURRENT_TERMS_VERSION = '2026-07-12-dev';
export const CURRENT_PRIVACY_VERSION = '2026-07-12-dev';

export const FRIENDSHIP_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;
export type FriendshipStatus = (typeof FRIENDSHIP_STATUSES)[number];

export const WATCHLIST_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const;
export type WatchlistPriority = (typeof WATCHLIST_PRIORITIES)[number];
export const WATCHLIST_STATUSES = ['ACTIVE', 'WATCHED'] as const;
export type WatchlistStatus = (typeof WATCHLIST_STATUSES)[number];

export const REACTION_EMOJIS = ['HEART', 'CLAP', 'SMILE', 'TEAR'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export type SpaceRole = 'OWNER' | 'MEMBER';
export type SpaceMembershipStatus = 'ACTIVE' | 'LEFT';
export type SpaceStatus = 'ACTIVE' | 'CLOSED';
export type SpaceMember = {
  accountId: string;
  role: SpaceRole;
  status: SpaceMembershipStatus;
  joinedAt?: string;
  nickname?: string;
  profileImageUrl: string | null;
};
export type SpaceView = {
  id: string;
  name: string;
  status: SpaceStatus;
  maxMembers: number;
  ownerAccountId: string;
  members: SpaceMember[];
  createdAt?: string;
};
export type SpaceInvite = {
  id: string;
  token: string;
  expiresAt: string;
};
export type SpaceInviteInspection =
  | {
      status: 'VALID';
      space: { id: string; name: string };
      inviter: { id: string; nickname: string; profileImageUrl: string | null };
      expiresAt: string;
    }
  | {
      status: 'INVALID' | 'CANCELLED' | 'USED' | 'EXPIRED' | 'CLOSED' | 'ALREADY_MEMBER';
    };

export const WATCH_SOURCE_KINDS = ['THEATER', 'OTT', 'TV_OWNED', 'OTHER'] as const;
export type WatchSourceKind = (typeof WATCH_SOURCE_KINDS)[number];
export const THEATER_FORMATS = ['STANDARD', 'IMAX', 'FOUR_DX', 'DOLBY'] as const;
export type TheaterFormat = (typeof THEATER_FORMATS)[number];
export type WatchParticipantStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';
export type WatchSourceView = {
  kind: WatchSourceKind;
  providerName?: string | null;
  placeText?: string | null;
  /** Theater only. */
  theaterFormat?: TheaterFormat | null;
  seatText?: string | null;
  /** Series only: the last episode watched and, when known, how many there are. */
  episodeWatched?: number | null;
  episodeTotal?: number | null;
  completed?: boolean;
};
export type WatchParticipantView = {
  accountId: string;
  status: WatchParticipantStatus;
  nickname?: string;
  requestedAt?: string;
  respondedAt?: string | null;
};
export const WATCH_HEADLINE_MAX_LENGTH = 40;
export const WATCH_REVIEW_MAX_LENGTH = 2000;
export const WATCH_MEMORY_NOTE_MAX_LENGTH = 1000;
export const WATCH_PHOTO_MAX_COUNT = 10;
export type WatchReactionView = {
  /** Null for a legacy review that only exists on the old diary row. */
  id: string | null;
  accountId: string;
  nickname?: string;
  rating: number | null;
  /** 한줄평 */
  headline: string | null;
  /** 소감 */
  review: string | null;
  hasSpoiler: boolean;
  /** The writer asked to keep it hidden until the viewer writes their own review. */
  isBlind: boolean;
  /** True when it is blind and still hidden from this viewer; content fields are then null. */
  locked: boolean;
  likeCount: number;
  likedByMe: boolean;
  updatedAt?: string;
};
export type WatchPhotoView = {
  id: string;
  width: number;
  height: number;
  /** Tiny blurred preview as a data URL, shown while the real image loads. */
  placeholder: string | null;
  thumbUrl: string;
  displayUrl: string;
  /** Only the uploader can fetch the untouched original. */
  originalUrl: string | null;
  uploaderAccountId: string;
};
export type WatchEventView = {
  id: string;
  media: {
    id: string;
    title: string;
    mediaType: MediaType;
    posterUrl: string | null;
    /** `2024`, from the stored release date; null when TMDB has none. */
    releaseYear?: string | null;
  };
  author: {
    accountId: string;
    nickname?: string;
    profileImageUrl: string | null;
  };
  watchedDate: string;
  visibility: 'PRIVATE' | 'SPACES';
  spaceIds: string[];
  source: WatchSourceView | null;
  participants: WatchParticipantView[];
  reactions: WatchReactionView[];
  /** 추억 메모: a note about the outing, visible to everyone who can see the record. */
  memoryNote: string | null;
  photos: WatchPhotoView[];
  commentCount: number;
  createdAt?: string;
  updatedAt?: string;
  isMine: boolean;
};
export type WatchReactionWriteFields = {
  rating?: number | null;
  headline?: string | null;
  review?: string | null;
  hasSpoiler?: boolean;
  isBlind?: boolean;
};
export type WatchEventWriteRequest = WatchReactionWriteFields & {
  mediaId: string;
  watchedDate: string;
  spaceIds?: string[];
  participantAccountIds?: string[];
  source?: WatchSourceView;
  memoryNote?: string | null;
  /** Photos uploaded beforehand, in display order. Replaces the record's photo list. */
  photoIds?: string[];
};
export type WatchReviewLikeResponse = {
  reactionId: string;
  liked: boolean;
  likeCount: number;
};
export type WatchCommentView = {
  id: string;
  diaryId: string;
  content: string;
  author: { id: string; nickname: string; profileImageUrl: string | null };
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};
export const WATCH_COMMENT_MAX_LENGTH = 500;
export type WatchTimelinePage = {
  items: WatchEventView[];
  hasMore: boolean;
  nextCursor: string | null;
};
export type SpaceReactionComparison = {
  spaceId: string;
  mediaId: string;
  events: Array<{
    watchEventId: string;
    watchedDate: string;
    reactions: WatchReactionView[];
  }>;
};

export const RECOMMENDATION_REWATCH_POLICIES = ['EXCLUDE', 'ALLOW'] as const;
export type RecommendationRewatchPolicy = (typeof RECOMMENDATION_REWATCH_POLICIES)[number];
export const RECOMMENDATION_DECISION_RULES = ['ALL', 'MINIMUM'] as const;
export type RecommendationDecisionRule = (typeof RECOMMENDATION_DECISION_RULES)[number];
export const RECOMMENDATION_FEEDBACK_KINDS = [
  'INTERESTED',
  'HOLD',
  'REJECTED',
  'ALREADY_WATCHED',
  'AVAILABILITY_ERROR',
  'WATCHED',
] as const;
export type RecommendationFeedbackKind = (typeof RECOMMENDATION_FEEDBACK_KINDS)[number];

export type GroupRecommendationSessionRequest = {
  spaceId: string;
  participantAccountIds: string[];
  region: string;
  services: string[];
  contentTypes: MediaType[];
  runtime?: { minMinutes?: number; maxMinutes?: number };
  moodTags?: string[];
  avoidTags?: string[];
  rewatchPolicy: RecommendationRewatchPolicy;
  decisionRule: RecommendationDecisionRule;
  minimumApprovals?: number;
};

export type GroupRecommendationConsensus = {
  status: 'PENDING' | 'MATCHED' | 'REJECTED';
  interestedCount: number;
  respondedCount: number;
  requiredCount: number;
  participantCount: number;
};

export type GroupRecommendationSessionResponse = {
  session: {
    id: string;
    spaceId: string;
    requesterAccountId: string;
    participantAccountIds: string[];
    constraints: Record<string, unknown>;
    algorithmVersion: string;
    status: 'OPEN' | 'MATCHED' | 'CLOSED';
    createdAt?: string;
  };
  items: Array<{
    exposureId: string;
    rank: number;
    content: {
      id: string;
      title?: string;
      mediaType?: MediaType;
      posterUrl: string | null;
      releaseDate: string | null;
      runtime: number | null;
      genres: string[];
    };
    reasons: Array<{
      reasonCode: string;
      params: Record<string, string | string[] | number>;
    }>;
    availability: {
      region: string;
      providers: string[];
      observedAt: string;
      expiresAt: string;
      confidence: number;
    };
    consensus: GroupRecommendationConsensus;
  }>;
  emptyReason: 'NO_HARD_FILTER_MATCHES' | null;
};

export type GroupRecommendationFeedbackRequest = {
  kind: RecommendationFeedbackKind;
  watchEventId?: string;
};

export type GroupRecommendationFeedbackResponse = {
  feedback: {
    exposureId: string;
    kind: RecommendationFeedbackKind;
    watchEventId: string | null;
  };
  consensus: GroupRecommendationConsensus;
};
export * from './contracts.js';

/**
 * Korean OTT services people can say they subscribe to, with the provider names TMDB uses
 * for them in its KR watch-provider data.
 */
export const OTT_SERVICES = [
  { key: 'netflix', label: '넷플릭스', providers: ['Netflix', 'Netflix basic with Ads'] },
  { key: 'tving', label: '티빙', providers: ['TVING'] },
  { key: 'coupang', label: '쿠팡플레이', providers: ['Coupang Play'] },
  { key: 'wavve', label: '웨이브', providers: ['wavve', 'Wavve'] },
  { key: 'disney', label: '디즈니+', providers: ['Disney Plus'] },
  { key: 'watcha', label: '왓챠', providers: ['Watcha'] },
  { key: 'apple', label: 'Apple TV+', providers: ['Apple TV Plus', 'Apple TV+'] },
  { key: 'prime', label: '프라임 비디오', providers: ['Amazon Prime Video'] },
] as const;
export type OttServiceKey = (typeof OTT_SERVICES)[number]['key'];
export const OTT_SERVICE_KEYS = OTT_SERVICES.map((service) => service.key) as OttServiceKey[];

export function ottServiceForProvider(providerName: string): OttServiceKey | null {
  const normalized = providerName.trim().toLowerCase();
  const match = OTT_SERVICES.find((service) =>
    service.providers.some((provider) => provider.toLowerCase() === normalized),
  );
  return match?.key ?? null;
}

export function ottProviderNames(keys: readonly string[]): string[] {
  return OTT_SERVICES.filter((service) => keys.includes(service.key)).flatMap((service) => [
    ...service.providers,
  ]);
}

export const WISH_MOODS = ['LIGHT', 'IMMERSIVE', 'TEARS', 'CHILLS'] as const;
export type WishMood = (typeof WISH_MOODS)[number];

/**
 * The moods a group recommendation offers, each standing for the TMDB genres (Korean names)
 * that carry it. The server matches a mood tag through these genres; any other tag, such as
 * one typed into "제외 조건", is read as a genre name.
 */
export const RECOMMENDATION_MOOD_GENRES: Record<string, readonly string[]> = {
  가벼운: ['코미디', '애니메이션', '가족', '음악'],
  따뜻한: ['가족', '로맨스', '드라마', '애니메이션'],
  긴장감: ['스릴러', '미스터리', '범죄', '공포'],
  웃긴: ['코미디'],
  몰입감: ['액션', '모험', '액션 & 어드벤처', 'SF', 'SF & 판타지', '판타지', '미스터리'],
  잔잔한: ['드라마', '다큐멘터리', '로맨스'],
};
export const RECOMMENDATION_MOODS = Object.keys(RECOMMENDATION_MOOD_GENRES);

export type SpaceWishItem = {
  media: {
    id: string;
    title: string;
    mediaType: MediaType;
    posterUrl: string | null;
    releaseYear: string | null;
    genres: string[];
  };
  wantedBy: Array<{ accountId: string; nickname?: string }>;
  /** Every active member of the space added it. */
  wantedByAll: boolean;
  wantedByMe: boolean;
  /** Someone in the space shared a record of it after it was added. */
  watched: boolean;
  availability: {
    state: 'AVAILABLE' | 'NO_OFFERS' | 'UNKNOWN';
    /** Subscription services it streams on, as OTT_SERVICES keys. */
    services: OttServiceKey[];
    /** Streams on a service someone in the space subscribes to. */
    onSpaceServices: boolean;
  };
  addedAt: string;
};

export type SpaceWishList = { items: SpaceWishItem[] };

export type SpaceWishPick = {
  item: SpaceWishItem | null;
  /** Why it was picked, as short Korean phrases for the card. */
  reasons: string[];
  remaining: number;
};

/** "우리 기록 모아보기" for one space and year. */
export type SpaceMemories = {
  year: number;
  totals: { records: number; movies: number; series: number; photos: number };
  genres: Array<{ name: string; count: number }>;
  sources: { theater: number; ott: number; other: number };
  /** Records watched on today's month and day in earlier years, newest first. */
  onThisDay: Array<{
    watchEventId: string;
    title: string;
    posterUrl: string | null;
    watchedDate: string;
    yearsAgo: number;
    sourceKind: WatchSourceKind | null;
    photoCount: number;
    coverPhoto: WatchPhotoView | null;
  }>;
  /** Series the space is part-way through, from each series' latest record. */
  inProgress: Array<{
    watchEventId: string;
    mediaId: string;
    title: string;
    posterUrl: string | null;
    episodeWatched: number;
    episodeTotal: number | null;
    providerName: string | null;
    watchedDate: string;
  }>;
};

/** Where the viewer is up to in a series, from their latest record of it. */
export type WatchProgress = {
  mediaId: string;
  episodeWatched: number | null;
  episodeTotal: number | null;
  completed: boolean;
  providerName: string | null;
  sourceKind: WatchSourceKind | null;
  watchedDate: string;
};
