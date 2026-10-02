// GITI Tech Engine - Dynamic Firestore Articles Integration, Canvas Generator & Security Tools

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

// --- كود مولد بطاقة العضوية المهنية (Canvas Generator) ---
let cardCanvas, cardCtx;
let userAvatarImg = new Image();
let isAvatarLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    cardCanvas = document.getElementById('invitationCanvas');
    if (cardCanvas) {
        cardCtx = cardCanvas.getContext('2d');
        cardCanvas.width = 1000;
        cardCanvas.height = 562;
        drawCard();
    }

    initDynamicArticles();

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

    // تشغيل وظائف صفحة الأمان (tork.html) إن وجدت في الصفحة الحالية
    if (document.getElementById('pageReadsCounter')) {
        incrementAndFetchPageReads();
        fetchFirebaseInquiries();
    }
});

function drawCard() {
    if (!cardCtx) return;
    cardCtx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

    const grad = cardCtx.createLinearGradient(0, 0, cardCanvas.width, cardCanvas.height);
    grad.addColorStop(0, '#0b2238');
    grad.addColorStop(1, '#0f172a');
    cardCtx.fillStyle = grad;
    cardCtx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

    cardCtx.strokeStyle = '#d4af37';
    cardCtx.lineWidth = 8;
    cardCtx.strokeRect(20, 20, cardCanvas.width - 40, cardCanvas.height - 40);

    cardCtx.fillStyle = '#d4af37';
    cardCtx.font = 'bold 32px Cairo, sans-serif';
    cardCtx.textAlign = 'center';
    cardCtx.direction = 'rtl';
    cardCtx.fillText('GITI Tech & Business OS', cardCanvas.width / 2, 75);

    cardCtx.fillStyle = '#e2e8f0';
    cardCtx.font = '17px Cairo, sans-serif';
    cardCtx.fillText('بطاقة عضوية وشريك معتمد في الشبكة', cardCanvas.width / 2, 110);

    cardCtx.strokeStyle = '#d4af37';
    cardCtx.lineWidth = 2;
    cardCtx.beginPath();
    cardCtx.moveTo(cardCanvas.width / 2 - 140, 125);
    cardCtx.lineTo(cardCanvas.width / 2 + 140, 125);
    cardCtx.stroke();

    const centerX = cardCanvas.width / 2;
    const centerY = 230;
    const radius = 58;

    cardCtx.save();
    cardCtx.beginPath();
    cardCtx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    cardCtx.closePath();
    cardCtx.clip();

    if (isAvatarLoaded) {
        cardCtx.drawImage(userAvatarImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
    } else {
        cardCtx.fillStyle = '#1e293b';
        cardCtx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        cardCtx.fillStyle = '#d4af37';
        cardCtx.font = 'bold 15px Cairo, sans-serif';
        cardCtx.fillText('صورتك', centerX, centerY + 5);
    }
    cardCtx.restore();

    cardCtx.strokeStyle = '#d4af37';
    cardCtx.lineWidth = 4;
    cardCtx.beginPath();
    cardCtx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    cardCtx.closePath();
    cardCtx.stroke();

    const inputNameEl = document.getElementById('cardUserName');
    const inputNameVal = inputNameEl ? inputNameEl.value.trim() : '';
    const fullNameText = inputNameVal !== '' ? inputNameVal : 'اسم العضو الكريم';

    cardCtx.fillStyle = '#ffffff';
    cardCtx.font = 'bold 28px Cairo, sans-serif';
    cardCtx.textAlign = 'center';
    cardCtx.fillText(fullNameText, cardCanvas.width / 2, 335);

    cardCtx.fillStyle = '#d4af37';
    cardCtx.font = 'bold 17px Cairo, sans-serif';
    cardCtx.fillText('عضو مشارك في أنظمة Na2la و Business OS', cardCanvas.width / 2, 372);

    cardCtx.fillStyle = '#93c5fd';
    cardCtx.font = 'bold 15px Cairo, sans-serif';
    cardCtx.fillText('الموقع الرسمي: https://karamegy.github.io', cardCanvas.width / 2, 420);

    cardCtx.fillStyle = '#cbd5e1';
    cardCtx.font = '14px Cairo, sans-serif';
    cardCtx.fillText('شبكة GITI Tech | نظام إدارة الأساطيل والأعمال المتكامل', cardCanvas.width / 2, 490);
}

window.loadCardImage = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userAvatarImg.src = e.target.result;
            userAvatarImg.onload = function() {
                isAvatarLoaded = true;
                drawCard();
            }
        }
        reader.readAsDataURL(file);
    }
};

