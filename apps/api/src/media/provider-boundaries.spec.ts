import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TmdbAvailabilityAdapter } from './adapters/tmdb-availability.adapter';
import { TmdbClient } from './tmdb.client';

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('provider boundaries', () => {
  it('maps actual Korean TMDB offers without inventing unavailable providers', async () => {
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      baseUrl: 'https://tmdb.test/3',
      fetcher: async () =>
        jsonResponse({
          results: {
            KR: {
              flatrate: [{ provider_name: 'Netflix' }],
              rent: [{ provider_name: 'Google Play Movies' }],
            },
          },
        }),
    });
    const adapter = new TmdbAvailabilityAdapter(client);

    const result = await adapter.getOffers(
      { provider: 'TMDB', externalId: '157336', mediaType: 'MOVIE' },
      'KR',
      new Date('2026-08-13T00:00:00.000Z'),
    );
    assert.equal(result.status, 'AVAILABLE');
    assert.deepEqual(result.offers, [
      { provider: 'Netflix', offerType: 'STREAM', confidence: 0.8 },
      { provider: 'Google Play Movies', offerType: 'RENT', confidence: 0.8 },
    ]);
    assert.equal('provider_name' in result.offers[0], false);
  });

  it('returns NO_OFFERS after a successful lookup with no Korean provider entry', async () => {
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async () => jsonResponse({ results: { US: {} } }),
    });
    const result = await new TmdbAvailabilityAdapter(client).getOffers(
      { provider: 'TMDB', externalId: '157336', mediaType: 'MOVIE' },
      'KR',
      new Date(),
    );

    assert.equal(result.status, 'NO_OFFERS');
    assert.deepEqual(result.offers, []);
  });
});
