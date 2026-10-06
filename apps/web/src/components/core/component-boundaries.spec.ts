import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const root = join(process.cwd(), 'src/components/core');
const source = (name: string) => readFileSync(join(root, name), 'utf8');
const lines = (name: string) => source(name).split(/\r?\n/).length;

describe('active core component responsibility boundaries', () => {
  it('keeps CoreUi and RecordScreens as compatibility barrels only', () => {
    assert.ok(lines('CoreUi.tsx') <= 10);
    assert.ok(lines('RecordScreens.tsx') <= 10);
    assert.match(source('CoreUi.tsx'), /CoreShell/);
    assert.match(source('RecordScreens.tsx'), /RecordDetailScreen/);
  });

  it('keeps RecordComposer as orchestration instead of rendering both steps', () => {
    const composer = source('RecordComposer.tsx');
    assert.ok(lines('RecordComposer.tsx') <= 280);
    assert.match(composer, /RecordFinderView/);
    assert.match(composer, /RecordEditorView/);
    assert.doesNotMatch(composer, /<textarea|results\.items\.map/);
  });

  it('keeps each extracted active component below a reviewable size', () => {
    for (const name of [
      'CoreShell.tsx',
      'CoreControls.tsx',
      'CoreRecordCard.tsx',
      'RecordListScreens.tsx',
      'RecordSearchScreen.tsx',
      'RecordDetailScreen.tsx',
      'RecordFinderView.tsx',
      'RecordEditorView.tsx',
    ]) {
      assert.ok(lines(name) <= 280, `${name} exceeds 280 lines`);
    }
  });
});
