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

describe('Recommendations source retention policy', () => {
  it('retains implementation source without registering recommendation routes', () => {
    const appModuleSource = source('app.module.ts');
    const moduleSource = maybeSource('recommendations/recommendations.module.ts');
    const controllerSource = maybeSource('recommendations/recommendations.controller.ts');

    assert.doesNotMatch(appModuleSource, /RecommendationsModule/);
    assert.match(moduleSource, /RecommendationsController/);
    assert.match(moduleSource, /RecommendationsService/);
    assert.match(controllerSource, /@Controller\('recommendations'\)/);
  });

  it('preserves the disabled implementation for a future product decision', () => {
    const controllerSource = maybeSource('recommendations/recommendations.controller.ts');
    const serviceSource = maybeSource('recommendations/recommendations.service.ts');

    assert.match(controllerSource, /@Get\('trending'\)/);
    assert.match(controllerSource, /@Get\('genres'\)/);
    assert.match(controllerSource, /@Get\('today\/carousel'\)/);
    assert.match(serviceSource, /randomGenreRecommendations/);
  });
});
