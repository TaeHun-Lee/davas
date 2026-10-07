# Graph Report - davas  (2026-10-07)

## Corpus Check
- 539 files · ~201,751 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3903 nodes · 7347 edges · 304 communities (219 shown, 85 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a563cdfc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistItemEntity
- space-watch-model.ts
- devDependencies
- SettingsScreen.tsx
- diary-dashboard-types.ts
- core.ts
- community.service.ts
- media.service.ts
- AuthenticatedRequest
- Davas 개발 가이드
- contracts.ts
- app.module.ts
- CreateDiaryDto
- NotificationsService
- src/index.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- getApiBaseUrl
- UpdateDiaryDto
- verify-client-contracts.mts
- scripts
- diaries.controller.ts
- RecommendationExposureEntity
- useGroupRecommendations.ts
- WatchEventsService
- WishesScreen.tsx
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- WatchPhotosService
- tmdb.client.ts
- WatchReactionEntity
- GroupRecommendationPanel.tsx
- Controller
- core-routes.ts
- diaries.dashboard.spec.ts
- scripts
- AuthController
- AuthService
- auth.service.spec.ts
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
- getMe
- compilerOptions
- shared/package.json
- HomeRecommendations.tsx
- group-recommendations.service.ts
- community-types.ts
- DiaryEntity
- CreateRecommendationSessionDto
- profile-image-upload.ts
- Delete
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- media.controller.ts
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
- FriendInvitesService
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- DiaryAccessService
- spaces.ts
- CoreUi.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- entities/index.ts
- timeline-groups.ts
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
- UserEntity
- 8. 추천 파이프라인
- DiariesDashboardService
- @nestjs/core
- group-recommendations.controller.ts
- docs/README.md
- watchlist.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- SearchField.tsx
- SignupDto
- community.ts
- core-record-migration.spec.ts
- MediaSelectionService
- WatchSourceEntity
- AuthUi.tsx
- MediaService
- NotificationEntity
- @nestjs/typeorm
- DiaryRecentListSection.tsx
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- notifications.service.spec.ts
- DiarySummarySection.tsx
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
- 5. 기능 요구사항
- @davas/shared
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- route-rate-limit.spec.ts
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
- .createRecoveryCode
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
- diaries.ts
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
- space-memories.service.ts
- IsString
- IsUUID
- diaries-feed-query.spec.ts
- .constructor
- MaxLength
- friends/page.tsx
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
- ProfileSettingsSection.tsx
- Injectable
- users.service.ts
- AccountRecoveryAndInviteDeclines1720671500000
- InjectRepository
- Optional
- SpaceWatchController
- Post
- ApiTags
- WatchEventsController
- Module
- watch-events.service.spec.ts
- .constructor
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
6. `NotificationsService` - 42 edges
7. `MediaEntity` - 40 edges
8. `AuthService` - 35 edges
9. `scripts` - 33 edges
10. `GroupRecommendationsService` - 31 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `RecordComposer()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/core/RecordComposer.tsx → packages/shared/src/index.ts
- `groupTimeline()` --indirect_call--> `share()`  [INFERRED]
  apps/api/src/diaries/timeline-groups.ts → apps/api/src/diaries/timeline-groups.spec.ts
- `hiddenReviewAccountIds()` --indirect_call--> `reaction()`  [INFERRED]
  apps/api/src/diaries/blind-review.ts → apps/web/src/components/spaces/space-watch-model.spec.ts
- `providerLabel()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/media/media-together-model.ts → packages/shared/src/index.ts

## Import Cycles
- None detected.

## Communities (304 total, 85 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.12
Nodes (14): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.11
Nodes (19): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiTags (+11 more)

### Community 2 - "WatchlistItemEntity"
Cohesion: 0.07
Nodes (29): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+21 more)

