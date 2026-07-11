# Davas 고가치 화면·플로우 구현 상태

> 기준일: 2026-07-11 (초기 기준선)  
> 원본 체크리스트: `davas-high-value-screen-flow-todo.md`  
> 상태 규칙: **구현됨**은 현재 의도와 일치하는 코드가 확인된 경우, **부분구현**은 UI/API/DB/권한/테스트/브라우저 검증 중 일부만 있는 경우, **미구현**은 핵심 계약이 없는 경우, **선행결정필요**는 데이터 이전 또는 제품 정책 확정이 먼저 필요한 경우다. 이 문서의 초기 상태는 TODO의 `[x]` 완료 판정이 아니다.

## 1. 한 문단 기준선

현재 저장소는 Next.js 15 + NestJS 10 + TypeORM + PostgreSQL 모노레포이고, TMDB 검색·작품 캐시·기본 인증·내 다이어리 대시보드·PUBLIC 커뮤니티·댓글·좋아요·팔로우·알림의 일부가 동작한다. 그러나 migration이 전혀 없고 운영 기본값도 `TYPEORM_SYNC=true`이며, 기록 기본 공개 범위가 `PUBLIC`, `/diary/new`에는 `mock-inception` 저장 fallback, 삭제 API는 stub, 가입은 초대 코드 없이 가능하다. watchlist·companion·friendship·SELECTED 대상·공통 접근 정책·PWA service worker가 없으므로 최신 제품 계약 기준으로는 출시 차단 상태다.

## 2. 배포 AS-IS 읽기 전용 관찰

관찰 대상은 `https://davas.duckdns.org/`이며 430×932 모바일 뷰포트에서 폼 제출 없이 확인했다.

| 영역 | 관찰 결과 | 로컬 코드와의 관계 |
| --- | --- | --- |
| 비인증 진입 | `/`가 `/login`으로 이동한다. `/diary`, `/community`, `/profile` 직접 접근도 `/login`으로 이동한다. | 현재 `middleware.ts`와 일치한다. |
| 로그인 | Davas 로고, `환영합니다`, 이메일·비밀번호, 로그인 유지, coral 로그인 CTA, Google/Apple 버튼, 회원가입 링크가 보인다. | 현재 코드와 동일하며 `href="#"`, 비동작 비밀번호 보기·소셜 버튼이 배포에도 남아 있다. |
| 회원가입 | 프로필 사진 조작, 닉네임·이메일·비밀번호·확인, 약관 동의, 회원가입 CTA가 보인다. 초대 코드 단계는 없다. | 현재 코드와 동일하다. |
| 시각 기준 | 430px 셸, `#f3f6fb`/`#f6f8fc` 회청 배경, 흰색 30px rounded card, Pretendard, 진한 청색 텍스트, `#ff524a` coral CTA, 부드러운 청회색 그림자다. | 브랜드 회귀 기준으로 유지한다. |
| 보호 화면 | 인증 세션이 없어 내부 홈·탐색·다이어리·친구 피드·프로필은 관찰하지 않았다. | 내부 화면 평가는 로컬 코드 기준이며 배포 화면으로 추측하지 않는다. |
| 상태 UI | 비인증 화면에서 별도 loading/empty/error 상태는 관찰되지 않았다. | 이후 로컬 구현에서 명시적으로 검증한다. |

배포 HTML과 현재 로컬 코드의 인증 화면 문구·클래스·조작 결함이 일치하므로 이 범위에서는 동일 계열 빌드로 판단한다. 배포는 시각 기준으로만 사용하고 쓰기·가입·배포는 수행하지 않는다.

## 3. 저장소 기준선

