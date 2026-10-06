# Graph Report - davas  (2026-10-06)

## Corpus Check
- 508 files · ~170,190 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3632 nodes · 6763 edges · 275 communities (203 shown, 72 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb0a8d53`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsController
- UsersController
- WatchlistService
- SpaceHome.tsx
- devDependencies
- src/index.ts
- MediaPosterRowSection.tsx
- SpacesService
- community.service.ts
- TmdbClient
- FriendsService
- Davas 개발 가이드
- contracts.ts
- app.module.ts
- ExploreDashboard.tsx
- recommendations.ts
- diaries.controller.ts
- HomeDashboard.tsx
- ProfileDashboard.tsx
- availability.service.spec.ts
- getApiBaseUrl
- NotificationPreferenceEntity
- AuthenticatedRequest
- scripts
- DiariesController
- group-recommendations.service.spec.ts
- ReactionsService
- Controller
- WishesScreen.tsx
- invites.controller.ts
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
- .constructor
- watch-photos.service.ts
- verify-deployment-contracts.mjs
- devDependencies
- FileCleanupJobEntity
- RecordComposer.tsx
- WatchEventsService
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- notifications.ts
- AppShell.tsx
- entities/index.ts
- compilerOptions
- DavasHeader.tsx
- compilerOptions
- shared/package.json
- media.service.ts
- group-recommendations.service.ts
- community.ts
- spaces.service.ts
- CreateRecommendationSessionDto
- diaries-dashboard.service.ts
- DiaryInsightGrid.tsx
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
- media.controller.ts
- CommunityDiaryCard.tsx
- Davas 운영 가이드 (Raspberry Pi)
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- UsersService
- AvailabilityService
- FriendshipEntity
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- CommentsService
- core.ts
- CoreUi.tsx
- useWatchPhotoUploads.ts
- verify-caddy-headers.mjs
- SpaceWishesController
- DiaryComposeScreen.tsx
- .upload
- @nestjs/typeorm
- passport
- DiaryCompanionEntity
- verify-auth-http.mjs
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- NotificationsController
- AvailabilityObservationEntity
- tailwind.config.ts
- backup.sh
- TransactionOutboxEntity
- WatchPhotosService
- InviteCodeEntity
- DiaryEntity
- GroupRecommendationPanel.tsx
- users.service.ts
- group-recommendations.controller.ts
- docs/README.md
- CreateDiaryDto
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- SearchField.tsx
- space-wishes.service.ts
- UpdateDiaryDto
- core-record-migration.spec.ts
- MediaSelectionService
- availability.service.ts
- core-routes.ts
- AuthUi.tsx
- notifications.service.spec.ts
- NotificationsService
- FakeRepository
- verify-upload-http.mjs
- verify-edit-http.mjs
- MemoriesScreen.tsx
- DiaryAccessService
- SpaceAccessService
- Q: Can Davas be deployed and verified on Raspberry Pi?
- AccountLifecycleNotificationOutbox1720671000000
- query-performance-contract.spec.ts
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- DiarySummarySection.tsx
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- UserConsentEntity
- @nestjs/passport
- .inspect
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- BaseSchema1720670300000
- diaries.dashboard.spec.ts
- Q: What are the current Davas core functions and how are they delivered?
- SpacesMembershipInvites1720670700000
- package.json
- Davas
- verify-docs.mjs
- FakeLifecycleDataSource
- UserEntity
- notifications.controller.ts
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
- ExternalContentRefEntity
- WatchEventsAndPersonalReactions1720670800000
- LegacyTmdbImageSafety1720671000000
- GroupRecommendationSessions1720671100000
- diary-dashboard-types.ts
- browser-runtime-journey.cjs
- verify-line-endings.mjs
- verify-release-content.mjs
- DropLegacyMediaIdentityIndex1720671100000
- run-tests.mjs
- api/package.json
- 15. 단계별 고도화
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
- jwt-config.ts
- Delete
- .constructor
- 5. 필요한 데이터
- DeleteDateColumn
- OneToMany
- UpdateDateColumn
- .me
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
- 제품 요구사항 구현 추적표

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 90 edges
2. `AuthenticatedRequest` - 74 edges
3. `DiaryEntity` - 62 edges
4. `getApiBaseUrl()` - 50 edges
5. `MediaEntity` - 45 edges
6. `WatchEventsService` - 38 edges
7. `NotificationsService` - 36 edges
8. `scripts` - 32 edges
9. `AuthService` - 31 edges
10. `GroupRecommendationsService` - 28 edges

## Surprising Connections (you probably didn't know these)
- `RateLimitContractModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/common/route-rate-limit.spec.ts → scripts/verify-upload-http.mjs
- `ottLabel()` --references--> `OTT_SERVICES`  [EXTRACTED]
  apps/web/src/components/spaces/GroupRecommendationPanel.tsx → packages/shared/src/index.ts
- `hiddenReviewAccountIds()` --indirect_call--> `reaction()`  [INFERRED]
  apps/api/src/diaries/blind-review.ts → apps/web/src/components/spaces/space-watch-model.spec.ts
- `AppModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/app.module.ts → scripts/verify-upload-http.mjs
- `AuthModule` --references--> `{ Module }`  [EXTRACTED]
  apps/api/src/auth/auth.module.ts → scripts/verify-upload-http.mjs

## Import Cycles
- None detected.

## Communities (275 total, 72 thin omitted)

### Community 0 - "CommentsController"
Cohesion: 0.20
Nodes (9): CommentsController, ApiTags, Body, Delete, Get, Param, Patch, Post (+1 more)

### Community 1 - "UsersController"
Cohesion: 0.13
Nodes (16): ApiTags, Body, Delete, Get, Param, Patch, Post, Req (+8 more)

### Community 2 - "WatchlistService"
Cohesion: 0.11
Nodes (19): Body, Delete, Get, Param, Patch, Post, Query, Req (+11 more)

### Community 3 - "SpaceHome.tsx"
Cohesion: 0.17
Nodes (17): HomeState, pendingConfirmations(), reactionRows(), SOURCE_LABELS, event(), reaction(), watchedDayLabel(), WatchReactionRow (+9 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "src/index.ts"
Cohesion: 0.07
Nodes (30): legalDocuments, CORE_DIARY_VISIBILITIES, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION, DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, MEDIA_TYPES (+22 more)

### Community 6 - "MediaPosterRowSection.tsx"
Cohesion: 0.11
Nodes (18): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput (+10 more)

### Community 7 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Get, Param, Query, Req, buildContentPreview(), CommunityAuthorProfileResponse (+18 more)

### Community 9 - "TmdbClient"
Cohesion: 0.15
Nodes (10): imageUrl(), TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult() (+2 more)

### Community 10 - "FriendsService"
Cohesion: 0.11
Nodes (14): FriendsController, Body, Delete, Get, Param, Patch, Post, Query (+6 more)

### Community 11 - "Davas 개발 가이드"
Cohesion: 0.12
Nodes (16): 1. 준비물, 2. 로컬 실행, 3. 코드 지도, 4. API 보안 경계, 5. 데이터베이스와 migration, 6. 검증, 7. 자주 겪는 문제, A. Docker Compose로 전체 실행 (+8 more)

### Community 12 - "contracts.ts"
Cohesion: 0.06
Nodes (35): AccountDeletionResponse, ApiErrorBody, AuthenticatedUser, CoreDiaryVisibility, CursorPage, DeleteResult, FriendInviteState, FriendRelationship (+27 more)

### Community 13 - "app.module.ts"
Cohesion: 0.18
Nodes (20): AppModule, AuthModule, CommentsModule, Module, CommunityModule, DiariesModule, Module, FriendsModule (+12 more)

### Community 14 - "ExploreDashboard.tsx"
Cohesion: 0.07
Nodes (37): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips() (+29 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.09
Nodes (29): ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus, useExploreRecommendations(), RequestStatus, useGroupRecommendations(), createGroupRecommendationSession() (+21 more)

### Community 16 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min (+1 more)

### Community 17 - "HomeDashboard.tsx"
Cohesion: 0.09
Nodes (26): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+18 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (18): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+10 more)

### Community 19 - "availability.service.spec.ts"
Cohesion: 0.11
Nodes (12): TmdbAvailabilityAdapter, Injectable, content, contentRef, FakeAvailabilityProvider, now, AVAILABILITY_PROVIDER, AvailabilityContentRef (+4 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.15
Nodes (24): empty, FriendsScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary (+16 more)

### Community 21 - "NotificationPreferenceEntity"
Cohesion: 0.22
Nodes (9): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 22 - "AuthenticatedRequest"
Cohesion: 0.27
Nodes (9): AuthenticatedRequest, SpacesController, Body, Delete, Get, Param, Patch, Post (+1 more)

### Community 23 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit:prod, build, db:generate, db:migrate, db:migrate:prod, db:revert, db:show (+24 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Delete, Get, Param, Patch, Post (+4 more)

### Community 25 - "group-recommendations.service.spec.ts"
Cohesion: 0.05
Nodes (38): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+30 more)

### Community 26 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Delete, Get, Param, Post, Req, CreateReactionDto (+4 more)

### Community 27 - "Controller"
Cohesion: 0.16
Nodes (9): Controller, FriendInvitesController, Get, Param, Post, Req, UseGuards, HealthController (+1 more)

### Community 28 - "WishesScreen.tsx"
Cohesion: 0.12
Nodes (23): SearchField(), Filter, serviceLabels(), whereText(), WishesScreen(), MOOD_OPTIONS, WishPickCard(), useActiveSpace() (+15 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.10
Nodes (18): PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDERS, InvitesController, Body, Get, Post, Req, CreateInviteDto, IsInt (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.06
Nodes (31): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+23 more)

### Community 31 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-transformer, @davas/shared, helmet, @nestjs/swagger, @nestjs/throttler, passport-jwt (+13 more)

### Community 32 - "diaries.service.ts"
Cohesion: 0.05
Nodes (30): isAfterSeoulToday(), seoulToday(), media, payload, queryDtoSource, serviceSource, apiError(), assertNotFuture() (+22 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.07
Nodes (28): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType, PersonCreditsInput (+20 more)

### Community 34 - "WatchReactionEntity"
Cohesion: 0.10
Nodes (20): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+12 more)

### Community 35 - "watch-events.ts"
Cohesion: 0.07
Nodes (50): dayChip(), detailChips(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), WEEKDAYS, WatchPhoto() (+42 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.21
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "app-security.ts"
Cohesion: 0.11
Nodes (17): ApiExceptionFilter, configureHttpSecurity(), isPublicBootstrapInvitePlaceholder(), OriginGuard, PUBLIC_BOOTSTRAP_INVITE_PLACEHOLDER_SET, resolveAllowedOrigins(), resolveTrustProxy(), SAFE_METHODS (+9 more)

### Community 38 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 39 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, migration:revert, migration:revert:src, migration:run, migration:run:src (+5 more)

### Community 40 - "AuthController"
Cohesion: 0.14
Nodes (15): AuthController, ApiTags, Body, Post, Res, Throttle, SignupDto, ApiProperty (+7 more)

### Community 41 - "AuthService"
Cohesion: 0.20
Nodes (4): AuthService, Injectable, InjectRepository, Optional

### Community 42 - "auth.ts"
Cohesion: 0.19
Nodes (14): genreOptions, ProfileEditScreen(), OttSubscriptions(), SettingsScreen(), AuthenticatedUser, getMe(), logout(), MeResponse (+6 more)

### Community 43 - ".constructor"
Cohesion: 0.12
Nodes (12): TmdbMetadataAdapter, Injectable, Inject, InjectRepository, Optional, CatalogSearchInput, CatalogSearchItem, CatalogSearchResponse (+4 more)

### Community 44 - "watch-photos.service.ts"
Cohesion: 0.21
Nodes (11): photoError(), ProcessedWatchPhoto, processWatchPhoto(), validateWatchPhoto(), WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_UPLOAD_OPTIONS, WATCH_PHOTO_VARIANTS, ORIGINAL_EXTENSIONS (+3 more)

### Community 45 - "verify-deployment-contracts.mjs"
Cohesion: 0.09
Nodes (19): apiDockerfile, apiPackage, auditIndex, backupScript, caddyIndex, development, errors, formattingVerifier (+11 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "FileCleanupJobEntity"
Cohesion: 0.11
Nodes (11): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FileCleanupRunResult, FileCleanupService, CleanupJob (+3 more)

### Community 48 - "RecordComposer.tsx"
Cohesion: 0.10
Nodes (22): asSelected(), canResumeDraft(), continueSeries(), Draft, draftWithDefaults(), freshDraft(), readSavedDraft(), today() (+14 more)

### Community 49 - "WatchEventsService"
Cohesion: 0.05
Nodes (49): hasWrittenReaction(), hiddenReviewAccountIds(), Participation, ReactionContent, CreateWatchEventDto, SaveWatchReactionDto, UpdateWatchEventDto, WATCH_RATINGS (+41 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.13
Nodes (14): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+6 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.11
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Get, Param, Query, Throttle, GENRE_PRESETS (+6 more)

### Community 53 - "notifications.ts"
Cohesion: 0.12
Nodes (21): describeNotification(), NotificationIcon, NotificationText, quoted(), ICON_PATHS, NotificationsScreen(), formatNotificationDate(), notificationMessage() (+13 more)

### Community 54 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 55 - "entities/index.ts"
Cohesion: 0.07
Nodes (35): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+27 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "DavasHeader.tsx"
Cohesion: 0.11
Nodes (14): CommentAvatar(), Avatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, ProfileHeaderCard() (+6 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.14
Nodes (13): devDependencies, tsx, tsx, main, name, private, scripts, build (+5 more)

### Community 60 - "media.service.ts"
Cohesion: 0.09
Nodes (19): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+11 more)

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (25): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+17 more)

### Community 62 - "community.ts"
Cohesion: 0.09
Nodes (28): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryDetail (+20 more)

### Community 63 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries-dashboard.service.ts"
Cohesion: 0.21
Nodes (11): buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts() (+3 more)

### Community 66 - "DiaryInsightGrid.tsx"
Cohesion: 0.18
Nodes (12): DiaryCalendarMarker, DiaryGenreRatio, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind, DiaryInsightGrid(), DiaryInsightGridProps (+4 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "MediaController"
Cohesion: 0.26
Nodes (9): MediaController, ApiTags, Body, Get, Param, Post, Query, Req (+1 more)

### Community 69 - "1. 레거시 호환과 알려진 문제"
Cohesion: 0.14
Nodes (14): 1. 레거시 호환과 알려진 문제, 2026-10 보안 보강 병합 기록, 2. 검증 요령, 3. 작업 요령, Davas 부록: 레거시·알려진 문제·작업 요령, 결과 기록 형식, 계약 회귀 점검 목록, 기본 흐름 (+6 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.08
Nodes (26): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+18 more)

### Community 71 - "DiaryDashboard.tsx"
Cohesion: 0.20
Nodes (16): DiaryCalendarDay, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten() (+8 more)

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.18
Nodes (6): GroupRecommendationsService, normalized(), response(), Injectable, InjectRepository, Optional

### Community 73 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "jwt-cookie-auth.guard.ts"
Cohesion: 0.07
Nodes (27): AuthResult, sourceRoot, LoginDto, ApiProperty, IsEmail, IsString, Length, ACCESS_TOKEN_COOKIE (+19 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "media.controller.ts"
Cohesion: 0.20
Nodes (9): DEFAULT_RATE_LIMIT, ROUTE_RATE_LIMITS, auth, media, RateLimitContractModule, AvailabilityQueryDto, ApiPropertyOptional, IsOptional (+1 more)

### Community 78 - "CommunityDiaryCard.tsx"
Cohesion: 0.21
Nodes (8): CommunityDiaryCard, CommunityDashboard(), CommunityDiaryCard(), CommunityDiaryCardProps, CommunityFeedSection(), CommunityFeedSectionProps, PopularDiariesSectionProps, useCommunityDashboard()

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
Cohesion: 0.21
Nodes (4): Injectable, InjectRepository, Optional, UsersService

### Community 84 - "FriendshipEntity"
Cohesion: 0.08
Nodes (27): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+19 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.06
Nodes (38): RecommendationSessionStatus, SpaceEntity, SpaceStatus, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne (+30 more)

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

### Community 92 - "CommentsService"
Cohesion: 0.26
Nodes (5): CommentsService, normalizeContent(), Injectable, InjectRepository, Optional

### Community 93 - "core.ts"
Cohesion: 0.08
Nodes (43): SpacesPageProps, ACTIVE_SPACE_KEY, activeMembers(), chooseActiveSpace(), defaultWatchPartners(), inviteStatusMessage(), readActiveSpaceId(), rememberActiveSpace() (+35 more)

### Community 95 - "CoreUi.tsx"
Cohesion: 0.06
Nodes (27): DiaryDetailPageProps, AsyncState(), CoreAppShell(), EmptyState(), MediaTypeControl(), NotificationBell(), RecordCard(), SearchIcon() (+19 more)

### Community 97 - "useWatchPhotoUploads.ts"
Cohesion: 0.13
Nodes (15): PhotoPicker(), ACCEPTED_TYPES, AddPhotosResult, createPhotoUploadQueue(), MAX_PARALLEL_UPLOADS, PHOTO_ACCEPT, PhotoUploadItem, RETRY_DELAYS_MS (+7 more)

### Community 98 - "verify-caddy-headers.mjs"
Cohesion: 0.12
Nodes (9): fetchWhenReady(), apiOrigin, conflictingHeaders, expectedHeaders, projectRoot, sourceCaddyfile, tempDirectory, testCaddyfile (+1 more)

### Community 99 - "SpaceWishesController"
Cohesion: 0.25
Nodes (6): SpaceWishesController, Controller, Get, Param, Put, Req

### Community 100 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 101 - ".upload"
Cohesion: 0.17
Nodes (10): UploadedPhotoFile, Controller, Get, Param, Post, Req, VARIANTS, WatchPhotosController (+2 more)

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

### Community 118 - "NotificationsController"
Cohesion: 0.14
Nodes (9): ApiTags, NotificationsController, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 119 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 135 - "TransactionOutboxEntity"
Cohesion: 0.12
Nodes (12): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+4 more)

### Community 136 - "WatchPhotosService"
Cohesion: 0.28
Nodes (4): apiError(), Injectable, InjectRepository, WatchPhotosService

### Community 137 - "InviteCodeEntity"
Cohesion: 0.06
Nodes (24): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource, InviteCodeEntity, Column (+16 more)

### Community 138 - "DiaryEntity"
Cohesion: 0.06
Nodes (42): CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+34 more)

### Community 139 - "GroupRecommendationPanel.tsx"
Cohesion: 0.08
Nodes (26): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia, availabilityPresentation (+18 more)

### Community 140 - "users.service.ts"
Cohesion: 0.27
Nodes (8): watchPhotoPaths(), detectImageType(), hasPrefix(), PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_UPLOAD_OPTIONS, ProfileImageContent, validateProfileImageContent(), UserProfileResponse

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.27
Nodes (6): GroupRecommendationsController, Body, Get, Param, Post, Req

### Community 143 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 147 - "space-wishes.service.ts"
Cohesion: 0.16
Nodes (8): mapWithConcurrency(), MOOD_GENRES, notFound(), SpaceWishesService, SUBSCRIPTION_OFFERS, Injectable, InjectRepository, Optional

### Community 148 - "UpdateDiaryDto"
Cohesion: 0.14
Nodes (13): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+5 more)

### Community 151 - "core-record-migration.spec.ts"
Cohesion: 0.18
Nodes (3): CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000, MediaCanonicalIdentity1720670700000

### Community 152 - "MediaSelectionService"
Cohesion: 0.09
Nodes (16): selection, MediaSelectionDto, ApiProperty, IsEnum, IsString, Length, Optional, MediaSelectionService (+8 more)

### Community 153 - "availability.service.ts"
Cohesion: 0.21
Nodes (11): AvailabilityObservationStatus, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, media(), operatorMatches() (+3 more)

### Community 154 - "core-routes.ts"
Cohesion: 0.31
Nodes (11): hasOnlySingleValueParams(), isSafeAtDepth(), isSafeCoreReturnTo(), isSafeNewRecordQuery(), isSafeRecordDetailQuery(), isSafeSearchQuery(), isSafeSpacesQuery(), PARAMLESS_PATHS (+3 more)

### Community 155 - "AuthUi.tsx"
Cohesion: 0.29
Nodes (5): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard()

### Community 156 - "notifications.service.spec.ts"
Cohesion: 0.11
Nodes (16): NotificationEntity, SpaceWishEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, find(), findOne() (+8 more)

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

### Community 161 - "MemoriesScreen.tsx"
Cohesion: 0.24
Nodes (8): Poster(), MemoriesBody(), MemoriesScreen(), percent(), getSpaceMemories(), getWatchProgress(), SpaceMemories, WatchProgress

### Community 162 - "DiaryAccessService"
Cohesion: 0.08
Nodes (19): InjectRepository, Optional, DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+11 more)

### Community 163 - "SpaceAccessService"
Cohesion: 0.20
Nodes (5): SpaceAccessService, spaceNotFound(), Injectable, InjectRepository, InjectRepository

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 167 - "typeorm.config.ts"
Cohesion: 0.18
Nodes (4): CanonicalCatalogAvailability1720670900000, SpaceWishesAndSubscriptions1720671300000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 169 - "DiarySummarySection.tsx"
Cohesion: 0.22
Nodes (8): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, SectionTitle(), SectionTitleProps

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

### Community 177 - "diaries.dashboard.spec.ts"
Cohesion: 0.20
Nodes (6): controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

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

### Community 185 - "UserEntity"
Cohesion: 0.08
Nodes (13): FakeUserRepository, REQUIRED_NOTIFICATION_CATEGORIES, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UserEntity, FakeOutbox (+5 more)

### Community 186 - "notifications.controller.ts"
Cohesion: 0.38
Nodes (5): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto

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
Cohesion: 0.67
Nodes (3): Operator, setup(), values()

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

### Community 213 - "ExternalContentRefEntity"
Cohesion: 0.22
Nodes (9): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 218 - "diary-dashboard-types.ts"
Cohesion: 0.33
Nodes (6): DiaryDashboardCalendar, DiaryListItemView, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps

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

### Community 225 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 254 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 274 - "제품 요구사항 구현 추적표"
Cohesion: 0.67
Nodes (3): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계

## Knowledge Gaps
- **829 isolated node(s):** `ConfigurableHttpServer`, `DiaryListQuery`, `Row`, `WATCH_VIEW_RELATIONS`, `SessionRequest` (+824 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **72 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordComposer()` (3× useful, score=0.935789443) _(code changed — re-verify)_
- `RecordScreens.tsx` (3× useful, score=0.920555636)
- `WatchEventsService` (3× useful, score=0.915796065) _(code changed — re-verify)_
- `layout.tsx` (2× useful, score=0.615689215)
- `PwaStatus.tsx` (2× useful, score=0.615689215)
- `PwaStatus()` (2× useful, score=0.615689215)
- `SpaceMembershipEntity` (2× useful, score=0.613121092)
- `typeorm.config.ts` (2× useful, score=0.611320545)
- `GroupRecommendationSessionRequest` (2× useful, score=0.611234378)
- `api/package.json` (2× useful, score=0.550706791)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `hiddenReviewAccountIds()` connect `WatchEventsService` to `community.service.ts`, `DiaryAccessService`, `SpaceHome.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `AuthenticatedRequest` connect `AuthenticatedRequest` to `CommentsController`, `UsersController`, `WatchlistService`, `.me`, `community.service.ts`, `FriendsService`, `group-recommendations.controller.ts`, `diaries.controller.ts`, `DiariesController`, `ReactionsService`, `Controller`, `invites.controller.ts`, `watch-photos.service.ts`, `.inspect`, `WatchEventsService`, `notifications.controller.ts`, `spaces.service.ts`, `MediaController`, `jwt-cookie-auth.guard.ts`, `media.controller.ts`, `SpaceWishesController`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `ConfigurableHttpServer`, `DiaryListQuery`, `Row` to the rest of the system?**
  _829 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UsersController` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._