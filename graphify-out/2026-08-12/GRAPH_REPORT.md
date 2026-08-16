# Graph Report - davas  (2026-08-12)

## Corpus Check
- 296 files · ~81,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2039 nodes · 3736 edges · 151 communities (131 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbff59c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CommentsService
- UsersService
- watchlist.controller.ts
- DiaryComposeScreen.tsx
- devDependencies
- auth.ts
- DiaryDashboard.tsx
- DiaryEntity
- community.service.ts
- UserEntity
- FriendsService
- community.ts
- MediaEntity
- app.module.ts
- UserConsentEntity
- FriendInviteEntity
- RecordComposer.tsx
- AppShell.tsx
- ProfileDashboard.tsx
- HomeDashboard.tsx
- getApiBaseUrl
- NotificationsService
- MoviePosterVisual.tsx
- scripts
- DiariesController
- MediaDetailLoadingIndicator.tsx
- CreateDiaryDto
- MediaSelectionDto
- TmdbClient
- invites.controller.ts
- Davas 제품 기준 문서
- dependencies
- DiariesService
- tmdb.client.ts
- media.ts
- src/index.ts
- DiariesDashboardService
- DiaryReactions.tsx
- recommendations.ts
- scripts
- AuthController
- AuthService
- typeorm.config.ts
- MediaService
- SearchField.tsx
- ExploreDashboard.tsx
- devDependencies
- ReactionsService
- MediaController
- auth.service.spec.ts
- TodayRecommendationSection.tsx
- Davas 제품 요구사항 상세 설계
- RecommendationsController
- ProfileNotificationsScreen.tsx
- MediaDetailModal.tsx
- core.ts
- compilerOptions
- FriendshipEntity
- compilerOptions
- shared/package.json
- tmdb-detail.mapper.ts
- RecommendationsService
- recommendations.service.spec.ts
- AuthUi.tsx
- diary-dashboard-types.ts
- diaries.dashboard.spec.ts
- diaries.service.ts
- WatchlistItemEntity
- CommunityDiaryCard.tsx
- InviteCodeEntity
- Davas 추천 전략 상세 설계
- diaries.ts
- MediaSearchQueryDto
- media.service.spec.ts
- compilerOptions
- DiarySummarySection.tsx
- compilerOptions
- auth.service.ts
- CommentEntity
- main.ts
- Davas Repository Instructions
- Davas 기술 아키텍처 상세 설계
- MediaPosterRowSection.tsx
- watchlist.ts
- diaries.controller.ts
- media-selection.service.spec.ts
- LegalScreen.tsx
- Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘
- nest-cli.json
- media-selection-api.spec.ts
- layout.tsx
- Q: 적당하게 AGNETS.md 작성해
- Davas Docker 실행 가이드
- DiaryLikeEntity
- RecordScreens.tsx
- middleware.ts
- class-validator
- DiaryReactionEntity
- InviteUseEntity
- @nestjs/swagger
- @nestjs/typeorm
- passport
- reflect-metadata
- @nestjs/common
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- sw.js
- tailwind.config.ts
- backup.sh
- @nestjs/passport
- @nestjs/platform-express
- typeorm
- DiaryCompanionEntity
- .findOne
- Raspberry Pi DuckDNS deployment
- product/README.md
- 15. 단계별 고도화
- 4. 핵심 도메인 모델
- 14. 단계별 확장
- 5. 필요한 데이터
- 8. 추천 파이프라인
- 13. 테스트 전략
- 14. 피드백
- 16. 평가 지표

## God Nodes (most connected - your core abstractions)
1. `UserEntity` - 68 edges
2. `DiaryEntity` - 64 edges
3. `getApiBaseUrl()` - 60 edges
4. `AuthService` - 44 edges
5. `MediaEntity` - 36 edges
6. `WatchlistItemEntity` - 24 edges
7. `FriendshipEntity` - 23 edges
8. `CommentEntity` - 21 edges
9. `InviteCodeEntity` - 21 edges
10. `DiariesDashboardService` - 21 edges

## Surprising Connections (you probably didn't know these)
- `CommentAvatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityCommentsSection.tsx → apps/web/src/lib/api/auth.ts
- `Avatar()` --calls--> `normalizeProfileImageUrl()`  [EXTRACTED]
  apps/web/src/components/community/CommunityDiaryCard.tsx → apps/web/src/lib/api/auth.ts
- `toCommunityDiaryDetail()` --indirect_call--> `resolveTmdbGenreLabel()`  [INFERRED]
  apps/api/src/community/community.service.ts → apps/api/src/media/tmdb-genres.ts
- `CommentEntity` --references--> `DiaryEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/diary.entity.ts
- `CommentEntity` --references--> `UserEntity`  [EXTRACTED]
  apps/api/src/database/entities/comment.entity.ts → apps/api/src/database/entities/user.entity.ts

## Import Cycles
- None detected.

## Communities (151 total, 20 thin omitted)

### Community 0 - "CommentsService"
Cohesion: 0.13
Nodes (13): CommentsController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+5 more)

