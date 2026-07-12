# Davas 핵심 경험 재설계 Codex 작업 지시 프롬프트

- 기준 설계: [`davas-core-experience-redesign.md`](./davas-core-experience-redesign.md)
- 권장 방식: 아래 통합 프롬프트를 새 Codex 작업에 그대로 전달
- 대안: 한 번에 진행하기 어렵다면 뒤의 4개 단계 프롬프트를 순서대로 사용

## 1. 통합 작업 지시 프롬프트

아래 코드 블록 전체를 복사해 Codex에 전달한다.

```text
목표

D:\Projects\davas 저장소의 Davas를 “친한 사람들끼리 봤던 영화·드라마의 기록과 리뷰를 공유하는 서비스”로 전면 재구성해 주세요.

설계의 단일 기준 문서는 다음 파일입니다.

D:\Projects\davas\docs\product\davas-core-experience-redesign.md

반드시 이 문서를 처음부터 끝까지 읽은 뒤 구현하세요. 현재 구현된 화면과 기능 배치는 제품 요구의 근거로 사용하지 말고, 설계 문서의 새 IA와 화면 명세로 교체하세요. 다만 현재 실사용 디자인 톤인 430px 모바일 셸, Pretendard, 회청색 배경, 흰 라운드 카드, 네이비 글자, blue 상호작용, deep-coral 최종 CTA는 유지하세요.

완료 목표

1. 하단 내비게이션을 `친구 기록`, `기록하기`, `내 기록`, `친구` 네 개로 교체합니다.
2. 추천·공개 커뮤니티·통계·캘린더·찜·즐겨찾기·반응·댓글·알림·인물 검색을 새 IA에서 제거합니다.
3. 작품 찾기 → 기록 작성 → 기록 상세의 핵심 흐름을 실제 API 데이터로 완성합니다.
4. 친구 기록과 내 기록을 실제 데이터로 조회하고 검색합니다.
5. `영화/드라마`와 `영화관/OTT`를 독립된 두 축으로 데이터부터 UI까지 구현합니다.
6. 친구 초대 링크, 요청 수락·거절·삭제와 서버 접근 제어를 완성합니다.
7. 로그인·회원가입·프로필 설정·공통 오류 화면을 새 IA에 맞춥니다.
8. 테스트, lint, production build와 360/390/430px 수동 QA를 완료합니다.

가장 중요한 도메인 규칙

- `Media.mediaType`은 작품 자체의 속성입니다: `MOVIE`는 영화, `TV`는 화면에서 드라마라고 표시합니다.
- `Diary.viewingMethod`는 각 기록의 속성입니다: `THEATER`는 영화관, `OTT`는 OTT입니다.
- 같은 작품을 영화관과 OTT에서 각각 기록할 수 있어야 합니다.
- 작품 검색의 영화/드라마 선택은 `type=movie|tv|multi`로 API와 TMDB까지 전달하세요. multi 첫 페이지만 받은 뒤 Web에서 거르는 방식은 금지합니다.
- 작품 찾기의 영화관/OTT는 사용자가 실제로 본 곳을 선택하는 값입니다. 현재 제공처로 추정하거나 작품 태그로 저장하지 마세요.
- 친구 기록·내 기록 검색에서는 `q + mediaType + viewingMethod`를 서버에서 AND 처리하세요.
- 기존 `watchedPlace`나 영속화되지 않는 `tags`를 `viewingMethod` 대신 사용하지 마세요.
- 새 기록은 작품, 본 곳, 본 날짜만 필수입니다. 별점과 리뷰는 선택입니다.
- 별점은 null 또는 1~5 정수, 리뷰는 trim 후 최대 500자입니다.
- 새 기록의 기본 공개 범위는 `FRIENDS`; POST DTO와 서버는 `FRIENDS/PRIVATE`만 허용하고 새 SELECTED create를 거부하세요. 레거시 `SELECTED` 데이터는 읽기 호환을 유지하세요.
- 레거시 `SELECTED` 기록은 지정된 사용자에게 feed, 검색, 상세에서 계속 보여야 합니다. PATCH에서 visibility와 selectedUserIds를 누락하면 그대로 보존하고, FRIENDS/PRIVATE로 명시 변경할 때만 기존 shares를 제거하세요.
- 소유자의 레거시 SELECTED는 `/me`에도 계속 보이고 `일부 친구 공개(이전 방식)`으로 표시되어야 합니다. 편집 시 명시적으로 바꾸기 전까지 SELECTED와 selectedUserIds를 보존하세요.
- 기록 제목은 사용자에게 받지 말고 서버가 Media 제목으로 기존 `title` 호환 필드를 채우세요.
- `sharedAt`은 서버 관리 필드입니다. FRIENDS create와 PRIVATE/SELECTED→FRIENDS 전환 때 현재 시각, FRIENDS→PRIVATE 때 null, FRIENDS 일반 편집에서는 기존 값을 유지하세요.
- 친구가 아닌 사용자는 UI 경로뿐 아니라 직접 API·URL 접근으로도 친구 공개 기록을 볼 수 없어야 합니다.

작업 안전 규칙

- 시작할 때 `git status --short`를 확인하고 기존 사용자 변경을 기록하세요.
- 현재 dirty worktree의 파일을 무조건 덮어쓰거나 되돌리지 마세요. 겹치는 파일은 기존 diff를 읽고 새 요구와 함께 보존하세요.
- `git reset --hard`, `git checkout --`, 기존 migration 수정, 광범위한 파일 삭제를 하지 마세요.
- 새 schema는 반드시 새 additive TypeORM migration으로 추가하세요.
- 기존 기능의 테이블과 API는 1차 구현에서 파괴적으로 제거하지 말고 새 route/nav에서만 비활성화하세요.
- commit, push, PR 생성은 별도 요청이 없으면 하지 마세요.
- 막히지 않는 사소한 세부는 설계 문서의 원칙에 맞춰 합리적으로 결정하고 계속 진행하세요.

권장 구현 순서

Phase 0. 기준선과 계획

- 저장소 구조, 설계 문서, 기존 변경 diff를 읽으세요.
- 시작 기준선으로 `npm test` 결과를 확인하세요.
- 구현 계획을 데이터 계약 → API → 공통 셸 → 기록 흐름 → 친구/설정 → QA 순서로 작성하세요.
- 각 단계가 끝날 때 관련 테스트를 실행하고, 실패를 다음 단계로 미루지 마세요.

Phase 1. 공유 타입과 DB migration

- `packages/shared/src/index.ts`에 다음 계약을 추가하세요.
  - `VIEWING_METHODS = ['THEATER', 'OTT'] as const`
  - `ViewingMethod`
- `DiaryEntity`에 `viewingMethod`, `sharedAt`, 사용자별 중복 생성을 막을 `clientRequestId`, immutable `clientRequestFingerprint`를 추가하세요. 새 Web/API create에는 request UUID를 필수로 하고 request 관련 두 DB 컬럼은 과거 행만 null을 허용하세요.
- 기존 rating 컬럼을 nullable로 바꾸되 decimal 저장 형식은 유지해도 됩니다.
- 새 migration에서만 schema를 변경하세요.
  - `viewing_method`는 레거시 호환을 위해 DB상 nullable
  - `shared_at` timestamp nullable; 기존 FRIENDS/SELECTED는 createdAt backfill, PRIVATE는 null
  - `rating` nullable
  - `client_request_id` nullable
  - `client_request_fingerprint` varchar(64) nullable
  - `(user_id, client_request_id)` nullable unique index
- `watchedPlace` 레거시 값은 명확한 영화관·극장만 THEATER, 명확한 OTT·서비스명만 OTT로 backfill하고 `집` 같은 애매한 값은 null로 남기세요.
- 기존 migration 파일은 수정하지 마세요.
- migration up/down과 entity 계약 테스트를 추가하세요.

Phase 2. Diary API와 검색 계약

- create DTO에서 새 작성의 `viewingMethod`와 `clientRequestId`를 검증하세요.
- update DTO는 partial update를 허용하되 레거시 null 기록을 수정·저장할 때 Web이 본 곳을 필수로 선택하게 하세요.
- `UpdateDiaryDto`를 `PartialType(CreateDiaryDto)` 그대로 두지 마세요. mediaId, viewingMethod, watchedDate, rating, content, hasSpoiler, visibility만 허용하고 clientRequestId, fingerprint, allowDuplicate, userId, title을 거부하세요. mediaId 변경 시 Media를 재검증하고 title을 다시 파생하세요.
- rating은 optional nullable 1~5 정수로 바꾸고 content는 500자로 제한하세요.
- 미래 watchedDate를 거부하고, 빈 content의 hasSpoiler는 false로 정규화하세요. 기존 평균·통계 코드가 남아 있으면 null rating을 0점으로 계산하지 마세요.
- Create 서비스는 요청 title을 신뢰하지 않고 Media를 조회해 title을 채우세요.
- semantic duplicate보다 clientRequestId lookup을 먼저 수행하세요. 서버가 `mediaId/viewingMethod/watchedDate/rating/trim content/normalized hasSpoiler/visibility`를 정규화해 SHA-256 fingerprint를 저장하고 clientRequestId/allowDuplicate는 hash에서 제외하세요. 같은 key+fingerprint면 기존 결과와 `deduplicated=true`, 같은 key+다른 fingerprint면 `409 IDEMPOTENCY_CONFLICT`를 반환하세요. fingerprint는 PATCH에서 바꾸지 말고 unique race도 같은 규칙으로 복구하세요.
- 같은 mediaId·watchedDate·viewingMethod 기록은 첫 create에서 `409 POSSIBLE_REWATCH`와 기존 기록 요약을 반환하고, 사용자가 확인한 `allowDuplicate=true` 재요청만 새 기록으로 허용하세요.
- 새 작성 기본 visibility를 FRIENDS로 바꾸고, PRIVATE도 지원하세요.
- `GET /diaries/feed`와 `GET /diaries/me`에 `q`, `mediaType`, `viewingMethod`, 안정적인 cursor/limit를 추가하세요. 응답은 `{items,nextCursor,hasMore}`, 기본 20/최대 50으로 하고 feed는 `(sharedAt,createdAt,id)`, me는 `(watchedDate,createdAt,id)` 내림차순 opaque cursor를 사용하세요.
- feed는 접근 가능한 친구와 본인의 FRIENDS 기록, 사용자에게 지정된 레거시 SELECTED 기록을 반환하고, me는 본인의 모든 기록을 반환하세요.
- 필터와 권한을 DB/service에서 적용하고 UI 필터에 의존하지 마세요.
- card/detail 응답에 `mediaType`, `viewingMethod`, nullable rating, visibility, isMine을 일관되게 포함하세요.
- 목록 응답은 리뷰가 없거나 `hasSpoiler=true`면 `reviewPreview=null`을 반드시 반환하고 스포일러 원문을 payload에 포함하지 마세요. 일반 리뷰만 trim preview를 반환하세요.
- create는 `{diary,deduplicated}`, detail은 전체 content가 있는 `{diary}`, 오류는 `{statusCode,code,message,details?}` 계약을 사용하세요. `POSSIBLE_REWATCH` details에는 기존 기록 id, mediaTitle, watchedDate, viewingMethod를 포함하고 Web이 문자열이 아닌 code로 분기하게 하세요.
- 기록 권한 실패와 실제 부재는 모두 `RECORD_NOT_FOUND` 404로 반환해 존재 여부를 숨기세요.
- create/edit/detail/feed/me/filter/idempotency/access-control 왕복 테스트를 추가하세요.

Phase 3. 친구 초대 계약

- 기존 회원가입용 InviteCode와 친구 연결용 token을 혼합하지 마세요.
- 친구 초대용 entity와 새 migration을 추가하세요. token 원문이 아니라 hash, inviter, expiresAt, usedAt을 저장하세요.
- 다음 API를 구현하세요.
  - `POST /friends/invites`
  - `GET /friends/invites/:token`
  - `POST /friends/invites/:token/accept`
- 만료, 이미 사용, 이미 친구, 본인 수락, 인증 전 returnTo를 처리하세요.
- 초대한 사람이 링크를 만들고 초대받은 사람이 수락하는 두 동의를 거친 뒤 ACCEPTED friendship을 만드세요.
- 비회원이 유효한 친구 초대 링크에서 `친구로 연결하기`를 선택한 경우 friend token 자체를 별도 가입 자격으로 허용해 기존 가입 코드의 추가 입력을 요구하지 마세요. Signup DTO/service는 `inviteCode` 또는 `friendInviteToken` 중 정확히 하나를 검증하되 두 entity를 합치지 마세요.
- friend-token signup은 account 생성, ACCEPTED friendship 생성, token `usedAt/usedByUserId` 소비를 한 DB transaction과 row lock/조건부 update로 처리하세요. 동시에 같은 token으로 가입 또는 accept를 시도해도 정확히 한 요청만 성공하고 나머지는 rollback·거부되어야 합니다.
- 기존 친구 요청 API와 pair uniqueness를 보존하세요.
- token 원문과 개인정보를 로그나 URL query에 추가로 노출하지 마세요.
- 권한과 상태 전이 테스트를 추가하세요.

Phase 4. 새 공통 셸과 라우트

- 기존 시각 톤만 참고해 공통 컴포넌트를 새로 구성하세요.
  - `CoreAppShell`
  - `CoreHeader`
  - `BackHeader`
  - `CoreBottomNav`
  - `MediaTypeControl`
  - `ViewingMethodControl`
  - `RecordCard`
  - `MediaResultCard`
  - `EmptyState`
  - `AsyncState`
- 공통 design token은 CSS variable 또는 Tailwind theme 한 곳으로 정리해 inline hex 중복을 늘리지 마세요.
- 실제 사용 기준 색은 설계 문서 6장을 따르세요. 사용 흔적이 없는 레거시 뉴모피즘 토큰을 되살리지 마세요.
- 흰 글자 commit CTA에는 `#D83B35`, 밝은 `#FF5A52`는 별점·장식에만 사용하세요. 흰 카드의 의미 있는 보조 글자는 최소 `#65758A`로 하고 일반 텍스트·CTA 대비 4.5:1을 검증하세요.
- header에서는 hamburger와 drawer를 제거하고 로고·설정 아바타만 남기세요.
- bottom nav는 네 탭과 safe-area, 키보드 focus, active text를 갖춰야 합니다.
- top-level 네 화면과 작품 찾기 1단계에만 CoreHeader+bottom nav를 쓰고, 검색·작성 2단계·상세·수정·설정·초대·오류 화면은 `뒤로가기 + 제목` BackHeader와 설계 문서 7.1의 fallback route를 사용하세요. returnTo는 앱 내부 allowlist로 검증하세요.
- 보호 route와 middleware를 새 route에 맞추세요.
- 기존 route는 적절한 새 route로 redirect해 북마크가 완전히 깨지지 않게 하세요.
- `page.tsx`는 얇게 유지하고 로직은 기능별 component/lib에 두세요.

