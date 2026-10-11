import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import vm from 'node:vm';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

/** Runs sw.js with stand-ins for the worker globals and returns its fetch handler. */
function loadWorker() {
  const listeners = new Map<string, (event: unknown) => void>();
  const context = {
    self: {
      addEventListener: (type: string, fn: (event: unknown) => void) => listeners.set(type, fn),
    },
    location: { origin: 'https://davas.example' },
    caches: { match: async () => undefined, open: async () => ({ put: async () => undefined }) },
    fetch: async () => ({ ok: true, clone: () => ({}) }),
    URL,
  };
  vm.runInNewContext(read('public/sw.js'), context);
  const fetchHandler = listeners.get('fetch')!;
  return (url: string, mode = 'cors') => {
    let answered = false;
    fetchHandler({
      request: { method: 'GET', url, mode },
      respondWith: () => {
        answered = true;
      },
    });
    return answered;
  };
}

// 2026-10-11: after a deploy, opening the composer from home or the wish card showed
// "화면을 불러오지 못했어요" until a reload.
describe('keeping pages working across deploys', () => {
  it('keeps only hashed build files and the offline shell in the service worker', () => {
    const handles = loadWorker();
    assert.equal(handles('https://davas.example/_next/static/chunks/app/page-ec23d529.js'), true);
    assert.equal(handles('https://davas.example/icon.jpg'), true);
    assert.equal(handles('https://davas.example/records/new', 'navigate'), true, 'network first');
    // Page data for client-side navigation always goes to the network.
    assert.equal(handles('https://davas.example/records/new?_rsc=1a2b3'), false);
    assert.equal(handles('https://davas.example/offline?_rsc=1a2b3'), false);
    assert.equal(handles('https://davas.example/api/v1/spaces'), false);
    // A new cache name makes the activated worker drop what older versions kept.
    assert.match(read('public/sw.js'), /const VERSION = 'davas-shell-v3';/);
  });

  it('reloads once when a script of the old build is gone, instead of showing the error', () => {
    const page = read('src/app/error.tsx');
    assert.match(page, /error\.name === 'ChunkLoadError'/);
    assert.match(page, /Date\.now\(\) - last < 60_000/);
    assert.match(page, /window\.location\.reload\(\)/);
    assert.match(page, /isChunkLoadError\(error\) \? window\.location\.reload\(\) : reset\(\)/);
  });

  it('labels the wish button by what pressing it does', () => {
    const wishes = read('src/components/spaces/WishesScreen.tsx');
    assert.match(wishes, /\{item\.wantedByMe \? '담기 취소' : '나도'\}/);
  });

  it('keeps the three home tabs on one row', () => {
    const css = read('src/app/globals.css');
    assert.match(
      css,
      /\.home-recommendation-tabs \{[^}]*grid-auto-columns: 1fr;\s*grid-auto-flow: column;/,
    );
    assert.doesNotMatch(css, /\.home-recommendation-tabs \{[^}]*repeat\(2, 1fr\)/);
  });
});
