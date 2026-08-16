# Graph Report - davas  (2026-08-16)

## Corpus Check
- 387 files · ~118,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2851 nodes · 5577 edges · 206 communities (175 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6a81d13`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersService
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- GenreRecommendationSection.tsx
- SpacesService
- community.service.ts
- UserEntity
- NotificationsService
- InviteUseEntity
- RecordComposer.tsx
- diaries.module.ts
- media.ts
- recommendations.ts
- TmdbClient
- AppShell.tsx
- ProfileDashboard.tsx
- DiarySummarySection.tsx
- friends.ts
- FriendshipEntity
- SpaceMembershipEntity
- scripts
- DiariesController
- RecommendationExposureEntity
- CreateDiaryDto
- media-selection.service.ts
- SearchField.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- group-recommendation-model.ts
- RecommendationSessionEntity
- DiariesDashboardService
- PersonCreditResults.tsx
- BaseSchema1720670300000
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
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- CoreRecordContract1720670500000
- MediaEntity
- compilerOptions
- ExternalContentRefEntity
- compilerOptions
- shared/package.json
- CommentEntity
- group-recommendations.service.ts
- community.ts
- diary-dashboard-types.ts
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- SpacesController
- getApiBaseUrl
- WatchSourceEntity
- Davas 추천 전략 상세 설계
- DiaryCompanionEntity
- GroupRecommendationsService
- ExploreDashboard.tsx
- compilerOptions
- UserFollowEntity
- compilerOptions
- auth.service.ts
- MediaService
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- HomeDashboard.tsx
- AvailabilityService
- FriendInviteEntity
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- coreFetch
- core.ts
- middleware.ts
- FriendsController
- diaries-dashboard.service.ts
- tmdb-detail.mapper.ts
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- WatchEventsAndPersonalReactions1720670800000
- tailwind.config.ts
- backup.sh
- media.service.spec.ts
- @nestjs/platform-express
- typeorm
- CanonicalCatalogAvailability1720670900000
- AvailabilityObservationEntity
- GroupRecommendationsController
- product/README.md
- MediaSearchQueryDto
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- FileCleanupJobEntity
- DiaryDashboard.tsx
- users.service.ts
- InviteCodeEntity
- AuthUi.tsx
- 5. 기능 요구사항
- availability.service.spec.ts
- NotificationsController
- FakeRepository
- MediaSelectionDto
- diary/[id]/page.tsx
- RecommendationsController
- spaces.service.ts
- FriendsService
- Q: Can Davas be deployed and verified on Raspberry Pi?
- FakeLifecycleDataSource
- FriendInvitesService
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- WatchReactionEntity
- @nestjs/passport
- SpaceInvitesController
- class-transformer
- TogetherMomentSection.tsx
- Q: What are the current Davas core functions and how are they delivered?
- TaskShell
- DiaryRecentListSection.tsx
- DiaryLikeEntity
- GroupRecommendationSessions1720671100000
- media.controller.ts
- 4. 핵심 도메인 모델
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- availability.service.ts
- availability-provider.port.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- notifications.controller.ts
- friends.controller.ts
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- 4. 핵심 사용자 흐름
- AccountLifecycleNotificationOutbox1720671000000
- 14. 단계별 확장
- TransactionOutboxService
- .constructor
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- 7. 비기능 요구사항
- 13. 테스트 전략
- .constructor

## God Nodes (most connected - your core abstractions)
1. `DiaryEntity` - 87 edges
2. `UserEntity` - 86 edges
3. `getApiBaseUrl()` - 60 edges
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

## Communities (206 total, 31 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.13
Nodes (14): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+6 more)

### Community 1 - "UsersService"
Cohesion: 0.07
Nodes (28): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiTags (+20 more)

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
Nodes (26): legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION, DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, GroupRecommendationFeedbackRequest (+18 more)

### Community 6 - "GenreRecommendationSection.tsx"
Cohesion: 0.17
Nodes (12): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, CalendarDayStateInput, cn(), getCalendarDayState(), MonthlyWatchCalendarSection() (+4 more)

### Community 7 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+18 more)

### Community 9 - "UserEntity"
Cohesion: 0.07
Nodes (26): FakeUserRepository, NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+18 more)

### Community 10 - "NotificationsService"
Cohesion: 0.21
Nodes (4): NotificationType, REQUIRED_NOTIFICATION_CATEGORIES, NotificationsService, Injectable

### Community 11 - "InviteUseEntity"
Cohesion: 0.11
Nodes (18): InjectRepository, Optional, InviteUseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+10 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.11
Nodes (12): DiaryEditPageProps, DiaryNewPageProps, Draft, freshDraft(), RecordComposer(), sourceLabels, today(), WATCH_RATINGS (+4 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.09
Nodes (31): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+23 more)

### Community 14 - "media.ts"
Cohesion: 0.12
Nodes (18): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, usePeopleSearch() (+10 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.11
Nodes (25): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, RequestStatus, createGroupRecommendationSession(), fetchRecommendation(), GenreRecommendationPreset (+17 more)

### Community 16 - "TmdbClient"
Cohesion: 0.22
Nodes (8): imageUrl(), TmdbClient, Injectable, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult(), TmdbSearchResult

### Community 17 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (17): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+9 more)

### Community 19 - "DiarySummarySection.tsx"
Cohesion: 0.16
Nodes (11): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, RecentRecord, RecentRecordsSection() (+3 more)

### Community 20 - "friends.ts"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "FriendshipEntity"
Cohesion: 0.08
Nodes (21): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+13 more)

### Community 22 - "SpaceMembershipEntity"
Cohesion: 0.14
Nodes (11): SpaceMembershipEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, InjectRepository (+3 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.09
Nodes (21): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+13 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "media-selection.service.ts"
Cohesion: 0.15
Nodes (8): selection, MediaSelectionService, FakeMediaRepository, interstellarSelection, SavedMedia, Injectable, InjectRepository, Optional

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "InvitesService"
Cohesion: 0.10
Nodes (17): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+9 more)

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
Cohesion: 0.09
Nodes (20): ProviderOffer, DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+12 more)

### Community 34 - "group-recommendation-model.ts"
Cohesion: 0.19
Nodes (16): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+8 more)

### Community 35 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "PersonCreditResults.tsx"
Cohesion: 0.14
Nodes (14): getTmdbGenreNames(), TMDB_MOVIE_GENRES, TMDB_TV_GENRES, MediaDetailLoadingIndicator(), MediaDetailLoadingIndicatorProps, GenreTags(), MediaSearchResults(), formatCreditMeta() (+6 more)

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
Nodes (27): CommentAvatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen() (+19 more)

### Community 43 - "media.service.ts"
Cohesion: 0.11
Nodes (16): TmdbMetadataAdapter, Injectable, buildContentPreview(), FavoriteMediaItem, FavoriteMediaResponse, formatWatchedDate(), MediaDetailResponse, MediaFavoriteResponse (+8 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (43): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+35 more)

### Community 45 - "DiaryEntity"
Cohesion: 0.07
Nodes (25): InjectRepository, Optional, DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+17 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (13): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+5 more)

### Community 48 - "MediaController"
Cohesion: 0.22
Nodes (6): MediaController, ApiTags, Controller, Get, Param, Query

### Community 49 - "watch-events.ts"
Cohesion: 0.10
Nodes (33): AsyncState(), EmptyState(), Poster(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), SpaceTimeline() (+25 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.13
Nodes (14): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+6 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.12
Nodes (16): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 6. 기본 정책 (+8 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.16
Nodes (8): MediaRecommendationItem, GENRE_PRESETS, GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, RecommendationsService, FakeTmdbClient, Injectable

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.24
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 55 - "MediaEntity"
Cohesion: 0.06
Nodes (38): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+30 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "ExternalContentRefEntity"
Cohesion: 0.22
Nodes (9): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "CommentEntity"
Cohesion: 0.11
Nodes (13): FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+5 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (37): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+29 more)

### Community 63 - "diary-dashboard-types.ts"
Cohesion: 0.16
Nodes (15): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryDashboardView, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps (+7 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.09
Nodes (20): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+12 more)

### Community 67 - "SpacesController"
Cohesion: 0.24
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 68 - "getApiBaseUrl"
Cohesion: 0.14
Nodes (24): MeResponse, DiaryReactions(), options, WatchlistScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload (+16 more)

### Community 69 - "WatchSourceEntity"
Cohesion: 0.16
Nodes (9): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity, FakeDatabase (+1 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "DiaryCompanionEntity"
Cohesion: 0.20
Nodes (9): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, InjectRepository (+1 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.21
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "ExploreDashboard.tsx"
Cohesion: 0.15
Nodes (14): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), FavoriteMovie, FavoriteMoviesSection() (+6 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 78 - "MediaService"
Cohesion: 0.28
Nodes (3): Optional, MediaService, Injectable

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
Cohesion: 0.12
Nodes (15): AuthenticatedLanding(), buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre(), HomeDashboard(), HomeDashboardProps (+7 more)

### Community 84 - "FriendInviteEntity"
Cohesion: 0.20
Nodes (9): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.11
Nodes (18): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.21
Nodes (7): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), MediaDetail

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
Cohesion: 0.15
Nodes (22): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, coreFetch(), acceptSpaceInvite() (+14 more)

### Community 95 - "core.ts"
Cohesion: 0.08
Nodes (28): CoreAppShell(), MediaTypeControl(), RecordCard(), SearchField(), tabs, ViewingMethodControl(), FeedScreen(), MineScreen() (+20 more)

### Community 98 - "FriendsController"
Cohesion: 0.28
Nodes (8): FriendsController, Controller, Delete, Get, Param, Patch, Query, Req

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 100 - "tmdb-detail.mapper.ts"
Cohesion: 0.24
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 140 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.27
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 143 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.20
Nodes (8): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, FakeOutboxRepository

### Community 148 - "FileCleanupJobEntity"
Cohesion: 0.33
Nodes (5): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 151 - "DiaryDashboard.tsx"
Cohesion: 0.21
Nodes (15): DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten(), sortByWatchedDate() (+7 more)

### Community 152 - "users.service.ts"
Cohesion: 0.11
Nodes (7): NotificationRequestInput, OutboxInput, FakeJwtService, FakeOutbox, FakeUserRepository, SavedUser, UserProfileResponse

### Community 153 - "InviteCodeEntity"
Cohesion: 0.18
Nodes (10): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.27
Nodes (5): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard()

### Community 155 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 156 - "availability.service.spec.ts"
Cohesion: 0.22
Nodes (4): content, contentRef, FakeAvailabilityProvider, now

### Community 157 - "NotificationsController"
Cohesion: 0.21
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 159 - "MediaSelectionDto"
Cohesion: 0.16
Nodes (11): MediaSelectionDto, ApiProperty, ApiPropertyOptional, IsArray, IsEnum, IsOptional, IsString, Length (+3 more)

### Community 160 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 161 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Controller, Get, Param, Query

### Community 162 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 163 - "FriendsService"
Cohesion: 0.21
Nodes (3): FriendsService, Injectable, InjectRepository

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 166 - "FriendInvitesService"
Cohesion: 0.17
Nodes (10): FriendInvitesController, Controller, Get, Param, Post, Req, error(), FriendInvitesService (+2 more)

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): SpacesMembershipInvites1720670700000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "WatchReactionEntity"
Cohesion: 0.05
Nodes (42): CommunityCommentView, DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+34 more)

### Community 173 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 184 - "DiaryRecentListSection.tsx"
Cohesion: 0.38
Nodes (5): DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps

### Community 185 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 187 - "media.controller.ts"
Cohesion: 0.29
Nodes (4): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches

### Community 188 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "availability.service.ts"
Cohesion: 0.29
Nodes (6): AvailabilityObservationStatus, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS

### Community 191 - "availability-provider.port.ts"
Cohesion: 0.18
Nodes (7): TmdbAvailabilityAdapter, Injectable, AVAILABILITY_PROVIDER, AvailabilityContentRef, AvailabilityProvider, ProviderAvailabilityLookup, ProviderReleaseState

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 193 - "notifications.controller.ts"
Cohesion: 0.38
Nodes (4): NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto

### Community 194 - "friends.controller.ts"
Cohesion: 0.33
Nodes (4): Body, Post, CreateFriendRequestDto, IsUUID

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.29
Nodes (7): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 197 - "4. 핵심 사용자 흐름"
Cohesion: 0.40
Nodes (5): 4.1 공간 시작, 4.2 감상 기록, 4.3 공유 감상 확인, 4.4 함께 볼 작품 선택, 4. 핵심 사용자 흐름

### Community 199 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 203 - "7. 비기능 요구사항"
Cohesion: 0.50
Nodes (4): 7. 비기능 요구사항, 보안과 개인정보, 성능과 접근성, 신뢰성

### Community 204 - "13. 테스트 전략"
Cohesion: 0.50
Nodes (4): 13. 테스트 전략, 도메인 단위 테스트, 종단 간 테스트, 통합 테스트

## Knowledge Gaps
- **571 isolated node(s):** `tabs`, `Draft`, `sourceLabels`, `WATCH_RATINGS`, `$schema` (+566 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `WatchEventsService` (3× useful, score=2.981103012)
- `RecordScreens.tsx` (2× useful, score=1.995906616)
- `SpaceMembershipEntity` (2× useful, score=1.995834231)
- `typeorm.config.ts` (2× useful, score=1.989973081)
- `GroupRecommendationSessionRequest` (2× useful, score=1.98969259)
- `api/package.json` (2× useful, score=1.792662948)
- `web/package.json` (2× useful, score=1.792662948)
- `shared/package.json` (2× useful, score=1.792662948)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.271) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsService` to `diaries.module.ts`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `DiariesService`, `diaries.dashboard.spec.ts`, `diaries-dashboard.service.ts`, `DiariesDashboardService`, `WatchSourceEntity`, `DiaryCompanionEntity`, `community.service.ts`, `UserEntity`, `typeorm.config.ts`, `WatchReactionEntity`, `WatchEventsService`, `diaries.module.ts`, `media.service.ts`, `MediaEntity`, `DiaryLikeEntity`, `CommentEntity`, `group-recommendations.service.ts`, `RecommendationExposureEntity`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `tabs`, `Draft`, `sourceLabels` to the rest of the system?**
  _571 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `UsersService` be split into smaller, more focused modules?**
  _Cohesion score 0.06753246753246753 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._