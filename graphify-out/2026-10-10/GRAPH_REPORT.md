# Graph Report - davas  (2026-10-10)

## Corpus Check
- 432 files · ~182,869 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3378 nodes · 6428 edges · 328 communities (188 shown, 140 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `42a6de90`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsController
- UsersController
- WatchlistService
- space-watch-model.ts
- devDependencies
- FakeDatabase
- core.ts
- NotificationsController
- SpaceEntity
- WatchPhotosService
- recommendations.ts
- Davas 개발 가이드
- media-together-model.ts
- app.module.ts
- ApiProperty
- NotificationsScreen.tsx
- DiariesService
- AvailabilityObservationEntity
- main.ts
- auth.ts
- WatchParticipantEntity
- IsBoolean
- verify-client-contracts.mts
- scripts
- Body
- RecommendationExposureEntity
- users.controller.ts
- WatchEventsService
- WishesScreen.tsx
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- coreFetch
- tmdb.client.ts
- WatchReactionEntity
- auth.service.ts
- useWatchPhotoUploads.ts
- availability.service.ts
- auth.service.spec.ts
- scripts
- AuthController
- AuthService
- contracts.ts
- NotificationsService
- .file
- verify-deployment-contracts.mjs
- devDependencies
- app-security.ts
- RecordComposer.tsx
- SpaceWishesService
- RecommendationsService
- Davas 제품 요구사항 상세 설계
- FriendsService
- space-memories.service.ts
- AccountDeletionPurgeService
- NotificationPreferenceEntity
- compilerOptions
- typeorm.config.ts
- compilerOptions
- shared/package.json
- ExternalContentRefEntity
- group-recommendations.service.ts
- WatchlistItemEntity
- Injectable
- CreateRecommendationSessionDto
- group-recommendation-pool.ts
- ApiTags
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- OneToMany
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- route-rate-limit.spec.ts
- GroupRecommendationsService
- space-wishes.service.spec.ts
- compilerOptions
- SettingsScreen.tsx
- compilerOptions
- Optional
- media-selection.service.spec.ts
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- watch-photo-processing.ts
- CommentEntity
- FriendshipEntity
- Public
- FriendInvitesService
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- 4. 핵심 도메인 모델
- SpacesScreen.tsx
- CoreUi.tsx
- CommentsService
- src/index.ts
- verify-caddy-headers.mjs
- 14. 단계별 확장
- FriendInviteEntity
- AvailabilityService
- media.controller.ts
- watch-photos.service.ts
- class-transformer
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- SpacesService
- profile-image-upload.ts
- RecordExperience1720671200000
- SignupDto
- OneToOne
- tailwind.config.ts
- backup.sh
- notifications.controller.ts
- core-routes.ts
- MediaSelectionService
- 5. 기능 요구사항
- DiaryLikeEntity
- @nestjs/core
- GroupRecommendationsController
- docs/README.md
- watch-events.service.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- UserEntity
- createTypeOrmOptions
- DiaryReactionEntity
- core-record-migration.spec.ts
- DiaryEntity
- SpaceMemoriesQueryDto
- AuthUi.tsx
- MediaFavoriteEntity
- WatchPhotoEntity
- jwt-cookie-auth.guard.ts
- MediaService
- verify-upload-http.mjs
- access-cookie.ts
- tmdb-genres.ts
- Patch
- Get
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- CanonicalCatalogAvailability1720670900000
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- SpaceAccessService
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- Param
- @nestjs/passport
- Query
- group-recommendations.service.spec.ts
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- Req
- Q: What are the current Davas core functions and how are they delivered?
- entities/index.ts
- package.json
- Davas
- users.service.spec.ts
- Injectable
- InviteCodeEntity
- api/package.json
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- @nestjs/common
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- devDependencies
- InjectRepository
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- Optional
- NotificationSubjects1720671400000
- .constructor
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- verify-security-http.mjs
- passport-jwt
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- Delete
- Param
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- Patch
- reflect-metadata
- Post
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- Res
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- Injectable
- MemoriesScreen.tsx
- WatchEventsAndPersonalReactions1720670800000
- InjectRepository
- LegacyTmdbImageSafety1720671000000
- external-ref-and-session-decision-migration.spec.ts
- IsEnum
- browser-runtime-journey.cjs
- Optional
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- Optional
- FileCleanupJobEntity
- @nestjs/typeorm
- UsersService
- @nestjs/config
- notifications.service.spec.ts
- @nestjs/jwt
- .inspect
- ApiPropertyOptional
- contracts.spec.ts
- ApiPropertyOptional
- IsBoolean
- IsIn
- rxjs
- UpdateWatchEventDto
- IsInt
- SpaceWishesAndSubscriptions1720671300000
- IsOptional
- IsString
- IsUUID
- Matches
- Max
- UpdateDateColumn
- Body
- Get
- Param
- Post
- Req
- Param
- Query
- Delete
- TmdbClient
- ArrayMaxSize
- ArrayUnique
- Inject
- Injectable
- InjectRepository
- IsArray
- SpaceWatchController
- IsIn
- IsInt
- AuthenticatedRequest
- IsOptional
- IsString
- Length
- Matches
- MaxLength
- Min
- IsIn
- ApiTags
- Get
- Param
- Query
- Throttle
- Max
- IsInt
- IsOptional
- IsString
- IsUUID
- Matches
- Max
- MaxLength
- Min
- Optional
- Inject
- Optional
- Body
- Delete
- Get
- Param
- Post
- Req
- IsIn
- Injectable
- InjectRepository
- Param
- Patch
- MaxLength
- UploadedFile
- UseInterceptors
- Get
- Patch
- Query
- IsIn
- IsOptional
- IsString
- IsUUID
- MaxLength
- Min
- Optional
- Res
- Transform
- Type
- ValidateIf
- ValidateNested

## God Nodes (most connected - your core abstractions)
1. `coreFetch()` - 84 edges
2. `AuthenticatedRequest` - 79 edges
3. `UserEntity` - 75 edges
4. `DiaryEntity` - 52 edges
5. `WatchEventsService` - 45 edges
6. `GroupRecommendationsService` - 37 edges
7. `NotificationsService` - 36 edges
8. `AuthService` - 33 edges
9. `scripts` - 33 edges
10. `MediaEntity` - 32 edges

## Surprising Connections (you probably didn't know these)
- `SettingsScreen()` --calls--> `seoulToday()`  [EXTRACTED]
  apps/web/src/components/settings/SettingsScreen.tsx → packages/shared/src/dates.ts
- `SpaceCalendarView()` --calls--> `seoulToday()`  [EXTRACTED]
  apps/web/src/components/spaces/SpaceCalendarView.tsx → packages/shared/src/dates.ts
- `bootstrap()` --calls--> `uploadsRoot()`  [EXTRACTED]
  apps/api/src/main.ts → apps/api/src/common/uploads-root.ts
- `validateProductionConfiguration()` --indirect_call--> `error()`  [INFERRED]
  apps/api/src/common/app-security.ts → apps/api/src/friends/friend-invites.service.ts
- `RecordComposer()` --calls--> `seoulToday()`  [EXTRACTED]
  apps/web/src/components/core/RecordComposer.tsx → packages/shared/src/dates.ts

## Import Cycles
- None detected.

## Communities (328 total, 140 thin omitted)

### Community 0 - "CommentsController"
Cohesion: 0.19
Nodes (9): CommentsController, ApiTags, Body, Controller, Delete, Get, Param, Post (+1 more)

### Community 1 - "UsersController"
Cohesion: 0.11
Nodes (16): ApiTags, Body, Controller, Get, Post, Public, Req, Res (+8 more)

### Community 2 - "WatchlistService"
Cohesion: 0.09
Nodes (14): FakeRepository, Body, Controller, Delete, Param, Post, Req, WatchlistController (+6 more)

### Community 3 - "space-watch-model.ts"
Cohesion: 0.09
Nodes (38): PendingConfirmation(), SpaceHome(), SpaceHomeTimeline(), WatchEventDetailScreen(), blindViewerRole, FORMAT_LABELS, groupByline(), groupCardSource() (+30 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "FakeDatabase"
Cohesion: 0.31
Nodes (3): coupleRecord(), FakeDatabase, setup()

### Community 6 - "core.ts"
Cohesion: 0.06
Nodes (43): CoreAppShell(), SearchField(), EXPLORE_MOODS, ExploreScreen(), Kind, KINDS, Loaded, meta() (+35 more)

### Community 7 - "NotificationsController"
Cohesion: 0.16
Nodes (8): NotificationsController, ApiTags, Body, Get, Param, Patch, Put, Req

### Community 8 - "SpaceEntity"
Cohesion: 0.06
Nodes (36): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+28 more)

### Community 9 - "WatchPhotosService"
Cohesion: 0.15
Nodes (6): InjectRepository, Optional, apiError(), Injectable, InjectRepository, WatchPhotosService

### Community 10 - "recommendations.ts"
Cohesion: 0.07
Nodes (49): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), positive() (+41 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "media-together-model.ts"
Cohesion: 0.22
Nodes (12): OFFER_GROUPS, ourReactions(), providerLabel(), ReactionPerson, watchableGroups(), OurReactionsCard(), WatchableNowCard(), MediaAvailability (+4 more)

### Community 13 - "app.module.ts"
Cohesion: 0.22
Nodes (16): AuthModule, CommentsModule, DiariesModule, Module, FriendsModule, InvitesModule, MediaModule, Module (+8 more)

### Community 15 - "NotificationsScreen.tsx"
Cohesion: 0.13
Nodes (19): EmptyState(), describeNotification(), NotificationIcon, NotificationText, quoted(), ICON_PATHS, NotificationsScreen(), LABELS (+11 more)

### Community 16 - "DiariesService"
Cohesion: 0.08
Nodes (24): DiariesController, ApiTags, Controller, Get, Query, Req, Throttle, queryDtoSource (+16 more)

### Community 17 - "AvailabilityObservationEntity"
Cohesion: 0.25
Nodes (8): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 18 - "main.ts"
Cohesion: 0.13
Nodes (11): AppModule, Module, ApiExceptionFilter, ConfigurableHttpServer, configureHttpServerTimeouts(), PUBLIC_UPLOAD_FOLDERS, servePublicUploads(), shouldEnableSwagger() (+3 more)

### Community 19 - "auth.ts"
Cohesion: 0.15
Nodes (13): Message, SecuritySettings(), changePassword(), createRecoveryCode(), login(), logout(), normalizeProfileImageUrl(), resetPassword() (+5 more)

### Community 20 - "WatchParticipantEntity"
Cohesion: 0.12
Nodes (16): DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column (+8 more)

### Community 22 - "verify-client-contracts.mts"
Cohesion: 0.10
Nodes (19): calls, ContractModule, controllers, dist(), failures, mainSource, { Module, ValidationPipe }, { NestFactory } (+11 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+25 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.07
Nodes (29): ParticipantPrediction, RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+21 more)

### Community 26 - "users.controller.ts"
Cohesion: 0.12
Nodes (16): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiPropertyOptional (+8 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.13
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.13
Nodes (21): Poster(), Filter, serviceLabels(), whereText(), WishesScreen(), MOOD_OPTIONS, WishPickCard(), getDecidedGroupRecommendation() (+13 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-validator, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport (+13 more)

### Community 32 - "coreFetch"
Cohesion: 0.12
Nodes (31): dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WEEKDAYS, CommentsSection(), relativeTime() (+23 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.10
Nodes (27): DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, RecommendationResponse, TMDB_CLIENT_OPTIONS, TMDB_TIMEOUT_MS, TmdbClientOptions (+19 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.11
Nodes (18): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 35 - "auth.service.ts"
Cohesion: 0.22
Nodes (13): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto, RecoveryCodeDto (+5 more)

### Community 36 - "useWatchPhotoUploads.ts"
Cohesion: 0.11
Nodes (19): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+11 more)

### Community 37 - "availability.service.ts"
Cohesion: 0.09
Nodes (18): mapWithConcurrency(), AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content, contentRef (+10 more)

### Community 38 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (12): accessCookieMaxAgeMs(), accessCookieOptions(), AuthController, ApiTags, Body, Controller, Get, Post (+4 more)

### Community 41 - "AuthService"
Cohesion: 0.19
Nodes (5): AuthService, newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch(), Injectable

### Community 42 - "contracts.ts"
Cohesion: 0.06
Nodes (40): AsyncState(), SearchIcon(), FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend() (+32 more)

### Community 44 - ".file"
Cohesion: 0.09
Nodes (17): Get, Param, Res, VARIANTS, files, result, decoder, errors (+9 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "app-security.ts"
Cohesion: 0.15
Nodes (15): sourceRoot, configureHttpSecurity(), CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveAllowedOrigins() (+7 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.09
Nodes (28): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), seriesProgressSummary() (+20 more)

### Community 49 - "SpaceWishesService"
Cohesion: 0.11
Nodes (16): SpaceWishesController, ArrayMaxSize, Delete, Get, IsArray, IsIn, IsOptional, IsUUID (+8 more)

### Community 50 - "RecommendationsService"
Cohesion: 0.17
Nodes (6): GENRE_PRESETS, GenrePreset, RecommendationQuery, RecommendationsService, FakeTmdbClient, Injectable

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.08
Nodes (25): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+17 more)

### Community 52 - "FriendsService"
Cohesion: 0.10
Nodes (15): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+7 more)

### Community 53 - "space-memories.service.ts"
Cohesion: 0.15
Nodes (11): hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, mostFrequent(), newestFirst(), SpaceMemoriesService, Injectable (+3 more)

### Community 55 - "NotificationPreferenceEntity"
Cohesion: 0.22
Nodes (9): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

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

### Community 60 - "ExternalContentRefEntity"
Cohesion: 0.22
Nodes (9): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.15
Nodes (27): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+19 more)

### Community 62 - "WatchlistItemEntity"
Cohesion: 0.22
Nodes (9): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+1 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.10
Nodes (26): CONTENT_TYPES, CreateRecommendationSessionDto, DecideRecommendationDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto, RecommendationRuntimeDto, REWATCH_POLICIES (+18 more)

### Community 65 - "group-recommendation-pool.ts"
Cohesion: 0.12
Nodes (17): TmdbCatalogEntry, ContentType, GroupRecommendationPool, latestAvailability, normalized(), onChosenService(), PoolRequest, Discovered (+9 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "route-rate-limit.spec.ts"
Cohesion: 0.28
Nodes (6): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule, Module

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.16
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "space-wishes.service.spec.ts"
Cohesion: 0.18
Nodes (13): SpaceWishEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+5 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "SettingsScreen.tsx"
Cohesion: 0.17
Nodes (14): OttSubscriptions(), saveJson(), SettingsScreen(), purgeSessionDrafts(), cancelAccountDeletion(), deleteMe(), deleteProfileImage(), exportMyData() (+6 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 78 - "media-selection.service.spec.ts"
Cohesion: 0.13
Nodes (10): MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, canonicalDetail, FakeMediaRepository, FakeTmdbClient (+2 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "watch-photo-processing.ts"
Cohesion: 0.11
Nodes (16): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS, Post (+8 more)

### Community 83 - "CommentEntity"
Cohesion: 0.12
Nodes (12): CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+4 more)

### Community 84 - "FriendshipEntity"
Cohesion: 0.12
Nodes (11): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 86 - "FriendInvitesService"
Cohesion: 0.15
Nodes (12): FriendInvitesController, Get, Param, Post, Req, UseGuards, alreadyFriends(), error() (+4 more)

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

### Community 92 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 93 - "SpacesScreen.tsx"
Cohesion: 0.05
Nodes (57): SpacesPageProps, DavasLogoLink(), TaskShell(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteDeadlineLabel() (+49 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.07
Nodes (23): CoreBottomNav(), CoreSidebar(), isActive(), loadUnreadCount(), MediaTypeControl(), NotificationBell(), RecordCard(), Tab (+15 more)

### Community 96 - "CommentsService"
Cohesion: 0.23
Nodes (5): CommentsService, normalizeContent(), Injectable, InjectRepository, Optional

### Community 97 - "src/index.ts"
Cohesion: 0.04
Nodes (53): MATCH_LABELS, searchSnippet(), WatchRatingControl(), Item, WatchSearchResults(), legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION (+45 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 100 - "FriendInviteEntity"
Cohesion: 0.20
Nodes (11): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 101 - "AvailabilityService"
Cohesion: 0.15
Nodes (9): AvailabilityService, Inject, Injectable, InjectRepository, Optional, InjectRepository, Optional, InjectRepository (+1 more)

### Community 102 - "media.controller.ts"
Cohesion: 0.09
Nodes (23): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSearchQueryDto, ApiPropertyOptional, IsInt, IsOptional (+15 more)

### Community 103 - "watch-photos.service.ts"
Cohesion: 0.38
Nodes (6): DAY_MS, HOUR_MS, uploadsRoot(), ORIGINAL_EXTENSIONS, watchPhotoPaths(), UserProfileResponse

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "SpacesService"
Cohesion: 0.06
Nodes (38): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+30 more)

### Community 119 - "profile-image-upload.ts"
Cohesion: 0.29
Nodes (8): ALLOWED_DECLARED_MIME_TYPES, detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, ValidatedProfileImage, validateProfileImageContent()

### Community 130 - "SignupDto"
Cohesion: 0.22
Nodes (9): SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional, IsString, Length (+1 more)

### Community 135 - "notifications.controller.ts"
Cohesion: 0.31
Nodes (6): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsBoolean, IsIn, UpdateNotificationPreferenceDto

### Community 136 - "core-routes.ts"
Cohesion: 0.28
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 137 - "MediaSelectionService"
Cohesion: 0.18
Nodes (7): selection, MediaSelectionService, Injectable, InjectRepository, Optional, InjectRepository, Optional

### Community 138 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 139 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.22
Nodes (10): ApiTags, GroupRecommendationsController, RecommendationsController, Body, Controller, Get, Param, Post (+2 more)

### Community 142 - "docs/README.md"
Cohesion: 0.28
Nodes (5): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas 문서, 관리 원칙

### Community 143 - "watch-events.service.ts"
Cohesion: 0.18
Nodes (14): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+6 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "UserEntity"
Cohesion: 0.11
Nodes (17): FakeUserRepository, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn (+9 more)

### Community 147 - "createTypeOrmOptions"
Cohesion: 0.21
Nodes (3): SpacesMembershipInvites1720670700000, statements(), createTypeOrmOptions()

### Community 148 - "DiaryReactionEntity"
Cohesion: 0.25
Nodes (8): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "DiaryEntity"
Cohesion: 0.08
Nodes (26): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryEntity (+18 more)

### Community 153 - "SpaceMemoriesQueryDto"
Cohesion: 0.33
Nodes (6): SpaceMemoriesQueryDto, IsInt, IsOptional, Max, Min, Type

### Community 154 - "AuthUi.tsx"
Cohesion: 0.20
Nodes (8): AuthShell(), errorText(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard(), useFocusOnShow()

### Community 155 - "MediaFavoriteEntity"
Cohesion: 0.25
Nodes (8): MediaFavoriteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 156 - "WatchPhotoEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity

### Community 157 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.12
Nodes (13): JwtCookieAuthGuard, readCookie(), Controller, Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user, Injectable (+5 more)

### Community 158 - "MediaService"
Cohesion: 0.14
Nodes (6): buildContentPreview(), formatWatchedDate(), MediaService, FakeTmdbClient, Injectable, InjectRepository

### Community 159 - "verify-upload-http.mjs"
Cohesion: 0.14
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthService }, ContractModule, require, { servePublicUploads }, { ThrottlerGuard, ThrottlerModule }, {
  UploadConcurrencyInterceptor,
} (+4 more)

### Community 161 - "tmdb-genres.ts"
Cohesion: 0.67
Nodes (3): resolveTmdbGenreLabel(), resolveTmdbGenreLabels(), TMDB_GENRE_LABELS_KO

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 169 - "SpaceAccessService"
Cohesion: 0.11
Nodes (10): DiaryAccessService, Injectable, Row, fakeRepository(), operatorMatches(), Row, setup(), SpaceAccessService (+2 more)

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 174 - "group-recommendations.service.spec.ts"
Cohesion: 0.22
Nodes (5): FakeDatabase, matchesValue(), Operator, Row, setup()

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 180 - "entities/index.ts"
Cohesion: 0.10
Nodes (19): AvailabilityObservationStatus, ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany (+11 more)

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 183 - "users.service.spec.ts"
Cohesion: 0.13
Nodes (4): FakeLifecycleDataSource, FakeOutbox, FakeUserRepository, SavedUser

### Community 185 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (27): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+19 more)

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

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 197 - "verify-security-http.mjs"
Cohesion: 0.22
Nodes (6): { APP_GUARD, NestFactory }, { configureHttpSecurity, OriginGuard }, ContractModule, { Controller, Get, Module, Post }, require, SecurityController

### Community 199 - "Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가, Source Nodes

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

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
Cohesion: 0.11
Nodes (30): WatchPhoto(), GalleryProps, PhotoViewer(), WatchPhotoGallery(), monthGrid(), RecapLine, recapLines(), seoulMonth() (+22 more)

### Community 219 - "browser-runtime-journey.cjs"
Cohesion: 0.33
Nodes (3): { chromium }, { mkdir, writeFile }, result

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 225 - "FileCleanupJobEntity"
Cohesion: 0.11
Nodes (11): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+3 more)

### Community 227 - "UsersService"
Cohesion: 0.23
Nodes (4): Injectable, InjectRepository, Optional, UsersService

### Community 230 - "notifications.service.spec.ts"
Cohesion: 0.13
Nodes (11): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 232 - ".inspect"
Cohesion: 0.31
Nodes (6): SpaceInvitesController, Get, Param, Post, Req, UseGuards

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (26): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn (+18 more)

### Community 259 - "TmdbClient"
Cohesion: 0.11
Nodes (7): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef, TmdbClient, Inject, Injectable, Optional

### Community 268 - "SpaceWatchController"
Cohesion: 0.44
Nodes (5): SpaceWatchController, Get, Param, Query, Req

### Community 271 - "AuthenticatedRequest"
Cohesion: 0.26
Nodes (11): AuthenticatedRequest, Body, Delete, Get, Param, Patch, Post, Put (+3 more)

## Knowledge Gaps
- **715 isolated node(s):** `WATCH_RATINGS`, `WATCH_VIEW_RELATIONS`, `SearchItem`, `WATCH_PHOTO_VARIANTS`, `ProcessedWatchPhoto` (+710 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **140 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.855461905) _(code changed — re-verify)_
- `RecordScreens.tsx` (3× useful, score=0.841535757)
- `WatchEventsService` (3× useful, score=0.837184745) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.562838866)
- `PwaStatus.tsx` (2× useful, score=0.562838866)
- `PwaStatus()` (2× useful, score=0.562838866)
- `SpaceMembershipEntity` (2× useful, score=0.560491189)
- `typeorm.config.ts` (2× useful, score=0.558845199)
- `GroupRecommendationSessionRequest` (2× useful, score=0.558766429) _(code changed — re-verify)_
- `api/package.json` (2× useful, score=0.50343449)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsController`, `UsersController`, `WatchlistService`, `notifications.controller.ts`, `NotificationsController`, `SpaceWatchController`, `DiariesService`, `users.controller.ts`, `invites.controller.ts`, `jwt-cookie-auth.guard.ts`, `auth.service.ts`, `AuthController`, `.file`, `SpaceWishesService`, `FriendsService`, `space-memories.service.ts`, `CreateRecommendationSessionDto`, `watch-photo-processing.ts`, `FriendInvitesService`, `media.controller.ts`, `.inspect`, `UpdateWatchEventDto`, `SpacesService`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `GroupRecommendationsService` connect `GroupRecommendationsService` to `CreateRecommendationSessionDto`, `AvailabilityService`, `app.module.ts`, `group-recommendations.service.spec.ts`, `group-recommendations.service.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `WatchEventsService` connect `WatchEventsService` to `SpaceAccessService`, `WatchPhotosService`, `SpaceWatchController`, `app.module.ts`, `watch-events.service.ts`, `UpdateWatchEventDto`, `space-memories.service.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `WATCH_RATINGS`, `WATCH_VIEW_RELATIONS`, `SearchItem` to the rest of the system?**
  _715 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Should `space-watch-model.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0946938775510204 - nodes in this community are weakly interconnected._