| 영역 | 현재 구현 | 핵심 위험 |
| --- | --- | --- |
| Auth | cookie JWT signup/login/logout/me, bcrypt | 초대 코드 없음, refresh stub, dev secret fallback |
| Diary | create/dashboard/owner edit 조회·수정 | PUBLIC 기본값, delete stub, owner/public 상세 분리 없음, mock media 저장 가능 |
| Social | PUBLIC 커뮤니티, follow, like, comment, notification | 대규모 공개 모델이며 FRIENDS/SELECTED 권한 없음 |
| Media | TMDB 검색·선택 캐시·상세, favorite | 선택 캐시가 인증 불필요, favorite를 watchlist로 쓸 수 없음 |
| Profile | 조회·수정·이미지 업로드 일부 | 개인정보·알림 토글이 localStorage-only, 일반 오류도 로그인 이동 |
| DB | 9개 엔티티, synchronize 기반 | migration 0개, 운영 `TYPEORM_SYNC=true` |
| Web 상태 | 컴포넌트별 loading/error 일부 | route loading/error/not-found 없음, 상태 중첩 다수 |
| 접근성 | 일부 aria/role/Escape | drawer/modal focus trap·restore·inert 없음, 44px 미달 다수 |
| PWA/운영 | favicon, Caddy, Docker Compose | manifest/SW/offline 없음, backup/rollback과 migration 실행 절차 없음 |

초기 git 상태는 `main...origin/main`이고 사용자 소유 untracked 문서 4개가 있다. 이 파일들은 보존한다. 저장소에는 `AGENTS.md`가 없다.

## 4. 167개 초기 매핑

아래 ID는 원본 TODO에서 위에서 아래로 1부터 167까지 부여했다. 네 집합은 중복 없이 전체 167개를 덮는다.

| 상태 | 수 | TODO ID | 근거 요약 |
| --- | ---: | --- | --- |
| 구현됨 | 3 | 150, 151, 152 | 컬렉션·상세 companion 통계·관리자 대시보드는 실제 활성 기능으로 구현되어 있지 않아 후순위 비노출 원칙과 일치한다. 단, 원본 TODO는 최종 UI 감사 전까지 체크하지 않는다. |
| 부분구현 | 43 | 1-9, 17, 21, 24, 27, 29, 37, 41, 46-47, 51-52, 56, 61-63, 65, 69-71, 76, 78-79, 81, 83, 88, 90, 92, 124, 129, 131, 133, 142, 147, 154 | 일부 반응형·상태·pending·PUBLIC 권한 테스트·작품 선택→작성·목록/상세 UI·favorite·기존 댓글/알림 기반은 있으나 완료 조건 전체를 충족하지 못한다. |
| 선행결정필요 | 4 | 12, 87, 118, 130 | PUBLIC 데이터 이전, 기록 저장 시 watchlist 완료 정책, 가입 초대와 친구 초대의 분리, like와 emoji reaction의 관계를 migration 전에 확정해야 한다. |
| 미구현 | 117 | 10-11, 13-16, 18-20, 22-23, 25-26, 28, 30-36, 38-40, 42-45, 48-50, 53-55, 57-60, 64, 66-68, 72-75, 77, 80, 82, 84-86, 89, 91, 93-117, 119-123, 125-128, 132, 134-141, 143-146, 148-149, 153, 155-167 | 최신 PRIVATE/FRIENDS/SELECTED, invitation, companion, friendship, watchlist, friend feed, PWA 계약과 최종 브라우저/E2E 검증이 없다. |

### 선행 정책 결정

이번 구현에서는 개인정보 보수 원칙에 따라 다음 안전 기본값을 채택한다.

1. 기존 `PUBLIC`은 migration에서 `PRIVATE`로 축소한다. 명시적 재공개 UI가 없는 상태에서 공개를 유지하지 않는다.
2. 기존 `media_favorites`는 watchlist `ACTIVE`, 기본 우선순위 `MEDIUM`, 빈 메모·같이 볼 사람으로 이전한다. migration 이후 favorite 엔티티/API는 호환 alias 없이 watchlist로 교체한다.
3. 기록 저장 성공 시 동일 사용자·작품의 ACTIVE watchlist 항목을 `WATCHED`로 원자적으로 전환한다.
4. 가입 초대 코드와 친구 요청은 별도 도메인으로 둔다. 가입 권한과 사회 관계를 결합하지 않는다.
5. 기존 like는 단일 `HEART` reaction으로 안전 이전하고 UI는 소규모 이모지 반응으로 확장한다.

## 5. 의존성과 작업 순서

