import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { getWishStatus, listWishes, pickWish, setWish } from './wishes';

type FetchCall = { url: string; init: RequestInit };
const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
let calls: FetchCall[] = [];

beforeEach(() => {
  calls = [];
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/api/';
  globalThis.fetch = (async (input: URL | RequestInfo, init = {}) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ items: [], item: null, reasons: [], remaining: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
});

describe('space wishes API wrapper', () => {
  it('maps list, pick, status, add, and remove to the space-scoped routes', async () => {
    await listWishes('space / one');
    await pickWish('space / one', { mood: 'CHILLS', exclude: ['a', 'b'] });
    await pickWish('space / one');
    await getWishStatus('space / one', 'media / one');
    await setWish('space / one', 'media / one', true);
    await setWish('space / one', 'media / one', false);

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        ['https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes', 'GET'],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes/pick?mood=CHILLS&exclude=a%2Cb',
          'GET',
        ],
        ['https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes/pick', 'GET'],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes/media%20%2F%20one',
          'GET',
        ],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes/media%20%2F%20one',
          'PUT',
        ],
        [
          'https://api.example.test/api/v1/spaces/space%20%2F%20one/wishes/media%20%2F%20one',
          'DELETE',
        ],
      ],
    );
    assert.equal(
      calls.every((call) => call.init.credentials === 'include'),
      true,
    );
  });
});
