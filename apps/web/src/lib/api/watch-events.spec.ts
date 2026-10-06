import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  compareSpaceReactions,
  createWatchComment,
  createWatchEvent,
  deleteWatchComment,
  deleteWatchEvent,
  getSpaceTimeline,
  getWatchEvent,
  listWatchComments,
  photoSrc,
  respondToWatchParticipation,
  saveWatchReaction,
  setReviewLike,
  updateWatchEvent,
} from './watch-events';

type FetchCall = { url: string; init: RequestInit };
const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
let calls: FetchCall[] = [];

beforeEach(() => {
  calls = [];
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/api/';
  globalThis.fetch = (async (input: URL | RequestInfo, init = {}) => {
    calls.push({ url: String(input), init });
    return new Response(
      JSON.stringify({
        watchEvent: { id: 'watch-1' },
        participant: {},
        reaction: {},
        items: [],
        hasMore: false,
        nextCursor: null,
        events: [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
});

describe('watch events API wrapper', () => {
  it('sends the explicit composer payload without inferring space history', async () => {
    await createWatchEvent({
      mediaId: 'media-1',
      watchedDate: '2026-08-16',
      source: {
        kind: 'OTT',
        providerName: 'Davas Play',
        placeText: '거실',
      },
      rating: 4.5,
      review: '각자의 반응을 남겨요.',
      spaceIds: ['space-1'],
      participantAccountIds: ['account-2'],
    });

    assert.equal(calls[0].url, 'https://api.example.test/api/v1/watch-events');
    assert.equal(calls[0].init.method, 'POST');
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
      mediaId: 'media-1',
      watchedDate: '2026-08-16',
      source: {
        kind: 'OTT',
        providerName: 'Davas Play',
        placeText: '거실',
      },
      rating: 4.5,
      review: '각자의 반응을 남겨요.',
      spaceIds: ['space-1'],
      participantAccountIds: ['account-2'],
    });
  });

  it('maps detail, edit, participation, reaction, timeline, comparison, and delete contracts', async () => {
    await getWatchEvent('watch / one');
    await updateWatchEvent('watch / one', { rating: 3.5, review: '수정' });
    await respondToWatchParticipation('watch / one', 'CONFIRMED');
    await saveWatchReaction('watch / one', { rating: 4, review: '내 리뷰' });
    await getSpaceTimeline('space / one', { cursor: 'cursor / one', limit: 10 });
    await compareSpaceReactions('space / one', 'media / one');
    await deleteWatchEvent('watch / one');

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        ['https://api.example.test/api/v1/watch-events/watch%20%2F%20one', 'GET'],
        ['https://api.example.test/api/v1/watch-events/watch%20%2F%20one', 'PATCH'],
        ['https://api.example.test/api/v1/watch-events/watch%20%2F%20one/participants/me', 'PATCH'],
        ['https://api.example.test/api/v1/watch-events/watch%20%2F%20one/reaction', 'PUT'],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/timeline?cursor=cursor+%2F+one&limit=10',
          'GET',
        ],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/titles/media%20%2F%20one/reactions',
          'GET',
        ],
        ['https://api.example.test/api/v1/watch-events/watch%20%2F%20one', 'DELETE'],
      ],
    );
    assert.deepEqual(JSON.parse(String(calls[2].init.body)), {
      status: 'CONFIRMED',
    });
    assert.deepEqual(JSON.parse(String(calls[3].init.body)), {
      rating: 4,
      review: '내 리뷰',
    });
    assert.equal(
      calls.every((call) => call.init.credentials === 'include'),
      true,
    );
  });

  it('maps review likes, record comments, and private photo paths', async () => {
    await setReviewLike('watch / one', 'reaction / one', true);
    await setReviewLike('watch / one', 'reaction / one', false);
    await listWatchComments('watch / one');
    await createWatchComment('watch / one', '다음엔 4DX로 보자');
    await deleteWatchComment('comment / one');

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        [
          'https://api.example.test/api/v1/watch-events/watch%20%2F%20one/reactions/reaction%20%2F%20one/like',
          'PUT',
        ],
        [
          'https://api.example.test/api/v1/watch-events/watch%20%2F%20one/reactions/reaction%20%2F%20one/like',
          'DELETE',
        ],
        ['https://api.example.test/api/diaries/watch%20%2F%20one/comments', 'GET'],
        ['https://api.example.test/api/diaries/watch%20%2F%20one/comments', 'POST'],
        ['https://api.example.test/api/comments/comment%20%2F%20one', 'DELETE'],
      ],
    );
    assert.deepEqual(JSON.parse(String(calls[3].init.body)), { content: '다음엔 4DX로 보자' });
    // Photos are served by the API behind the session cookie, never from public /uploads.
    assert.equal(
      photoSrc('/v1/watch-photos/photo-1/thumb'),
      'https://api.example.test/api/v1/watch-photos/photo-1/thumb',
    );
  });
});