1. migration 기반과 공통 인증/접근 정책을 만든 뒤 PUBLIC→PRIVATE 축소 migration을 추가한다.
2. P0 첫 기록·허위 조작·상태·접근성을 고쳐 잘못된 데이터 생성을 먼저 막는다.
3. 기록 상세/soft delete와 companion을 같은 diary aggregate로 완성한다.
4. invite와 watchlist를 독립 모듈로 추가하고 가입/탐색/기록 루프에 연결한다.
5. follow를 friendship으로 이전하고 FRIENDS/SELECTED 정책을 feed·detail·comment·reaction에 공통 적용한다.
6. PWA offline/install/update 상태를 추가한다.
7. API/service/component/route 테스트, 전체 build, 로컬 DB migration up/down, 360/390/430/desktop 브라우저 E2E를 실행한 뒤에만 원본 TODO를 체크한다.

## 6. 검증 로그

| 시점 | 검증 | 결과 |
| --- | --- | --- |
| 초기 | `git status --short --branch` | 사용자 untracked 문서 4개 확인, 보존 |
| 초기 | route/API/entity/test/migration inventory | web route 17개 계열, API core 모듈 확인, migration 없음 |
| 초기 | 배포 430px `/`, `/signup`, 보호 URL 3개 | 인증 화면 관찰 완료, 보호 URL은 로그인 redirect, 쓰기 없음 |
| 초기 | TODO checkbox count | 167개, 기존 `[x]` 0개 |

## 7. 남은 위험

- 운영 데이터 분포와 실제 PUBLIC 행 수는 읽지 않았으므로 배포 전 backup과 dry-run migration 리포트가 필요하다.
- 인증된 배포 내부 화면은 사용자 로그인 관찰이 없어서 AS-IS 시각 비교 대상이 아니다.
- Android standalone 설치 검증은 실제 Android Chrome 또는 동등한 설치 가능 환경이 필요하다.
- TMDB 검색 E2E는 로컬 `TMDB_API_KEY`와 네트워크 가능 여부에 영향을 받는다. 실패 시 mapper/cache 계약 테스트와 환경 실패를 구분해 기록한다.

## 8. 구현 후 상태 (2026-07-11)

### 단계별 판정

| 단계 | 코드 상태 | 검증 상태 | 남은 차단 요인 |
| --- | --- | --- | --- |
| P0 | PRIVATE 기본값, 공통 접근 정책, 첫 기록 진입, 허위 조작 제거, route 상태, pending, 모바일 내비게이션·focus trap·reduced motion·별점 키보드까지 반영 | API 접근 정책/직접 URL 단위 테스트, 웹 구조 테스트, 전체 build/lint, 비인증 360/390/430 브라우저와 drawer Escape 확인 | 인증된 diary 화면의 360/390/430 실제 데이터 검증과 PostgreSQL E2E가 필요 |
| P1 | 상세/수정/soft delete, watchlist, invite, companion, friendship, friend feed, SELECTED 대상, 댓글·reaction·notification deep link 구현 | API 103개와 웹 56개 통과; 초대 동시 사용, 친구 전 상태, PRIVATE/FRIENDS/SELECTED 상태 기반 정책, watchlist 전이 테스트 포함 | 실제 PostgreSQL migration 및 두 사용자 브라우저 E2E 미실행 |
| P2 | manifest, 512 아이콘, standalone, service worker, offline/install/update 안내, 명시적 재시도 구현 | `/manifest.webmanifest`, `/sw.js`, `/offline` 직접 URL, 360/390/430px, waiting→SKIP_WAITING→controllerchange 계약 확인 | 실제 Android Chrome 설치·standalone 실행은 실기기 필요 |

### 구현 근거

