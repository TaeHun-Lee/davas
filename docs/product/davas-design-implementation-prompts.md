# Davas 설계 반영 단계별 실행 프롬프트

**작성일:** 2026-07-10  
**기준 설계서:** `docs/product/davas-pwa-self-hosted-design.md`  
**목적:** Davas 모바일 우선 PWA 자가 호스팅 설계를 현재 프로젝트에 단계적으로 반영하기 위한 Codex 실행 프롬프트 모음

---

## 1. 사용 원칙

이 문서는 다음 Codex 세션에 그대로 붙여 넣어 실행할 수 있는 프롬프트를 순서대로 제공한다.

현재 프로젝트는 이미 `apps/web`, `apps/api`, `packages/shared` 모노레포 구조이며, 설계서의 목표와 일부 차이가 있다.

| 항목 | 설계서 목표 | 현재 프로젝트 반영 원칙 |
| --- | --- | --- |
| Frontend | React + Vite + PWA | 단기 MVP에서는 기존 Next.js 유지 가능 |
| Backend | NestJS | 유지 |
| ORM | Prisma 권장 | 단기 MVP에서는 기존 TypeORM 유지 가능 |
| DB | PostgreSQL | 유지 |
| 운영 | Docker Compose + Caddy + DuckDNS + 백업 | 후반 단계에서 반영 |

단계별 작업자는 다음 원칙을 지킨다.

1. 항상 `docs/product/davas-pwa-self-hosted-design.md`를 먼저 읽고 현재 구현과 비교한다.
2. 기존 UI 톤, 모바일 우선 구조, 하단 5탭 경험을 깨지 않는다.
3. 대규모 공개 SNS 방향으로 확장하지 않는다.
4. 초대제, 같이 본 기록, 보고 싶은 목록, 친구 기반 피드, 공개 범위를 MVP 핵심으로 본다.
5. 설계서가 허용한 범위 안에서 Next.js/TypeORM 유지가 더 빠르면 유지한다.
6. 각 세션 종료 후 반드시 해당 단계 재검증 프롬프트를 별도 세션 또는 같은 세션에서 실행한다.

---

## 2. 프롬프트 실행 순서

| 순서 | 프롬프트 | 목적 |
| --- | --- | --- |
| 0 | P0. 설계-현황 비교분석 및 작업 지점 도출 | 전체 구현 갭을 먼저 문서화 |
| 1 | P1. Foundation 실행 | 초대제 인증, 사용자/세션, 기본 스키마 정리 |
| 1R | P1R. Foundation 재검수 및 개선 | Foundation 미구현/부분구현/오구현 정리 및 보완 |
| 2 | P2. Media Search 실행 | TMDB 검색, 작품 상세, 내부 캐시, TMDB 고지 정리 |
| 2R | P2R. Media Search 재검수 및 개선 | Media 영역 검수 및 보완 |
| 3 | P3. Review Core 실행 | 리뷰 작성/수정/삭제, 같이 본 기록, 공개 범위 기반 정리 |
| 3R | P3R. Review Core 재검수 및 개선 | Review Core 검수 및 보완 |
| 4 | P4. Personal Archive 실행 | 내 기록, 보고 싶은 목록, 봤음 전환, 통계 기초 |
| 4R | P4R. Personal Archive 재검수 및 개선 | Archive/Watchlist 검수 및 보완 |
| 5 | P5. Small Social 실행 | 친구 초대/수락, 친구 피드, 댓글, 이모지 반응, 공개 범위 검증 |
| 5R | P5R. Small Social 재검수 및 개선 | Social 영역 검수 및 보완 |
| 6 | P6. Self-host Production 실행 | PWA 설치 요건, Caddy, DuckDNS, 백업, 운영 문서 |
| 6R | P6R. Self-host Production 재검수 및 개선 | 운영/배포 영역 검수 및 보완 |
| 7 | P7. 총괄 설계 적합성 비교분석 | 설계서 기준 최종 갭 도출 |
| 8 | P8. 총괄 재검증 및 개선 실행 | 최종 미구현/부분구현/오구현/불필요 구현 개선 |

