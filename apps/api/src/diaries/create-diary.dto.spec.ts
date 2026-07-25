import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDiaryDto } from './dto/create-diary.dto';

const valid = {
  mediaId: '11111111-1111-4111-8111-111111111111',
  viewingMethod: 'OTT', watchedDate: '2026-05-05', visibility: 'FRIENDS',
  clientRequestId: '22222222-2222-4222-8222-222222222222',
};

describe('CreateDiaryDto core contract', () => {
  it('accepts the three required record fields with optional nullable rating and review', async () => {
    assert.equal((await validate(plainToInstance(CreateDiaryDto, valid))).length, 0);
    assert.equal((await validate(plainToInstance(CreateDiaryDto, { ...valid, rating: null, content: '' }))).length, 0);
    assert.equal((await validate(plainToInstance(CreateDiaryDto, { ...valid, rating: 5, content: '좋았어요.' }))).length, 0);
  });

  it('requires a viewing method and request UUID', async () => {
    const errors = await validate(plainToInstance(CreateDiaryDto, { ...valid, viewingMethod: undefined, clientRequestId: undefined }));
    assert.ok(errors.some((error) => error.property === 'viewingMethod'));
    assert.ok(errors.some((error) => error.property === 'clientRequestId'));
  });

  it('accepts only integer ratings from 1 to 5', async () => {
    for (const rating of [0, 4.5, 6]) {
      const errors = await validate(plainToInstance(CreateDiaryDto, { ...valid, rating }));
      assert.ok(errors.some((error) => error.property === 'rating'));
    }
  });

  it('rejects new SELECTED records and reviews over 500 characters', async () => {
    const errors = await validate(plainToInstance(CreateDiaryDto, { ...valid, visibility: 'SELECTED', content: 'a'.repeat(501) }));
    assert.ok(errors.some((error) => error.property === 'visibility'));
    assert.ok(errors.some((error) => error.property === 'content'));
  });

  it('rejects malformed internal media ids', async () => {
    const errors = await validate(plainToInstance(CreateDiaryDto, { ...valid, mediaId: 'mock-inception' }));
    assert.ok(errors.some((error) => error.property === 'mediaId'));
  });
});