| 도메인 | 엔티티/DB | API/정책 | Web route/UI | 테스트 |
| --- | --- | --- | --- | --- |
| 공개 범위 | `DiaryEntity`, `DiaryShareEntity`, PUBLIC→PRIVATE migration, enum CHECK | `DiaryAccessService`, diary/feed/community/comment/reaction 공통 판정, API `no-store` | compose PRIVATE 기본, FRIENDS/SELECTED, 명시적 선택 대상, 상세 401/403/404/410 | `diary-access.service.spec.ts`, `community.service.spec.ts`, `reactions.service.spec.ts` |
| 기록/동행 | `DiaryCompanionEntity`, place/mood/memory, soft-delete | diary create/update transaction, detail/update/delete | `/diary/[id]`, `/edit`, 작품 없는 `/new` 차단, TogetherMoment | diary DTO/dashboard specs, web compose/dashboard specs |
| watchlist | `WatchlistItemEntity`, favorite→ACTIVE copy | `/api/watchlist`, 중복 409, 기록 성공 시 WATCHED transaction | `/watchlist`, 작품 상세, 홈/프로필 preview, `봤어요`→compose | `watchlist.service.spec.ts`, media/watchlist contract test |
| 초대 | `InviteCodeEntity`, `InviteUseEntity`, usage CHECK | `/api/invites`, signup transaction + pessimistic lock, bootstrap env | `/signup` 초대 검증 단계, 성공 후 `/explore?intent=record` | AuthService 단일 사용 동시 요청 테스트 |
| 친구/피드 | `FriendshipEntity` canonical pair, mutual follow migration | request/accept/reject/cancel/remove/search, FRIENDS/SELECTED feed | `/friends`, `/feed`, 친구 공유 프로필, 알림 deep link | friends integrity, feed privacy/revocation tests |
| PWA | 해당 없음 | `/api` 및 uploads는 SW cache 제외 | manifest/offline/SW/install/update banner | PWA 구조 테스트 + 브라우저 직접 URL |

### 최종 검증 로그

| 검증 | 결과 | 비고 |
| --- | --- | --- |
| `npm test` | 성공: API 103, Web 56, Shared 0 | 실패/skip/todo 0 |
| `npm run build` | 성공 | shared tsc, Nest build, Next production build 및 23 route 생성 |
| `npm run lint` | 성공 | API `tsc --noEmit`, Web ESLint CLI; 오래된 `next lint`를 공식 flat config로 교체 |
| `git diff --check` | 내용 오류 없음 | Windows LF→CRLF 안내만 있었고 `SelectedMediaCard.tsx` EOF 공백 제거 |
| 로컬 브라우저 360/390/430 | 로그인 360, 초대 가입 360/390, offline 430에서 잘림/가로 넘침 미관찰 | 보호 route 6개는 비인증 `/login` redirect 확인 |
| keyboard drawer/password | password input `password→text`, drawer `aria-hidden true→false→true` 및 Escape 닫기 확인 | modal/별점은 코드·구조 테스트만 완료 |
| PWA 직접 URL | manifest와 SW 응답, offline CTA 확인 | Android 설치는 미실행 |
| `npm audit --omit=dev` | 실패: production 19건(중간 13, 높음 6) | Next/Nest/Multer/Lodash/tar 등; 강제 수정은 major upgrade를 포함해 이번 변경에 자동 적용하지 않음 |
| `npm run migration:show --workspace @davas/api` | DB 연결 단계까지 실행 후 실패 | CLI 누락 의존성 `ts-node`는 보완; `localhost:5432`에 PostgreSQL이 없어 `ECONNREFUSED` |
| migration up/down | 미실행 | 이 호스트에 `docker`, `psql`, `postgres`, PostgreSQL 서비스가 없음 |
| 인증된 10개 E2E | 미실행 | 로컬 API용 PostgreSQL과 두 사용자 fixture가 없어 브라우저 데이터 흐름을 만들 수 없음 |

### 남은 정확한 위험

원본 TODO는 재작업 후 코드·단위 검증·직접 URL 증거가 일치하는 96개만 `[x]`로 유지했고, 실제 PostgreSQL/인증 사용자/Android 검증 또는 후순위 정책이 남은 71개는 `[ ]`로 되돌려 두었다. 후순위 8개(공개 추천·팔로워 SNS·컬렉션·고급 통계·관리자·소셜 로그인·시각 고도화·사진/태그/자동 임시저장)는 활성 MVP에 노출하지 않는다.

