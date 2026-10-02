// GITI Tech Engine - Integrated with Forum Layout, Firebase Auth & Member Profiles

function toggleSidebar() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

const articlesDatabase = {
  "1": {
    title: "أهمية أنظمة تخطيط موارد المؤسسات (ERP) في إدارة المتاجر والشركات الناشئة",
    category: "تكنولوجيا الشركات",
    date: "28 سبتمبر 2026",
    content: `
      <p>تعتبر أنظمة تخطيط موارد المؤسسات المعروفة اختصاراً بـ (ERP) العصب الرئيسي لأي نشاط تجاري حديث يسعى نحو النمو والاستدامة.</p>
      <h3 style="color: var(--gov-blue-dark); margin-top: 15px;">لماذا تحتاج الشركات الناشئة لنظام ERP سحابي؟</h3>
      <p>مع تطور الأسواق، أصبحت الإدارة اليدوية للجرد والحسابات سبباً رئيسياً في ضياع الأرباح وحدوث عجز في المخزون. يتيح نظام الـ ERP ربط المبيعات بالمخازن والحسابات البنكية لحظياً.</p>
    `
  },
  "2": {
    title: "كيف تطور نظام إدارة أساطيل الشحن وتتبع الشحنات الفوري (GPS Tracking)؟",
    category: "أنظمة لوجستية",
    date: "27 سبتمبر 2026",
    content: `
      <p>تعتبر عمليات النقل وإدارة الأساطيل التحدي الأكبر لشركات التوزيع والتجارة الإلكترونية. يتيح دمج تقنيات التتبع الجغرافي اللحظي مع قواعد البيانات الموزعة مراقبة خطوط السير واستهلاك الوقود بدقة.</p>
    `
  },
  "3": {
    title: "كيف تحمي بيانات عملك في السحابة وقواعد البيانات الموزعة؟",
    category: "أمن البيانات",
    date: "25 سبتمبر 2026",
    content: `
      <p>مع الاعتماد المتزايد على التخزين السحابي وقواعد البيانات مثل Firebase، أصبح تأمين قواعد البيانات وتفعيل قواعد الصلاحيات الصارمة أمراً لا غنى عنه.</p>
    `
  }
};

let currentActiveArticleId = null;

document.addEventListener('DOMContentLoaded', () => {
    // تفعيل البحث
    const searchInput = document.getElementById('article-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const articles = document.querySelectorAll('.article-item');
            articles.forEach(article => {
                const text = article.textContent.toLowerCase();
                article.style.display = text.includes(term) ? 'block' : 'none';
            });
        });
    }

    renderBookmarks();
    injectProfileModalHTML();
});

// فلترة المقالات
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

// حاسبة ERP
window.calculateERPValue = function() {
    const inputVal = document.getElementById('calc-input').value;
    const resultDiv = document.getElementById('calc-result');
    if (!inputVal || inputVal <= 0) {
        resultDiv.innerHTML = "⚠️ الرجاء إدخال عدد صحيح للمعاملات الشهرية.";
        return;
    }
    const savedHours = Math.round(inputVal * 0.15);
    const savedMoney = Math.round(inputVal * 1.8);
    resultDiv.innerHTML = `✨ النتائج التقديرية: يوفر النظام حوالي <span style="color:#15803d;">${savedHours} ساعة</span> عمل شهرياً، ويقلل الهدر بنحو <span style="color:#15803d;">$${savedMoney}</span>!`;
};

// قراءة مقال كامل
window.openFullArticle = function(id) {
    currentActiveArticleId = id;
    const modal = document.getElementById('article-modal');
    const area = document.getElementById('modal-content-area');
    const articleData = articlesDatabase[id];

    if (articleData) {
        area.innerHTML = `
            <span class="badge badge-paid" style="margin-bottom: 10px;">${articleData.category}</span>
            <h2 style="font-size: 1.3rem; color: var(--gov-blue-dark); margin-bottom: 8px;">${articleData.title}</h2>
            <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 20px;">تاريخ النشر: ${articleData.date}</p>
            <div style="font-size: 0.95rem; line-height: 1.9;">
                ${articleData.content}
            </div>
        `;
        modal.style.display = 'block';
        loadFirebaseComments(id);
    }
};

window.closeFullArticle = function() {
    document.getElementById('article-modal').style.display = 'none';
    currentActiveArticleId = null;
};

// حفظ المقالات
window.toggleBookmark = function(id) {
    let bookmarks = JSON.parse(localStorage.getItem('giti_bookmarks')) || [];
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(b => b !== id);
        alert('📌 تم إزالة المقال من المحفوظات.');
    } else {
        bookmarks.push(id);
        alert('🔖 تم حفظ المقال بنجاح!');
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
            html += `<li><a href="#" onclick="openFullArticle('${id}'); return false;" style="color: var(--gov-blue-dark); font-weight:700; text-decoration: none;">${articlesDatabase[id].title}</a></li>`;
        }
    });
    html += '</ul>';
    listEl.innerHTML = html;
}

// تقييم المقالات
window.rateArticle = function(stars) {
    const feedback = document.getElementById('rating-feedback');
    feedback.innerHTML = `✅ شكراً لك! تم تسجيل تقييمك (${stars} نجوم) بنجاح.`;
    feedback.style.color = '#15803d';
};

