import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { DiariesController } from './diaries.controller';
import { DiariesDashboardService } from './diaries-dashboard.service';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src/diaries', path), 'utf8');
}

function apiSource(path: string) {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}

const controllerSource = source('diaries.controller.ts');
const moduleSource = source('diaries.module.ts');
const serviceSource = source('diaries-dashboard.service.ts');
const authControllerSource = apiSource('auth/auth.controller.ts');
const diaryEntitySource = apiSource('database/entities/diary.entity.ts');

type FakeRepository = {
  find: (options?: unknown) => Promise<DiaryEntity[]>;
  findOne?: (options?: unknown) => Promise<DiaryEntity | null>;
  create?: (input: Partial<DiaryEntity>) => DiaryEntity;
  save?: (input: DiaryEntity) => Promise<DiaryEntity>;
};

type FakeMediaRepository = {
  findOne: (options?: unknown) => Promise<MediaEntity | null>;
  save: (input: MediaEntity) => Promise<MediaEntity>;
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
    assert.match(controllerSource, /async dashboard\(\s*@Req\(\) request: AuthenticatedRequest,\s*@Query\('year'\) year\?: string,\s*@Query\('month'\) month\?: string,\s*@Query\('day'\) day\?: string,\s*\)/);
    assert.match(controllerSource, /DiariesDashboardService/);
    assert.match(moduleSource, /DiariesDashboardService/);
  });

  it('loads the dashboard from persisted diary and media rows instead of mock fixtures', async () => {
    assert.match(moduleSource, /TypeOrmModule\.forFeature\(\[DiaryEntity, MediaEntity\]\)/);
    assert.match(serviceSource, /@InjectRepository\(DiaryEntity\)/);
    assert.doesNotMatch(serviceSource, /mock-interstellar|mock-inception|mock-shawshank|const recentItems/);

    const repository: FakeRepository = { find: async () => [makeDiary()] };
    const service = new DiariesDashboardService(repository as never);
    const controller = new DiariesController(service);
    const dashboard = await controller.dashboard({ user: { id: 'user-1' } } as never);

    assert.equal(dashboard.summary.totalCount, 1);
    assert.equal(dashboard.summary.averageRating, 4.5);
    assert.deepEqual(dashboard.summary.topGenre, { name: '드라마', count: 1 });
    assert.equal(dashboard.recentItems[0]?.mediaTitle, '실제 작품');
    assert.equal(dashboard.recentItems[0]?.diaryTitle, '실제 기록 제목');
    assert.equal(dashboard.recentItems[0]?.posterUrl, 'https://image.tmdb.org/t/p/w342/poster.jpg');
    assert.deepEqual(dashboard.recentItems[0]?.genreNames, ['드라마']);
    assert.equal(dashboard.calendar.markers[0]?.day, 8);
  });

  it('aggregates genre ratio rows from real selected media genres instead of exposing TMDB numeric ids', async () => {
    const repository: FakeRepository = {
      find: async () => [
        makeDiary({ id: 'diary-sf', mediaId: 'media-sf', media: { id: 'media-sf', title: '인터스텔라', posterUrl: null, genres: ['878', '18'] } as MediaEntity }),
        makeDiary({ id: 'diary-drama', mediaId: 'media-drama', media: { id: 'media-drama', title: '드라마', posterUrl: null, genres: ['18'] } as MediaEntity }),
        makeDiary({ id: 'diary-horror', mediaId: 'media-horror', media: { id: 'media-horror', title: '공포', posterUrl: null, genres: ['27'] } as MediaEntity }),
      ],
    };

    const dashboard = await new DiariesDashboardService(repository as never).getDashboard('user-1');

    assert.deepEqual(
      dashboard.genreRatios.map((item) => item.genre),
      ['드라마', 'SF', '공포'],
    );
    assert.deepEqual(dashboard.recentItems[0]?.genreNames, ['SF', '드라마']);
    assert.deepEqual(dashboard.recentItems[1]?.genreNames, ['드라마']);
    assert.deepEqual(dashboard.recentItems[2]?.genreNames, ['공포']);
    assert.deepEqual(dashboard.summary.topGenre, { name: '드라마', count: 2 });
    assert.ok(dashboard.genreRatios.every((item) => !/^\d+$/.test(item.genre)), 'numeric TMDB genre ids must not be rendered as genre labels');
  });

  it('returns an empty live dashboard when the user has no diary rows', async () => {
    const repository: FakeRepository = { find: async () => [] };
    const dashboard = await new DiariesDashboardService(repository as never).getDashboard('user-1');

    assert.equal(dashboard.summary.totalCount, 0);
    assert.equal(dashboard.summary.monthlyCount, 0);
    assert.equal(dashboard.summary.averageRating, 0);
    assert.equal(dashboard.summary.topGenre, null);
    assert.deepEqual(dashboard.genreRatios, []);
    assert.deepEqual(dashboard.recentItems, []);
    assert.deepEqual(dashboard.calendar.markers, []);
  });

  it('scopes the live dashboard query to the authenticated user instead of all diaries', async () => {
    let findOptions: unknown;
    const repository: FakeRepository = {
      find: async (options) => {
        findOptions = options;
        return [];
      },
    };

    await new DiariesDashboardService(repository as never).getDashboard('user-42');

    assert.deepEqual(findOptions, {
      where: { userId: 'user-42' },
      relations: { media: true },
      order: { createdAt: 'DESC', watchedDate: 'DESC' },
    });
  });

  it('builds calendar markers for the requested month while keeping summary stats over all records', async () => {
    const repository: FakeRepository = {
      find: async () => [
        makeDiary({ id: 'april-action', watchedDate: '2026-04-10', rating: '5.0', media: { id: 'media-action', title: '액션', posterUrl: null, genres: ['28'] } as MediaEntity }),
        makeDiary({ id: 'may-drama', watchedDate: '2026-05-03', rating: '3.0', media: { id: 'media-drama', title: '드라마', posterUrl: null, genres: ['18'] } as MediaEntity }),
      ],
    };

    const dashboard = await new DiariesDashboardService(repository as never).getDashboard('user-1', { year: 2026, month: 4, day: 10 });

    assert.equal(dashboard.calendar.year, 2026);
    assert.equal(dashboard.calendar.month, 4);
    assert.equal(dashboard.calendar.selectedDay, 10);
    assert.deepEqual(dashboard.calendar.markers, [{ day: 10, count: 1 }]);
    assert.equal(dashboard.summary.totalCount, 2);
    assert.equal(dashboard.summary.monthlyCount, 1);
    assert.equal(dashboard.summary.averageRating, 4);
    assert.deepEqual(dashboard.genreRatios.map((item) => item.genre).sort(), ['드라마', '액션']);
  });

  it('orders my written diary list by most recently created diary first', async () => {
    let findOptions: unknown;
    const repository: FakeRepository = {
      find: async (options) => {
        findOptions = options;
        return [];
      },
    };

    await new DiariesDashboardService(repository as never).getDashboard('user-42');

    assert.deepEqual(findOptions, {
      where: { userId: 'user-42' },
      relations: { media: true },
      order: { createdAt: 'DESC', watchedDate: 'DESC' },
    });
  });

  it('joins diary rows to their selected media through persisted snake_case foreign keys for poster thumbnails', () => {
    assert.match(diaryEntitySource, /import \{[^}]*JoinColumn[^}]*\} from 'typeorm'/);
    assert.match(diaryEntitySource, /@JoinColumn\(\{ name: 'user_id' \}\)\s*\n\s*user!: UserEntity/);
    assert.match(diaryEntitySource, /@JoinColumn\(\{ name: 'media_id' \}\)\s*\n\s*media!: MediaEntity/);
    assert.match(serviceSource, /relations: \{ media: true \}/);
    assert.match(serviceSource, /posterUrl: diary\.media\?\.posterUrl \?\? null/);
  });

  it('uses the same auth cookie as the login flow so created diaries appear on my diary dashboard', () => {
    const authCookieName = authControllerSource.match(/const ACCESS_TOKEN_COOKIE\s*=\s*'([^']+)'/)?.[1];
    const diaryCookieName = controllerSource.match(/const ACCESS_TOKEN_COOKIE\s*=\s*'([^']+)'/)?.[1];

    assert.ok(authCookieName);
    assert.equal(diaryCookieName, authCookieName);
    assert.match(controllerSource, /this\.auth\?\.findMe\(accessToken\)/);
  });

  it('persists a new diary for the authenticated user instead of echoing a contract stub', async () => {
    const created = makeDiary({ id: 'created-diary', userId: 'user-9', mediaId: 'media-9' });
    let createInput: Partial<DiaryEntity> | undefined;
    const repository: FakeRepository = {
      find: async () => [],
      create: (input) => {
        createInput = input;
        return created;
      },
      save: async (input) => input,
    };
    const service = new DiariesDashboardService(repository as never);
    const controller = new DiariesController(service);

    const result = await controller.create({ user: { id: 'user-9' } } as never, {
      mediaId: 'media-9',
      title: '실사용 기록',
      content: '사용자가 직접 작성한 내용',
      watchedDate: '2026-05-08',
      rating: 4.2,
      visibility: 'PRIVATE',
      hasSpoiler: true,
      tags: [],
    });

    assert.deepEqual(createInput, {
      userId: 'user-9',
      mediaId: 'media-9',
      title: '실사용 기록',
      content: '사용자가 직접 작성한 내용',
      watchedDate: '2026-05-08',
      rating: '4.2',
      visibility: 'PRIVATE',
      hasSpoiler: true,
    });
    assert.equal(result.diary.id, 'created-diary');
    assert.doesNotMatch(controllerSource, /create diary endpoint contract ready/);
  });

  it('stores the selected media representative poster on the server before showing diary thumbnails', async () => {
    assert.match(moduleSource, /TypeOrmModule\.forFeature\(\[DiaryEntity, MediaEntity\]\)/);
    assert.match(serviceSource, /@InjectRepository\(MediaEntity\)/);
    assert.match(serviceSource, /mediaPosterUrl/);
    assert.match(serviceSource, /media\.posterUrl = dto\.mediaPosterUrl/);

    const created = makeDiary({ id: 'created-diary', userId: 'user-9', mediaId: 'media-9' });
    const media = {
      id: 'media-9',
      title: '괴물',
      posterUrl: null,
    } as MediaEntity;
    let savedMedia: MediaEntity | undefined;
    const repository: FakeRepository = {
      find: async () => [],
      create: () => created,
      save: async (input) => input,
    };
    const mediaRepository: FakeMediaRepository = {
      findOne: async (options) => {
        assert.deepEqual(options, { where: { id: 'media-9' } });
        return media;
      },
      save: async (input) => {
        savedMedia = input;
        return input;
      },
    };

    await new DiariesDashboardService(repository as never, mediaRepository as never).createDiary('user-9', {
      mediaId: 'media-9',
      mediaPosterUrl: 'https://image.tmdb.org/t/p/w500/monster.jpg',
      title: '괴물',
      content: '',
      watchedDate: '2026-05-08',
      rating: 0,
      visibility: 'PRIVATE',
      hasSpoiler: false,
      tags: [],
    });

    assert.equal(savedMedia?.posterUrl, 'https://image.tmdb.org/t/p/w500/monster.jpg');
  });

  it('loads an authenticated diary detail for edit mode with selected media fields', async () => {
    const diary = makeDiary({
      id: 'diary-edit',
      userId: 'user-9',
      media: { id: 'media-9', title: '괴물', originalTitle: 'Monster', posterUrl: 'https://image.tmdb.org/t/p/w500/monster.jpg', releaseDate: '2006-07-27', runtime: 119, mediaType: 'MOVIE', genres: ['27', '18'] } as MediaEntity,
    });
    let findOneOptions: unknown;
    const repository: FakeRepository = {
      find: async () => [],
      findOne: async (options) => {
        findOneOptions = options;
        return diary;
      },
    };

    const detail = await new DiariesDashboardService(repository as never).getDiaryForEdit('user-9', 'diary-edit');

    assert.deepEqual(findOneOptions, { where: { id: 'diary-edit', userId: 'user-9' }, relations: { media: true } });
    assert.equal(detail.id, 'diary-edit');
    assert.equal(detail.title, '실제 기록 제목');
    assert.equal(detail.media.title, '괴물');
    assert.deepEqual(detail.media.genres, ['공포', '드라마']);
  });

  it('updates an authenticated diary row instead of returning the patch contract stub', async () => {
    const diary = makeDiary({ id: 'diary-edit', userId: 'user-9', rating: '3.0' });
    let savedDiary: DiaryEntity | undefined;
    const repository: FakeRepository = {
      find: async () => [],
      findOne: async () => diary,
      save: async (input) => {
        savedDiary = input;
        return input;
      },
    };

    const result = await new DiariesDashboardService(repository as never).updateDiary('user-9', 'diary-edit', {
      title: '수정한 기록',
      content: '수정한 본문',
      watchedDate: '2026-05-09',
      rating: 4.1,
      visibility: 'PRIVATE',
      hasSpoiler: true,
      tags: [],
    });

    assert.equal(savedDiary?.title, '수정한 기록');
    assert.equal(savedDiary?.rating, '4.1');
    assert.equal(savedDiary?.hasSpoiler, true);
    assert.equal(result.id, 'diary-edit');
    assert.doesNotMatch(controllerSource, /update diary endpoint contract ready/);
  });

});