### Community 1 - "UsersService"
Cohesion: 0.08
Nodes (24): DeleteMeDto, IsString, Length, ApiTags, Body, Controller, Delete, Get (+16 more)

### Community 2 - "watchlist.controller.ts"
Cohesion: 0.13
Nodes (18): Body, Controller, Delete, Get, Param, Patch, Post, Query (+10 more)

### Community 3 - "DiaryComposeScreen.tsx"
Cohesion: 0.07
Nodes (22): DiaryEditPageProps, DiaryNewPageProps, clampRating(), isValidDateInput(), mapMediaDetailToDiaryMedia(), ratingFromPointer(), todayIsoDate(), validateDiaryCompose() (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @davas/shared, next, react, react-dom, @tanstack/react-query, zod, devDependencies (+35 more)

### Community 5 - "auth.ts"
Cohesion: 0.09
Nodes (26): DavasHeader(), drawerItems, ProfileAvatar(), DefaultProfileAvatar(), DefaultProfileAvatarProps, genreOptions, ProfileEditScreen(), ProfileHeaderCard() (+18 more)

### Community 6 - "DiaryDashboard.tsx"
Cohesion: 0.19
Nodes (17): DiaryCalendarDay, DiaryDateSelection, filterDiaryItems(), getAdjacentDiaryMonth(), isSameWatchedDate(), ReadonlyURLSearchParamsLike, setDiaryDashboardQueryParam(), sortByRecentlyWritten() (+9 more)

### Community 7 - "DiaryEntity"
Cohesion: 0.06
Nodes (36): AuthenticatedRequest, CommunityCommentView, InjectRepository, Optional, DiaryEntity, Column, CreateDateColumn, DeleteDateColumn (+28 more)

### Community 8 - "community.service.ts"
Cohesion: 0.09
Nodes (29): CommunityController, ApiTags, Controller, Get, Param, Query, Req, buildContentPreview() (+21 more)

### Community 9 - "UserEntity"
Cohesion: 0.09
Nodes (14): FakeUserRepository, FakeCommentsRepository, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn (+6 more)

### Community 10 - "FriendsService"
Cohesion: 0.12
Nodes (14): FriendsController, Body, Controller, Delete, Get, Param, Patch, Post (+6 more)

### Community 11 - "community.ts"
Cohesion: 0.10
Nodes (25): CommunityAuthorPageProps, setCommunityDashboardQueryParam(), toCommunityTab(), CommunityAuthorProfileResponse, CommunityComment, CommunityCommentsResponse, CommunityDiaryDetail, CommunityTab (+17 more)

### Community 12 - "MediaEntity"
Cohesion: 0.07
Nodes (35): ExternalProvider, MediaEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn (+27 more)

### Community 13 - "app.module.ts"
Cohesion: 0.11
Nodes (25): AuthModule, Module, CommentsModule, Module, CommunityModule, Module, DiariesModule, Module (+17 more)

### Community 14 - "UserConsentEntity"
Cohesion: 0.18
Nodes (10): InjectRepository, Optional, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+2 more)