---

## 3. 공통 검수 분류 기준

재검수 프롬프트는 항상 아래 네 가지 분류를 사용한다.

| 분류 | 의미 |
| --- | --- |
| 미구현 | 설계서에 명시됐지만 코드/문서/테스트가 없는 상태 |
| 부분구현 | 일부 흐름만 동작하거나 UI/API/DB/테스트 중 일부만 있는 상태 |
| 잘못된구현 | 설계 의도와 반대되거나 보안/공개범위/데이터 모델이 어긋난 상태 |
| 불필요한구현 | 설계서의 1차 MVP에서 제외했거나 대규모 SNS 방향으로 불필요하게 확장된 상태 |

---

## 4. P0. 설계-현황 비교분석 및 작업 지점 도출 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 설계문서를 기준으로 현재 Davas 프로젝트 구현 상태를 비교분석해줘.

목표:
1. 설계서의 MVP 성공 기준과 현재 구현 상태를 비교한다.
2. 미구현/부분구현/잘못된구현/불필요한구현을 분류한다.
3. 다음 단계에서 실제로 작업해야 할 지점을 우선순위로 도출한다.
4. 분석 결과를 docs/product/davas-implementation-gap-analysis.md 로 저장한다.

분석 대상:
- apps/web
- apps/api
- packages/shared
- docker-compose.yml
- docs/development
- docs/deployment
- 기존 테스트 파일

특히 확인할 항목:
- 초대제 회원가입/로그인
- JWT 세션 흐름
- 사용자 프로필과 프로필 이미지
- TMDB 검색/상세/내부 캐시
- 리뷰 작성/수정/삭제
- 같이 본 사람/장소/분위기/추억 메모
- 보고 싶은 목록과 봤음 전환
- 친구 초대/수락/친구 피드
- 댓글/이모지 반응
- 공개 범위: private/friends/selected
- 모바일 하단 5탭 구조
- PWA manifest/service worker
- Raspberry Pi Docker Compose, Caddy, DuckDNS, pg_dump 백업

주의:
- 설계서 13장의 지침에 따라 Next.js/TypeORM은 단기 MVP에서 유지해도 된다.
- 단순히 설계서와 다른 기술이라고 바로 문제로 분류하지 말고, MVP 목표 달성에 영향을 주는지 판단한다.
- 코드 수정은 하지 말고 분석 문서만 작성한다.

결과 문서 형식:
1. 한 문단 결론
2. 설계서 기준 기능별 구현 상태 표
3. 미구현/부분구현/잘못된구현/불필요한구현 목록
4. 우선순위 작업 백로그
5. 다음 실행 프롬프트 추천 순서
```

---

## 5. P1. Foundation 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 와 docs/product/davas-implementation-gap-analysis.md 를 기준으로 Phase 1 Foundation 작업을 구현해줘.

목표:
- 초대제 회원가입/로그인 기반을 완성한다.
- JWT 인증 흐름을 현재 Next.js + NestJS + TypeORM 구조에 맞게 안정화한다.
- 사용자 프로필, 선호 장르, 프로필 이미지 저장 흐름을 설계서 MVP 기준에 맞춘다.
- DB 스키마와 shared type을 설계서 용어에 맞게 정리한다.

작업 범위:
1. Invite 도메인 추가
   - invite_codes 엔티티 또는 현재 TypeORM 패턴에 맞는 동등 모델 추가
   - 초대 코드 생성/목록/검증 API 추가
   - 회원가입 시 초대 코드 필수 검증
   - max_uses, used_count, expires_at 처리
2. Auth 보강
   - /auth/signup, /auth/login, /auth/logout, /auth/me 동작 점검
   - /auth/refresh는 구현하거나 MVP에서 제외하는 명확한 문서/응답으로 정리
   - httpOnly cookie 옵션 점검
3. User 보강
   - /users/me 조회 API가 없다면 추가
   - PATCH /users/me, POST/DELETE profile-image 흐름 점검
   - 선호 장르 저장/조회 확인
4. Frontend 반영
   - 회원가입 화면에 초대 코드 입력을 추가
   - 로그인/회원가입 UI는 기존 Davas 톤 유지
   - 인증 실패/초대 코드 오류/로딩 상태를 한국어로 표시
5. 테스트
   - 핵심 서비스/컨트롤러 테스트 추가 또는 기존 테스트 보강
   - 가능한 범위에서 npm test 또는 패키지별 테스트 실행

금지/주의:
- OAuth 로그인은 추가하지 않는다.
- Next.js에서 Vite로 마이그레이션하지 않는다.
- TypeORM에서 Prisma로 마이그레이션하지 않는다.
- 기존 UI 디자인 톤을 크게 바꾸지 않는다.
- 사용자의 기존 변경사항을 되돌리지 않는다.

완료 조건:
- 초대 코드 없이 회원가입이 실패한다.
- 유효한 초대 코드로 회원가입이 성공하고 used_count가 증가한다.
- 로그인 후 /auth/me와 보호 라우트 접근이 정상 동작한다.
- 프로필 조회/수정 흐름이 깨지지 않는다.
- 변경 내용과 검증 결과를 최종 답변에 요약한다.
```

