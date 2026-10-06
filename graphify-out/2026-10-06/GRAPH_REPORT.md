# Graph Report - davas  (2026-10-06)

## Corpus Check
- 458 files · ~143,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3295 nodes · 6214 edges · 225 communities (192 shown, 33 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `485b403c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- DiaryComposeScreen.tsx
- devDependencies
- RecordComposer.tsx
- GenreRecommendationSection.tsx
- SpacesService
- community.service.ts
- WatchReactionEntity
- FriendsService
- DiaryShareEntity
- contracts.ts
- app.module.ts
- AuthenticatedRequest
- recommendations.ts
- CommunityTab
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- FriendsScreen.tsx
- notifications.service.spec.ts
- RecommendationsController
- scripts
- DiariesController
- RecommendationSessionEntity
- CreateDiaryDto
- spaces.service.ts
- SearchField.tsx
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- diaries-dashboard.service.ts
- src/index.ts
- DiariesDashboardService
- app-security.ts
- InviteCodeEntity
- scripts
- AuthController
- AuthService
- auth.ts
- metadata-provider.port.ts
- WatchEventsService
- verify-deployment-contracts.mjs
- devDependencies
- ReactionsController
- tmdb-detail.mapper.ts
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- AppShell.tsx
- MediaEntity
- compilerOptions
- TmdbClient
- compilerOptions
- shared/package.json
- NotificationsService
- group-recommendations.service.ts
- community.ts
- core.ts
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- MediaController
- Davas Core Development
- Davas 추천 전략 상세 설계
- DiaryDashboard.tsx
- GroupRecommendationsService
- UserEntity
- compilerOptions
- jwt-cookie-auth.guard.ts
- compilerOptions
- auth.service.ts
- MediaService
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- ExternalContentRefEntity
- AvailabilityService
- FriendshipEntity
- SpaceMembershipEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- coreFetch
- RecordScreens.tsx
- users.controller.ts
- verify-caddy-headers.mjs
- notifications.service.ts
- NotificationsController
- Raspberry Pi Production Deployment
- @nestjs/typeorm
- passport
- diaries.service.ts
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- AvailabilityObservationEntity
- tailwind.config.ts
- backup.sh
- tmdb-availability.adapter.ts
- FileCleanupJobEntity
- media-selection.service.spec.ts
- ExploreDashboard.tsx
- diary-compose-utils.ts
- TaskShell
- group-recommendations.controller.ts
- product/README.md
- DiaryLikeEntity
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- UsersService
- UpdateDiaryDto
- core-record-migration.spec.ts
- MediaSelectionDto
- AuthUi.tsx
- media.controller.ts
- Local Development
- Davas Agent Harness
- FakeRepository
- verify-edit-http.mjs
- media.service.spec.ts
- verify-upload-http.mjs
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- MediaSearchQueryDto
- @nestjs/passport
- reactions.service.ts
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- getApiBaseUrl
- Q: What are the current Davas core functions and how are they delivered?
- Davas System Overview
- package.json
- Davas
- verify-docs.mjs
- FakeLifecycleDataSource
- DiaryEntity
- NotificationPreferenceEntity
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- FakeOutbox
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- devDependencies
- availability.service.spec.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- Quality Gates
- docs/README.md
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- verify-security-http.mjs
- UserFollowEntity
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- TogetherMomentSection.tsx
- @nestjs/common
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- MediaPosterRowSection.tsx
- class-validator
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- SpacesMembershipInvites1720670700000
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- GroupRecommendationSessions1720671100000
- browser-runtime-journey.cjs
- verify-line-endings.mjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- api/package.json
- format-files.mjs
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- pg
- rxjs
- contracts.spec.ts

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 91 edges
2. `DiaryEntity` - 87 edges
3. `AuthenticatedRequest` - 84 edges
4. `getApiBaseUrl()` - 60 edges
5. `MediaEntity` - 57 edges
6. `scripts` - 32 edges
7. `AuthService` - 31 edges
8. `WatchEventsService` - 30 edges
9. `coreFetch()` - 30 edges
10. `WatchReactionEntity` - 28 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `AppModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/app.module.ts → scripts/verify-upload-http.mjs
- `AuthModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/auth/auth.module.ts → scripts/verify-upload-http.mjs
- `CommentsModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/comments/comments.module.ts → scripts/verify-upload-http.mjs
- `validateProductionConfiguration()` --indirect_call--> `error()`  [INFERRED]
  apps/api/src/common/app-security.ts → apps/api/src/friends/friend-invites.service.ts

## Import Cycles
- None detected.

## Communities (225 total, 33 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.15
Nodes (12): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 1 - "UsersController"
Cohesion: 0.11
Nodes (19): DeleteMeDto, IsString, Length, ApiTags, Body, Delete, Get, Param (+11 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "RecordComposer.tsx"
Cohesion: 0.09
Nodes (24): AsyncState(), CoreAppShell(), EmptyState(), MediaTypeControl(), Poster(), Draft, freshDraft(), RecordComposer() (+16 more)

### Community 6 - "GenreRecommendationSection.tsx"
Cohesion: 0.15
Nodes (13): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, CalendarDayStateInput, cn(), getCalendarDayState(), MonthlyWatchCalendarSection() (+5 more)

### Community 7 - "SpacesService"
Cohesion: 0.22
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.10
Nodes (25): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+17 more)

### Community 9 - "WatchReactionEntity"
Cohesion: 0.06
Nodes (35): Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchParticipantEntity, Column (+27 more)

### Community 10 - "FriendsService"
Cohesion: 0.10
Nodes (15): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+7 more)

