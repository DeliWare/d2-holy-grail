const CACHE_NAME = 'd2r-holy-grail-cache-v1';
const urlsToCache = [
  'd2-holy-grail/',
  'd2-holy-grail/images/d2r_logo.gif'
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function(event) {
  console.log('installing sw');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        var x = cache.addAll(urlsToCache);
        console.log('cache added');
        return x;
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