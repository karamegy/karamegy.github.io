// GITI Tech & Business Blog - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // تفعيل المظهر المحفوظ (الثيم) إن وجد
  const savedTheme = localStorage.getItem('app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // تفعيل تتبع وتحميل إعلانات أدسنس أوتوماتيكياً بأمان
  setTimeout(() => {
    try {
      const adElements = document.querySelectorAll('.adsbygoogle');
      adElements.forEach(ad => {
        if (!ad.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
    } catch (e) {
      console.warn("AdSense Trigger Warning:", e);
    }
  }, 400);

  console.log("✅ GITI Tech Blog loaded and ready for AdSense bots.");
});