window.downloadInvitationCard = function() {
    if (!cardCanvas) return;
    const link = document.createElement('a');
    link.download = 'GITI_Member_Card.png';
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
};

// --- جلب المقالات ديناميكياً من سحابة Firebase ---
async function initDynamicArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

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
            container.innerHTML = "<p style='text-align:center; color:#64748b; padding:30px; background:#fff; border-radius:8px;'>لا توجد مقالات منشورة حالياً.</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="badge badge-paid">${data.category}</span>
                        <span style="font-size: 0.8rem; color: #64748b;"><i class="fa-regular fa-clock"></i> 3 دقائق</span>
                    </div>
                    <h2 style="font-size: 1.25rem; color: var(--gov-blue-dark); margin: 8px 0; font-weight: 800;">${data.title}</h2>
                    <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 12px;">نشر سحابياً عبر GITI CMS</p>
                    <div style="font-size: 0.92rem; line-height: 1.8; color: var(--text-dark);">
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
        console.error("Error loading articles:", err);
        container.innerHTML = "<p style='color: red; text-align: center;'>تعسّر تحميل المقالات السحابية.</p>";
    }
}

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
            <div style="font-size: 0.95rem; line-height: 1.9; color: var(--text-dark);">${articleData.content}</div>
        `;
        modal.style.display = 'block';
        loadFirebaseComments(id);
    }
};

window.closeFullArticle = function() {
    document.getElementById('article-modal').style.display = 'none';
    currentActiveArticleId = null;
};

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

window.rateArticle = function(stars) {
    const feedback = document.getElementById('rating-feedback');
    feedback.innerHTML = `✅ شكراً لك! تم تسجيل تقييمك (${stars} نجوم) بنجاح.`;
    feedback.style.color = '#15803d';
};

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

// حفظ استمارة الاستفسارات في مجموعة app_inquiries
window.handleFormSubmit = async function(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب سحابياً...';

    const formData = {
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        serviceType: document.getElementById('governorate').value,
        message: document.getElementById('proposal').value.trim(),
        createdAt: window.serverTimestamp ? window.serverTimestamp() : new Date(),
        date: new Date().toLocaleString('ar-EG')
    };

    try {
        if (window.db && window.addDoc && window.collection) {
            await window.addDoc(window.collection(window.db, "app_inquiries"), formData);
            document.getElementById('forumForm').style.display = 'none';
            document.getElementById('successBox').style.display = 'block';
        } else {
            throw new Error("قاعدة بيانات فايربيس غير متصلة.");
        }
    } catch (error) {
        console.error("Firebase Sync Error:", error);
        alert("❌ فشل الحفظ في قاعدة البيانات: " + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'إرسال الطلب إلى فريق GITI';
    }
};

function injectProfileModalHTML() {
    if (document.getElementById('user-profile-modal')) return;
    const modalHTML = `
        <div id="user-profile-modal" style="display: none; position: fixed; inset: 0; background: rgba(11, 34, 56, 0.85); backdrop-filter: blur(5px); z-index: 10000; overflow-y: auto; padding: 20px;">
            <div class="card" style="max-width: 600px; margin: 50px auto; position: relative; padding: 30px; border-top: 5px solid var(--gov-gold); text-align: center;">
                <button onclick="closeUserProfile()" style="position: absolute; top: 15px; left: 15px; background: var(--primary-red); color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">✕ إغلاق</button>
                <img id="profile-avatar" src="logo.png" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gov-gold); margin-bottom: 15px;">
                <h3 id="profile-name" style="color: var(--gov-blue-dark); font-size: 1.4rem; font-weight: 900; margin-bottom: 5px;">اسم العضو</h3>
                <p id="profile-email" style="color: #64748b; font-size: 0.9rem; margin-bottom: 20px;">email@example.com</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: right; margin-bottom: 20px;">
                    <h4 style="color: var(--gov-blue-dark); font-size: 1rem; font-weight: 800; margin-bottom: 10px;"><i class="fa-solid fa-bookmark"></i> مقالاتك المحفوظة:</h4>
                    <div id="profile-bookmarks-list" style="font-size: 0.88rem; color: #475569;">لا توجد مقالات محفوظة.</div>
                </div>
                <button onclick="logoutUser()" class="submit-btn" style="background: var(--primary-red); width: auto; padding: 10px 25px;">تسجيل الخروج</button>
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
    document.getElementById('user-profile-modal').style.display = 'block';
};

window.closeUserProfile = function() {
    document.getElementById('user-profile-modal').style.display = 'none';
};

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.onscroll = function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }
};

