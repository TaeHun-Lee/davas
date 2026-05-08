import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { DiaryEntity } from '../database/entities/diary.entity';
import { DiariesController } from './diaries.controller';
import { DiariesDashboardService } from './diaries-dashboard.service';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src/diaries', path), 'utf8');
}

const controllerSource = source('diaries.controller.ts');
const moduleSource = source('diaries.module.ts');
const serviceSource = source('diaries-dashboard.service.ts');

type FakeRepository = {
  find: () => Promise<DiaryEntity[]>;
};

function makeDiary(overrides: Partial<DiaryEntity> = {}): DiaryEntity {
  return {
    id: 'diary-1',
    userId: 'user-1',
    mediaId: 'media-1',
    title: '실제 기록 제목',
    content: '실제 사용자가 작성한 다이어리 본문입니다.',
    watchedDate: '2026-05-08',
    rating: '4.5',
    visibility: 'PRIVATE',
    hasSpoiler: false,
    media: {
      id: 'media-1',
      title: '실제 작품',
      posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
      genres: ['드라마'],
    },
    createdAt: new Date('2026-05-09T00:00:00.000Z'),
    updatedAt: new Date('2026-05-09T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  } as DiaryEntity;
}

describe('Diaries dashboard API contract', () => {
  it('registers GET /api/diaries/dashboard before dynamic diary detail routes', () => {
    assert.match(controllerSource, /@Get\('dashboard'\)/);
    assert.ok(controllerSource.indexOf("@Get('dashboard')") < controllerSource.indexOf("@Get(':id')"));
    assert.match(controllerSource, /dashboard\(\)/);
    assert.match(controllerSource, /DiariesDashboardService/);
    assert.match(moduleSource, /DiariesDashboardService/);
  });

  it('loads the dashboard from persisted diary and media rows instead of mock fixtures', async () => {
    assert.match(moduleSource, /TypeOrmModule\.forFeature\(\[DiaryEntity\]\)/);
    assert.match(serviceSource, /@InjectRepository\(DiaryEntity\)/);
    assert.doesNotMatch(serviceSource, /mock-interstellar|mock-inception|mock-shawshank|const recentItems/);

    const repository: FakeRepository = { find: async () => [makeDiary()] };
    const service = new DiariesDashboardService(repository as never);
    const controller = new DiariesController(service);
    const dashboard = await controller.dashboard();

    assert.equal(dashboard.summary.totalCount, 1);
    assert.equal(dashboard.summary.averageRating, 4.5);
    assert.deepEqual(dashboard.summary.topGenre, { name: '드라마', count: 1 });
    assert.equal(dashboard.recentItems[0]?.mediaTitle, '실제 작품');
    assert.equal(dashboard.recentItems[0]?.diaryTitle, '실제 기록 제목');
    assert.equal(dashboard.recentItems[0]?.posterUrl, 'https://image.tmdb.org/t/p/w342/poster.jpg');
    assert.equal(dashboard.calendar.markers[0]?.day, 8);
  });

  it('returns an empty live dashboard when the user has no diary rows', async () => {
    const repository: FakeRepository = { find: async () => [] };
    const dashboard = await new DiariesDashboardService(repository as never).getDashboard();

    assert.equal(dashboard.summary.totalCount, 0);
    assert.equal(dashboard.summary.monthlyCount, 0);
    assert.equal(dashboard.summary.averageRating, 0);
    assert.equal(dashboard.summary.topGenre, null);
    assert.deepEqual(dashboard.genreRatios, []);
    assert.deepEqual(dashboard.recentItems, []);
    assert.deepEqual(dashboard.calendar.markers, []);
  });
});