### Community 3 - "space-watch-model.ts"
Cohesion: 0.08
Nodes (48): HomeState, PendingConfirmation(), SpaceHome(), SpaceHomeTimeline(), WatchPhoto(), CommentsSection(), relativeTime(), ReviewCard() (+40 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "SettingsScreen.tsx"
Cohesion: 0.28
Nodes (10): OttSubscriptions(), saveJson(), SettingsScreen(), deleteMe(), deleteProfileImage(), exportMyData(), updateMe(), UpdateMePayload (+2 more)

### Community 6 - "diary-dashboard-types.ts"
Cohesion: 0.18
Nodes (13): DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind, DiaryInsightGrid() (+5 more)

### Community 7 - "core.ts"
Cohesion: 0.15
Nodes (19): ApiErrorBody, coreFetch(), CoreFetchOptions, createRecord(), CursorPage, deleteRecord(), getRecord(), isFormDataBody() (+11 more)

### Community 8 - "community.service.ts"
Cohesion: 0.10
Nodes (21): buildContentPreview(), CommunityAuthorProfileResponse, CommunityDashboardQuery, CommunityDashboardResponse, CommunityDiaryCard, CommunityDiaryDetail, CommunityService, CommunityTopic (+13 more)

### Community 9 - "media.service.ts"
Cohesion: 0.13
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 10 - "AuthenticatedRequest"
Cohesion: 0.12
Nodes (15): AuthenticatedRequest, FriendsController, Body, Delete, Get, Param, Patch, Post (+7 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (34): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+26 more)

### Community 13 - "app.module.ts"
Cohesion: 0.14
Nodes (24): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, Module, CommunityModule, DiariesModule (+16 more)

### Community 14 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 15 - "NotificationsService"
Cohesion: 0.07
Nodes (17): ApiTags, NotificationsController, Body, Controller, Get, Param, Patch, Put (+9 more)

### Community 16 - "src/index.ts"
Cohesion: 0.04
Nodes (73): MATCH_LABELS, searchSnippet(), dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen() (+65 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.10
Nodes (19): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+11 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.14
Nodes (14): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+6 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.09
Nodes (16): TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content, contentRef (+8 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.22
Nodes (19): EmptyState(), FriendInviteScreen(), empty, getApiBaseUrl(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite() (+11 more)

### Community 21 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 22 - "verify-client-contracts.mts"
Cohesion: 0.10
Nodes (19): calls, ContractModule, controllers, dist(), failures, mainSource, { Module, ValidationPipe }, { NestFactory } (+11 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+25 more)

### Community 24 - "diaries.controller.ts"
Cohesion: 0.11
Nodes (21): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+13 more)

### Community 25 - "RecommendationExposureEntity"
Cohesion: 0.07
Nodes (30): ParticipantPrediction, RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+22 more)

### Community 26 - "useGroupRecommendations.ts"
Cohesion: 0.21
Nodes (12): answersOf(), RequestStatus, useGroupRecommendations(), createGroupRecommendationSession(), getGroupRecommendationSession(), calls, FetchCall, listGroupRecommendationSessions() (+4 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.15
Nodes (4): hasReviewFields(), response(), WatchEventsService, Injectable

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.13
Nodes (20): Poster(), Filter, serviceLabels(), whereText(), WishesScreen(), MOOD_OPTIONS, WishPickCard(), mediaTypeLabel() (+12 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.11
Nodes (16): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+8 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-validator, @nestjs/common, @nestjs/swagger, @nestjs/throttler, passport-jwt, reflect-metadata (+11 more)

### Community 32 - "WatchPhotosService"
Cohesion: 0.19
Nodes (5): InjectRepository, apiError(), Injectable, InjectRepository, WatchPhotosService

### Community 33 - "tmdb.client.ts"
Cohesion: 0.07
Nodes (35): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+27 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.12
Nodes (18): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 35 - "GroupRecommendationPanel.tsx"
Cohesion: 0.15
Nodes (18): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+10 more)

### Community 36 - "Controller"
Cohesion: 0.23
Nodes (8): Controller, CommunityController, ApiTags, Get, Param, Query, Req, CommunityTab

### Community 37 - "core-routes.ts"
Cohesion: 0.32
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 38 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.26
Nodes (9): AuthController, Body, Controller, Get, Post, Public, Req, Res (+1 more)

### Community 41 - "AuthService"
Cohesion: 0.20
Nodes (3): AuthService, Injectable, InjectRepository

### Community 42 - "auth.service.spec.ts"
Cohesion: 0.09
Nodes (7): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, FakeUserRepository, legal, SavedUser, SerializedDataSource

### Community 43 - "recommendations.ts"
Cohesion: 0.13
Nodes (19): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, useExploreRecommendations(), fetchRecommendation(), GenreRecommendationPreset, GenreRecommendationPresetsResponse (+11 more)

### Community 44 - "watch-photos.service.ts"
Cohesion: 0.21
Nodes (12): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+4 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @nestjs/cli, sql.js, ts-node, @types/bcrypt, @types/passport-jwt, @types/pg, name (+8 more)

### Community 47 - "diaries-dashboard.service.ts"
Cohesion: 0.21
Nodes (11): buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts() (+3 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.08
Nodes (27): DiaryEditPageProps, DiaryNewPageProps, asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft() (+19 more)

### Community 49 - "SpacesService"
Cohesion: 0.06
Nodes (35): SpaceInvitesController, Controller, Get, Param, Post, Public, Req, SpacesController (+27 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.08
Nodes (25): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+17 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Get, Param, Query, Throttle, GENRE_PRESETS (+6 more)

### Community 53 - "notifications.ts"
Cohesion: 0.07
Nodes (30): FakeRepository, describeNotification(), NotificationIcon, NotificationText, quoted(), item(), ICON_PATHS, NotificationsScreen() (+22 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 55 - "diaries.service.ts"
Cohesion: 0.17
Nodes (9): media, payload, apiError(), assertNotFuture(), DiariesService, DiaryListQuery, fingerprint(), normalizedCreate() (+1 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "getMe"
Cohesion: 0.12
Nodes (13): DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen(), ProfileHeaderCard() (+5 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "HomeRecommendations.tsx"
Cohesion: 0.15
Nodes (10): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles (+2 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (26): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+18 more)

### Community 62 - "community-types.ts"
Cohesion: 0.14
Nodes (11): CommunityAuthorPageProps, CommunityAuthorProfileResponse, CommunityDiaryCard, CommunityTopic, CommunityAuthorProfile(), Avatar(), CommunityDiaryCard(), CommunityDiaryCardProps (+3 more)

### Community 63 - "DiaryEntity"
Cohesion: 0.04
Nodes (65): CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+57 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "profile-image-upload.ts"
Cohesion: 0.39
Nodes (6): detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, validateProfileImageContent()

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "media.controller.ts"
Cohesion: 0.12
Nodes (14): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt (+6 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.08
Nodes (26): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+18 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.19
Nodes (17): DiaryCalendarDay, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten() (+9 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.18
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "app-security.ts"
Cohesion: 0.07
Nodes (25): sourceRoot, ApiExceptionFilter, configureHttpSecurity(), CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS (+17 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.10
Nodes (15): ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user, Injectable (+7 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.controller.ts"
Cohesion: 0.22
Nodes (13): ApiProperty, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto (+5 more)

### Community 78 - "ExploreDashboard.tsx"
Cohesion: 0.07
Nodes (39): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), FavoriteMovie, FavoriteMoviesSection() (+31 more)

### Community 79 - "Davas 운영 가이드 (Raspberry Pi)"
Cohesion: 0.15
Nodes (13): 1. 호스트와 네트워크, 2. 최초 설정, 3. 운영 DB 원칙, 4.1 백업, 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전), 4.3 migration 확인과 적용, 4.4 트래픽 전환, 4. 배포 절차 (+5 more)

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.20
Nodes (10): API Security Boundaries, Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Documentation Hygiene, Editing Boundaries, Graphify, Repository Map (+2 more)

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.07
Nodes (28): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 14. 단계별 확장, 15. ADR로 확정할 항목, 1. 설계 목표, 1단계: 비공개 2~5명 (+20 more)

### Community 82 - "UsersService"
Cohesion: 0.19
Nodes (4): Injectable, InjectRepository, Optional, UsersService

### Community 83 - "InviteCodeEntity"
Cohesion: 0.12
Nodes (17): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+9 more)

### Community 84 - "FriendInvitesService"
Cohesion: 0.17
Nodes (11): FriendInvitesController, Get, Param, Post, Req, UseGuards, alreadyFriends(), error() (+3 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.06
Nodes (34): SpaceEntity, SpaceStatus, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany (+26 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.08
Nodes (30): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), OFFER_GROUPS, ourReactions() (+22 more)

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
Cohesion: 0.17
Nodes (6): InjectRepository, Optional, DiaryAccessService, Injectable, InjectRepository, Optional

### Community 93 - "spaces.ts"
Cohesion: 0.09
Nodes (35): SpacesPageProps, ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteStatusMessage(), readActiveSpaceId(), rememberActiveSpace() (+27 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.06
Nodes (26): DiaryDetailPageProps, CoreAppShell(), MediaTypeControl(), RecordCard(), SearchField(), SearchIcon(), tabs, TaskShell() (+18 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.12
Nodes (18): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+10 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "entities/index.ts"
Cohesion: 0.05
Nodes (48): AvailabilityObservationEntity, AvailabilityObservationStatus, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+40 more)

### Community 100 - "timeline-groups.ts"
Cohesion: 0.29
Nodes (9): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+1 more)

### Community 101 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 102 - "MediaController"
Cohesion: 0.26
Nodes (9): MediaController, ApiTags, Body, Get, Param, Post, Query, Req (+1 more)

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
Cohesion: 0.12
Nodes (14): isAfterSeoulToday(), seoulToday(), hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, ratingScale(), REVIEW_FIELDS (+6 more)

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.18
Nodes (8): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, FakeOutboxRepository

### Community 137 - "UserEntity"
Cohesion: 0.07
Nodes (29): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+21 more)

### Community 138 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 139 - "DiariesDashboardService"
Cohesion: 0.20
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.26
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 143 - "watchlist.ts"
Cohesion: 0.42
Nodes (7): WatchlistScreen(), addWatchlist(), getWatchlist(), json(), removeWatchlist(), updateWatchlist(), WatchlistItem

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 147 - "SignupDto"
Cohesion: 0.22
Nodes (9): SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional, IsString, Length (+1 more)

### Community 148 - "community.ts"
Cohesion: 0.21
Nodes (15): CommunityComment, CommunityCommentsResponse, CommunityDiaryDetail, CommentAvatar(), CommentsStatus, CommunityCommentsSection(), CommunityCommentsSectionProps, CommunityDashboardParams (+7 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "MediaSelectionService"
Cohesion: 0.11
Nodes (13): selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, MediaSelectionService, canonicalDetail (+5 more)

### Community 153 - "WatchSourceEntity"
Cohesion: 0.22
Nodes (8): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity, WatchSourceKind

### Community 154 - "AuthUi.tsx"
Cohesion: 0.18
Nodes (11): AuthShell(), errorText(), koreanDate(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard() (+3 more)

### Community 155 - "MediaService"
Cohesion: 0.09
Nodes (6): Optional, buildContentPreview(), formatWatchedDate(), MediaService, FakeTmdbClient, Injectable

### Community 156 - "NotificationEntity"
Cohesion: 0.18
Nodes (13): NotificationEntity, SpaceWishEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn (+5 more)

### Community 158 - "DiaryRecentListSection.tsx"
Cohesion: 0.16
Nodes (13): DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps, CalendarDayStateInput, cn(), getCalendarDayState() (+5 more)

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

### Community 162 - "notifications.service.spec.ts"
Cohesion: 0.09
Nodes (14): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+6 more)

### Community 163 - "DiarySummarySection.tsx"
Cohesion: 0.22
Nodes (8): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, SectionTitle(), SectionTitleProps

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
Cohesion: 0.06
Nodes (30): mapWithConcurrency(), VARIANTS, WatchPhotosController, AvailabilityResponse, AvailabilityService, Inject, Injectable, InjectRepository (+22 more)

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
Cohesion: 0.22
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 185 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 188 - "route-rate-limit.spec.ts"
Cohesion: 0.32
Nodes (5): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule

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
Cohesion: 0.22
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 199 - "Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Pi에서 친구 기록 feed가 마이그레이션 완료 후에도 500을 반환하는 실제 원인은 무엇인가, Source Nodes

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

### Community 205 - ".createRecoveryCode"
Cohesion: 0.40
Nodes (3): newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch()

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
Nodes (25): AsyncState(), monthDayLabel(), monthGrid(), RecapLine, recapLines(), seoulDay(), seoulMonth(), shiftMonth() (+17 more)

### Community 218 - "auth.ts"
Cohesion: 0.23
Nodes (8): koreanDate(), Message, SecuritySettings(), ApiResponseError, AuthenticatedUser, changePassword(), createRecoveryCode(), MeResponse

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

### Community 226 - "diaries.ts"
Cohesion: 0.22
Nodes (7): CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary, getDiary(), updateDiary()

### Community 230 - "NotificationPreferenceEntity"
Cohesion: 0.13
Nodes (15): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, NotificationPreferenceEntity, REQUIRED_NOTIFICATION_CATEGORIES, Column, CreateDateColumn, Entity, Index (+7 more)

### Community 233 - "watch-photos.service.spec.ts"
Cohesion: 0.47
Nodes (4): fakeRepository(), operatorMatches(), Row, setup()

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.20
Nodes (27): CreateWatchEventDto, SaveWatchReactionDto, SetWatchPhotosDto, IsInt, IsOptional, Matches, Max, Min (+19 more)

### Community 241 - "space-memories.service.ts"
Cohesion: 0.16
Nodes (12): mostFrequent(), newestFirst(), SpaceMemoriesService, Injectable, SpaceCalendarQueryDto, SpaceMemoriesQueryDto, IsInt, IsOptional (+4 more)

### Community 244 - "diaries-feed-query.spec.ts"
Cohesion: 0.50
Nodes (3): queryDtoSource, serviceSource, FEED_FRIENDS_ACCESS_PREDICATE

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
Cohesion: 0.20
Nodes (5): ProfileAccountScreen(), ProfileSettingsSection(), SettingItem, settings, logout()

### Community 264 - "users.service.ts"
Cohesion: 0.19
Nodes (8): watchPhotoPaths(), NotificationRequestInput, OutboxInput, TransactionOutboxService, Injectable, ProfileImageFile, UpdateMeDto, UserProfileResponse

### Community 268 - "SpaceWatchController"
Cohesion: 0.33
Nodes (6): SpaceWatchController, Controller, Get, Param, Query, Req

### Community 271 - "WatchEventsController"
Cohesion: 0.20
Nodes (8): Controller, Get, Param, Query, Req, WatchEventsController, Body, Put

### Community 275 - "watch-events.service.spec.ts"
Cohesion: 0.24
Nodes (4): coupleRecord(), FakeDatabase, Row, setup()

### Community 279 - "제품 요구사항 구현 추적표"
Cohesion: 0.67
Nodes (3): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계

## Knowledge Gaps
- **877 isolated node(s):** `TimelineGroup`, `TimelinePosition`, `Row`, `WATCH_VIEW_RELATIONS`, `SearchItem` (+872 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **85 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.918509871)
- `RecordScreens.tsx` (3× useful, score=0.903557359)
- `WatchEventsService` (3× useful, score=0.898885675) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.604320369)
- `PwaStatus.tsx` (2× useful, score=0.604320369)
- `PwaStatus()` (2× useful, score=0.604320369)
- `SpaceMembershipEntity` (2× useful, score=0.601799667)
- `typeorm.config.ts` (2× useful, score=0.600032367)
- `GroupRecommendationSessionRequest` (2× useful, score=0.599947791) _(code changed — re-verify)_
- `api/package.json` (2× useful, score=0.540537861)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistItemEntity`, `group-recommendations.controller.ts`, `diaries.controller.ts`, `invites.controller.ts`, `Controller`, `watch-photos.service.ts`, `AvailabilityService`, `SpacesService`, `DiaryEntity`, `media.controller.ts`, `jwt-cookie-auth.guard.ts`, `auth.controller.ts`, `FriendInvitesService`, `MediaController`, `NotificationPreferenceEntity`, `UpdateWatchEventDto`, `space-memories.service.ts`, `ReactionsService`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `hiddenReviewAccountIds()` connect `watch-events.service.ts` to `community.service.ts`, `space-memories.service.ts`, `space-watch-model.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `TimelineGroup`, `TimelinePosition`, `Row` to the rest of the system?**
  _877 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `WatchlistItemEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.0700354609929078 - nodes in this community are weakly interconnected._