Phase 5. 작품 찾기와 기록 작성

- `/records/new`를 설계 문서의 FIND-01 + WRITE-01 두 단계로 구현하세요.
- 같은 route/component 상태에서 단계를 관리해도 되지만 브라우저 뒤로 가기와 새로고침 복구가 예측 가능해야 합니다.
- `useMediaSearch(query, type)`가 type을 실제 API까지 전달하도록 수정하세요.
- 작품 결과 선택은 반드시 기존 `POST /media/selections`로 내부 Media UUID를 얻은 뒤 작성 단계로 이동하세요.
- 기존 출연진·스틸컷 중심 작품 상세 modal을 이 흐름에 유지하지 말고 결과 카드와 작성 화면의 선택 작품 요약으로 확인·수정하게 하세요.
- 본 곳은 기본 선택 없이 `영화관/OTT` 두 버튼으로 받고, 작품 종류 필터와 같은 화면에 항상 보이게 하세요.
- 현재 제공 여부라고 오해할 배지나 문구를 만들지 마세요. `선택한 본 곳은 내 기록에 저장돼요.`라고 설명하세요.
- 작성 필드는 작품, 본 곳, 날짜, 선택적 별점, 선택적 리뷰, 조건부 스포일러, 친구 공개 toggle만 남기세요.
- 제목, 태그, 기분, 장소 자유입력, 같이 본 사람, 사진, 메모를 새 작성 화면에 넣지 마세요.
- 별점은 accessible radio/radiogroup으로 null 또는 1~5를 지원하세요.
- draft마다 `crypto.randomUUID()`로 clientRequestId를 만들고 저장 성공까지 유지하세요.
- `POSSIBLE_REWATCH` 응답에는 `기존 기록 보기`와 `새 기록으로 저장`을 보여주고, 사용자가 후자를 고른 경우에만 같은 draft id와 `allowDuplicate=true`로 다시 요청하세요.
- draft는 localStorage가 아니라 사용자별·create/edit별 namespace의 sessionStorage에만 보존하세요. 저장 성공, 명시 폐기, 로그아웃, 계정 삭제에서 purge하고 저장 실패·뒤로 가기·재시도에서는 유지하세요.
- 저장 중 중복 클릭을 막고, 성공 후 실제 상세 데이터로 이동하세요.
- 같은 작품 기록 CTA에서는 Media만 미리 선택하고 본 곳은 사용자에게 다시 확인받으세요.

