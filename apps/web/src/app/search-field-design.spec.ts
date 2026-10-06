import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('record search accessibility', () => {
  it('keeps both filter rows expanded with pressed semantics', () => {
    const controls = source('components/core/CoreControls.tsx');
    const screen = source('components/core/RecordSearchScreen.tsx');
    assert.match(controls, /aria-pressed/);
    assert.match(screen, /작품 종류/);
    assert.match(screen, /본 곳/);
    assert.match(screen, /mediaType/);
    assert.match(screen, /viewingMethod/);
  });

  it('uses different friend and mine placeholders and URL query state', () => {
    const code = source('components/core/RecordSearchScreen.tsx');
    assert.match(code, /작품 제목 또는 친구 이름/);
    assert.match(code, /작품 제목으로 내 기록 찾기/);
    assert.match(code, /URLSearchParams/);
  });
});
