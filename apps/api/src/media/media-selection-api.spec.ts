import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src/media', path), 'utf8');
}

const controllerSource = source('media.controller.ts');
const moduleSource = source('media.module.ts');
const dtoSource = source('dto/media-selection.dto.ts');
const availabilityDtoSource = source('dto/availability-query.dto.ts');
const selectionServiceSource = source('media-selection.service.ts');
const entitySource = readFileSync(
  join(process.cwd(), 'src/database/entities/media.entity.ts'),
  'utf8',
);
const canonicalMigrationSource = readFileSync(
  join(process.cwd(), 'src/database/migrations/1720670700000-MediaCanonicalIdentity.ts'),
  'utf8',
);
const watchlistControllerSource = readFileSync(
  join(process.cwd(), 'src/watchlist/watchlist.controller.ts'),
  'utf8',
);

describe('Media selection API contract', () => {
  it('exposes POST /api/media/selections through a dedicated selection DTO and service', () => {
    assert.match(controllerSource, /@Post\('selections'\)/);
    assert.match(controllerSource, /MediaSelectionDto/);
    assert.match(controllerSource, /mediaSelectionService\.select/);
    assert.match(moduleSource, /MediaSelectionService/);
    for (const entity of [
      'MediaEntity',
      'DiaryEntity',
      'WatchlistItemEntity',
      'ExternalContentRefEntity',
      'AvailabilityObservationEntity',
    ]) {
      assert.match(moduleSource, new RegExp(entity));
    }
  });

  it('accepts only provider identity fields from the browser', () => {
    assert.match(dtoSource, /externalProvider/);
    assert.match(dtoSource, /externalId/);
    assert.match(dtoSource, /mediaType/);
    assert.doesNotMatch(dtoSource, /title|posterUrl|backdropUrl|genreIds|overview/);
  });

  it('loads canonical metadata from TMDB before persistence', () => {
    assert.match(selectionServiceSource, /tmdbClient\.detail/);
    assert.match(selectionServiceSource, /detail\.title/);
    assert.doesNotMatch(selectionServiceSource, /selection\.title|selection\.posterUrl/);
    assert.match(selectionServiceSource, /detail\.externalId !== selection\.externalId/);
  });

  it('uses provider, external id, and media type as the database identity', () => {
    assert.match(
      entitySource,
      /@Index\(\['externalProvider', 'externalId', 'mediaType'\], \{ unique: true \}\)/,
    );
    assert.match(canonicalMigrationSource, /UQ_media_provider_id_type/);
  });

  it('exposes Korean availability lookup and explicit refresh before the catch-all detail route', () => {
    assert.match(controllerSource, /@Get\(':id\/availability'\)/);
    assert.match(controllerSource, /@Post\(':id\/availability\/refresh'\)/);
    assert.match(controllerSource, /availabilityService/);
    assert.match(availabilityDtoSource, /region/);
    assert.match(availabilityDtoSource, /default: 'KR'/);
    assert.match(moduleSource, /AVAILABILITY_PROVIDER/);
    // Title search and detail call TmdbClient directly; there is no second metadata path.
    assert.doesNotMatch(moduleSource, /METADATA_PROVIDER/);

    assert.ok(
      controllerSource.indexOf("@Get(':id/availability')") <
        controllerSource.indexOf("@Get(':id')"),
      'availability routes must be declared before @Get(:id)',
    );
  });

  it('removes legacy favorite mutations and exposes watchlist as the single planning contract', () => {
    assert.doesNotMatch(controllerSource, /favorites|:id\/favorite|toggleFavorite|findFavorites/);
    assert.match(watchlistControllerSource, /@Controller\('watchlist'\)/);
    assert.match(watchlistControllerSource, /CreateWatchlistDto/);
    // The title sheet only adds and removes; nothing lists or edits the old planning fields.
    assert.doesNotMatch(watchlistControllerSource, /@Get\(|@Patch\(|complete/);
  });
});
