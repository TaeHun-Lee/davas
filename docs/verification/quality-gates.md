---
title: Quality Gates
status: active
last-verified: 2026-07-25
---

# Quality Gates

완료 보고는 실제 command output과 필요한 manual evidence가 있을 때만 가능하다. 환경이 준비되지 않은 상태는 product failure가 아니라 **precondition failure**로 기록한다.

## Gate order

```bash
npm ci
npm run format:check
npm run docs:check
npm run verify:deployment
npm test
npm run lint
npm run build
npm run verify:auth
npm run verify:upload
```

한 번에 실행:

```bash
npm run verify
```

`npm run verify`의 실제 chain은 formatting/line endings → docs → deployment contracts → tests → type/lint → production build → authenticated HTTP → upload HTTP 순서다. 앞 gate가 실패하면 뒤 gate 결과를 완료 증거로 사용하지 않는다.

Production release 전 dependency advisory까지 포함한다.

```bash
npm run verify:release
```

`verify:release`의 실제 chain은 `verify` → `verify:caddy` → `audit:prod`다. Caddy verifier는 real Caddy container와 mock upstream으로 browser-facing header가 누락·중복되지 않는지 확인한다. 현재 비공식 self-host release는 legal 원문을 검사하지 않는다.

`audit:prod`가 non-zero를 반환하면 dependency upgrade가 별도 변경을 요구하더라도 release는 차단하고 결과를 보고한다.

## What each gate proves

| Gate             | Command                                              | 증명하는 것                                                             | 증명하지 않는 것                     |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| Docs             | `npm run docs:check`                                 | 필수 문서·Skill 존재, UTF-8, relative links, 금지된 stale 문서 부재     | 내용의 제품 타당성                   |
| Deployment       | `npm run verify:deployment`                          | root scripts, runtime ignores, Web Docker API URL, migration docs 계약  | real container/network/DB 상태       |
| Unit/contract    | `npm test`                                           | 발견된 Shared/API/Web test files의 실행 결과                            | PostgreSQL·TMDB·browser E2E          |
| Type/lint        | `npm run lint`                                       | API TypeScript와 Web ESLint gate                                        | runtime behavior                     |
| Build            | `npm run build`                                      | Shared, Nest, Next production artifacts 생성                            | production DB migration              |
| Auth HTTP        | `npm run verify:auth`                                | compiled API의 cookie auth HTTP contract                                | public proxy/TLS 경계                |
| Upload HTTP      | `npm run verify:upload`                              | compiled API의 upload HTTP contract                                     | production uploads volume durability |
| Caddy            | `npm run verify:caddy`                               | real Caddy routing과 security-header replacement                        | public DNS·certificate issuance      |
| Production audit | `npm run audit:prod`                                 | 설치된 production dependency의 known advisory                           | application-specific exploitability  |
| Migration        | `migration:show` and `migration:run` in `@davas/api` | compiled 실제 PostgreSQL schema chain                                   | browser UX                           |
| Manual mobile    | 360/390/430px                                        | overflow, fixed nav/CTA, keyboard, focus                                | server access control 전체           |

## Targeted tests

```bash
npm run test:shared
npm run test:api
npm run test:web
```

또는 workspace에서:

```bash
npm test --workspace @davas/api
npm test --workspace @davas/web
npm test --workspace @davas/shared
```

`scripts/run-tests.mjs`가 concrete test paths를 발견한 뒤 Node test runner에 전달한다. Quoted `src/**/*.spec.ts`를 package script에 직접 넣지 않는다.

## Migration gate

PostgreSQL이 준비된 환경에서:

```bash
npm run build --workspace @davas/api
npm run migration:show --workspace @davas/api
npm run migration:run --workspace @davas/api
npm run migration:show --workspace @davas/api
```

완료 조건:

- migration command가 DB에 연결됨
- pending migration 0
- expected constraints/indexes 존재
- 신규·legacy fixture 모두 read/write 가능
- exact rollback이 필요하면 pre-migration dump restore 검증 완료

## Core contract regression set

제품·API 변경은 관련 항목을 최소 검증한다.

- `viewingMethod` DB→DTO→service→Web round trip
- nullable rating 1–5 validation
- media type movie/tv/multi forwarding
- feed/me q + mediaType + viewingMethod AND filter
- `FRIENDS/PRIVATE` create와 legacy `SELECTED` read compatibility
- `clientRequestId` replay와 idempotency conflict
- `POSSIBLE_REWATCH` user-confirmed duplicate flow
- non-friend direct URL denial as `RECORD_NOT_FOUND`
- friend invite expiry, self-use, single-use, concurrent consume
- stale cookie 401→logout→safe login return
- legal consent version validation

## Manual Web QA

Viewport: 360px, 390px, 430px.

Routes:

- `/login`, `/signup`
- `/`
- `/records/new` find + write
- `/records/:id`
- `/search?scope=friends`
- `/search?scope=mine`
- `/me`
- `/friends`
- `/settings`
- `/offline`

Check:

- horizontal overflow 0
- touch target 44×44px minimum
- visible `focus-visible`
- keyboard-only search, filters, media selection, rating, save, invite accept
- reduced-motion behavior
- loading/empty/error states are mutually exclusive
- failed save preserves draft and does not report success
- spoiler preview does not leak list content
- bottom nav and fixed CTA do not overlap keyboard/safe area

## Evidence format

```markdown
- Gate: npm test
- Result: PASS / FAIL / BLOCKED
- Timestamp: ISO-8601
- Output summary: tests, failures, skips
- Artifact: log path or command output
- Product impact: what is or is not proven
```

Historical success counts are not current evidence. Re-run the command on the current tree.

## Failure policy

- **FAIL:** implementation or harness defect reproduced
- **BLOCKED:** missing DB, dependencies, credentials, browser/device, or incompatible toolchain
- **PASS:** command completed with exit 0 and expected assertions ran

Do not turn BLOCKED into PASS through static inspection. Static review may be recorded as a separate, narrower proof.
