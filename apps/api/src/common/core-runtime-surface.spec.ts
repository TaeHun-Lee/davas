import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}

describe('core runtime API surface', () => {
  it('does not register product-excluded feature modules in AppModule', () => {
    const appModule = source('app.module.ts');
    for (const legacyModule of [
      'CommentsModule',
      'CommunityModule',
      'ReactionsModule',
      'RecommendationsModule',
      'WatchlistModule',
    ]) {
      assert.doesNotMatch(appModule, new RegExp(legacyModule), legacyModule);
    }
  });

  it('keeps notification persistence available without exposing inbox routes', () => {
    const notificationModule = source('notifications/notifications.module.ts');
    assert.doesNotMatch(notificationModule, /NotificationsController/);
    assert.match(notificationModule, /providers:\s*\[NotificationsService\]/);
    assert.match(notificationModule, /exports:\s*\[NotificationsService\]/);
  });

  it('does not expose excluded person-search endpoints', () => {
    const mediaController = source('media/media.controller.ts');
    assert.doesNotMatch(
      mediaController,
      /people\/search|people\/:personId\/credits|searchPeople|findPersonCredits/,
    );
  });
});
