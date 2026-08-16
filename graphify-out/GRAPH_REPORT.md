# Graph Report - davas  (2026-08-16)

## Corpus Check
- 383 files · ~117,015 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2832 nodes · 5441 edges · 203 communities (176 shown, 27 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe455481`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentEntity
- UsersController
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- watch-events.service.ts
- SpacesController
- community.service.ts
- UserEntity
- FriendsService
- InviteCodeEntity
- RecordComposer.tsx
- app.module.ts
- DiaryCompanionEntity
- FriendInvitesController
- TmdbClient
- AppShell.tsx
- ProfileDashboard.tsx
- DiaryRecentListSection.tsx
- getApiBaseUrl
- NotificationsService
- SpaceMembershipEntity
- scripts
- DiariesController
- RecommendationExposureEntity
- CreateDiaryDto
- MediaSelectionService
- SearchField.tsx
- invites.module.ts
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- PersonCreditResults.tsx
- RecommendationSessionEntity
- DiariesDashboardService
- ExploreDashboard.tsx
- recommendations.ts
- scripts
- AuthController
- AuthService
- auth.ts
- metadata-provider.port.ts
- WatchEventsService
- DiaryAccessService
- devDependencies
- ReactionsController
- MediaController
- WatchEventDetailScreen.tsx
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- MediaDetailModal.tsx
- MediaEntity
- compilerOptions
- group-recommendation-model.ts
- compilerOptions
- shared/package.json
- SpacesService
- group-recommendations.service.ts
- community.ts
- diary-dashboard-types.ts
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- media.ts
- reactions.ts
- WatchSourceEntity
- Davas 추천 전략 상세 설계
- WatchEventsController
- GroupRecommendationsService
- media.service.ts
- compilerOptions
- NotificationsController
- compilerOptions
- auth.service.ts
- media.service.spec.ts
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- HomeDashboard.tsx
- AvailabilityService
- DiaryDashboard.tsx
- WatchlistItemEntity
- FriendshipEntity
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- spaces.ts
- RecordScreens.tsx
- middleware.ts
- core.ts
- diaries-dashboard.service.ts
- DiaryLikeEntity
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- RecommendationsController
- tailwind.config.ts
- backup.sh
- UserFollowEntity
- @nestjs/platform-express
- typeorm
- reactions.service.ts
- spaces.service.ts
- GroupRecommendationsController
- product/README.md
- tmdb-detail.mapper.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- FileCleanupJobEntity
- UpdateDiaryDto
- media.controller.ts
- SpaceWatchController
- AuthUi.tsx
- DiaryReactionEntity
- UsersService
- SpaceInvitesController
- FakeRepository
- HomeStatsGrid.tsx
- recommendations.service.ts
- DiaryEntity
- InviteUseEntity
- users.service.ts
- UserConsentEntity
- FakeLifecycleDataSource
- FriendInviteEntity
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- users.controller.ts
- @nestjs/passport
- NotificationEntity
- diary/[id]/page.tsx
- TogetherMomentSection.tsx
- 포함
- tmdb.mapper.ts
- TransactionOutboxService
- 9. 구현 순서
- notifications.service.ts
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- .constructor
- availability.service.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- .uploadProfileImage
- ApiPropertyOptional
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- class-transformer
- IsBoolean
- IsEmail
- 13. 테스트 전략
- NotificationPreferenceEntity
- Res

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 85 edges
2. `DiaryEntity` - 84 edges
3. `getApiBaseUrl()` - 59 edges
4. `AuthService` - 55 edges
5. `MediaEntity` - 54 edges
6. `WatchEventsService` - 30 edges
7. `WatchReactionEntity` - 28 edges
8. `SpaceMembershipEntity` - 27 edges
9. `NotificationsService` - 27 edges
10. `SpaceEntity` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts
- `CommentEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/diary.entity.ts
- `DiaryCompanionEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/diary-companion.entity.ts → apps/api/src/database/entities/diary.entity.ts
- `DiaryEntity` --references--> `MediaEntity`  [EXTRACTED]
  apps/api/src/database/entities/diary.entity.ts → apps/api/src/database/entities/media.entity.ts

## Import Cycles
- None detected.

## Communities (203 total, 27 thin omitted)

### Community 0 - "CommentEntity"
Cohesion: 0.07
Nodes (28): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+20 more)

### Community 1 - "UsersController"
Cohesion: 0.18
Nodes (12): ApiTags, Body, Controller, Delete, Get, Param, Patch, Req (+4 more)

### Community 2 - "WatchlistService"
Cohesion: 0.10
Nodes (20): Body, Controller, Delete, Get, Param, Patch, Post, Query (+12 more)

### Community 3 - "diary-compose-utils.ts"
Cohesion: 0.16
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "src/index.ts"
Cohesion: 0.08
Nodes (29): WatchParticipant, WatchReaction, WatchSource, DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, MEDIA_TYPES (+21 more)

### Community 6 - "watch-events.service.ts"
Cohesion: 0.17
Nodes (23): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+15 more)

### Community 7 - "SpacesController"
Cohesion: 0.26
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 8 - "community.service.ts"
Cohesion: 0.08
Nodes (30): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+22 more)

### Community 9 - "UserEntity"
Cohesion: 0.10
Nodes (16): FakeUserRepository, RecommendationSessionStatus, SpaceStatus, SpaceMembershipRole, SpaceMembershipStatus, Column, CreateDateColumn, DeleteDateColumn (+8 more)

### Community 10 - "FriendsService"
Cohesion: 0.12
Nodes (14): FriendsController, Body, Controller, Delete, Get, Param, Patch, Post (+6 more)

### Community 11 - "InviteCodeEntity"
Cohesion: 0.18
Nodes (10): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.12
Nodes (12): DiaryEditPageProps, DiaryNewPageProps, Draft, freshDraft(), RecordComposer(), sourceLabels, today(), WATCH_RATINGS (+4 more)

### Community 13 - "app.module.ts"
Cohesion: 0.10
Nodes (29): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+21 more)

### Community 14 - "DiaryCompanionEntity"
Cohesion: 0.12
Nodes (16): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+8 more)

### Community 15 - "FriendInvitesController"
Cohesion: 0.29
Nodes (6): FriendInvitesController, Controller, Get, Param, Post, Req

### Community 16 - "TmdbClient"
Cohesion: 0.19
Nodes (5): imageUrl(), TmdbClient, Inject, Injectable, Optional

### Community 17 - "AppShell.tsx"
Cohesion: 0.10
Nodes (13): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, DavasHeader() (+5 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "DiaryRecentListSection.tsx"
Cohesion: 0.12
Nodes (18): DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps, CalendarDayStateInput, cn(), getCalendarDayState() (+10 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.14
Nodes (27): EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload (+19 more)

### Community 21 - "NotificationsService"
Cohesion: 0.25
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 22 - "SpaceMembershipEntity"
Cohesion: 0.08
Nodes (28): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+20 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.17
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.09
Nodes (21): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+13 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "MediaSelectionService"
Cohesion: 0.12
Nodes (9): selection, Optional, MediaSelectionService, FakeMediaRepository, interstellarSelection, SavedMedia, Injectable, InjectRepository (+1 more)

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "invites.module.ts"
Cohesion: 0.09
Nodes (19): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+11 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.14
Nodes (14): 10. 후속 범위, 11. 출시 전 체크, 1. 제품 목표, 2. 제품 원칙, 4. 핵심 흐름, 5. 도메인 모델, 6. 권한과 데이터 생명주기, 7. 추천 원칙 (+6 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-validator, @davas/shared, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "DiariesService"
Cohesion: 0.17
Nodes (9): media, payload, apiError(), assertNotFuture(), DiariesService, DiaryListQuery, fingerprint(), normalizedCreate() (+1 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.09
Nodes (20): ProviderOffer, DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+12 more)

### Community 34 - "PersonCreditResults.tsx"
Cohesion: 0.14
Nodes (14): getTmdbGenreNames(), TMDB_MOVIE_GENRES, TMDB_TV_GENRES, MediaDetailLoadingIndicator(), MediaDetailLoadingIndicatorProps, GenreTags(), MediaSearchResults(), formatCreditMeta() (+6 more)

### Community 35 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "ExploreDashboard.tsx"
Cohesion: 0.13
Nodes (15): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), GenreRecommendationSection(), GenreRecommendationSectionProps (+7 more)

### Community 38 - "recommendations.ts"
Cohesion: 0.10
Nodes (28): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, useExploreRecommendations(), RequestStatus, createGroupRecommendationSession(), fetchRecommendation() (+20 more)

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 42 - "auth.ts"
Cohesion: 0.09
Nodes (24): CommentAvatar(), drawerItems, DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen(), ProfileHeaderCard(), ProfileHeaderCardProps (+16 more)

### Community 43 - "metadata-provider.port.ts"
Cohesion: 0.15
Nodes (9): TmdbMetadataAdapter, Injectable, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse, CatalogTitleDetail, CatalogTitleRef, METADATA_PROVIDER (+1 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.19
Nodes (3): response(), Injectable, WatchEventsService

### Community 45 - "DiaryAccessService"
Cohesion: 0.11
Nodes (15): Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchShareEntity, DiaryAccessService (+7 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsController"
Cohesion: 0.21
Nodes (9): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+1 more)

### Community 48 - "MediaController"
Cohesion: 0.17
Nodes (9): MediaController, ApiTags, Body, Controller, Get, Param, Post, Query (+1 more)

### Community 49 - "WatchEventDetailScreen.tsx"
Cohesion: 0.17
Nodes (18): Poster(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), SpaceTimeline(), compareSpaceReactions(), createWatchEvent() (+10 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.27
Nodes (4): MediaRecommendationItem, GENRE_PRESETS, RecommendationsService, Injectable

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.22
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "MediaDetailModal.tsx"
Cohesion: 0.19
Nodes (8): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), useFocusTrap(), MediaDetail

### Community 55 - "MediaEntity"
Cohesion: 0.05
Nodes (45): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+37 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "group-recommendation-model.ts"
Cohesion: 0.19
Nodes (16): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+8 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "SpacesService"
Cohesion: 0.23
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (37): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+29 more)

### Community 63 - "diary-dashboard-types.ts"
Cohesion: 0.11
Nodes (20): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiarySummary, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps (+12 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+1 more)

### Community 67 - "media.ts"
Cohesion: 0.15
Nodes (15): getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, usePeopleSearch(), getMediaDetail(), getPersonCredits(), MediaSearchResponse, MyMediaDiary (+7 more)

### Community 68 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 69 - "WatchSourceEntity"
Cohesion: 0.16
Nodes (9): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity, FakeDatabase (+1 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "WatchEventsController"
Cohesion: 0.22
Nodes (10): Body, Controller, Delete, Get, Param, Patch, Post, Put (+2 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.21
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "media.service.ts"
Cohesion: 0.12
Nodes (12): buildContentPreview(), FavoriteMediaItem, FavoriteMediaResponse, formatWatchedDate(), MediaDetailResponse, MediaFavoriteResponse, MediaService, MyMediaDiary (+4 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "NotificationsController"
Cohesion: 0.21
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.13
Nodes (16): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, SignupDto (+8 more)

### Community 79 - "main.ts"
Cohesion: 0.29
Nodes (4): AppModule, Module, ApiExceptionFilter, Catch

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.22
Nodes (8): Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Editing Boundaries, Graphify, Repository Map, Scope, Validation

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.15
Nodes (13): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈, 5. 식별자와 공통 저장 규칙 (+5 more)

### Community 82 - "HomeDashboard.tsx"
Cohesion: 0.21
Nodes (13): AuthenticatedLanding(), MeResponse, DiaryDashboardView, FavoriteMovie, FavoriteMoviesSection(), buildCalendarDays(), buildHomeDashboardView(), formatRating() (+5 more)

### Community 84 - "DiaryDashboard.tsx"
Cohesion: 0.20
Nodes (16): DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten(), sortByWatchedDate() (+8 more)

### Community 85 - "WatchlistItemEntity"
Cohesion: 0.15
Nodes (10): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+2 more)

### Community 86 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 87 - "Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘, Source Nodes

### Community 88 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 89 - "media-selection-api.spec.ts"
Cohesion: 0.29
Nodes (5): availabilityDtoSource, controllerSource, dtoSource, moduleSource, watchlistControllerSource

### Community 90 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, InstallEvent, PwaStatus()

### Community 91 - "Q: 적당하게 AGNETS.md 작성해"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 적당하게 AGNETS.md 작성해, Source Nodes

### Community 92 - "Raspberry Pi DuckDNS deployment"
Cohesion: 0.33
Nodes (6): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment

### Community 93 - "spaces.ts"
Cohesion: 0.12
Nodes (25): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, acceptSpaceInvite(), cancelSpaceInvite() (+17 more)

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.11
Nodes (19): AsyncState(), CoreAppShell(), MediaTypeControl(), RecordCard(), SearchField(), tabs, TaskShell(), ViewingMethodControl() (+11 more)

### Community 98 - "core.ts"
Cohesion: 0.21
Nodes (13): ApiErrorBody, coreFetch(), createRecord(), CursorPage, deleteRecord(), getRecord(), listRecords(), query() (+5 more)

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.22
Nodes (10): buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts() (+2 more)

### Community 100 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 118 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Controller, Get, Param, Query

### Community 135 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 139 - "reactions.service.ts"
Cohesion: 0.26
Nodes (4): CreateReactionDto, IsIn, ReactionsService, Injectable

### Community 140 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.27
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 143 - "tmdb-detail.mapper.ts"
Cohesion: 0.25
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 148 - "FileCleanupJobEntity"
Cohesion: 0.33
Nodes (5): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 151 - "UpdateDiaryDto"
Cohesion: 0.18
Nodes (11): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+3 more)

### Community 152 - "media.controller.ts"
Cohesion: 0.09
Nodes (22): ApiPropertyOptional, AvailabilityQueryDto, IsOptional, Matches, MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt (+14 more)

### Community 153 - "SpaceWatchController"
Cohesion: 0.29
Nodes (6): SpaceWatchController, Controller, Get, Param, Query, Req

### Community 154 - "AuthUi.tsx"
Cohesion: 0.14
Nodes (9): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION (+1 more)

### Community 155 - "DiaryReactionEntity"
Cohesion: 0.20
Nodes (9): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 156 - "UsersService"
Cohesion: 0.23
Nodes (3): ALLOWED_PROFILE_IMAGE_TYPES, Injectable, UsersService

### Community 157 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 159 - "HomeStatsGrid.tsx"
Cohesion: 0.20
Nodes (4): HomeStat, HomeStatsGrid(), HomeStatsGridProps, StatKind

### Community 160 - "recommendations.service.ts"
Cohesion: 0.22
Nodes (4): GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, FakeTmdbClient

### Community 161 - "DiaryEntity"
Cohesion: 0.07
Nodes (32): DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne (+24 more)

### Community 162 - "InviteUseEntity"
Cohesion: 0.25
Nodes (8): InviteUseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 163 - "users.service.ts"
Cohesion: 0.15
Nodes (5): FakeJwtService, FakeOutbox, FakeUserRepository, SavedUser, UserProfileResponse

### Community 164 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 166 - "FriendInviteEntity"
Cohesion: 0.15
Nodes (13): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+5 more)

### Community 167 - "typeorm.config.ts"
Cohesion: 0.06
Nodes (15): BaseSchema1720670300000, HighValueFlows1720670400000, CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, SpacesMembershipInvites1720670700000, WatchEventsAndPersonalReactions1720670800000, CanonicalCatalogAvailability1720670900000, AccountLifecycleNotificationOutbox1720671000000 (+7 more)

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "users.controller.ts"
Cohesion: 0.24
Nodes (7): CancelDeletionDto, IsString, Length, DeleteMeDto, IsString, Length, IsEmail

### Community 173 - "NotificationEntity"
Cohesion: 0.14
Nodes (10): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 175 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 178 - "포함"
Cohesion: 0.25
Nodes (8): 3. MVP, 개인정보, 계정과 공간, 공유 경험, 작품과 감상 기록, 제외, 추천, 포함

### Community 183 - "tmdb.mapper.ts"
Cohesion: 0.48
Nodes (5): DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult(), TmdbSearchResult

### Community 184 - "TransactionOutboxService"
Cohesion: 0.32
Nodes (4): TransactionOutboxService, Injectable, InjectRepository, Optional

### Community 185 - "9. 구현 순서"
Cohesion: 0.29
Nodes (7): 0. 정책과 공급자 검증, 1. 계정과 공간, 2. 카탈로그와 감상 기록, 3. 공유 경험, 4. 추천 MVP, 5. 운영과 비공개 베타, 9. 구현 순서

### Community 186 - "notifications.service.ts"
Cohesion: 0.22
Nodes (8): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsIn, UpdateNotificationPreferenceDto, CommunityNotificationView, CreateNotificationInput, IsBoolean

### Community 187 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 188 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 191 - "availability.service.ts"
Cohesion: 0.09
Nodes (17): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS (+9 more)

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 193 - ".uploadProfileImage"
Cohesion: 0.29
Nodes (4): Post, ProfileImageFile, UploadedFile, UseInterceptors

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.17
Nodes (9): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료, Davas 문서 (+1 more)

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 200 - "13. 테스트 전략"
Cohesion: 0.50
Nodes (4): 13. 테스트 전략, 도메인 단위 테스트, 종단 간 테스트, 통합 테스트

### Community 201 - "NotificationPreferenceEntity"
Cohesion: 0.17
Nodes (11): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

## Knowledge Gaps
- **559 isolated node(s):** `Scope`, `Repository Map`, `Graphify`, `Code Intelligence Routing`, `Editing Boundaries` (+554 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `WatchEventsService` (2× useful, score=1.986900763)
- `api/package.json` (2× useful, score=1.796350837)
- `web/package.json` (2× useful, score=1.796350837)
- `shared/package.json` (2× useful, score=1.796350837)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsController` to `src/index.ts`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsController` to `reactions.service.ts`, `app.module.ts`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `CommentEntity`, `watch-events.service.ts`, `community.service.ts`, `UserEntity`, `reactions.service.ts`, `app.module.ts`, `DiaryCompanionEntity`, `RecommendationExposureEntity`, `DiaryReactionEntity`, `DiariesService`, `DiariesDashboardService`, `typeorm.config.ts`, `WatchEventsService`, `NotificationEntity`, `DiaryAccessService`, `MediaEntity`, `group-recommendations.service.ts`, `diaries.dashboard.spec.ts`, `WatchSourceEntity`, `media.service.ts`, `diaries-dashboard.service.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `Scope`, `Repository Map`, `Graphify` to the rest of the system?**
  _559 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.06612244897959184 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._