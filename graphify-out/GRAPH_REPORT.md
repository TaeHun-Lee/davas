# Graph Report - davas  (2026-10-10)

## Corpus Check
- 441 files · ~189,185 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3439 nodes · 6567 edges · 329 communities (178 shown, 151 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95312b98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsController
- UsersController
- WatchlistService
- NotificationsScreen.tsx
- devDependencies
- FakeDatabase
- WishesScreen.tsx
- NotificationsController
- SpaceEntity
- WatchPhotosService
- recommendations.ts
- Davas 개발 가이드
- core.ts
- app.module.ts
- ApiProperty
- CoreUi.tsx
- DiariesService
- personal-ranking.ts
- main.ts
- taste-profile.ts
- MemoriesScreen.tsx
- IsBoolean
- verify-client-contracts.mts
- scripts
- Body
- RecommendationExposureEntity
- users.controller.ts
- WatchEventsService
- TransactionOutboxEntity
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- group-recommendation-pool.spec.ts
- tmdb.client.ts
- WatchReactionEntity
- auth.service.ts
- useWatchPhotoUploads.ts
- availability.service.ts
- recommendations.service.spec.ts
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
- AvailabilityService
- RecommendationsService
- Davas 제품 요구사항 상세 설계
- FriendsService
- space-watch.controller.ts
- UpdateMeDto
- NotificationPreferenceEntity
- compilerOptions
- typeorm.config.ts
- compilerOptions
- shared/package.json
- ExternalContentRefEntity
- group-recommendations.service.ts
- WatchlistItemEntity
- Injectable
- GroupRecommendationsService
- SpaceWishesService
- ApiTags
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- 5. 기능 요구사항
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- media.controller.ts
- DiaryLikeEntity
- DiaryReactionEntity
- compilerOptions
- SettingsScreen.tsx
- compilerOptions
- Optional
- FakeMediaRepository
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- watch-photos.service.ts
- CommentEntity
- spaces.service.ts
- Public
- FriendInvitesService
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- MediaFavoriteEntity
- coreFetch
- UserConsentEntity
- CommentsService
- src/index.ts
- verify-caddy-headers.mjs
- UserFollowEntity
- InviteCodeEntity
- group-recommendation-pool.ts
- MediaSearchQueryDto
- taste-backtest.ts
- SignupDto
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- SpacesService
- .createRecoveryCode
- RecordExperience1720671200000
- WatchPhotoEntity
- OneToOne
- tailwind.config.ts
- backup.sh
- .updatePreference
- AuthUi.tsx
- .inspect
- users.service.ts
- FakeRepository
- class-validator
- DiaryCompanionEntity
- docs/README.md
- watch-events.service.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- WishPickQueryDto
- SpacesMembershipInvites1720670700000
- GroupRecommendationSessions1720671100000
- core-record-migration.spec.ts
- WatchSourceEntity
- @nestjs/swagger
- pg
- sharp
- MediaImageEntity
- Controller
- MediaService
- verify-upload-http.mjs
- access-cookie.ts
- 제품 요구사항 구현 추적표
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
- Injectable
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
- auth.service.spec.ts
- InjectRepository
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
- FakeCleanupRepository
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- Delete
- Param
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- Patch
- .constructor
- Post
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- 3. 사용자와 관계 모델
- Res
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- Injectable
- watch-events.ts
- Optional
- InjectRepository
- LegacyTmdbImageSafety1720671000000
- external-ref-and-session-decision-migration.spec.ts
- IsEnum
- Column
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
- CreateDateColumn
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
- ArrayMaxSize
- ArrayUnique
- Entity
- Index
- OneToMany
- IsArray
- SpaceMemoriesService
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
- Res
- Transform
- Type
- ValidateIf
- ValidateNested
- PrimaryGeneratedColumn
- UpdateDateColumn
- Inject

## God Nodes (most connected - your core abstractions)
1. `AuthenticatedRequest` - 80 edges
2. `coreFetch()` - 75 edges
3. `UserEntity` - 75 edges
4. `DiaryEntity` - 52 edges
5. `WatchEventsService` - 45 edges
6. `NotificationsService` - 36 edges
7. `GroupRecommendationsService` - 35 edges
8. `scripts` - 35 edges
9. `MediaEntity` - 32 edges
10. `AuthService` - 32 edges

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

## Communities (329 total, 151 thin omitted)

### Community 0 - "CommentsController"
Cohesion: 0.21
Nodes (9): CommentsController, ApiTags, Body, Controller, Delete, Get, Param, Post (+1 more)

### Community 1 - "UsersController"
Cohesion: 0.11
Nodes (17): accessCookieOptions(), ApiTags, Body, Controller, Get, Post, Public, Req (+9 more)

### Community 2 - "WatchlistService"
Cohesion: 0.13
Nodes (12): Body, Controller, Delete, Param, Post, Req, WatchlistController, CreateWatchlistDto (+4 more)

### Community 3 - "NotificationsScreen.tsx"
Cohesion: 0.14
Nodes (18): describeNotification(), NotificationIcon, NotificationText, quoted(), ICON_PATHS, NotificationsScreen(), LABELS, NotificationSettings() (+10 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (39): dependencies, @davas/shared, next, react, react-dom, devDependencies, autoprefixer, eslint (+31 more)

### Community 5 - "FakeDatabase"
Cohesion: 0.31
Nodes (3): coupleRecord(), FakeDatabase, setup()

### Community 6 - "WishesScreen.tsx"
Cohesion: 0.08
Nodes (33): CoreAppShell(), Poster(), SearchField(), EXPLORE_MOODS, ExploreScreen(), Kind, KINDS, Loaded (+25 more)

### Community 7 - "NotificationsController"
Cohesion: 0.17
Nodes (6): NotificationsController, ApiTags, Get, Param, Patch, Req

### Community 8 - "SpaceEntity"
Cohesion: 0.06
Nodes (36): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+28 more)

### Community 9 - "WatchPhotosService"
Cohesion: 0.15
Nodes (6): InjectRepository, InjectRepository, Optional, Injectable, InjectRepository, WatchPhotosService

### Community 10 - "recommendations.ts"
Cohesion: 0.07
Nodes (46): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), positive() (+38 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "core.ts"
Cohesion: 0.07
Nodes (39): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), OFFER_GROUPS, ourReactions() (+31 more)

