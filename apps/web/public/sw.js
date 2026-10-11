// Bump VERSION whenever what this worker keeps changes: activating it deletes every other cache,
// including what an older version stored.
const VERSION = 'davas-shell-v3';
const SHELL = ['/offline', '/icon.jpg', '/images/davas-logo-horizontal.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

/**
 * Only files that never change under the same name are kept: Next.js's hashed build files and
 * the offline shell. Everything else goes to the network untouched. Page data for client-side
 * navigation (`?_rsc=`) must never come from here: a copy kept from an older build names
 * scripts the new build no longer has, and the page fails to open until it is reloaded.
 */
function keeps(url) {
  if (url.pathname.startsWith('/_next/static/')) return true;
  return !url.search && SHELL.includes(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline')));
    return;
  }
  if (!keeps(url)) return;

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