---

## 6. P1R. Foundation 재검수 및 개선 프롬프트

```text
방금 완료된 Phase 1 Foundation 작업을 D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 재검증하고 개선해줘.

검수 범위:
- Invite API와 DB 모델
- 회원가입 초대 코드 검증
- 로그인/로그아웃/me/refresh 흐름
- 사용자 프로필 조회/수정/이미지 업로드
- 회원가입/로그인 UI
- 테스트와 문서

반드시 다음 네 분류로 문제를 정리해줘:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

실행 방식:
1. 관련 파일을 먼저 읽고 설계서와 비교한다.
2. 발견한 문제 중 Phase 1 범위 안에서 바로 고칠 수 있는 것은 직접 수정한다.
3. Phase 1 범위를 넘는 문제는 docs/product/davas-implementation-gap-analysis.md 또는 별도 체크리스트에 남긴다.
4. 테스트를 실행하고 결과를 기록한다.

특히 확인할 것:
- 초대 코드가 서버 API 레벨에서 강제되는지
- 초대 코드 사용 횟수 경쟁 조건이 생기지 않는지
- 쿠키 인증이 프론트 라우팅과 충돌하지 않는지
- 에러 메시지가 한국어로 정상 표시되는지
- 테스트가 인증 실패/성공 케이스를 모두 포함하는지

최종 답변:
- 수정한 파일
- 검증한 항목
- 남은 리스크
- 다음 단계로 넘어가도 되는지 여부
```

---

## 7. P2. Media Search 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 Phase 2 Media Search 작업을 구현해줘.

목표:
- TMDB 영화/드라마 통합 검색과 작품 상세 흐름을 MVP 기준으로 안정화한다.
- 사용자가 기록 작성을 위해 작품을 선택하면 내부 DB에 캐시되도록 보장한다.
- 작품 상세에서 포스터, 제목, 원제, 줄거리, 장르, 개봉/방영일, 출연진, 내 기록 히스토리를 확인할 수 있게 한다.
- TMDB API 출처 고지를 UI 또는 문서에 반영한다.

작업 범위:
1. Backend
   - GET /media/search?query=&type= 또는 현재 q 파라미터 호환성 점검
   - GET /media/:id 상세 조회 점검
   - POST /media/cache 또는 현재 /media/selections가 설계 역할을 충족하는지 정리
   - TMDB API key가 서버 env에서만 사용되는지 확인
   - media 캐시 데이터에 필요한 필드 보강
2. Frontend
   - 검색 화면의 영화/드라마 필터, 검색 결과, 빈 상태, 로딩, 오류 상태 점검
   - 작품 상세에서 리뷰 작성 진입, 보고 싶은 목록 추가 진입, 내 리뷰 히스토리 진입을 명확히 구현
   - 모바일 우선 UI와 기존 Davas 톤 유지
3. Shared Types
   - MediaType, media detail response 타입 정리
4. 테스트
   - TMDB client mapper, media selection/cache, detail response 테스트 보강
   - 프론트 API 클라이언트 또는 화면 구조 테스트 보강

