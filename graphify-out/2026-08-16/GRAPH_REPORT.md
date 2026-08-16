# Graph Report - davas  (2026-08-16)

## Corpus Check
- 383 files · ~116,909 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2826 nodes · 5556 edges · 203 communities (173 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbff59c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- availability.service.ts
- SpacesController
- community.service.ts
- UserEntity
- FriendsController
- InviteCodeEntity
- RecordComposer.tsx
- diaries.module.ts
- DiaryCompanionEntity
- FriendInvitesService
- TmdbClient
- AppShell.tsx
- ProfileDashboard.tsx
- DiarySummarySection.tsx
- getApiBaseUrl
- NotificationsService
- SpaceEntity
- scripts
- DiariesController
- WatchParticipantEntity
- CreateDiaryDto
- media-selection.service.spec.ts
- SearchField.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- ExploreDashboard.tsx
- RecommendationSessionEntity
- DiariesDashboardService
- SpaceMembershipEntity
- recommendations.ts
- scripts
- AuthController
- AuthService
- ProfileEditScreen.tsx
- media.service.ts
- WatchEventsService
- WatchReactionEntity
- devDependencies
- ReactionsService
- MediaController
- CommentEntity
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- MediaDetailModal.tsx
- MediaEntity
- compilerOptions
- DavasHeader.tsx
- compilerOptions
- shared/package.json
- SpacesService
- group-recommendations.service.ts
- community.ts
- DiaryDashboard.tsx
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- AvailabilityObservationEntity
- reactions.ts
- FakeDatabase
- Davas 추천 전략 상세 설계
- MediaSelectionDto
- GroupRecommendationsService
- MediaService
- compilerOptions
- NotificationsController
- compilerOptions
- auth.service.ts
- media.service.spec.ts
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- HomeDashboard.tsx
- AvailabilityService
- BaseSchema1720670300000
- DiaryComposeScreen.tsx
- FriendshipEntity
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- coreFetch
- core.ts
- middleware.ts
- CoreRecordContract1720670500000
- diaries-dashboard.service.ts
- DiaryLikeEntity
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- FriendsService
- tailwind.config.ts
- backup.sh
- UserFollowEntity
- @nestjs/platform-express
- typeorm
- community-types.ts
- spaces.service.ts
- GroupRecommendationsController
- product/README.md
- tmdb-detail.mapper.ts
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- FileCleanupJobEntity
- SpacesMembershipInvites1720670700000
- MediaSearchQueryDto
- CanonicalCatalogAvailability1720670900000
- AuthUi.tsx
- AccountLifecycleNotificationOutbox1720671000000
- UsersService
- SpaceInvitesController
- FakeRepository
- availability.service.spec.ts
- users.service.ts
- DiaryEntity
- ExternalContentRefEntity
- users.service.spec.ts
- CommunityDiaryCard.tsx
- FakeLifecycleDataSource
- FriendInviteEntity
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- users.controller.ts
- @nestjs/passport
- NotificationEntity
- diary/[id]/page.tsx
- TogetherMomentSection.tsx
- auth.ts
- WatchEventsAndPersonalReactions1720670800000
- TransactionOutboxService
- useCommunityDashboard.ts
- notifications.controller.ts
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- friends.controller.ts
- availability-provider.port.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- .uploadProfileImage
- 15. 단계별 고도화
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- class-transformer
- 5. 필요한 데이터
- 8. 추천 파이프라인
- 13. 테스트 전략
- .constructor
- 7. 콜드 스타트

## God Nodes (most connected - your core abstractions)
1. `DiaryEntity` - 87 edges
2. `UserEntity` - 86 edges
3. `getApiBaseUrl()` - 60 edges
4. `MediaEntity` - 56 edges
5. `AuthService` - 55 edges
6. `WatchEventsService` - 30 edges
7. `WatchReactionEntity` - 28 edges
8. `coreFetch()` - 28 edges
9. `SpaceMembershipEntity` - 27 edges
10. `NotificationsService` - 27 edges

## Surprising Connections (you probably didn't know these)
- `toCommunityDiaryDetail()` --indirect_call--> `resolveTmdbGenreLabel()`  [INFERRED]
  apps/api/src/community/community.service.ts → apps/api/src/media/tmdb-genres.ts
- `CommentAvatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityCommentsSection.tsx → apps/web/src/lib/api/auth.ts
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `AvailabilityObservationEntity` --references--> `MediaEntity`  [EXTRACTED]
  apps/api/src/database/entities/availability-observation.entity.ts → apps/api/src/database/entities/media.entity.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts

## Import Cycles
- None detected.

## Communities (203 total, 30 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.13
Nodes (14): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.17
Nodes (12): ApiTags, Body, Controller, Delete, Get, Param, Patch, Req (+4 more)

### Community 2 - "WatchlistService"
Cohesion: 0.10
Nodes (20): Body, Controller, Delete, Get, Param, Patch, Post, Query (+12 more)

### Community 3 - "diary-compose-utils.ts"
Cohesion: 0.16
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "src/index.ts"
Cohesion: 0.06
Nodes (50): participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), SpaceTimeline(), getRecord(), compareSpaceReactions(), createWatchEvent() (+42 more)

### Community 6 - "availability.service.ts"
Cohesion: 0.29
Nodes (6): AvailabilityObservationStatus, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS

### Community 7 - "SpacesController"
Cohesion: 0.24
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+18 more)

### Community 9 - "UserEntity"
Cohesion: 0.10
Nodes (17): FakeUserRepository, ParticipantPrediction, RecommendationSessionStatus, SpaceStatus, SpaceMembershipRole, SpaceMembershipStatus, Column, CreateDateColumn (+9 more)

### Community 10 - "FriendsController"
Cohesion: 0.28
Nodes (8): FriendsController, Controller, Delete, Get, Param, Patch, Query, Req

### Community 11 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (28): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+20 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.16
Nodes (10): Poster(), Draft, freshDraft(), RecordComposer(), sourceLabels, today(), WATCH_RATINGS, WatchRatingControl() (+2 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.11
Nodes (27): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+19 more)

### Community 14 - "DiaryCompanionEntity"
Cohesion: 0.20
Nodes (9): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, InjectRepository (+1 more)

### Community 15 - "FriendInvitesService"
Cohesion: 0.16
Nodes (10): FriendInvitesController, Controller, Get, Param, Post, Req, error(), FriendInvitesService (+2 more)

### Community 16 - "TmdbClient"
Cohesion: 0.17
Nodes (10): imageUrl(), TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult() (+2 more)

### Community 17 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (17): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+9 more)

### Community 19 - "DiarySummarySection.tsx"
Cohesion: 0.10
Nodes (19): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, CalendarDayStateInput, cn() (+11 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.15
Nodes (25): FriendInviteScreen(), empty, FriendsScreen(), getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary() (+17 more)

### Community 21 - "NotificationsService"
Cohesion: 0.21
Nodes (4): NotificationType, REQUIRED_NOTIFICATION_CATEGORIES, NotificationsService, Injectable

### Community 22 - "SpaceEntity"
Cohesion: 0.11
Nodes (18): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.18
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "WatchParticipantEntity"
Cohesion: 0.07
Nodes (29): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+21 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "media-selection.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeMediaRepository, interstellarSelection, SavedMedia

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "InvitesService"
Cohesion: 0.10
Nodes (17): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+9 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (29): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+21 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-validator, @davas/shared, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "DiariesService"
Cohesion: 0.24
Nodes (6): apiError(), assertNotFuture(), DiariesService, fingerprint(), normalizedCreate(), Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.09
Nodes (19): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType, PersonCreditsInput (+11 more)

### Community 34 - "ExploreDashboard.tsx"
Cohesion: 0.07
Nodes (42): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), FavoriteMovie, FavoriteMoviesSection() (+34 more)

### Community 35 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "SpaceMembershipEntity"
Cohesion: 0.14
Nodes (11): SpaceMembershipEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, InjectRepository (+3 more)

### Community 38 - "recommendations.ts"
Cohesion: 0.06
Nodes (49): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS (+41 more)

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 41 - "AuthService"
Cohesion: 0.17
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "ProfileEditScreen.tsx"
Cohesion: 0.21
Nodes (11): genreOptions, ProfileEditScreen(), SettingsScreen(), AuthenticatedUser, purgeSessionDrafts(), deleteMe(), deleteProfileImage(), updateMe() (+3 more)

### Community 43 - "media.service.ts"
Cohesion: 0.11
Nodes (16): TmdbMetadataAdapter, Injectable, buildContentPreview(), FavoriteMediaItem, FavoriteMediaResponse, formatWatchedDate(), MediaDetailResponse, MediaFavoriteResponse (+8 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (43): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+35 more)

### Community 45 - "WatchReactionEntity"
Cohesion: 0.05
Nodes (41): CommunityCommentView, DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+33 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (13): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+5 more)

### Community 48 - "MediaController"
Cohesion: 0.13
Nodes (13): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaController, ApiTags, Body, Controller (+5 more)

### Community 49 - "CommentEntity"
Cohesion: 0.11
Nodes (13): FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+5 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Controller, Get, Param, Query, GENRE_PRESETS (+6 more)

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.24
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "MediaDetailModal.tsx"
Cohesion: 0.21
Nodes (7): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), MediaDetail

### Community 55 - "MediaEntity"
Cohesion: 0.06
Nodes (40): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+32 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "DavasHeader.tsx"
Cohesion: 0.14
Nodes (11): DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, ProfileHeaderCard(), ProfileHeaderCardProps, ProfileImagePicker() (+3 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.18
Nodes (15): CommunityAuthorPageProps, CommunityAuthorProfileResponse, CommunityAuthorProfile(), CommentAvatar(), CommentsStatus, CommunityCommentsSection(), CommunityCommentsSectionProps, CommunityDashboardParams (+7 more)

### Community 63 - "DiaryDashboard.tsx"
Cohesion: 0.09
Nodes (35): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+27 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.09
Nodes (20): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+12 more)

### Community 67 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 68 - "reactions.ts"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.11
Nodes (19): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+11 more)

### Community 71 - "MediaSelectionDto"
Cohesion: 0.22
Nodes (8): MediaSelectionDto, ApiProperty, ApiPropertyOptional, IsArray, IsEnum, IsOptional, IsString, Length

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.21
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "MediaService"
Cohesion: 0.27
Nodes (3): Optional, MediaService, Injectable

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "NotificationsController"
Cohesion: 0.21
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 79 - "main.ts"
Cohesion: 0.29
Nodes (4): AppModule, Module, ApiExceptionFilter, Catch

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.22
Nodes (8): Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Editing Boundaries, Graphify, Repository Map, Scope, Validation

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.15
Nodes (13): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈, 5. 식별자와 공통 저장 규칙 (+5 more)

### Community 82 - "HomeDashboard.tsx"
Cohesion: 0.11
Nodes (23): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+15 more)

### Community 85 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 86 - "FriendshipEntity"
Cohesion: 0.17
Nodes (9): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 87 - "Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘, Source Nodes

### Community 88 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 89 - "media-selection-api.spec.ts"
Cohesion: 0.29
Nodes (5): availabilityDtoSource, controllerSource, dtoSource, moduleSource, watchlistControllerSource

### Community 90 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, InstallEvent, PwaStatus()

### Community 91 - "Q: 적당하게 AGNETS.md 작성해"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 적당하게 AGNETS.md 작성해, Source Nodes

### Community 92 - "Raspberry Pi DuckDNS deployment"
Cohesion: 0.18
Nodes (8): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment, Davas 문서, 관리 원칙

### Community 93 - "coreFetch"
Cohesion: 0.15
Nodes (22): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, coreFetch(), acceptSpaceInvite() (+14 more)

### Community 95 - "core.ts"
Cohesion: 0.08
Nodes (32): AsyncState(), CoreAppShell(), EmptyState(), MediaTypeControl(), RecordCard(), SearchField(), tabs, TaskShell() (+24 more)

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.19
Nodes (12): matchesTopic(), buildContentPreview(), buildGenreRatios(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto (+4 more)

### Community 100 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 118 - "FriendsService"
Cohesion: 0.21
Nodes (3): FriendsService, Injectable, InjectRepository

### Community 135 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 139 - "community-types.ts"
Cohesion: 0.16
Nodes (10): setCommunityDashboardQueryParam(), toCommunityTab(), CommunityComment, CommunityCommentsResponse, CommunityDiaryDetail, CommunityTab, CommunityTopic, CommunitySegmentTabsProps (+2 more)

### Community 140 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 141 - "GroupRecommendationsController"
Cohesion: 0.27
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 143 - "tmdb-detail.mapper.ts"
Cohesion: 0.22
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.18
Nodes (8): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, FakeOutboxRepository

### Community 148 - "FileCleanupJobEntity"
Cohesion: 0.33
Nodes (5): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 152 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.14
Nodes (9): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION (+1 more)

### Community 157 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 159 - "availability.service.spec.ts"
Cohesion: 0.22
Nodes (5): content, contentRef, FakeAvailabilityProvider, now, ProviderAvailabilityLookup

### Community 160 - "users.service.ts"
Cohesion: 0.20
Nodes (8): OutboxModule, Module, NotificationRequestInput, OutboxInput, Module, UsersModule, ALLOWED_PROFILE_IMAGE_TYPES, UserProfileResponse

### Community 161 - "DiaryEntity"
Cohesion: 0.07
Nodes (25): InjectRepository, Optional, DiaryEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+17 more)

### Community 162 - "ExternalContentRefEntity"
Cohesion: 0.17
Nodes (11): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 163 - "users.service.spec.ts"
Cohesion: 0.18
Nodes (4): FakeJwtService, FakeOutbox, FakeUserRepository, SavedUser

### Community 164 - "CommunityDiaryCard.tsx"
Cohesion: 0.23
Nodes (7): CommunityDiaryCard, Avatar(), CommunityDiaryCard(), CommunityDiaryCardProps, CommunityFeedSection(), CommunityFeedSectionProps, PopularDiariesSectionProps

### Community 166 - "FriendInviteEntity"
Cohesion: 0.20
Nodes (9): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 167 - "typeorm.config.ts"
Cohesion: 0.27
Nodes (3): GroupRecommendationSessions1720671100000, statements(), createTypeOrmOptions()

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "users.controller.ts"
Cohesion: 0.24
Nodes (7): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length

### Community 173 - "NotificationEntity"
Cohesion: 0.08
Nodes (22): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+14 more)

### Community 175 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 178 - "auth.ts"
Cohesion: 0.28
Nodes (4): ProfileAccountScreen(), ApiResponseError, logout(), MeResponse

### Community 184 - "TransactionOutboxService"
Cohesion: 0.32
Nodes (4): TransactionOutboxService, Injectable, InjectRepository, Optional

### Community 185 - "useCommunityDashboard.ts"
Cohesion: 0.36
Nodes (6): CommunityDashboardResponse, CommunityDashboard(), CommunityDashboardStatus, emptyCommunityDashboard, useCommunityDashboard(), getCommunityDashboard()

### Community 186 - "notifications.controller.ts"
Cohesion: 0.38
Nodes (4): NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto

### Community 187 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 188 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "friends.controller.ts"
Cohesion: 0.33
Nodes (4): Body, Post, CreateFriendRequestDto, IsUUID

### Community 191 - "availability-provider.port.ts"
Cohesion: 0.17
Nodes (7): TmdbAvailabilityAdapter, Injectable, AVAILABILITY_PROVIDER, AvailabilityContentRef, AvailabilityProvider, ProviderOffer, ProviderReleaseState

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 193 - ".uploadProfileImage"
Cohesion: 0.29
Nodes (4): Post, ProfileImageFile, UploadedFile, UseInterceptors

### Community 194 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.40
Nodes (5): Davas Docker 실행 가이드, TypeORM 설정, 실행, 접속 주소, 종료

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 198 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 199 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 200 - "13. 테스트 전략"
Cohesion: 0.50
Nodes (4): 13. 테스트 전략, 도메인 단위 테스트, 종단 간 테스트, 통합 테스트

### Community 202 - "7. 콜드 스타트"
Cohesion: 0.67
Nodes (3): 7. 콜드 스타트, 데이터가 거의 없을 때, 사용자 온보딩

## Knowledge Gaps
- **557 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+552 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `WatchEventsService` (2× useful, score=1.987641961)
- `api/package.json` (2× useful, score=1.797020951)
- `web/package.json` (2× useful, score=1.797020951)
- `shared/package.json` (2× useful, score=1.797020951)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsService` to `diaries.module.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `community.service.ts`, `UserEntity`, `diaries.module.ts`, `DiaryCompanionEntity`, `WatchParticipantEntity`, `DiariesService`, `DiariesDashboardService`, `typeorm.config.ts`, `media.service.ts`, `WatchEventsService`, `WatchReactionEntity`, `NotificationEntity`, `CommentEntity`, `MediaEntity`, `group-recommendations.service.ts`, `diaries.dashboard.spec.ts`, `FakeDatabase`, `diaries-dashboard.service.ts`, `DiaryLikeEntity`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _557 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._