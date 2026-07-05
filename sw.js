const CACHE_NAME = 'civil-estimation-pro-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // For navigation requests (like HTML), use Network First strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(response => {
            return response || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // For other requests, use Stale-While-Revalidate or Cache First
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
                cache.put(event.request, responseToCache);
              }
            });
          }
          return networkResponse;
        }).catch(() => {
          // Ignore fetch errors during revalidation
        });

        // Return cached response immediately if available, while network fetch happens in background
        return cachedResponse || fetchPromise;
      })
  );
});
