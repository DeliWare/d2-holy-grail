const CACHE_NAME = 'd2r-holy-grail-cache-v1';
const URLS_TO_CACHE = [
  'd2-holy-grail/',
  'd2-holy-grail/images/d2r_logo.gif'
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
  );
});