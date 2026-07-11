import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateDiaryDto } from './dto/create-diary.dto';

describe('CreateDiaryDto', () => {
  it('accepts a valid diary creation payload', async () => {
    const dto = plainToInstance(CreateDiaryDto, {
      mediaId: '11111111-1111-4111-8111-111111111111',
      title: '묵직한 여운이 남은 작품',
      content: '장면마다 감정의 결이 좋았다.',
      watchedDate: '2026-05-05',
      rating: 4.5,
      visibility: 'PRIVATE',
      hasSpoiler: false,
    });

    const errors = await validate(dto);

    assert.equal(errors.length, 0);
  });

  it('accepts optional content and tags from the compose screen contract', async () => {
    const dto = plainToInstance(CreateDiaryDto, {
      mediaId: '11111111-1111-4111-8111-111111111111',
      title: '제목만 남긴 다이어리',
      content: '',
      watchedDate: '2026-05-05',
      rating: 0,
      visibility: 'PRIVATE',
      hasSpoiler: true,
      tags: ['극장', '재관람'],
    });

    const errors = await validate(dto);

    assert.equal(errors.length, 0);
  });

  it('rejects ratings outside 0 to 5 range', async () => {
    const dto = plainToInstance(CreateDiaryDto, {
      mediaId: '11111111-1111-4111-8111-111111111111',
      title: '평점 오류',
      content: '평점은 5점을 넘을 수 없다.',
      watchedDate: '2026-05-05',
      rating: 6,
      visibility: 'PRIVATE',
    });

    const errors = await validate(dto);

    assert.ok(errors.some((error) => error.property === 'rating'));
  });
  it('rejects a fabricated or malformed media id before persistence', async () => {
    const dto = plainToInstance(CreateDiaryDto, {
      mediaId: 'mock-inception',
      title: '잘못된 작품',
      watchedDate: '2026-05-05',
      rating: 4,
    });
    const errors = await validate(dto);
    assert.ok(errors.some((error) => error.property === 'mediaId'));
  });

  it('requires at least one target for SELECTED visibility', async () => {
    const dto = plainToInstance(CreateDiaryDto, {
      mediaId: '11111111-1111-4111-8111-111111111111',
      title: '선택 공개 기록',
      watchedDate: '2026-05-05',
      rating: 4,
      visibility: 'SELECTED',
      selectedUserIds: [],
    });
    const errors = await validate(dto);
    assert.ok(errors.some((error) => error.property === 'selectedUserIds'));
  });
});
