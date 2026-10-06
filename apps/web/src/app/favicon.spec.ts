import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('Davas PWA', () => {
  it('ships an App Router icon and installable standalone manifest', () => {
    assert.ok(existsSync(join(process.cwd(), 'src/app/icon.jpg')));
    const manifest = read('src/app/manifest.ts');
    assert.match(manifest, /\/icon\.jpg/);
    assert.match(manifest, /start_url:\s*'\/'/);
    assert.match(manifest, /scope:\s*'\/'/);
    assert.match(manifest, /display:\s*'standalone'/);
    assert.match(manifest, /#f6f8fc/);
    assert.match(manifest, /#284778/);
  });

  it('waits for explicit consent before activating an update and reloads after controller change', () => {
    const worker = read('public/sw.js');
    const status = read('src/components/pwa/PwaStatus.tsx');
    const installHandler =
      worker.match(/self\.addEventListener\('install',[\s\S]*?\n\}\);/)?.[0] ?? '';
    assert.match(worker, /event\.data\?\.type === 'SKIP_WAITING'/);
    assert.doesNotMatch(installHandler, /self\.skipWaiting\(\)/);
    assert.match(status, /nextRegistration\.waiting/);
    assert.match(status, /controllerchange/);
    assert.match(status, /waiting\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
  });

  it('does not present offline writes as successfully saved', () => {
    const status = read('src/components/pwa/PwaStatus.tsx');
    assert.match(status, /저장되지 않았어요/);
    assert.match(status, /연결 후 다시 시도/);
  });
});
