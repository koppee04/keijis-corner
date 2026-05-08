const CACHE = 'keijis-corner-v3';

// Only cache static assets that never change (icons)
const STATIC = [
  '/keijis-corner/icon.svg',
  '/keijis-corner/icon-192.png',
  '/keijis-corner/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  // Delete every old cache version
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Icons → cache-first (they never change)
  if (url.pathname.match(/\.(png|svg)$/)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // Everything else (HTML, JS, etc.) → network-first so updates are always seen
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