주의:
- 클라이언트에서 TMDB API를 직접 호출하지 않는다.
- 검색 기능을 자체 영화 DB 구축으로 바꾸지 않는다.
- 설계서의 핵심 플로우인 "검색 -> 작품 선택 -> 기록 작성"을 우선한다.

완료 조건:
- 검색 결과에서 작품을 선택하면 내부 media id가 생성/재사용된다.
- 작품 상세에서 기록 작성 화면으로 자연스럽게 이동할 수 있다.
- 이미 기록한 내 리뷰가 작품 상세에 표시된다.
- TMDB 고지 문구가 반영된다.
- 테스트 또는 수동 검증 결과가 최종 답변에 포함된다.
```

---

## 8. P2R. Media Search 재검수 및 개선 프롬프트

```text
Phase 2 Media Search 작업을 설계서 기준으로 재검수하고, 미흡한 부분을 직접 개선해줘.

검수 기준:
- TMDB 검색은 서버를 통해서만 수행되는가
- 검색 결과가 영화/드라마를 구분하는가
- 작품 선택 시 내부 DB 캐시가 생성/재사용되는가
- 작품 상세가 설계서 필드: 포스터, 제목, 원제, 줄거리, 장르, 개봉/방영일, 출연진을 충족하는가
- 작품 상세에서 보고 싶은 목록 추가, 리뷰 작성, 내 리뷰 보기 흐름이 있는가
- TMDB 고지 문구가 적절한 위치에 있는가

분류:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

해야 할 일:
- Phase 2 범위 안에서 발견한 문제는 직접 고친다.
- 범위를 넘는 문제는 후속 백로그에 남긴다.
- 테스트를 실행하거나 실행 불가 사유를 명확히 기록한다.
```

---

## 9. P3. Review Core 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 Phase 3 Review Core 작업을 구현해줘.

목표:
- 감상 기록 작성/수정/삭제를 MVP 수준으로 완성한다.
- 설계서의 핵심 차별 기능인 "같이 본 기록"을 구현한다.
- 공개 범위를 API 레벨에서 검증할 수 있는 기반을 만든다.

작업 범위:
1. 데이터 모델
   - 현재 diaries 모델을 설계서의 reviews 개념과 비교한다.
   - 한줄평과 긴 리뷰를 분리할지, 기존 title/content를 유지하며 명확히 매핑할지 결정하고 일관되게 반영한다.
   - watched_place, mood, memory_note 또는 동등 필드를 추가한다.
   - review_companions 또는 diary_companions 모델을 추가한다.
   - companion은 계정 사용자 연결과 자유 입력 이름을 모두 지원한다.
   - companion rating을 저장할 수 있게 한다.
2. Backend
   - POST /diaries 또는 /reviews 생성 payload 보강
   - GET /diaries/:id 상세
   - PATCH /diaries/:id 수정
   - DELETE /diaries/:id 실제 soft delete 구현
   - GET /diaries/me 또는 동등한 내 기록 목록 구현
   - 공개 범위 값 정리: PRIVATE, FRIENDS, SELECTED 또는 현재 PUBLIC/PRIVATE와의 호환 전략 결정
3. Frontend
   - 리뷰 작성 화면에 감상일, 별점, 한줄평, 긴 리뷰, 스포일러, 같이 본 사람, 장소, 분위기, 추억 메모, 공개 범위를 반영
   - 기존 Davas 모바일 UI 톤 유지
   - 저장 실패/로딩/빈 상태 처리
4. 테스트
   - create/update/delete/list/detail 테스트
   - companion 저장/수정 테스트
   - 공개 범위 검증 테스트

주의:
- 공개 피드 중심으로 만들지 않는다.
- 같이 본 기록은 선택 기능이 아니라 Davas 차별 기능으로 우선순위를 높게 둔다.
- API 이름을 바꾸는 경우 프론트 API 클라이언트와 문서도 함께 정리한다.

완료 조건:
- 사용자가 같이 본 사람, 장소, 분위기, 추억 메모를 저장하고 수정할 수 있다.
- 리뷰 삭제가 실제로 soft delete 된다.
- 내 기록 목록과 상세/수정/삭제 흐름이 동작한다.
- 공개 범위가 API에서 검증된다.
```

