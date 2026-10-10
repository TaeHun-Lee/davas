import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { showtimeDateLabel, showtimeRegions, showtimesReadLabel } from './media-showtimes-model';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('theater showtimes in the title sheet', () => {
  it('names days the way people say them and when the schedules were read', () => {
    assert.deepEqual(showtimeDateLabel('2026-10-10', '2026-10-10'), { name: '오늘', day: '10.10' });
    assert.deepEqual(showtimeDateLabel('2026-10-11', '2026-10-10'), { name: '내일', day: '10.11' });
    assert.deepEqual(showtimeDateLabel('2026-10-12', '2026-10-10'), { name: '월', day: '10.12' });
    assert.equal(showtimesReadLabel('2026-10-10T03:25:00.000Z'), '10월 10일 12:25 기준');
    assert.equal(showtimesReadLabel(null), null);
    const theater = (region: string) => ({ region }) as never;
    assert.deepEqual(showtimeRegions([theater('경기'), theater('서울'), theater('경기')]), [
      '서울',
      '경기',
    ]);
  });

  it('shows the card for films only, with KOBIS named as the source and booking links', () => {
    const sheet = source('components/media/MediaDetailModal.tsx');
    const card = source('components/media/media-showtimes-section.tsx');
    assert.match(
      sheet,
      /<TheaterShowtimesCard\s+mediaId=\{media\.id\}\s+enabled=\{isOpen && media\.mediaType === 'MOVIE'\}\s*\/>/,
    );
    assert.match(card, /극장에서 볼 수 있는 곳/);
    assert.match(card, /상영 정보: 영화진흥위원회 통합전산망\(KOBIS\)/);
    assert.match(card, /target="_blank"\s+rel="noopener noreferrer"/);
    // Nothing shows for a film no theater plays.
    assert.match(card, /if \(!enabled \|\| !showtimes\?\.dates\.length\) return null;/);
  });

  it('puts films playing in theaters first on home and in 탐색', () => {
    const home = source('components/core/HomeRecommendations.tsx');
    const explore = source('components/core/ExploreScreen.tsx');
    assert.match(home, /\{ value: 'THEATER', label: '극장' \},\s*\{ value: 'MOVIE'/);
    assert.match(home, /useState<RecommendationType>\('THEATER'\)/);
    assert.match(home, /getNowShowing\(\{ limit: 20 \}\)/);
    assert.match(explore, /\{ value: 'THEATER', label: '극장' \},\s*\{ value: 'MOVIE'/);
    assert.match(explore, /getNowShowing\(\{ limit: 20 \}\)/);
    for (const screen of [home, explore]) {
      assert.match(screen, /상영 정보: 영화진흥위원회 통합전산망\(KOBIS\)/);
    }
  });
});
