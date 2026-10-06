# Davas 운영 가이드 (Raspberry Pi)

운영 서버는 Raspberry Pi 한 대에서 Docker Compose로 PostgreSQL, NestJS API, Next.js Web, Caddy를 실행한다. Caddy가 HTTPS를 맡고 `/api/*`·`/uploads/*`는 API로, 나머지는 Web으로 보낸다. 모든 명령은 서버의 저장소 루트에서 실행한다.

```bash
DC="docker compose --env-file .env.production -f docker-compose.prod.yml"
```

## 1. 호스트와 네트워크

- 64비트 Raspberry Pi OS 계열, Docker Engine과 Compose plugin
- 안정적인 전원(5.1V 3A 이상 USB-C)과 유선 LAN. 전압 부족은 `vcgencmd get_throttled`가 `0x0`이 아니면 의심한다.
- microSD보다 SSD에 Docker 데이터를 두는 편이 안전하다.
- SSH는 키 인증만 사용하고, 공유기에서 22번 포트를 열지 않는 것을 권장한다(원격 접속은 Tailscale 등 사설망).
- DuckDNS 도메인(`davas.duckdns.org`)이 현재 공인 IP를 가리키게 유지한다. 공인 IP는 저장소에 적지 않는다.
- 공유기 포트 전달은 TCP `80`, `443`만 허용한다. PostgreSQL `5432`, API `4000`, Web `3000`은 외부에 열지 않는다.

## 2. 최초 설정

```bash
cp .env.production.example .env.production
```

| 값 | 규칙 |
|---|---|
| `DOMAIN` | DuckDNS 도메인 |
| `NEXT_PUBLIC_API_BASE_URL` | `https://<domain>/api` (Web 빌드 시 필수, Docker 내부 이름 금지) |
| `CORS_ORIGINS` | `https://<domain>` 정확히 일치. 와일드카드 금지 |
| `POSTGRES_PASSWORD` | 예시 값 금지 |
| `JWT_ACCESS_SECRET` | 32자 이상 무작위 값 |
| `DAVAS_BOOTSTRAP_INVITE_CODE` | 첫 계정 가입에만 사용. `openssl rand -hex 16`으로 만들고 첫 초대 사용 후 비운다 |
| `TMDB_API_KEY` | 작품 검색에 필요 |
| `TRUST_PROXY_HOPS` | 비워 둔다(기본: Caddy 1단계 신뢰). Caddy 앞에 프록시를 더 둘 때만 설정 |

`TYPEORM_SYNC=false`, `COOKIE_SECURE=true`는 Compose 파일에 고정돼 있다. 운영 API는 `CORS_ORIGINS`가 없거나, `JWT_ACCESS_SECRET`이 짧거나 예시 값이거나, `COOKIE_SECURE`가 `true`가 아니면 시작을 거부한다.

## 3. 운영 DB 원칙

- `TYPEORM_SYNC=true`를 운영에서 켜지 않는다. 장애 복구 지름길로도 쓰지 않는다. 자동 동기화는 예상하지 못한 컬럼·제약 변경, 기존 데이터 충돌, migration 기록과 실제 구조의 불일치를 만든다.
- 스키마 변경은 새로 빌드한 API 이미지의 migration(`dist/database/data-source.js`)으로만 적용한다. 운영 이미지에는 TypeScript 소스와 `ts-node`가 없다.
- schema를 바꾸는 배포 전에는 반드시 DB와 업로드를 함께 백업한다. 업로드 볼륨에는 프로필 사진과 기록 사진(`watch-photos/`, 원본·화면용·썸네일)이 함께 있어 기록 사진이 늘수록 백업도 커진다.
- 정확한 되돌리기는 배포 전 백업 복원뿐이다. `BaseSchema`의 `down`은 의도적으로 아무것도 하지 않는다.

현재 등록된 migration (16개):

