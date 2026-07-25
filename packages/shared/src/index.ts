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