### Community 13 - "app.module.ts"
Cohesion: 0.16
Nodes (19): AuthModule, JwtCookieAuthGuard, Injectable, CommentsModule, DiariesModule, Module, FriendsModule, InvitesModule (+11 more)

### Community 15 - "CoreUi.tsx"
Cohesion: 0.05
Nodes (34): CoreBottomNav(), CoreSidebar(), isActive(), loadUnreadCount(), MediaTypeControl(), NotificationBell(), RecordCard(), Tab (+26 more)

### Community 16 - "DiariesService"
Cohesion: 0.08
Nodes (24): DiariesController, ApiTags, Controller, Get, Query, Req, Throttle, queryDtoSource (+16 more)

### Community 17 - "personal-ranking.ts"
Cohesion: 0.17
Nodes (12): resolveTmdbGenreLabel(), resolveTmdbGenreLabels(), TMDB_GENRE_LABELS_KO, MediaRecommendationItem, alternateKinds(), rankForViewer(), NOW, titleKey() (+4 more)

### Community 18 - "main.ts"
Cohesion: 0.13
Nodes (11): AppModule, Module, ApiExceptionFilter, ConfigurableHttpServer, configureHttpServerTimeouts(), PUBLIC_UPLOAD_FOLDERS, servePublicUploads(), shouldEnableSwagger() (+3 more)

### Community 19 - "taste-profile.ts"
Cohesion: 0.24
Nodes (12): buildTasteProfile(), clamp(), favoriteFeatures(), featureShare(), predictTaste(), recencyWeight(), daysAgo(), NOW (+4 more)

### Community 20 - "MemoriesScreen.tsx"
Cohesion: 0.12
Nodes (24): AsyncState(), monthGrid(), RecapLine, recapLines(), seoulMonth(), shiftMonth(), MemoriesBody(), MemoriesScreen() (+16 more)

### Community 22 - "verify-client-contracts.mts"
Cohesion: 0.10
Nodes (19): calls, ContractModule, controllers, dist(), failures, mainSource, { Module, ValidationPipe }, { NestFactory } (+11 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (35): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+27 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.07
Nodes (28): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+20 more)