### Community 15 - "FriendInviteEntity"
Cohesion: 0.07
Nodes (26): FriendInviteEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+18 more)

### Community 16 - "RecordComposer.tsx"
Cohesion: 0.14
Nodes (13): AsyncState(), CoreAppShell(), MediaTypeControl(), Poster(), SearchField(), tabs, ViewingMethodControl(), Draft (+5 more)

### Community 17 - "AppShell.tsx"
Cohesion: 0.10
Nodes (12): AppShell(), AppShellProps, BottomTabBar(), renderTabIcon(), TabItem, TabName, tabs, PlaceholderPageProps (+4 more)

### Community 18 - "ProfileDashboard.tsx"
Cohesion: 0.10
Nodes (18): ActivityIconName, ProfileActivitySection(), ProfileActivitySectionProps, buildProfileView(), buildRecentListCard(), ProfileDashboard(), ProfileListCard, ProfileMetric (+10 more)

### Community 19 - "HomeDashboard.tsx"
Cohesion: 0.13
Nodes (15): AuthenticatedLanding(), MeResponse, DiaryDashboardView, buildCalendarDays(), buildHomeDashboardView(), formatRating(), getMediaMeta(), getPrimaryGenre() (+7 more)

### Community 20 - "getApiBaseUrl"
Cohesion: 0.20
Nodes (20): EmptyState(), FriendInviteScreen(), empty, FriendsScreen(), getApiBaseUrl(), acceptFriend(), acceptFriendInvite(), cancelFriend() (+12 more)

### Community 21 - "NotificationsService"
Cohesion: 0.10
Nodes (14): NotificationEntity, NotificationType, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne (+6 more)

### Community 22 - "MoviePosterVisual.tsx"
Cohesion: 0.25
Nodes (8): CalendarDayStateInput, cn(), getCalendarDayState(), MonthlyWatchCalendarSection(), MonthlyWatchCalendarSectionProps, weekdays, MoviePosterVisual(), MoviePosterVisualProps

### Community 23 - "scripts"
Cohesion: 0.09
Nodes (22): devDependencies, prettier, @types/node, typescript, name, private, scripts, build (+14 more)

### Community 24 - "DiariesController"
Cohesion: 0.17
Nodes (12): DiariesController, ApiTags, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 25 - "MediaDetailLoadingIndicator.tsx"
Cohesion: 0.14
Nodes (14): getTmdbGenreNames(), TMDB_MOVIE_GENRES, TMDB_TV_GENRES, MediaDetailLoadingIndicator(), MediaDetailLoadingIndicatorProps, GenreTags(), MediaSearchResults(), formatCreditMeta() (+6 more)

### Community 26 - "CreateDiaryDto"
Cohesion: 0.13
Nodes (14): valid, CreateDiaryDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional (+6 more)

### Community 27 - "MediaSelectionDto"
Cohesion: 0.25
Nodes (8): MediaSelectionDto, ApiProperty, ApiPropertyOptional, IsEnum, IsOptional, IsString, Length, IsArray

### Community 28 - "TmdbClient"
Cohesion: 0.16
Nodes (10): imageUrl(), TmdbClient, Injectable, Optional, DavasMediaSearchItem, imageUrl(), mapTmdbRecommendationResult(), mapTmdbSearchResult() (+2 more)

### Community 29 - "invites.controller.ts"
Cohesion: 0.12
Nodes (15): InvitesController, Body, Controller, Get, Post, Req, CreateInviteDto, IsInt (+7 more)

### Community 30 - "Davas 제품 기준 문서"
Cohesion: 0.07
Nodes (29): 0. 정책과 공급자 검증, 10. 후속 범위, 11. 출시 전 체크, 1. 계정과 공간, 1. 제품 목표, 2. 제품 원칙, 2. 카탈로그와 감상 기록, 3. MVP (+21 more)

### Community 31 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcrypt, class-transformer, @davas/shared, @nestjs/config, @nestjs/core, @nestjs/jwt, passport-jwt (+11 more)