Phase 6. 친구 기록, 검색, 내 기록, 상세

- `/`는 추천이나 통계가 아니라 친구 최신 기록과 `본 작품 기록하기` CTA만 보여주세요.
- `/search?scope=friends|mine`에 두 줄 필터를 항상 펼쳐 표시하세요.
  - 작품 종류 `[전체][영화][드라마]`
  - 본 곳 `[전체][영화관][OTT]`
- query와 필터를 URL에 보존하고 서버 API에 전달하세요.
- friends q는 작품 제목·원제·작성자 닉네임을, mine q는 작품 제목·원제만 검색하고 각 q 결과를 두 필터와 AND하세요. placeholder도 범위별로 다르게 표시하세요.
- `/me`는 통계 없이 내 기록 목록, 검색 진입, 새 기록 CTA만 보여주세요.
- `/records/:id`는 작성자, 작품, 두 분류 배지, 날짜, nullable 별점, 리뷰, 스포일러 가림, 나도 기록하기, 본인 수정·삭제만 보여주세요.
- RecordCard는 모든 사용 위치에서 작품 종류와 실제 본 곳을 텍스트로 표시하세요. 레거시 null은 `본 곳 미입력`으로 표시하세요.
- 친구가 없음, 기록이 없음, 검색 결과 없음, 로딩, 오류를 서로 다른 문구와 행동으로 처리하세요.
- `더 보기` 버튼으로 cursor pagination을 제공하고 무한 스크롤만 사용하지 마세요.
- TMDB 작품 검색도 `page/totalPages`를 사용한 `다음 결과 보기`를 제공하고 검색어·작품 종류·본 곳을 유지하세요.

