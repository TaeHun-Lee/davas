import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import type {
  AccountDeletionResponse,
  FriendshipMutationResponse,
  MediaSelectionResponse,
  MediaSearchResult,
} from '@davas/shared';
import { acceptFriend, rejectFriend, requestFriend } from './friends';
import { selectMedia } from './media';
import { deleteMe } from './users';

const originalFetch = globalThis.fetch;

const searchResult: MediaSearchResult = {
  externalProvider: 'TMDB',
  externalId: '157336',
  mediaType: 'MOVIE',
  title: '인터스텔라',
  originalTitle: 'Interstellar',
  overview: '검색 결과',
  posterUrl: null,
  backdropUrl: null,
  releaseDate: '2014-11-06',
  genreIds: [878],
  country: 'US',
};

const selectedResponse = {
  id: 'media-1',
  externalProvider: 'TMDB' as const,
  externalId: '157336',
  mediaType: 'MOVIE' as const,
  title: '인터스텔라',
  originalTitle: null,
  overview: null,
  shortPlot: null,
  posterUrl: null,
  backdropUrl: null,
  tagline: null,
  releaseDate: '2014-11-06',
  genres: ['SF'],
  country: 'US',
  countries: ['US'],
  runtime: 169,
  tmdbRating: '8.7',
  tmdbVoteCount: 100,
  director: 'Christopher Nolan',
  creators: [],
  cast: [],
  certification: '12',
  createdAt: '2026-07-27T00:00:00.000Z',
  updatedAt: '2026-07-27T00:00:00.000Z',
};

const friendshipResponse = {
  id: 'friendship-1',
  pairKey: 'requester-1:receiver-1',
  requesterId: 'requester-1',
  receiverId: 'receiver-1',
  status: 'PENDING' as const,
  createdAt: '2026-07-27T00:00:00.000Z',
  updatedAt: '2026-07-27T00:00:00.000Z',
};

describe('active Web response contracts', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  it('uses the canonical media selection response without merging search-only fields', async () => {
    let requestBody: unknown;
    globalThis.fetch = async (_input, init) => {
      requestBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(selectedResponse), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const selected: MediaSelectionResponse = await selectMedia(searchResult);

    assert.deepEqual(requestBody, {
      externalProvider: 'TMDB',
      externalId: '157336',
      mediaType: 'MOVIE',
    });
    assert.deepEqual(selected, selectedResponse);
    assert.equal(selected.originalTitle, null);
    assert.deepEqual(selected.genres, ['SF']);
    assert.equal('genreIds' in selected, false);
  });

  it('types create, accept, and reject as friendship mutation entities', async () => {
    const statuses = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;
    let requestIndex = 0;
    globalThis.fetch = async () => {
      const response = { ...friendshipResponse, status: statuses[requestIndex] };
      requestIndex += 1;
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const created: FriendshipMutationResponse = await requestFriend('receiver-1');
    const accepted: FriendshipMutationResponse = await acceptFriend('friendship-1');
    const rejected: FriendshipMutationResponse = await rejectFriend('friendship-1');

    assert.equal(created.requesterId, 'requester-1');
    assert.equal(accepted.status, 'ACCEPTED');
    assert.equal(rejected.status, 'REJECTED');
  });

  it('models account deletion as a 204 no-content response', async () => {
    globalThis.fetch = async () => new Response(null, { status: 204 });

    const deleted: AccountDeletionResponse = await deleteMe('correct-password');

    assert.equal(deleted, undefined);

    const usersSource = readFileSync(join(process.cwd(), 'src/lib/api/users.ts'), 'utf8');
    const coreSource = readFileSync(join(process.cwd(), 'src/lib/api/core.ts'), 'utf8');
    assert.match(usersSource, /Promise<AccountDeletionResponse>/);
    assert.doesNotMatch(coreSource, /undefined as T/);
  });
});