### Community 32 - "DiariesService"
Cohesion: 0.30
Nodes (4): apiError(), assertNotFuture(), DiariesService, Injectable

### Community 33 - "tmdb.client.ts"
Cohesion: 0.11
Nodes (16): DavasPersonSearchItem, DiscoverRecommendationsInput, Fetcher, MediaDetailInput, MediaSearchInput, MediaSearchResponse, MediaSearchType, PersonCreditsInput (+8 more)

### Community 34 - "media.ts"
Cohesion: 0.18
Nodes (12): getDepartmentLabel(), PersonSearchResults(), PeopleSearchStatus, getPersonCredits(), MediaSearchResponse, MyMediaDiary, PersonCreditsResponse, PersonSearchResponse (+4 more)

### Community 35 - "src/index.ts"
Cohesion: 0.13
Nodes (15): legalDocuments, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION, DAVAS_APP_NAME, DIARY_VISIBILITIES, FRIENDSHIP_STATUSES, FriendshipStatus, MEDIA_TYPES (+7 more)

### Community 36 - "DiariesDashboardService"
Cohesion: 0.23
Nodes (3): Optional, DiariesDashboardService, Injectable

### Community 37 - "DiaryReactions.tsx"
Cohesion: 0.40
Nodes (8): DiaryReactions(), options, addDiaryReaction(), DiaryReaction, getDiaryReactions(), parse(), ReactionEmoji, removeDiaryReaction()

### Community 38 - "recommendations.ts"
Cohesion: 0.13
Nodes (20): GenreRecommendationSection(), GenreRecommendationSectionProps, GenreRecommendationTile, placeholderGenreTiles, ExploreRecommendationsState, GenreRecommendationTile, initialState, RecommendationStatus (+12 more)

### Community 39 - "scripts"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, migration:revert, migration:revert:src (+8 more)

### Community 40 - "AuthController"
Cohesion: 0.22
Nodes (8): AuthController, ApiTags, Body, Controller, Get, Post, Req, Res

### Community 41 - "AuthService"
Cohesion: 0.15
Nodes (11): AuthService, Injectable, SignupDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsOptional (+3 more)

### Community 42 - "typeorm.config.ts"
Cohesion: 0.07
Nodes (18): FileCleanupJobEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Entity (+10 more)

### Community 43 - "MediaService"
Cohesion: 0.24
Nodes (4): buildContentPreview(), formatWatchedDate(), MediaService, Injectable

### Community 44 - "SearchField.tsx"
Cohesion: 0.15
Nodes (10): SearchEntry(), SearchEntryProps, SearchField(), SearchFieldProps, SearchIconProps, CommunitySearchBarProps, DiarySearchBar(), DiarySearchBarProps (+2 more)

### Community 45 - "ExploreDashboard.tsx"
Cohesion: 0.27
Nodes (9): ExploreDashboard(), recommendationToPosterItem(), ExploreFilter, ExploreFilterChips(), filters, ExploreShortcutGrid(), useExploreRecommendations(), usePeopleSearch() (+1 more)

### Community 46 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/cli, sql.js, ts-node, tsx, @types/bcrypt, @types/passport-jwt, @types/pg (+7 more)

### Community 47 - "ReactionsService"
Cohesion: 0.13
Nodes (13): ReactionsController, Body, Controller, Delete, Get, Param, Post, Req (+5 more)

### Community 48 - "MediaController"
Cohesion: 0.24
Nodes (6): MediaController, ApiTags, Body, Controller, Post, Req

### Community 49 - "auth.service.spec.ts"
Cohesion: 0.13
Nodes (6): FakeInviteRepository, FakeInviteUseRepository, FakeJwtService, legal, SavedUser, SerializedDataSource

### Community 50 - "TodayRecommendationSection.tsx"
Cohesion: 0.14
Nodes (13): buildTodayHeroItems(), getRecommendationMeta(), TodayRecommendationSection(), TodayRecommendationSectionProps, ArchiveHighlight, ArchiveHighlightSection(), ArchiveHighlightSectionProps, buildArchiveHeroItems() (+5 more)

