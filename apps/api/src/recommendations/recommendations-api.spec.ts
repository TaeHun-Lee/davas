import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(relativePath: string) {
  return readFileSync(join(process.cwd(), 'src', relativePath), 'utf8');
}

function maybeSource(relativePath: string) {
  const path = join(process.cwd(), 'src', relativePath);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

describe('Recommendations API contract', () => {
  it('registers a dedicated recommendations module and controller outside the media catch-all routes', () => {
    const appModuleSource = source('app.module.ts');
    const moduleSource = maybeSource('recommendations/recommendations.module.ts');
    const controllerSource = maybeSource('recommendations/recommendations.controller.ts');

    assert.match(appModuleSource, /RecommendationsModule/);
    assert.match(moduleSource, /RecommendationsController/);
    assert.match(moduleSource, /RecommendationsService/);
    assert.match(controllerSource, /@Controller\('recommendations'\)/);
  });

  it('exposes trending, genre preset, and today recommendation endpoints', () => {
    const controllerSource = maybeSource('recommendations/recommendations.controller.ts');

    assert.match(controllerSource, /@Get\('trending'\)/);
    assert.match(controllerSource, /recommendationsService\.trending/);
    assert.match(controllerSource, /@Get\('genres'\)/);
    assert.match(controllerSource, /recommendationsService\.genrePresets/);
    assert.match(controllerSource, /@Get\('genres\/:presetId'\)/);
    assert.match(controllerSource, /recommendationsService\.genreRecommendations/);
    assert.match(controllerSource, /@Get\('today'\)/);
    assert.match(controllerSource, /recommendationsService\.today/);
  });
});