---

## 10. P3R. Review Core 재검수 및 개선 프롬프트

```text
Phase 3 Review Core 구현을 설계서 기준으로 재검수하고 개선해줘.

검수 범위:
- 리뷰/다이어리 데이터 모델
- 같이 본 기록 모델과 API
- 리뷰 작성/수정/삭제/상세/내 목록
- 공개 범위 검증
- 스포일러 플래그
- 프론트 작성 화면 UX
- 테스트

분류:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

특히 확인할 것:
- 같이 본 사람을 자유 입력과 사용자 연결 둘 다 지원하는지
- 장소/분위기/추억 메모가 저장 후 조회/수정되는지
- 공개 범위가 단순 UI 값이 아니라 API 쿼리에서 실제로 적용되는지
- 삭제된 리뷰가 목록/피드/상세에서 노출되지 않는지
- 기존 홈/내 기록/작품 상세 화면이 깨지지 않는지

해야 할 일:
- Phase 3 범위 문제는 직접 수정한다.
- 후속 단계 문제는 백로그에 남긴다.
- 테스트를 실행하고 결과를 요약한다.
```

---

## 11. P4. Personal Archive 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 Phase 4 Personal Archive 작업을 구현해줘.

목표:
- 내 기록 아카이브를 설계서 화면 구성에 맞게 정리한다.
- 보고 싶은 목록을 설계서 MVP 수준으로 구현한다.
- 봤음 전환을 리뷰 작성 흐름과 연결한다.
- 개인 통계의 MVP 범위를 정리한다.

작업 범위:
1. 내 기록
   - 전체 리뷰 목록
   - 캘린더 보기
   - 작품별 보기 또는 작품 필터
   - 장르별 보기 또는 장르 분포
   - 태그별 보기 기초
   - 리뷰 상세/수정/삭제 연결
2. 보고 싶은 목록
   - watchlist_items 엔티티 또는 동등 모델 추가
   - POST /watchlist
   - GET /watchlist/me
   - PATCH /watchlist/:id
   - DELETE /watchlist/:id
   - POST /watchlist/:id/complete
   - 우선순위, 메모, OTT/시청 가능 위치 메모, 같이 볼 사람 필드 반영
   - 봤음 전환 시 리뷰 작성 화면으로 연결
3. 홈 화면 연동
   - 오늘의 요약
   - 최근 본 작품
   - 이어쓰기 중인 리뷰가 있다면 표시
   - 보고 싶은 목록 미리보기
   - 이번 달 감상 통계
4. 프로필 연동
   - 보고 싶은 목록 수, 본 작품 수, 작성 다이어리 수 등 실제 데이터 기반 표시
5. 테스트
   - watchlist CRUD/complete 테스트
   - archive dashboard 테스트

주의:
- media_favorites가 이미 있다면 watchlist와 역할을 명확히 분리한다.
- 단순 즐겨찾기를 보고 싶은 목록으로 오해하지 않게 UI/타입/API를 정리한다.
- 컬렉션은 2차 기능이므로 MVP 범위에 필요한 연결만 남긴다.

완료 조건:
- 사용자가 작품 상세에서 보고 싶은 목록에 추가할 수 있다.
- 보고 싶은 목록에서 우선순위/메모를 수정할 수 있다.
- 봤음 처리 시 리뷰 작성으로 이동하고 완료 후 목록 상태가 정리된다.
- 홈/프로필에 실제 watchlist 데이터가 반영된다.
```

---

## 12. P4R. Personal Archive 재검수 및 개선 프롬프트

```text
Phase 4 Personal Archive 작업을 설계서 기준으로 재검수하고 개선해줘.

검수 범위:
- 내 기록 목록/캘린더/작품별/장르별/태그별 보기
- 리뷰 상세/수정/삭제 연결
- watchlist 모델과 API
- 보고 싶은 목록 UI
- 봤음 전환 흐름
- 홈 화면 보고 싶은 목록 미리보기
- 프로필 실제 통계 반영