// حفظ التعليق سحابياً باستخدام حساب جوجل المسجل
window.addCommentToFirebase = async function(e) {
    e.preventDefault();
    if (!window.db || !currentActiveArticleId) return;

    const user = window.auth.currentUser;
    if (!user) {
        alert("⚠️ يجب تسجيل الدخول بحساب جوجل أولاً من أعلى الصفحة لإضافة تعليق!");
        return;
    }

    const text = document.getElementById('comment-text').value.trim();
    if (!text) return;

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        await addDoc(collection(window.db, "article_comments"), {
            articleId: currentActiveArticleId,
            uid: user.uid,
            author: user.displayName || "عضو المنصة",
            avatar: user.photoURL || "logo.png",
            text: text,
            timestamp: serverTimestamp()
        });

        document.getElementById('comment-text').value = '';
        alert('✅ تم إرسال تعليقك بنجاح!');
    } catch (err) {
        alert('❌ حدث خطأ أثناء إرسال التعليق: ' + err.message);
    }
};

function loadFirebaseComments(articleId) {
    const commentsList = document.getElementById('comments-list');
    if (!window.db) {
        commentsList.innerHTML = '<p>قاعدة البيانات غير متصلة حالياً.</p>';
        return;
    }

    try {
        const { collection, query, where, onSnapshot } = window.firebaseModules;
        const q = query(collection(window.db, "article_comments"), where("articleId", "==", articleId));
        
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                commentsList.innerHTML = '<p style="color: #64748b;">لا توجد تعليقات بعد. كن أول المعلقين!</p>';
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                html += `
                    <div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 10px;">
                        <img src="${data.avatar || 'logo.png'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                        <div style="flex: 1;">
                            <strong style="color: var(--gov-blue-dark); font-size: 0.9rem;">${data.author || 'زائر'}</strong>
                            <p style="margin-top: 2px; color: #1e293b; font-size: 0.88rem;">${data.text || ''}</p>
                        </div>
                    </div>
                `;
            });
            commentsList.innerHTML = html;
        });
    } catch (e) {
        commentsList.innerHTML = '<p>تعسّر تحميل التعليقات.</p>';
    }
}

// ==========================================
// نظام البروفايل الشخصي للأعضاء
// ==========================================

function injectProfileModalHTML() {
    if (document.getElementById('user-profile-modal')) return;
    
    const modalHTML = `
        <div id="user-profile-modal" style="display: none; position: fixed; inset: 0; background: rgba(11, 34, 56, 0.85); backdrop-filter: blur(5px); z-index: 10000; overflow-y: auto; padding: 20px;">
            <div class="card" style="max-width: 600px; margin: 50px auto; position: relative; padding: 30px; border-top: 5px solid var(--gov-gold); text-align: center;">
                <button onclick="closeUserProfile()" style="position: absolute; top: 15px; left: 15px; background: var(--primary-red); color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">✕ إغلاق</button>
                
                <img id="profile-avatar" src="logo.png" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gov-gold); margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h3 id="profile-name" style="color: var(--gov-blue-dark); font-size: 1.4rem; font-weight: 900; margin-bottom: 5px;">اسم العضو</h3>
                <p id="profile-email" style="color: #64748b; font-size: 0.9rem; margin-bottom: 20px;">email@example.com</p>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: right; margin-bottom: 20px;">
                    <h4 style="color: var(--gov-blue-dark); font-size: 1rem; font-weight: 800; margin-bottom: 10px;"><i class="fa-solid fa-bookmark"></i> مقالاتك المحفوظة:</h4>
                    <div id="profile-bookmarks-list" style="font-size: 0.88rem; color: #475569;">لا توجد مقالات محفوظة.</div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="logoutUser()" class="submit-btn" style="background: var(--primary-red); width: auto; padding: 10px 25px;">تسجيل الخروج</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.openUserProfile = function() {
    const user = window.auth.currentUser;
    if (!user) {
        alert("⚠️ يرجى تسجيل الدخول أولاً لعرض الملف الشخصي.");
        return;
    }

    document.getElementById('profile-avatar').src = user.photoURL || 'logo.png';
    document.getElementById('profile-name').innerText = user.displayName || 'عضو المنصة';
    document.getElementById('profile-email').innerText = user.email || '';

    // عرض المقالات المحفوظة في البروفايل
    const bookmarks = JSON.parse(localStorage.getItem('giti_bookmarks')) || [];
    const bookmarksContainer = document.getElementById('profile-bookmarks-list');
    
    if (bookmarks.length === 0) {
        bookmarksContainer.innerHTML = "لا توجد مقالات محفوظة في قائمتك.";
    } else {
        let bHtml = '<ul style="padding-right: 15px; display: flex; flex-direction: column; gap: 6px;">';
        bookmarks.forEach(id => {
            if (articlesDatabase[id]) {
                bHtml += `<li><a href="#" onclick="closeUserProfile(); openFullArticle('${id}'); return false;" style="color: var(--gov-blue-dark); font-weight:700; text-decoration: none;">${articlesDatabase[id].title}</a></li>`;
            }
        });
        bHtml += '</ul>';
        bookmarksContainer.innerHTML = bHtml;
    }

    document.getElementById('user-profile-modal').style.display = 'block';
};

window.closeUserProfile = function() {
    document.getElementById('user-profile-modal').style.display = 'none';
};
