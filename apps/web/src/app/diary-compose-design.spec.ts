import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');
const composerSource = () =>
  [
    source('components/core/RecordComposer.tsx'),
    source('components/core/RecordFinderView.tsx'),
    source('components/core/RecordEditorView.tsx'),
    source('components/core/record-composer-model.ts'),
  ].join('\n');

describe('core record compose', () => {
  it('requires viewing method independently from media type', () => {
    const composer = composerSource();
    const hook = source('hooks/useMediaSearch.ts');
    assert.match(composer, /ViewingMethodControl/);
    assert.match(composer, /MediaTypeControl/);
    assert.match(hook, /searchMedia\(\{ query: trimmedQuery, type/);
  });

  it('keeps a per-user session draft and idempotent request id through retry', () => {
    const code = composerSource();
    assert.match(code, /davas:draft:\$\{userId\}/);
    assert.match(code, /sessionStorage/);
    assert.match(code, /crypto\.randomUUID/);
    assert.match(code, /allowDuplicate/);
    assert.match(code, /POSSIBLE_REWATCH/);
  });

  it('supports nullable radio rating and omits removed compose fields', () => {
    const code = composerSource();
    assert.match(code, /type="radio"/);
    assert.match(code, /\[null,\s*1,\s*2,\s*3,\s*4,\s*5\]/);
    assert.doesNotMatch(code, /mood|memoryNote|companions|watchedPlace|tags/);
  });
});
