# Davas Docker 실행 가이드

Davas는 `docker-compose.yml` 하나로 PostgreSQL, NestJS API, Next.js Web을 함께 실행할 수 있다.

## 설치와 자동 검증

Node.js 22 이상과 저장소에 커밋된 `package-lock.json`을 사용한다.

```bash
npm ci
npm run test
npm run lint
npm run build
```

자동 테스트는 PostgreSQL이나 TMDB API 키 없이 실행할 수 있다.

## 실행

```bash
npm run docker:up
```

또는 직접 실행:

```bash
docker compose up --build
```

## 접속 주소

- Web: http://localhost:3000
- API: http://localhost:4000/api
- API Health: http://localhost:4000/api/health
- Swagger: http://localhost:4000/api/docs
- PostgreSQL: localhost:5432

## 종료

```bash
npm run docker:down
```

DB 볼륨까지 삭제하려면:

```bash
docker compose down -v
```

## 개발 모드

환경 변수 예시를 로컬 파일로 복사하고 PostgreSQL만 먼저 실행한다.

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
docker compose up -d db
```

macOS와 Linux에서는 `Copy-Item` 대신 `cp`를 사용한다. 이후 별도 터미널에서 API와 Web을 실행한다.

```bash
npm run dev --workspace @davas/api
npm run dev --workspace @davas/web
```

실제 작품 검색과 시청 가능성 조회를 확인하려면 API 환경 파일의 `TMDB_API_KEY`를 설정한다. 키가 없어도 앱은 시작되지만 외부 공급자 기반 요청은 설정 오류를 반환한다.

## TypeORM 설정

로컬 Docker 환경에서는 `TYPEORM_SYNC=true`로 엔티티 기준 테이블을 자동 동기화한다. 운영 환경에서는 커밋된 migration을 사용하고 `TYPEORM_SYNC=false`를 유지해야 한다.
