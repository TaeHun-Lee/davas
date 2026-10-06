import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function mediaSource(path: string) {
  return readFileSync(join(process.cwd(), 'src/media', path), 'utf8');
}

function apiSource(path: string) {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}

const controller = mediaSource('media.controller.ts');
const dto = mediaSource('dto/media-selection.dto.ts');
const service = mediaSource('media-selection.service.ts');
const entity = apiSource('database/entities/media.entity.ts');
const migration = apiSource('database/migrations/1720670700000-MediaCanonicalIdentity.ts');
const appModule = apiSource('app.module.ts');

describe('media selection API trust boundary', () => {
  it('accepts only provider identity fields from the browser', () => {
    assert.match(controller, /@Post\('selections'\)/);
    assert.match(dto, /externalProvider/);
    assert.match(dto, /externalId/);
    assert.match(dto, /mediaType/);
    assert.doesNotMatch(dto, /title|posterUrl|backdropUrl|genreIds|overview/);
  });

  it('loads canonical metadata from TMDB before persistence', () => {
    assert.match(service, /tmdbClient\.detail/);
    assert.match(service, /detail\.title/);
    assert.doesNotMatch(service, /selection\.title|selection\.posterUrl/);
    assert.match(service, /detail\.externalId !== selection\.externalId/);
  });

  it('uses provider, external id, and media type as the database identity', () => {
    assert.match(
      entity,
      /@Index\(\['externalProvider', 'externalId', 'mediaType'\], \{ unique: true \}\)/,
    );
    assert.match(migration, /UQ_media_provider_id_type/);
    assert.match(migration, /external_provider/);
    assert.match(migration, /external_id/);
    assert.match(migration, /media_type/);
  });

  it('keeps legacy discovery source but does not expose its runtime modules', () => {
    assert.doesNotMatch(controller, /people\/search|people\/:personId\/credits/);
    assert.doesNotMatch(appModule, /RecommendationsModule|WatchlistModule/);
  });
});
