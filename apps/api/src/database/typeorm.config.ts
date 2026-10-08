import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  AvailabilityObservationEntity,
  CommentEntity,
  DiaryCompanionEntity,
  DiaryEntity,
  DiaryLikeEntity,
  DiaryReactionEntity,
  DiaryShareEntity,
  FileCleanupJobEntity,
  ExternalContentRefEntity,
  FriendInviteEntity,
  FriendshipEntity,
  InviteCodeEntity,
  InviteUseEntity,
  MediaEntity,
  MediaFavoriteEntity,
  MediaImageEntity,
  NotificationEntity,
  NotificationPreferenceEntity,
  RecommendationExposureEntity,
  RecommendationFeedbackEntity,
  RecommendationSessionEntity,
  SpaceEntity,
  SpaceInviteEntity,
  SpaceMembershipEntity,
  SpaceWishEntity,
  UserConsentEntity,
  UserEntity,
  UserFollowEntity,
  WatchlistItemEntity,
  WatchParticipantEntity,
  WatchPhotoEntity,
  WatchReactionEntity,
  WatchReviewLikeEntity,
  WatchShareEntity,
  WatchSourceEntity,
  TransactionOutboxEntity,
} from './entities';
import { BaseSchema1720670300000 } from './migrations/1720670300000-BaseSchema';
import { HighValueFlows1720670400000 } from './migrations/1720670400000-HighValueFlows';
import { CoreRecordContract1720670500000 } from './migrations/1720670500000-CoreRecordContract';
import { FriendInvitesAndConsents1720670600000 } from './migrations/1720670600000-FriendInvitesAndConsents';
import { SpacesMembershipInvites1720670700000 } from './migrations/1720670700000-SpacesMembershipInvites';
import { WatchEventsAndPersonalReactions1720670800000 } from './migrations/1720670800000-WatchEventsAndPersonalReactions';
import { CanonicalCatalogAvailability1720670900000 } from './migrations/1720670900000-CanonicalCatalogAvailability';
import { AccountLifecycleNotificationOutbox1720671000000 } from './migrations/1720671000000-AccountLifecycleNotificationOutbox';
import { GroupRecommendationSessions1720671100000 } from './migrations/1720671100000-GroupRecommendationSessions';
import { MediaCanonicalIdentity1720670700000 } from './migrations/1720670700000-MediaCanonicalIdentity';
import { CoreQueryIndexes1720670800000 } from './migrations/1720670800000-CoreQueryIndexes';
import { FeedIndexSharedAtPredicate1720670900000 } from './migrations/1720670900000-FeedIndexSharedAtPredicate';
import { LegacyTmdbImageSafety1720671000000 } from './migrations/1720671000000-LegacyTmdbImageSafety';
import { DropLegacyMediaIdentityIndex1720671100000 } from './migrations/1720671100000-DropLegacyMediaIdentityIndex';
import { RecordExperience1720671200000 } from './migrations/1720671200000-RecordExperience';
import { SpaceWishesAndSubscriptions1720671300000 } from './migrations/1720671300000-SpaceWishesAndSubscriptions';
import { NotificationSubjects1720671400000 } from './migrations/1720671400000-NotificationSubjects';
import { AccountRecoveryAndInviteDeclines1720671500000 } from './migrations/1720671500000-AccountRecoveryAndInviteDeclines';
import { ExternalContentRefMediaType1720671600000 } from './migrations/1720671600000-ExternalContentRefMediaType';
import { RecommendationSessionDecision1720671700000 } from './migrations/1720671700000-RecommendationSessionDecision';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'davas',
    entities: [
      UserEntity,
      UserConsentEntity,
      FileCleanupJobEntity,
      UserFollowEntity,
      FriendshipEntity,
      FriendInviteEntity,
      InviteCodeEntity,
      InviteUseEntity,
      MediaEntity,
      ExternalContentRefEntity,
      AvailabilityObservationEntity,
      MediaImageEntity,
      MediaFavoriteEntity,
      WatchlistItemEntity,
      DiaryEntity,
      DiaryCompanionEntity,
      DiaryShareEntity,
      DiaryLikeEntity,
      DiaryReactionEntity,
      CommentEntity,
      NotificationEntity,
      NotificationPreferenceEntity,
      RecommendationSessionEntity,
      RecommendationExposureEntity,
      RecommendationFeedbackEntity,
      SpaceEntity,
      SpaceMembershipEntity,
      SpaceInviteEntity,
      SpaceWishEntity,
      WatchParticipantEntity,
      WatchReactionEntity,
      WatchSourceEntity,
      WatchShareEntity,
      WatchPhotoEntity,
      WatchReviewLikeEntity,
      TransactionOutboxEntity,
    ],
    migrations: [
      BaseSchema1720670300000,
      HighValueFlows1720670400000,
      CoreRecordContract1720670500000,
      FriendInvitesAndConsents1720670600000,
      // Two release lines reused the same timestamps. Production applied the remediation
      // set first (ledger ids 5-9) and the TO-BE set second (10-14); both sets are
      // idempotent and independent, so TypeORM's stable timestamp sort may interleave them
      // on a fresh database. Never rename these classes: the ledger matches by name.
      MediaCanonicalIdentity1720670700000,
      SpacesMembershipInvites1720670700000,
      CoreQueryIndexes1720670800000,
      WatchEventsAndPersonalReactions1720670800000,
      FeedIndexSharedAtPredicate1720670900000,
      CanonicalCatalogAvailability1720670900000,
      LegacyTmdbImageSafety1720671000000,
      AccountLifecycleNotificationOutbox1720671000000,
      DropLegacyMediaIdentityIndex1720671100000,
      GroupRecommendationSessions1720671100000,
      RecordExperience1720671200000,
      SpaceWishesAndSubscriptions1720671300000,
      NotificationSubjects1720671400000,
      AccountRecoveryAndInviteDeclines1720671500000,
      ExternalContentRefMediaType1720671600000,
      RecommendationSessionDecision1720671700000,
    ],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}
