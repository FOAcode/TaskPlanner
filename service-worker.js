// Service Worker Script: stale-while-revalidate

const CACHE_NAME = 'TaskPlanner_cache_mem';
const FILES_TO_CACHE = [
    '/TaskPlanner/',
    '/TaskPlanner/index.html',
    '/TaskPlanner/script.js',
    '/TaskPlanner/styles.css',
    '/TaskPlanner/manifest.json',
    '/TaskPlanner/192x192.png',
    '/TaskPlanner/192x192.ico'
];

// Install: cache static files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }))
        )
    );
    self.clients.claim();
});

// Fetch: stale-while-revalidate
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                    if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return networkResponse;
                }).catch(() => null); // fail silently on fetch error

            return cachedResponse || fetchPromise;
        })
    );
});