Phase 7. 친구, 초대 확인, 설정, 인증

- `/friends`는 친구 초대 CTA, 받은 요청, 사람 찾기, 친구 목록, 보낸 요청만 보여주세요.
- 친구 찾기는 2자 이상, self 제외, email 비노출 결과로 구현하고 각 행에 `친구 요청 보내기/요청 보냄/받은 요청 보기/이미 친구` 상태와 중복 클릭 방지를 제공하세요.
- Web Share API가 있으면 공유 sheet, 없으면 clipboard 복사를 사용하세요.
- `/friends/invite/:token`은 비로그인 returnTo, 연결, 만료, 이미 친구, 본인 링크 상태를 구현하세요.
- `/settings`는 사진, 닉네임, 로그아웃, 약관 링크, 계정 삭제만 보여주세요.
- 계정 삭제 API가 없다면 `DELETE /users/me`를 추가하세요. DB transaction에서 내 기록·댓글 soft delete, friendship/share/reaction/like/notification/follow/watchlist/favorite 정리, companion 참조 익명화, invite revoke, email/nickname 익명화와 user soft delete를 수행하고 cookie를 만료하세요. 프로필 이미지 파일은 commit 뒤 idempotent하게 삭제하고 실패는 cleanup 재시도 대상으로 기록하세요. 삭제된 access token은 거부하고 같은 email/nickname 재가입은 허용하세요.
- 기존 login/signup은 같은 톤으로 단순화하고 초대 returnTo를 보존하세요.
- middleware가 cookie 존재만으로 `/login`을 `/`로 보내지 않게 하세요. API 401이면 `/auth/logout`으로 stale HttpOnly cookie를 먼저 만료하고 session draft를 purge한 뒤 allowlist된 returnTo와 함께 로그인으로 이동해 redirect loop를 막으세요.
- `/terms`, `/privacy` 공개 route와 versioned legal content loader를 추가하세요. 법률 문구를 임의로 쓰지 말고 공식 승인 원문이 없으면 개발 fixture임을 표시한 뒤 배포 blocker로 보고하세요.
- signup은 `termsAccepted=true`, 현재 termsVersion/privacyVersion을 요구하고 새 `user_consents` additive migration/entity에 동의 시각과 버전을 기록하세요. 설정과 signup은 같은 문서 version을 링크해야 합니다.
- 별도 프로필 공개 화면, 알림 설정, 장르 취향, 통계 하위 화면을 새 IA에 넣지 마세요.

