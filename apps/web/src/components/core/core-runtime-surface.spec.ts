import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}

describe('core runtime Web surface', () => {
  it('does not call watchlist from active core screens', () => {
    for (const path of [
      'components/auth/AuthenticatedLanding.tsx',
      'components/home/HomeDashboard.tsx',
      'components/profile/ProfileDashboard.tsx',
      'components/media/MediaDetailModal.tsx',
    ]) {
      assert.doesNotMatch(source(path), /watchlist|Watchlist|보고 싶어요/, path);
    }
  });

  it('redirects legacy pages to their core replacements', () => {
    const middleware = source('middleware.ts');
    assert.match(middleware, /if \(pathname === '\/watchlist'\) return '\/me'/);
    assert.match(middleware, /if \(pathname === '\/explore'\) return '\/records\/new'/);
    assert.match(middleware, /if \(pathname\.startsWith\('\/community\/authors'\)\) return '\/'/);
  });
});