### Community 26 - "users.controller.ts"
Cohesion: 0.11
Nodes (17): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ALLOWED_DECLARED_MIME_TYPES (+9 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.14
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "TransactionOutboxEntity"
Cohesion: 0.20
Nodes (8): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, FakeOutboxRepository

### Community 29 - "invites.controller.ts"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-transformer, @davas/shared, helmet, @nestjs/core, @nestjs/platform-express, @nestjs/throttler (+11 more)

### Community 32 - "group-recommendation-pool.spec.ts"
Cohesion: 0.21
Nodes (9): latestAvailability, PoolRequest, Discovered, matches(), NOW, Operator, setup(), title() (+1 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.05
Nodes (35): TmdbAvailabilityAdapter, Injectable, InjectRepository, Optional, AvailabilityContentRef, DiscoverRecommendationsInput, Fetcher, MediaDetailInput (+27 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.11
Nodes (18): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 35 - "auth.service.ts"
Cohesion: 0.20
Nodes (14): accessCookieMaxAgeMs(), AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto (+6 more)

### Community 36 - "useWatchPhotoUploads.ts"
Cohesion: 0.11
Nodes (19): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+11 more)

### Community 37 - "availability.service.ts"
Cohesion: 0.07
Nodes (29): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+21 more)

### Community 38 - "recommendations.service.spec.ts"
Cohesion: 0.21
Nodes (6): FakeTasteHistory, FakeTmdbClient, item(), NOW, stored(), TasteHistoryResult

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.23
Nodes (10): AuthController, ApiTags, Body, Controller, Get, Post, Public, Req (+2 more)

### Community 42 - "contracts.ts"
Cohesion: 0.05
Nodes (42): EmptyState(), SearchIcon(), FriendInviteScreen(), empty, FriendsScreen(), getMe(), acceptFriend(), acceptFriendInvite() (+34 more)

### Community 44 - ".file"
Cohesion: 0.09
Nodes (17): Get, Param, Res, VARIANTS, files, result, decoder, errors (+9 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @nestjs/cli, ts-node, tsx, @types/bcrypt, @types/express, @types/pg, tsx (+8 more)

### Community 47 - "app-security.ts"
Cohesion: 0.19
Nodes (14): configureHttpSecurity(), CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveAllowedOrigins(), resolveTrustProxy() (+6 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.08
Nodes (29): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), seriesProgressSummary() (+21 more)

### Community 50 - "RecommendationsService"
Cohesion: 0.19
Nodes (6): GENRE_PRESETS, RecommendationsService, Injectable, TasteHistory, Injectable, InjectRepository

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.10
Nodes (21): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 4.1 공간 시작, 4.2 감상 기록 (+13 more)

### Community 52 - "FriendsService"
Cohesion: 0.10
Nodes (15): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+7 more)

### Community 53 - "space-watch.controller.ts"
Cohesion: 0.22
Nodes (8): SpaceCalendarQueryDto, SpaceMemoriesQueryDto, IsInt, IsOptional, Matches, Max, Min, Type

### Community 54 - "UpdateMeDto"
Cohesion: 0.20
Nodes (9): ApiPropertyOptional, ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, Length, Transform (+1 more)

### Community 55 - "NotificationPreferenceEntity"
Cohesion: 0.13
Nodes (15): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, NotificationPreferenceEntity, REQUIRED_NOTIFICATION_CATEGORIES, Column, CreateDateColumn, Entity, Index (+7 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "typeorm.config.ts"
Cohesion: 0.14
Nodes (5): WatchEventsAndPersonalReactions1720670800000, AccountRecoveryAndInviteDeclines1720671500000, MediaTmdbPopularity1720671800000, statements(), createTypeOrmOptions()

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
Cohesion: 0.12
Nodes (27): assignCandidateChannels(), CandidateAvailability, DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), freshness(), GROUP_RECOMMENDATION_ALGORITHM_VERSION, normalized() (+19 more)

### Community 62 - "WatchlistItemEntity"
Cohesion: 0.22
Nodes (9): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+1 more)

### Community 64 - "GroupRecommendationsService"
Cohesion: 0.05
Nodes (43): ApiTags, GroupRecommendationsController, CONTENT_TYPES, CreateRecommendationSessionDto, DecideRecommendationDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+35 more)