Phase 8. 상태·접근성·QA

- loading, empty, offline, 401, 403, 404, 5xx, 포스터 누락 상태를 설계 문서대로 구현하세요.
- 모든 터치 목표는 44×44px 이상, 입력 글자는 14px 이상, 보조 글자는 12px 이상으로 하세요.
- 필터는 색뿐 아니라 텍스트와 pressed/checked semantics를 제공하세요.
- 키보드만으로 검색, 필터, 작품 선택, 별점, 저장, 초대 수락이 가능해야 합니다.
- global focus ring과 reduced-motion을 보존하세요.
- 360px, 390px, 430px에서 가로 스크롤, 하단 nav/CTA 겹침, keyboard overflow를 확인하세요.

테스트와 검증

- 기존 테스트를 단순히 삭제해 통과시키지 마세요. 이전 IA를 고정한 source-regex 디자인 테스트는 새 설계의 계약 테스트로 교체하세요.
- API에는 최소한 다음 테스트를 추가하세요.
  - viewingMethod migration/entity/DTO round trip
  - nullable rating과 1~5 범위
  - clientRequestId idempotency
  - create 후 기록을 편집해도 원래 create retry가 immutable fingerprint로 deduplicate되는 계약
  - movie/tv type forwarding
  - feed/me 두 축 AND filter
  - FRIENDS/PRIVATE access control
  - legacy SELECTED read compatibility
  - new SELECTED create rejection and legacy edit preservation
  - 친구 초대 token 상태 전이
  - 같은 friend token의 동시 signup/accept 중 하나만 성공하는 원자성
  - friend invite를 통한 signup과 계정 soft delete
  - legal consent false/version mismatch rejection and consent persistence
- Web에는 최소한 다음 테스트를 추가하세요.
  - 네 탭 IA와 legacy redirect
  - 작품 종류 type API forwarding
  - 본 곳 필수 선택과 payload
  - 두 축 filter URL/API 전달
  - nullable 별점과 spoiler cover
  - spoiler list payload에 preview 원문이 없는 계약
  - draft 유지와 중복 제출 방지
  - 다른 사용자·로그아웃 뒤 draft 격리 및 purge
  - empty/loading/error 문구
  - accessible name/pressed/radio semantics
  - 404 record existence hiding and structured error-code branching
  - stale cookie 401→logout→login 흐름이 loop 없이 끝나는 회귀 계약
