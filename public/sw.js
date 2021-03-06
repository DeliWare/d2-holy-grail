const CACHE_NAME = 'd2r-holy-grail-cache-v2';
const FILES_TO_CACHE = [
  './',
  'images/d2r_logo.gif'
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request)
    })
  );
});