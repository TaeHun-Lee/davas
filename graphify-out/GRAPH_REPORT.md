# Graph Report - davas  (2026-10-06)

## Corpus Check
- 509 files · ~174,820 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3659 nodes · 6779 edges · 278 communities (207 shown, 71 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26b801f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistItemEntity
- SpaceHome.tsx
- devDependencies
- TaskShell
- MediaPosterRowSection.tsx
- SpacesService
- community.service.ts
- MediaService
- FriendsService
- Davas 개발 가이드
- contracts.ts
- app.module.ts
- getApiBaseUrl
- recommendations.ts
- diaries.controller.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- FriendsScreen.tsx
- NotificationPreferenceEntity
- AuthenticatedRequest
- scripts
- DiariesController
- group-recommendations.service.spec.ts
- ReactionsService
- WatchEventsService
- WishesScreen.tsx
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- WatchReactionEntity
- src/index.ts
- DiariesDashboardService
- app-security.ts
- reactions.ts
- scripts
- Controller
- AuthService
- WatchEventsController
- media.service.ts
- watch-photos.service.ts
- verify-deployment-contracts.mjs
- devDependencies
- auth.service.spec.ts
- RecordComposer.tsx
- UpdateWatchEventDto
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- notifications.ts
- AppShell.tsx
- DiaryCompanionEntity
- compilerOptions
- auth.ts
- compilerOptions
- shared/package.json
- MediaSearchQueryDto
- group-recommendations.service.ts
- community-types.ts
- spaces.service.ts
- CreateRecommendationSessionDto
- diaries-dashboard.service.ts
- MemoriesScreen.tsx
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
- auth.controller.ts
- ExploreDashboard.tsx
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- diaries.dashboard.spec.ts
- FriendInviteEntity
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- FriendInvitesController
- spaces.ts
- core.ts
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- AvailabilityService
- DiaryComposeScreen.tsx
- .upload
- @nestjs/typeorm
- passport
- 5. 기능 요구사항
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- NotificationsService
- CommunityTab
- tailwind.config.ts
- backup.sh
- TransactionOutboxEntity
- WatchPhotosService
- InviteCodeEntity
- WatchPhotoEntity
- GroupRecommendationPanel.tsx
- users.service.ts
- group-recommendations.controller.ts
- docs/README.md
- CreateDiaryDto
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- SearchField.tsx
- useCommunityDashboard.ts
- UpdateDiaryDto
- core-record-migration.spec.ts
- media.controller.ts
- WatchSourceEntity
- AuthUi.tsx
- watch-photos.service.spec.ts
- notifications.service.spec.ts
- 14. 단계별 확장
- .constructor
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- DiaryAccessService
- .constructor
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- UserConsentEntity
- @nestjs/passport
- .inspect
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- SpaceWatchController
- Q: What are the current Davas core functions and how are they delivered?
- SpacesMembershipInvites1720670700000
- package.json
- Davas
- verify-docs.mjs
- users.service.spec.ts
- entities/index.ts
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
- @nestjs/common
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석
- 4. 핵심 도메인 모델
- class-validator
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- DiaryEntity
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- GroupRecommendationSessions1720671100000
- browser-runtime-journey.cjs
- verify-line-endings.mjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- api/package.json
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
- FriendshipEntity
- Delete
- main.ts
- DeleteDateColumn
- OneToMany
- UpdateDateColumn
- TmdbClient
- Column
- CreateDateColumn
- Entity
- Index
- JoinColumn
- ManyToOne
- PrimaryGeneratedColumn
- Query
- Post
- ApiTags
- Body
- Module
- Patch
- diaries.service.ts
- FakeDatabase
- MediaFavoriteEntity
- watch-events.service.ts
- Controller
- Get
- Param
- Post
- Req

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 80 edges
2. `AuthenticatedRequest` - 74 edges
3. `DiaryEntity` - 57 edges
4. `getApiBaseUrl()` - 50 edges
5. `WatchEventsService` - 42 edges
6. `MediaEntity` - 42 edges
7. `NotificationsService` - 34 edges
8. `scripts` - 32 edges
9. `AuthService` - 31 edges
10. `TmdbClient` - 29 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `AppModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/app.module.ts → scripts/verify-upload-http.mjs
- `AuthModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/auth/auth.module.ts → scripts/verify-upload-http.mjs
- `CommunityModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/community/community.module.ts → scripts/verify-upload-http.mjs
- `FriendsModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/friends/friends.module.ts → scripts/verify-upload-http.mjs

## Import Cycles
- None detected.

## Communities (278 total, 71 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.12
Nodes (14): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.12
Nodes (16): DeleteMeDto, IsString, Length, ApiTags, Body, Delete, Get, Param (+8 more)

### Community 2 - "WatchlistItemEntity"
Cohesion: 0.07
Nodes (29): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+21 more)

