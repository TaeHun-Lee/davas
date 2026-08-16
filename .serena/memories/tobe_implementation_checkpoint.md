# Davas TO-BE 구현 오케스트레이션 체크포인트

기록 시점: 2026-08-12 (Asia/Seoul)
중단 사유: 사용자가 컴퓨터 종료 전 안전한 일시 중단을 요청함. 코드 실패가 아님.

## Orca 상태

- Run: `run_d91a02f14e72`
- Objective: docs/product/planning TO-BE 3종을 세부 분석→설계→구현→국소 검증 사이클로 현재 소스에 반영하고 마지막에만 전수 검증
- Task 1: `task_62cb5bc9ae89` 공유 공간·멤버십·초대 백엔드
- 중지된 Dispatch: `ctx_2eb46af7c077`
- 중지된 terminal: `term_c6337989-0d38-4527-bd5b-31c3746cf5c4`
- worker-stop 결과: dispatch failed/stopped, Task 1 blocked, agent terminal closed. 작업 트리는 유지됨.
- 다른 워커는 시작하지 않음.

## Task DAG

1. `task_62cb5bc9ae89` Space/Membership/Invite backend — blocked only because user paused
2. `task_ed98fb924bde` watch event/participants/personal reactions — depends task 1
3. `task_7bf60afbea5a` canonical catalog/availability — ready
4. `task_6d6148135d17` account lifecycle/notification/outbox — ready
5. `task_19a49090d401` Web spaces — depends task 1
6. `task_0a436b314302` group recommendation — depends tasks 1,2,3
7. `task_715f6a4dbce6` Web journal/participants/reactions — depends tasks 2,5
8. `task_0727229796a4` Web group recommendation — depends tasks 6,5
9. `task_eac894f38996` integration consistency audit — depends tasks 6,4,7,8

## Task 1 구현 상태

추가/수정됨:
- apps/api/src/database/entities/space.entity.ts
- apps/api/src/database/entities/space-membership.entity.ts
- apps/api/src/database/entities/space-invite.entity.ts
- apps/api/src/database/migrations/1720670700000-SpacesMembershipInvites.ts
- apps/api/src/database/migrations/space-membership-migration.spec.ts
- apps/api/src/spaces/spaces.dto.ts
- apps/api/src/spaces/spaces.service.ts
- apps/api/src/spaces/spaces.controller.ts
- apps/api/src/spaces/space-invites.controller.ts
- apps/api/src/spaces/spaces.module.ts
- apps/api/src/spaces/spaces.service.spec.ts
- apps/api/src/spaces/spaces-api.spec.ts
- apps/api/src/app.module.ts
- apps/api/src/database/entities/index.ts
- apps/api/src/database/typeorm.config.ts

설계/구현 결정:
- 공간 생성 직후 owner 1명, maxMembers 2~5
- Space/Membership/SpaceInvite 모델
- SHA-256 해시 일회성 초대 토큰
- 공간 행 잠금으로 마지막 자리 수락 경쟁 직렬화
- 초대 발급/수락/취소 잠금 순서를 공간→초대로 통일해 PostgreSQL 교착 가능성 보정
- 소유권 이전 후에만 owner 탈퇴, owner 주도 공간 종료
- 비멤버 접근 404
- 기존 친구 기능은 유지

검증 완료:
- focused command: apps/api에서 `node --test --import tsx src/spaces/spaces.service.spec.ts src/spaces/spaces-api.spec.ts src/database/migrations/space-membership-migration.spec.ts`
- 3 suites / 12 tests 통과. 잠금 순서 수정 뒤 재실행도 통과.
- 변경 소스와 테스트의 Serena diagnostics: error/warning 없음.
- Prettier check 통과.
- git diff --check 통과(Windows LF→CRLF 경고만 존재).
- `graphify update .` 완료: 2,155 nodes / 4,010 edges.
- TEST_DATABASE_URL/DATABASE_URL 미설정이라 실제 PostgreSQL 실행 검증은 아직 하지 않음. 전체 테스트/빌드/E2E는 사용자 지침대로 실행하지 않음.

중단 직전:
- 워커는 최종 diff/환경 점검 중이었음.
- 국소 수용 기준은 거의 충족했지만 worker_done 전에 사용자 중단 요청이 들어옴.
- 워커에 체크포인트 후 failed worker_done 요청을 보냈으나 메시지를 소비하기 전에 worker-stop 실행.
- 따라서 Task 1을 완료로 수동 변경하지 말고 새 retry worker가 현재 diff를 재분석하고 focused verification을 다시 한 뒤 정상 worker_done을 보내야 함.

## 재개 절차

1. 현재 설치된 orchestration skill을 다시 로드하고 `orca status --json` 확인.
2. Run `run_d91a02f14e72`를 현재 코디네이터에 bind/use한다(그때의 current guide 문법 사용).
3. `worker-show --dispatch ctx_2eb46af7c077`과 task-list로 stopped/blocked 상태 확인.
4. Task 1 replacement를 current worktree에서 `--retry-of ctx_2eb46af7c077`로 시작한다. 새 워커에게 기존 변경을 보존하고 ANALYZE부터 재개하며 Task 1의 국소 테스트/진단/diff만 재검증하도록 지시한다.
5. 정상 worker_done을 수용한 뒤 worker-release하고 Delivery를 ack한다.
6. 이후 ready Task를 공통 파일 충돌 없이 순차/안전한 병렬 wave로 계속한다.
7. 모든 작업 worker가 수용·해제된 뒤에만 coordinator가 전체 lint/test/build와 최종 Graphify/문서 정합성을 수행한다.

## 보존 주의

- 기존 사용자 소유 dirty docs/config/deploy/archive 파일은 건드리지 말 것.
- Task 1 변경은 아직 commit되지 않았고 일부는 untracked다.
- reset/checkout/clean을 사용하지 말 것.
