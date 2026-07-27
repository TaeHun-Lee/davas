import assert from 'node:assert/strict';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, it } from 'node:test';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { MediaSelectionService } from './media-selection.service';

const canonicalDetail = {
  externalProvider: 'TMDB' as const,
  externalId: '157336',
  mediaType: 'MOVIE' as const,
  title: '인터스텔라',
  originalTitle: 'Interstellar',
  overview: '우주를 향한 여정',
  tagline: '인류의 미래를 찾아서',
  posterUrl: 'https://image.tmdb.org/t/p/w500/canonical.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/w780/canonical.jpg',
  releaseDate: '2014-11-06',
  runtime: 169,
  genres: ['SF', '드라마'],
  country: 'US',
  countries: ['US'],
  tmdbRating: 8.7,
  tmdbVoteCount: 100,
  director: 'Christopher Nolan',
  creators: [],
  numberOfEpisodes: null,
  numberOfSeasons: null,
  cast: ['Matthew McConaughey'],
  stillCuts: [],
  certification: '12',
};

type SavedMedia = Omit<typeof canonicalDetail, 'tmdbRating'> & {
  id: string;
  shortPlot: string | null;
  tmdbRating: string | null;
};

class FakeMediaRepository {
  records: SavedMedia[] = [];
  findCalls: Array<{
    externalProvider: string;
    externalId: string;
    mediaType: string;
  }> = [];
  saveCalls: SavedMedia[] = [];

  async findOne(input: {
    where: {
      externalProvider: string;
      externalId: string;
      mediaType: string;
    };
  }) {
    this.findCalls.push(input.where);
    return (
      this.records.find(
        (record) =>
          record.externalProvider === input.where.externalProvider &&
          record.externalId === input.where.externalId &&
          record.mediaType === input.where.mediaType,
      ) ?? null
    );
  }

  create(input: Omit<SavedMedia, 'id' | 'numberOfEpisodes' | 'numberOfSeasons' | 'stillCuts'>) {
    return {
      id: `media-${this.records.length + 1}`,
      numberOfEpisodes: null,
      numberOfSeasons: null,
      stillCuts: [],
      ...input,
    };
  }

  async save(media: SavedMedia) {
    this.saveCalls.push(media);
    this.records.push(media);
    return media;
  }
}

class FakeTmdbClient {
  calls: Array<{ externalId: string; mediaType: 'MOVIE' | 'TV' }> = [];
  detailResponse = canonicalDetail;

  async detail(input: { externalId: string; mediaType: 'MOVIE' | 'TV' }) {
    this.calls.push(input);
    return { ...this.detailResponse, externalId: input.externalId, mediaType: input.mediaType };
  }
}

const selection = {
  externalProvider: 'TMDB' as const,
  externalId: '157336',
  mediaType: 'MOVIE' as const,
};

describe('MediaSelectionService canonical trust boundary', () => {
  it('rejects client-supplied metadata at the DTO whitelist boundary', async () => {
    const dto = plainToInstance(MediaSelectionDto, {
      ...selection,
      title: '공격자가 바꾼 제목',
      posterUrl: 'https://attacker.invalid/poster.jpg',
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    assert.ok(errors.some((error) => error.property === 'title'));
    assert.ok(errors.some((error) => error.property === 'posterUrl'));
  });

  it('persists only canonical TMDB detail fields', async () => {
    const repository = new FakeMediaRepository();
    const tmdb = new FakeTmdbClient();
    const service = new MediaSelectionService(repository as never, tmdb as never);

    const media = await service.select(selection);

    assert.equal(media.title, canonicalDetail.title);
    assert.equal(media.posterUrl, canonicalDetail.posterUrl);
    assert.deepEqual(media.genres, canonicalDetail.genres);
    assert.deepEqual(tmdb.calls, [{ externalId: '157336', mediaType: 'MOVIE', language: 'ko-KR' }]);
    assert.deepEqual(repository.findCalls[0], {
      externalProvider: 'TMDB',
      externalId: '157336',
      mediaType: 'MOVIE',
    });
    assert.equal(repository.saveCalls.length, 1);
  });

  it('rehydrates an existing legacy row from TMDB before returning it', async () => {
    const repository = new FakeMediaRepository();
    repository.records.push({
      ...canonicalDetail,
      id: 'legacy-media',
      title: 'attacker-controlled title',
      posterUrl: 'https://attacker.invalid/poster.jpg',
      backdropUrl: 'https://attacker.invalid/backdrop.jpg',
      shortPlot: 'attacker-controlled plot',
      tmdbRating: '1.0',
    });
    const tmdb = new FakeTmdbClient();
    const service = new MediaSelectionService(repository as never, tmdb as never);

    const media = await service.select(selection);

    assert.equal(media.id, 'legacy-media');
    assert.equal(media.title, canonicalDetail.title);
    assert.equal(media.posterUrl, canonicalDetail.posterUrl);
    assert.equal(media.backdropUrl, canonicalDetail.backdropUrl);
    assert.equal(tmdb.calls.length, 1);
    assert.equal(repository.saveCalls.length, 1);
  });

  it('treats the same TMDB number as separate MOVIE and TV identities', async () => {
    const repository = new FakeMediaRepository();
    const tmdb = new FakeTmdbClient();
    const service = new MediaSelectionService(repository as never, tmdb as never);

    const movie = await service.select(selection);
    const tv = await service.select({ ...selection, mediaType: 'TV' });

    assert.notEqual(movie.id, tv.id);
    assert.equal(repository.saveCalls.length, 2);
  });
});