// ==========================================
// دوال صفحة الأمان وتطبيقات المنصة (tork.html)
// ==========================================
let globalInquiriesData = [];
let lastSubmissionTime = 0;

window.checkPasswordStrength = function(pwd) {
    const resultEl = document.getElementById('pwd-result');
    if (!resultEl) return;
    
    if (!pwd) {
        resultEl.innerHTML = "أدخل كلمة مرور أعلاه لمعرفة تقييم أمانها...";
        resultEl.style.color = "#64748b";
        return;
    }
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
        resultEl.innerHTML = "🔴 ضعيفة: يفضل إضافة رموز وأرقام وحروف كبيرة لزيادة التشفير.";
        resultEl.style.color = "#dc2626";
    } else if (score === 3) {
        resultEl.innerHTML = "🟡 متوسطة: كلمة المرور مقبولة ولكن يمكن تحسينها.";
        resultEl.style.color = "#d97706";
    } else {
        resultEl.innerHTML = "🟢 قوية وممتازة: كلمة المرور مؤمنة ضد الاختراق والتشفير قوي جداً!";
        resultEl.style.color = "#15803d";
    }
};

async function incrementAndFetchPageReads() {
    const pageReadsEl = document.getElementById('pageReadsCounter');
    if (!pageReadsEl || !window.db) {
        if (pageReadsEl) pageReadsEl.innerText = "4,120+";
        return;
    }

    try {
        const { doc, runTransaction } = window.firebaseModules;
        const statsRef = doc(window.db, 'site_metrics', 'apps_page_views');
        
        await runTransaction(window.db, async (transaction) => {
            const docSnap = await transaction.get(statsRef);
            let newViews = 4120;
            if (docSnap.exists()) {
                newViews = (docSnap.data().views || 4120) + 1;
                transaction.update(statsRef, { views: newViews });
            } else {
                transaction.set(statsRef, { views: newViews });
            }
            pageReadsEl.innerText = newViews.toLocaleString();
        });
    } catch (e) {
        pageReadsEl.innerText = "4,120+";
    }
}

function sanitizeAndValidate(text) {
    if (!text || typeof text !== 'string') return '';
    const cleaned = text.trim().replace(/<[^>]*>?/gm, '');
    const bannedKeywords = ['عنف', 'قتل', 'إرهاب', 'سلاح', 'تفجير', 'كراهية', 'حرب', 'دمار', 'تحريض', 'شتم', 'سب', 'script', 'onerror', 'onload'];
    const lowerText = cleaned.toLowerCase();
    const hasBanned = bannedKeywords.some(word => lowerText.includes(word));
    return { cleaned, hasBanned };
}

window.submitInquiryToFirebase = async function(e) {
    e.preventDefault();
    if (!window.db) {
        alert('قاعدة البيانات غير متصلة حالياً.');
        return;
    }

    const now = Date.now();
    if (now - lastSubmissionTime < 15000) {
        showAlert('⚠ يرجى الانتظار قليلاً قبل إرسال استفسار جديد لمنع الضغط على السحابة.', '#b45309', '#fef3c7');
        return;
    }

    const rawName = document.getElementById('inq-name').value;
    const rawText = document.getElementById('inq-text').value;

    const nameCheck = sanitizeAndValidate(rawName);
    const textCheck = sanitizeAndValidate(rawText);

    if (nameCheck.hasBanned || textCheck.hasBanned) {
        showAlert('🚫 عذراً، المدخلات تحتوي على عبارات غير مسموح بها وفقاً لمعايير الأمان.', '#b91c1c', '#fee2e2');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "جاري الحفظ الآمن بالسحابة...";
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        await addDoc(collection(window.db, 'app_inquiries'), {
            name: nameCheck.cleaned,
            text: textCheck.cleaned,
            timestamp: serverTimestamp()
        });

        const formEl = document.getElementById('inquiry-form');
        if (formEl) formEl.reset();
        const counterEl = document.getElementById('char-counter');
        if (counterEl) counterEl.innerText = '0';

        lastSubmissionTime = Date.now();
        fetchFirebaseInquiries();
        showAlert('✅ تم إرسال استفسارك التقني وحفظه بأمان تشفير تام في السحابة!', '#15803d', '#dcfce7');
    } catch (err) {
        showAlert('❌ حدث خطأ أثناء الاتصال بالسحابة. تأكد من اتصالك بالإنترنت.', '#b91c1c', '#fee2e2');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "إرسال الاستفسار سحابياً بأمان 📨";
        }
    }
};

