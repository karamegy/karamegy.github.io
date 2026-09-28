const CACHE_NAME = 'giti-tech-blog-v1';
const urlsToCache = [
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './style.css',
  './app.js',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