### Community 3 - "SpaceHome.tsx"
Cohesion: 0.14
Nodes (24): HomeState, blindViewerRole, hasWrittenReaction(), LOCKED_HINTS, lockedReviewHint(), pendingConfirmations(), reactionRows(), SOURCE_LABELS (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "TaskShell"
Cohesion: 0.24
Nodes (5): TaskShell(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION

### Community 6 - "MediaPosterRowSection.tsx"
Cohesion: 0.07
Nodes (29): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, GenreRecommendationSection(), GenreRecommendationSectionProps (+21 more)

### Community 7 - "SpacesService"
Cohesion: 0.23
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+18 more)

### Community 9 - "MediaService"
Cohesion: 0.21
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

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
Cohesion: 0.15
Nodes (22): AppModule, AuthModule, parseJwtExpirySeconds(), UNIT_SECONDS, CommentsModule, Module, CommunityModule, DiariesModule (+14 more)

### Community 14 - "getApiBaseUrl"
Cohesion: 0.15
Nodes (22): CommunityComment, CommentAvatar(), CommentsStatus, CommunityCommentsSection(), CommunityCommentsSectionProps, getApiBaseUrl(), CommunityDashboardParams, createDiaryComment() (+14 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.08
Nodes (32): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus (+24 more)

### Community 16 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.11
Nodes (23): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+15 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (17): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+9 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.12
Nodes (13): AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content, contentRef, FakeAvailabilityProvider, now (+5 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.17
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "NotificationPreferenceEntity"
Cohesion: 0.22
Nodes (9): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 22 - "AuthenticatedRequest"
Cohesion: 0.23
Nodes (11): Get, Req, AuthenticatedRequest, SpacesController, Body, Delete, Get, Param (+3 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+24 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 25 - "group-recommendations.service.spec.ts"
Cohesion: 0.05
Nodes (39): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+31 more)

### Community 26 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Delete, Get, Param, Post, Req, CreateReactionDto (+4 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.16
Nodes (3): response(), Injectable, WatchEventsService

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.13
Nodes (21): Poster(), Filter, serviceLabels(), whereText(), WishesScreen(), MOOD_OPTIONS, WishPickCard(), useActiveSpace() (+13 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-transformer, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport-jwt (+13 more)

### Community 32 - "DiariesService"
Cohesion: 0.24
Nodes (6): apiError(), assertNotFuture(), DiariesService, fingerprint(), normalizedCreate(), Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.07
Nodes (35): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+27 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.11
Nodes (18): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 35 - "src/index.ts"
Cohesion: 0.05
Nodes (64): dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS, ReviewCard() (+56 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.20
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "app-security.ts"
Cohesion: 0.17
Nodes (13): sourceRoot, configureHttpSecurity(), isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, resolveAllowedOrigins(), resolveTrustProxy() (+5 more)

### Community 38 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "Controller"
Cohesion: 0.18
Nodes (10): AuthController, ApiTags, Body, Post, Res, Throttle, Controller, Public() (+2 more)

### Community 41 - "AuthService"
Cohesion: 0.20
Nodes (4): AuthService, Injectable, InjectRepository, Optional

### Community 42 - "WatchEventsController"
Cohesion: 0.22
Nodes (9): Body, Controller, Get, Param, Patch, Put, Req, WatchEventsController (+1 more)

### Community 43 - "media.service.ts"
Cohesion: 0.13
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 44 - "watch-photos.service.ts"
Cohesion: 0.21
Nodes (12): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+4 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.09
Nodes (19): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+11 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "auth.service.spec.ts"
Cohesion: 0.06
Nodes (17): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource, FileCleanupJobEntity, Column (+9 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.09
Nodes (24): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), today() (+16 more)

### Community 49 - "UpdateWatchEventDto"
Cohesion: 0.16
Nodes (27): CreateWatchEventDto, SaveWatchReactionDto, UpdateWatchEventDto, WATCH_RATINGS, WatchParticipantResponseDto, WatchReviewFieldsDto, WatchSourceDto, WatchTimelineQueryDto (+19 more)

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
Cohesion: 0.08
Nodes (25): FakeRepository, CommentsSection(), relativeTime(), describeNotification(), NotificationIcon, NotificationText, quoted(), item() (+17 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "DiaryCompanionEntity"
Cohesion: 0.12
Nodes (16): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryShareEntity (+8 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "auth.ts"
Cohesion: 0.09
Nodes (27): DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen(), ProfileHeaderCard() (+19 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "MediaSearchQueryDto"
Cohesion: 0.20
Nodes (9): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+1 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community-types.ts"
Cohesion: 0.13
Nodes (13): CommunityAuthorPageProps, CommunityAuthorProfileResponse, CommunityCommentsResponse, CommunityDiaryCard, CommunityDiaryDetail, CommunityTopic, CommunityAuthorProfile(), Avatar() (+5 more)

### Community 63 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries-dashboard.service.ts"
Cohesion: 0.21
Nodes (11): buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts() (+3 more)

### Community 66 - "MemoriesScreen.tsx"
Cohesion: 0.21
Nodes (10): AsyncState(), EmptyState(), WatchPhoto(), PhotoViewer(), WatchPhotoGallery(), MemoriesBody(), MemoriesScreen(), percent() (+2 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "MediaController"
Cohesion: 0.16
Nodes (12): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaController, ApiTags, Get, Param (+4 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.06
Nodes (36): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 15. 단계별 고도화, 16. 평가 지표, 17. 운영 안전장치 (+28 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.09
Nodes (35): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+27 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.19
Nodes (5): clamp01(), GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.10
Nodes (16): ACCESS_TOKEN_COOKIE, JwtCookieAuthGuard, readCookie(), Injectable, OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, user, Injectable (+8 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.controller.ts"
Cohesion: 0.14
Nodes (15): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, SignupDto, ApiProperty (+7 more)

### Community 78 - "ExploreDashboard.tsx"
Cohesion: 0.08
Nodes (33): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+25 more)

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
Cohesion: 0.21
Nodes (4): Injectable, InjectRepository, Optional, UsersService

### Community 83 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 84 - "FriendInviteEntity"
Cohesion: 0.13
Nodes (17): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+9 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.06
Nodes (38): SpaceEntity, SpaceStatus, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany (+30 more)

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

### Community 92 - "FriendInvitesController"
Cohesion: 0.29
Nodes (6): FriendInvitesController, Get, Param, Post, Req, UseGuards

### Community 93 - "spaces.ts"
Cohesion: 0.08
Nodes (39): SpacesPageProps, CoreAppShell(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteStatusMessage(), readActiveSpaceId() (+31 more)

### Community 95 - "core.ts"
Cohesion: 0.06
Nodes (35): DiaryDetailPageProps, MediaTypeControl(), NotificationBell(), RecordCard(), SearchField(), SearchIcon(), tabs, ViewingMethodControl() (+27 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.12
Nodes (16): PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT, PhotoUploadItem, RETRY_DELAYS_MS (+8 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "AvailabilityService"
Cohesion: 0.06
Nodes (30): mapWithConcurrency(), VARIANTS, WatchPhotosController, AvailabilityResponse, AvailabilityService, Inject, Injectable, InjectRepository (+22 more)

### Community 100 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 101 - ".upload"
Cohesion: 0.40
Nodes (4): Post, Throttle, UploadedFile, UseInterceptors

### Community 104 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "NotificationsService"
Cohesion: 0.07
Nodes (18): ApiTags, NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto, NotificationsController, Body (+10 more)

### Community 119 - "CommunityTab"
Cohesion: 0.29
Nodes (5): setCommunityDashboardQueryParam(), toCommunityTab(), CommunityTab, CommunitySegmentTabsProps, tabs

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.11
Nodes (13): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+5 more)

### Community 136 - "WatchPhotosService"
Cohesion: 0.18
Nodes (5): InjectRepository, apiError(), Injectable, InjectRepository, WatchPhotosService

### Community 137 - "InviteCodeEntity"
Cohesion: 0.12
Nodes (17): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+9 more)

### Community 138 - "WatchPhotoEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchPhotoEntity

### Community 139 - "GroupRecommendationPanel.tsx"
Cohesion: 0.14
Nodes (19): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+11 more)

### Community 140 - "users.service.ts"
Cohesion: 0.24
Nodes (9): watchPhotoPaths(), detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, validateProfileImageContent(), ProfileImageFile (+1 more)

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

### Community 147 - "useCommunityDashboard.ts"
Cohesion: 0.32
Nodes (6): CommunityDashboardResponse, CommunityDashboard(), CommunityFeedSection(), CommunityDashboardStatus, emptyCommunityDashboard, useCommunityDashboard()

### Community 148 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "media.controller.ts"
Cohesion: 0.08
Nodes (21): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule, selection, MediaSelectionDto, ApiProperty (+13 more)

### Community 153 - "WatchSourceEntity"
Cohesion: 0.29
Nodes (7): Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, WatchSourceEntity

### Community 154 - "AuthUi.tsx"
Cohesion: 0.15
Nodes (16): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo() (+8 more)

### Community 155 - "watch-photos.service.spec.ts"
Cohesion: 0.47
Nodes (4): fakeRepository(), operatorMatches(), Row, setup()

### Community 156 - "notifications.service.spec.ts"
Cohesion: 0.11
Nodes (16): NotificationEntity, SpaceWishEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, find(), findOne() (+8 more)

### Community 157 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

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
Cohesion: 0.06
Nodes (24): InjectRepository, Optional, DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+16 more)

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

### Community 171 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 174 - ".inspect"
Cohesion: 0.28
Nodes (6): SpaceInvitesController, Get, Param, Post, Req, UseGuards

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 177 - "SpaceWatchController"
Cohesion: 0.42
Nodes (6): SpaceWatchController, Controller, Get, Param, Req, Query

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

### Community 184 - "users.service.spec.ts"
Cohesion: 0.13
Nodes (4): FakeLifecycleDataSource, FakeOutbox, FakeUserRepository, SavedUser

### Community 185 - "entities/index.ts"
Cohesion: 0.06
Nodes (40): FakeUserRepository, AvailabilityObservationStatus, ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+32 more)

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

### Community 213 - "DiaryEntity"
Cohesion: 0.06
Nodes (32): CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+24 more)

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

### Community 251 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 254 - "main.ts"
Cohesion: 0.17
Nodes (9): ApiExceptionFilter, ConfigurableHttpServer, configureHttpServerTimeouts(), PUBLIC_UPLOAD_FOLDERS, servePublicUploads(), shouldEnableSwagger(), SwaggerEnvironment, bootstrap() (+1 more)

### Community 259 - "TmdbClient"
Cohesion: 0.15
Nodes (7): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef, TmdbClient, Inject, Injectable, Optional

### Community 274 - "diaries.service.ts"
Cohesion: 0.20
Nodes (8): isAfterSeoulToday(), seoulToday(), media, payload, queryDtoSource, serviceSource, DiaryListQuery, FEED_FRIENDS_ACCESS_PREDICATE

### Community 275 - "FakeDatabase"
Cohesion: 0.31
Nodes (3): coupleRecord(), FakeDatabase, setup()

### Community 276 - "MediaFavoriteEntity"
Cohesion: 0.17
Nodes (11): MediaFavoriteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 277 - "watch-events.service.ts"
Cohesion: 0.22
Nodes (8): hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, hasReviewFields(), ratingScale(), REVIEW_FIELDS, WATCH_VIEW_RELATIONS

## Knowledge Gaps
- **837 isolated node(s):** `FakeCommentsRepository`, `CommunityCommentView`, `PUBLIC_UPLOAD_FOLDERS`, `Row`, `WATCH_VIEW_RELATIONS` (+832 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **71 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.934169537) _(code changed — re-verify)_
- `RecordScreens.tsx` (3× useful, score=0.9189621)
- `WatchEventsService` (3× useful, score=0.914210769) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.614623421)
- `PwaStatus.tsx` (2× useful, score=0.614623421)
- `PwaStatus()` (2× useful, score=0.614623421)
- `SpaceMembershipEntity` (2× useful, score=0.612059744)
- `typeorm.config.ts` (2× useful, score=0.610262313)
- `GroupRecommendationSessionRequest` (2× useful, score=0.610176295)
- `api/package.json` (2× useful, score=0.549753486)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistItemEntity`, `community.service.ts`, `FriendsService`, `group-recommendations.controller.ts`, `diaries.controller.ts`, `media.controller.ts`, `DiariesController`, `ReactionsService`, `invites.controller.ts`, `watch-photos.service.ts`, `.inspect`, `UpdateWatchEventDto`, `spaces.service.ts`, `MediaController`, `jwt-cookie-auth.guard.ts`, `auth.controller.ts`, `FriendInvitesController`, `AvailabilityService`, `NotificationsService`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `hiddenReviewAccountIds()` connect `watch-events.service.ts` to `DiaryAccessService`, `SpaceHome.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `FakeCommentsRepository`, `CommunityCommentView`, `PUBLIC_UPLOAD_FOLDERS` to the rest of the system?**
  _837 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.1225071225071225 - nodes in this community are weakly interconnected._
- **Should `WatchlistItemEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.0700354609929078 - nodes in this community are weakly interconnected._