### Community 11 - "DiaryShareEntity"
Cohesion: 0.09
Nodes (19): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+11 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (34): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+26 more)

### Community 13 - "app.module.ts"
Cohesion: 0.18
Nodes (18): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, CommunityModule, DiariesModule, FriendsModule (+10 more)

### Community 14 - "AuthenticatedRequest"
Cohesion: 0.23
Nodes (11): Get, Req, AuthenticatedRequest, SpacesController, Body, Delete, Get, Param (+3 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.06
Nodes (47): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS (+39 more)

### Community 16 - "CommunityTab"
Cohesion: 0.29
Nodes (5): setCommunityDashboardQueryParam(), toCommunityTab(), CommunityTab, CommunitySegmentTabsProps, tabs

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.11
Nodes (18): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+10 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.18
Nodes (10): AvailabilityObservationStatus, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, AVAILABILITY_PROVIDER, ProviderAvailabilityLookup (+2 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "notifications.service.spec.ts"
Cohesion: 0.14
Nodes (10): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 22 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Get, Param, Query, Throttle

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+24 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 25 - "RecommendationSessionEntity"
Cohesion: 0.06
Nodes (32): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+24 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.10
Nodes (18): PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (30): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+22 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-transformer, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport-jwt (+11 more)

### Community 32 - "DiariesService"
Cohesion: 0.27
Nodes (4): apiError(), assertNotFuture(), DiariesService, Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.09
Nodes (19): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType, PersonCreditsInput (+11 more)

### Community 34 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 35 - "src/index.ts"
Cohesion: 0.07
Nodes (42): SpaceTimeline(), compareSpaceReactions(), createWatchEvent(), encode(), getSpaceTimeline(), respondToWatchParticipation(), saveWatchReaction(), calls (+34 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.21
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "app-security.ts"
Cohesion: 0.11
Nodes (17): ApiExceptionFilter, configureHttpSecurity(), isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, resolveAllowedOrigins(), resolveTrustProxy(), SAFE_METHODS (+9 more)

### Community 38 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (28): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+20 more)

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.30
Nodes (6): AuthController, ApiTags, Body, Post, Res, Throttle

### Community 41 - "AuthService"
Cohesion: 0.17
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "auth.ts"
Cohesion: 0.09
Nodes (28): CommentAvatar(), Avatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions (+20 more)

### Community 43 - "metadata-provider.port.ts"
Cohesion: 0.20
Nodes (8): TmdbMetadataAdapter, Injectable, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse, CatalogTitleDetail, CatalogTitleRef, MetadataProvider

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (43): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+35 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (21): apiDockerfile, apiPackage, architecture, auditIndex, backupScript, caddyIndex, errors, formattingVerifier (+13 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsController"
Cohesion: 0.22
Nodes (8): ReactionsController, Body, Delete, Get, Param, Post, Req, REACTION_EMOJIS

### Community 49 - "tmdb-detail.mapper.ts"
Cohesion: 0.22
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.16
Nodes (8): MediaRecommendationItem, GENRE_PRESETS, GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, RecommendationsService, FakeTmdbClient, Injectable

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.24
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "MediaEntity"
Cohesion: 0.06
Nodes (43): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+35 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "TmdbClient"
Cohesion: 0.16
Nodes (10): imageUrl(), TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult() (+2 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "NotificationsService"
Cohesion: 0.25
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.08
Nodes (31): CommunityAuthorPageProps, CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard, CommunityDiaryDetail, CommunityTopic (+23 more)

### Community 63 - "core.ts"
Cohesion: 0.14
Nodes (16): ApiErrorBody, CoreFetchOptions, createRecord(), CursorPage, deleteRecord(), isFormDataBody(), listRecords(), query() (+8 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "MediaController"
Cohesion: 0.34
Nodes (7): MediaController, ApiTags, Get, Param, Query, Req, Throttle

### Community 69 - "Davas Core Development"
Cohesion: 0.11
Nodes (18): API and data, Change map, Common pitfalls, Context loader, Core invariants, Davas Core Development, Documentation and harness, Environment-bound gate (+10 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.09
Nodes (35): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+27 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.21
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "UserEntity"
Cohesion: 0.08
Nodes (19): FakeUserRepository, ParticipantPrediction, RecommendationSessionStatus, SpaceStatus, SpaceMembershipRole, SpaceMembershipStatus, Column, CreateDateColumn (+11 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.08
Nodes (21): sourceRoot, ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Controller, Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest (+13 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.17
Nodes (11): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS (+3 more)

### Community 78 - "MediaService"
Cohesion: 0.19
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.22
Nodes (9): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Editing Boundaries, Graphify, Repository Map, Scope (+1 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.07
Nodes (28): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 14. 단계별 확장, 15. ADR로 확정할 항목, 1. 설계 목표, 1단계: 비공개 2~5명 (+20 more)

### Community 82 - "ExternalContentRefEntity"
Cohesion: 0.22
Nodes (9): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 84 - "FriendshipEntity"
Cohesion: 0.07
Nodes (32): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+24 more)

### Community 85 - "SpaceMembershipEntity"
Cohesion: 0.07
Nodes (29): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+21 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.17
Nodes (11): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal() (+3 more)

### Community 87 - "Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘, Source Nodes

### Community 88 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 89 - "media-selection-api.spec.ts"
Cohesion: 0.20
Nodes (8): availabilityDtoSource, canonicalMigrationSource, controllerSource, dtoSource, entitySource, moduleSource, selectionServiceSource, watchlistControllerSource

### Community 90 - "PwaStatus.tsx"
Cohesion: 0.31
Nodes (4): metadata, InstallEvent, PwaStatus(), resolvePwaUpdateAction()

### Community 91 - "Q: 적당하게 AGNETS.md 작성해"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 적당하게 AGNETS.md 작성해, Source Nodes

### Community 92 - "Raspberry Pi DuckDNS deployment"
Cohesion: 0.17
Nodes (9): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment, Production Database Caution, `TYPEORM_SYNC=true` 주의 (+1 more)

### Community 93 - "coreFetch"
Cohesion: 0.16
Nodes (21): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), coreFetch(), acceptSpaceInvite(), cancelSpaceInvite() (+13 more)

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.08
Nodes (18): DiaryDetailPageProps, RecordCard(), SearchField(), SearchIcon(), tabs, ViewingMethodControl(), FeedScreen(), MineScreen() (+10 more)

### Community 97 - "users.controller.ts"
Cohesion: 0.21
Nodes (6): CancelDeletionDto, IsEmail, IsString, Length, Injectable, UploadConcurrencyInterceptor

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "notifications.service.ts"
Cohesion: 0.22
Nodes (8): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsBoolean, IsIn, UpdateNotificationPreferenceDto, CommunityNotificationView, CreateNotificationInput

### Community 100 - "NotificationsController"
Cohesion: 0.21
Nodes (8): NotificationsController, ApiTags, Body, Get, Param, Patch, Put, Req

### Community 101 - "Raspberry Pi Production Deployment"
Cohesion: 0.12
Nodes (17): 1. Backup before every schema-changing release, 2. Build without opening new application traffic, 3. Inspect and run compiled migrations, 4. Open traffic, DNS and router, Exact rollback — recommended, First-time configuration, Host baseline (+9 more)

### Community 104 - "diaries.service.ts"
Cohesion: 0.20
Nodes (8): media, payload, queryDtoSource, serviceSource, DiaryListQuery, FEED_FRIENDS_ACCESS_PREDICATE, fingerprint(), normalizedCreate()

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 119 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 135 - "tmdb-availability.adapter.ts"
Cohesion: 0.24
Nodes (3): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef

### Community 136 - "FileCleanupJobEntity"
Cohesion: 0.11
Nodes (11): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+3 more)

### Community 137 - "media-selection.service.spec.ts"
Cohesion: 0.20
Nodes (5): canonicalDetail, FakeMediaRepository, FakeTmdbClient, SavedMedia, selection

### Community 138 - "ExploreDashboard.tsx"
Cohesion: 0.08
Nodes (35): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+27 more)

### Community 139 - "diary-compose-utils.ts"
Cohesion: 0.16
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 140 - "TaskShell"
Cohesion: 0.24
Nodes (5): TaskShell(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.27
Nodes (6): GroupRecommendationsController, Body, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 143 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "UsersService"
Cohesion: 0.06
Nodes (24): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+16 more)

### Community 148 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "MediaSelectionDto"
Cohesion: 0.14
Nodes (12): selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, Body, Post (+4 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.15
Nodes (15): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo() (+7 more)

### Community 155 - "media.controller.ts"
Cohesion: 0.29
Nodes (4): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches

### Community 156 - "Local Development"
Cohesion: 0.15
Nodes (13): API cannot connect to PostgreSQL, Common failures, Database modes, Fast local entity sync, Local Development, Migration command reports `ECONNREFUSED`, Migration rehearsal, Option A — full Docker Compose (+5 more)

### Community 157 - "Davas Agent Harness"
Cohesion: 0.15
Nodes (12): Adding or changing documentation, Components, Context loading strategy, Cross-harness use, Davas Agent Harness, Design, Harness commands, Source precedence (+4 more)

### Community 160 - "verify-edit-http.mjs"
Cohesion: 0.15
Nodes (12): auth, { AuthService }, dashboard, diaries, { DiariesController }, {
  DiariesDashboardService,
}, { DiariesService }, EditContractModule (+4 more)

### Community 163 - "verify-upload-http.mjs"
Cohesion: 0.17
Nodes (10): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthService }, ContractModule, require, { ThrottlerGuard, ThrottlerModule }, {
  UploadConcurrencyInterceptor,
}, { UsersController } (+2 more)

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): CanonicalCatalogAvailability1720670900000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 174 - "reactions.service.ts"
Cohesion: 0.26
Nodes (4): CreateReactionDto, IsIn, ReactionsService, Injectable

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "getApiBaseUrl"
Cohesion: 0.19
Nodes (16): DiaryReactions(), options, getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary (+8 more)

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 180 - "Davas System Overview"
Cohesion: 0.20
Nodes (10): API boundaries, Core UI boundaries, Core Web routes, Data contract, Davas System Overview, Migration chain, PWA, Repository map (+2 more)

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.20
Nodes (10): Agent workflow, Current stack, Davas, Docker Compose, Documentation map, Native development, Production, Quality gates (+2 more)

### Community 183 - "verify-docs.mjs"
Cohesion: 0.20
Nodes (7): closing, decoder, errors, files, forbidden, required, root

### Community 185 - "DiaryEntity"
Cohesion: 0.05
Nodes (39): CommunityCommentView, FakeCommentsRepository, InjectRepository, Optional, InjectRepository, Optional, CommentEntity, Column (+31 more)

### Community 186 - "NotificationPreferenceEntity"
Cohesion: 0.17
Nodes (11): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "devDependencies"
Cohesion: 0.22
Nodes (9): concurrently, devDependencies, concurrently, prettier, tsx, typescript, tsx, prettier (+1 more)

### Community 191 - "availability.service.spec.ts"
Cohesion: 0.20
Nodes (5): content, contentRef, FakeAvailabilityProvider, now, AvailabilityProvider

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 194 - "Quality Gates"
Cohesion: 0.22
Nodes (9): Core contract regression set, Evidence format, Failure policy, Gate order, Manual Web QA, Migration gate, Quality Gates, Targeted tests (+1 more)

### Community 195 - "docs/README.md"
Cohesion: 0.15
Nodes (9): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료, Davas 문서 (+1 more)

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 197 - "verify-security-http.mjs"
Cohesion: 0.22
Nodes (6): { APP_GUARD, NestFactory }, { configureHttpSecurity, OriginGuard }, ContractModule, { Controller, Get, Module, Post }, require, SecurityController

### Community 198 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 199 - "Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가, Source Nodes

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 205 - "MediaPosterRowSection.tsx"
Cohesion: 0.13
Nodes (14): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, FavoriteMovie, FavoriteMoviesSection() (+6 more)

### Community 207 - "Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조, Source Nodes

### Community 210 - "verify-formatting.mjs"
Cohesion: 0.29
Nodes (5): acceptedBaseline, changedFiles, failures, files, prettierIgnore

### Community 211 - "core-runtime-surface.spec.ts"
Cohesion: 0.40
Nodes (4): controllerFiles(), PUBLIC_ROUTES, publicRoutes(), sourceRoot

### Community 219 - "browser-runtime-journey.cjs"
Cohesion: 0.33
Nodes (3): { chromium }, { mkdir, writeFile }, result

### Community 220 - "verify-line-endings.mjs"
Cohesion: 0.33
Nodes (5): binaryExtensions, files, generatedPrefixes, listed, violations

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 224 - "api/package.json"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **847 isolated node(s):** `projectRoot`, `sourceCaddyfile`, `tempDirectory`, `testCaddyfile`, `conflictingHeaders` (+842 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.938996507)
- `RecordScreens.tsx` (3× useful, score=0.923710491)
- `WatchEventsService` (3× useful, score=0.918934609)
- `layout.tsx` (2× useful, score=0.617799256)
- `PwaStatus.tsx` (2× useful, score=0.617799256)
- `PwaStatus()` (2× useful, score=0.617799256)
- `SpaceMembershipEntity` (2× useful, score=0.615222332)
- `typeorm.config.ts` (2× useful, score=0.613415614)
- `GroupRecommendationSessionRequest` (2× useful, score=0.613329152)
- `api/package.json` (2× useful, score=0.55259413)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsController` to `src/index.ts`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsController` to `jwt-cookie-auth.guard.ts`, `app.module.ts`, `reactions.service.ts`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistService`, `community.service.ts`, `FriendsService`, `group-recommendations.controller.ts`, `DiariesController`, `spaces.service.ts`, `media.controller.ts`, `invites.controller.ts`, `WatchEventsService`, `reactions.service.ts`, `ReactionsController`, `diaries.controller.ts`, `MediaController`, `jwt-cookie-auth.guard.ts`, `auth.service.ts`, `FriendshipEntity`, `users.controller.ts`, `notifications.service.ts`, `NotificationsController`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **What connects `projectRoot`, `sourceCaddyfile`, `tempDirectory` to the rest of the system?**
  _847 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._