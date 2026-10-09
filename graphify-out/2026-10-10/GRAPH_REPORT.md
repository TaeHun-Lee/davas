# Graph Report - davas  (2026-10-08)

## Corpus Check
- 545 files · ~210,689 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3959 nodes · 8057 edges · 279 communities (220 shown, 59 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `18b6a0d7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- space-watch-model.ts
- devDependencies
- reactions.ts
- src/index.ts
- NotificationsService
- .inspect
- WatchPhotosService
- FriendsController
- Davas 개발 가이드
- contracts.ts
- diaries.module.ts
- CreateDiaryDto
- notifications.ts
- diaries.controller.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- tmdb-availability.adapter.ts
- getApiBaseUrl
- UpdateDiaryDto
- verify-client-contracts.mts
- scripts
- DiariesController
- RecommendationExposureEntity
- MediaDetailModal.tsx
- WatchEventsService
- WishesScreen.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- SpacesService
- tmdb.client.ts
- WatchReactionEntity
- auth.service.ts
- useWatchPhotoUploads.ts
- main.ts
- SpaceMembershipEntity
- scripts
- AuthController
- AuthService
- SpacesController
- recommendations.ts
- .file
- verify-deployment-contracts.mjs
- devDependencies
- group-recommendation-model.ts
- RecordComposer.tsx
- AvailabilityService
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- spaces.service.ts
- AppShell.tsx
- diaries.service.ts
- compilerOptions
- typeorm.config.ts
- compilerOptions
- shared/package.json
- ExploreScreen.tsx
- group-recommendations.service.ts
- community.ts
- metadata-provider.port.ts
- CreateRecommendationSessionDto
- DavasHeader.tsx
- MediaSelectionService
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- NotificationsController
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- diary-dashboard-types.ts
- GroupRecommendationsService
- SpaceEntity
- compilerOptions
- auth.ts
- compilerOptions
- app-security.ts
- media.ts
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- UserConsentEntity
- FriendInviteEntity
- 4. 핵심 도메인 모델
- auth.service.spec.ts
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- WatchShareEntity
- coreFetch
- CoreUi.tsx
- ReactionsService
- verify-caddy-headers.mjs
- UserEntity
- watch-events.service.ts
- space-ui.ts
- MediaController
- users.controller.ts
- class-transformer
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- TransactionOutboxEntity
- WatchEventDetailScreen.tsx
- tailwind.config.ts
- backup.sh
- SearchField.tsx
- core-routes.ts
- WatchlistItemEntity
- DiaryDashboard.tsx
- RecommendationsController
- @nestjs/core
- GroupRecommendationsController
- docs/README.md
- timeline-groups.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- InviteCodeEntity
- createTypeOrmOptions
- community.service.ts
- core-record-migration.spec.ts
- media-selection.service.spec.ts
- media.controller.ts
- AuthUi.tsx
- DiariesDashboardService
- media.service.spec.ts
- jwt-cookie-auth.guard.ts
- MediaService
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- tmdb-detail.mapper.ts
- diaries-dashboard.service.ts
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- CanonicalCatalogAvailability1720670900000
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- DiaryEntity
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- FriendshipEntity
- @nestjs/passport
- group-recommendations.service.spec.ts
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- notifications.controller.ts
- Q: What are the current Davas core functions and how are they delivered?
- MediaEntity
- package.json
- Davas
- FakeLifecycleDataSource
- DiaryComposeScreen.tsx
- invites.controller.ts
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
- MediaPosterRowSection.tsx
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- reflect-metadata
- DiaryReactionEntity
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- MemoriesScreen.tsx
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- external-ref-and-session-decision-migration.spec.ts
- MediaSearchQueryDto
- browser-runtime-journey.cjs
- diaries.dashboard.spec.ts
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- FriendsService
- watch-photos.service.spec.ts
- @nestjs/typeorm
- AccountDeletionPurgeService
- @nestjs/config
- notifications.service.ts
- @nestjs/jwt
- DiaryLikeEntity
- DiaryAccessService
- contracts.spec.ts
- OneToMany
- DiarySummarySection.tsx
- ApiExceptionFilter
- rxjs
- UpdateWatchEventDto
- friends.controller.ts
- SpaceWishesAndSubscriptions1720671300000
- MonthlyWatchCalendarSection.tsx
- FakeRepository
- 15. 단계별 고도화
- 7. 비기능 요구사항
- .constructor
- UpdateDateColumn
- Body
- Get
- Param
- Post
- Req
- ArrayMaxSize
- ArrayUnique
- IsArray
- TmdbClient
- IsIn
- IsInt
- IsOptional
- IsString
- IsUUID
- Matches
- SpaceWatchController
- Max
- MaxLength
- AuthenticatedRequest
- Min
- Type
- ValidateIf
- ValidateNested

## God Nodes (most connected - your core abstractions)
1. `AuthenticatedRequest` - 104 edges
2. `UserEntity` - 100 edges
3. `DiaryEntity` - 98 edges
4. `coreFetch()` - 66 edges
5. `getApiBaseUrl()` - 62 edges
6. `MediaEntity` - 55 edges
7. `WatchEventsService` - 45 edges
8. `NotificationsService` - 44 edges
9. `GroupRecommendationsService` - 39 edges
10. `AuthService` - 35 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `ottLabel()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/spaces/GroupRecommendationPanel.tsx → packages/shared/src/index.ts
- `providerLabel()` --calls--> `ottServiceForProvider()`  [EXTRACTED]
  apps/web/src/components/media/media-together-model.ts → packages/shared/src/index.ts
- `AppModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/app.module.ts → scripts/verify-upload-http.mjs
- `AuthModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/auth/auth.module.ts → scripts/verify-upload-http.mjs

## Import Cycles
- None detected.

## Communities (279 total, 59 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.14
Nodes (12): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 1 - "UsersController"
Cohesion: 0.09
Nodes (21): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiTags (+13 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "space-watch-model.ts"
Cohesion: 0.10
Nodes (41): Poster(), PendingConfirmation(), SpaceHomeTimeline(), blindViewerRole, FORMAT_LABELS, groupByline(), groupCardSource(), GroupReactionRow (+33 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 6 - "src/index.ts"
Cohesion: 0.04
Nodes (64): MATCH_LABELS, searchSnippet(), Item, WatchSearchResults(), OFFER_GROUPS, ourReactions(), providerLabel(), ReactionPerson (+56 more)

### Community 7 - "NotificationsService"
Cohesion: 0.19
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 8 - ".inspect"
Cohesion: 0.31
Nodes (6): SpaceInvitesController, Get, Param, Post, Req, UseGuards

### Community 9 - "WatchPhotosService"
Cohesion: 0.14
Nodes (13): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+5 more)

### Community 10 - "FriendsController"
Cohesion: 0.25
Nodes (8): FriendsController, Delete, Get, Param, Patch, Query, Req, Throttle

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (33): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+25 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.19
Nodes (18): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, CommunityModule, DiariesModule, FriendsModule (+10 more)

### Community 14 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 15 - "notifications.ts"
Cohesion: 0.10
Nodes (24): ToggleSwitch(), describeNotification(), NotificationIcon, NotificationText, quoted(), formatNotificationDate(), notificationMessage(), NotificationStatus (+16 more)

### Community 16 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.13
Nodes (15): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+7 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "tmdb-availability.adapter.ts"
Cohesion: 0.28
Nodes (3): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef

### Community 20 - "getApiBaseUrl"
Cohesion: 0.13
Nodes (27): EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload (+19 more)

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

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.07
Nodes (28): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+20 more)

### Community 26 - "MediaDetailModal.tsx"
Cohesion: 0.17
Nodes (11): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal() (+3 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.14
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.10
Nodes (29): SearchField(), chooseActiveSpace(), readActiveSpaceId(), rememberActiveSpace(), wantedByLabel(), Filter, serviceLabels(), whereText() (+21 more)

### Community 29 - "InvitesService"
Cohesion: 0.17
Nodes (8): InvitesController, Body, Get, Post, Req, InvitesService, publicCodes, Injectable

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-validator, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport (+13 more)

### Community 32 - "SpacesService"
Cohesion: 0.24
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.08
Nodes (21): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+13 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.05
Nodes (40): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity (+32 more)

### Community 35 - "auth.service.ts"
Cohesion: 0.14
Nodes (18): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto, RecoveryCodeDto (+10 more)

### Community 36 - "useWatchPhotoUploads.ts"
Cohesion: 0.12
Nodes (18): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+10 more)

### Community 37 - "main.ts"
Cohesion: 0.23
Nodes (10): configureHttpSecurity(), resolveAllowedOrigins(), validateProductionConfiguration(), ConfigurableHttpServer, configureHttpServerTimeouts(), PUBLIC_UPLOAD_FOLDERS, servePublicUploads(), shouldEnableSwagger() (+2 more)

### Community 38 - "SpaceMembershipEntity"
Cohesion: 0.14
Nodes (11): SpaceMembershipEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, InjectRepository (+3 more)

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.24
Nodes (8): AuthController, ApiTags, Body, Get, Post, Req, Res, Throttle

### Community 41 - "AuthService"
Cohesion: 0.12
Nodes (14): AuthService, newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch(), Injectable, SignupDto, ApiProperty, ApiPropertyOptional (+6 more)

### Community 42 - "SpacesController"
Cohesion: 0.25
Nodes (8): SpacesController, Body, Delete, Get, Param, Patch, Post, Req

### Community 43 - "recommendations.ts"
Cohesion: 0.08
Nodes (40): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus (+32 more)

### Community 44 - ".file"
Cohesion: 0.07
Nodes (23): Get, Param, Post, Req, Res, Throttle, UploadedFile, UseInterceptors (+15 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "group-recommendation-model.ts"
Cohesion: 0.14
Nodes (22): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), positive() (+14 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.11
Nodes (25): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), seriesProgressSummary() (+17 more)

### Community 49 - "AvailabilityService"
Cohesion: 0.08
Nodes (20): AvailabilityService, Injectable, SpaceWishesController, ArrayMaxSize, Delete, Get, IsArray, IsIn (+12 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.07
Nodes (30): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+22 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.15
Nodes (8): MediaRecommendationItem, GENRE_PRESETS, GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, RecommendationsService, FakeTmdbClient, Injectable

### Community 53 - "spaces.service.ts"
Cohesion: 0.27
Nodes (12): CreateSpaceDto, CreateSpaceInviteDto, RenameSpaceDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID (+4 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (13): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, DavasHeader() (+5 more)

### Community 55 - "diaries.service.ts"
Cohesion: 0.15
Nodes (12): media, payload, queryDtoSource, serviceSource, apiError(), assertNotFuture(), DiariesService, DiaryListQuery (+4 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "typeorm.config.ts"
Cohesion: 0.26
Nodes (3): GroupRecommendationSessions1720671100000, AccountRecoveryAndInviteDeclines1720671500000, statements()

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (15): CoreAppShell(), EXPLORE_MOODS, ExploreScreen(), Kind, KINDS, Loaded, meta(), ResultList() (+7 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (26): mapWithConcurrency(), assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank() (+18 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (38): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+30 more)

### Community 63 - "metadata-provider.port.ts"
Cohesion: 0.19
Nodes (8): TmdbMetadataAdapter, Injectable, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse, CatalogTitleDetail, CatalogTitleRef, MetadataProvider

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.10
Nodes (26): CONTENT_TYPES, CreateRecommendationSessionDto, DecideRecommendationDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto, RecommendationRuntimeDto, REWATCH_POLICIES (+18 more)

### Community 65 - "DavasHeader.tsx"
Cohesion: 0.14
Nodes (10): drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, ProfileHeaderCard(), ProfileHeaderCardProps, ProfileImagePicker(), ProfileImagePickerProps (+2 more)

### Community 66 - "MediaSelectionService"
Cohesion: 0.15
Nodes (8): selection, Optional, MediaSelectionService, Injectable, InjectRepository, Optional, InjectRepository, Optional

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "NotificationsController"
Cohesion: 0.17
Nodes (6): NotificationsController, ApiTags, Get, Param, Patch, Req

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.07
Nodes (30): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+22 more)

### Community 71 - "diary-dashboard-types.ts"
Cohesion: 0.17
Nodes (14): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind (+6 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.15
Nodes (5): clamp01(), GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "SpaceEntity"
Cohesion: 0.11
Nodes (19): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+11 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "auth.ts"
Cohesion: 0.13
Nodes (22): genreOptions, ProfileEditScreen(), OttSubscriptions(), koreanDate(), Message, SecuritySettings(), saveJson(), SettingsScreen() (+14 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "app-security.ts"
Cohesion: 0.17
Nodes (11): CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveTrustProxy(), SAFE_METHODS, SecurityEnvironment (+3 more)

### Community 78 - "media.ts"
Cohesion: 0.08
Nodes (34): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+26 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.09
Nodes (22): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 14. 단계별 확장, 15. ADR로 확정할 항목, 1. 설계 목표, 1단계: 비공개 2~5명 (+14 more)

### Community 82 - "UsersService"
Cohesion: 0.17
Nodes (6): TransactionOutboxService, Injectable, Injectable, InjectRepository, Optional, UsersService

### Community 83 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 84 - "FriendInviteEntity"
Cohesion: 0.09
Nodes (22): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+14 more)

### Community 85 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 86 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

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

### Community 92 - "WatchShareEntity"
Cohesion: 0.07
Nodes (30): SpaceWishEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+22 more)

### Community 93 - "coreFetch"
Cohesion: 0.06
Nodes (47): SpacesPageProps, ActiveSpace, FEATURES, INVITE_EXPIRY_OPTIONS, MANAGE_ICONS, SpacesScreen(), SpacesView, loadingTogether (+39 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.05
Nodes (34): DiaryDetailPageProps, CoreBottomNav(), CoreSidebar(), DavasLogoLink(), isActive(), loadUnreadCount(), MediaTypeControl(), NotificationBell() (+26 more)

### Community 97 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Delete, Get, Param, Post, Req, CreateReactionDto (+4 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "UserEntity"
Cohesion: 0.06
Nodes (29): FakeUserRepository, ParticipantPrediction, RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, RecommendationSessionStatus, SpaceStatus, SpaceMembershipRole (+21 more)

### Community 100 - "watch-events.service.ts"
Cohesion: 0.10
Nodes (23): isAfterSeoulToday(), seoulToday(), hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, mostFrequent(), newestFirst() (+15 more)

### Community 101 - "space-ui.ts"
Cohesion: 0.16
Nodes (11): ACTIVE_SPACE_KEY, inviteDeadlineLabel(), inviteStatusMessage(), spaceErrorMessage(), WishPerson, DeclineDialog(), InviteWithDetails, SpaceInviteScreen() (+3 more)

### Community 102 - "MediaController"
Cohesion: 0.26
Nodes (9): MediaController, ApiTags, Body, Get, Param, Post, Query, Req (+1 more)

### Community 103 - "users.controller.ts"
Cohesion: 0.15
Nodes (13): ALLOWED_DECLARED_MIME_TYPES, detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, ValidatedProfileImage, validateProfileImageContent() (+5 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 119 - "WatchEventDetailScreen.tsx"
Cohesion: 0.07
Nodes (29): AsyncState(), dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS (+21 more)

### Community 135 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 136 - "core-routes.ts"
Cohesion: 0.32
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 137 - "WatchlistItemEntity"
Cohesion: 0.12
Nodes (13): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+5 more)

### Community 138 - "DiaryDashboard.tsx"
Cohesion: 0.20
Nodes (16): DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten(), sortByWatchedDate() (+8 more)

### Community 139 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Get, Param, Query, Throttle

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.30
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "docs/README.md"
Cohesion: 0.28
Nodes (5): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas 문서, 관리 원칙

### Community 143 - "timeline-groups.ts"
Cohesion: 0.29
Nodes (9): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+1 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "InviteCodeEntity"
Cohesion: 0.10
Nodes (20): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+12 more)

### Community 147 - "createTypeOrmOptions"
Cohesion: 0.21
Nodes (3): SpacesMembershipInvites1720670700000, statements(), createTypeOrmOptions()

### Community 148 - "community.service.ts"
Cohesion: 0.09
Nodes (27): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+19 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "media-selection.service.spec.ts"
Cohesion: 0.20
Nodes (5): canonicalDetail, FakeMediaRepository, FakeTmdbClient, SavedMedia, selection

### Community 153 - "media.controller.ts"
Cohesion: 0.18
Nodes (9): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSelectionDto, ApiProperty, IsEnum, IsString (+1 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.16
Nodes (12): AuthShell(), errorText(), koreanDate(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard() (+4 more)

### Community 155 - "DiariesDashboardService"
Cohesion: 0.21
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 157 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.11
Nodes (16): sourceRoot, ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Controller, Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest (+8 more)

### Community 158 - "MediaService"
Cohesion: 0.19
Nodes (4): buildContentPreview(), formatWatchedDate(), MediaService, Injectable

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

### Community 162 - "tmdb-detail.mapper.ts"
Cohesion: 0.24
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 163 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 169 - "DiaryEntity"
Cohesion: 0.04
Nodes (53): CommunityCommentView, FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn (+45 more)

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 174 - "group-recommendations.service.spec.ts"
Cohesion: 0.26
Nodes (3): FakeDatabase, Row, setup()

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "notifications.controller.ts"
Cohesion: 0.24
Nodes (7): NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsBoolean, IsIn, UpdateNotificationPreferenceDto, Body, Put

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 180 - "MediaEntity"
Cohesion: 0.04
Nodes (64): AvailabilityObservationEntity, AvailabilityObservationStatus, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+56 more)

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 184 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 185 - "invites.controller.ts"
Cohesion: 0.22
Nodes (9): CreateInviteDto, IsInt, IsOptional, IsString, Length, Max, Min, ValidateInviteDto (+1 more)

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

### Community 201 - "MediaPosterRowSection.tsx"
Cohesion: 0.12
Nodes (19): DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps (+11 more)

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 206 - "DiaryReactionEntity"
Cohesion: 0.20
Nodes (9): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

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
Cohesion: 0.10
Nodes (32): WatchPhoto(), GalleryProps, PhotoViewer(), WatchPhotoGallery(), monthDayLabel(), monthGrid(), RecapLine, recapLines() (+24 more)

### Community 218 - "MediaSearchQueryDto"
Cohesion: 0.20
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 219 - "browser-runtime-journey.cjs"
Cohesion: 0.33
Nodes (3): { chromium }, { mkdir, writeFile }, result

### Community 220 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 225 - "watch-photos.service.spec.ts"
Cohesion: 0.09
Nodes (15): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, fakeRepository(), operatorMatches(), Row (+7 more)

### Community 230 - "notifications.service.ts"
Cohesion: 0.07
Nodes (25): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+17 more)

### Community 232 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 233 - "DiaryAccessService"
Cohesion: 0.25
Nodes (3): DiaryAccessService, Injectable, apiError()

### Community 237 - "DiarySummarySection.tsx"
Cohesion: 0.29
Nodes (6): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (26): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn (+18 more)

### Community 242 - "friends.controller.ts"
Cohesion: 0.33
Nodes (4): Body, Post, CreateFriendRequestDto, IsUUID

### Community 244 - "MonthlyWatchCalendarSection.tsx"
Cohesion: 0.38
Nodes (5): CalendarDayStateInput, getCalendarDayState(), MonthlyWatchCalendarSection(), MonthlyWatchCalendarSectionProps, weekdays

### Community 246 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 247 - "7. 비기능 요구사항"
Cohesion: 0.50
Nodes (4): 7. 비기능 요구사항, 보안과 개인정보, 성능과 접근성, 신뢰성

### Community 259 - "TmdbClient"
Cohesion: 0.25
Nodes (7): TmdbClient, Injectable, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult(), TmdbSearchResult

### Community 268 - "SpaceWatchController"
Cohesion: 0.44
Nodes (5): SpaceWatchController, Get, Param, Query, Req

### Community 271 - "AuthenticatedRequest"
Cohesion: 0.22
Nodes (11): AuthenticatedRequest, Body, Delete, Get, Param, Patch, Post, Put (+3 more)

## Knowledge Gaps
- **887 isolated node(s):** `RecommendationDecisionRule`, `RecommendationRewatchPolicy`, `RecommendationSessionStatus`, `selection`, `CONTENT_TYPES` (+882 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **59 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.898115301)
- `RecordScreens.tsx` (3× useful, score=0.883494795)
- `WatchEventsService` (3× useful, score=0.878926841)
- `layout.tsx` (2× useful, score=0.590902055)
- `PwaStatus.tsx` (2× useful, score=0.590902055)
- `PwaStatus()` (2× useful, score=0.590902055)
- `SpaceMembershipEntity` (2× useful, score=0.588437323)
- `typeorm.config.ts` (2× useful, score=0.586709264) _(code changed — re-verify)_
- `GroupRecommendationSessionRequest` (2× useful, score=0.586626566) _(code changed — re-verify)_
- `api/package.json` (2× useful, score=0.528535772)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistService`, `.inspect`, `WatchPhotosService`, `FriendsController`, `SpaceWatchController`, `diaries.controller.ts`, `community.service.ts`, `DiariesController`, `media.controller.ts`, `InvitesService`, `jwt-cookie-auth.guard.ts`, `auth.service.ts`, `AuthController`, `SpacesController`, `.file`, `notifications.controller.ts`, `AvailabilityService`, `spaces.service.ts`, `invites.controller.ts`, `CreateRecommendationSessionDto`, `NotificationsController`, `FriendInviteEntity`, `ReactionsService`, `watch-events.service.ts`, `MediaController`, `users.controller.ts`, `UpdateWatchEventDto`, `friends.controller.ts`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsService` to `diaries.module.ts`, `jwt-cookie-auth.guard.ts`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `RecommendationDecisionRule`, `RecommendationRewatchPolicy`, `RecommendationSessionStatus` to the rest of the system?**
  _887 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._