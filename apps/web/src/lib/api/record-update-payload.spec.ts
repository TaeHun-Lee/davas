import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toRecordUpdatePayload, type RecordUpdatePayload } from './core';

describe('record edit payload', () => {
  it('sends only fields UpdateDiaryDto accepts', () => {
    const draft = {
      mediaId: 'media-1',
      rating: null,
      content: 'again',
      visibility: 'FRIENDS',
      clientRequestId: 'create-only',
      allowDuplicate: true,
      spaceIds: ['space-1'],
    } as unknown as RecordUpdatePayload;

    assert.deepEqual(toRecordUpdatePayload(draft), {
      mediaId: 'media-1',
      rating: null,
      content: 'again',
      visibility: 'FRIENDS',
    });
  });

  it('omits undefined fields so a partial edit stays partial', () => {
    assert.deepEqual(toRecordUpdatePayload({ visibility: undefined, content: 'x' }), {
      content: 'x',
    });
  });
});
