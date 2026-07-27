import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('media finder contract', () => {
  it('redirects legacy explore and selects canonical media before write step', () => {
    assert.match(source('app/explore/page.tsx'), /redirect\('\/records\/new'\)/);
    assert.match(source('components/core/RecordComposer.tsx'), /await selectMedia\(item\)/);
  });

  it('forwards type and provides TMDB next-page loading', () => {
    const hook = source('hooks/useMediaSearch.ts');
    const api = source('lib/api/media.ts');
    assert.match(hook, /type, page: 1/);
    assert.match(api, /params\.set\('type', type\)/);
    assert.match(hook, /page \+ 1/);
    assert.match(source('components/core/RecordFinderView.tsx'), /다음 결과 보기/);
  });
});