1. `1720670400000-HighValueFlows`는 PostgreSQL 문법으로 build되었지만 실제 운영과 동일한 dump 복제본에서 up/down을 실행하지 않았다. 따라서 배포 전 backup, dry-run, row count, FK/CHECK/unique 검증이 필수다.
2. migration down은 신규 테이블을 제거하고 diary 기본값을 PUBLIC으로 되돌리지만, PUBLIC→PRIVATE로 축소한 각 행의 과거 공개값을 복원하지 않는다. 원복 가능성이 있으면 migration 전 DB dump가 유일한 완전 rollback이다.
3. 실제 Android standalone, 인증된 360/390/430 핵심 플로우, 친구 해제 후 열린 탭/HTTP cache 재접근은 남은 출시 게이트다. 서버는 `Cache-Control: private, no-store`와 매 요청 권한 재판정을 적용했다.
4. 배포 AS-IS에는 기존 비동작 소셜/비밀번호/초대 없는 가입이 남아 있으며 운영 배포는 수행하지 않았다.
5. production dependency audit의 high 6건은 별도 업그레이드 검증 없이 배포하면 안 되는 출시 위험이다. `npm audit fix --force`는 Nest 11 등 breaking upgrade를 포함하므로 현재 기능 변경에 섞지 않았다.

## 9. 독립 재검수 갱신 (2026-07-12)

기존 구현 후 상태와 TODO의 `[x]`를 사실로 간주하지 않고 167개 항목을 다시 분류했다. 상세 표와 코드/API/DB/test/browser 증거는 `davas-high-value-screen-flow-revalidation.md`에 있다.

- 빈 PostgreSQL에서는 기존 테이블이 없어 high-value migration이 시작부터 실패하는 결함을 발견해 additive `BaseSchema1720670300000`을 앞에 추가했다. 기존 synchronize 생성 DB의 테이블은 보존하고 exact rollback은 사전 dump 복구를 사용한다.
- malformed/mock media ID를 DTO 단계에서 거절하고, SELECTED 공개는 최소 한 명의 대상이 있어야 하도록 검증했다.
- soft-deleted 기록은 작성자에게 410, 비작성자에게 404를 반환하도록 분리했다.
- 거절된 친구 관계를 다시 요청할 때 수신 알림이 누락되던 분기를 수정했다.
- 만료 세션(401)만 로그인으로 이동하고 네트워크 실패는 로그인 만료로 오인하지 않도록 공통 헤더를 보강했다.
- 친구 피드의 legacy 좋아요 지표를 활성 UI에서 제거하고 상세의 이모지 반응만 유지했다.
- 44px 미달 핵심 조작과 한국시간 자정~오전 9시 관람일 경계 테스트를 보강했다.
- 비SELECTED 저장 시 과거 SELECTED share row를 삭제해 공개 범위 변경 뒤 권한이 되살아나지 않게 했다.
- 댓글과 친구 피드는 공통 접근 정책 주입이 없으면 기동 단계에서 실패하도록 바꾸고, 친구 해제·대상 제거 후 row 조회 전에 차단하는 테스트를 추가했다.
- watchlist 소유권/중복 경쟁/CRUD/WATCHED 전이와 친구의 교차 요청/수락/거절/취소/양방향 삭제 테스트를 확장했다.
- legacy 좋아요·팔로우 데이터와 migration은 보존하되 active friend-feed API 응답·정렬·웹 client·알림에서는 SNS 신호를 제거했다.
- service worker는 install 즉시 활성화하지 않고 사용자가 안내를 선택한 뒤 waiting worker를 활성화하고 controllerchange 후 reload한다.
- 로그인/가입 전환 링크도 44px 터치 대상으로 보강해 360/390/430px에서 visible link/button 미달 0건을 확인했다.

재작업 후 API 103개, Web 56개 테스트와 양쪽 lint가 통과했다. 실제 PostgreSQL migration up/down, 인증된 복수 사용자 12개 필수 회귀, Android standalone은 환경 부재로 여전히 출시 blocker다. 따라서 이 문서의 과거 "구현 후 상태"는 코드 구현 이력으로만 보고 MVP 출시 승인으로 해석하지 않는다.
