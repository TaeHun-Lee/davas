import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  acceptSpaceInvite,
  cancelSpaceInvite,
  closeSpace,
  createSpace,
  createSpaceInvite,
  getSpace,
  inspectSpaceInvite,
  leaveSpace,
  listSpaces,
  transferSpaceOwnership,
} from './spaces';

type FetchCall = { url: string; init: RequestInit };
const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
let calls: FetchCall[] = [];

beforeEach(() => {
  calls = [];
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/api/';
  globalThis.fetch = (async (input: URL | RequestInfo, init = {}) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined)
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
});

describe('spaces API wrapper', () => {
  it('uses the versioned list/detail/create contract and preserves multiple spaces', async () => {
    await listSpaces();
    await getSpace('space / one');
    await createSpace('주말 영화 모임', 4);

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        ['https://api.example.test/api/v1/spaces', 'GET'],
        ['https://api.example.test/api/v1/spaces/space%20%2F%20one', 'GET'],
        ['https://api.example.test/api/v1/spaces', 'POST'],
      ],
    );
    assert.deepEqual(JSON.parse(String(calls[2].init.body)), {
      name: '주말 영화 모임',
      maxMembers: 4,
    });
    assert.equal(calls.every((call) => call.init.credentials === 'include'), true);
  });

  it('maps invite, ownership, leave, and close actions without duplicating fetch behavior', async () => {
    await createSpaceInvite('space-id', 72);
    await inspectSpaceInvite('token / value');
    await acceptSpaceInvite('token / value');
    await cancelSpaceInvite('space-id', 'invite-id');
    await transferSpaceOwnership('space-id', 'member-id');
    await leaveSpace('space-id');
    await closeSpace('space-id');

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        ['https://api.example.test/api/v1/spaces/space-id/invites', 'POST'],
        ['https://api.example.test/api/v1/invites/token%20%2F%20value', 'GET'],
        ['https://api.example.test/api/v1/invites/token%20%2F%20value/accept', 'POST'],
        ['https://api.example.test/api/v1/spaces/space-id/invites/invite-id', 'DELETE'],
        ['https://api.example.test/api/v1/spaces/space-id/owner', 'PATCH'],
        ['https://api.example.test/api/v1/spaces/space-id/members/me', 'DELETE'],
        ['https://api.example.test/api/v1/spaces/space-id', 'DELETE'],
      ],
    );
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
      expiresInHours: 72,
    });
    assert.deepEqual(JSON.parse(String(calls[4].init.body)), {
      newOwnerAccountId: 'member-id',
    });
  });
});
