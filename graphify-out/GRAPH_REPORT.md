# Graph Report - davas  (2026-10-07)

## Corpus Check
- 535 files · ~198,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3878 nodes · 7276 edges · 308 communities (220 shown, 88 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8afa327e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- SpaceHome.tsx
- devDependencies
- SettingsScreen.tsx
- MediaFavoriteEntity
- core.ts
- community.service.ts
- metadata-provider.port.ts
- FriendsService
- Davas 개발 가이드
- contracts.ts
- app.module.ts
- media.ts
- NotificationsService
- src/index.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- FriendsScreen.tsx
- WatchEventDetailScreen.tsx
- verify-client-contracts.mts
- scripts
- AuthenticatedRequest
- RecommendationExposureEntity
- media-together-model.ts
- WatchEventsService
- wishes.ts
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- WatchPhotosService
- tmdb.client.ts
- WatchReactionEntity
- GroupRecommendationPanel.tsx
- RecommendationsController
- core-routes.ts
- diaries.controller.ts
- scripts
- AuthController
- AuthService
- auth.service.spec.ts
- recommendations.ts
- watch-photos.service.ts
- verify-deployment-contracts.mjs
- devDependencies
- media.service.ts
- RecordComposer.tsx
- SpacesService
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- notifications.ts
- AppShell.tsx
- diaries.service.ts
- compilerOptions
- ProfileEditScreen.tsx
- compilerOptions
- shared/package.json
- HomeRecommendations.tsx
- group-recommendations.service.ts
- community-types.ts
- CommentEntity
- CreateRecommendationSessionDto
- users.service.ts
- Delete
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- MediaSearchQueryDto
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- DiaryDashboard.tsx
- GroupRecommendationsService
- app-security.ts
- compilerOptions
- jwt-cookie-auth.guard.ts
- compilerOptions
- auth.controller.ts
- ExploreDashboard.tsx
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- InviteCodeEntity
- FriendInviteEntity
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- getMe
- spaces.ts
- CoreUi.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- entities/index.ts
- DiaryComposeScreen.tsx
- reactions.ts
- MediaController
- passport
- 15. 단계별 고도화
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- ReactionsService
- watch-events.service.ts
- tailwind.config.ts
- backup.sh
- TransactionOutboxEntity
- IsInt
- FriendshipEntity
- 8. 추천 파이프라인
- DiaryEntity
- @nestjs/core
- group-recommendations.controller.ts
- docs/README.md
- tmdb-detail.mapper.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- SearchField.tsx
- media-selection.service.spec.ts
- community.ts
- core-record-migration.spec.ts
- MediaSelectionService
- DiaryLikeEntity
- AuthUi.tsx
- MediaService
- notifications.service.spec.ts
- @nestjs/typeorm
- MediaPosterRowSection.tsx
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- DiaryAccessService
- DiaryRecentListSection.tsx
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- class-transformer
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- rxjs
- @nestjs/passport
- UseGuards
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- AvailabilityService
- Q: What are the current Davas core functions and how are they delivered?
- SpacesMembershipInvites1720670700000
- package.json
- Davas
- verify-docs.mjs
- UserConsentEntity
- ExternalContentRefEntity
- @davas/shared
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- media.service.spec.ts
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- devDependencies
- RecordExperience1720671200000
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- NotificationSubjects1720671400000
- group-recommendations.warmup.spec.ts
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- verify-security-http.mjs
- UserFollowEntity
- Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가
- TogetherMomentSection.tsx
- helmet
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- WatchPhotoEntity
- pg
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- MemoriesScreen.tsx
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- GroupRecommendationSessions1720671100000
- auth.ts
- browser-runtime-journey.cjs
- verify-line-endings.mjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- group-recommendations.service.spec.ts
- FileCleanupJobEntity
- getApiBaseUrl
- format-files.mjs
- @nestjs/config
- NotificationPreferenceEntity
- @nestjs/jwt
- DeleteDateColumn
- watch-photos.service.spec.ts
- contracts.spec.ts
- ArrayMaxSize
- ArrayUnique
- IsArray
- IsIn
- UpdateWatchEventDto
- space-watch.controller.ts
- IsString
- IsUUID
- tmdb-availability.adapter.ts
- AvailabilityObservationEntity
- MaxLength
- media.controller.ts
- CommunityTab
- ValidateIf
- ValidateNested
- users.service.spec.ts
- Delete
- AccountDeletionPurgeService
- useCommunityDashboard.ts
- DeleteDateColumn
- OneToMany
- UpdateDateColumn
- TmdbClient
- ApiExceptionFilter
- ProfileSettingsSection.tsx
- 4. 핵심 도메인 모델
- TransactionOutboxService
- AccountRecoveryAndInviteDeclines1720671500000
- 14. 단계별 확장
- ProfileAccountScreen.tsx
- SpaceMemoriesService
- Post
- ApiTags
- WatchEventsController
- Module
- .constructor
- 5. 필요한 데이터
- FakeDatabase
- Injectable
- InjectRepository
- 제품 요구사항 구현 추적표
- Column
- CreateDateColumn
- Controller
- Get
- Param
- Post
- Req
- Entity
- Index
- Optional
- JoinColumn
- ManyToOne
- PrimaryGeneratedColumn
- Body
- ApiTags
- Res
- Throttle
- Patch
- IsOptional
- IsUUID
- Matches
- Max
- Min
- Patch
- Put
- Type

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 69 edges
2. `AuthenticatedRequest` - 61 edges
3. `DiaryEntity` - 55 edges
4. `WatchEventsService` - 45 edges
5. `getApiBaseUrl()` - 44 edges
6. `NotificationsService` - 43 edges
7. `MediaEntity` - 40 edges
8. `AuthService` - 35 edges
9. `scripts` - 33 edges
10. `GroupRecommendationsService` - 31 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `RecordComposer()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/core/RecordComposer.tsx → packages/shared/src/index.ts
- `providerLabel()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/media/media-together-model.ts → packages/shared/src/index.ts
- `providerLabel()` --calls--> `ottServiceForProvider()`  [EXTRACTED]
  apps/web/src/components/media/media-together-model.ts → packages/shared/src/index.ts
- `watchableGroups()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/media/media-together-model.ts → packages/shared/src/index.ts

## Import Cycles
- None detected.

## Communities (308 total, 88 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.12
Nodes (14): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.10
Nodes (19): DeleteMeDto, IsString, Length, ApiTags, Body, Delete, Get, Param (+11 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "SpaceHome.tsx"
Cohesion: 0.11
Nodes (29): HomeState, SpaceHome(), SpaceHomeTimeline(), blindViewerRole, FORMAT_LABELS, hasWrittenReaction(), LOCKED_HINTS, lockedReviewHint() (+21 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "SettingsScreen.tsx"
Cohesion: 0.26
Nodes (11): OttSubscriptions(), saveJson(), SettingsScreen(), logout(), deleteMe(), deleteProfileImage(), exportMyData(), updateMe() (+3 more)

### Community 6 - "MediaFavoriteEntity"
Cohesion: 0.17
Nodes (11): MediaFavoriteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 7 - "core.ts"
Cohesion: 0.13
Nodes (21): ApiErrorBody, coreFetch(), CoreFetchOptions, createRecord(), CursorPage, deleteRecord(), getRecord(), isFormDataBody() (+13 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+18 more)

### Community 9 - "metadata-provider.port.ts"
Cohesion: 0.19
Nodes (8): TmdbMetadataAdapter, Injectable, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse, CatalogTitleDetail, CatalogTitleRef, MetadataProvider

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
Cohesion: 0.14
Nodes (24): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, Module, CommunityModule, DiariesModule (+16 more)

### Community 14 - "media.ts"
Cohesion: 0.16
Nodes (14): getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, usePeopleSearch(), getPersonCredits(), MediaOfferType, MediaSearchResponse, MyMediaDiary (+6 more)

### Community 15 - "NotificationsService"
Cohesion: 0.06
Nodes (22): ApiTags, NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto, NotificationsController, Body (+14 more)

### Community 16 - "src/index.ts"
Cohesion: 0.06
Nodes (47): MATCH_LABELS, searchSnippet(), Item, WatchSearchResults(), searchWatchEvents(), WatchEventWritePayload, WatchParticipant, WatchSource (+39 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.09
Nodes (20): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+12 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.11
Nodes (22): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+14 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.12
Nodes (13): AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content, contentRef, FakeAvailabilityProvider, now (+5 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.17
Nodes (19): EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite() (+11 more)

### Community 21 - "WatchEventDetailScreen.tsx"
Cohesion: 0.08
Nodes (30): PendingConfirmation(), dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS (+22 more)

### Community 22 - "verify-client-contracts.mts"
Cohesion: 0.10
Nodes (19): calls, ContractModule, controllers, dist(), failures, mainSource, { Module, ValidationPipe }, { NestFactory } (+11 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+25 more)

### Community 24 - "AuthenticatedRequest"
Cohesion: 0.20
Nodes (13): AuthenticatedRequest, DiariesController, ApiTags, Body, Delete, Get, Param, Patch (+5 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.07
Nodes (28): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+20 more)

### Community 26 - "media-together-model.ts"
Cohesion: 0.24
Nodes (12): OFFER_GROUPS, ourReactions(), providerLabel(), ReactionPerson, watchableGroups(), OurReactionsCard(), WatchableNowCard(), MediaAvailability (+4 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.14
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "wishes.ts"
Cohesion: 0.23
Nodes (12): base(), getWishStatus(), listWishes(), pickWish(), setWish(), calls, FetchCall, WishStatus (+4 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-validator, @nestjs/common, @nestjs/swagger, @nestjs/throttler, passport-jwt, reflect-metadata (+11 more)

### Community 32 - "WatchPhotosService"
Cohesion: 0.13
Nodes (9): InjectRepository, Optional, InjectRepository, InjectRepository, Optional, apiError(), Injectable, InjectRepository (+1 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.09
Nodes (26): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+18 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.11
Nodes (18): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 35 - "GroupRecommendationPanel.tsx"
Cohesion: 0.15
Nodes (18): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+10 more)

### Community 36 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Get, Param, Query, Throttle

### Community 37 - "core-routes.ts"
Cohesion: 0.32
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 38 - "diaries.controller.ts"
Cohesion: 0.10
Nodes (15): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource, DiaryListQueryDto, IsIn (+7 more)

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.24
Nodes (9): AuthController, Body, Controller, Get, Post, Public, Req, Res (+1 more)

### Community 41 - "AuthService"
Cohesion: 0.15
Nodes (7): AuthService, newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch(), Injectable, InjectRepository, Optional

### Community 42 - "auth.service.spec.ts"
Cohesion: 0.09
Nodes (7): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, FakeUserRepository, legal, SavedUser, SerializedDataSource

### Community 43 - "recommendations.ts"
Cohesion: 0.10
Nodes (31): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, useExploreRecommendations(), answersOf(), RequestStatus, useGroupRecommendations() (+23 more)

### Community 44 - "watch-photos.service.ts"
Cohesion: 0.19
Nodes (13): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+5 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @nestjs/cli, sql.js, ts-node, @types/bcrypt, @types/passport-jwt, @types/pg, name (+8 more)

### Community 47 - "media.service.ts"
Cohesion: 0.05
Nodes (43): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+35 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.10
Nodes (23): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), seriesProgressSummary() (+15 more)

### Community 49 - "SpacesService"
Cohesion: 0.06
Nodes (35): SpaceInvitesController, Controller, Get, Param, Post, Public, Req, SpacesController (+27 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.15
Nodes (8): MediaRecommendationItem, GENRE_PRESETS, GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, RecommendationsService, FakeTmdbClient, Injectable

### Community 53 - "notifications.ts"
Cohesion: 0.07
Nodes (30): FakeRepository, describeNotification(), NotificationIcon, NotificationText, quoted(), item(), ICON_PATHS, NotificationsScreen() (+22 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 55 - "diaries.service.ts"
Cohesion: 0.05
Nodes (40): media, payload, valid, Optional, queryDtoSource, serviceSource, apiError(), assertNotFuture() (+32 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "ProfileEditScreen.tsx"
Cohesion: 0.16
Nodes (11): CommentAvatar(), ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen(), ProfileHeaderCard(), ProfileHeaderCardProps (+3 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "HomeRecommendations.tsx"
Cohesion: 0.29
Nodes (5): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, getTrendingRecommendations()

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (26): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+18 more)

### Community 62 - "community-types.ts"
Cohesion: 0.13
Nodes (13): CommunityAuthorPageProps, CommunityAuthorProfileResponse, CommunityCommentsResponse, CommunityDiaryCard, CommunityDiaryDetail, CommunityTopic, CommunityAuthorProfile(), Avatar() (+5 more)

### Community 63 - "CommentEntity"
Cohesion: 0.08
Nodes (20): CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+12 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "users.service.ts"
Cohesion: 0.27
Nodes (8): detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, validateProfileImageContent(), ProfileImageFile, UserProfileResponse

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "MediaSearchQueryDto"
Cohesion: 0.20
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.09
Nodes (22): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+14 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.10
Nodes (31): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+23 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.18
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "app-security.ts"
Cohesion: 0.10
Nodes (22): sourceRoot, configureHttpSecurity(), CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveAllowedOrigins() (+14 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.08
Nodes (20): ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Controller, Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user (+12 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.controller.ts"
Cohesion: 0.10
Nodes (27): ApiProperty, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto (+19 more)

### Community 78 - "ExploreDashboard.tsx"
Cohesion: 0.10
Nodes (22): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), GenreRecommendationSection(), GenreRecommendationSectionProps (+14 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 83 - "InviteCodeEntity"
Cohesion: 0.12
Nodes (17): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+9 more)

### Community 84 - "FriendInviteEntity"
Cohesion: 0.09
Nodes (23): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+15 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.06
Nodes (33): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+25 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.16
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

### Community 92 - "getMe"
Cohesion: 0.21
Nodes (5): DavasHeader(), drawerItems, useFocusTrap(), ApiResponseError, getMe()

### Community 93 - "spaces.ts"
Cohesion: 0.07
Nodes (44): SpacesPageProps, ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteStatusMessage(), readActiveSpaceId(), rememberActiveSpace() (+36 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.05
Nodes (32): DiaryDetailPageProps, CoreAppShell(), MediaTypeControl(), Poster(), RecordCard(), SearchField(), SearchIcon(), tabs (+24 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.11
Nodes (19): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+11 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "entities/index.ts"
Cohesion: 0.07
Nodes (31): AvailabilityObservationStatus, ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany (+23 more)

### Community 100 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 101 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 102 - "MediaController"
Cohesion: 0.34
Nodes (7): MediaController, ApiTags, Get, Param, Query, Req, Throttle

### Community 104 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Delete, Get, Param, Post, Req, CreateReactionDto (+4 more)

### Community 119 - "watch-events.service.ts"
Cohesion: 0.18
Nodes (12): isAfterSeoulToday(), seoulToday(), hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, mostFrequent(), hasReviewFields() (+4 more)

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 137 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 138 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 139 - "DiaryEntity"
Cohesion: 0.09
Nodes (21): DiaryEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+13 more)

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.26
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 143 - "tmdb-detail.mapper.ts"
Cohesion: 0.25
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 147 - "media-selection.service.spec.ts"
Cohesion: 0.20
Nodes (5): canonicalDetail, FakeMediaRepository, FakeTmdbClient, SavedMedia, selection

### Community 148 - "community.ts"
Cohesion: 0.27
Nodes (12): CommunityComment, CommentsStatus, CommunityCommentsSection(), CommunityCommentsSectionProps, CommunityDashboardParams, createDiaryComment(), deleteDiaryComment(), getCommunityAuthorProfile() (+4 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "MediaSelectionService"
Cohesion: 0.14
Nodes (12): selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, Body, Post (+4 more)

### Community 153 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 154 - "AuthUi.tsx"
Cohesion: 0.18
Nodes (11): AuthShell(), errorText(), koreanDate(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard() (+3 more)

### Community 155 - "MediaService"
Cohesion: 0.15
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

### Community 156 - "notifications.service.spec.ts"
Cohesion: 0.09
Nodes (18): NotificationEntity, SpaceWishEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, CommunityNotificationView, CreateNotificationInput (+10 more)

### Community 158 - "MediaPosterRowSection.tsx"
Cohesion: 0.13
Nodes (16): DiaryListItem(), DiaryListItemProps, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput, cn(), getCalendarDayState() (+8 more)

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

### Community 162 - "DiaryAccessService"
Cohesion: 0.08
Nodes (16): InjectRepository, Optional, DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+8 more)

### Community 163 - "DiaryRecentListSection.tsx"
Cohesion: 0.18
Nodes (10): DiarySummary, DiaryRecentListSection(), DiaryRecentListSectionProps, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps (+2 more)

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 167 - "typeorm.config.ts"
Cohesion: 0.18
Nodes (4): CanonicalCatalogAvailability1720670900000, SpaceWishesAndSubscriptions1720671300000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "AvailabilityService"
Cohesion: 0.05
Nodes (31): mapWithConcurrency(), VARIANTS, WatchPhotosController, AvailabilityResponse, AvailabilityService, Inject, Injectable, InjectRepository (+23 more)

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

### Community 183 - "verify-docs.mjs"
Cohesion: 0.22
Nodes (6): decoder, errors, files, forbidden, required, root

### Community 184 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 185 - "ExternalContentRefEntity"
Cohesion: 0.22
Nodes (9): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "devDependencies"
Cohesion: 0.20
Nodes (10): tsx, concurrently, devDependencies, concurrently, prettier, tsx, typescript, prettier (+2 more)

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

### Community 198 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 199 - "Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가, Source Nodes

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 205 - "WatchPhotoEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity

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
Cohesion: 0.13
Nodes (25): AsyncState(), WatchPhoto(), GalleryProps, WatchPhotoGallery(), monthDayLabel(), monthGrid(), RecapLine, recapLines() (+17 more)

### Community 218 - "auth.ts"
Cohesion: 0.29
Nodes (7): koreanDate(), Message, SecuritySettings(), AuthenticatedUser, changePassword(), createRecoveryCode(), MeResponse

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

### Community 224 - "group-recommendations.service.spec.ts"
Cohesion: 0.26
Nodes (3): FakeDatabase, Row, setup()

### Community 225 - "FileCleanupJobEntity"
Cohesion: 0.11
Nodes (11): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+3 more)

### Community 226 - "getApiBaseUrl"
Cohesion: 0.31
Nodes (8): getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary, getDiary(), updateDiary()

### Community 230 - "NotificationPreferenceEntity"
Cohesion: 0.22
Nodes (9): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 233 - "watch-photos.service.spec.ts"
Cohesion: 0.47
Nodes (4): fakeRepository(), operatorMatches(), Row, setup()

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (27): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, IsInt, IsOptional, Matches, Max, Min (+19 more)

### Community 241 - "space-watch.controller.ts"
Cohesion: 0.22
Nodes (8): SpaceCalendarQueryDto, SpaceMemoriesQueryDto, IsInt, IsOptional, Matches, Max, Min, Type

### Community 244 - "tmdb-availability.adapter.ts"
Cohesion: 0.28
Nodes (3): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef

### Community 245 - "AvailabilityObservationEntity"
Cohesion: 0.25
Nodes (8): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 247 - "media.controller.ts"
Cohesion: 0.29
Nodes (4): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches

### Community 248 - "CommunityTab"
Cohesion: 0.29
Nodes (5): setCommunityDashboardQueryParam(), toCommunityTab(), CommunityTab, CommunitySegmentTabsProps, tabs

### Community 251 - "users.service.spec.ts"
Cohesion: 0.13
Nodes (4): FakeLifecycleDataSource, FakeOutbox, FakeUserRepository, SavedUser

### Community 254 - "useCommunityDashboard.ts"
Cohesion: 0.31
Nodes (7): CommunityDashboardResponse, CommunityDashboard(), CommunityFeedSection(), CommunityDashboardStatus, emptyCommunityDashboard, useCommunityDashboard(), getCommunityDashboard()

### Community 259 - "TmdbClient"
Cohesion: 0.21
Nodes (4): TmdbClient, Inject, Injectable, Optional

### Community 262 - "ProfileSettingsSection.tsx"
Cohesion: 0.33
Nodes (3): ProfileSettingsSection(), SettingItem, settings

### Community 263 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 266 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 268 - "SpaceMemoriesService"
Cohesion: 0.23
Nodes (9): newestFirst(), SpaceMemoriesService, Injectable, SpaceWatchController, Controller, Get, Param, Query (+1 more)

### Community 271 - "WatchEventsController"
Cohesion: 0.22
Nodes (8): Controller, Get, Param, Query, Req, WatchEventsController, Body, Put

### Community 274 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 275 - "FakeDatabase"
Cohesion: 0.31
Nodes (3): coupleRecord(), FakeDatabase, setup()

### Community 279 - "제품 요구사항 구현 추적표"
Cohesion: 0.67
Nodes (3): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계

## Knowledge Gaps
- **875 isolated node(s):** `NotificationType`, `WATCH_RATINGS`, `Row`, `WATCH_VIEW_RELATIONS`, `SearchItem` (+870 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **88 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.920949515) _(code changed — re-verify)_
- `RecordScreens.tsx` (3× useful, score=0.905957288) _(code changed — re-verify)_
- `WatchEventsService` (3× useful, score=0.901273196) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.605925497)
- `PwaStatus.tsx` (2× useful, score=0.605925497)
- `PwaStatus()` (2× useful, score=0.605925497)
- `SpaceMembershipEntity` (2× useful, score=0.6033981)
- `typeorm.config.ts` (2× useful, score=0.601626106)
- `GroupRecommendationSessionRequest` (2× useful, score=0.601541306) _(code changed — re-verify)_
- `api/package.json` (2× useful, score=0.541973577)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistService`, `community.service.ts`, `FriendsService`, `group-recommendations.controller.ts`, `NotificationsService`, `invites.controller.ts`, `diaries.controller.ts`, `watch-photos.service.ts`, `AvailabilityService`, `SpacesService`, `CommentEntity`, `jwt-cookie-auth.guard.ts`, `auth.controller.ts`, `FriendInviteEntity`, `MediaController`, `UpdateWatchEventDto`, `space-watch.controller.ts`, `ReactionsService`, `media.controller.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `hiddenReviewAccountIds()` connect `watch-events.service.ts` to `community.service.ts`, `DiaryAccessService`, `SpaceHome.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **What connects `NotificationType`, `WATCH_RATINGS`, `Row` to the rest of the system?**
  _875 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._