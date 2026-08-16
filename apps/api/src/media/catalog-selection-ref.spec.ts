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
    const service = new MediaSelectionService(
      mediaRepository as never,
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
});
