# Davas 문서

문서는 목적별로 아래 영역만 유지한다.

| 영역 | 문서 | 역할 |
|---|---|---|
| 제품 | [제품 기준 문서](product/README.md) | 합의된 제품 방향과 MVP 범위의 단일 기준 |
| 제품 상세 설계 | [planning](product/planning/) | 제품 요구사항, 기술 아키텍처, 추천 전략의 TO-BE 상세 설계 |
| 개발 | [Docker 실행](development/docker.md) | 로컬 개발 환경 실행 |
| 개발 상세 | [로컬 개발](development/local-development.md) | Docker 없이 실행, 데이터 삭제 주의사항 |
| 배포 | [Raspberry Pi 배포](deployment/raspberry-pi-duckdns.md) | 운영 배포 개요와 접속 정보 |
| 운영 런북 | [Raspberry Pi 운영 절차](operations/raspberry-pi-deployment.md) | 백업 → 빌드 → 마이그레이션 → 트래픽 개방, 롤백 |
| 운영 DB 주의 | [PRODUCTION_DATABASE_CAUTION](../PRODUCTION_DATABASE_CAUTION.md) | 운영 DB를 다룰 때 금지·필수 사항 |
| 검증 | [Quality gates](verification/quality-gates.md) | 완료 판정에 필요한 명령과 증명 범위 |
| 구조 | [System overview](architecture/system-overview.md) | 코드 지도 (2026-07 기준, TO-BE 모듈은 planning 문서 참고) |
| 에이전트 | [Agent harness](harness/agent-harness.md) | 에이전트 작업 절차 |

## 관리 원칙

- 합의된 제품 방향과 범위는 `product/README.md`에서 관리한다.
- `product/planning/`은 기준 문서를 구현 가능한 수준으로 구체화하며, 충돌하면 기준 문서를 우선한다.
- 같은 내용을 상태 보고서, TODO, 실행 프롬프트로 중복 작성하지 않는다.
- 구현 상태는 문서에 복제하지 않고 코드, 테스트, 이슈와 Git 이력을 기준으로 확인한다.
- 장기 보존이 필요한 기술 결정이 생기면 `docs/decisions/`에 ADR로 추가한다.
- 개발·배포 명령은 실제 스크립트와 함께 변경한다.