### Community 65 - "SpaceWishesService"
Cohesion: 0.12
Nodes (11): Delete, Get, Param, Put, Query, Req, notFound(), SpaceWishesService (+3 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "media.controller.ts"
Cohesion: 0.10
Nodes (18): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule, Module, selection, MediaSelectionDto (+10 more)

### Community 72 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 73 - "DiaryReactionEntity"
Cohesion: 0.25
Nodes (8): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "SettingsScreen.tsx"
Cohesion: 0.10
Nodes (25): OttSubscriptions(), Message, SecuritySettings(), saveJson(), SettingsScreen(), changePassword(), createRecoveryCode(), login() (+17 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.18
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.07
Nodes (28): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 14. 단계별 확장, 15. ADR로 확정할 항목, 1. 설계 목표, 1단계: 비공개 2~5명 (+20 more)

### Community 82 - "watch-photos.service.ts"
Cohesion: 0.14
Nodes (16): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS, Post (+8 more)

### Community 83 - "CommentEntity"
Cohesion: 0.13
Nodes (11): FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn (+3 more)

### Community 84 - "spaces.service.ts"
Cohesion: 0.09
Nodes (15): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+7 more)

### Community 86 - "FriendInvitesService"
Cohesion: 0.18
Nodes (9): acceptHarness(), serviceForInspect(), validInvite(), alreadyFriends(), error(), FriendInvitesService, hashToken(), Injectable (+1 more)

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

### Community 92 - "MediaFavoriteEntity"
Cohesion: 0.25
Nodes (8): MediaFavoriteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 93 - "coreFetch"
Cohesion: 0.06
Nodes (49): SpacesPageProps, DavasLogoLink(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteDeadlineLabel(), inviteStatusMessage() (+41 more)

### Community 95 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 96 - "CommentsService"
Cohesion: 0.23
Nodes (5): CommentsService, normalizeContent(), Injectable, InjectRepository, Optional

### Community 97 - "src/index.ts"
Cohesion: 0.05
Nodes (44): WatchRatingControl(), base(), getWishStatus(), listWishes(), pickWish(), setWish(), calls, FetchCall (+36 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 100 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (27): InjectRepository, Optional, FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+19 more)

### Community 101 - "group-recommendation-pool.ts"
Cohesion: 0.14
Nodes (11): mapWithConcurrency(), TmdbCatalogEntry, ContentType, GroupRecommendationPool, normalized(), onChosenService(), shiftDay(), tmdbType() (+3 more)

### Community 102 - "MediaSearchQueryDto"
Cohesion: 0.08
Nodes (22): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSearchQueryDto, ApiPropertyOptional, IsInt, IsOptional (+14 more)

### Community 103 - "taste-backtest.ts"
Cohesion: 0.18
Nodes (19): calculateGroupBase(), clamp01(), qualityPrior(), rankCandidate(), scoreParticipant(), tasteFeatures(), BACKTEST_MODELS, BacktestDataset (+11 more)

### Community 104 - "SignupDto"
Cohesion: 0.22
Nodes (9): SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional, IsString, Length (+1 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "SpacesService"
Cohesion: 0.07
Nodes (32): SpaceInvitesController, Get, Param, Post, Req, UseGuards, SpacesController, Body (+24 more)

### Community 119 - ".createRecoveryCode"
Cohesion: 0.40
Nodes (3): newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch()

### Community 130 - "WatchPhotoEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity

### Community 136 - "AuthUi.tsx"
Cohesion: 0.09
Nodes (25): AuthShell(), errorText(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard(), useFocusOnShow() (+17 more)

### Community 137 - ".inspect"
Cohesion: 0.32
Nodes (5): Get, Param, Post, Req, UseGuards

### Community 138 - "users.service.ts"
Cohesion: 0.18
Nodes (5): DAY_MS, HOUR_MS, AccountDeletionPurgeService, Injectable, UserProfileResponse

### Community 141 - "DiaryCompanionEntity"
Cohesion: 0.29
Nodes (7): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 143 - "watch-events.service.ts"
Cohesion: 0.18
Nodes (14): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+6 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "WishPickQueryDto"
Cohesion: 0.29
Nodes (7): ArrayMaxSize, IsArray, IsIn, IsOptional, IsUUID, Transform, WishPickQueryDto

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "WatchSourceEntity"
Cohesion: 0.29
Nodes (7): Column, Entity, Index, JoinColumn, PrimaryGeneratedColumn, WatchSourceEntity, OneToOne

### Community 156 - "MediaImageEntity"
Cohesion: 0.33
Nodes (6): MediaImageEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn

### Community 157 - "Controller"
Cohesion: 0.11
Nodes (13): sourceRoot, readCookie(), Controller, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user, Injectable, IS_PUBLIC_KEY (+5 more)

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

### Community 161 - "제품 요구사항 구현 추적표"
Cohesion: 0.67
Nodes (3): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 169 - "SpaceAccessService"
Cohesion: 0.05
Nodes (38): CommunityCommentView, DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+30 more)

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
Cohesion: 0.07
Nodes (35): FakeUserRepository, AvailabilityObservationStatus, DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+27 more)

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 183 - "users.service.spec.ts"
Cohesion: 0.13
Nodes (4): FakeLifecycleDataSource, FakeOutbox, FakeUserRepository, SavedUser

### Community 185 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "devDependencies"
Cohesion: 0.22
Nodes (9): concurrently, devDependencies, concurrently, prettier, tsx, typescript, prettier, tsx (+1 more)

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

### Community 205 - ".constructor"
Cohesion: 0.50
Nodes (3): Inject, InjectRepository, Optional

### Community 207 - "Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조, Source Nodes

### Community 208 - "3. 사용자와 관계 모델"
Cohesion: 0.50
Nodes (4): 3. 사용자와 관계 모델, 감상 참여자, 공유 공간, 사용자

### Community 210 - "verify-formatting.mjs"
Cohesion: 0.29
Nodes (5): acceptedBaseline, changedFiles, failures, files, prettierIgnore

### Community 211 - "core-runtime-surface.spec.ts"
Cohesion: 0.40
Nodes (4): controllerFiles(), PUBLIC_ROUTES, publicRoutes(), sourceRoot

### Community 213 - "watch-events.ts"
Cohesion: 0.05
Nodes (82): PendingConfirmation(), SpaceHomeTimeline(), dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen() (+74 more)

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 225 - "FileCleanupJobEntity"
Cohesion: 0.15
Nodes (10): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+2 more)

### Community 227 - "UsersService"
Cohesion: 0.21
Nodes (6): uploadsRoot(), watchPhotoPaths(), Injectable, InjectRepository, Optional, UsersService

### Community 230 - "notifications.service.spec.ts"
Cohesion: 0.13
Nodes (11): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (26): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn (+18 more)

### Community 268 - "SpaceMemoriesService"
Cohesion: 0.23
Nodes (9): mostFrequent(), newestFirst(), SpaceMemoriesService, Injectable, SpaceWatchController, Get, Param, Query (+1 more)

### Community 271 - "AuthenticatedRequest"
Cohesion: 0.22
Nodes (11): AuthenticatedRequest, Body, Delete, Get, Param, Patch, Post, Put (+3 more)

## Knowledge Gaps
- **723 isolated node(s):** `Row`, `Operator`, `SessionRequest`, `CandidateWithChannels`, `NOW` (+718 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **151 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.852812611)
- `RecordScreens.tsx` (3× useful, score=0.838929592)
- `WatchEventsService` (3× useful, score=0.834592054)
- `layout.tsx` (2× useful, score=0.561095801)
- `PwaStatus.tsx` (2× useful, score=0.561095801)
- `PwaStatus()` (2× useful, score=0.561095801)
- `SpaceMembershipEntity` (2× useful, score=0.558755395)
- `typeorm.config.ts` (2× useful, score=0.557114503)
- `GroupRecommendationSessionRequest` (2× useful, score=0.557035976)
- `api/package.json` (2× useful, score=0.501875395)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `UsersController`, `WatchlistService`, `NotificationsController`, `.updatePreference`, `.inspect`, `SpaceMemoriesService`, `app.module.ts`, `DiariesService`, `users.controller.ts`, `invites.controller.ts`, `Controller`, `auth.service.ts`, `AuthController`, `.file`, `FriendsService`, `space-watch.controller.ts`, `NotificationPreferenceEntity`, `GroupRecommendationsService`, `SpaceWishesService`, `media.controller.ts`, `watch-photos.service.ts`, `MediaSearchQueryDto`, `UpdateWatchEventDto`, `SpacesService`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `UserEntity` connect `entities/index.ts` to `WatchPhotoEntity`, `SpaceEntity`, `app.module.ts`, `DiaryCompanionEntity`, `WatchReactionEntity`, `auth.service.ts`, `availability.service.ts`, `AuthService`, `SpaceAccessService`, `NotificationPreferenceEntity`, `auth.service.spec.ts`, `WatchlistItemEntity`, `DiaryLikeEntity`, `DiaryReactionEntity`, `CommentEntity`, `spaces.service.ts`, `FriendInvitesService`, `MediaFavoriteEntity`, `UserConsentEntity`, `UserFollowEntity`, `InviteCodeEntity`, `notifications.service.spec.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `SpacesService` connect `SpacesService` to `SpaceEntity`, `app.module.ts`, `spaces.service.ts`, `Controller`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Row`, `Operator`, `SessionRequest` to the rest of the system?**
  _723 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `NotificationsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._