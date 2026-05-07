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
    assert.match(moduleSource, /TypeOrmModule\.forFeature\(\[MediaEntity\]\)/);
    assert.match(dtoSource, /externalProvider/);
    assert.match(dtoSource, /externalId/);
    assert.match(dtoSource, /mediaType/);
    assert.match(dtoSource, /posterUrl/);
    assert.match(dtoSource, /genreIds/);
  });
});
