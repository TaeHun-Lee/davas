# Davas 웹 애플리케이션 초안 설계

**제품명:** Davas  
**제품 유형:** 영화/드라마 리뷰·다이어리 웹 애플리케이션  
**초기 플랫폼:** Web, Mobile Web  
**향후 확장:** Android WebView/Capacitor Wrapper App  
**권장 기술 스택:** Next.js Frontend + NestJS Backend

---

## 1. 제품 한 줄 정의

Davas는 사용자가 영화와 드라마를 검색하고, 작품별 감상 리뷰·다이어리·평점을 기록하며, 다른 사람들의 감상 기록을 탐색하고 소통할 수 있는 시네마틱 다이어리 플랫폼이다.

---

## 2. 핵심 사용자 가치

1. **검색 기반 기록 시작**
   - 사용자는 영화/드라마 제목을 검색해 정확한 작품을 선택한 뒤 리뷰와 다이어리를 작성할 수 있다.

2. **개인 감상 아카이브**
   - 관람 날짜, 제목, 내용, 평점이 포함된 감상 다이어리를 축적할 수 있다.

3. **작품 상세 정보 기반 기록 경험**
   - 포스터, 스틸 컷, 스크린샷, 시놉시스, 줄거리 등 작품 정보를 확인한 후 기록을 시작할 수 있다.

4. **타인의 감상 발견**
   - 검색, 추천, 피드 등을 통해 다른 사용자의 다이어리를 읽고 댓글을 남길 수 있다.

5. **취향 기반 프로필**
   - 프로필 사진, 닉네임, 선호 장르를 기반으로 개인화된 감상 공간을 구성할 수 있다.

---

## 3. 주요 기능 범위

### 3.1 작품 검색

사용자는 영화나 드라마 제목을 입력해 외부 콘텐츠 API 기반 검색 결과를 확인한다.

**검색 결과 목록에 표시할 정보**

- 포스터 또는 대표 스틸 컷 썸네일
- 영화/드라마 제목
- 원제 또는 영문 제목
- 개봉/방영 연도
- 콘텐츠 유형: Movie / Drama / TV Series
- 장르 일부
- 국가 또는 제작 지역

**추천 외부 API 후보**

- TMDB API: 영화/TV 검색, 포스터, 백드롭, 시놉시스, 장르 제공에 적합
- OMDb API: 보조 메타데이터용
- Watcha/Netflix 등은 공식 공개 API 제한이 있어 초기에는 TMDB 권장

---

### 3.2 작품 상세 모달

검색 결과 중 하나를 클릭하면 상세 모달이 열린다.

**상세 모달 구성**

- 상단 대형 백드롭 이미지 또는 스틸 컷
- 포스터 이미지
- 작품 제목
- 원제
- 콘텐츠 유형
- 개봉일 또는 첫 방영일
- 장르
- 제작 국가
- 러닝타임 또는 시즌/에피소드 정보
- 시놉시스
- 간략한 줄거리
- 평점 정보, 선택 사항
- `리뷰 작성하기` CTA 버튼

**UX 포인트**

- 모달은 화면 중앙에 부드러운 뉴모피즘 카드 형태로 표시
- 배경은 약한 blur overlay 처리
- 모바일에서는 bottom sheet 형태로 전환 가능
- 이미지가 없는 경우 기본 placeholder 사용

---

### 3.3 리뷰/다이어리 작성

사용자가 상세 모달에서 `리뷰 작성하기`를 클릭하면 작성 화면 또는 작성 모달로 이동한다.

**입력 필드**

- 다이어리 제목
- 다이어리 내용
- 관람 날짜
- 평점
- 공개 범위: 공개 / 비공개 / 팔로워 공개, MVP에서는 공개/비공개만 권장
- 스포일러 포함 여부, 선택 사항

**평점 방식 후보**

- 5점 만점, 0.5 단위
- 별점 UI
- 향후 감정 태그 추가 가능: 감동적, 무거움, 여운, 유쾌함 등

**작성 완료 후 동작**

- 내 다이어리 상세 페이지로 이동
- 또는 작품 상세 페이지 내 내 리뷰 영역에 표시

---

### 3.4 내 다이어리 관리

사용자는 자신이 작성한 다이어리를 확인, 수정, 삭제할 수 있다.

**기능**

- 내 다이어리 목록 조회
- 작품별 필터
- 장르별 필터
- 관람 날짜 기준 정렬
- 작성일 기준 정렬
- 평점 기준 정렬
- 다이어리 수정
- 다이어리 삭제

