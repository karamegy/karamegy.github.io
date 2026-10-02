const CACHE_NAME = 'giti-tech-blog-v16';
const urlsToCache = [
  './',
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './tork.html',
  './montda.html',
  './admin.html',
  './manifest.json',
  './style.css',
  './app.js',
  './Adsesns.js',
  './logo.png'
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

// تفعيل الخدمة وتنظيف أي نسخ كاش قديمة تلقائياً وفوراً
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
  const requestUrl = event.request.url;

  // تجاهل طلبات Firebase، Google APIs، ومكتبات CDN من التخزين المؤقت لضمان عمل قاعدة البيانات واللوحات لحظياً
  if (
    requestUrl.includes('firestore') || 
    requestUrl.includes('firebase') || 
    requestUrl.includes('googleapis') || 
    requestUrl.includes('gstatic') || 
    requestUrl.includes('googlesyndication') ||
    requestUrl.includes('cdnjs.cloudflare.com')
  ) {
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
