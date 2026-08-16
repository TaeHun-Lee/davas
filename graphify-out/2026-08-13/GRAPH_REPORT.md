# Graph Report - davas  (2026-08-13)

## Corpus Check
- 363 files · ~108,697 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2716 nodes · 5354 edges · 175 communities (149 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbff59c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- DiaryComposeScreen.tsx
- devDependencies
- auth.ts
- availability.service.ts
- DiaryShareEntity
- community.service.ts
- UserEntity
- FriendsService
- .findMe
- media.ts
- entities/index.ts
- FriendInviteEntity
- FriendInvitesService
- RecordComposer
- AppShell.tsx
- ProfileDashboard.tsx
- HomeDashboard.tsx
- getApiBaseUrl
- NotificationsService
- DiaryRecentListSection.tsx
- scripts
- DiariesController
- RecommendationExposureEntity
- CreateDiaryDto
- media.controller.ts
- SearchField.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- diaries.service.ts
- tmdb.client.ts
- ExploreDashboard.tsx
- src/index.ts
- DiariesDashboardService
- SpaceEntity
- recommendations.ts
- scripts
- AuthController
- AuthService
- typeorm.config.ts
- media.service.ts
- WatchEventsService
- DiaryEntity
- devDependencies
- ReactionsService
- MediaController
- community.ts
- MediaHeroCarousel.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- MediaDetailModal.tsx
- MediaEntity
- compilerOptions
- DiaryDashboard.tsx
- compilerOptions
- shared/package.json
- SpacesController
- group-recommendations.service.ts
- DiaryAccessService
- diary-dashboard-types.ts
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- ExternalContentRefEntity
- DiaryReactions.tsx
- tmdb-detail.mapper.ts
- Davas 추천 전략 상세 설계
- HomeStatsGrid.tsx
- GroupRecommendationsService
- MediaService
- compilerOptions
- FriendshipEntity
- compilerOptions
- auth.service.ts
- CommentEntity
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- spaces.ts
- AvailabilityService
- BaseSchema1720670300000
- me/page.tsx
- SpacesService
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- space-ui.ts
- RecordScreens.tsx
- middleware.ts
- CoreRecordContract1720670500000
- diaries-dashboard.service.ts
- AuthUi.tsx
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- tailwind.config.ts
- backup.sh
- spaces.service.ts
- @nestjs/platform-express
- typeorm
- AvailabilityObservationEntity
- UsersService
- GroupRecommendationsController
- product/README.md
- SpaceInvitesController
- InviteCodeEntity
- auth.service.spec.ts
- TransactionOutboxEntity
- RecommendationSessionEntity
- UserFollowEntity
- MediaSearchQueryDto
- 4. 핵심 도메인 모델
- users.service.ts
- 14. 단계별 확장
- users.service.spec.ts
- 5. 기능 요구사항
- FakeRepository
- TransactionOutboxService
- MediaPosterRowSection.tsx
- 포함
- 9. 구현 순서
- FileCleanupJobEntity
- FakeLifecycleDataSource
- 4. 핵심 사용자 흐름
- class-validator
- SpacesMembershipInvites1720670700000
- WatchEventsAndPersonalReactions1720670800000
- AccountLifecycleNotificationOutbox1720671000000
- GroupRecommendationSessions1720671100000
- TodayRecommendationSection.tsx
- @nestjs/passport
- HealthController
- 7. 비기능 요구사항

## God Nodes (most connected - your core abstractions)
1. `DiaryEntity` - 87 edges
2. `UserEntity` - 86 edges
3. `getApiBaseUrl()` - 60 edges
4. `MediaEntity` - 56 edges
5. `AuthService` - 55 edges
6. `SpaceMembershipEntity` - 33 edges
7. `WatchEventsService` - 33 edges
8. `WatchReactionEntity` - 28 edges
9. `NotificationsService` - 27 edges
10. `SpaceEntity` - 26 edges

## Surprising Connections (you probably didn't know these)
- `toCommunityDiaryDetail()` --indirect_call--> `resolveTmdbGenreLabel()`  [INFERRED]
  apps/api/src/community/community.service.ts → apps/api/src/media/tmdb-genres.ts
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `AvailabilityObservationEntity` --references--> `MediaEntity`  [EXTRACTED]
  apps/api/src/database/entities/availability-observation.entity.ts → apps/api/src/database/entities/media.entity.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts
- `CommentEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/diary.entity.ts

## Import Cycles
- None detected.

## Communities (175 total, 26 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.14
Nodes (13): CommentsController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+5 more)

### Community 1 - "UsersController"
Cohesion: 0.16
Nodes (14): ApiTags, Body, Controller, Delete, Get, Param, Patch, Post (+6 more)

### Community 2 - "WatchlistService"
Cohesion: 0.10
Nodes (20): Body, Controller, Delete, Get, Param, Patch, Post, Query (+12 more)

### Community 3 - "DiaryComposeScreen.tsx"
Cohesion: 0.07
Nodes (22): DiaryEditPageProps, DiaryNewPageProps, clampRating(), isValidDateInput(), mapMediaDetailToDiaryMedia(), ratingFromPointer(), todayIsoDate(), validateDiaryCompose() (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "auth.ts"
Cohesion: 0.09
Nodes (25): CommentAvatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen() (+17 more)

### Community 6 - "availability.service.ts"
Cohesion: 0.08
Nodes (18): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS (+10 more)

### Community 7 - "DiaryShareEntity"
Cohesion: 0.09
Nodes (18): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+10 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+18 more)

### Community 9 - "UserEntity"
Cohesion: 0.06
Nodes (30): FakeUserRepository, DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+22 more)

### Community 10 - "FriendsService"
Cohesion: 0.12
Nodes (14): FriendsController, Body, Controller, Delete, Get, Param, Patch, Post (+6 more)

### Community 11 - ".findMe"
Cohesion: 0.20
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 12 - "media.ts"
Cohesion: 0.16
Nodes (14): getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, usePeopleSearch(), getPersonCredits(), MediaSearchResponse, MyMediaDiary, PersonCreditsResponse (+6 more)

### Community 13 - "entities/index.ts"
Cohesion: 0.10
Nodes (28): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+20 more)

### Community 14 - "FriendInviteEntity"
Cohesion: 0.11
Nodes (18): InjectRepository, Optional, FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+10 more)

### Community 15 - "FriendInvitesService"
Cohesion: 0.15
Nodes (11): FriendInvitesController, Controller, Get, Param, Post, Req, error(), FriendInvitesService (+3 more)

### Community 16 - "RecordComposer"
Cohesion: 0.33
Nodes (3): freshDraft(), RecordComposer(), today()

### Community 17 - "AppShell.tsx"
Cohesion: 0.07
Nodes (23): DiaryDetailPageProps, DetailStatus, DiaryDetailScreen(), AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem (+15 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "HomeDashboard.tsx"
Cohesion: 0.19
Nodes (14): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+6 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.20
Nodes (21): EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), getMe(), getApiBaseUrl(), acceptFriend(), acceptFriendInvite() (+13 more)

### Community 21 - "NotificationsService"
Cohesion: 0.06
Nodes (32): NotificationEntity, NotificationType, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+24 more)

### Community 22 - "DiaryRecentListSection.tsx"
Cohesion: 0.16
Nodes (13): DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps, CalendarDayStateInput, cn(), getCalendarDayState() (+5 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.17
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.08
Nodes (22): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+14 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "media.controller.ts"
Cohesion: 0.09
Nodes (18): selection, AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSelectionDto, ApiProperty, ApiPropertyOptional (+10 more)

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "InvitesService"
Cohesion: 0.10
Nodes (17): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+9 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.14
Nodes (14): 10. 후속 범위, 11. 출시 전 체크, 1. 제품 목표, 2. 제품 원칙, 4. 핵심 흐름, 5. 도메인 모델, 6. 권한과 데이터 생명주기, 7. 추천 원칙 (+6 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-transformer, @davas/shared, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "diaries.service.ts"
Cohesion: 0.18
Nodes (9): media, payload, apiError(), assertNotFuture(), DiariesService, DiaryListQuery, fingerprint(), normalizedCreate() (+1 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.07
Nodes (29): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+21 more)

### Community 34 - "ExploreDashboard.tsx"
Cohesion: 0.12
Nodes (22): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+14 more)

### Community 35 - "src/index.ts"
Cohesion: 0.07
Nodes (26): DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, GroupRecommendationConsensus, GroupRecommendationFeedbackRequest, GroupRecommendationFeedbackResponse, GroupRecommendationSessionRequest (+18 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "SpaceEntity"
Cohesion: 0.09
Nodes (21): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+13 more)

### Community 38 - "recommendations.ts"
Cohesion: 0.13
Nodes (20): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus (+12 more)

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 41 - "AuthService"
Cohesion: 0.17
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "typeorm.config.ts"
Cohesion: 0.38
Nodes (3): CanonicalCatalogAvailability1720670900000, statements(), createTypeOrmOptions()

### Community 43 - "media.service.ts"
Cohesion: 0.13
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (45): WatchParticipantStatus, WatchSourceKind, CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn (+37 more)

### Community 45 - "DiaryEntity"
Cohesion: 0.05
Nodes (48): DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne (+40 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (13): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+5 more)

### Community 48 - "MediaController"
Cohesion: 0.16
Nodes (9): MediaController, ApiTags, Body, Controller, Get, Param, Post, Query (+1 more)

### Community 49 - "community.ts"
Cohesion: 0.07
Nodes (37): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+29 more)

### Community 50 - "MediaHeroCarousel.tsx"
Cohesion: 0.19
Nodes (9): ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems(), actionClass(), MediaHeroCarousel(), MediaHeroCarouselAction, MediaHeroCarouselItem (+1 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.12
Nodes (16): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 6. 기본 정책 (+8 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Controller, Get, Param, Query, GENRE_PRESETS (+6 more)

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.22
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "MediaDetailModal.tsx"
Cohesion: 0.21
Nodes (7): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), MediaDetail

### Community 55 - "MediaEntity"
Cohesion: 0.06
Nodes (38): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+30 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "DiaryDashboard.tsx"
Cohesion: 0.20
Nodes (16): DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten(), sortByWatchedDate() (+8 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "SpacesController"
Cohesion: 0.24
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (25): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+17 more)

### Community 62 - "DiaryAccessService"
Cohesion: 0.09
Nodes (15): InjectRepository, Optional, InjectRepository, Optional, DiaryReactionEntity, Column, CreateDateColumn, Entity (+7 more)

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
Cohesion: 0.09
Nodes (20): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+12 more)

### Community 67 - "ExternalContentRefEntity"
Cohesion: 0.12
Nodes (14): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+6 more)

### Community 68 - "DiaryReactions.tsx"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 69 - "tmdb-detail.mapper.ts"
Cohesion: 0.22
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "HomeStatsGrid.tsx"
Cohesion: 0.20
Nodes (4): HomeStat, HomeStatsGrid(), HomeStatsGridProps, StatKind

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.23
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "MediaService"
Cohesion: 0.10
Nodes (6): Optional, buildContentPreview(), formatWatchedDate(), MediaService, FakeTmdbClient, Injectable

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "FriendshipEntity"
Cohesion: 0.13
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 78 - "CommentEntity"
Cohesion: 0.11
Nodes (13): AuthenticatedRequest, CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+5 more)

### Community 79 - "main.ts"
Cohesion: 0.29
Nodes (4): AppModule, Module, ApiExceptionFilter, Catch

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.22
Nodes (8): Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Editing Boundaries, Graphify, Repository Map, Scope, Validation

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "spaces.ts"
Cohesion: 0.32
Nodes (14): coreFetch(), acceptSpaceInvite(), cancelSpaceInvite(), closeSpace(), createSpace(), createSpaceInvite(), getSpace(), inspectSpaceInvite() (+6 more)

### Community 85 - "me/page.tsx"
Cohesion: 0.17
Nodes (3): FeedScreen(), MineScreen(), SearchScreen()

### Community 86 - "SpacesService"
Cohesion: 0.26
Nodes (4): hashToken(), response(), SpacesService, Injectable

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
Cohesion: 0.12
Nodes (13): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment, Davas Docker 실행 가이드, TypeORM 설정 (+5 more)

### Community 93 - "space-ui.ts"
Cohesion: 0.19
Nodes (8): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, SpaceInviteInspection, SpaceView

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.11
Nodes (32): AsyncState(), CoreAppShell(), MediaTypeControl(), Poster(), RecordCard(), SearchField(), tabs, TaskShell() (+24 more)

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 100 - "AuthUi.tsx"
Cohesion: 0.14
Nodes (9): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION (+1 more)

### Community 135 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 139 - "AvailabilityObservationEntity"
Cohesion: 0.25
Nodes (8): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 140 - "UsersService"
Cohesion: 0.23
Nodes (3): ALLOWED_PROFILE_IMAGE_TYPES, Injectable, UsersService

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.27
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 143 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 144 - "InviteCodeEntity"
Cohesion: 0.11
Nodes (18): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+10 more)

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 148 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 151 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 152 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 153 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 154 - "users.service.ts"
Cohesion: 0.19
Nodes (10): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ProfileImageFile (+2 more)

### Community 155 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 156 - "users.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeJwtService, FakeOutbox, SavedUser

### Community 157 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 159 - "TransactionOutboxService"
Cohesion: 0.28
Nodes (4): TransactionOutboxService, Injectable, InjectRepository, Optional

### Community 160 - "MediaPosterRowSection.tsx"
Cohesion: 0.24
Nodes (8): FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, MediaPosterItem, MediaPosterRowSection(), MediaPosterRowSectionProps, SectionTitle(), SectionTitleProps

### Community 161 - "포함"
Cohesion: 0.25
Nodes (8): 3. MVP, 개인정보, 계정과 공간, 공유 경험, 작품과 감상 기록, 제외, 추천, 포함

### Community 162 - "9. 구현 순서"
Cohesion: 0.29
Nodes (7): 0. 정책과 공급자 검증, 1. 계정과 공간, 2. 카탈로그와 감상 기록, 3. 공유 경험, 4. 추천 MVP, 5. 운영과 비공개 베타, 9. 구현 순서

### Community 163 - "FileCleanupJobEntity"
Cohesion: 0.33
Nodes (5): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 165 - "4. 핵심 사용자 흐름"
Cohesion: 0.40
Nodes (5): 4.1 공간 시작, 4.2 감상 기록, 4.3 공유 감상 확인, 4.4 함께 볼 작품 선택, 4. 핵심 사용자 흐름

### Community 171 - "TodayRecommendationSection.tsx"
Cohesion: 0.47
Nodes (4): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps

### Community 173 - "HealthController"
Cohesion: 0.40
Nodes (3): HealthController, Controller, Get

### Community 174 - "7. 비기능 요구사항"
Cohesion: 0.50
Nodes (4): 7. 비기능 요구사항, 보안과 개인정보, 성능과 접근성, 신뢰성

## Knowledge Gaps
- **522 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+517 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `api/package.json` (2× useful, score=1.94703153)
- `web/package.json` (2× useful, score=1.94703153)
- `shared/package.json` (2× useful, score=1.94703153)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsService` to `entities/index.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `diaries.service.ts`, `diaries.dashboard.spec.ts`, `diaries-dashboard.service.ts`, `DiariesDashboardService`, `DiaryShareEntity`, `community.service.ts`, `UserEntity`, `typeorm.config.ts`, `media.service.ts`, `WatchEventsService`, `entities/index.ts`, `CommentEntity`, `NotificationsService`, `MediaEntity`, `RecommendationExposureEntity`, `group-recommendations.service.ts`, `DiaryAccessService`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _522 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.13756613756613756 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `DiaryComposeScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07171717171717172 - nodes in this community are weakly interconnected._