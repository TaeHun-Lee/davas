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

describe('Media selection API contract', () => {
  it('exposes POST /api/media/selections through a dedicated selection DTO and service', () => {
    assert.match(controllerSource, /@Post\('selections'\)/);
    assert.match(controllerSource, /MediaSelectionDto/);
    assert.match(controllerSource, /mediaSelectionService\.select/);
    assert.match(moduleSource, /MediaSelectionService/);
    assert.match(moduleSource, /TypeOrmModule\.forFeature\(\[MediaEntity, DiaryEntity, MediaFavoriteEntity\]\)/);
    assert.match(dtoSource, /externalProvider/);
    assert.match(dtoSource, /externalId/);
    assert.match(dtoSource, /mediaType/);
    assert.match(dtoSource, /posterUrl/);
    assert.match(dtoSource, /genreIds/);
  });

  it('exposes actor search and actor credits before the catch-all media detail route', () => {
    assert.match(controllerSource, /@Get\('people\/search'\)/);
    assert.match(controllerSource, /@Get\('people\/:personId\/credits'\)/);
    assert.match(controllerSource, /mediaService\.searchPeople/);
    assert.match(controllerSource, /mediaService\.findPersonCredits/);

    assert.ok(
      controllerSource.indexOf("@Get('people/search')") < controllerSource.indexOf("@Get(':id')"),
      'people search route must be declared before @Get(:id)',
    );
    assert.ok(
      controllerSource.indexOf("@Get('people/:personId/credits')") < controllerSource.indexOf("@Get(':id')"),
      'person credits route must be declared before @Get(:id)',
    );
  });

  it('exposes authenticated favorite media list before the catch-all media detail route', () => {
    assert.match(controllerSource, /@Get\('favorites'\)/);
    assert.match(controllerSource, /mediaService\.findFavorites\(await this\.getUserId\(request\)\)/);
    assert.ok(
      controllerSource.indexOf("@Get('favorites')") < controllerSource.indexOf("@Get(':id')"),
      'favorite list route must be declared before @Get(:id)',
    );
  });
});
