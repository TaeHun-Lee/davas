---
type: "architecture"
date: "2026-08-18T13:42:25.399998+00:00"
question: "친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가"
contributor: "graphify"
outcome: "useful"
source_nodes: ["RecordComposer", "SearchScreen", "RecordList", "FeedScreen", "FriendsScreen", "DiariesService", "TmdbClient"]
---

# Q: 친구 기록 검색 UI, feed 로딩 실패, 친구 탭 진입점, TMDB 기록 작성 흐름을 어떻게 수정해야 하는가

## Answer

친구 검색 진입을 FriendsScreen으로 이동하고 SearchScreen의 필터, fallback, returnTo를 정리했다. generic record CTA는 step=find로 TMDB 검색을 열며 RecordComposer의 저장 초안이 write 단계를 강제하던 호출을 제거했다. feed 계약은 정상이고 Pi의 구형 DB 마이그레이션 상태가 500의 재현 조건이며 클라이언트는 CoreApiError 상태를 보존해 오류 안내를 구분한다.

## Outcome

- Signal: useful

## Source Nodes

- RecordComposer
- SearchScreen
- RecordList
- FeedScreen
- FriendsScreen
- DiariesService
- TmdbClient