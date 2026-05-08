const CACHE = 'keijis-corner-v1';
const ASSETS = [
  '/keijis-corner/',
  '/keijis-corner/index.html',
  '/keijis-corner/dashboard.html',
  '/keijis-corner/calisthenics_program.html',
  '/keijis-corner/Time Manager.html',
  '/keijis-corner/book-tracker.html',
  '/keijis-corner/curriculum.html',
  '/keijis-corner/electrical-apprenticeship.html',
  '/keijis-corner/icon.svg',
  '/keijis-corner/icon-192.png',
  '/keijis-corner/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
