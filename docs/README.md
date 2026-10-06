# Davas 문서

| 문서 | 내용 |
|---|---|
| [제품 기준](product/README.md) | 제품 목표, MVP 범위, 도메인 모델, 권한, 추천 원칙. 제품 방향의 단일 기준 |
| └ [제품 요구사항](product/planning/product-requirements-analysis.md) · [기술 아키텍처](product/planning/technical-architecture-analysis.md) · [추천 전략](product/planning/recommendation-strategy-analysis.md) | 제품 기준을 구현 수준으로 풀어 쓴 TO-BE 상세 설계 |
| └ [구현 추적표](product/implementation-coverage.md) | MVP 요구사항과 실제 코드의 연결, 남은 경계 |
| [개발 가이드](development.md) | 로컬 실행, 코드 지도, API 보안 경계, DB·migration, 검증 명령 |
| [운영 가이드](operations.md) | Raspberry Pi 설정, 운영 DB 원칙, 배포·백업·되돌리기 절차 |
| [부록](appendix.md) | 레거시 호환, 알려진 문제, 검증·작업 요령 |

에이전트 작업 규칙은 루트의 [`AGENTS.md`](../AGENTS.md)에 있다.

## 관리 원칙

- 내용마다 들어갈 곳을 하나로 정한다.
  - 제품 방향과 범위는 `product/README.md`에 둔다. 상세 설계(`product/planning/`)와 충돌하면 제품 기준이 우선한다.
  - 실행·검증 명령은 `development.md`, 운영 서버 절차는 `operations.md`에 둔다.
  - 과거 사정, 알려진 문제, 상황 판단 요령은 `appendix.md`에 둔다.
- 작업 상태 보고서, 끝난 TODO, 실행 프롬프트는 문서로 남기지 않는다. 이력은 Git 커밋과 PR에 남긴다.
- 명령이나 계약을 바꾸면 관련 문서를 같은 변경에서 고친다.
- 오래 보존해야 하는 기술 결정이 생기면 `docs/decisions/`에 ADR로 추가한다.
- `npm run docs:check`가 필수 문서, 링크, UTF-8, 지운 문서의 재등장을 검사한다.
