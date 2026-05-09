import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaSelectionService } from './media-selection.service';

type SavedMedia = {
  id: string;
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: 'MOVIE' | 'TV';
  title: string;
  originalTitle: string | null;
  overview: string | null;
  shortPlot: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  country: string | null;
  runtime: number | null;
};

class FakeMediaRepository {
  records: SavedMedia[] = [];
  findCalls: Array<{ externalProvider: string; externalId: string }> = [];
  saveCalls: SavedMedia[] = [];

  async findOne(input: { where: { externalProvider: string; externalId: string } }) {
    this.findCalls.push(input.where);
    return this.records.find(
      (record) => record.externalProvider === input.where.externalProvider && record.externalId === input.where.externalId,
    ) ?? null;
  }

  create(input: Omit<SavedMedia, 'id'>) {
    return { id: `media-${this.records.length + 1}`, ...input };
  }

  async save(media: SavedMedia) {
    this.saveCalls.push(media);
    this.records.push(media);
    return media;
  }
}

const interstellarSelection = {
  externalProvider: 'TMDB' as const,
  externalId: '157336',
  mediaType: 'MOVIE' as const,
  title: '인터스텔라',
  originalTitle: 'Interstellar',
  overview: '우주를 향한 여정',
  posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/w780/backdrop.jpg',
  releaseDate: '2014-11-06',
  genreIds: [878, 18],
  country: 'US',
};

describe('MediaSelectionService', () => {
  it('upserts a selected TMDB search result and returns a reusable Davas media id', async () => {
    const repository = new FakeMediaRepository();
    const service = new MediaSelectionService(repository as never);

    const media = await service.select(interstellarSelection);

    assert.equal(media.id, 'media-1');
    assert.equal(media.externalProvider, 'TMDB');
    assert.equal(media.externalId, '157336');
    assert.equal(media.title, '인터스텔라');
    assert.equal(media.originalTitle, 'Interstellar');
    assert.equal(media.posterUrl, interstellarSelection.posterUrl);
    assert.deepEqual(media.genres, ['SF', '드라마']);
    assert.deepEqual(repository.findCalls[0], { externalProvider: 'TMDB', externalId: '157336' });
    assert.equal(repository.saveCalls.length, 1);
  });

  it('returns the existing media when the same TMDB result is selected again', async () => {
    const repository = new FakeMediaRepository();
    const service = new MediaSelectionService(repository as never);

    const first = await service.select(interstellarSelection);
    const second = await service.select(interstellarSelection);

    assert.equal(second.id, first.id);
    assert.equal(repository.saveCalls.length, 1);
  });
});
