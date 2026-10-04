const CACHE_NAME = 'giti-tech-blog-v26';
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
  './logo.png',
  './sitemap.xml',
  './robots.txt',
  './googleeb8d677c7529419b.html'
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

// استراتيجية جلب البيانات للرئيسية مع تقييدها تماماً وعدم لمس أي مسار فرعي أو إعلانات أدسنس
self.addEventListener('fetch', event => {
  const requestUrl = event.request.url;

  // 🛑 الحاجز الأمني الشامل: منع سيرفر ووركر المدونة من الاقتراب نهائياً من أي تطبيق فرعي أو سحابي أو إعلانات أدسنس
  if (
    requestUrl.includes('firestore') || 
    requestUrl.includes('firebase') || 
    requestUrl.includes('googleapis') || 
    requestUrl.includes('gstatic') || 
    requestUrl.includes('googlesyndication') ||
    requestUrl.includes('adsense') ||        
    requestUrl.includes('cdnjs.cloudflare.com') ||
    requestUrl.includes('/el-omda-app/') ||  // تطبيق العلاف
    requestUrl.includes('/Na2la/') ||       // تطبيق نقلة
    requestUrl.includes('/Nal/') ||         // EIDCO
    requestUrl.includes('/Ton2/') ||        // GITI ERP
    requestUrl.includes('/giti/')           // ألعاب الفضاء
  ) {
    return; // تمرر الطلبات مباشرة للشبكة بدون أي كاش أو تدخل من المدونة
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
