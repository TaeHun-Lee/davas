import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('API shared contract boundary', () => {
  it('implements shared input contracts in runtime-validated DTOs', () => {
    assert.match(source('diaries/dto/create-diary.dto.ts'), /implements RecordCreateInput/);
    assert.match(source('diaries/dto/update-diary.dto.ts'), /implements RecordUpdateInput/);
    assert.match(source('diaries/dto/diary-list-query.dto.ts'), /implements RecordFilters/);
    assert.match(source('media/dto/media-search-query.dto.ts'), /implements MediaSearchRequest/);
    assert.match(source('media/dto/media-selection.dto.ts'), /implements MediaSelectionInput/);
  });

  it('uses the shared authenticated-user contract', () => {
    const authService = source('auth/auth.service.ts');
    assert.match(
      authService,
      /import\s*\{[\s\S]*?\btype\s+AuthenticatedUser\b[\s\S]*?\}\s*from '@davas\/shared'/,
    );
    assert.doesNotMatch(authService, /export type AuthenticatedUser/);
  });
});
