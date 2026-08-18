# Graph Report - davas  (2026-08-18)

## Corpus Check
- 390 files · ~120,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2868 nodes · 5606 edges · 189 communities (167 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d8989c6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersService
- WatchlistService
- diary-compose-utils.ts
- devDependencies
- src/index.ts
- MediaPosterRowSection.tsx
- SpacesService
- community.service.ts
- DiaryEntity
- FriendsController
- InviteCodeEntity
- RecordComposer.tsx
- diaries.module.ts
- SpacesController
- recommendations.ts
- watch-events.service.ts
- AppShell.tsx
- ProfileDashboard.tsx
- DiaryRecentListSection.tsx
- FriendsScreen.tsx
- NotificationEntity
- SpaceMembershipEntity
- scripts
- DiariesController
- RecommendationSessionEntity
- CreateDiaryDto
- spaces.service.ts
- SearchField.tsx
- InvitesService
- Davas 제품 기준 문서
- dependencies
- diaries.service.ts
- tmdb.client.ts
- WatchEventsController
- FriendsService
- DiariesDashboardService
- ExploreDashboard.tsx
- BaseSchema1720670300000
- scripts
- AuthController
- AuthService
- auth.ts
- media.service.ts
- WatchEventsService
- NotificationsService
- devDependencies
- ReactionsController
- MediaController
- watch-events.ts
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsService
- ProfileNotificationsScreen.tsx
- CoreRecordContract1720670500000
- MediaEntity
- compilerOptions
- reactions.service.ts
- compilerOptions
- shared/package.json
- SpaceWatchController
- group-recommendations.service.ts
- community.ts
- 15. 단계별 고도화
- CreateRecommendationSessionDto
- diaries.dashboard.spec.ts
- diaries.controller.ts
- Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가
- getApiBaseUrl
- WatchReactionEntity
- Davas 추천 전략 상세 설계
- 5. 필요한 데이터
- GroupRecommendationsService
- NotificationsController
- compilerOptions
- UserFollowEntity
- compilerOptions
- auth.service.ts
- MediaService
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- HomeDashboard.tsx
- AvailabilityService
- FriendInviteEntity
- SpaceEntity
- MediaDetailModal.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- PwaStatus.tsx
- Q: 적당하게 AGNETS.md 작성해
- Raspberry Pi DuckDNS deployment
- coreFetch
- RecordScreens.tsx
- middleware.ts
- DiaryComposeScreen.tsx
- diaries-dashboard.service.ts
- tmdb-detail.mapper.ts
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- 8. 추천 파이프라인
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- 7. 콜드 스타트
- NotificationPreferenceEntity
- tailwind.config.ts
- backup.sh
- class-validator
- @nestjs/platform-express
- typeorm
- ExternalContentRefEntity
- group-recommendations.controller.ts
- product/README.md
- Q: Audit TO-BE integration: composition roots, entities/migrations, shared API/Web contracts, space audience policy, watch/availability/reaction separation, and outbox privacy.
- auth.service.spec.ts
- TransactionOutboxEntity
- DiaryDashboard.tsx
- users.service.ts
- AuthUi.tsx
- DiaryReactionEntity
- UserConsentEntity
- FriendshipEntity
- FakeRepository
- media.controller.ts
- diary/[id]/page.tsx
- media-selection.service.spec.ts
- Q: Can Davas be deployed and verified on Raspberry Pi?
- FakeLifecycleDataSource
- .findMe
- typeorm.config.ts
- Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers
- Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes
- DiaryAccessService
- @nestjs/passport
- SpaceInvitesController
- Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?
- TogetherMomentSection.tsx
- Q: What are the current Davas core functions and how are they delivered?
- notifications.service.ts
- DiaryLikeEntity
- Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해.
- 4. 핵심 도메인 모델
- Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture
- availability.service.ts
- Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?
- class-transformer
- Davas Docker 실행 가이드
- Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace
- 14. 단계별 확장
- Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석

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
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `GenreTags()` --calls--> `getTmdbGenreNames()`  [EXTRACTED]
  apps/web/src/components/media/MediaDetailModal.tsx → apps/web/src/components/media/media-genres.ts
- `FakeDatabase` --references--> `AvailabilityObservationEntity`  [EXTRACTED]
  apps/api/src/recommendations/group-recommendations.service.spec.ts → apps/api/src/database/entities/availability-observation.entity.ts
- `DiaryCompanionEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/diary-companion.entity.ts → apps/api/src/database/entities/diary.entity.ts

## Import Cycles
- None detected.

## Communities (189 total, 22 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.11
Nodes (16): AuthenticatedRequest, CommentsController, ApiTags, Body, Controller, Delete, Get, Param (+8 more)

### Community 1 - "UsersService"
Cohesion: 0.07
Nodes (28): CancelDeletionDto, IsEmail, IsString, Length, DeleteMeDto, IsString, Length, ApiTags (+20 more)

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
Cohesion: 0.08
Nodes (23): DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, GroupRecommendationFeedbackRequest, GroupRecommendationFeedbackResponse, MEDIA_TYPES, ReactionEmoji (+15 more)

### Community 6 - "MediaPosterRowSection.tsx"
Cohesion: 0.10
Nodes (21): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, CalendarDayStateInput (+13 more)

### Community 7 - "SpacesService"
Cohesion: 0.25
Nodes (4): hashToken(), response(), SpacesService, Injectable

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (26): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+18 more)

### Community 9 - "DiaryEntity"
Cohesion: 0.06
Nodes (41): FakeUserRepository, CommunityCommentView, FakeCommentsRepository, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity (+33 more)

### Community 10 - "FriendsController"
Cohesion: 0.22
Nodes (10): FriendsController, Body, Controller, Delete, Get, Param, Patch, Post (+2 more)

### Community 11 - "InviteCodeEntity"
Cohesion: 0.11
Nodes (19): InjectRepository, Optional, InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn (+11 more)

### Community 12 - "RecordComposer.tsx"
Cohesion: 0.11
Nodes (19): Poster(), Draft, freshDraft(), RecordComposer(), sourceLabels, today(), participantLabels, safeReturn() (+11 more)

### Community 13 - "diaries.module.ts"
Cohesion: 0.09
Nodes (31): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+23 more)

### Community 14 - "SpacesController"
Cohesion: 0.24
Nodes (9): SpacesController, Body, Controller, Delete, Get, Param, Patch, Post (+1 more)

### Community 15 - "recommendations.ts"
Cohesion: 0.06
Nodes (48): HomeRecommendations(), RecommendationStatus, recommendationTabs, RecommendationType, availabilityPresentation, buildGroupRecommendationRequest(), consensusPresentation(), FEEDBACK_OPTIONS (+40 more)

### Community 16 - "watch-events.service.ts"
Cohesion: 0.18
Nodes (22): CreateWatchEventDto, SaveWatchReactionDto, ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsOptional (+14 more)

### Community 17 - "AppShell.tsx"
Cohesion: 0.12
Nodes (11): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+3 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.09
Nodes (25): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+17 more)

### Community 19 - "DiaryRecentListSection.tsx"
Cohesion: 0.14
Nodes (13): DiaryListItemView, DiarySummary, DiaryListItem(), DiaryListItemProps, DiaryRecentListSection(), DiaryRecentListSectionProps, DiarySummaryCard(), DiarySummaryCardProps (+5 more)

### Community 20 - "FriendsScreen.tsx"
Cohesion: 0.20
Nodes (18): FriendInviteScreen(), empty, FriendsScreen(), acceptFriend(), acceptFriendInvite(), cancelFriend(), createFriendInvite(), FriendInviteState (+10 more)

### Community 21 - "NotificationEntity"
Cohesion: 0.14
Nodes (10): NotificationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 22 - "SpaceMembershipEntity"
Cohesion: 0.12
Nodes (14): SpaceMembershipEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, SpaceAccessService (+6 more)

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.19
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "RecommendationSessionEntity"
Cohesion: 0.06
Nodes (32): RecommendationExposureEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+24 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "spaces.service.ts"
Cohesion: 0.25
Nodes (11): CreateSpaceDto, CreateSpaceInviteDto, TransferSpaceOwnershipDto, IsInt, IsOptional, IsString, IsUUID, Length (+3 more)

### Community 28 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 29 - "InvitesService"
Cohesion: 0.09
Nodes (18): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+10 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (29): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+21 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, @davas/shared, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "diaries.service.ts"
Cohesion: 0.17
Nodes (9): media, payload, apiError(), assertNotFuture(), DiariesService, DiaryListQuery, fingerprint(), normalizedCreate() (+1 more)

### Community 33 - "tmdb.client.ts"
Cohesion: 0.06
Nodes (32): TmdbAvailabilityAdapter, Injectable, AvailabilityContentRef, DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, imageUrl(), MediaDetailInput (+24 more)

### Community 34 - "WatchEventsController"
Cohesion: 0.22
Nodes (10): Body, Controller, Delete, Get, Param, Patch, Post, Put (+2 more)

### Community 35 - "FriendsService"
Cohesion: 0.16
Nodes (5): CreateFriendRequestDto, IsUUID, FriendsService, Injectable, InjectRepository

### Community 36 - "DiariesDashboardService"
Cohesion: 0.18
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "ExploreDashboard.tsx"
Cohesion: 0.09
Nodes (32): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), getTmdbGenreNames(), TMDB_MOVIE_GENRES (+24 more)

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
Cohesion: 0.08
Nodes (28): CommentAvatar(), DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, ProfileAccountScreen(), genreOptions (+20 more)

### Community 43 - "media.service.ts"
Cohesion: 0.13
Nodes (14): TmdbMetadataAdapter, Injectable, FavoriteMediaItem, FavoriteMediaResponse, MediaDetailResponse, MediaFavoriteResponse, MyMediaDiary, CatalogSearchInput (+6 more)

### Community 44 - "WatchEventsService"
Cohesion: 0.17
Nodes (4): ratingScale(), response(), Injectable, WatchEventsService

### Community 45 - "NotificationsService"
Cohesion: 0.25
Nodes (3): NotificationType, NotificationsService, Injectable

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsController"
Cohesion: 0.21
Nodes (9): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+1 more)

### Community 48 - "MediaController"
Cohesion: 0.19
Nodes (9): MediaController, ApiTags, Body, Controller, Get, Param, Post, Query (+1 more)

### Community 49 - "watch-events.ts"
Cohesion: 0.14
Nodes (21): SpaceTimeline(), compareSpaceReactions(), createWatchEvent(), encode(), getSpaceTimeline(), respondToWatchParticipation(), saveWatchReaction(), calls (+13 more)

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsService"
Cohesion: 0.11
Nodes (14): MediaRecommendationItem, RecommendationsController, ApiTags, Controller, Get, Param, Query, GENRE_PRESETS (+6 more)

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.24
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 55 - "MediaEntity"
Cohesion: 0.05
Nodes (45): AvailabilityObservationEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+37 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "reactions.service.ts"
Cohesion: 0.21
Nodes (5): CreateReactionDto, IsIn, ReactionsService, Injectable, InjectRepository

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "SpaceWatchController"
Cohesion: 0.29
Nodes (6): SpaceWatchController, Controller, Get, Param, Query, Req

### Community 61 - "group-recommendations.service.ts"
Cohesion: 0.13
Nodes (25): assignCandidateChannels(), calculateGroupBase(), CandidateAvailability, clamp01(), DEFAULT_GROUP_GAMMA, DEFAULT_GROUP_LAMBDA, diversityRerank(), GROUP_RECOMMENDATION_ALGORITHM_VERSION (+17 more)

### Community 62 - "community.ts"
Cohesion: 0.07
Nodes (37): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDashboardResponse, CommunityDiaryCard (+29 more)

### Community 63 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 64 - "CreateRecommendationSessionDto"
Cohesion: 0.09
Nodes (28): RecommendationFeedbackKind, RecommendationDecisionRule, RecommendationRewatchPolicy, CONTENT_TYPES, CreateRecommendationSessionDto, DECISION_RULES, FEEDBACK_KINDS, RecommendationFeedbackDto (+20 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.controller.ts"
Cohesion: 0.09
Nodes (20): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+12 more)

### Community 67 - "Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가, Source Nodes

### Community 68 - "getApiBaseUrl"
Cohesion: 0.19
Nodes (16): DiaryReactions(), options, getApiBaseUrl(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary (+8 more)

### Community 69 - "WatchReactionEntity"
Cohesion: 0.06
Nodes (34): Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, WatchParticipantEntity, Column (+26 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.11
Nodes (19): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 14. 피드백, 16. 평가 지표, 17. 운영 안전장치, 18. 구현 전 결정할 값 (+11 more)

### Community 71 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 72 - "GroupRecommendationsService"
Cohesion: 0.23
Nodes (4): GroupRecommendationsService, normalized(), response(), Injectable

### Community 73 - "NotificationsController"
Cohesion: 0.19
Nodes (9): NotificationsController, ApiTags, Body, Controller, Get, Param, Patch, Put (+1 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "UserFollowEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserFollowEntity

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 78 - "MediaService"
Cohesion: 0.10
Nodes (6): Optional, buildContentPreview(), formatWatchedDate(), MediaService, FakeTmdbClient, Injectable

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
Cohesion: 0.13
Nodes (15): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+7 more)

### Community 84 - "FriendInviteEntity"
Cohesion: 0.14
Nodes (13): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+5 more)

### Community 85 - "SpaceEntity"
Cohesion: 0.11
Nodes (18): SpaceEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn (+10 more)

### Community 86 - "MediaDetailModal.tsx"
Cohesion: 0.19
Nodes (8): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), GenreTags(), MediaDetailModal(), MediaDetail

### Community 87 - "Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘, Source Nodes

### Community 88 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 89 - "media-selection-api.spec.ts"
Cohesion: 0.29
Nodes (5): availabilityDtoSource, controllerSource, dtoSource, moduleSource, watchlistControllerSource

### Community 90 - "PwaStatus.tsx"
Cohesion: 0.31
Nodes (4): metadata, InstallEvent, PwaStatus(), resolvePwaUpdateAction()

### Community 91 - "Q: 적당하게 AGNETS.md 작성해"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 적당하게 AGNETS.md 작성해, Source Nodes

### Community 92 - "Raspberry Pi DuckDNS deployment"
Cohesion: 0.18
Nodes (8): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment, Davas 문서, 관리 원칙

### Community 93 - "coreFetch"
Cohesion: 0.15
Nodes (22): chooseActiveSpace(), inviteStatusMessage(), spaceErrorMessage(), SpaceInviteScreen(), SpacesScreen(), CoreApiError, coreFetch(), acceptSpaceInvite() (+14 more)

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.07
Nodes (32): AsyncState(), CoreAppShell(), EmptyState(), MediaTypeControl(), RecordCard(), SearchField(), SearchIcon(), tabs (+24 more)

### Community 98 - "DiaryComposeScreen.tsx"
Cohesion: 0.28
Nodes (4): DiaryEditPageProps, DiaryNewPageProps, DiaryComposeScreen(), DiaryComposeScreenProps

### Community 99 - "diaries-dashboard.service.ts"
Cohesion: 0.12
Nodes (19): matchesTopic(), DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+11 more)

### Community 100 - "tmdb-detail.mapper.ts"
Cohesion: 0.22
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 105 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 118 - "7. 콜드 스타트"
Cohesion: 0.67
Nodes (3): 7. 콜드 스타트, 데이터가 거의 없을 때, 사용자 온보딩

### Community 119 - "NotificationPreferenceEntity"
Cohesion: 0.17
Nodes (11): NotificationPreferenceEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+3 more)

### Community 140 - "ExternalContentRefEntity"
Cohesion: 0.12
Nodes (14): ExternalContentRefEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+6 more)

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
Cohesion: 0.12
Nodes (12): TransactionOutboxEntity, TransactionOutboxStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, NotificationRequestInput (+4 more)

### Community 151 - "DiaryDashboard.tsx"
Cohesion: 0.10
Nodes (30): DiaryCalendarDay, DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), getDiaryCalendarDays() (+22 more)

### Community 152 - "users.service.ts"
Cohesion: 0.11
Nodes (10): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, FakeJwtService, FakeOutbox, FakeUserRepository (+2 more)

### Community 154 - "AuthUi.tsx"
Cohesion: 0.14
Nodes (9): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard(), LegalScreen(), legalDocuments, CURRENT_PRIVACY_VERSION (+1 more)

### Community 155 - "DiaryReactionEntity"
Cohesion: 0.25
Nodes (8): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 156 - "UserConsentEntity"
Cohesion: 0.25
Nodes (8): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UserConsentEntity

### Community 157 - "FriendshipEntity"
Cohesion: 0.17
Nodes (9): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+1 more)

### Community 159 - "media.controller.ts"
Cohesion: 0.07
Nodes (25): selection, AvailabilityQueryDto, ApiPropertyOptional, IsOptional, Matches, MediaSearchQueryDto, ApiPropertyOptional, IsEnum (+17 more)

### Community 160 - "diary/[id]/page.tsx"
Cohesion: 0.29
Nodes (3): DiaryDetailPageProps, RecordDetailScreen(), DiaryDetailScreen()

### Community 163 - "media-selection.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeMediaRepository, interstellarSelection, SavedMedia

### Community 164 - "Q: Can Davas be deployed and verified on Raspberry Pi?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can Davas be deployed and verified on Raspberry Pi?, Source Nodes

### Community 166 - ".findMe"
Cohesion: 0.32
Nodes (6): FriendInvitesController, Controller, Get, Param, Post, Req

### Community 167 - "typeorm.config.ts"
Cohesion: 0.10
Nodes (11): SpacesMembershipInvites1720670700000, WatchEventsAndPersonalReactions1720670800000, CanonicalCatalogAvailability1720670900000, AccountLifecycleNotificationOutbox1720671000000, GroupRecommendationSessions1720671100000, statements(), statements(), statements() (+3 more)

### Community 168 - "Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace RecordComposer DiaryComposeScreen DiaryDetailScreen space sharing participation reactions timeline and API wrappers, Source Nodes

### Community 170 - "Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the diary dashboard persisted media and representative poster regression after canonical media/watch changes, Source Nodes

### Community 171 - "DiaryAccessService"
Cohesion: 0.10
Nodes (16): InjectRepository, Optional, DiaryShareEntity, Column, Entity, Index, JoinColumn, ManyToOne (+8 more)

### Community 173 - "SpaceInvitesController"
Cohesion: 0.24
Nodes (6): SpaceInvitesController, Controller, Get, Param, Post, Req

### Community 175 - "Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 중간중간 새버전이 준비됐어요 안전하게 업데이트 이건 왜 뜨는 거야? 화면 이동마다 약간씩 뜨는데 이거 웹 버전인데 이게 왜 떠?, Source Nodes

### Community 178 - "Q: What are the current Davas core functions and how are they delivered?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What are the current Davas core functions and how are they delivered?, Source Nodes

### Community 184 - "notifications.service.ts"
Cohesion: 0.24
Nodes (8): NOTIFICATION_PREFERENCE_CATEGORIES, NotificationPreferenceCategory, REQUIRED_NOTIFICATION_CATEGORIES, IsBoolean, IsIn, UpdateNotificationPreferenceDto, CommunityNotificationView, CreateNotificationInput

### Community 185 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 187 - "Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 그렇다고 무슨 새로고침 할 떄마다 노출되고 화면 이동할 때마다 노출되고 하는 게 누가봐도 버그잖아. 적절하게 수정해., Source Nodes

### Community 188 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 189 - "Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Narrow TypeScript lint errors in migration specs and the spaces membership fixture, Source Nodes

### Community 191 - "availability.service.ts"
Cohesion: 0.11
Nodes (15): AvailabilityObservationStatus, AVAILABILITY_CACHE_OPTIONS, AvailabilityCacheOptions, AvailabilityResponse, AvailabilityState, DEFAULT_AVAILABILITY_TTL_MS, content, contentRef (+7 more)

### Community 192 - "Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the Web group recommendation flow connect to Explore, shared contracts, API, and product strategy?, Source Nodes

### Community 195 - "Davas Docker 실행 가이드"
Cohesion: 0.29
Nodes (7): Davas Docker 실행 가이드, TypeORM 설정, 개발 모드, 설치와 자동 검증, 실행, 접속 주소, 종료

### Community 196 - "Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Trace the unused safeReturn and WatchTimelinePage warning in the Web workspace, Source Nodes

### Community 199 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 202 - "Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 기록 작성 화면 UIUX, 별점 슬라이더, 뒤로가기 흐름 분석, Source Nodes

## Knowledge Gaps
- **580 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+575 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RecordScreens.tsx` (3× useful, score=2.846307099)
- `WatchEventsService` (3× useful, score=2.83159077)
- `layout.tsx` (2× useful, score=1.903676992)
- `PwaStatus.tsx` (2× useful, score=1.903676992)
- `PwaStatus()` (2× useful, score=1.903676992)
- `SpaceMembershipEntity` (2× useful, score=1.895736498)
- `RecordComposer()` (2× useful, score=1.891923247)
- `typeorm.config.ts` (2× useful, score=1.890169305)
- `GroupRecommendationSessionRequest` (2× useful, score=1.889902881)
- `api/package.json` (2× useful, score=1.702754932)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsController` to `src/index.ts`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsController` to `reactions.service.ts`, `diaries.module.ts`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `CommentsService`, `community.service.ts`, `diaries.module.ts`, `watch-events.service.ts`, `NotificationEntity`, `RecommendationSessionEntity`, `DiaryReactionEntity`, `diaries.service.ts`, `DiariesDashboardService`, `typeorm.config.ts`, `DiaryAccessService`, `WatchEventsService`, `media.service.ts`, `MediaEntity`, `DiaryLikeEntity`, `reactions.service.ts`, `group-recommendations.service.ts`, `diaries.dashboard.spec.ts`, `WatchReactionEntity`, `diaries-dashboard.service.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _580 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.10984848484848485 - nodes in this community are weakly interconnected._
- **Should `UsersService` be split into smaller, more focused modules?**
  _Cohesion score 0.06753246753246753 - nodes in this community are weakly interconnected._
- **Should `WatchlistService` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._