### Community 51 - "Davas 제품 요구사항 상세 설계"
Cohesion: 0.06
Nodes (34): 10. 성공 지표, 11. 분석 이벤트 최소 집합, 12. 주요 위험과 대응, 13. 출시 전 확정할 결정, 1. 목적과 범위, 2. 제품 원칙, 3. 사용자와 관계 모델, 4.1 공간 시작 (+26 more)

### Community 52 - "RecommendationsController"
Cohesion: 0.24
Nodes (6): RecommendationsController, ApiTags, Controller, Get, Param, Query

### Community 53 - "ProfileNotificationsScreen.tsx"
Cohesion: 0.24
Nodes (10): formatNotificationDate(), notificationMessage(), NotificationStatus, ProfileNotificationsScreen(), CommunityNotificationItem, CommunityNotificationsResponse, CommunityNotificationType, getCommunityNotifications() (+2 more)

### Community 54 - "MediaDetailModal.tsx"
Cohesion: 0.21
Nodes (7): BasicInfoGrid(), DetailInfoCard(), MyRatingCard(), StillCutStrip(), fallbackOverview(), MediaDetailModal(), MediaDetail

### Community 55 - "core.ts"
Cohesion: 0.17
Nodes (13): ApiErrorBody, CoreApiError, coreFetch(), createRecord(), CursorPage, listRecords(), query(), RecordDetailData (+5 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (13): packages/shared/src/index.ts, compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, paths (+5 more)

### Community 57 - "FriendshipEntity"
Cohesion: 0.14
Nodes (10): FriendshipEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn (+2 more)

### Community 58 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, paths (+12 more)

### Community 59 - "shared/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, tsx, main, name, private, scripts, build (+4 more)

### Community 60 - "tmdb-detail.mapper.ts"
Cohesion: 0.24
Nodes (9): firstRuntime(), imageUrl(), koreanCertification(), mapTmdbDetail(), TmdbCreditPerson, TmdbDetailPayload, TmdbImageItem, TmdbMediaDetail (+1 more)

### Community 61 - "RecommendationsService"
Cohesion: 0.17
Nodes (9): MediaRecommendationItem, RecommendationsModule, Module, GENRE_PRESETS, GenrePreset, RandomGenreRecommendationQuery, RecommendationQuery, RecommendationsService (+1 more)

### Community 63 - "AuthUi.tsx"
Cohesion: 0.27
Nodes (5): AuthShell(), LoginCard(), post(), safeReturn(), SignupCard()

### Community 64 - "diary-dashboard-types.ts"
Cohesion: 0.13
Nodes (18): DiaryCalendarMarker, DiaryDashboardCalendar, DiaryGenreRatio, DiaryListItemView, getDiaryCalendarDays(), DiaryGenreRatioCard(), DiaryGenreRatioCardProps, iconByKind (+10 more)

### Community 65 - "diaries.dashboard.spec.ts"
Cohesion: 0.18
Nodes (7): authControllerSource, controllerSource, diaryEntitySource, FakeMediaRepository, FakeRepository, moduleSource, serviceSource

### Community 66 - "diaries.service.ts"
Cohesion: 0.11
Nodes (16): media, payload, DiaryListQuery, fingerprint(), normalizedCreate(), IsBoolean, IsIn, IsInt (+8 more)

### Community 67 - "WatchlistItemEntity"
Cohesion: 0.13
Nodes (12): Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn (+4 more)

### Community 68 - "CommunityDiaryCard.tsx"
Cohesion: 0.14
Nodes (13): CommunityDashboardResponse, CommunityDiaryCard, CommunityDashboard(), Avatar(), CommunityDiaryCard(), CommunityDiaryCardProps, CommunityFeedSection(), CommunityFeedSectionProps (+5 more)

### Community 69 - "InviteCodeEntity"
Cohesion: 0.13
Nodes (12): InviteCodeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany (+4 more)

### Community 70 - "Davas 추천 전략 상세 설계"
Cohesion: 0.12
Nodes (16): 10. 그룹 점수, 11. 다양성과 탐색, 12. 설명과 개인정보, 13. 합의 흐름, 17. 운영 안전장치, 18. 구현 전 결정할 값, 1. 목표, 2. 설계 원칙 (+8 more)

### Community 71 - "diaries.ts"
Cohesion: 0.20
Nodes (10): DiaryDetailPageProps, DetailStatus, DiaryDetailScreen(), CreatedDiaryResponse, createDiary(), CreateDiaryPayload, deleteDiary(), EditableDiary (+2 more)

### Community 72 - "MediaSearchQueryDto"
Cohesion: 0.18
Nodes (10): MediaSearchQueryDto, ApiPropertyOptional, IsEnum, IsInt, IsOptional, IsString, Length, Max (+2 more)

### Community 74 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, declaration, declarationMap, outDir, rootDir, extends, include, src/**/*.ts (+1 more)

### Community 75 - "DiarySummarySection.tsx"
Cohesion: 0.16
Nodes (11): DiarySummary, DiarySummaryCard(), DiarySummaryCardProps, toneClasses, DiarySummarySection(), DiarySummarySectionProps, RecentRecord, RecentRecordsSection() (+3 more)

### Community 76 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 77 - "auth.service.ts"
Cohesion: 0.25
Nodes (7): AuthenticatedUser, AuthResult, LoginDto, ApiProperty, IsEmail, IsString, Length

### Community 78 - "CommentEntity"
Cohesion: 0.15
Nodes (12): InjectRepository, Optional, CommentEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index (+4 more)

### Community 79 - "main.ts"
Cohesion: 0.29
Nodes (4): AppModule, Module, ApiExceptionFilter, Catch

### Community 80 - "Davas Repository Instructions"
Cohesion: 0.22
Nodes (8): Code Intelligence Routing, Database and Deployment Safety, Davas Repository Instructions, Editing Boundaries, Graphify, Repository Map, Scope, Validation

### Community 81 - "Davas 기술 아키텍처 상세 설계"
Cohesion: 0.15
Nodes (13): 10. 추천 모듈 경계, 11. 개인정보와 삭제 처리, 12. 관측성과 운영, 15. ADR로 확정할 항목, 1. 설계 목표, 2. 권장 시스템 구성, 3. 애플리케이션 모듈, 5. 식별자와 공통 저장 규칙 (+5 more)

### Community 82 - "MediaPosterRowSection.tsx"
Cohesion: 0.32
Nodes (6): FavoriteMovie, FavoriteMoviesSection(), FavoriteMoviesSectionProps, MediaPosterItem, MediaPosterRowSection(), MediaPosterRowSectionProps

### Community 83 - "watchlist.ts"
Cohesion: 0.47
Nodes (7): WatchlistScreen(), addWatchlist(), getWatchlist(), json(), removeWatchlist(), updateWatchlist(), WatchlistItem

### Community 84 - "diaries.controller.ts"
Cohesion: 0.20
Nodes (9): AuthenticatedRequest, DiaryListQueryDto, IsIn, IsInt, IsOptional, IsString, Max, Min (+1 more)

### Community 85 - "media-selection.service.spec.ts"
Cohesion: 0.29
Nodes (3): FakeMediaRepository, interstellarSelection, SavedMedia

### Community 87 - "Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: AGENTS.md에 Graphify랑 Serena 사용 지침 적당한지 확인해줘. 그리고 다른 AGNETS.md에 필요한 내용 있는지 알려줘, Source Nodes

### Community 88 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 89 - "media-selection-api.spec.ts"
Cohesion: 0.33
Nodes (4): controllerSource, dtoSource, moduleSource, watchlistControllerSource

### Community 90 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, InstallEvent, PwaStatus()

### Community 91 - "Q: 적당하게 AGNETS.md 작성해"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 적당하게 AGNETS.md 작성해, Source Nodes

### Community 92 - "Davas Docker 실행 가이드"
Cohesion: 0.20
Nodes (7): Davas Docker 실행 가이드, TypeORM 설정, 실행, 접속 주소, 종료, Davas 문서, 관리 원칙

### Community 93 - "DiaryLikeEntity"
Cohesion: 0.25
Nodes (8): DiaryLikeEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 95 - "RecordScreens.tsx"
Cohesion: 0.15
Nodes (13): RecordCard(), FeedScreen(), MineScreen(), RecordDetailScreen(), RecordList(), safeReturn(), SearchScreen(), useRecords() (+5 more)

### Community 99 - "DiaryReactionEntity"
Cohesion: 0.25
Nodes (8): DiaryReactionEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 100 - "InviteUseEntity"
Cohesion: 0.25
Nodes (8): InviteUseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 139 - "DiaryCompanionEntity"
Cohesion: 0.29
Nodes (7): DiaryCompanionEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn

### Community 140 - ".findOne"
Cohesion: 0.38
Nodes (3): Get, Param, Query

### Community 141 - "Raspberry Pi DuckDNS deployment"
Cohesion: 0.33
Nodes (6): Backup and rollback, Checks, DNS, First deploy, Operations, Raspberry Pi DuckDNS deployment

### Community 143 - "15. 단계별 고도화"
Cohesion: 0.33
Nodes (6): 15. 단계별 고도화, 단계 0: 결정론적 MVP, 단계 1: 베이지안 개인화, 단계 2: 사용자별 학습 모델, 단계 3: 문맥 밴딧, 단계 4: 협업 필터링

### Community 144 - "4. 핵심 도메인 모델"
Cohesion: 0.33
Nodes (6): 4.1 Identity, 4.2 Spaces, 4.3 Catalog, 4.4 Viewing Journal, 4.5 Availability와 추천, 4. 핵심 도메인 모델

### Community 145 - "14. 단계별 확장"
Cohesion: 0.40
Nodes (5): 14. 단계별 확장, 1단계: 비공개 2~5명, 2단계: 친구와 복수 공간, 3단계: 큰 그룹, 4단계: 공개 탐색

### Community 146 - "5. 필요한 데이터"
Cohesion: 0.50
Nodes (4): 5. 필요한 데이터, 명시적 신호, 암시적 신호, 콘텐츠 특징

### Community 147 - "8. 추천 파이프라인"
Cohesion: 0.50
Nodes (4): 8. 추천 파이프라인, 단계 1: 요청 정규화, 단계 2: 하드 필터, 단계 3: 후보 생성

### Community 148 - "13. 테스트 전략"
Cohesion: 0.50
Nodes (4): 13. 테스트 전략, 도메인 단위 테스트, 종단 간 테스트, 통합 테스트

### Community 149 - "14. 피드백"
Cohesion: 0.67
Nodes (3): 14. 피드백, 감상 후, 노출 시점

### Community 150 - "16. 평가 지표"
Cohesion: 0.67
Nodes (3): 16. 평가 지표, 오프라인, 온라인

## Knowledge Gaps
- **469 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+464 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `REACTION_EMOJIS` connect `ReactionsService` to `src/index.ts`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Why does `ReactionsController` connect `ReactionsService` to `app.module.ts`?**
  _High betweenness centrality (0.268) - this node is a cross-community bridge._
- **Why does `DiaryEntity` connect `DiaryEntity` to `DiariesService`, `diaries.dashboard.spec.ts`, `diaries.service.ts`, `DiaryReactionEntity`, `DiariesDashboardService`, `CommentsService`, `community.service.ts`, `UserEntity`, `typeorm.config.ts`, `DiaryCompanionEntity`, `MediaEntity`, `app.module.ts`, `CommentEntity`, `NotificationsService`, `DiaryLikeEntity`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _469 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CommentsService` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._
- **Should `UsersService` be split into smaller, more focused modules?**
  _Cohesion score 0.08170731707317073 - nodes in this community are weakly interconnected._
- **Should `watchlist.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._