1. `BaseSchema1720670300000`
2. `HighValueFlows1720670400000`
3. `CoreRecordContract1720670500000`
4. `FriendInvitesAndConsents1720670600000`
5. `MediaCanonicalIdentity1720670700000`
6. `CoreQueryIndexes1720670800000`
7. `FeedIndexSharedAtPredicate1720670900000`
8. `LegacyTmdbImageSafety1720671000000`
9. `DropLegacyMediaIdentityIndex1720671100000`
10. `SpacesMembershipInvites1720670700000`
11. `WatchEventsAndPersonalReactions1720670800000`
12. `CanonicalCatalogAvailability1720670900000`
13. `AccountLifecycleNotificationOutbox1720671000000`
14. `GroupRecommendationSessions1720671100000`
15. `RecordExperience1720671200000` (한줄평·블라인드·스포일러, 극장·회차 정보, 기록 사진, 리뷰 좋아요)
16. `SpaceWishesAndSubscriptions1720671300000` (사람별 OTT 구독, 공간의 같이 보고 싶어요 목록)

목록 순서는 운영 DB에 적용된 순서(기록 id 1~14, 15부터는 앞으로 배포하는 순서)다. 5~9(보안 보강)와 10~14(TO-BE 기능)는 같은 timestamp를 공유하므로 빈 DB에서는 timestamp 순으로 섞여 실행되지만, 서로 독립이고 재실행에 안전하다. TypeORM은 class 이름으로 적용 여부를 판단하므로 이 이름들을 바꾸지 않는다. 새 migration을 등록하면 이 목록도 같은 변경에서 갱신한다(`npm run verify:deployment`가 검사).

## 4. 배포 절차

### 4.1 백업

```bash
umask 077
stamp="$(date +%Y%m%d-%H%M%S)"
dir="backups/pre-<commit>-$stamp"
mkdir -p "$dir"
$DC exec -T db sh -c 'pg_dump --format=custom --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$dir/davas.dump"
$DC run --rm -T --no-deps -v "$PWD/$dir:/backup" api sh -c 'tar -czf /backup/uploads.tar.gz -C /app/uploads .' </dev/null
(cd "$dir" && sha256sum davas.dump uploads.tar.gz > SHA256SUMS)
$DC exec -T db pg_restore --list < "$dir/davas.dump" | head    # 덤프가 읽히는지 확인
```

- 되돌리기용으로 지금 실행 중인 이미지에 태그를 남긴다: `docker tag davas-api:latest davas-api:pre-<commit>-$stamp` (web도 같게).
- 백업 폴더를 Raspberry Pi 밖(PC·클라우드)에도 복사한다.
- 운영 Compose는 PostgreSQL 포트를 열지 않으므로 호스트에서 `127.0.0.1:5432`로 접속하는 방식은 쓸 수 없다. `deploy/backup.sh`는 DB에 접근 가능한 별도 백업 컨테이너·작업용이다.
- `ssh ... 'bash -s' <<EOF` 처럼 표준 입력으로 스크립트를 넘길 때 `docker compose run`에 `-T`와 `</dev/null`을 빼면 남은 스크립트를 먹어 버린다.

### 4.2 코드 갱신과 빌드 (트래픽은 아직 기존 버전)

```bash
git fetch origin
git stash push -- deploy/Caddyfile   # 서버에서만 쓰는 Caddy 설정 추가분이 있을 때
git merge --ff-only origin/main
git stash pop
$DC build api web
```

### 4.3 migration 확인과 적용

```bash
$DC run --rm -T api npm run migration:show --workspace @davas/api </dev/null
$DC run --rm -T api npm run migration:run --workspace @davas/api </dev/null
$DC run --rm -T api npm run migration:show --workspace @davas/api </dev/null
```

적용 대기(pending)가 0개일 때만 다음 단계로 간다. 새 migration이 있는 배포라면, 운영 DB와 분리된 임시 PostgreSQL 컨테이너(별도 Docker 네트워크, `--tmpfs` 데이터)에 새 API 이미지로 `migration:run`을 먼저 실행해 빈 DB 경로를 확인한 뒤 임시 컨테이너를 지운다.

### 4.4 트래픽 전환

```bash
$DC up -d api web
```

