# Davas Documentation

이 디렉터리는 역할별 source of truth만 유지한다. 실행 prompt, 세션 status snapshot, 완료된 TODO, 과거 재검증 보고서는 active docs에 두지 않는다.

## Information architecture

```text
docs/
├── README.md
├── product/
│   └── core-experience.md
├── architecture/
│   └── system-overview.md
├── development/
│   └── local-development.md
├── operations/
│   └── raspberry-pi-deployment.md
├── verification/
│   └── quality-gates.md
└── harness/
    └── agent-harness.md
```

## Read by task

| 작업 | 먼저 읽을 문서 | 다음 문서 |
| --- | --- | --- |
| 제품 범위·UX·route 변경 | `product/core-experience.md` | `architecture/system-overview.md` |
| API·DB·migration 변경 | `product/core-experience.md` §9 | `architecture/system-overview.md` |
| 로컬 실행·debug | `development/local-development.md` | `verification/quality-gates.md` |
| 배포·backup·rollback | `operations/raspberry-pi-deployment.md` | 실제 Compose/Caddy/package scripts |
| Agent 작업 | `../AGENTS.md` | `../.agents/skills/davas-core-development/SKILL.md` |
| 완료 판정 | `verification/quality-gates.md` | 관련 설계 acceptance criteria |

## Authority order

충돌 시 다음 순서로 판단한다.

1. **실제 구현 사실:** code, TypeORM migration/entity, package scripts, Compose, Caddy
2. **제품 규범:** `product/core-experience.md`
3. **구조 설명:** `architecture/system-overview.md`
4. **실행 절차:** development/operations/verification 문서
5. **Agent 절차:** `AGENTS.md`, project Skill

코드와 제품 문서가 다르면 임의로 한쪽을 정답으로 만들지 않는다. 차이를 보고하고, 제품 변경이면 product SSOT를 먼저 갱신한 뒤 코드와 검증을 같은 loop에서 맞춘다.

## Document lifecycle

모든 새 문서는 아래 역할 중 하나만 가져야 한다.

- `product`: 사용자 가치, 범위, IA, 수용 기준
- `architecture`: 현재 구현 구조와 변경 경계
- `development`: 로컬 개발 절차
- `operations`: production 운영 절차
- `verification`: 재현 가능한 quality gate
- `harness`: Agent context·Skill·automation 사용법

금지:

- 특정 세션에 붙여 넣는 대형 prompt 문서
- 현재 상태처럼 보이는 날짜 고정 status snapshot
- 완료된 TODO를 active docs로 보존
- 동일 계약을 여러 문서에 복사
- 공인 IP, token, password 같은 가변·민감 운영값 기록

문서 변경 후 반드시 실행한다.

```bash
npm run docs:check
```
