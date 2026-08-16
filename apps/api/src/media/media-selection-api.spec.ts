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
      'MediaFavoriteEntity',
      'WatchlistItemEntity',
      'ExternalContentRefEntity',
      'AvailabilityObservationEntity',
    ]) {
      assert.match(moduleSource, new RegExp(entity));
    }
    assert.match(dtoSource, /externalProvider/);
    assert.match(dtoSource, /externalId/);
    assert.match(dtoSource, /mediaType/);
    assert.match(dtoSource, /posterUrl/);
    assert.match(dtoSource, /genreIds/);
  });

  it('exposes Korean availability lookup and explicit refresh before the catch-all detail route', () => {
    assert.match(controllerSource, /@Get\(':id\/availability'\)/);
    assert.match(controllerSource, /@Post\(':id\/availability\/refresh'\)/);
    assert.match(controllerSource, /availabilityService/);
    assert.match(availabilityDtoSource, /region/);
    assert.match(availabilityDtoSource, /default: 'KR'/);
    assert.match(moduleSource, /METADATA_PROVIDER/);
    assert.match(moduleSource, /AVAILABILITY_PROVIDER/);

    assert.ok(
      controllerSource.indexOf("@Get(':id/availability')") <
        controllerSource.indexOf("@Get(':id')"),
      'availability routes must be declared before @Get(:id)',
    );
  });

  it('exposes actor search and actor credits before the catch-all media detail route', () => {
    assert.match(controllerSource, /@Get\('people\/search'\)/);
    assert.match(controllerSource, /@Get\('people\/:personId\/credits'\)/);
    assert.match(controllerSource, /mediaService\.searchPeople/);
    assert.match(controllerSource, /mediaService\.findPersonCredits/);

    assert.ok(
      controllerSource.indexOf("@Get('people/search')") <
        controllerSource.indexOf("@Get(':id')"),
      'people search route must be declared before @Get(:id)',
    );
    assert.ok(
      controllerSource.indexOf("@Get('people/:personId/credits')") <
        controllerSource.indexOf("@Get(':id')"),
      'person credits route must be declared before @Get(:id)',
    );
  });

  it('removes legacy favorite mutations and exposes watchlist as the single planning contract', () => {
    assert.doesNotMatch(
      controllerSource,
      /favorites|:id\/favorite|toggleFavorite|findFavorites/,
    );
    assert.match(watchlistControllerSource, /@Controller\('watchlist'\)/);
    assert.match(watchlistControllerSource, /CreateWatchlistDto/);
    assert.match(watchlistControllerSource, /UpdateWatchlistDto/);
  });
});
