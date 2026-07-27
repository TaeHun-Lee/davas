# Production Database Caution

## `TYPEORM_SYNC=true` 주의

`TYPEORM_SYNC=true`는 서버가 시작될 때 현재 코드의 database entity 정의에 맞춰 실제 database table 구조를 자동으로 변경하도록 허용합니다.

개발 환경에서는 편리하지만, 운영 환경에서는 다음 문제가 생길 수 있습니다.

- 예상하지 않은 column 또는 constraint 변경
- 기존 데이터와 새 구조의 충돌
- migration 기록과 실제 database 구조의 불일치
- 잘못된 배포를 되돌리기 어려움

## 운영 시 권장 설정

```env
TYPEORM_SYNC=false
```

운영 database 구조 변경은 자동 동기화 대신 build된 API artifact에 등록된 migration을 사용합니다.

```bash
npm run build --workspace @davas/api
npm run db:show:prod
npm run db:migrate:prod
npm run db:show:prod
```

이 문서는 주의사항이며 application이 해당 설정을 자동으로 차단한다는 의미는 아닙니다.
