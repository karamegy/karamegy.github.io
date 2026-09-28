// GITI Tech & Business Blog - Sidebar & Filtering Engine

document.addEventListener('DOMContentLoaded', () => {
  // 1. إدارة المظاهر (الثيمات الداكنة والفاتحة)
  const savedTheme = localStorage.getItem('app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app_theme', newTheme);
    });
  }

  // 2. شريط التقدم أثناء التصفح
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  // 3. إضافة أزرار المشاركة الاجتماعية التلقائية أسفل المقالات
  const articles = document.querySelectorAll('.article-item');
  articles.forEach(article => {
    const titleEl = article.querySelector('h2');
    if (titleEl && !article.querySelector('.share-box')) {
      const shareBox = document.createElement('div');
      shareBox.className = 'share-box';
      shareBox.style.cssText = 'margin-top: 15px; padding-top: 12px; border-top: 1px dashed var(--border-color); display: flex; gap: 8px; align-items: center; flex-wrap: wrap;';
      
      const articleTitle = encodeURIComponent(titleEl.textContent);
      const pageUrl = encodeURIComponent(window.location.href);

      shareBox.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold;">مشاركة المقال:</span>
        <a href="https://api.whatsapp.com/send?text=${articleTitle}%20-%20${pageUrl}" target="_blank" class="btn-sm" style="background: #22c55e; color: #fff; text-decoration: none;">واتساب 💬</a>
        <a href="https://twitter.com/intent/tweet?text=${articleTitle}&url=${pageUrl}" target="_blank" class="btn-sm" style="background: #0284c7; color: #fff; text-decoration: none;">تويتر/X 🐦</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" target="_blank" class="btn-sm" style="background: #4f46e5; color: #fff; text-decoration: none;">لينكد إن 🔗</a>
      `;
      article.appendChild(shareBox);
    }
  });

  // 4. ميزة البحث الفوري في المقالات
  const searchInput = document.getElementById('article-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      articles.forEach(article => {
        const text = article.textContent.toLowerCase();
        if (text.includes(term)) {
          article.style.display = 'block';
        } else {
          article.style.display = 'none';
        }
      });
    });
  }

  // 5. تفعيل إعلانات أدسنس أوتوماتيكياً
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

  console.log("✅ GITI Tech Sidebar & Blog engine initialized successfully.");
});

// دالة تصنيف وفلترة المقالات عبر الشريط الجانبي
window.filterCategory = function(category) {
  const articles = document.querySelectorAll('.article-item');
  articles.forEach(article => {
    if (category === 'all' || article.getAttribute('data-category') === category) {
      article.style.display = 'block';
    } else {
      article.style.display = 'none';
    }
  });

  // تحديث حالة الأزرار في الشريط الجانبي
  const catButtons = document.querySelectorAll('.cat-btn');
  catButtons.forEach(btn => {
    if (btn.getAttribute('data-cat') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};
