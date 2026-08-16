# Graph Report - davas  (2026-08-16)

## Corpus Check
- 385 files · ~117,309 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2838 nodes · 5600 edges · 198 communities (169 shown, 29 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 174 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb04d7f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersController
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- CommentEntity
- SpacesController
- community.service.ts
- UserEntity
- FriendsController
- InviteCodeEntity
- RecordComposer.tsx
- diaries.module.ts
- DiaryEntity
- space-ui.ts
- TmdbClient
- AppShell.tsx
- ProfileDashboard.tsx
- MediaPosterRowSection.tsx
- friends.ts
- NotificationsService
- SpaceEntity
- scripts
- DiariesController
- SpaceMembershipEntity
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
- CommunityDiaryCard.tsx
- recommendations.ts
- scripts
- AuthController
- AuthService
- auth.ts
- media.service.ts
- WatchEventsService
- watch-events.service.ts
- devDependencies
- ReactionsService
- MediaController
- watch-events.ts
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- AvailabilityObservationEntity
- entities/index.ts
- compilerOptions
- ExternalContentRefEntity
- compilerOptions
- shared/package.json
- SpacesService
- group-recommendations.service.ts
- community.ts
- DiaryDashboard.tsx
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- TaskShell
- getApiBaseUrl
- FakeDatabase
- Davas 추천 전략 상세 설계
- logout
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
- CoreRecordContract1720670500000
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
- availability.service.spec.ts
- diaries-dashboard.service.ts
- MediaSelectionDto
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
- friends.controller.ts
- spaces.service.ts
- group-recommendations.controller.ts
- product/README.md
- SpacesMembershipInvites1720670700000
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- FileCleanupJobEntity
- UpdateDiaryDto
- MediaSearchQueryDto
- WatchEventsAndPersonalReactions1720670800000
- AuthUi.tsx
- CanonicalCatalogAvailability1720670900000
- UsersService
- SpaceInvitesController
- FakeRepository
- AccountLifecycleNotificationOutbox1720671000000
- users.module.ts
- WatchReactionEntity
- 15. 단계별 고도화
- HealthController
- Q: Can Davas be deployed and verified on Raspberry Pi?
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
- Q: What are the current Davas core functions and how are they delivered?
- 5. 필요한 데이터
- TransactionOutboxService
- 8. 추천 파이프라인
- notifications.controller.ts
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- 7. 콜드 스타트
- availability.service.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- users.service.ts
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- class-transformer
- .constructor

## God Nodes (most connected - your core abstractions)
1. `DiaryEntity` - 87 edges
2. `UserEntity` - 86 edges
3. `getApiBaseUrl()` - 61 edges
4. `MediaEntity` - 56 edges
5. `AuthService` - 55 edges
6. `WatchEventsService` - 30 edges
7. `WatchReactionEntity` - 28 edges
8. `coreFetch()` - 28 edges
9. `SpaceMembershipEntity` - 27 edges
10. `NotificationsService` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `toCommunityDiaryDetail()` --indirect_call--> `resolveTmdbGenreLabel()`  [INFERRED]
  apps/api/src/community/community.service.ts → apps/api/src/media/tmdb-genres.ts
- `AvailabilityObservationEntity` --references--> `MediaEntity`  [EXTRACTED]
  apps/api/src/database/entities/availability-observation.entity.ts → apps/api/src/database/entities/media.entity.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts
- `CommentEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/diary.entity.ts

## Import Cycles
- None detected.

## Communities (198 total, 29 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.13
Nodes (14): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+6 more)

### Community 1 - "UsersController"
Cohesion: 0.16
Nodes (13): ApiTags, Body, Controller, Delete, Get, Param, Patch, Post (+5 more)

### Community 2 - "WatchlistService"
Cohesion: 0.10
Nodes (20): Body, Controller, Delete, Get, Param, Patch, Post, Query (+12 more)

### Community 3 - "diary-compose-utils.ts"
Cohesion: 0.17
Nodes (7): clampRating(), isValidDateInput(), ratingFromPointer(), validateDiaryCompose(), ValidateDiaryComposeInput, RatingInputCard(), DiaryComposeMedia

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "src/index.ts"
Cohesion: 0.08
Nodes (23): DAVAS_APP_NAME, DIARY_VISIBILITIES, DiaryVisibility, FRIENDSHIP_STATUSES, FriendshipStatus, MEDIA_TYPES, REACTION_EMOJIS, ReactionEmoji (+15 more)

### Community 6 - "CommentEntity"
Cohesion: 0.11
Nodes (13): FakeCommentsRepository, InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+5 more)

### Community 7 - "SpacesController"
Cohesion: 0.24
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 8 - "community.service.ts"
Cohesion: 0.08
Nodes (30): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+22 more)

### Community 9 - "UserEntity"
Cohesion: 0.07
Nodes (20): FakeUserRepository, InjectRepository, Optional, SpaceStatus, SpaceMembershipRole, SpaceMembershipStatus, Column, CreateDateColumn (+12 more)

### Community 10 - "FriendsController"
Cohesion: 0.21
Nodes (8): FriendsController, Controller, Delete, Get, Param, Patch, Query, Req

### Community 11 - "InviteCodeEntity"
Cohesion: 0.07
Nodes (28): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+20 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.10
Nodes (17): DiaryEditPageProps, DiaryNewPageProps, Draft, freshDraft(), RecordComposer(), sourceLabels, today(), WATCH_RATINGS (+9 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.13
Nodes (24): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+16 more)

### Community 14 - "DiaryEntity"
Cohesion: 0.05
Nodes (46): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DiaryEntity (+38 more)

### Community 15 - "space-ui.ts"
Cohesion: 0.24
Nodes (7): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), CoreApiError, SpaceInviteInspection, SpaceView

### Community 16 - "TmdbClient"
Cohesion: 0.16
Nodes (10): imageUrl(), TmdbClient, Inject, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult() (+2 more)

### Community 17 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.14
Nodes (14): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+6 more)

### Community 19 - "MediaPosterRowSection.tsx"
Cohesion: 0.08
Nodes (25): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, FavoriteMovie, FavoriteMoviesSection() (+17 more)

### Community 20 - "friends.ts"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "NotificationsService"
Cohesion: 0.25
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 22 - "SpaceEntity"
Cohesion: 0.09
Nodes (21): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+13 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.17
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "SpaceMembershipEntity"
Cohesion: 0.06
Nodes (30): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+22 more)

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
Cohesion: 0.07
Nodes (29): ProviderOffer, DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType (+21 more)

### Community 34 - "ExploreDashboard.tsx"
Cohesion: 0.07
Nodes (36): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), BasicInfoGrid(), DetailInfoCard() (+28 more)

### Community 35 - "RecommendationSessionEntity"
Cohesion: 0.20
Nodes (10): RecommendationSessionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+2 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.25
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "CommunityDiaryCard.tsx"
Cohesion: 0.19
Nodes (9): CommunityDiaryCard, CommunityDashboard(), Avatar(), CommunityDiaryCard(), CommunityDiaryCardProps, CommunityFeedSection(), CommunityFeedSectionProps, PopularDiariesSectionProps (+1 more)

### Community 38 - "recommendations.ts"
Cohesion: 0.06
Nodes (50): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS (+42 more)

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.20
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 41 - "AuthService"
Cohesion: 0.17
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "auth.ts"
Cohesion: 0.09
Nodes (26): CommentAvatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen() (+18 more)

### Community 43 - "media.service.ts"
Cohesion: 0.12
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.06
Nodes (42): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+34 more)

### Community 45 - "watch-events.service.ts"
Cohesion: 0.07
Nodes (30): CommunityCommentView, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchParticipantEntity (+22 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (12): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+4 more)

### Community 48 - "MediaController"
Cohesion: 0.13
Nodes (13): AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaController, ApiTags, Body, Controller (+5 more)

### Community 49 - "watch-events.ts"
Cohesion: 0.11
Nodes (32): AsyncState(), Poster(), participantLabels, safeReturn(), sourceLabels, WatchEventDetailScreen(), SpaceTimeline(), getRecord() (+24 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.15
Nodes (14): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+6 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.10
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Controller, Get, Param, Query, GENRE_PRESETS (+6 more)

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.25
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "AvailabilityObservationEntity"
Cohesion: 0.17
Nodes (11): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 55 - "entities/index.ts"
Cohesion: 0.05
Nodes (44): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+36 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "ExternalContentRefEntity"
Cohesion: 0.17
Nodes (11): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "SpacesService"
Cohesion: 0.23
Nodes (5): spaceNotFound(), hashToken(), response(), SpacesService, Injectable

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.14
Nodes (24): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+16 more)

### Community 62 - "community.ts"
Cohesion: 0.09
Nodes (28): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryDetail (+20 more)

### Community 63 - "DiaryDashboard.tsx"
Cohesion: 0.09
Nodes (34): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth() (+26 more)

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (27): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+19 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.18
Nodes (9): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+1 more)

### Community 67 - "TaskShell"
Cohesion: 0.24
Nodes (5): TaskShell(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION

### Community 68 - "getApiBaseUrl"
Cohesion: 0.21
Nodes (16): DiaryReactions(), options, getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary (+8 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.11
Nodes (19): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+11 more)

### Community 71 - "logout"
Cohesion: 0.24
Nodes (5): ProfileAccountScreen(), ProfileSettingsSection(), SettingItem, settings, logout()

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.20
Nodes (5): RankedCandidate, GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "MediaService"
Cohesion: 0.21
Nodes (5): Optional, buildContentPreview(), formatWatchedDate(), MediaService, Injectable

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "NotificationsController"
Cohesion: 0.23
Nodes (7): NotificationsController, ApiTags, Controller, Get, Param, Patch, Req

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
Cohesion: 0.12
Nodes (17): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 13. 테스트 전략, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈 (+9 more)

### Community 82 - "HomeDashboard.tsx"
Cohesion: 0.10
Nodes (25): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+17 more)

### Community 86 - "FriendshipEntity"
Cohesion: 0.15
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
Cohesion: 0.29
Nodes (15): SpacesScreen(), coreFetch(), acceptSpaceInvite(), cancelSpaceInvite(), closeSpace(), createSpace(), createSpaceInvite(), getSpace() (+7 more)

### Community 95 - "core.ts"
Cohesion: 0.08
Nodes (28): CoreAppShell(), EmptyState(), MediaTypeControl(), RecordCard(), SearchField(), tabs, ViewingMethodControl(), FeedScreen() (+20 more)

### Community 98 - "availability.service.spec.ts"
Cohesion: 0.22
Nodes (5): content, contentRef, FakeAvailabilityProvider, now, ProviderAvailabilityLookup

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.24
Nodes (8): buildContentPreview(), DiaryDashboardItem, formatWatchedDate(), GENRE_ICON_KINDS, LegacyCreateDiaryDto, LegacyUpdateDiaryDto, toDateParts(), resolveTmdbGenreLabels()

### Community 100 - "MediaSelectionDto"
Cohesion: 0.22
Nodes (8): MediaSelectionDto, ApiProperty, ApiPropertyOptional, IsArray, IsEnum, IsOptional, IsString, Length

### Community 118 - "FriendsService"
Cohesion: 0.31
Nodes (3): FriendsService, Injectable, InjectRepository

### Community 135 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 139 - "friends.controller.ts"
Cohesion: 0.33
Nodes (4): Body, Post, CreateFriendRequestDto, IsUUID

### Community 140 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 141 - "group-recommendations.controller.ts"
Cohesion: 0.24
Nodes (7): GroupRecommendationsController, Body, Controller, Get, Param, Post, Req

### Community 142 - "product/README.md"
Cohesion: 0.38
Nodes (4): MVP 요구사항 매핑, 제품 요구사항 구현 추적표, 출시 전 별도 검증 경계, Davas TO-BE 상세 설계

### Community 144 - "Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy., Source Nodes

### Community 146 - "auth.service.spec.ts"
Cohesion: 0.12
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 147 - "TransactionOutboxEntity"
Cohesion: 0.15
Nodes (10): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+2 more)

### Community 148 - "FileCleanupJobEntity"
Cohesion: 0.33
Nodes (5): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 151 - "UpdateDiaryDto"
Cohesion: 0.18
Nodes (11): IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, Max (+3 more)

### Community 152 - "MediaSearchQueryDto"
Cohesion: 0.17
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.27
Nodes (5): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard()

### Community 156 - "UsersService"
Cohesion: 0.26
Nodes (3): error(), Injectable, UsersService

### Community 157 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 160 - "users.module.ts"
Cohesion: 0.40
Nodes (4): OutboxModule, Module, Module, UsersModule

### Community 161 - "WatchReactionEntity"
Cohesion: 0.15
Nodes (11): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+3 more)

### Community 162 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 163 - "HealthController"
Cohesion: 0.40
Nodes (3): HealthController, Controller, Get

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 166 - "FriendInviteEntity"
Cohesion: 0.11
Nodes (18): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+10 more)

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
Nodes (23): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+15 more)

### Community 175 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 183 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 184 - "TransactionOutboxService"
Cohesion: 0.28
Nodes (4): TransactionOutboxService, Injectable, InjectRepository, Optional

### Community 185 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 186 - "notifications.controller.ts"
Cohesion: 0.27
Nodes (6): NotificationPreferenceCategory, IsBoolean, IsIn, UpdateNotificationPreferenceDto, Body, Put

### Community 187 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 188 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 190 - "7. 콜드 스타트"
Cohesion: 0.67
Nodes (3): 7. 콜드 스타트, 데이터가 거의 없을 때, 사용자 온보딩

### Community 191 - "availability.service.ts"
Cohesion: 0.12
Nodes (12): AvailabilityObservationStatus, TmdbAvailabilityAdapter, Injectable, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS (+4 more)

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 193 - "users.service.ts"
Cohesion: 0.29
Nodes (5): ALLOWED_PROFILE_IMAGE_TYPES, ProfileImageFile, UserProfileResponse, UploadedFile, UseInterceptors

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.29
Nodes (7): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

## Knowledge Gaps
- **570 isolated node(s):** `DNS`, `First deploy`, `Operations`, `Backup and rollback`, `Checks` (+565 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `WatchEventsService` (2× useful, score=1.986739528)
- `api/package.json` (2× useful, score=1.796205065)
- `web/package.json` (2× useful, score=1.796205065)
- `shared/package.json` (2× useful, score=1.796205065)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DiaryEntity` connect `DiaryEntity` to `DiariesService`, `WatchReactionEntity`, `diaries.dashboard.spec.ts`, `diaries-dashboard.service.ts`, `DiariesDashboardService`, `FakeDatabase`, `CommentEntity`, `typeorm.config.ts`, `community.service.ts`, `UserEntity`, `media.service.ts`, `WatchEventsService`, `watch-events.service.ts`, `diaries.module.ts`, `NotificationEntity`, `entities/index.ts`, `SpaceMembershipEntity`, `group-recommendations.service.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `UserEntity` connect `UserEntity` to `CommentEntity`, `UserFollowEntity`, `community.service.ts`, `InviteCodeEntity`, `diaries.module.ts`, `DiaryEntity`, `auth.service.spec.ts`, `SpaceEntity`, `SpaceMembershipEntity`, `UsersService`, `users.module.ts`, `WatchReactionEntity`, `RecommendationSessionEntity`, `FriendInviteEntity`, `typeorm.config.ts`, `AuthService`, `NotificationEntity`, `watch-events.service.ts`, `entities/index.ts`, `TransactionOutboxService`, `users.service.ts`, `auth.service.ts`, `FriendshipEntity`, `FriendsService`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `CommentsService`, `WatchlistService`, `SpacesController`, `community.service.ts`, `FriendsController`, `InviteCodeEntity`, `friends.controller.ts`, `diaries.module.ts`, `group-recommendations.controller.ts`, `spaces.service.ts`, `auth.service.spec.ts`, `InvitesService`, `SpaceInvitesController`, `DiariesDashboardService`, `FriendInviteEntity`, `AuthController`, `WatchEventsService`, `ReactionsService`, `entities/index.ts`, `notifications.controller.ts`, `diaries.controller.ts`, `MediaService`, `NotificationsController`, `auth.service.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `DNS`, `First deploy`, `Operations` to the rest of the system?**
  _570 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._