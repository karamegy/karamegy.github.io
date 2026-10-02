// GITI Tech Engine - Dynamic Firestore Articles Integration

function toggleSidebar() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

let articlesDatabase = {};
let currentActiveArticleId = null;

document.addEventListener('DOMContentLoaded', () => {
    // الانتظار حتى يتم تهيئة قاعدة البيانات ثم جلب المقالات
    initDynamicArticles();

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

    injectProfileModalHTML();
});

// دالة جلب المقالات ديناميكياً من سحابة Firebase
async function initDynamicArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    // التحقق من اتصال قاعدة البيانات
    if (!window.db) {
        setTimeout(initDynamicArticles, 500);
        return;
    }

    try {
        const { collection, getDocs } = window.firebaseModules || window.firebase;
        const querySnapshot = await getDocs(collection(window.db, "articles"));
        
        let html = "";
        articlesDatabase = {};

        if (querySnapshot.empty) {
            container.innerHTML = "<p style='text-align:center; color:#64748b; padding:30px; background:#fff; border-radius:8px;'>لا توجد مقالات منشورة حالياً. استخدم لوحة التحكم لإضافة مقالاتك الأولى!</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            // تخزين بيانات المقال في القاموس للرجوع إليها عند القراءة أو الحفظ
            articlesDatabase[id] = {
                title: data.title,
                category: data.category,
                date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : "حديثاً",
                content: data.content,
                imageUrl: data.imageUrl || ""
            };

            html += `
                <article class="card article-item" data-category="${data.category}" data-id="${id}" style="margin-bottom: 20px; padding: 20px;">
                    ${data.imageUrl ? `<img src="${data.imageUrl}" style="width: 100%; height: 180px; border-radius: 8px; object-fit: cover; margin-bottom: 12px; border: 1px solid var(--border-color);">` : ''}
                    <div class="article-meta-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="badge badge-paid">${data.category}</span>
                        <span class="reading-time" style="font-size: 0.8rem; color: #64748b;"><i class="fa-regular fa-clock"></i> 3 دقائق</span>
                    </div>
                    <h2 style="font-size: 1.25rem; color: var(--gov-blue-dark); margin: 8px 0; font-weight: 800;">${data.title}</h2>
                    <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 12px;">نشر سحابياً عبر GITI CMS</p>
                    <div class="article-body" style="font-size: 0.92rem; line-height: 1.8; color: var(--text-dark);">
                        <p>${data.content ? data.content.substring(0, 160) + '...' : ''}</p>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                        <div style="display: flex; gap: 10px;">
                            <button onclick="openFullArticle('${id}')" class="submit-btn" style="width: auto; padding: 8px 18px; font-size: 0.85rem;">قراءة المقال كاملاً</button>
                            <button onclick="toggleBookmark('${id}')" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; cursor: pointer;" title="حفظ المقال">🔖 حفظ</button>
                        </div>
                        <span style="font-size: 0.8rem; color: var(--gov-gold); font-weight: 700;">⭐ 4.8 / 5</span>
                    </div>
                </article>
            `;
        });

        container.innerHTML = html;
        renderBookmarks();
    } catch (err) {
        console.error("Error loading articles from Firestore:", err);
        container.innerHTML = "<p style='color: red; text-align: center;'>تعسّر تحميل المقالات السحابية.</p>";
    }
}

// فلترة المقالات حسب القسم
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

// حاسبة ERP الذكية
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

// قراءة المقال كاملاً في النافذة المنبثقة
window.openFullArticle = function(id) {
    currentActiveArticleId = id;
    const modal = document.getElementById('article-modal');
    const area = document.getElementById('modal-content-area');
    const articleData = articlesDatabase[id];

    if (articleData) {
        area.innerHTML = `
            ${articleData.imageUrl ? `<img src="${articleData.imageUrl}" style="width: 100%; height: 240px; border-radius: 8px; object-fit: cover; margin-bottom: 15px; border: 1px solid var(--border-color);">` : ''}
            <span class="badge badge-paid" style="margin-bottom: 10px; display: inline-block;">${articleData.category}</span>
            <h2 style="font-size: 1.3rem; color: var(--gov-blue-dark); margin-bottom: 8px;">${articleData.title}</h2>
            <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 20px;">تاريخ النشر: ${articleData.date}</p>
            <div style="font-size: 0.95rem; line-height: 1.9; color: var(--text-dark);">
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

// حفظ المقالات في LocalStorage
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

// حفظ وتعليقات سحابية عبر Firebase
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
        const { collection, addDoc, serverTimestamp } = window.firebaseModules || window.firebase;
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
        const { collection, query, where, onSnapshot } = window.firebaseModules || window.firebase;
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