- 검증 명령은 저장소 script를 기준으로 실행하세요.
  1. `npm test`
  2. `npm run lint`
  3. shared를 먼저 포함한 `npm run build`
- 환경 변수나 외부 TMDB 때문에 build 외 실제 검색 검증이 불가능하면, mock 기반 계약 테스트를 완료하고 정확한 외부 blocker만 보고하세요.

완료 보고 형식

최종 답변은 다음 순서로 간결하게 작성하세요.

1. 사용자 관점에서 완성된 결과
2. 핵심 데이터·API 변경과 migration 이름
3. 새 route와 제거된 navigation 노출
4. 실행한 테스트·lint·build와 결과
5. 360/390/430px 수동 QA 결과
6. 남은 blocker 또는 의도적으로 후속으로 남긴 정리 작업
7. 기존 사용자 변경을 보존한 방법

설계 문서의 수용 기준을 하나씩 대조해 빠진 항목이 없을 때만 완료로 보고하세요.
```

## 2. 단계별 작업 지시 프롬프트

통합 작업이 너무 크면 아래 프롬프트를 **1 → 4 순서**로 각각 새 작업에 전달한다. 각 작업은 이전 단계의 변경이 작업 폴더에 남아 있다는 전제다.

### 단계 1 — 데이터 계약과 API

```text
D:\Projects\davas에서 다음 설계 문서를 먼저 모두 읽어 주세요.

D:\Projects\davas\docs\product\davas-core-experience-redesign.md

이번 작업 범위는 새 핵심 경험의 데이터 계약과 API 기반까지입니다. Web 화면은 아직 전면 교체하지 마세요.

필수 작업:

1. 시작 전 git status와 기존 diff를 확인하고 사용자 변경을 보존합니다.
2. shared에 `VIEWING_METHODS`와 `ViewingMethod`를 추가합니다.
3. 새 additive TypeORM migration으로 Diary의 `viewing_method`, `shared_at`, nullable rating, nullable `client_request_id`, nullable immutable `client_request_fingerprint`, 사용자별 nullable request-id unique index를 추가합니다. FRIENDS/SELECTED sharedAt은 createdAt으로 backfill합니다.
4. 명확한 레거시 watchedPlace만 THEATER/OTT로 backfill하고 애매한 값은 null로 둡니다.
5. create/update/detail/feed/me 전 과정에서 viewingMethod와 nullable rating을 왕복시키고, null rating을 평균 0점으로 계산하지 않습니다.
   - Update DTO는 create DTO의 단순 PartialType이 아니며 request id/fingerprint/allowDuplicate/userId/title을 받지 않습니다. mediaId 변경 시 title을 다시 파생합니다.
6. 새 기록은 viewingMethod 필수, content 500자, rating null 또는 1~5 정수, 기본 visibility FRIENDS로 검증합니다. POST는 FRIENDS/PRIVATE만 허용하고 PATCH 누락은 레거시 SELECTED를 보존합니다.
7. title은 Media에서 파생하고 userId+clientRequestId+서버 생성 immutable fingerprint로 중복 create를 처리합니다. 같은 key+fingerprint는 기존 행, 다른 fingerprint는 409, 같은 작품·날짜·본 곳은 POSSIBLE_REWATCH 확인 후 allowDuplicate=true로만 허용합니다.
8. feed/me에 q, mediaType, viewingMethod, cursor, limit을 추가하고 `{items,nextCursor,hasMore}` envelope와 서버 권한을 적용합니다. feed는 sharedAt 최신순이고, feed q만 작성자 닉네임을 검색하며, 레거시 SELECTED는 지정된 사용자와 소유자에게 계속 읽히게 합니다.
   - spoiler 목록 원문은 보내지 않고 structured error code와 POSSIBLE_REWATCH details 계약을 추가합니다. 기록 권한 실패와 부재는 같은 404입니다.
9. media search의 movie/tv/multi가 TMDB까지 전달되는 계약을 테스트합니다.
10. 친구 초대 링크용 별도 entity/migration/API(hash token, expiry, single-use, self/duplicate guards)를 구현합니다. friend-token signup은 계정+ACCEPTED friendship+token consume을 한 transaction/row lock으로 처리해 동시 요청 하나만 성공하게 합니다.
11. 관련 API와 migration 테스트를 추가하고 `npm test`, `npm run lint`, `npm run build`를 실행합니다.

하지 말 것:

- 기존 migration 수정
- watchedPlace/tags를 viewingMethod로 재사용
- legacy SELECTED 데이터 삭제
- 추천·watchlist 등의 기존 테이블 파괴적 삭제
- 기존 사용자 변경 되돌리기
- 요청 없는 commit/push

