# Davas

Davas는 가까운 사람 2~5명이 비공개 공간에서 영화·드라마 감상을 기록하고, 같은 작품에 대한 서로의 별점과 리뷰를 함께 보며, 다음에 함께 볼 작품을 고르는 모바일 우선 PWA다.

## 기술 스택

| 영역 | 기술 |
|---|---|
| Web | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 |
| API | NestJS 11, TypeORM 0.3 |
| Data | PostgreSQL 16 |
| Auth | HttpOnly 쿠키 JWT, 가입 초대 코드, 친구·공간 초대 토큰 |
| Media | TMDB (서버에서만 호출) |
| Runtime | Node.js 24, Docker Compose, Caddy, Raspberry Pi self-hosting |

## 빠른 시작

```bash
npm ci
npm run docker:up        # Web http://localhost:3000, API http://localhost:4000/api
npm run docker:down
```

Web·API를 직접 실행하려면:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up -d db
npm run dev
```

## 자주 쓰는 명령

```bash
npm test                 # 전체 테스트 (test:shared / test:api / test:web)
npm run lint             # 타입 검사와 ESLint
npm run build            # 운영 빌드
npm run verify           # 포맷·문서·배포 계약·테스트·린트·빌드·HTTP 계약 전체 점검
npm run verify:release   # verify + Caddy 헤더 검사 + 운영 의존성 감사
```

## 문서

| 문서 | 내용 |
|---|---|
| [docs/README.md](docs/README.md) | 문서 목록과 관리 원칙 |
| [제품 기준](docs/product/README.md) | 제품 방향과 범위의 단일 기준 |
| [개발 가이드](docs/development.md) | 로컬 실행, 코드 지도, 보안 경계, DB, 검증 |
| [운영 가이드](docs/operations.md) | Raspberry Pi 배포·백업·되돌리기 |
| [부록](docs/appendix.md) | 레거시, 알려진 문제, 작업 요령 |
| [AGENTS.md](AGENTS.md) | 에이전트 작업 규칙 |

운영 배포는 반드시 [운영 가이드](docs/operations.md)의 순서(백업 → 빌드 → migration 확인 → 전환)를 따르고, 운영에서는 `TYPEORM_SYNC=false`를 유지한다.

## TMDB 출처 표기

이 서비스는 TMDB API를 사용하지만 TMDB가 보증하거나 인증한 서비스는 아니다.

> This product uses the TMDB API but is not endorsed or certified by TMDB.
