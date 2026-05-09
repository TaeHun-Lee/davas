import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CommunityService } from './community.service';
import type { DiaryEntity } from '../database/entities/diary.entity';
import type { MediaEntity } from '../database/entities/media.entity';
import type { UserEntity } from '../database/entities/user.entity';

type FakeRepository = {
  find: (options?: unknown) => Promise<DiaryEntity[]>;
};

function makeDiary(overrides: Partial<DiaryEntity> = {}): DiaryEntity {
  return {
    id: 'diary-1',
    userId: 'user-1',
    mediaId: 'media-1',
    title: '실제 기록 제목',
    content: '실제 사용자가 작성한 공개 다이어리 본문입니다.',
    watchedDate: '2026-05-08',
    rating: '4.5',
    visibility: 'PUBLIC',
    hasSpoiler: false,
    user: {
      id: 'user-1',
      nickname: '실제사용자',
      profileImageUrl: null,
    } as UserEntity,
    media: {
      id: 'media-1',
      title: '실제 작품',
      posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
      releaseDate: '2026-01-02',
      genres: ['18'],
    } as MediaEntity,
    comments: [{ id: 'comment-1' }, { id: 'comment-2' }] as never,
    createdAt: new Date('2026-05-09T03:00:00.000Z'),
    updatedAt: new Date('2026-05-09T03:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  } as DiaryEntity;
}

describe('Community dashboard API', () => {
  it('builds the community dashboard from public diary rows and real comment counts', async () => {
    let findOptions: unknown;
    const repository: FakeRepository = {
      find: async (options) => {
        findOptions = options;
        return [
          makeDiary({ id: 'older', rating: '3.5', createdAt: new Date('2026-05-08T00:00:00.000Z'), comments: [] as never }),
          makeDiary({ id: 'popular', rating: '4.8', title: '가장 인기 있는 공개 기록', comments: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }] as never }),
        ];
      },
    };

    const dashboard = await new CommunityService(repository as never).getDashboard({ tab: 'popular' });

    assert.deepEqual(findOptions, {
      where: { visibility: 'PUBLIC' },
      relations: { media: true, user: true, comments: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });
    assert.equal(dashboard.tab, 'popular');
    assert.equal(dashboard.feed[0]?.id, 'popular');
    assert.equal(dashboard.feed[0]?.commentCount, 3);
    assert.equal(dashboard.feed[0]?.author.nickname, '실제사용자');
    assert.equal(dashboard.feed[0]?.media.title, '실제 작품');
    assert.deepEqual(dashboard.topics[0], { label: '#드라마', count: 2 });
    assert.equal(dashboard.popularDiaries[0]?.id, 'popular');
  });

  it('filters community feed by real diary, media, and author text without returning fabricated engagement', async () => {
    const repository: FakeRepository = {
      find: async () => [
        makeDiary({ id: 'match-title', title: '검색 대상 기록' }),
        makeDiary({ id: 'match-media', media: { id: 'media-2', title: '찾는 작품', posterUrl: null, releaseDate: null, genres: ['878'] } as MediaEntity }),
        makeDiary({ id: 'no-match', title: '다른 기록', content: '다른 본문', user: { id: 'user-2', nickname: '다른사용자', profileImageUrl: null } as UserEntity, media: { id: 'media-3', title: '다른 작품', posterUrl: null, releaseDate: null, genres: [] } as unknown as MediaEntity }),
      ],
    };

    const dashboard = await new CommunityService(repository as never).getDashboard({ q: '찾는' });

    assert.deepEqual(dashboard.feed.map((item) => item.id), ['match-media']);
    assert.ok(dashboard.feed.every((item) => !('likeCount' in item)));
    assert.ok(dashboard.feed.every((item) => !('bookmark' in item)));
  });
});
