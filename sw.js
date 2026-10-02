const CACHE_NAME = 'giti-tech-blog-v15';
const urlsToCache = [
  './',
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './tork.html',
  './montda.html',
  './manifest.json',
  './style.css',
  './app.js',
  './logo.png',
  './admin.html',
];

// تثبيت الخدمة وتخزين كافة الملفات المحدثة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل الخدمة وتنظيف أي نسخ كاش قديمة تلقائياً
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
    }).then(() => self.clients.claim())
  );
});

// استراتيجية جلب البيانات: تجربة الشبكة أولاً مع العودة للكاش عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  // تجاهل طلبات Firebase و AdSense من التخزين المؤقت
  if (event.request.url.includes('firestore') || event.request.url.includes('googlesyndication')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // تحديث الكاش بالنسخة الأحدث في الخلفية
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // في حال عدم وجود شبكة، استرجع الملف من الكاش
        return caches.match(event.request);
      })
  );
});
