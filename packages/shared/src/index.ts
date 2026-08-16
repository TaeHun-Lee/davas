export const DAVAS_APP_NAME = 'Davas';

export type MediaType = 'MOVIE' | 'TV';
export const MEDIA_TYPES = ['MOVIE', 'TV'] as const;
export const VIEWING_METHODS = ['THEATER', 'OTT'] as const;
export type ViewingMethod = (typeof VIEWING_METHODS)[number];
export const DIARY_VISIBILITIES = ['PRIVATE', 'FRIENDS', 'SELECTED'] as const;
export type DiaryVisibility = (typeof DIARY_VISIBILITIES)[number];

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
      status:
        | 'INVALID'
        | 'CANCELLED'
        | 'USED'
        | 'EXPIRED'
        | 'CLOSED'
        | 'ALREADY_MEMBER';
    };

export const WATCH_SOURCE_KINDS = [
  'THEATER',
  'OTT',
  'TV_OWNED',
  'OTHER',
] as const;
export type WatchSourceKind = (typeof WATCH_SOURCE_KINDS)[number];
export type WatchParticipantStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';
export type WatchSourceView = {
  kind: WatchSourceKind;
  providerName?: string | null;
  placeText?: string | null;
};
export type WatchParticipantView = {
  accountId: string;
  status: WatchParticipantStatus;
  nickname?: string;
  requestedAt?: string;
  respondedAt?: string | null;
};
export type WatchReactionView = {
  accountId: string;
  nickname?: string;
  rating: number | null;
  review: string | null;
  updatedAt?: string;
};
export type WatchEventView = {
  id: string;
  media: {
    id: string;
    title: string;
    mediaType: MediaType;
    posterUrl: string | null;
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
  createdAt?: string;
  updatedAt?: string;
  isMine: boolean;
};
export type WatchEventWriteRequest = {
  mediaId: string;
  watchedDate: string;
  spaceIds?: string[];
  participantAccountIds?: string[];
  source?: WatchSourceView;
  rating?: number | null;
  review?: string | null;
};
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
export type RecommendationRewatchPolicy =
  (typeof RECOMMENDATION_REWATCH_POLICIES)[number];
export const RECOMMENDATION_DECISION_RULES = ['ALL', 'MINIMUM'] as const;
export type RecommendationDecisionRule =
  (typeof RECOMMENDATION_DECISION_RULES)[number];
export const RECOMMENDATION_FEEDBACK_KINDS = [
  'INTERESTED',
  'HOLD',
  'REJECTED',
  'ALREADY_WATCHED',
  'AVAILABILITY_ERROR',
  'WATCHED',
] as const;
export type RecommendationFeedbackKind =
  (typeof RECOMMENDATION_FEEDBACK_KINDS)[number];

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
