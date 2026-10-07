import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { searchSnippet } from './record-search-model';

describe('record search snippet', () => {
  it('cuts the text around the words so they can be marked', () => {
    const snippet = searchSnippet(
      '영화 끝나고 근처 국밥집에서 팝콘 반반 먹은 얘기를 한참 했다. 다음엔 4DX로 보자고 약속했다.',
      '팝콘',
    );
    assert.equal(snippet.hit, '팝콘');
    assert.ok(snippet.before.startsWith('…'));
    assert.ok(snippet.after.endsWith('…'));
  });

  it('falls back to the start of the text when the words are not there as typed', () => {
    assert.deepEqual(searchSnippet('CGV 용산아이파크몰', 'cgv용산'), {
      before: 'CGV 용산아이파크몰',
      hit: '',
      after: '',
    });
  });
});
