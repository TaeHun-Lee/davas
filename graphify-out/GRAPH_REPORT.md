# Graph Report - davas  (2026-10-07)

## Corpus Check
- 540 files · ~202,370 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3867 nodes · 8063 edges · 254 communities (214 shown, 40 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66d4153c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- watch-events.ts
- devDependencies
- useGroupRecommendations.ts
- src/index.ts
- DiaryEntity
- community.service.ts
- media.service.ts
- FriendsService
- Davas 개발 가이드
- contracts.ts
- diaries.module.ts
- CreateDiaryDto
- NotificationsScreen.tsx
- WatchPhotosService
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- FriendsScreen.tsx
- UpdateDiaryDto
- verify-client-contracts.mts
- scripts
- DiariesController
- WatchParticipantEntity
- FriendshipEntity
- WatchEventsService
- WishesScreen.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- TaskShell
- tmdb.client.ts
- FakeDatabase
- GroupRecommendationPanel.tsx
- media.ts
- main.ts
- diaries.dashboard.spec.ts
- scripts
- Controller
- AuthService
- ExternalContentRefEntity
- recommendations.ts
- watch-photos.service.ts
- verify-deployment-contracts.mjs
- devDependencies
- diaries-dashboard.service.ts
- RecordComposer.tsx
- SpacesService
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- notifications.ts
- AppShell.tsx
- diaries.service.ts
- compilerOptions
- getApiBaseUrl
- compilerOptions
- shared/package.json
- HomeRecommendations.tsx
- group-recommendations.service.ts
- community.ts
- CommentEntity
- CreateRecommendationSessionDto
- users.controller.ts
- SpacesController
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- AvailabilityService
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- DiaryDashboard.tsx
- GroupRecommendationsService
- app-security.ts
- compilerOptions
- jwt-cookie-auth.guard.ts
- compilerOptions
- auth.service.ts
- ExploreDashboard.tsx
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- InviteCodeEntity
- FriendInviteEntity
- SpaceEntity
- DiaryLikeEntity
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- DiaryAccessService
- coreFetch
- CoreUi.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- MediaEntity
- timeline-groups.ts
- diary/[id]/page.tsx
- MediaService
- diaries.controller.ts
- invites.controller.ts
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- NotificationsService
- watch-events.service.ts
- tailwind.config.ts
- backup.sh
- TransactionOutboxEntity
- spaces.service.ts
- UserEntity
- DiaryComposeScreen.tsx
- DiariesDashboardService
- @nestjs/core
- GroupRecommendationsController
- docs/README.md
- core.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- FriendInvitesController
- FakeRepository
- core-record-migration.spec.ts
- media.controller.ts
- ApiExceptionFilter
- AuthUi.tsx
- media.service.spec.ts
- WatchReactionEntity
- CanonicalCatalogAvailability1720670900000
- MediaPosterRowSection.tsx
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- GenreRecommendationSection.tsx
- 15. 단계별 고도화
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- class-transformer
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- SearchField.tsx
- @nestjs/passport
- SpaceWishesAndSubscriptions1720671300000
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- SpaceWishesController
- Q: What are the current Davas core functions and how are they delivered?
- SpacesMembershipInvites1720670700000
- package.json
- Davas
- .file
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- api/package.json
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- @nestjs/common
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- devDependencies
- RecordExperience1720671200000
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- NotificationSubjects1720671400000
- group-recommendations.warmup.spec.ts
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- verify-security-http.mjs
- passport-jwt
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- TogetherMomentSection.tsx
- 5. 필요한 데이터
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- reflect-metadata
- core-routes.ts
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- MemoriesScreen.tsx
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- SpaceWishesService
- MediaSearchQueryDto
- browser-runtime-journey.cjs
- DiarySummarySection.tsx
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- 8. 추천 파이프라인
- FileCleanupJobEntity
- .inspect
- FakeOutbox
- @nestjs/config
- notifications.service.ts
- @nestjs/jwt
- UserFollowEntity
- 제품 요구사항 구현 추적표
- contracts.spec.ts
- WishPickQueryDto
- helmet
- mapWithConcurrency
- rxjs
- UpdateWatchEventDto
- FakeLifecycleDataSource
- AccountDeletionPurgeService
- TmdbClient
- AccountRecoveryAndInviteDeclines1720671500000
- SpaceWatchController
- AuthenticatedRequest

## God Nodes (most connected - your core abstractions)
1. `AuthenticatedRequest` - 108 edges
2. `DiaryEntity` - 103 edges
3. `UserEntity` - 102 edges
4. `coreFetch()` - 66 edges
5. `MediaEntity` - 65 edges
6. `getApiBaseUrl()` - 63 edges
7. `WatchEventsService` - 45 edges
8. `NotificationsService` - 45 edges
9. `AuthService` - 35 edges
10. `WatchReactionEntity` - 33 edges

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

## Communities (254 total, 40 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.14
Nodes (12): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 1 - "UsersController"
Cohesion: 0.12
Nodes (17): DeleteMeDto, IsString, Length, ApiTags, Body, Delete, Get, Param (+9 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "watch-events.ts"
Cohesion: 0.05
Nodes (87): Poster(), PendingConfirmation(), SpaceHomeTimeline(), dayChip(), DeleteDialog(), detailChips(), participantLabels, sourceLabels (+79 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "useGroupRecommendations.ts"
Cohesion: 0.18
Nodes (14): answersOf(), RequestStatus, useGroupRecommendations(), createGroupRecommendationSession(), getGroupRecommendationSession(), calls, FetchCall, listGroupRecommendationSessions() (+6 more)

### Community 6 - "src/index.ts"
Cohesion: 0.06
Nodes (38): MATCH_LABELS, searchSnippet(), Item, WatchSearchResults(), searchWatchEvents(), CORE_DIARY_VISIBILITIES, DAVAS_APP_NAME, DIARY_VISIBILITIES (+30 more)

### Community 7 - "DiaryEntity"
Cohesion: 0.05
Nodes (39): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryEntity (+31 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (27): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+19 more)

### Community 9 - "media.service.ts"
Cohesion: 0.12
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 10 - "FriendsService"
Cohesion: 0.11
Nodes (14): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+6 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (35): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+27 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.19
Nodes (18): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, CommunityModule, DiariesModule, FriendsModule (+10 more)

### Community 14 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 15 - "NotificationsScreen.tsx"
Cohesion: 0.20
Nodes (10): describeNotification(), NotificationIcon, NotificationText, quoted(), ICON_PATHS, NotificationsScreen(), listNotifications(), markAllNotificationsRead() (+2 more)

### Community 16 - "WatchPhotosService"
Cohesion: 0.15
Nodes (9): Post, Req, Throttle, UploadedFile, UseInterceptors, WatchPhotosController, Injectable, watchPhotoPaths() (+1 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.11
Nodes (18): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+10 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (26): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+18 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.09
Nodes (17): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content (+9 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.18
Nodes (20): AsyncState(), EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend() (+12 more)

### Community 21 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 22 - "verify-client-contracts.mts"
Cohesion: 0.10
Nodes (19): calls, ContractModule, controllers, dist(), failures, mainSource, { Module, ValidationPipe }, { NestFactory } (+11 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+25 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 25 - "WatchParticipantEntity"
Cohesion: 0.05
Nodes (40): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+32 more)

### Community 26 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.14
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.13
Nodes (20): Filter, serviceLabels(), whereText(), WishesScreen(), WishSearch(), MOOD_OPTIONS, WishPickCard(), MediaSearchStatus (+12 more)

### Community 29 - "InvitesService"
Cohesion: 0.17
Nodes (8): InvitesController, Body, Get, Post, Req, InvitesService, publicCodes, Injectable

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-validator, @davas/shared, @nestjs/swagger, @nestjs/throttler, @nestjs/typeorm, passport (+13 more)

### Community 32 - "TaskShell"
Cohesion: 0.24
Nodes (5): TaskShell(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION

### Community 33 - "tmdb.client.ts"
Cohesion: 0.07
Nodes (30): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+22 more)

### Community 34 - "FakeDatabase"
Cohesion: 0.16
Nodes (10): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity, coupleRecord() (+2 more)

### Community 35 - "GroupRecommendationPanel.tsx"
Cohesion: 0.16
Nodes (18): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+10 more)

### Community 36 - "media.ts"
Cohesion: 0.08
Nodes (33): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), OFFER_GROUPS, ourReactions() (+25 more)

### Community 37 - "main.ts"
Cohesion: 0.23
Nodes (10): configureHttpSecurity(), resolveAllowedOrigins(), validateProductionConfiguration(), ConfigurableHttpServer, configureHttpServerTimeouts(), PUBLIC_UPLOAD_FOLDERS, servePublicUploads(), shouldEnableSwagger() (+2 more)

### Community 38 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "Controller"
Cohesion: 0.17
Nodes (12): AuthController, ApiTags, Body, Get, Post, Req, Res, Throttle (+4 more)

### Community 41 - "AuthService"
Cohesion: 0.12
Nodes (14): AuthService, newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch(), Injectable, SignupDto, ApiProperty, ApiPropertyOptional (+6 more)

### Community 42 - "ExternalContentRefEntity"
Cohesion: 0.12
Nodes (14): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+6 more)

### Community 43 - "recommendations.ts"
Cohesion: 0.14
Nodes (17): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, fetchRecommendation(), GenreRecommendationPreset, GenreRecommendationPresetsResponse, GenreRecommendationsResponse (+9 more)

### Community 44 - "watch-photos.service.ts"
Cohesion: 0.15
Nodes (13): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+5 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.10
Nodes (27): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), seriesProgressSummary() (+19 more)

### Community 49 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Get, Param, Query, Throttle, GENRE_PRESETS (+6 more)

### Community 53 - "notifications.ts"
Cohesion: 0.15
Nodes (17): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), LABELS, NotificationSettings(), CommunityNotificationItem, CommunityNotificationsResponse (+9 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "diaries.service.ts"
Cohesion: 0.14
Nodes (12): media, payload, queryDtoSource, serviceSource, apiError(), assertNotFuture(), DiariesService, DiaryListQuery (+4 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "getApiBaseUrl"
Cohesion: 0.06
Nodes (48): DiaryReactions(), options, drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen() (+40 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "HomeRecommendations.tsx"
Cohesion: 0.28
Nodes (7): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, selectMedia(), toMediaSelectionPayload(), getTrendingRecommendations()

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (26): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+18 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (38): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+30 more)

### Community 63 - "CommentEntity"
Cohesion: 0.15
Nodes (12): InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+4 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "users.controller.ts"
Cohesion: 0.16
Nodes (14): CancelDeletionDto, IsEmail, IsString, Length, detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS (+6 more)

### Community 66 - "SpacesController"
Cohesion: 0.25
Nodes (8): SpacesController, Body, Delete, Get, Param, Patch, Post, Req

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.09
Nodes (22): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+14 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.09
Nodes (34): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+26 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.20
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "app-security.ts"
Cohesion: 0.17
Nodes (11): CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveTrustProxy(), SAFE_METHODS, SecurityEnvironment (+3 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.13
Nodes (11): sourceRoot, ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user (+3 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.14
Nodes (18): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto, RecoveryCodeDto (+10 more)

### Community 78 - "ExploreDashboard.tsx"
Cohesion: 0.10
Nodes (25): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+17 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "UsersService"
Cohesion: 0.17
Nodes (6): TransactionOutboxService, Injectable, Injectable, InjectRepository, Optional, UsersService

### Community 83 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (28): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+20 more)

### Community 84 - "FriendInviteEntity"
Cohesion: 0.13
Nodes (17): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+9 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.07
Nodes (30): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+22 more)

### Community 86 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

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

### Community 92 - "DiaryAccessService"
Cohesion: 0.25
Nodes (3): DiaryAccessService, Injectable, apiError()

### Community 93 - "coreFetch"
Cohesion: 0.10
Nodes (42): SpacesPageProps, HomeState, SpaceHome(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteDeadlineLabel() (+34 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.09
Nodes (20): CoreAppShell(), MediaTypeControl(), NotificationBell(), RecordCard(), SearchField(), SearchIcon(), tabs, ViewingMethodControl() (+12 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.13
Nodes (16): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+8 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "MediaEntity"
Cohesion: 0.05
Nodes (45): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+37 more)

### Community 100 - "timeline-groups.ts"
Cohesion: 0.29
Nodes (9): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+1 more)

### Community 101 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 102 - "MediaService"
Cohesion: 0.12
Nodes (14): MediaController, ApiTags, Body, Get, Optional, Param, Post, Query (+6 more)

### Community 103 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 104 - "invites.controller.ts"
Cohesion: 0.22
Nodes (9): CreateInviteDto, IsInt, IsOptional, IsString, Length, Max, Min, ValidateInviteDto (+1 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "NotificationsService"
Cohesion: 0.05
Nodes (24): NotificationType, NotificationsController, ApiTags, Body, Get, Param, Patch, Put (+16 more)

### Community 119 - "watch-events.service.ts"
Cohesion: 0.10
Nodes (23): isAfterSeoulToday(), seoulToday(), hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, mostFrequent(), newestFirst() (+15 more)

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 136 - "spaces.service.ts"
Cohesion: 0.27
Nodes (12): CreateSpaceDto, CreateSpaceInviteDto, RenameSpaceDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID (+4 more)

### Community 137 - "UserEntity"
Cohesion: 0.07
Nodes (21): FakeUserRepository, CommunityCommentView, FakeCommentsRepository, ParticipantPrediction, RecommendationSessionStatus, SpaceStatus, SpaceMembershipRole, SpaceMembershipStatus (+13 more)

### Community 138 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 139 - "DiariesDashboardService"
Cohesion: 0.21
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.33
Nodes (6): GroupRecommendationsController, Body, Get, Param, Post, Req

### Community 143 - "core.ts"
Cohesion: 0.14
Nodes (16): ApiErrorBody, CoreFetchOptions, createRecord(), CursorPage, deleteRecord(), getRecord(), isFormDataBody(), listRecords() (+8 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "FriendInvitesController"
Cohesion: 0.29
Nodes (6): FriendInvitesController, Get, Param, Post, Req, UseGuards

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "media.controller.ts"
Cohesion: 0.10
Nodes (17): selection, AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSelectionDto, ApiProperty, IsEnum (+9 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.18
Nodes (11): AuthShell(), errorText(), koreanDate(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard() (+3 more)

### Community 156 - "WatchReactionEntity"
Cohesion: 0.04
Nodes (50): SpaceWishEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+42 more)

### Community 158 - "MediaPosterRowSection.tsx"
Cohesion: 0.15
Nodes (14): FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput, cn(), getCalendarDayState(), MediaPosterItem, MediaPosterRowSection() (+6 more)

### Community 159 - "verify-upload-http.mjs"
Cohesion: 0.14
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthService }, ContractModule, require, { servePublicUploads }, { ThrottlerGuard, ThrottlerModule }, {
  UploadConcurrencyInterceptor,
} (+4 more)

### Community 160 - "verify-edit-http.mjs"
Cohesion: 0.15
Nodes (12): auth, { AuthService }, dashboard, diaries, { DiariesController }, {
  DiariesDashboardService,
}, { DiariesService }, EditContractModule (+4 more)

### Community 161 - "diary-compose-utils.ts"
Cohesion: 0.16
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 162 - "GenreRecommendationSection.tsx"
Cohesion: 0.33
Nodes (5): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, MediaRecommendationItem

### Community 163 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): GroupRecommendationSessions1720671100000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "SpaceWishesController"
Cohesion: 0.23
Nodes (7): SpaceWishesController, Delete, Get, Param, Put, Query, Req

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 183 - ".file"
Cohesion: 0.09
Nodes (17): Get, Param, Res, VARIANTS, files, result, decoder, errors (+9 more)

### Community 184 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 185 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 186 - "api/package.json"
Cohesion: 0.50
Nodes (3): name, private, version

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

### Community 195 - "group-recommendations.warmup.spec.ts"
Cohesion: 0.40
Nodes (5): Operator, PAGE_ONE, setup(), TrendingItem, values()

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 197 - "verify-security-http.mjs"
Cohesion: 0.22
Nodes (6): { APP_GUARD, NestFactory }, { configureHttpSecurity, OriginGuard }, ContractModule, { Controller, Get, Module, Post }, require, SecurityController

### Community 199 - "Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가, Source Nodes

### Community 201 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 206 - "core-routes.ts"
Cohesion: 0.29
Nodes (12): safeReturn(), hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery() (+4 more)

### Community 207 - "Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조, Source Nodes

### Community 210 - "verify-formatting.mjs"
Cohesion: 0.29
Nodes (5): acceptedBaseline, changedFiles, failures, files, prettierIgnore

### Community 211 - "core-runtime-surface.spec.ts"
Cohesion: 0.40
Nodes (4): controllerFiles(), PUBLIC_ROUTES, publicRoutes(), sourceRoot

### Community 213 - "MemoriesScreen.tsx"
Cohesion: 0.16
Nodes (20): monthDayLabel(), monthGrid(), RecapLine, recapLines(), seoulDay(), seoulMonth(), shiftMonth(), MemoriesBody() (+12 more)

### Community 217 - "SpaceWishesService"
Cohesion: 0.26
Nodes (5): AvailabilityResponse, notFound(), SpaceWishesService, SUBSCRIPTION_OFFERS, Injectable

### Community 218 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 219 - "browser-runtime-journey.cjs"
Cohesion: 0.33
Nodes (3): { chromium }, { mkdir, writeFile }, result

### Community 220 - "DiarySummarySection.tsx"
Cohesion: 0.22
Nodes (8): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, SectionTitle(), SectionTitleProps

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 224 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 225 - "FileCleanupJobEntity"
Cohesion: 0.09
Nodes (15): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, fakeRepository(), operatorMatches(), Row (+7 more)

### Community 226 - ".inspect"
Cohesion: 0.31
Nodes (6): SpaceInvitesController, Get, Param, Post, Req, UseGuards

### Community 230 - "notifications.service.ts"
Cohesion: 0.05
Nodes (38): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+30 more)

### Community 232 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 233 - "제품 요구사항 구현 추적표"
Cohesion: 0.67
Nodes (3): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계

### Community 236 - "WishPickQueryDto"
Cohesion: 0.29
Nodes (7): ArrayMaxSize, IsArray, IsIn, IsOptional, IsUUID, Transform, WishPickQueryDto

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (26): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn (+18 more)

### Community 259 - "TmdbClient"
Cohesion: 0.20
Nodes (9): TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult() (+1 more)

### Community 268 - "SpaceWatchController"
Cohesion: 0.44
Nodes (5): SpaceWatchController, Get, Param, Query, Req

### Community 271 - "AuthenticatedRequest"
Cohesion: 0.22
Nodes (11): AuthenticatedRequest, Body, Delete, Get, Param, Patch, Post, Put (+3 more)

## Knowledge Gaps
- **875 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+870 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.916453515)
- `RecordScreens.tsx` (3× useful, score=0.901534479)
- `WatchEventsService` (3× useful, score=0.896873254)
- `layout.tsx` (2× useful, score=0.602967419)
- `PwaStatus.tsx` (2× useful, score=0.602967419)
- `PwaStatus()` (2× useful, score=0.602967419)
- `SpaceMembershipEntity` (2× useful, score=0.600452361)
- `typeorm.config.ts` (2× useful, score=0.598689017)
- `GroupRecommendationSessionRequest` (2× useful, score=0.598604631)
- `api/package.json` (2× useful, score=0.539327707)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `NotificationsService` to `src/index.ts`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistService`, `community.service.ts`, `spaces.service.ts`, `FriendsService`, `SpaceWatchController`, `GroupRecommendationsController`, `WatchPhotosService`, `FriendInvitesController`, `media.controller.ts`, `DiariesController`, `InvitesService`, `Controller`, `watch-photos.service.ts`, `SpaceWishesController`, `.file`, `CreateRecommendationSessionDto`, `users.controller.ts`, `SpacesController`, `jwt-cookie-auth.guard.ts`, `auth.service.ts`, `.inspect`, `MediaService`, `diaries.controller.ts`, `invites.controller.ts`, `notifications.service.ts`, `UpdateWatchEventDto`, `NotificationsService`, `watch-events.service.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `NotificationsService` to `Controller`, `diaries.module.ts`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _875 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._