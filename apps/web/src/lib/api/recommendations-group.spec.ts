import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import type { GroupRecommendationSessionRequest } from '@davas/shared';
import {
  createGroupRecommendationSession,
  getGroupRecommendationSession,
  submitGroupRecommendationFeedback,
} from './recommendations';

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
        session: {
          id: 'session-1',
          spaceId: 'space-1',
          requesterAccountId: 'account-1',
          participantAccountIds: ['account-1', 'account-2'],
          constraints: {},
          algorithmVersion: 'v1',
          status: 'OPEN',
        },
        items: [],
        emptyReason: 'NO_HARD_FILTER_MATCHES',
        feedback: {
          exposureId: 'exposure-1',
          kind: 'AVAILABILITY_ERROR',
          watchEventId: null,
        },
        consensus: {
          status: 'PENDING',
          interestedCount: 0,
          respondedCount: 1,
          requiredCount: 2,
          participantCount: 2,
        },
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

describe('group recommendation API wrapper', () => {
  it('posts the complete group request payload without private score fields', async () => {
    const request: GroupRecommendationSessionRequest = {
      spaceId: 'space-1',
      participantAccountIds: ['account-1', 'account-2', 'account-3'],
      region: 'KR',
      services: ['Netflix', 'TVING'],
      contentTypes: ['MOVIE', 'TV'],
      runtime: { minMinutes: 80, maxMinutes: 140 },
      moodTags: ['따뜻한'],
      avoidTags: ['공포'],
      rewatchPolicy: 'EXCLUDE' as const,
      decisionRule: 'MINIMUM' as const,
      minimumApprovals: 2,
    };

    await createGroupRecommendationSession(request);

    assert.equal(
      calls[0].url,
      'https://api.example.test/api/v1/recommendation-sessions',
    );
    assert.equal(calls[0].init.method, 'POST');
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), request);
    assert.equal(calls[0].init.credentials, 'include');
    assert.doesNotMatch(String(calls[0].init.body), /score|preference/i);
  });

  it('loads a session and submits availability-error feedback', async () => {
    await getGroupRecommendationSession('session / one');
    const response = await submitGroupRecommendationFeedback(
      'exposure / one',
      { kind: 'AVAILABILITY_ERROR' },
    );

    assert.deepEqual(
      calls.map(({ url, init }) => [url, init.method ?? 'GET']),
      [
        [
          'https://api.example.test/api/v1/recommendation-sessions/session%20%2F%20one',
          'GET',
        ],
        [
          'https://api.example.test/api/v1/recommendation-exposures/exposure%20%2F%20one/feedback',
          'POST',
        ],
      ],
    );
    assert.deepEqual(JSON.parse(String(calls[1].init.body)), {
      kind: 'AVAILABILITY_ERROR',
    });
    assert.equal(response.feedback.kind, 'AVAILABILITY_ERROR');
    assert.equal(response.consensus.respondedCount, 1);
  });
});
