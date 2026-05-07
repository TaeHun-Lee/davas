import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaService } from './media.service';

class FakeTmdbClient {
  calls: Array<{ query: string; type: 'movie' | 'tv' | 'multi'; page: number }> = [];

  async search(input: { query: string; type: 'movie' | 'tv' | 'multi'; page: number }) {
    this.calls.push(input);
    return {
      query: input.query,
      page: input.page,
      totalPages: 1,
      items: [
        {
          externalProvider: 'TMDB' as const,
          externalId: input.query === '인터스텔라' ? '157336' : '550',
          mediaType: 'MOVIE' as const,
          title: input.query,
          originalTitle: input.query,
          overview: 'overview',
          posterUrl: null,
          backdropUrl: null,
          releaseDate: '2014-11-06',
          genreIds: [],
          country: 'US',
        },
      ],
    };
  }
}

describe('MediaService search', () => {
  it('passes Korean and English queries through to the TMDB client without ASCII-only normalization', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(tmdbClient as never);

    const korean = await service.search({ query: '인터스텔라', type: 'multi', page: 1 });
    const english = await service.search({ query: 'Interstellar', type: 'multi', page: 1 });

    assert.equal(korean.items[0].title, '인터스텔라');
    assert.equal(english.items[0].title, 'Interstellar');
    assert.deepEqual(tmdbClient.calls.map((call) => call.query), ['인터스텔라', 'Interstellar']);
  });

  it('trims query and applies default type/page values', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(tmdbClient as never);

    await service.search({ query: '  Arrival  ' });

    assert.deepEqual(tmdbClient.calls[0], { query: 'Arrival', type: 'multi', page: 1, language: 'ko-KR', region: 'KR' });
  });
});