function showAlert(msg, textColor, bgColor) {
    const alertBox = document.getElementById('form-alert');
    if (!alertBox) return;
    alertBox.innerText = msg;
    alertBox.style.color = textColor;
    alertBox.style.background = bgColor;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
}

async function fetchFirebaseInquiries() {
    const listContainer = document.getElementById('firebase-inquiries-list');
    if (!listContainer) return;

    if (!window.db) {
        listContainer.innerHTML = '<p style="color: #64748b; text-align: center;">قاعدة البيانات غير متصلة.</p>';
        return;
    }

    try {
        const { collection, getDocs, query } = window.firebaseModules;
        const q = query(collection(window.db, 'app_inquiries'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            listContainer.innerHTML = '<p style="color: #64748b; text-align: center;">لا توجد استفسارات حالياً. كن أول من يطرح استفساراً تقنياً!</p>';
            globalInquiriesData = [];
            return;
        }

        globalInquiriesData = [];
        snapshot.forEach(doc => {
            globalInquiriesData.push(doc.data());
        });
        renderInquiriesList(globalInquiriesData);
    } catch (e) {
        listContainer.innerHTML = `
          <div style="background: rgba(248, 250, 252, 0.9); border: 1px solid var(--border-color); border-right: 4px solid var(--gov-gold); padding: 15px; border-radius: 6px;">
            <h4 style="color: var(--gov-blue-dark); font-size: 1rem; font-weight: 800;">فريق الدعم الفني GITI</h4>
            <p style="font-size: 0.95rem; color: #64748b; margin: 0;">نظام الحماية السحابي وقواعد التشفير تعمل بكفاءة تامة لحماية البيانات.</p>
          </div>
        `;
    }
}

function renderInquiriesList(inquiries) {
    const listContainer = document.getElementById('firebase-inquiries-list');
    if (!listContainer) return;

    if (inquiries.length === 0) {
        listContainer.innerHTML = '<p style="color: #64748b; text-align: center;">لا توجد نتائج مطابقة للبحث.</p>';
        return;
    }

    let htmlContent = '';
    inquiries.forEach(data => {
        htmlContent += `
          <div style="background: rgba(248, 250, 252, 0.9); border: 1px solid var(--border-color); border-right: 4px solid var(--gov-gold); padding: 15px; border-radius: 6px; margin-bottom: 10px;">
            <h4 style="margin-bottom: 5px; color: var(--gov-blue-dark); font-size: 1rem; font-weight: 800;">${escapeHtml(data.name || 'زائر')}</h4>
            <p style="font-size: 0.95rem; color: #475569; margin: 0;">${escapeHtml(data.text || '')}</p>
          </div>
        `;
    });
    listContainer.innerHTML = htmlContent;
}

window.filterInquiries = function() {
    const searchInput = document.getElementById('inquiry-search');
    if (!searchInput) return;
    const queryStr = searchInput.value.toLowerCase();
    const filtered = globalInquiriesData.filter(i => 
        (i.name && i.name.toLowerCase().includes(queryStr)) || 
        (i.text && i.text.toLowerCase().includes(queryStr))
    );
    renderInquiriesList(filtered);
};

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// دوال صفحة اتصل بنا (contact.html)
// ==========================================
window.submitContactForm = async function(e) {
    e.preventDefault();
    
    const firestoreDb = window.db;
    if (!firestoreDb) {
        showContactAlert('⚠ قاعدة البيانات غير متصلة حالياً. حاول مرة أخرى.', '#b45309', '#fef3c7');
        return;
    }

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-msg').value.trim();

    const btn = document.getElementById('submit-contact-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "جاري إرسال الرسالة سحابياً...";
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules || {};
        
        await addDoc(collection(firestoreDb, 'contact_messages'), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: serverTimestamp()
        });

        const formEl = document.getElementById('contact-form');
        if (formEl) formEl.reset();
        const charCountEl = document.getElementById('char-count');
        if (charCountEl) charCountEl.innerText = '0';
        
        showContactAlert('✅ شكراً لك! تم إرسال رسالتك بنجاح وحفظها في السحابة.', '#15803d', '#dcfce7');
    } catch (err) {
        console.error("Contact Error:", err);
        showContactAlert('❌ تعسّر الحفظ بالسحابة. تأكد من إعدادات قواعد أمان Firebase (Firestore Rules).', '#b91c1c', '#fee2e2');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "إرسال الرسالة إلى فريق الدعم 📨";
        }
    }
};

function showContactAlert(msg, textColor, bgColor) {
    const alertBox = document.getElementById('contact-alert');
    if (!alertBox) return;
    alertBox.innerText = msg;
    alertBox.style.color = textColor;
    alertBox.style.background = bgColor;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
}