**삭제 정책**

- MVP에서는 soft delete 권장
- 삭제 후 사용자는 볼 수 없지만 서버에서는 복구/감사용으로 `deletedAt` 보관 가능

---

### 3.5 프로필

사용자는 자신의 개인정보와 취향 정보를 확인하고 수정할 수 있다.

**프로필 정보**

- 프로필 사진
- 닉네임
- 자기소개, 선택 사항
- 선호 장르
- 가입일
- 작성한 다이어리 수
- 평균 평점
- 최근 관람 작품

**프로필 페이지 구성**

- 상단 프로필 카드
- 선호 장르 chips
- 내가 작성한 다이어리 목록
- 공개 다이어리의 경우 타인도 열람 가능

---

### 3.6 타인의 다이어리 탐색

사용자는 검색 또는 추천을 통해 다른 사람들의 다이어리를 볼 수 있다.

**탐색 경로**

- 홈 추천 피드
- 작품 상세 페이지의 다른 사용자 리뷰
- 검색 결과 내 관련 다이어리
- 프로필 페이지의 공개 다이어리

**다이어리 카드 표시 정보**

- 작성자 프로필 이미지
- 작성자 닉네임
- 작품 포스터 썸네일
- 작품 제목
- 다이어리 제목
- 내용 일부 preview
- 평점
- 관람 날짜
- 댓글 수
- 좋아요 수, MVP 이후 선택

---

### 3.7 댓글

사용자는 다른 사람의 공개 다이어리에 댓글을 남길 수 있다.

**댓글 기능**

- 댓글 작성
- 댓글 조회
- 본인 댓글 수정
- 본인 댓글 삭제
- 작성자 또는 관리자에 의한 댓글 숨김, MVP 이후

**권장 정책**

- 비공개 다이어리에는 댓글 불가
- 삭제된 다이어리에는 댓글 작성 불가
- 스포일러 댓글에 대한 표시 옵션은 후속 기능으로 고려

---

## 4. MVP 범위

초기 버전에서는 핵심 경험을 작게 완성하는 것이 좋다.

### MVP에 포함

1. 회원가입/로그인
2. 프로필 조회/수정
3. 영화/드라마 검색
4. 검색 결과 목록
5. 작품 상세 모달
6. 리뷰/다이어리 작성
7. 내 다이어리 목록 조회
8. 내 다이어리 수정/삭제
9. 공개 다이어리 피드
10. 타인 다이어리 상세 조회
11. 댓글 작성/조회/삭제

### MVP에서 제외 또는 후순위

- 팔로우/팔로잉
- 좋아요
- 컬렉션/리스트
- 고급 추천 알고리즘
- 푸시 알림
- 소셜 로그인 전체 지원
- Android wrapper 배포
- 관리자 페이지
- 신고/차단 시스템

---

## 5. 주요 화면 설계

### 5.1 Home

**목적:** 사용자가 검색을 시작하거나 추천 다이어리를 탐색한다.

**구성**

- 상단 로고 `Davas`
- 검색 바
- 추천 작품 섹션
- 최근 공개 다이어리 섹션
- 인기 리뷰 섹션, 선택 사항
- 모바일 하단 navigation

---

### 5.2 Search Results

**목적:** 사용자가 원하는 작품을 찾는다.

**구성**

- 검색어 입력 영역
- 필터: 전체 / 영화 / 드라마
- 결과 카드 grid/list
- 각 카드: 썸네일, 제목, 연도, 유형, 장르
- 결과 클릭 시 작품 상세 모달 open

---

### 5.3 Media Detail Modal

**목적:** 사용자가 검색한 작품이 맞는지 확인하고 리뷰 작성을 시작한다.

**구성**

- backdrop image
- poster
- title
- synopsis
- metadata
- image gallery, 선택 사항
- `리뷰 작성하기` 버튼
- `닫기` 버튼

---

### 5.4 Diary Editor

**목적:** 감상 기록을 작성한다.

**구성**

- 선택된 작품 요약 카드
- 제목 input
- 내용 textarea 또는 rich text editor
- 관람 날짜 date picker
- 평점 selector
- 공개 여부 toggle
- 저장 버튼
- 임시 저장, 후순위

---

### 5.5 Diary Detail

**목적:** 다이어리와 댓글을 읽는다.

**구성**

- 작품 포스터/스틸 컷
- 작품 제목
- 작성자 정보
- 다이어리 제목
- 다이어리 내용
- 평점
- 관람 날짜
- 작성일
- 댓글 목록
- 댓글 입력창
- 본인 글인 경우 수정/삭제 버튼

