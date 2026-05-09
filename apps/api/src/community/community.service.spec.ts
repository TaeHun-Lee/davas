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

  it('filters topic clicks by persisted media genres instead of text search only', async () => {
    const repository: FakeRepository = {
      find: async () => [
        makeDiary({ id: 'genre-match', title: '북유럽 가족 이야기', content: '장르 단어 없는 본문', media: { id: 'media-genre', title: '센티멘탈 밸류', posterUrl: null, releaseDate: null, genres: ['18'] } as MediaEntity }),
        makeDiary({ id: 'text-only', title: '드라마라는 단어만 있는 기록', content: '하지만 장르는 SF', media: { id: 'media-sf', title: '우주 영화', posterUrl: null, releaseDate: null, genres: ['878'] } as MediaEntity }),
      ],
    };

    const dashboard = await new CommunityService(repository as never).getDashboard({ topic: '드라마' });

    assert.deepEqual(dashboard.feed.map((item) => item.id), ['genre-match']);
    assert.equal(dashboard.topic, '드라마');
  });

  it('marks spoiler public diaries so cards can hide previews before reveal', async () => {
    const repository: FakeRepository = {
      find: async () => [makeDiary({ id: 'spoiler-card', hasSpoiler: true, content: '범인의 정체를 적은 본문입니다.' })],
    };

    const dashboard = await new CommunityService(repository as never).getDashboard();

    assert.equal(dashboard.feed[0]?.hasSpoiler, true);
  });

  it('loads a public community diary detail without exposing private rows', async () => {
    let findOneOptions: unknown;
    const repository = {
      find: async () => [],
      findOne: async (options: unknown) => {
        findOneOptions = options;
        return makeDiary({ id: 'public-detail', title: '공개 상세 기록', content: '공개 다이어리 전문입니다.' });
      },
    };

    const detail = await new CommunityService(repository as never).getPublicDiary('public-detail');

    assert.deepEqual(findOneOptions, {
      where: { id: 'public-detail', visibility: 'PUBLIC' },
      relations: { media: true, user: true, comments: true },
    });
    assert.equal(detail.id, 'public-detail');
    assert.equal(detail.content, '공개 다이어리 전문입니다.');
    assert.equal(detail.commentCount, 2);
    assert.ok(!('likeCount' in detail));
  });

  it('builds the following tab from persisted follow relationships for the authenticated user', async () => {
    const repository: FakeRepository = {
      find: async () => [
        makeDiary({ id: 'followed-author-diary', userId: 'author-followed', user: { id: 'author-followed', nickname: '팔로우작가', profileImageUrl: null } as UserEntity }),
        makeDiary({ id: 'other-author-diary', userId: 'author-other', user: { id: 'author-other', nickname: '다른작가', profileImageUrl: null } as UserEntity }),
      ],
    };
    const follows = {
      find: async () => [{ followingId: 'author-followed' }],
    };

    const dashboard = await new CommunityService(repository as never, follows as never).getDashboard({ tab: 'following', userId: 'viewer-1' });

    assert.deepEqual(dashboard.feed.map((item) => item.id), ['followed-author-diary']);
    assert.equal(dashboard.feed[0]?.author.isFollowed, true);
  });

  it('follows and unfollows public diary authors without allowing self-follow', async () => {
    const repository = {
      find: async () => [],
      findOne: async () => makeDiary({ userId: 'author-1', user: { id: 'author-1', nickname: '작성자', profileImageUrl: null } as UserEntity }),
    };
    const calls: Array<{ method: string; input: unknown }> = [];
    const follows = {
      find: async () => [],
      findOne: async () => null,
      create: (input: unknown) => {
        calls.push({ method: 'create', input });
        return input;
      },
      save: async (input: unknown) => {
        calls.push({ method: 'save', input });
        return input;
      },
      delete: async (input: unknown) => {
        calls.push({ method: 'delete', input });
        return { affected: 1 };
      },
    };
    const service = new CommunityService(repository as never, follows as never);

    const followed = await service.followDiaryAuthor('diary-1', 'viewer-1');
    const unfollowed = await service.unfollowDiaryAuthor('diary-1', 'viewer-1');

    assert.deepEqual(followed, { followingId: 'author-1', isFollowed: true });
    assert.deepEqual(unfollowed, { followingId: 'author-1', isFollowed: false });
    assert.deepEqual(calls.map((call) => call.method), ['create', 'save', 'delete']);
    await assert.rejects(() => new CommunityService({ find: async () => [], findOne: async () => makeDiary({ userId: 'viewer-1' }) } as never, follows as never).followDiaryAuthor('mine', 'viewer-1'));
  });
});
