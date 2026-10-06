import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  recordListFailureMode,
  recordListRequestIsCurrent,
  recordListReturnTo,
} from './record-list-model';

describe('record list return context', () => {
  it('uses the feed and mine roots when no search filters are active', () => {
    assert.equal(recordListReturnTo('friends', {}), '/');
    assert.equal(recordListReturnTo('mine', {}), '/me');
  });

  it('preserves friends search query and filters', () => {
    assert.equal(
      recordListReturnTo('friends', {
        q: '봉준호 영화',
        mediaType: 'MOVIE',
        viewingMethod: 'THEATER',
      }),
      '/search?scope=friends&q=%EB%B4%89%EC%A4%80%ED%98%B8+%EC%98%81%ED%99%94&mediaType=MOVIE&viewingMethod=THEATER',
    );
  });

  it('preserves mine search context', () => {
    assert.equal(
      recordListReturnTo('mine', { q: '기생충' }),
      '/search?scope=mine&q=%EA%B8%B0%EC%83%9D%EC%B6%A9',
    );
  });

  it('rejects stale responses after scope or filter generation changes', () => {
    assert.equal(recordListRequestIsCurrent(4, 4), true);
    assert.equal(recordListRequestIsCurrent(3, 4), false);
  });

  it('keeps pagination failures non-fatal while initial failures replace the list', () => {
    assert.equal(recordListFailureMode(false), 'initial');
    assert.equal(recordListFailureMode(true), 'pagination');
  });
});