완료 시 변경 계약, migration, endpoint, 테스트 결과와 Web 단계에 남은 명확한 작업을 보고하세요.
```

### 단계 2 — 공통 셸과 기록 작성

```text
D:\Projects\davas의 아래 설계 문서를 단일 기준으로 Web 핵심 셸과 기록 작성 흐름을 구현해 주세요.

D:\Projects\davas\docs\product\davas-core-experience-redesign.md

이전 단계에서 viewingMethod, nullable rating, filter API, friend invite API가 구현되어 있다고 가정하되 실제 계약을 먼저 확인하세요.

이번 범위:

1. 시작 전 git status와 기존 diff를 확인해 사용자 변경을 보존합니다.
2. 430px 모바일 셸, Pretendard, 회청 배경, white card, navy text, blue interaction, white text 대비 4.5:1을 통과하는 `#D83B35` final CTA 톤을 token화합니다. 밝은 coral은 장식에만 사용합니다.
3. header의 drawer를 제거하고 로고+설정 아바타로 만듭니다.
4. bottom nav를 `친구 기록/기록하기/내 기록/친구` 네 탭으로 교체합니다.
   - top-level과 작품 찾기 1단계에만 nav를 보이고, 검색·작성 2단계·상세·수정·설정·초대·오류는 BackHeader와 안전 fallback을 사용합니다.
5. `/records/new` FIND-01 + WRITE-01 흐름을 구현합니다.
6. 본 곳 영화관/OTT와 작품 종류 전체/영화/드라마를 같은 작품 찾기 화면에 항상 표시합니다.
7. media type을 API까지 전달하고 TMDB 결과는 `POST /media/selections` 후 내부 id로 사용합니다.
8. 작성 필드는 작품, 본 곳, 날짜, 선택적 별점, 선택적 500자 리뷰, 조건부 spoiler, 친구 공개 toggle만 둡니다.
9. rating은 없음 또는 1~5 accessible radio, viewingMethod는 required radiogroup으로 구현합니다.
10. draft/clientRequestId는 사용자·create/edit namespace의 sessionStorage에만 보존합니다. 성공·폐기·로그아웃·탈퇴 때 purge하고 실패 시 입력 유지, 뒤로 가기 확인, 중복 제출 방지를 구현합니다. semantic duplicate 409에는 기존 기록 보기/새 기록 저장 두 선택을 구현합니다.
11. create와 edit가 같은 form을 재사용하게 합니다.
12. 새 route middleware와 필요한 legacy redirect를 추가합니다.
13. 새 IA와 폼 계약 테스트를 추가하고 test/lint/build를 실행합니다.

기존 화면 조각을 억지로 이어 붙이지 말고 새 설계의 컴포넌트 경계로 구성하세요. 기존 기능 테이블/API는 삭제하지 말고 UI에서만 제외하세요. 완료 시 실제 사용자 흐름, 변경 route, 테스트 결과와 다음 단계에 남은 화면을 보고하세요.
```

### 단계 3 — 친구 기록·검색·내 기록·상세

```text
D:\Projects\davas에서 아래 설계 문서를 기준으로 읽기 경험을 완성해 주세요.

D:\Projects\davas\docs\product\davas-core-experience-redesign.md

이번 범위:

1. 시작 전 git status와 기존 diff를 확인해 사용자 변경을 보존합니다.
2. `/`를 추천/통계가 없는 친구 최신 기록 화면 FEED-01로 교체합니다.
3. `/search?scope=friends|mine`의 재사용 가능한 기록 검색 SEARCH-01을 구현합니다.
4. 작품 종류 `[전체][영화][드라마]`, 본 곳 `[전체][영화관][OTT]`를 항상 펼쳐 표시하고 URL과 API에 전달합니다.
   - friends q는 작품 제목·원제·작성자 닉네임, mine q는 작품 제목·원제만 검색합니다.
5. `/me`를 통계 없는 내 기록 MINE-01로 교체합니다.
6. `/records/:id`와 `/records/:id/edit`를 DETAIL-01/WRITE-01 계약으로 구현합니다.
7. 모든 RecordCard와 상세에서 작품 종류와 실제 본 곳을 텍스트로 표시합니다. 레거시 null은 `본 곳 미입력`입니다.
8. nullable 별점, 리뷰 없음, spoiler cover, 나도 기록하기, 본인 수정·삭제를 처리합니다. 기록 권한 실패와 실제 부재는 공통 `RECORD_NOT_FOUND` 404이며, 목록의 spoiler 원문은 payload 자체에 없어야 합니다.
9. 친구 없음, 기록 없음, 검색 결과 없음, loading, error를 서로 다른 상태로 구현합니다.
10. cursor 기반 `더 보기`를 사용하고 무한 스크롤만 제공하지 않습니다.
11. 기존 공개 community, 추천, watchlist, 통계 route는 새 핵심 route로 redirect하거나 navigation에서 제거합니다.
12. server access control regression과 Web 화면 계약 테스트를 추가하고 test/lint/build를 실행합니다.

