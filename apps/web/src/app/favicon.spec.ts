import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { resolvePwaUpdateAction } from '../components/pwa/PwaStatus';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('Davas PWA', () => {
  it('ships an App Router icon and installable standalone manifest', () => {
    assert.ok(existsSync(join(process.cwd(), 'src/app/icon.jpg')));
    const manifest = read('src/app/manifest.ts');
    assert.match(manifest, /\/icon\.jpg/);
    assert.match(manifest, /start_url:'\/'/);
    assert.match(manifest, /scope:'\/'/);
    assert.match(manifest, /display:'standalone'/);
    assert.match(manifest, /#f6f8fc/);
    assert.match(manifest, /#284778/);
  });

  it('silently activates web updates and only prompts once per installed PWA session', () => {
    const worker = read('public/sw.js');
    const status = read('src/components/pwa/PwaStatus.tsx');
    const installHandler = worker.match(/self\.addEventListener\('install',[\s\S]*?\n\}\);/)?.[0] ?? '';
    assert.match(worker, /event\.data\?\.type === 'SKIP_WAITING'/);
    assert.doesNotMatch(installHandler, /self\.skipWaiting\(\)/);
    assert.equal(resolvePwaUpdateAction(false, false), 'activate');
    assert.equal(resolvePwaUpdateAction(false, true), 'activate');
    assert.equal(resolvePwaUpdateAction(true, false), 'prompt');
    assert.equal(resolvePwaUpdateAction(true, true), 'defer');
    assert.match(status, /matchMedia\('\(display-mode: standalone\)'\)/);
    assert.match(status, /standaloneNavigator\.standalone === true/);
    assert.match(status, /worker\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
    assert.match(status, /sessionStorage\.getItem\(UPDATE_NOTICE_SESSION_KEY\)/);
    assert.match(status, /sessionStorage\.setItem\(UPDATE_NOTICE_SESSION_KEY, '1'\)/);
    assert.match(status, /nextRegistration\.waiting/);
    assert.match(status, /controllerchange/);
    assert.match(status, /waiting\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
    assert.match(status, />\s*나중에\s*</);
    assert.doesNotMatch(status, /if \(!waiting\) \{\s*location\.reload\(\)/);
  });

  it('does not present offline writes as successfully saved', () => {
    const status = read('src/components/pwa/PwaStatus.tsx');
    assert.match(status, /저장되지 않았어요/);
    assert.match(status, /연결 후 다시 시도/);
  });
});