분류:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

특히 확인할 것:
- watchlist와 favorite이 혼재되어 있지 않은지
- 봤음 전환이 리뷰 작성과 실제 데이터 상태 변경까지 이어지는지
- 빈 상태/로딩/오류 상태가 기존 Davas 톤으로 표시되는지
- 내 기록은 작성자 본인 데이터만 보여주는지

해야 할 일:
- Phase 4 범위 문제는 직접 고친다.
- 2차 기능은 MVP를 방해하지 않게 숨기거나 백로그로 이동한다.
- 검증 결과를 최종 답변에 남긴다.
```

---

## 13. P5. Small Social 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 Phase 5 Small Social 작업을 구현해줘.

목표:
- 대규모 공개 커뮤니티가 아니라 가까운 친구 기반 피드를 구현한다.
- 친구 초대/수락/목록과 공개 범위 검증을 연결한다.
- 친구 리뷰 피드, 댓글, 이모지 반응을 MVP 수준으로 완성한다.

작업 범위:
1. 친구 모델/API
   - friendships 엔티티 또는 현재 follow 모델을 설계서 친구 관계로 전환/보강
   - POST /friends/invite
   - POST /friends/accept
   - GET /friends
   - DELETE /friends/:id
   - 친구 초대 코드는 Invite 도메인과 혼동되지 않게 역할 정의
2. 피드
   - 친구의 공개 리뷰만 노출
   - private은 작성자만, friends는 친구만, selected는 선택 사용자만 볼 수 있게 API 레벨 검증
   - 공개 전체 피드가 있다면 MVP에서 숨기거나 친구 피드와 구분
3. 댓글/반응
   - 댓글 CRUD 점검
   - 이모지 반응 모델/API 추가
   - 단순 like만 있다면 설계서의 reactions로 확장할지 결정
4. Frontend
   - 하단 탭의 친구 피드/커뮤니티 표현을 설계서에 맞게 정리
   - 친구 목록, 친구 초대, 요청 수락, 차단/숨김 기초
   - 스포일러 기본 가림
5. 알림
   - 댓글/반응/친구 요청 알림이 있다면 MVP 수준으로 연결
6. 테스트
   - 친구 관계별 접근 권한 테스트
   - 피드 공개 범위 테스트
   - 댓글/반응 테스트

주의:
- 공개 SNS처럼 인기글/추천글 중심으로 만들지 않는다.
- 이미 구현된 community/follow/like가 있으면 설계서의 small social 목표와 충돌하는지 판단한다.
- 불필요한 공개 커뮤니티 기능은 삭제보다 우선 숨김/비활성/백로그 이동을 검토한다.

완료 조건:
- 친구가 아닌 사용자는 friends 리뷰를 볼 수 없다.
- 친구 피드에는 친구 리뷰만 노출된다.
- 댓글과 이모지 반응이 동작한다.
- 스포일러 리뷰는 목록에서 기본 가림 처리된다.
```

---

## 14. P5R. Small Social 재검수 및 개선 프롬프트

```text
Phase 5 Small Social 구현을 설계서 기준으로 재검수하고 개선해줘.

검수 범위:
- 친구 초대/수락/목록/삭제
- 친구 기반 피드
- 공개 범위 API 검증
- 댓글
- 이모지 반응
- 스포일러 가림
- 프로필의 친구/설정 연결
- 불필요한 공개 커뮤니티 요소

분류:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

특히 확인할 것:
- 공개 피드가 설계서의 "작은 친구 피드" 원칙을 침해하지 않는지
- follow와 friendship이 혼재되어 권한 오류를 만들지 않는지
- private/friends/selected가 API에서 실제 필터링되는지
- 댓글/반응이 삭제된 리뷰나 비공개 리뷰에 달리지 않는지

해야 할 일:
- Phase 5 범위 문제는 직접 수정한다.
- 의도적으로 남긴 공개 커뮤니티 기능이 있다면 MVP 이후 기능으로 문서화한다.
- 테스트를 실행하고 결과를 요약한다.
```

---