댓글, 반응, 좋아요, 공개 프로필, 추천을 새 카드와 상세에 넣지 마세요. 완료 시 두 축 검색이 실제 서버 데이터로 동작한다는 테스트 근거를 포함해 보고하세요.
```

### 단계 4 — 친구·초대·설정·최종 QA

```text
D:\Projects\davas에서 아래 설계 문서의 남은 화면과 전체 QA를 완료해 주세요.

D:\Projects\davas\docs\product\davas-core-experience-redesign.md

이번 범위:

1. 시작 전 git status와 기존 diff를 확인해 사용자 변경을 보존합니다.
2. `/friends`를 친구 초대 CTA, 받은 요청, 사람 찾기, 친구 목록, 보낸 요청만 있는 FRIEND-01로 구현합니다.
3. Web Share API/clipboard fallback으로 만료·1회성 친구 초대 링크를 공유합니다.
4. `/friends/invite/:token`에서 비로그인 returnTo, 수락, 만료, 이미 친구, 본인 링크 상태를 구현합니다.
   - 친구 찾기는 2자 이상, self 제외, email 비노출, 요청/보냄/받음/친구 상태를 명확히 표시합니다.
5. `/settings`를 사진, 닉네임, 로그아웃, 약관 링크, 계정 삭제만 있는 SETTINGS-01로 단순화합니다.
   - 필요한 `DELETE /users/me`가 없다면 비밀번호 재확인, DB transaction의 내 기록·레거시 user-owned data 정리와 익명화, 인증 cookie 만료를 구현합니다. profile image 파일은 commit 뒤 지우고 실패 시 cleanup 재시도 대상으로 기록합니다.
6. login/signup이 friend invite returnTo를 잃지 않게 하고 새 시각 톤과 쉬운 문구로 정리합니다.
   - stale cookie는 API 401 시 logout으로 먼저 만료하고 session draft를 purge한 뒤 안전한 returnTo로 login 이동합니다. middleware는 cookie 존재만으로 guest route를 home에 보내지 않습니다.
   - `/terms`, `/privacy` 공개 route와 versioned 공식 문서 loader를 연결합니다. 공식 법률 원문이 없으면 임의 작성하지 말고 배포 blocker로 보고합니다.
   - signup의 termsAccepted와 version을 서버에서 검증하고 user_consents migration/entity에 기록합니다.
7. loading/offline/401/403/404/5xx/poster missing 상태를 전체 route에서 점검합니다.
8. 모든 touch target 44px, 글자 크기, focus-visible, keyboard, aria pressed/radio, reduced-motion을 검수합니다.
9. 360px, 390px, 430px에서 가로 스크롤, fixed nav/CTA, 긴 한글, keyboard overflow를 수동 검수합니다.
10. 이전 IA를 고정한 테스트를 삭제하지 말고 새 설계 계약으로 교체합니다.
11. 최종 `npm test`, `npm run lint`, `npm run build`를 실행합니다.
12. 설계 문서 12장 수용 기준을 하나씩 대조하고 누락을 수정합니다.

완료 답변에는 사용자 관점 결과, migration/API, 새 route, 테스트·build, 세 화면 폭 QA, 남은 의도적 후속 작업, 기존 사용자 diff 보존 내용을 포함하세요. 요청 없는 commit/push는 하지 마세요.
```

## 3. 작업 완료 검수 질문

Codex의 완료 답변을 받을 때 아래 질문에 모두 `예`라고 답할 수 있어야 한다.

- 작품 찾기 한 화면에서 작품 종류와 본 곳을 모두 명확히 선택할 수 있는가?
- 영화/드라마 필터가 클라이언트 표시만이 아니라 TMDB 요청까지 연결되는가?
- 영화관/OTT가 자유 텍스트나 태그가 아닌 Diary 정규 필드로 저장되는가?
- 같은 작품의 영화관 기록과 OTT 기록을 별도로 만들 수 있는가?
- 친구/내 기록 검색의 두 축이 서버에서 AND로 적용되는가?
- 친구가 아닌 사용자의 직접 접근을 서버가 막는가?
- 별점·리뷰 없이도 세 필수 값만으로 기록할 수 있는가?
- 하단 탭이 네 개이며 제외 기능이 새 IA에 노출되지 않는가?
- 모든 empty/loading/error/offline 상태에 다음 행동이 있는가?
- 360/390/430px, 키보드, reduced motion 검수가 끝났는가?
- migration, test, lint, build가 실제로 통과했는가?
- 시작 전부터 있던 사용자 변경이 보존됐는가?
