# Graph Report - davas  (2026-10-08)

## Corpus Check
- 542 files · ~206,824 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3901 nodes · 8096 edges · 242 communities (203 shown, 39 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8febf831`
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
- Controller
- DiaryAccessService
- FriendsService
- Davas 개발 가이드
- contracts.ts
- diaries.module.ts
- CreateDiaryDto
- notifications.ts
- diaries.service.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.ts
- FriendsScreen.tsx
- UpdateDiaryDto
- verify-client-contracts.mts
- scripts
- DiariesController
- WatchParticipantEntity
- MediaDetailModal.tsx
- WatchEventsService
- WishesScreen.tsx
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- SpacesService
- tmdb.client.ts
- WatchReactionEntity
- getApiBaseUrl
- WatchEventDetailScreen.tsx
- app-security.ts
- media-together-model.ts
- scripts
- AuthController
- AuthService
- SpacesController
- recommendations.ts
- watch-photo-processing.ts
- verify-deployment-contracts.mjs
- devDependencies
- SignupDto
- RecordComposer.tsx
- SpaceWishesService
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- spaces.service.ts
- AppShell.tsx
- DiariesService
- compilerOptions
- GroupRecommendationSessions1720671100000
- compilerOptions
- shared/package.json
- HomeRecommendations.tsx
- group-recommendations.service.ts
- community-types.ts
- metadata-provider.port.ts
- CreateRecommendationSessionDto
- auth.ts
- AvailabilityObservationEntity
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- AvailabilityService
- 1. 레거시 호환과 알려진 문제
- Davas 추천 전략 상세 설계
- DiaryDashboard.tsx
- GroupRecommendationsService
- SpaceEntity
- compilerOptions
- SettingsScreen.tsx
- compilerOptions
- auth.service.ts
- media.ts
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- InviteUseEntity
- FriendInvitesService
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- DiaryEntity
- coreFetch
- CoreUi.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- MediaEntity
- watch-events.service.ts
- TransactionOutboxEntity
- MediaController
- DiaryListQueryDto
- class-transformer
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- core.ts
- InviteCodeEntity
- tailwind.config.ts
- backup.sh
- SearchField.tsx
- core-routes.ts
- UserEntity
- FriendInviteEntity
- space-watch.controller.ts
- @nestjs/core
- GroupRecommendationsController
- docs/README.md
- timeline-groups.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- SpacesMembershipInvites1720670700000
- optional-jwt-cookie-auth.guard.spec.ts
- core-record-migration.spec.ts
- media-selection.service.ts
- community.service.ts
- AuthUi.tsx
- .assertAccountsInEverySpace
- media.service.spec.ts
- AuthenticatedRequest
- 5. 기능 요구사항
- verify-upload-http.mjs
- verify-edit-http.mjs
- diary-compose-utils.ts
- WishPickQueryDto
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- @nestjs/passport
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- Q: What are the current Davas core functions and how are they delivered?
- package.json
- Davas
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
- Q: 작품 검색 관람 경로와 상세 확인 및 친구 기록 구조
- @nestjs/platform-express
- verify-formatting.mjs
- core-runtime-surface.spec.ts
- MemoriesScreen.tsx
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- media.controller.ts
- browser-runtime-journey.cjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- MediaService
- FileCleanupJobEntity
- @nestjs/typeorm
- FakeCleanupRepository
- @nestjs/config
- notifications.service.ts
- @nestjs/jwt
- UserFollowEntity
- mapWithConcurrency
- contracts.spec.ts
- RecommendationSessionEntity
- AccountDeletionPurgeService
- rxjs
- UpdateWatchEventDto
- SpaceWishesAndSubscriptions1720671300000
- FakeRepository
- FakeLifecycleDataSource
- TmdbClient
- AccountRecoveryAndInviteDeclines1720671500000
- SpaceMemoriesService
- WatchEventsController

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

## Communities (242 total, 39 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.15
Nodes (12): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 1 - "UsersController"
Cohesion: 0.09
Nodes (23): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiTags (+15 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "space-watch-model.ts"
Cohesion: 0.07
Nodes (56): PendingConfirmation(), SpaceHomeTimeline(), CommentsSection(), relativeTime(), ReviewCard(), blindViewerRole, FORMAT_LABELS, groupByline() (+48 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 6 - "src/index.ts"
Cohesion: 0.05
Nodes (53): MATCH_LABELS, searchSnippet(), Item, WatchSearchResults(), legalDocuments, searchWatchEvents(), WatchEventWritePayload, WatchParticipant (+45 more)

### Community 7 - "NotificationsService"
Cohesion: 0.05
Nodes (25): NotificationType, NotificationsController, ApiTags, Body, Get, Param, Patch, Put (+17 more)

### Community 8 - "Controller"
Cohesion: 0.12
Nodes (12): Controller, IS_PUBLIC_KEY, Public(), WatchPhotosController, HealthController, Get, SpaceInvitesController, Get (+4 more)

### Community 9 - "DiaryAccessService"
Cohesion: 0.04
Nodes (51): SpaceWishEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+43 more)

### Community 10 - "FriendsService"
Cohesion: 0.11
Nodes (14): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+6 more)

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
Cohesion: 0.09
Nodes (28): describeNotification(), NotificationIcon, NotificationText, quoted(), ICON_PATHS, NotificationsScreen(), formatNotificationDate(), notificationMessage() (+20 more)

### Community 16 - "diaries.service.ts"
Cohesion: 0.07
Nodes (20): DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, media (+12 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.11
Nodes (18): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+10 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "availability.service.ts"
Cohesion: 0.09
Nodes (17): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content (+9 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

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
Cohesion: 0.06
Nodes (31): ParticipantPrediction, RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+23 more)

### Community 26 - "MediaDetailModal.tsx"
Cohesion: 0.17
Nodes (11): BasicInfoGrid(), DetailInfoCard(), FriendRecordsCard(), FriendRecordsStatus, MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal() (+3 more)

### Community 27 - "WatchEventsService"
Cohesion: 0.13
Nodes (4): SaveWatchReactionDto, response(), Injectable, WatchEventsService

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.14
Nodes (22): Poster(), Filter, serviceLabels(), whereText(), WishesScreen(), MOOD_OPTIONS, WishPickCard(), SpaceWishState (+14 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.11
Nodes (16): InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt, IsOptional (+8 more)

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
Cohesion: 0.07
Nodes (30): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+22 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.06
Nodes (30): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+22 more)

### Community 35 - "getApiBaseUrl"
Cohesion: 0.16
Nodes (21): CommunityComment, CommentsStatus, CommunityCommentsSection(), CommunityCommentsSectionProps, getApiBaseUrl(), CommunityDashboardParams, createDiaryComment(), deleteDiaryComment() (+13 more)

### Community 36 - "WatchEventDetailScreen.tsx"
Cohesion: 0.10
Nodes (20): dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS, WatchPhoto() (+12 more)

### Community 37 - "app-security.ts"
Cohesion: 0.08
Nodes (25): sourceRoot, ApiExceptionFilter, configureHttpSecurity(), CORS_METHODS, isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS (+17 more)

### Community 38 - "media-together-model.ts"
Cohesion: 0.24
Nodes (11): OFFER_GROUPS, ourReactions(), providerLabel(), ReactionPerson, watchableGroups(), OurReactionsCard(), WatchableNowCard(), MediaAvailability (+3 more)

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.26
Nodes (8): AuthController, ApiTags, Body, Get, Post, Req, Res, Throttle

### Community 41 - "AuthService"
Cohesion: 0.20
Nodes (5): AuthService, newRecoveryCode(), normalizeRecoveryCode(), passwordMismatch(), Injectable

### Community 42 - "SpacesController"
Cohesion: 0.25
Nodes (8): SpacesController, Body, Delete, Get, Param, Patch, Post, Req

### Community 43 - "recommendations.ts"
Cohesion: 0.06
Nodes (51): availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS, GroupRecommendationDraft, GroupRecommendationItem, numberOrUndefined(), REASON_LABELS (+43 more)

### Community 44 - "watch-photo-processing.ts"
Cohesion: 0.05
Nodes (38): photoError(), ProcessedWatchPhoto, processWatchPhoto(), UploadedPhotoFile, validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS (+30 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.08
Nodes (20): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+12 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "SignupDto"
Cohesion: 0.21
Nodes (9): SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional, IsString, Length (+1 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.08
Nodes (29): DiaryEditPageProps, DiaryNewPageProps, asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft() (+21 more)

### Community 49 - "SpaceWishesService"
Cohesion: 0.14
Nodes (12): AvailabilityResponse, SpaceWishesController, Delete, Get, Param, Put, Query, Req (+4 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.09
Nodes (21): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, buildTodayHeroItems(), getRecommendationMeta() (+13 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.08
Nodes (25): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+17 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Get, Param, Query, Throttle, GENRE_PRESETS (+6 more)

### Community 53 - "spaces.service.ts"
Cohesion: 0.27
Nodes (12): CreateSpaceDto, CreateSpaceInviteDto, RenameSpaceDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID (+4 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "DiariesService"
Cohesion: 0.24
Nodes (6): apiError(), assertNotFuture(), DiariesService, fingerprint(), normalizedCreate(), Injectable

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "HomeRecommendations.tsx"
Cohesion: 0.24
Nodes (8): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, WishSearch(), selectMedia(), toMediaSelectionPayload(), getTrendingRecommendations()

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (26): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+18 more)

### Community 62 - "community-types.ts"
Cohesion: 0.08
Nodes (24): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard, CommunityDiaryDetail (+16 more)

### Community 63 - "metadata-provider.port.ts"
Cohesion: 0.17
Nodes (8): TmdbMetadataAdapter, Injectable, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse, CatalogTitleDetail, CatalogTitleRef, MetadataProvider

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "auth.ts"
Cohesion: 0.10
Nodes (18): CommentAvatar(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, ProfileHeaderCard(), ProfileHeaderCardProps, ProfileImagePicker() (+10 more)

### Community 66 - "AvailabilityObservationEntity"
Cohesion: 0.08
Nodes (22): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+14 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

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
Cohesion: 0.20
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "SpaceEntity"
Cohesion: 0.07
Nodes (30): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+22 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "SettingsScreen.tsx"
Cohesion: 0.18
Nodes (15): genreOptions, ProfileEditScreen(), OttSubscriptions(), saveJson(), SettingsScreen(), getMe(), logout(), purgeSessionDrafts() (+7 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.22
Nodes (13): AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length, ChangePasswordDto, RecoveryCodeDto (+5 more)

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
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "UsersService"
Cohesion: 0.17
Nodes (6): TransactionOutboxService, Injectable, Injectable, InjectRepository, Optional, UsersService

### Community 83 - "InviteUseEntity"
Cohesion: 0.11
Nodes (18): InjectRepository, Optional, InviteUseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+10 more)

### Community 84 - "FriendInvitesService"
Cohesion: 0.14
Nodes (15): OptionalJwtCookieAuthGuard, OptionallyAuthenticatedRequest, Injectable, viewer, FriendInvitesController, Get, Param, Post (+7 more)

### Community 85 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 86 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

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

### Community 92 - "DiaryEntity"
Cohesion: 0.05
Nodes (44): CommunityCommentView, FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn (+36 more)

### Community 93 - "coreFetch"
Cohesion: 0.07
Nodes (47): SpacesPageProps, DavasLogoLink(), SpaceHome(), ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), inviteDeadlineLabel(), inviteStatusMessage() (+39 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.05
Nodes (38): DiaryDetailPageProps, AsyncState(), CoreAppShell(), CoreBottomNav(), CoreSidebar(), EmptyState(), isActive(), loadUnreadCount() (+30 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.12
Nodes (17): MyPhotosPanel(), Notice, PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT (+9 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "MediaEntity"
Cohesion: 0.05
Nodes (45): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+37 more)

### Community 100 - "watch-events.service.ts"
Cohesion: 0.19
Nodes (11): isAfterSeoulToday(), seoulToday(), hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, hasReviewFields(), ratingScale() (+3 more)

### Community 101 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 102 - "MediaController"
Cohesion: 0.26
Nodes (9): MediaController, ApiTags, Body, Get, Param, Post, Query, Req (+1 more)

### Community 103 - "DiaryListQueryDto"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 105 - "verify-auth-http.mjs"
Cohesion: 0.12
Nodes (12): {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
}, { APP_GUARD, NestFactory }, { AuthController }, { AuthService }, BoundaryController, ContractModule, { Controller, Get, Module, Req }, {
  FriendInvitesController,
} (+4 more)

### Community 118 - "core.ts"
Cohesion: 0.12
Nodes (18): ApiErrorBody, CoreFetchOptions, createRecord(), CursorPage, deleteRecord(), getRecord(), isFormDataBody(), listRecords() (+10 more)

### Community 119 - "InviteCodeEntity"
Cohesion: 0.18
Nodes (10): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 135 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 136 - "core-routes.ts"
Cohesion: 0.32
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 137 - "UserEntity"
Cohesion: 0.05
Nodes (38): FakeUserRepository, InjectRepository, Optional, DiaryLikeEntity, Column, CreateDateColumn, Entity, Index (+30 more)

### Community 138 - "FriendInviteEntity"
Cohesion: 0.16
Nodes (12): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+4 more)

### Community 139 - "space-watch.controller.ts"
Cohesion: 0.22
Nodes (8): SpaceCalendarQueryDto, SpaceMemoriesQueryDto, IsInt, IsOptional, Matches, Max, Min, Type

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.33
Nodes (6): GroupRecommendationsController, Body, Get, Param, Post, Req

### Community 142 - "docs/README.md"
Cohesion: 0.28
Nodes (5): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas 문서, 관리 원칙

### Community 143 - "timeline-groups.ts"
Cohesion: 0.29
Nodes (9): compareChronological(), compareNewest(), compareText(), groupTimeline(), share(), TimelineGroup, timelinePage(), TimelinePosition (+1 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "media-selection.service.ts"
Cohesion: 0.12
Nodes (13): selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, MediaSelectionService, canonicalDetail (+5 more)

### Community 153 - "community.service.ts"
Cohesion: 0.06
Nodes (36): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+28 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.16
Nodes (12): AuthShell(), errorText(), koreanDate(), LoginCard(), post(), ResetPasswordCard(), safeReturn(), SignupCard() (+4 more)

### Community 157 - "AuthenticatedRequest"
Cohesion: 0.15
Nodes (8): ACCESS_TOKEN_COOKIE, AuthenticatedRequest, JwtCookieAuthGuard, readCookie(), Injectable, WatchPhotoVariant, Injectable, UploadConcurrencyInterceptor

### Community 158 - "5. 기능 요구사항"
Cohesion: 0.22
Nodes (9): 5.1 계정과 인증, 5.2 공간과 초대, 5.3 작품 카탈로그, 5.4 감상 기록과 평가, 5.5 공유와 조회, 5.6 추천, 5.7 알림, 5.8 개인정보와 생명주기 (+1 more)

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

### Community 162 - "WishPickQueryDto"
Cohesion: 0.29
Nodes (7): ArrayMaxSize, IsArray, IsIn, IsOptional, IsUUID, Transform, WishPickQueryDto

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 166 - "query-performance-contract.spec.ts"
Cohesion: 0.15
Nodes (5): CoreQueryIndexes1720670800000, FeedIndexSharedAtPredicate1720670900000, queryDtoSource, serviceSource, FEED_FRIENDS_ACCESS_PREDICATE

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): CanonicalCatalogAvailability1720670900000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 181 - "package.json"
Cohesion: 0.20
Nodes (9): engines, node, npm, name, private, version, workspaces, apps/* (+1 more)

### Community 182 - "Davas"
Cohesion: 0.33
Nodes (6): Davas, TMDB 출처 표기, 기술 스택, 문서, 빠른 시작, 자주 쓰는 명령

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
Cohesion: 0.11
Nodes (19): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput (+11 more)

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
Cohesion: 0.15
Nodes (22): monthDayLabel(), monthGrid(), RecapLine, recapLines(), seoulDay(), seoulMonth(), shiftMonth(), MemoriesBody() (+14 more)

### Community 218 - "media.controller.ts"
Cohesion: 0.10
Nodes (19): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule, AvailabilityQueryDto, ApiPropertyOptional, IsOptional (+11 more)

### Community 219 - "browser-runtime-journey.cjs"
Cohesion: 0.33
Nodes (3): { chromium }, { mkdir, writeFile }, result

### Community 221 - "verify-release-content.mjs"
Cohesion: 0.33
Nodes (5): legalSource, root, sharedSource, versions, violations

### Community 223 - "run-tests.mjs"
Cohesion: 0.40
Nodes (3): requested, root, scopes

### Community 224 - "MediaService"
Cohesion: 0.16
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

### Community 225 - "FileCleanupJobEntity"
Cohesion: 0.15
Nodes (10): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+2 more)

### Community 230 - "notifications.service.ts"
Cohesion: 0.07
Nodes (28): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+20 more)

### Community 232 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 236 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 240 - "UpdateWatchEventDto"
Cohesion: 0.21
Nodes (25): CreateWatchEventDto, SetWatchPhotosDto, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsInt (+17 more)

### Community 259 - "TmdbClient"
Cohesion: 0.20
Nodes (9): TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult() (+1 more)

### Community 268 - "SpaceMemoriesService"
Cohesion: 0.22
Nodes (9): mostFrequent(), newestFirst(), SpaceMemoriesService, Injectable, SpaceWatchController, Get, Param, Query (+1 more)

### Community 271 - "WatchEventsController"
Cohesion: 0.20
Nodes (10): Body, Delete, Get, Param, Patch, Post, Put, Query (+2 more)

## Knowledge Gaps
- **883 isolated node(s):** `1. 준비물`, `A. Docker Compose로 전체 실행`, `B. Web·API는 직접, PostgreSQL만 Docker로`, `환경 변수`, `실행 구조` (+878 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.909050202)
- `RecordScreens.tsx` (3× useful, score=0.894251685)
- `WatchEventsService` (3× useful, score=0.889628114)
- `layout.tsx` (2× useful, score=0.598096515)
- `PwaStatus.tsx` (2× useful, score=0.598096515)
- `PwaStatus()` (2× useful, score=0.598096515)
- `SpaceMembershipEntity` (2× useful, score=0.595601774)
- `typeorm.config.ts` (2× useful, score=0.593852675)
- `GroupRecommendationSessionRequest` (2× useful, score=0.59376897)
- `api/package.json` (2× useful, score=0.534970899)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `NotificationsService` to `src/index.ts`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsService`, `UsersController`, `WatchlistService`, `NotificationsService`, `Controller`, `FriendsService`, `space-watch.controller.ts`, `SpaceMemoriesService`, `GroupRecommendationsController`, `WatchEventsController`, `diaries.service.ts`, `DiariesController`, `community.service.ts`, `invites.controller.ts`, `AuthController`, `SpacesController`, `watch-photo-processing.ts`, `SpaceWishesService`, `spaces.service.ts`, `auth.service.ts`, `FriendInvitesService`, `media.controller.ts`, `MediaController`, `notifications.service.ts`, `UpdateWatchEventDto`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `NotificationsService` to `Controller`, `diaries.module.ts`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **What connects `1. 준비물`, `A. Docker Compose로 전체 실행`, `B. Web·API는 직접, PostgreSQL만 Docker로` to the rest of the system?**
  _883 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._