## 15. P6. Self-host Production 실행 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 기준으로 Phase 6 Self-host Production 작업을 구현해줘.

목표:
- Raspberry Pi 4B 자가 호스팅 운영에 필요한 Docker Compose, Caddy, DuckDNS, 백업, PWA 기본 요건을 정리한다.
- 현재 Next.js 유지 여부를 고려해 현실적인 운영 구성을 만든다.

작업 범위:
1. PWA
   - manifest 추가
   - 앱 이름, 아이콘, theme_color, background_color 정리
   - 모바일 홈 화면 추가 기준 점검
   - service worker는 현재 구조에서 가능한 범위로 구현하거나 명확히 후순위 문서화
2. Docker Compose
   - 개발용 compose와 운영용 compose 분리 검토
   - db/api/web/uploads volume 유지
   - production env 예시 정리
   - TYPEORM_SYNC 운영 설정 점검
3. Caddy
   - Caddyfile 추가
   - /api reverse proxy
   - web route
   - health route
4. DuckDNS
   - docs/deployment 문서 보강
   - 포트포워딩/HTTPS 갱신 흐름 정리
5. 백업
   - pg_dump 백업 스크립트 또는 compose service/host cron 예시
   - uploads volume 백업 절차
   - 복구 절차 문서화
6. 보안
   - JWT secret/env 예시 정리
   - TMDB API key 서버 env만 사용 확인
   - 파일 업로드 MIME/용량 제한 점검

주의:
- 운영 구성을 만들면서 로컬 개발 경험을 깨지 않는다.
- 실제 도메인, 실제 비밀키는 커밋하지 않는다.
- Vite 전환은 이 단계에서 필수로 하지 않는다. 필요하면 별도 마이그레이션 계획만 작성한다.

완료 조건:
- 운영용 compose/Caddy/backup 문서 또는 파일이 준비된다.
- PWA 기본 manifest가 준비된다.
- Raspberry Pi에서 재시작 가능한 운영 절차가 문서화된다.
```

---

## 16. P6R. Self-host Production 재검수 및 개선 프롬프트

```text
Phase 6 Self-host Production 작업을 설계서 기준으로 재검수하고 개선해줘.

검수 범위:
- PWA manifest/service worker 또는 후순위 사유
- Docker Compose 개발/운영 구성
- Caddy reverse proxy
- DuckDNS HTTPS 문서
- pg_dump 백업
- uploads volume 백업
- env/secrets 보안
- health check

분류:
1. 미구현
2. 부분구현
3. 잘못된구현
4. 불필요한구현

특히 확인할 것:
- 운영 compose에서 DB 데이터와 업로드 파일이 영속화되는지
- TYPEORM_SYNC=true가 운영 기본값으로 남아 있지 않은지
- Caddy가 /api와 web을 명확히 라우팅하는지
- 백업과 복구 절차가 둘 다 있는지
- PWA 설치 요건을 최소한 충족하는지

해야 할 일:
- Phase 6 범위 문제는 직접 수정한다.
- 실제 운영 전 사용자가 채워야 할 값은 .env.example 또는 문서로 남긴다.
- 검증 결과를 최종 답변에 정리한다.
```

---

## 17. P7. 총괄 설계 적합성 비교분석 프롬프트

```text
D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 설계문서를 기준으로 전체 구현 결과를 최종 비교분석해줘.

목표:
- 모든 Phase 작업 이후 설계서가 실제 프로젝트에 얼마나 반영됐는지 검증한다.
- 남은 작업 지점을 미구현/부분구현/잘못된구현/불필요한구현으로 분류한다.
- 실제 운영 가능한 MVP인지 판단한다.
- 분석 결과를 docs/product/davas-final-design-conformance-report.md 로 저장한다.

분석 범위:
- apps/web
- apps/api
- packages/shared
- docker-compose.yml 및 운영 compose 파일
- Caddyfile 또는 배포 설정
- docs/development
- docs/deployment
- 테스트 파일