---

### 5.6 My Diary

**목적:** 내 감상 기록을 관리한다.

**구성**

- 내 다이어리 목록
- 정렬/필터
- 검색
- 각 카드에 수정/삭제 quick action

---

### 5.7 Profile

**목적:** 사용자 정보와 공개 다이어리를 보여준다.

**구성**

- 프로필 이미지
- 닉네임
- 자기소개
- 선호 장르
- 통계 카드
- 공개 다이어리 목록

---

## 6. 정보 구조 IA

```text
/
├─ /login
├─ /signup
├─ /search?q=
├─ /diaries
│  ├─ /diaries/new?mediaId=
│  └─ /diaries/:diaryId
├─ /my
│  ├─ /my/diaries
│  └─ /my/profile
├─ /users/:userId
└─ /settings
```

---

## 7. 데이터 모델 초안

### 7.1 User

```text
User
- id
- email
- passwordHash
- nickname
- profileImageUrl
- bio
- preferredGenres: string[]
- createdAt
- updatedAt
- deletedAt
```

### 7.2 Media

외부 API 데이터를 매번 직접 호출하지 않고, 사용자가 다이어리를 작성한 작품은 내부 DB에 캐싱한다.

```text
Media
- id
- externalProvider: TMDB | OMDB | MANUAL
- externalId
- mediaType: MOVIE | TV
- title
- originalTitle
- overview
- shortPlot
- posterUrl
- backdropUrl
- releaseDate
- genres: string[]
- country
- runtime
- createdAt
- updatedAt
```

### 7.3 Diary

```text
Diary
- id
- userId
- mediaId
- title
- content
- watchedDate
- rating
- visibility: PUBLIC | PRIVATE
- hasSpoiler
- createdAt
- updatedAt
- deletedAt
```

### 7.4 Comment

```text
Comment
- id
- diaryId
- userId
- content
- createdAt
- updatedAt
- deletedAt
```

### 7.5 Optional: MediaImage

```text
MediaImage
- id
- mediaId
- type: POSTER | BACKDROP | STILL | SCREENSHOT
- imageUrl
- source
- order
- createdAt
```

---

## 8. Backend API 초안, NestJS

### Auth

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

### Users

```text
GET   /users/:id
PATCH /users/me
POST  /users/me/profile-image
```

### Media

```text
GET  /media/search?query=&type=
GET  /media/:id
POST /media/cache
```

`/media/search`는 TMDB 등 외부 API를 조회하고, `/media/cache`는 사용자가 다이어리 작성 시 선택한 외부 작품을 내부 Media로 저장한다.

### Diaries

```text
POST   /diaries
GET    /diaries/feed
GET    /diaries/me
GET    /diaries/:id
PATCH  /diaries/:id
DELETE /diaries/:id
GET    /media/:mediaId/diaries
```

### Comments

```text
POST   /diaries/:diaryId/comments
GET    /diaries/:diaryId/comments
PATCH  /comments/:commentId
DELETE /comments/:commentId
```

---

## 9. Frontend 구조 초안, Next.js App Router

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ login/page.tsx
│  ├─ signup/page.tsx
│  ├─ search/page.tsx
│  ├─ diaries/
│  │  ├─ new/page.tsx
│  │  └─ [diaryId]/page.tsx
│  ├─ my/
│  │  ├─ diaries/page.tsx
│  │  └─ profile/page.tsx
│  └─ users/[userId]/page.tsx
├─ components/
│  ├─ layout/
│  ├─ media/
│  │  ├─ MediaSearchBar.tsx
│  │  ├─ MediaResultCard.tsx
│  │  └─ MediaDetailModal.tsx
│  ├─ diary/
│  │  ├─ DiaryCard.tsx
│  │  ├─ DiaryEditor.tsx
│  │  └─ RatingInput.tsx
│  ├─ comment/
│  └─ profile/
├─ lib/
│  ├─ api.ts
│  ├─ auth.ts
│  └─ constants.ts
└─ styles/
   └─ theme.css
