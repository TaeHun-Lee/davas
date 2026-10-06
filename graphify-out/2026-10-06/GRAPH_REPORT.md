# Graph Report - davas  (2026-10-06)

## Corpus Check
- 474 files · ~155,123 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3426 nodes · 6486 edges · 255 communities (199 shown, 56 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60178a9a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- SpaceHome.tsx
- devDependencies
- group-recommendation-model.ts
- MediaPosterRowSection.tsx
- SpacesService
- community.service.ts
- watch-events.service.spec.ts
- FriendsService
- Davas 개발 가이드
- contracts.ts
- app.module.ts
- media.ts
- recommendations.ts
- diaries.controller.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- getApiBaseUrl
- NotificationEntity
- AuthenticatedRequest
- scripts
- DiariesController
- RecommendationExposureEntity
- ReactionsController
- space-ui.ts
- core.ts
- InvitesService
- Davas 제품 기준 문서
- dependencies
- diaries.service.ts
- tmdb.client.ts
- WatchReactionEntity
- watch-events.ts
- DiariesDashboardService
- app-security.ts
- reactions.ts
- scripts
- AuthController
- AuthService
- auth.ts
- media.service.ts
- WatchEventsService
- verify-deployment-contracts.mjs
- devDependencies
- FileCleanupJobEntity
- TodayRecommendationSection.tsx
- UpdateWatchEventDto
- MediaHeroCarousel.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- base-url.ts
- AppShell.tsx
- MediaEntity
- compilerOptions
- WatchPhotoEntity
- compilerOptions
- shared/package.json
- users.controller.ts
- group-recommendations.service.ts
- community.ts
- spaces.service.ts
- CreateRecommendationSessionDto
- diaries-dashboard.service.ts
- watch-events.service.ts
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- MediaController
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- DiaryDashboard.tsx
- GroupRecommendationsService
- DiaryLikeEntity
- compilerOptions
- jwt-cookie-auth.guard.ts
- compilerOptions
- auth.service.ts
- WatchEventsController
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- watch-photos.service.ts
- AvailabilityService
- FriendshipEntity
- SpaceMembershipEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- NotificationsController
- spaces.ts
- RecordScreens.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- RecommendationSessionEntity
- RecordComposer.tsx
- 5. 기능 요구사항
- @nestjs/typeorm
- passport
- DiaryCompanionEntity
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- NotificationsService
- AvailabilityObservationEntity
- tailwind.config.ts
- backup.sh
- TransactionOutboxEntity
- ExploreDashboard.tsx
- InviteCodeEntity
- PersonCreditResults.tsx
- diary-compose-utils.ts
- src/index.ts
- group-recommendations.controller.ts
- docs/README.md
- CreateDiaryDto
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- SearchField.tsx
- UsersService
- UpdateDiaryDto
- core-record-migration.spec.ts
- media.controller.ts
- DiaryInsightGrid.tsx
- AuthUi.tsx
- notifications.service.ts
- NotificationPreferenceEntity
- reactions.service.ts
- FakeRepository
- verify-upload-http.mjs
- verify-edit-http.mjs
- media.service.spec.ts
- CommentEntity
- DiaryReactionEntity
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- space-watch.controller.ts
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- WatchPhotosController
- @nestjs/passport
- .inspect
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- diary-dashboard-types.ts
- Q: What are the current Davas core functions and how are they delivered?
- DiarySummarySection.tsx
- package.json
- Davas
- verify-docs.mjs
- FakeLifecycleDataSource
- UserEntity
- WatchShareEntity
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- CanonicalCatalogAvailability1720670900000
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- devDependencies
- RecordExperience1720671200000
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- watch-photos.service.spec.ts
- upload-concurrency.interceptor.ts
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- verify-security-http.mjs
- UserFollowEntity
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- TogetherMomentSection.tsx
- @nestjs/common
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- 4. 핵심 도메인 모델
- class-validator
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- 14. 단계별 확장
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- GroupRecommendationSessions1720671100000
- core-record-contract.spec.ts
- browser-runtime-journey.cjs
- verify-line-endings.mjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- api/package.json
- FakeOutbox
- sharp
- format-files.mjs
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- DeleteDateColumn
- rxjs
- contracts.spec.ts
- ArrayMaxSize
- ArrayUnique
- IsArray
- IsIn
- IsInt
- IsOptional
- IsString
- IsUUID
- Matches
- Max
- MaxLength
- Min
- Type
- ValidateIf
- ValidateNested
- Body
- Delete
- Patch
- Put

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 89 edges
2. `DiaryEntity` - 88 edges
3. `AuthenticatedRequest` - 79 edges
4. `getApiBaseUrl()` - 60 edges
5. `MediaEntity` - 48 edges
6. `WatchEventsService` - 34 edges
7. `WatchReactionEntity` - 32 edges
8. `scripts` - 32 edges
9. `AuthService` - 31 edges
10. `TmdbClient` - 26 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `hiddenReviewAccountIds()` --indirect_call--> `reaction()`  [INFERRED]
  apps/api/src/diaries/blind-review.ts → apps/web/src/components/spaces/space-watch-model.spec.ts
- `AppModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/app.module.ts → scripts/verify-upload-http.mjs
- `AuthModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/auth/auth.module.ts → scripts/verify-upload-http.mjs
- `CommentsModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/comments/comments.module.ts → scripts/verify-upload-http.mjs

## Import Cycles
- None detected.

## Communities (255 total, 56 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.12
Nodes (14): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.12
Nodes (16): Post, ApiTags, Body, Delete, Get, Param, Patch, Post (+8 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "SpaceHome.tsx"
Cohesion: 0.18
Nodes (20): HomeState, PendingConfirmation(), SpaceHomeTimeline(), pendingConfirmations(), reactionRows(), SOURCE_LABELS, event(), reaction() (+12 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "group-recommendation-model.ts"
Cohesion: 0.16
Nodes (18): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+10 more)

### Community 6 - "MediaPosterRowSection.tsx"
Cohesion: 0.15
Nodes (14): FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput, cn(), getCalendarDayState(), MediaPosterItem, MediaPosterRowSection() (+6 more)

### Community 7 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.08
Nodes (28): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+20 more)

### Community 9 - "watch-events.service.spec.ts"
Cohesion: 0.10
Nodes (19): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchReviewLikeEntity (+11 more)

### Community 10 - "FriendsService"
Cohesion: 0.11
Nodes (14): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+6 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (34): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+26 more)

### Community 13 - "app.module.ts"
Cohesion: 0.17
Nodes (20): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, RateLimitContractModule, CommunityModule, DiariesModule (+12 more)

### Community 14 - "media.ts"
Cohesion: 0.15
Nodes (15): getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, usePeopleSearch(), getMediaDetail(), getPersonCredits(), MediaSearchResponse, MyMediaDiary (+7 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.08
Nodes (32): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus (+24 more)

### Community 16 - "diaries.controller.ts"
Cohesion: 0.10
Nodes (15): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource, DiaryListQueryDto, IsIn (+7 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.09
Nodes (26): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+18 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (17): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+9 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.08
Nodes (18): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS (+10 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.12
Nodes (28): AsyncState(), EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary() (+20 more)

### Community 21 - "NotificationEntity"
Cohesion: 0.14
Nodes (10): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 22 - "AuthenticatedRequest"
Cohesion: 0.27
Nodes (9): AuthenticatedRequest, SpacesController, Body, Delete, Get, Param, Patch, Post (+1 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+24 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.09
Nodes (21): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+13 more)

### Community 26 - "ReactionsController"
Cohesion: 0.22
Nodes (8): ReactionsController, Body, Delete, Get, Param, Post, Req, REACTION_EMOJIS

### Community 27 - "space-ui.ts"
Cohesion: 0.18
Nodes (12): SpaceHome(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteStatusMessage(), readActiveSpaceId(), rememberActiveSpace() (+4 more)

### Community 28 - "core.ts"
Cohesion: 0.19
Nodes (11): ApiErrorBody, CoreFetchOptions, CursorPage, RECORD_UPDATE_FIELDS, RecordDetailData, RecordFilters, RecordUpdatePayload, RecordWritePayload (+3 more)

### Community 29 - "InvitesService"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (30): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+22 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-transformer, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport-jwt (+13 more)

### Community 32 - "diaries.service.ts"
Cohesion: 0.17
Nodes (10): queryDtoSource, serviceSource, apiError(), assertNotFuture(), DiariesService, DiaryListQuery, FEED_FRIENDS_ACCESS_PREDICATE, fingerprint() (+2 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.06
Nodes (38): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+30 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.10
Nodes (18): CommunityCommentView, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+10 more)

### Community 35 - "watch-events.ts"
Cohesion: 0.08
Nodes (42): dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS, CommentsSection() (+34 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.21
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "app-security.ts"
Cohesion: 0.09
Nodes (19): sourceRoot, ApiExceptionFilter, configureHttpSecurity(), isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveAllowedOrigins() (+11 more)

### Community 38 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.22
Nodes (8): AuthController, ApiTags, Body, Get, Post, Req, Res, Throttle

### Community 41 - "AuthService"
Cohesion: 0.16
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "auth.ts"
Cohesion: 0.09
Nodes (26): CommentAvatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen() (+18 more)

### Community 43 - "media.service.ts"
Cohesion: 0.06
Nodes (28): TmdbMetadataAdapter, Injectable, MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString (+20 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.17
Nodes (5): SaveWatchReactionDto, ratingScale(), response(), Injectable, WatchEventsService

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.09
Nodes (19): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+11 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "FileCleanupJobEntity"
Cohesion: 0.11
Nodes (11): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+3 more)

### Community 48 - "TodayRecommendationSection.tsx"
Cohesion: 0.31
Nodes (6): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, SectionTitle(), SectionTitleProps

### Community 49 - "UpdateWatchEventDto"
Cohesion: 0.18
Nodes (23): CreateWatchEventDto, UpdateWatchEventDto, WATCH_RATINGS, WatchParticipantResponseDto, WatchReviewFieldsDto, WatchSourceDto, WatchTimelineQueryDto, ArrayMaxSize (+15 more)

### Community 50 - "MediaHeroCarousel.tsx"
Cohesion: 0.19
Nodes (9): ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems(), actionClass(), MediaHeroCarousel(), MediaHeroCarouselAction, MediaHeroCarouselItem (+1 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.08
Nodes (25): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+17 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.09
Nodes (16): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, MediaRecommendationItem, RecommendationsController, ApiTags, Get, Param, Query (+8 more)

### Community 53 - "base-url.ts"
Cohesion: 0.22
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "MediaEntity"
Cohesion: 0.04
Nodes (51): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+43 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "WatchPhotoEntity"
Cohesion: 0.16
Nodes (12): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity (+4 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "users.controller.ts"
Cohesion: 0.15
Nodes (14): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, PROFILE_IMAGE_MAX_BYTES (+6 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (25): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+17 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (37): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+29 more)

### Community 63 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries-dashboard.service.ts"
Cohesion: 0.21
Nodes (11): buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts() (+3 more)

### Community 66 - "watch-events.service.ts"
Cohesion: 0.15
Nodes (10): hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, hasReviewFields(), REVIEW_FIELDS, WATCH_VIEW_RELATIONS, SpaceAccessService (+2 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "MediaController"
Cohesion: 0.18
Nodes (13): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaController, ApiTags, Body, Get (+5 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.19
Nodes (17): DiaryCalendarDay, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten() (+9 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.23
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.12
Nodes (14): ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Controller, Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user (+6 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.14
Nodes (14): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, Column, CreateDateColumn (+6 more)

### Community 78 - "WatchEventsController"
Cohesion: 0.22
Nodes (10): Controller, Get, Param, Post, Req, WatchEventsController, Body, Delete (+2 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "watch-photos.service.ts"
Cohesion: 0.18
Nodes (14): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+6 more)

### Community 84 - "FriendshipEntity"
Cohesion: 0.07
Nodes (32): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+24 more)

### Community 85 - "SpaceMembershipEntity"
Cohesion: 0.07
Nodes (29): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+21 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.14
Nodes (14): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal() (+6 more)

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

### Community 92 - "NotificationsController"
Cohesion: 0.21
Nodes (8): NotificationsController, ApiTags, Body, Get, Param, Patch, Put, Req

### Community 93 - "spaces.ts"
Cohesion: 0.12
Nodes (27): SpacesPageProps, CoreAppShell(), SpacesView, VIEW_OPTIONS, coreFetch(), createRecord(), deleteRecord(), getRecord() (+19 more)

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.06
Nodes (22): DiaryDetailPageProps, MediaTypeControl(), Poster(), RecordCard(), SearchField(), SearchIcon(), tabs, TaskShell() (+14 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.19
Nodes (14): PhotoPicker(), WatchPhoto(), PhotoViewer(), WatchPhotoGallery(), ACCEPTED_TYPES, AddPhotosResult, PHOTO_ACCEPT, PhotoUploadItem (+6 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 100 - "RecordComposer.tsx"
Cohesion: 0.10
Nodes (18): DiaryEditPageProps, DiaryNewPageProps, ChoiceChips(), CountedField(), OTT_SERVICES, SeriesProgress(), THEATER_FORMAT_LABELS, ToggleSwitch() (+10 more)

### Community 101 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 104 - "DiaryCompanionEntity"
Cohesion: 0.12
Nodes (16): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+8 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "NotificationsService"
Cohesion: 0.21
Nodes (4): NotificationType, InjectRepository, NotificationsService, Injectable

### Community 119 - "AvailabilityObservationEntity"
Cohesion: 0.12
Nodes (16): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+8 more)

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 136 - "ExploreDashboard.tsx"
Cohesion: 0.17
Nodes (11): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), GenreRecommendationSection(), GenreRecommendationSectionProps (+3 more)

### Community 137 - "InviteCodeEntity"
Cohesion: 0.06
Nodes (25): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource, InjectRepository, Optional (+17 more)

### Community 138 - "PersonCreditResults.tsx"
Cohesion: 0.14
Nodes (14): getTmdbGenreNames(), TMDB_MOVIE_GENRES, TMDB_TV_GENRES, MediaDetailLoadingIndicator(), MediaDetailLoadingIndicatorProps, GenreTags(), MediaSearchResults(), formatCreditMeta() (+6 more)

### Community 139 - "diary-compose-utils.ts"
Cohesion: 0.16
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 140 - "src/index.ts"
Cohesion: 0.09
Nodes (22): legalDocuments, CORE_DIARY_VISIBILITIES, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION, DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, MEDIA_TYPES (+14 more)

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.27
Nodes (6): GroupRecommendationsController, Body, Get, Param, Post, Req

### Community 142 - "docs/README.md"
Cohesion: 0.29
Nodes (5): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas 문서, 관리 원칙

### Community 143 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 147 - "UsersService"
Cohesion: 0.17
Nodes (6): TransactionOutboxService, Injectable, Injectable, InjectRepository, Optional, UsersService

### Community 148 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "media.controller.ts"
Cohesion: 0.10
Nodes (16): auth, media, selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length (+8 more)

### Community 153 - "DiaryInsightGrid.tsx"
Cohesion: 0.18
Nodes (12): DiaryCalendarMarker, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind, DiaryInsightGrid(), DiaryInsightGridProps (+4 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.15
Nodes (16): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo() (+8 more)

### Community 155 - "notifications.service.ts"
Cohesion: 0.22
Nodes (8): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsBoolean, IsIn, UpdateNotificationPreferenceDto, CommunityNotificationView, CreateNotificationInput

### Community 156 - "NotificationPreferenceEntity"
Cohesion: 0.17
Nodes (11): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 157 - "reactions.service.ts"
Cohesion: 0.26
Nodes (4): CreateReactionDto, IsIn, ReactionsService, Injectable

### Community 159 - "verify-upload-http.mjs"
Cohesion: 0.17
Nodes (10): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthService }, ContractModule, require, { ThrottlerGuard, ThrottlerModule }, {
  UploadConcurrencyInterceptor,
}, { UsersController } (+2 more)

### Community 160 - "verify-edit-http.mjs"
Cohesion: 0.15
Nodes (12): auth, { AuthService }, dashboard, diaries, { DiariesController }, {
  DiariesDashboardService,
}, { DiariesService }, EditContractModule (+4 more)

### Community 162 - "CommentEntity"
Cohesion: 0.20
Nodes (10): CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne (+2 more)

### Community 163 - "DiaryReactionEntity"
Cohesion: 0.20
Nodes (9): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): SpacesMembershipInvites1720670700000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 169 - "space-watch.controller.ts"
Cohesion: 0.31
Nodes (5): SpaceWatchController, Get, Param, Query, Req

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "WatchPhotosController"
Cohesion: 0.22
Nodes (7): Controller, Get, Param, Req, VARIANTS, WatchPhotosController, Res

### Community 174 - ".inspect"
Cohesion: 0.28
Nodes (6): SpaceInvitesController, Get, Param, Post, Req, UseGuards

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "diary-dashboard-types.ts"
Cohesion: 0.33
Nodes (6): DiaryDashboardCalendar, DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 180 - "DiarySummarySection.tsx"
Cohesion: 0.29
Nodes (6): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 183 - "verify-docs.mjs"
Cohesion: 0.22
Nodes (6): decoder, errors, files, forbidden, required, root

### Community 185 - "UserEntity"
Cohesion: 0.06
Nodes (32): FakeUserRepository, FakeCommentsRepository, DiaryEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+24 more)

### Community 186 - "WatchShareEntity"
Cohesion: 0.29
Nodes (7): Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchShareEntity

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "devDependencies"
Cohesion: 0.22
Nodes (9): concurrently, devDependencies, concurrently, prettier, tsx, typescript, tsx, prettier (+1 more)

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 194 - "watch-photos.service.spec.ts"
Cohesion: 0.47
Nodes (4): fakeRepository(), operatorMatches(), Row, setup()

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

### Community 205 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 207 - "Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조, Source Nodes

### Community 210 - "verify-formatting.mjs"
Cohesion: 0.29
Nodes (5): acceptedBaseline, changedFiles, failures, files, prettierIgnore

### Community 211 - "core-runtime-surface.spec.ts"
Cohesion: 0.40
Nodes (4): controllerFiles(), PUBLIC_ROUTES, publicRoutes(), sourceRoot

### Community 213 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

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
- **811 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+806 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.936886534) _(code changed — re-verify)_
- `RecordScreens.tsx` (3× useful, score=0.921634866)
- `WatchEventsService` (3× useful, score=0.916869716) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.61641103)
- `PwaStatus.tsx` (2× useful, score=0.61641103)
- `PwaStatus()` (2× useful, score=0.61641103)
- `SpaceMembershipEntity` (2× useful, score=0.613839896)
- `typeorm.config.ts` (2× useful, score=0.612037238) _(code changed — re-verify)_
- `GroupRecommendationSessionRequest` (2× useful, score=0.61195097) _(code changed — re-verify)_
- `api/package.json` (2× useful, score=0.551352422) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsController` to `src/index.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `hiddenReviewAccountIds()` connect `watch-events.service.ts` to `community.service.ts`, `WatchReactionEntity`, `SpaceHome.tsx`, `WatchEventsService`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `reaction()` connect `SpaceHome.tsx` to `watch-events.service.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _811 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.1225071225071225 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._