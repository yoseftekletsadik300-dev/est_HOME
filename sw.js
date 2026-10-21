const CACHE_NAME = 'bete-yosef-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Service Worker & Cache Essential Files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// 2. Activate & Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch from Cache first, fallback to Network (Offline Mode)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If found in cache, return it. Otherwise, fetch from network.
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Optional: You can return a custom offline fallback page here if needed
                    console.log('Network request failed, offline mode active.');
                });
            })
    );
});