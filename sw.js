const CACHE_NAME = 'queen-laundry-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    './logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Lewati cache untuk request ke Supabase atau API eksternal lainnya
    if (e.request.url.includes('supabase.co')) {
        e.respondWith(fetch(e.request));
        return;
    }

    // Untuk file lokal, gunakan strategi Cache, fallback to Network
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