`deploy/Caddyfile`이 바뀌었다면 `caddy reload`가 아니라 **Caddy 컨테이너를 재시작**한다. Caddyfile은 파일 하나만 연결(bind mount)돼 있어서 git이 파일을 새로 쓰면 실행 중인 컨테이너는 예전 내용을 계속 본다.

```bash
$DC restart caddy
docker exec davas-caddy cat /etc/caddy/Caddyfile   # 새 내용인지 확인
```

Caddy는 HTTPS 인증서를 자동으로 발급·갱신한다. 브라우저용 보안 헤더(`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)의 최종 책임은 Caddy이고 `X-Powered-By`는 지운다. API의 Helmet은 Caddy를 거치지 않는 경우를 위한 보조 장치다.

## 5. 배포 후 확인

```bash
$DC ps
docker logs --since 10m davas-api 2>&1 | grep -iE "error|exception"
```

다른 네트워크(또는 같은 공인 IP)에서:

```bash
curl https://<domain>/api/health                                                   # {"status":"ok"}
curl -sI https://<domain>/login | grep -iE "strict-transport|x-frame|x-powered-by"  # HSTS·X-Frame 있음, X-Powered-By 없음
curl -s -o /dev/null -w '%{http_code}\n' https://<domain>/api/docs                 # 404 (Swagger 꺼짐)
curl -s -w ' %{http_code}\n' https://<domain>/api/auth/me                         # 401
curl -sI -H 'Origin: https://evil.example' https://<domain>/api/health | grep -i access-control-allow-origin   # 출력 없음
```

읽기 전용 화면을 먼저 확인한다: `/login`, `/`, `/records/new`, `/me`, `/friends`, `/spaces`, `/settings`, `/manifest.webmanifest`, `/sw.js`, `/offline`.

로그인은 되는데 여러 화면이 동시에 불러오기 실패하고 API 로그에 `column ... does not exist` 또는 `relation ... does not exist`가 보이면, 새 코드가 migration 전 스키마를 보고 있다는 뜻이다. 백업을 확인하고 4.3을 실행한 뒤 API를 다시 시작한다.

## 6. 일상 운영

```bash
$DC logs -f            # 로그
$DC down               # 중지 (볼륨은 유지)
```

- DB 데이터, Caddy 인증서, 업로드 파일은 Docker 볼륨에 있다. `down -v`는 이 데이터를 지운다.
- 코드만 바뀐 배포도 빌드 → migration 확인 → 전환 순서를 지킨다. schema 변경이 섞일 수 있는 배포에서 `up -d --build`로 단계를 건너뛰지 않는다.
- OS, Docker 이미지, Next.js, NestJS, 업로드 관련 의존성을 주기적으로 갱신한다(`npm run audit:prod`).

## 7. 복구 시험과 되돌리기

복구 시험은 별도 DB에서 한다.

```bash
createdb davas_restore_test
pg_restore --clean --if-exists --no-owner --dbname=davas_restore_test <backup>/davas.dump
```

`uploads.tar.gz`도 임시 폴더에 풀어 대표 파일을 확인한다.

되돌리기 방식은 배포 전에 정한다.

- **정확한 되돌리기 (권장):**
  1. Caddy·Web·API 트래픽을 멈춘다.
  2. 배포 전 DB 덤프와 업로드 보관본을 복원한다.
  3. `pre-<commit>` 태그 이미지로 되돌린다.
  4. 상태 확인과 읽기 전용 화면을 점검한다.

  데이터를 변환한 migration은 이 방법으로만 정확히 되돌릴 수 있다.
- **migration revert:** 해당 migration의 `down`을 검토했고 복구할 데이터 변환이 없을 때만 한 개씩 쓴다. 여러 migration이 들어간 배포를 "한 번 revert"로 되돌릴 수 있다고 가정하지 않는다.

## 8. 비밀값과 출처 표기

- 비밀값은 `.env.production`에만 두고 커밋하지 않는다.
- Davas는 TMDB API를 사용하지만 TMDB가 보증하거나 인증한 서비스가 아니다.
