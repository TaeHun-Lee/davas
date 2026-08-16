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

  it('exposes multi-item today and random genre endpoints for the explore carousel', () => {
    const controllerSource = maybeSource('recommendations/recommendations.controller.ts');
    const serviceSource = maybeSource('recommendations/recommendations.service.ts');

    assert.match(controllerSource, /@Get\('today\/carousel'\)/);
    assert.match(controllerSource, /recommendationsService\.todayCarousel/);
    assert.match(controllerSource, /@Get\('genres\/random'\)/);
    assert.match(controllerSource, /recommendationsService\.randomGenreRecommendations/);
    assert.match(serviceSource, /Promise<\{ items: MediaRecommendationItem\[\] \}>/);
  });

  it('adds authenticated group session, session-read, and feedback routes without changing legacy routes', () => {
    const moduleSource = source('recommendations/recommendations.module.ts');
    const controllerSource = source(
      'recommendations/group-recommendations.controller.ts',
    );

    assert.match(moduleSource, /RecommendationsController/);
    assert.match(moduleSource, /GroupRecommendationsController/);
    assert.match(moduleSource, /RecommendationsService/);
    assert.match(moduleSource, /GroupRecommendationsService/);
    assert.match(controllerSource, /@Post\('recommendation-sessions'\)/);
    assert.match(controllerSource, /@Get\('recommendation-sessions\/:sessionId'\)/);
    assert.match(
      controllerSource,
      /@Post\('recommendation-exposures\/:exposureId\/feedback'\)/,
    );
    assert.match(controllerSource, /this\.auth\.findMe/);
  });

  it('keeps private score fields out of the group recommendation wire response', () => {
    const serviceSource = source(
      'recommendations/group-recommendations.service.ts',
    );
    const sessionView = serviceSource.slice(
      serviceSource.indexOf('private sessionView'),
    );

    assert.doesNotMatch(sessionView, /participantScores\s*:/);
    assert.doesNotMatch(sessionView, /scoreParts\s*:/);
    assert.match(sessionView, /reasonCode/);
    assert.match(sessionView, /consensus/);
  });
});
