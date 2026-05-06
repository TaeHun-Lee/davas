# Davas Docker 실행 가이드

Davas는 `docker-compose.yml` 하나로 PostgreSQL, NestJS API, Next.js Web을 함께 실행할 수 있다.

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

## TypeORM 설정

로컬 Docker 환경에서는 `TYPEORM_SYNC=true`로 엔티티 기준 테이블을 자동 동기화한다. 운영 환경에서는 migration을 별도로 구성하고 `TYPEORM_SYNC=false`를 사용해야 한다.