설계서 기준 체크리스트:
1. 모바일에서 PWA처럼 홈 화면에 추가해 사용할 수 있는가
2. 초대 코드로 가입하고 로그인할 수 있는가
3. 영화/드라마 검색과 작품 상세가 동작하는가
4. 작품에 감상 기록을 작성할 수 있는가
5. 별점, 감상일, 한줄평, 긴 리뷰, 스포일러 여부가 저장되는가
6. 같이 본 사람, 장소, 분위기, 추억 메모를 남길 수 있는가
7. 보고 싶은 목록과 봤음 전환이 동작하는가
8. 친구의 공개된 리뷰를 작은 피드에서 볼 수 있는가
9. 댓글과 이모지 반응이 동작하는가
10. Raspberry Pi 4B에서 Docker Compose로 재시작 가능한가

결과 문서 형식:
1. 최종 결론
2. MVP 성공 기준별 Pass/Partial/Fail
3. 미구현 목록
4. 부분구현 목록
5. 잘못된구현 목록
6. 불필요한구현 목록
7. 출시 전 필수 수정
8. 출시 후 백로그
9. 실행한 테스트와 결과

주의:
- 이 프롬프트에서는 코드 수정하지 말고 분석 문서만 작성한다.
```

---

## 18. P8. 총괄 재검증 및 개선 실행 프롬프트

```text
docs/product/davas-final-design-conformance-report.md 와 D:\Projects\davas\docs\product\davas-pwa-self-hosted-design.md 를 기준으로 최종 재검증 및 개선 작업을 실행해줘.

목표:
- 최종 비교분석에서 나온 출시 전 필수 수정 항목을 실제로 개선한다.
- 미구현/부분구현/잘못된구현/불필요한구현을 MVP 출시 기준에 맞게 정리한다.
- 남은 후순위 작업은 명확한 백로그로 문서화한다.

작업 순서:
1. final conformance report를 읽고 출시 전 필수 수정 항목을 추린다.
2. 각 항목을 영향도와 의존성 기준으로 정렬한다.
3. MVP 출시를 막는 항목부터 직접 수정한다.
4. 불필요한 구현은 삭제/숨김/문서상 후순위 이동 중 가장 안전한 방식으로 정리한다.
5. 모든 수정 후 관련 테스트를 실행한다.
6. docs/product/davas-final-design-conformance-report.md 를 최신 상태로 갱신한다.

검증 기준:
- 초대제 가입이 우회되지 않는다.
- 공개 범위가 API 레벨에서 지켜진다.
- 같이 본 기록과 보고 싶은 목록이 핵심 플로우 안에서 동작한다.
- 친구 피드는 공개 SNS가 아니라 친구 중심이다.
- 모바일 UI가 기존 Davas 톤을 유지한다.
- Docker Compose 운영 절차가 문서와 실제 파일에 맞다.

최종 답변:
- 수정한 항목
- 남긴 백로그
- 실행한 테스트
- MVP 출시 가능 여부
- 출시 전 수동 점검 체크리스트
```

---

## 19. 반복 실행용 세션 재검수 프롬프트

각 Phase가 커지면 아래 프롬프트를 단계명만 바꿔 반복 실행한다.

```text
현재 세션에서 완료한 [Phase 이름] 작업을 설계서 docs/product/davas-pwa-self-hosted-design.md 기준으로 재검수해줘.

반드시 다음 순서로 진행해:
1. 이번 세션에서 변경된 파일을 확인한다.
2. 설계서의 관련 섹션을 다시 읽는다.
3. 구현을 미구현/부분구현/잘못된구현/불필요한구현으로 분류한다.
4. [Phase 이름] 범위 안에서 바로 고칠 수 있는 문제는 직접 수정한다.
5. 범위를 넘는 문제는 docs/product/davas-implementation-gap-analysis.md 또는 final report에 백로그로 남긴다.
6. 관련 테스트를 실행한다.
7. 최종 답변에 "수정 완료", "남은 리스크", "다음 단계 가능 여부"를 명확히 적는다.

주의:
- 사용자가 만든 기존 변경은 되돌리지 않는다.
- 리팩터링은 필요한 범위 안에서만 한다.
- MVP를 방해하는 대규모 확장은 하지 않는다.
```