```

---

## 10. 디자인 시스템 초안

### 10.1 디자인 키워드

- Neuromorphism
- 밝고 모던함
- 중후한 톤
- 부드러운 그림자
- 낮은 대비의 입체감
- 시네마틱한 이미지 강조
- 과도하게 귀엽지 않은 성숙한 무드

### 10.2 컬러 팔레트

```text
Background: #EEF1F5
Surface:    #F5F7FA
Surface 2:  #E6EAF0
Text Main:  #252B33
Text Sub:   #6E7681
Primary:    #5B6C89
Accent:     #8C6A5D
Gold:       #C6A15B
Danger:     #B76E6E
```

### 10.3 뉴모피즘 스타일 원칙

**카드**

```css
.neu-card {
  background: #eef1f5;
  border-radius: 24px;
  box-shadow: 10px 10px 24px rgba(163, 177, 198, 0.45),
              -10px -10px 24px rgba(255, 255, 255, 0.9);
}
```

**눌린 input**

```css
.neu-inset {
  background: #eef1f5;
  border-radius: 18px;
  box-shadow: inset 6px 6px 12px rgba(163, 177, 198, 0.38),
              inset -6px -6px 12px rgba(255, 255, 255, 0.85);
}
```

**주의점**

- 뉴모피즘은 대비가 낮아 접근성이 떨어질 수 있으므로 텍스트 대비는 충분히 확보한다.
- 버튼 hover/focus/active 상태를 명확히 준다.
- 모바일에서는 그림자를 과하게 쓰지 않아 성능 저하를 피한다.

---

## 11. 추천 기술 스택

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Zustand, 필요 시
- Framer Motion, 모달/전환 애니메이션용

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Auth
- Passport.js
- class-validator / class-transformer
- S3 호환 Object Storage, 프로필 이미지용

### Infra

- Docker Compose, local development
- PostgreSQL
- Redis, refresh token/session/cache 용도는 후순위
- AWS 또는 Railway/Fly.io/Render 등
- Vercel, frontend만 분리 배포 시

---

## 12. Android Wrapper 고려사항

초기 웹앱을 모바일 반응형으로 잘 만들면 이후 Android wrapper 배포가 가능하다.

### 권장 방식

- 단순 WebView보다 Capacitor 권장
- Next.js 웹앱을 hosted URL로 로드하거나, 앱 친화적 라우팅을 구성
- NestJS API는 그대로 사용

### 미리 고려할 항목

- 모바일 viewport 대응
- 뒤로가기 처리
- 로그인 세션 유지
- 파일 업로드, 프로필 이미지 변경
- 네트워크 오류 화면
- 딥링크 구조
- FCM push token 저장 구조, 후순위

---

## 13. 권장 개발 단계

### Phase 1: Foundation

- Monorepo 구성
- Next.js 앱 생성
- NestJS API 생성
- PostgreSQL/Prisma 구성
- Auth 기본 구현

### Phase 2: Media Search

- TMDB API 연동
- 검색 결과 UI
- 상세 모달 UI
- 선택한 media 내부 DB 캐싱

### Phase 3: Diary Core

- 다이어리 작성
- 내 다이어리 목록
- 다이어리 수정/삭제
- 평점/관람일 처리

### Phase 4: Social Reading

- 공개 피드
- 타인 다이어리 상세
- 댓글 작성/조회/삭제

### Phase 5: Profile & Polish

- 프로필 수정
- 선호 장르
- 디자인 시스템 정리
- 반응형 QA

### Phase 6: Mobile Wrapper Readiness

- Capacitor PoC
- Android WebView 세션 검증
- 뒤로가기/딥링크/파일 업로드 검증

---

## 14. MVP 성공 기준

1. 사용자가 영화/드라마를 검색할 수 있다.
2. 검색 결과에서 원하는 작품을 선택해 상세 정보를 볼 수 있다.
3. 선택한 작품에 대해 다이어리를 작성할 수 있다.
4. 다이어리에 제목, 내용, 관람 날짜, 평점을 저장할 수 있다.
5. 사용자가 자신의 다이어리를 수정/삭제할 수 있다.
6. 사용자가 다른 사람의 공개 다이어리를 볼 수 있다.
7. 사용자가 공개 다이어리에 댓글을 남길 수 있다.
8. 전체 UI가 밝고 모던한 뉴모피즘 톤을 유지한다.
9. 모바일 화면에서도 핵심 플로우가 문제없이 동작한다.

---

## 15. 초기 구현 우선순위 제안

가장 먼저 만들어야 할 흐름은 다음 하나다.

```text
검색 → 작품 선택 → 상세 모달 → 리뷰 작성 → 내 다이어리 저장/조회
```

이 흐름이 완성되면 Davas의 핵심 제품성이 검증된다. 이후 공개 피드, 댓글, 프로필, 추천 기능을 단계적으로 확장하는 것이 좋다.
