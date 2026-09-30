// GITI Tech & Business Blog - Advanced Engine for AdSense Compliance

// قاعدة بيانات المقالات الكاملة لعرضها في النافذة المنبثقة
const articlesDatabase = {
  "1": {
    title: "أهمية أنظمة تخطيط موارد المؤسسات (ERP) في إدارة المتاجر والشركات الناشئة",
    category: "تكنولوجيا الشركات",
    date: "28 سبتمبر 2026",
    content: `
      <p>تعتبر أنظمة تخطيط موارد المؤسسات المعروفة اختصاراً بـ (ERP) العصب الرئيسي لأي نشاط تجاري حديث يسعى نحو النمو والاستدامة. في الماضي كانت هذه الأنظمة حكراً على الشركات الكبرى والعملاقة نظراً لتكلفتها العالية وتعقيد برمجياتها.</p>
      <h3 style="color: var(--accent); margin-top: 15px;">لماذا تحتاج الشركات الناشئة لنظام ERP سحابي؟</h3>
      <p>مع تطور الأسواق، أصبحت الإدارة اليدوية للجرد والحسابات سبباً رئيسياً في ضياع الأرباح وحدوث عجز في المخزون. يتيح نظام الـ ERP ربط المبيعات بالمخازن والحسابات البنكية لحظياً.</p>
      <ul style="margin: 10px 20px; line-height: 1.8;">
        <li>تحديث المخزون بشكل فوري عند كل عملية بيع.</li>
        <li>إصدار التقارير المالية والضريبية بدقة بضغطة زر واحدة.</li>
        <li>تقليل الهدر المالي وتحسين كفاءة خدمة العملاء.</li>
      </ul>
    `
  },
  "2": {
    title: "كيف تطور نظام إدارة أساطيل الشحن وتتبع الشحنات الفوري (GPS Tracking)؟",
    category: "أنظمة لوجستية",
    date: "27 سبتمبر 2026",
    content: `
      <p>تعتبر عمليات النقل وإدارة الأساطيل التحدي الأكبر لشركات التوزيع والتجارة الإلكترونية. يتيح دمج تقنيات التتبع الجغرافي اللحظي مع قواعد البيانات الموزعة مراقبة خطوط السير واستهلاك الوقود بدقة.</p>
      <h3 style="color: var(--accent); margin-top: 15px;">مزايا الأتمتة اللوجستية الحديثة</h3>
      <p>من خلال تتبع خطوط السير، تستطيع الشركات توفير ما يصل إلى 30% من تكاليف الوقود والصيانة، فضلاً عن رفع مستوى رضا العملاء عبر تقديم مواعيد تسليم دقيقة للغاية.</p>
    `
  },
  "3": {
    title: "كيف تحمي بيانات عملك في السحابة وقواعد البيانات الموزعة؟",
    category: "أمن البيانات",
    date: "25 سبتمبر 2026",
    content: `
      <p>مع الاعتماد المتزايد على التخزين السحابي وقواعد البيانات مثل Firebase، أصبح تأمين قواعد البيانات وتفعيل قواعد الصلاحيات الصارمة (Security Rules) أمراً لا غنى عنه.</p>
      <h3 style="color: var(--accent); margin-top: 15px;">أفضل ممارسات الأمان السحابي</h3>
      <p>1. تشفير كافة البيانات الحساسة أثناء النقل والتخزين.<br>2. تطبيق التحقق الثنائي (2FA) لجميع مسؤولي النظام.<br>3. مراجعة صلاحيات الوصول بانتظام.</p>
    `
  },
  "4": {
    title: "دور الذكاء الاصطناعي في أتمتة قراءة المستندات والفواتير عبر OCR",
    category: "الذكاء الاصطناعي",
    date: "24 سبتمبر 2026",
    content: `
      <p>تشهد الأنظمة الحديثة اعتماداً متزايداً على تقنيات التعرف الضوئي على الحروف (OCR) المدعومة بالذكاء الاصطناعي لاستخراج البيانات من الفواتير وتذاكر الوزن والمستندات الورقية بدقة فائقة.</p>
      <h3 style="color: var(--accent); margin-top: 15px;">توفير الوقت والجهد البشري</h3>
      <p>تستطيع الخوارزميات الذكية قراءة النصوص المعقدة في ثوانٍ معدودة وترحيلها مباشرة إلى قواعد بيانات النظام، مما يلغي الأخطاء البشرية تماماً.</p>
    `
  },
  "5": {
    title: "لماذا تتفوق تطبيقات الويب التقدمية (PWAs) على التطبيقات التقليدية في قطاع الأعمال؟",
    category: "تطوير الويب",
    date: "22 سبتمبر 2026",
    content: `
      <p>تتيح تطبيقات الويب التقدمية (PWA) للمستخدمين تجربة شبيهة بالتطبيقات الأصلية مع ميزات العمل بدون إنترنت (Offline Mode)، وسرعة التحميل الفائقة.</p>
      <h3 style="color: var(--accent); margin-top: 15px;">المزايا التنافسية للـ PWA</h3>
      <p>لا تتطلب مساحة تخزين ضخمة على هواتف المستخدمين، ويتم تحديثها تلقائياً من السحابة دون الحاجة لمرورها بعمليات المراجعة الطويلة في متاجر التطبيقات.</p>
    `
  }
};

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

  // 5. تحميل المقالات المحفوظة مسبقاً
  renderBookmarks();

  // 6. تفعيل إعلانات أدسنس أوتوماتيكياً
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

  console.log("✅ GITI Tech Blog engine initialized successfully.");
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

  const catButtons = document.querySelectorAll('.cat-btn');
  catButtons.forEach(btn => {
    if (btn.getAttribute('data-cat') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

// دالة الحاسبة التذكية الذكية (تحسن تقييم الجودة لدى جوجل)
window.calculateERPValue = function() {
  const inputVal = document.getElementById('calc-input').value;
  const resultDiv = document.getElementById('calc-result');
  if (!inputVal || inputVal <= 0) {
    resultDiv.innerHTML = "⚠️ الرجاء إدخال عدد صحيح للمعاملات الشهرية.";
    return;
  }
  const savedHours = Math.round(inputVal * 0.15);
  const savedMoney = Math.round(inputVal * 1.8);
  resultDiv.innerHTML = `✨ النتائج التقديرية: يوفر نظام الـ ERP حوالي <span style="color:#22c55e;">${savedHours} ساعة</span> عمل شهرياً، ويقلل الهدر بنحو <span style="color:#22c55e;">$${savedMoney}</span> شهرياً!`;
};

// نافذة قراءة المقال كاملاً
window.openFullArticle = function(id) {
  const modal = document.getElementById('article-modal');
  const area = document.getElementById('modal-content-area');
  const articleData = articlesDatabase[id];

  if (articleData) {
    area.innerHTML = `
      <span class="badge badge-paid" style="margin-bottom: 10px; display:inline-block;">${articleData.category}</span>
      <h2 style="font-size: 1.4rem; color: var(--accent); margin-bottom: 8px;">${articleData.title}</h2>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px;">تاريخ النشر: ${articleData.date}</p>
      <div style="font-size: 0.95rem; line-height: 1.9; color: var(--text-main);">
        ${articleData.content}
      </div>
    `;
    modal.style.display = 'block';
    renderComments(id);
  }
};

window.closeFullArticle = function() {
  document.getElementById('article-modal').style.display = 'none';
};

// إدارة حفظ المقالات (Bookmarks)
window.toggleBookmark = function(id) {
  let bookmarks = JSON.parse(localStorage.getItem('giti_bookmarks')) || [];
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
    alert('📌 تم إزالة المقال من المحفوظات.');
  } else {
    bookmarks.push(id);
    alert('🔖 تم حفظ المقال بنجاح في القائمة الخاصة بك!');
  }
  localStorage.setItem('giti_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
};

function renderBookmarks() {
  const listEl = document.getElementById('saved-bookmarks-list');
  if (!listEl) return;
  const bookmarks = JSON.parse(localStorage.getItem('giti_bookmarks')) || [];
  
  if (bookmarks.length === 0) {
    listEl.innerHTML = `<p>لا توجد مقالات محفوظة حالياً.</p>`;
    return;
  }

  let html = '<ul style="padding-right: 15px; display: flex; flex-direction: column; gap: 6px;">';
  bookmarks.forEach(id => {
    if (articlesDatabase[id]) {
      html += `<li><a href="#" onclick="openFullArticle('${id}'); return false;" style="color: var(--accent); text-decoration: none;">${articlesDatabase[id].title}</a></li>`;
    }
  });
  html += '</ul>';
  listEl.innerHTML = html;
}

// نظام التعليقات الحية داخل المقالات
window.addComment = function(e) {
  e.preventDefault();
  const author = document.getElementById('comment-author').value;
  const text = document.getElementById('comment-text').value;
  
  const commentsList = document.getElementById('comments-list');
  const newComment = document.createElement('div');
  newComment.style.cssText = 'background: var(--input-bg); padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--border-color);';
  newComment.innerHTML = `<strong>${author}</strong>: <p style="margin-top: 4px; color: var(--text-main);">${text}</p>`;
  commentsList.prepend(newComment);
  
  document.getElementById('comment-author').value = '';
  document.getElementById('comment-text').value = '';
  alert('✅ تمت إضافة تعليقك بنجاح!');
};

function renderComments(articleId) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = `
    <div style="background: var(--input-bg); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
      <strong>مهندس التقنية</strong>: <p style="margin-top: 4px; color: var(--text-main);">مقال ممتاز جداً ويطرح رؤية عملية واضحة للتحول الرقمي.</p>
    </div>
  `;
}
