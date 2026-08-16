# Graph Report - davas  (2026-08-16)

## Corpus Check
- 386 files · ~118,230 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2845 nodes · 5615 edges · 191 communities (167 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 176 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e22c8861`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- CommentEntity
- SpacesService
- community.service.ts
- UserEntity
- FriendsController
- InviteUseEntity
- RecordComposer.tsx
- diaries.module.ts
- media.ts
- recommendations.ts
- TmdbClient
- AppShell.tsx
- ProfileDashboard.tsx
- MediaPosterRowSection.tsx
- friends.ts
- NotificationsService
- SpaceMembershipEntity
- scripts
- DiariesController
- WatchReactionEntity
- CreateDiaryDto
- media-selection.service.spec.ts
- SearchField.tsx
- invites.module.ts
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- ExploreDashboard.tsx
- RecommendationSessionEntity
- DiariesDashboardService
- MediaDetailModal.tsx
- HomeRecommendations.tsx
- scripts
- AuthController
- AuthService
- auth.ts
- media.service.ts
- WatchEventsService
- DiaryEntity
- devDependencies
- ReactionsService
- MediaController
- watch-events.ts
- MediaHeroCarousel.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- AvailabilityObservationEntity
- MediaEntity
- compilerOptions
- ExternalContentRefEntity
- compilerOptions
- shared/package.json
- group-recommendation-model.ts
- group-recommendations.service.ts
- community.ts
- DiaryDashboard.tsx
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- InviteCodeEntity
- getApiBaseUrl
- WatchSourceEntity
- Davas 추천 전략 상세 설계
- DiaryInsightGrid.tsx
- GroupRecommendationsService
- users.service.spec.ts
- compilerOptions
- NotificationsController
- compilerOptions
- auth.service.ts
- MediaService
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- HomeDashboard.tsx
- AvailabilityService
- FriendInviteEntity
- logout
- DiaryComposeScreen.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- coreFetch
- core.ts
- middleware.ts
- availability.service.spec.ts
- diaries-dashboard.service.ts
- MediaSelectionDto
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- FriendsService
- tailwind.config.ts
- backup.sh
- media.service.spec.ts
- @nestjs/platform-express
- typeorm
- friends.controller.ts
- reactions.ts
- GroupRecommendationsController
- product/README.md
- diary-dashboard-types.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- users.service.ts
- 5. 기능 요구사항
- MediaSearchQueryDto
- TodayRecommendationSection.tsx
- AuthUi.tsx
- DiarySummarySection.tsx
- UsersService
- 4. 핵심 사용자 흐름
- FakeRepository
- 7. 비기능 요구사항
- 13. 테스트 전략
- Q: Can Davas be deployed and verified on Raspberry Pi?
- FakeLifecycleDataSource
- FriendInvitesService
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- users.controller.ts
- @nestjs/passport
- NotificationEntity
- diary/[id]/page.tsx
- TogetherMomentSection.tsx
- Q: What are the current Davas core functions and how are they delivered?
- TransactionOutboxService
- notifications.controller.ts
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- availability.service.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- class-transformer
- NotificationPreferenceEntity

## God Nodes (most connected - your core abstractions)
1. `DiaryEntity` - 87 edges
2. `UserEntity` - 86 edges
3. `getApiBaseUrl()` - 61 edges
4. `MediaEntity` - 56 edges
5. `AuthService` - 55 edges
6. `WatchEventsService` - 30 edges
7. `WatchReactionEntity` - 28 edges
8. `coreFetch()` - 28 edges
9. `SpaceMembershipEntity` - 27 edges
10. `NotificationsService` - 27 edges

## Surprising Connections (you probably didn't know these)
- `toCommunityDiaryDetail()` --indirect_call--> `resolveTmdbGenreLabel()`  [INFERRED]
  apps/api/src/community/community.service.ts → apps/api/src/media/tmdb-genres.ts
- `AvailabilityObservationEntity` --references--> `MediaEntity`  [EXTRACTED]
  apps/api/src/database/entities/availability-observation.entity.ts → apps/api/src/database/entities/media.entity.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts
- `CommentEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/diary.entity.ts
- `CommentEntity` --references--> `UserEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/user.entity.ts

## Import Cycles
- None detected.

## Communities (191 total, 24 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.13
Nodes (14): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.13
Nodes (16): ApiTags, Body, Controller, Delete, Get, Param, Patch, Post (+8 more)

### Community 2 - "WatchlistService"
Cohesion: 0.10
Nodes (20): Body, Controller, Delete, Get, Param, Patch, Post, Query (+12 more)

### Community 3 - "diary-compose-utils.ts"
Cohesion: 0.17
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "src/index.ts"
Cohesion: 0.09
Nodes (22): DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, MEDIA_TYPES, REACTION_EMOJIS, ReactionEmoji, RECOMMENDATION_DECISION_RULES (+14 more)

### Community 6 - "CommentEntity"
Cohesion: 0.11
Nodes (13): FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+5 more)

### Community 7 - "SpacesService"
Cohesion: 0.07
Nodes (30): SpaceInvitesController, Controller, Get, Param, Post, Req, SpacesController, Body (+22 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+18 more)

### Community 9 - "UserEntity"
Cohesion: 0.04
Nodes (48): FakeUserRepository, DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+40 more)

### Community 10 - "FriendsController"
Cohesion: 0.22
Nodes (10): FriendsController, Body, Controller, Delete, Get, Param, Patch, Post (+2 more)

### Community 11 - "InviteUseEntity"
Cohesion: 0.11
Nodes (18): InjectRepository, Optional, InviteUseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+10 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.16
Nodes (11): MediaTypeControl(), SearchField(), Draft, freshDraft(), RecordComposer(), sourceLabels, today(), WATCH_RATINGS (+3 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.10
Nodes (29): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+21 more)

### Community 14 - "media.ts"
Cohesion: 0.12
Nodes (18): MediaDetailLoadingIndicator(), MediaDetailLoadingIndicatorProps, formatCreditMeta(), PersonCreditResults(), getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, PersonCreditsStatus (+10 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.11
Nodes (29): ExploreRecommendationsState, GenreRecommendationTile, initialState, pickRandomGenrePresets(), RecommendationStatus, useExploreRecommendations(), RequestStatus, useGroupRecommendations() (+21 more)

### Community 16 - "TmdbClient"
Cohesion: 0.16
Nodes (10): imageUrl(), TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult() (+2 more)

### Community 17 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.14
Nodes (14): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+6 more)

### Community 19 - "MediaPosterRowSection.tsx"
Cohesion: 0.11
Nodes (19): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput (+11 more)

### Community 20 - "friends.ts"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "NotificationsService"
Cohesion: 0.25
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 22 - "SpaceMembershipEntity"
Cohesion: 0.07
Nodes (29): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+21 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "WatchReactionEntity"
Cohesion: 0.06
Nodes (32): ParticipantPrediction, RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+24 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "media-selection.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeMediaRepository, interstellarSelection, SavedMedia

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "invites.module.ts"
Cohesion: 0.09
Nodes (19): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+11 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (29): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+21 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-validator, @davas/shared, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "DiariesService"
Cohesion: 0.24
Nodes (6): apiError(), assertNotFuture(), DiariesService, fingerprint(), normalizedCreate(), Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.08
Nodes (29): ProviderOffer, DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+21 more)

### Community 34 - "ExploreDashboard.tsx"
Cohesion: 0.14
Nodes (15): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+7 more)

### Community 35 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "MediaDetailModal.tsx"
Cohesion: 0.19
Nodes (8): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), useFocusTrap(), MediaDetail

### Community 38 - "HomeRecommendations.tsx"
Cohesion: 0.28
Nodes (7): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, selectMedia(), toMediaSelectionPayload(), getTrendingRecommendations()

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 41 - "AuthService"
Cohesion: 0.17
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "auth.ts"
Cohesion: 0.09
Nodes (26): CommentAvatar(), Avatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions (+18 more)

### Community 43 - "media.service.ts"
Cohesion: 0.12
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (43): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+35 more)

### Community 45 - "DiaryEntity"
Cohesion: 0.04
Nodes (51): CommunityCommentView, InjectRepository, Optional, DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+43 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+4 more)

### Community 48 - "MediaController"
Cohesion: 0.13
Nodes (13): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaController, ApiTags, Body, Controller (+5 more)

### Community 49 - "watch-events.ts"
Cohesion: 0.11
Nodes (32): AsyncState(), EmptyState(), Poster(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), SpaceTimeline() (+24 more)

### Community 50 - "MediaHeroCarousel.tsx"
Cohesion: 0.20
Nodes (10): ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems(), actionClass(), isInteractivePointerTarget(), MediaHeroCarousel(), MediaHeroCarouselAction (+2 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.12
Nodes (16): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 6. 기본 정책 (+8 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Controller, Get, Param, Query, GENRE_PRESETS (+6 more)

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.25
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 55 - "MediaEntity"
Cohesion: 0.06
Nodes (40): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+32 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "ExternalContentRefEntity"
Cohesion: 0.17
Nodes (11): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "group-recommendation-model.ts"
Cohesion: 0.20
Nodes (15): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+7 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (36): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+28 more)

### Community 63 - "DiaryDashboard.tsx"
Cohesion: 0.19
Nodes (17): DiaryCalendarDay, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten() (+9 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (27): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+19 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.09
Nodes (20): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+12 more)

### Community 67 - "InviteCodeEntity"
Cohesion: 0.18
Nodes (10): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 68 - "getApiBaseUrl"
Cohesion: 0.24
Nodes (14): WatchlistScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary, getDiary() (+6 more)

### Community 69 - "WatchSourceEntity"
Cohesion: 0.14
Nodes (10): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity, WatchSourceKind (+2 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "DiaryInsightGrid.tsx"
Cohesion: 0.18
Nodes (12): DiaryCalendarMarker, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind, DiaryInsightGrid(), DiaryInsightGridProps (+4 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.21
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "users.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeJwtService, FakeOutbox, SavedUser

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "NotificationsController"
Cohesion: 0.19
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 78 - "MediaService"
Cohesion: 0.21
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

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
Cohesion: 0.10
Nodes (20): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+12 more)

### Community 84 - "FriendInviteEntity"
Cohesion: 0.20
Nodes (9): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 85 - "logout"
Cohesion: 0.24
Nodes (5): ProfileAccountScreen(), ProfileSettingsSection(), SettingItem, settings, logout()

### Community 86 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

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
Cohesion: 0.18
Nodes (8): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment, Davas 문서, 관리 원칙

### Community 93 - "coreFetch"
Cohesion: 0.16
Nodes (22): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, coreFetch(), acceptSpaceInvite() (+14 more)

### Community 95 - "core.ts"
Cohesion: 0.08
Nodes (27): CoreAppShell(), RecordCard(), tabs, ViewingMethodControl(), FeedScreen(), MineScreen(), RecordDetailScreen(), RecordList() (+19 more)

### Community 98 - "availability.service.spec.ts"
Cohesion: 0.22
Nodes (5): content, contentRef, FakeAvailabilityProvider, now, ProviderAvailabilityLookup

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 100 - "MediaSelectionDto"
Cohesion: 0.22
Nodes (8): MediaSelectionDto, ApiProperty, ApiPropertyOptional, IsArray, IsEnum, IsOptional, IsString, Length

### Community 118 - "FriendsService"
Cohesion: 0.21
Nodes (3): FriendsService, Injectable, InjectRepository

### Community 140 - "reactions.ts"
Cohesion: 0.44
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.27
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 143 - "diary-dashboard-types.ts"
Cohesion: 0.33
Nodes (6): DiaryDashboardCalendar, DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 148 - "users.service.ts"
Cohesion: 0.22
Nodes (7): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ALLOWED_PROFILE_IMAGE_TYPES, UserProfileResponse

### Community 151 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 152 - "MediaSearchQueryDto"
Cohesion: 0.17
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 153 - "TodayRecommendationSection.tsx"
Cohesion: 0.31
Nodes (6): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, SectionTitle(), SectionTitleProps

### Community 154 - "AuthUi.tsx"
Cohesion: 0.13
Nodes (10): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), TaskShell(), LegalScreen(), legalDocuments (+2 more)

### Community 155 - "DiarySummarySection.tsx"
Cohesion: 0.29
Nodes (6): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps

### Community 157 - "4. 핵심 사용자 흐름"
Cohesion: 0.40
Nodes (5): 4.1 공간 시작, 4.2 감상 기록, 4.3 공유 감상 확인, 4.4 함께 볼 작품 선택, 4. 핵심 사용자 흐름

### Community 159 - "7. 비기능 요구사항"
Cohesion: 0.50
Nodes (4): 7. 비기능 요구사항, 보안과 개인정보, 성능과 접근성, 신뢰성

### Community 160 - "13. 테스트 전략"
Cohesion: 0.50
Nodes (4): 13. 테스트 전략, 도메인 단위 테스트, 종단 간 테스트, 통합 테스트

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 166 - "FriendInvitesService"
Cohesion: 0.17
Nodes (10): FriendInvitesController, Controller, Get, Param, Post, Req, error(), FriendInvitesService (+2 more)

### Community 167 - "typeorm.config.ts"
Cohesion: 0.05
Nodes (23): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity (+15 more)

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "users.controller.ts"
Cohesion: 0.24
Nodes (7): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length

### Community 173 - "NotificationEntity"
Cohesion: 0.11
Nodes (14): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+6 more)

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 184 - "TransactionOutboxService"
Cohesion: 0.32
Nodes (4): TransactionOutboxService, Injectable, InjectRepository, Optional

### Community 186 - "notifications.controller.ts"
Cohesion: 0.38
Nodes (4): NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto

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
Cohesion: 0.12
Nodes (12): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS (+4 more)

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.29
Nodes (7): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 201 - "NotificationPreferenceEntity"
Cohesion: 0.17
Nodes (11): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

## Knowledge Gaps
- **573 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+568 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `WatchEventsService` (3× useful, score=2.982896468)
- `RecordScreens.tsx` (2× useful, score=1.997107369) _(code changed — re-verify)_
- `SpaceMembershipEntity` (2× useful, score=1.99703494)
- `typeorm.config.ts` (2× useful, score=1.991170265)
- `GroupRecommendationSessionRequest` (2× useful, score=1.990889605)
- `api/package.json` (2× useful, score=1.793741429)
- `web/package.json` (2× useful, score=1.793741429)
- `shared/package.json` (2× useful, score=1.793741429)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserEntity` connect `UserEntity` to `CommentEntity`, `community.service.ts`, `InviteUseEntity`, `diaries.module.ts`, `auth.service.spec.ts`, `users.service.ts`, `SpaceMembershipEntity`, `WatchReactionEntity`, `UsersService`, `RecommendationSessionEntity`, `typeorm.config.ts`, `AuthService`, `DiaryEntity`, `NotificationEntity`, `MediaEntity`, `TransactionOutboxService`, `InviteCodeEntity`, `NotificationPreferenceEntity`, `users.service.spec.ts`, `auth.service.ts`, `FriendInviteEntity`, `FriendsService`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `DiariesService`, `diaries.dashboard.spec.ts`, `diaries-dashboard.service.ts`, `DiariesDashboardService`, `WatchSourceEntity`, `CommentEntity`, `typeorm.config.ts`, `community.service.ts`, `UserEntity`, `media.service.ts`, `WatchEventsService`, `diaries.module.ts`, `NotificationEntity`, `MediaEntity`, `WatchReactionEntity`, `group-recommendations.service.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `CommentsService`, `WatchlistService`, `SpacesService`, `community.service.ts`, `InviteUseEntity`, `friends.controller.ts`, `diaries.module.ts`, `GroupRecommendationsController`, `auth.service.spec.ts`, `invites.module.ts`, `DiariesDashboardService`, `FriendInvitesService`, `AuthController`, `WatchEventsService`, `ReactionsService`, `MediaEntity`, `notifications.controller.ts`, `CreateRecommendationSessionDto`, `diaries.controller.ts`, `InviteCodeEntity`, `NotificationsController`, `auth.service.ts`, `MediaService`, `FriendsService`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _573 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._