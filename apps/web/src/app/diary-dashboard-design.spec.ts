import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('my records IA', () => {
  it('redirects legacy diary and serves the simple /me list', () => {
    assert.match(source('app/diary/page.tsx'), /redirect\('\/me'\)/);
    assert.match(source('app/me/page.tsx'), /MineScreen/);
  });

  it('keeps statistics, calendar, genres and favorites out of the active screen', () => {
    const code = source('components/core/RecordListScreens.tsx');
    assert.match(code, /내 기록/);
    assert.doesNotMatch(code, /DiaryMonthlyCalendar|GenreRatio|StatsGrid|Favorite/);
  });

  it('passes filters together and exposes explicit pagination', () => {
    const code = source('components/core/RecordListScreens.tsx');
    assert.match(code, /listRecords\(scope, \{\s*q,\s*mediaType,\s*viewingMethod,\s*cursor/);
    assert.match(code, /더 보기/);
  });
});
