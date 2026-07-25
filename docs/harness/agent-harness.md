---
title: Davas Agent Harness
status: active
last-verified: 2026-07-25
---

# Davas Agent Harness

이 harness는 Agent가 최소 context로 정확한 source를 선택하고, 같은 deterministic gates로 완료를 검증하도록 구성한다.

## Components

```text
AGENTS.md
  Portable, always-on project rules and source precedence

.agents/skills/davas-core-development/SKILL.md
  Task-triggered Design → Work → Verify procedure

docs/
  Role-based progressive-disclosure references

scripts/run-tests.mjs
  Concrete test discovery and Node test execution

scripts/verify-docs.mjs
  Required docs, UTF-8, links, Skill/frontmatter, stale-file guard
```

Hermes에서는 repository root를 workdir로 사용하면 `AGENTS.md`가 project context로 주입된다. `.hermes.md`는 만들지 않는다. Hermes의 first-match priority에서 `.hermes.md`가 `AGENTS.md`를 가려 cross-harness 규칙이 분산되는 것을 피하기 위해서다.

## Context loading strategy

Agent는 모든 문서를 한 번에 읽지 않는다.

1. `AGENTS.md` — 항상
2. `.agents/skills/davas-core-development/SKILL.md` — 코드·문서·배포 변경 task
3. 작업별 reference — 필요한 것만
   - Product/UX: `docs/product/core-experience.md`
   - Code map: `docs/architecture/system-overview.md`
   - Local: `docs/development/local-development.md`
   - Production: `docs/operations/raspberry-pi-deployment.md`
   - Completion: `docs/verification/quality-gates.md`

이 구조는 50KB product design을 매 turn 자동 주입하지 않고, Skill이 필요한 section만 선택하게 한다.

## Source precedence

1. Code, entity/migration, package scripts, Compose/Caddy
2. Product source of truth
3. Architecture map
4. Development/operations/verification runbooks
5. Agent workflow documents

Product design과 code가 다르면 차이를 숨기지 않는다. Design change인지 implementation drift인지 판정한 뒤 한 loop에서 함께 정렬한다.

## Standard loop

### Design

- Relevant design section과 acceptance criterion을 식별한다.
- In-scope / out-of-scope를 명시한다.
- 시작 `git status`와 existing diff를 기록한다.
- 최소 검증 가능한 unit과 필요한 gates를 결정한다.

### Work

- Design이 요구한 최소 변경만 한다.
- Schema는 새 additive migration으로 변경한다.
- 기존 dirty changes를 reset/checkout하지 않는다.
- 동일 계약을 docs 여러 곳에 복사하지 않는다.

### Verify

- Targeted gate부터 실행한다.
- Full `npm run verify`로 regression을 확인한다.
- DB/browser/device가 필요한 증거는 실제 환경에서만 PASS 처리한다.
- Modified/deleted/created files와 undo 방법을 보고한다.

## Harness commands

```bash
npm run docs:check
npm run test:shared
npm run test:api
npm run test:web
npm test
npm run lint
npm run build
npm run verify
npm run verify:release
```

## Adding or changing documentation

- 새 문서는 `docs/README.md`의 lifecycle role 중 하나를 가져야 한다.
- Current SSOT와 중복되는 대형 prompt/TODO/status 문서는 만들지 않는다.
- Agent용 반복 절차는 `.agents/skills/.../SKILL.md`에 둔다.
- Deterministic checks는 `scripts/`에 둔다.
- 완료 이력은 Git commit/PR/CI log에 남기고 active docs에는 복제하지 않는다.

## Cross-harness use

- Hermes/Codex/OpenCode: repository root에서 `AGENTS.md`를 project instruction으로 사용
- 다른 harness: `AGENTS.md`를 entrypoint로 지정하고 project Skill을 명시적으로 load
- Project-local Skill이 자동 발견되지 않는 harness에서는 `AGENTS.md`의 첫 단계대로 Skill 파일을 직접 읽는다.

Skill의 canonical copy는 `.agents/skills/davas-core-development/SKILL.md` 하나뿐이다. Harness별 중복 copy를 만들지 않는다.

## Verification

```bash
npm run docs:check
```

이 command가 확인하는 것:

- required harness files 존재
- deleted stale docs가 다시 생기지 않음
- Markdown relative link 유효
- UTF-8 text
- `AGENTS.md` 20,000자 이하
- project Skill required frontmatter/body

Product correctness는 docs check만으로 증명되지 않는다. `docs/verification/quality-gates.md`의 code/runtime gates를 추가로 실행한다.
