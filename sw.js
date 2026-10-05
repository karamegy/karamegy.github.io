const CACHE_NAME = 'giti-tech-cache-v2027';
const assetsToCache = [
  './',
  './index.html',
  './montda.html',
  './tork.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './admin.html',
  './style.css',
  './app.js',
  './logo.png',
  './manifest.json'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ تم فتح التخزين المؤقت بنجاح');
        return cache.addAll(assetsToCache);
      })
      .catch((err) => {
        console.error('❌ خطأ في التخزين المؤقت:', err);
      })
  );
  self.skipWaiting();
});

// تفعيل وتطهير التخزين المؤقت القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 حذف التخزين المؤقت القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع طلبات الشبكة وعزل الإعلانات
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // استثناء طلبات الإعلانات، شبكات جوجل، و Firebase لتعمل مباشرة عبر الإنترنت
  if (
    url.includes('googlesyndication.com') ||
    url.includes('googleads.g.doubleclick.net') ||
    url.includes('pagead2.googlesyndication.com') ||
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('googleapis.com')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          return response;
        }).catch(() => {
          // صفحة احتياطية عند انقطاع الاتصال إذا لزم الأمر
        });
      })
  );
});
