import assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { describe, it } from 'node:test';
import { UpdateDiaryDto } from './dto/update-diary.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
});

const metadata = {
  type: 'body' as const,
  metatype: UpdateDiaryDto,
  data: undefined,
};

describe('UpdateDiaryDto production pipe contract', () => {
  it('accepts the projected Web PATCH payload', async () => {
    const payload = {
      mediaId: 'ddcb649a-67fc-46b7-b70e-74137fd2b806',
      viewingMethod: 'OTT',
      watchedDate: '2026-07-25',
      rating: null,
      content: '',
      hasSpoiler: false,
      visibility: 'FRIENDS',
    };

    const value = await pipe.transform(payload, metadata);

    assert.ok(value instanceof UpdateDiaryDto);
    assert.deepEqual({ ...value }, payload);
  });

  it('continues to reject create-only and unknown PATCH fields', async () => {
    await assert.rejects(
      () =>
        pipe.transform(
          {
            content: '수정',
            clientRequestId: '2d1bd947-f493-433f-b72f-2d1ac566ea16',
            allowDuplicate: true,
          },
          metadata,
        ),
      (error: unknown) => {
        const response = (
          error as { getResponse?: () => { message?: string[] } }
        ).getResponse?.();
        assert.deepEqual(response?.message, [
          'property clientRequestId should not exist',
          'property allowDuplicate should not exist',
        ]);
        return true;
      },
    );
  });
});
