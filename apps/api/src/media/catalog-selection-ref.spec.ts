import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaSelectionService } from './media-selection.service';

const selection = {
  externalProvider: 'TMDB' as const,
  externalId: '157336',
  mediaType: 'MOVIE' as const,
  title: 'Interstellar',
  originalTitle: 'Interstellar',
  overview: 'Space exploration',
  posterUrl: null,
  backdropUrl: null,
  releaseDate: '2014-11-05',
  genreIds: [878],
  country: 'US',
};

describe('canonical media selection', () => {
  it('keeps the media id canonical and records provider provenance separately', async () => {
    const mediaRecords: Array<Record<string, unknown>> = [];
    const refRecords: Array<Record<string, unknown>> = [];
    const mediaRepository = {
      findOne: async () => null,
      create: (input: Record<string, unknown>) => ({
        id: 'content-1',
        ...input,
      }),
      save: async (input: Record<string, unknown>) => {
        mediaRecords.push(input);
        return input;
      },
    };
    const refRepository = {
      findOne: async () => null,
      create: (input: Record<string, unknown>) => ({ id: 'ref-1', ...input }),
      save: async (input: Record<string, unknown>) => {
        refRecords.push(input);
        return input;
      },
    };
    const tmdbClient = {
      detail: async () => ({
        ...selection,
        tagline: null,
        genres: ['SF'],
        countries: ['US'],
        runtime: 169,
        tmdbRating: 8.4,
        tmdbVoteCount: 1,
        director: null,
        creators: [],
        cast: [],
        certification: null,
      }),
    };
    const service = new MediaSelectionService(
      mediaRepository as never,
      tmdbClient as never,
      refRepository as never,
    );

    const result = await service.select(selection);
    assert.equal(result.id, 'content-1');
    assert.equal(mediaRecords.length, 1);
    assert.equal(refRecords.length, 1);
    assert.deepEqual(
      {
        contentId: refRecords[0].contentId,
        provider: refRecords[0].provider,
        externalId: refRecords[0].externalId,
        source: refRecords[0].source,
      },
      {
        contentId: 'content-1',
        provider: 'TMDB',
        externalId: '157336',
        source: 'TMDB',
      },
    );
    assert.ok(refRecords[0].lastSyncedAt instanceof Date);
  });

  it('gives a series its own provider link when a movie already uses the same TMDB id', async () => {
    const refs: Array<Record<string, unknown>> = [
      {
        id: 'ref-movie',
        contentId: 'movie-1',
        provider: 'TMDB',
        mediaType: 'MOVIE',
        externalId: '157336',
      },
    ];
    const refRepository = {
      findOne: async ({ where }: { where: Record<string, unknown> }) =>
        refs.find((ref) => Object.entries(where).every(([key, value]) => ref[key] === value)) ??
        null,
      create: (input: Record<string, unknown>) => ({ id: `ref-${refs.length + 1}`, ...input }),
      save: async (input: Record<string, unknown>) => {
        if (!refs.includes(input)) refs.push(input);
        return input;
      },
    };
    const series = { ...selection, mediaType: 'TV' as const };
    const service = new MediaSelectionService(
      {
        findOne: async () => null,
        create: (input: Record<string, unknown>) => ({ id: 'series-1', ...input }),
        save: async (input: Record<string, unknown>) => input,
      } as never,
      {
        detail: async () => ({
          ...series,
          tagline: null,
          genres: [],
          countries: [],
          runtime: null,
          tmdbRating: null,
          tmdbVoteCount: null,
          director: null,
          creators: [],
          cast: [],
          certification: null,
        }),
      } as never,
      refRepository as never,
    );

    await service.select(series);
    assert.equal(refs.length, 2);
    assert.deepEqual(
      {
        contentId: refs[1].contentId,
        mediaType: refs[1].mediaType,
        externalId: refs[1].externalId,
      },
      { contentId: 'series-1', mediaType: 'TV', externalId: '157336' },
    );
    assert.equal(refs[0].contentId, 'movie-1');
  });
});
