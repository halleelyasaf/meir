// ===== Language Switch =====
let currentLang = 'he';

function setLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;
  
  if (lang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    document.body.classList.add('lang-en');
    document.querySelector('.lang-he').style.display = 'none';
    document.querySelector('.lang-en').style.display = 'inline';
  } else {
    html.setAttribute('lang', 'he');
    html.setAttribute('dir', 'rtl');
    document.body.classList.remove('lang-en');
    document.querySelector('.lang-he').style.display = 'inline';
    document.querySelector('.lang-en').style.display = 'none';
  }

  // Update all elements with data-he / data-en
  document.querySelectorAll('[data-he]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null && text !== '') {
      el.textContent = text;
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-he]').forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.placeholder = ph;
  });

  // Update title
  if (lang === 'en') {
    document.title = "Bernstein & Co. | Real Estate Law Firm | Jerusalem";
  } else {
    document.title = "ברנשטיין ושות' | משרד עורכי דין למקרקעין | ירושלים";
  }

  // Save preference
  localStorage.setItem('bernstein-lang', lang);
}

// Language toggle button
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'he' ? 'en' : 'he');
  });
}

// Load saved language
const savedLang = localStorage.getItem('bernstein-lang');
if (savedLang === 'en') {
  setLanguage('en');
} else {
  // Set initial placeholders for Hebrew
  document.querySelectorAll('[data-placeholder-he]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-he') || '';
  });
}

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

// ===== Header Scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Active Nav on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== Footer Year =====
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Accessibility Panel =====
const a11yToggle = document.getElementById('a11yToggle');
const a11yPanel = document.getElementById('a11yPanel');
const a11yClose = document.getElementById('a11yClose');

if (a11yToggle && a11yPanel) {
  a11yToggle.addEventListener('click', () => {
    a11yPanel.classList.toggle('open');
    a11yPanel.setAttribute('aria-hidden', a11yPanel.classList.contains('open') ? 'false' : 'true');
  });

  if (a11yClose) {
    a11yClose.addEventListener('click', () => {
      a11yPanel.classList.remove('open');
      a11yPanel.setAttribute('aria-hidden', 'true');
    });
  }
}

// Font size
let fontSize = 16;
const a11yFontUp = document.getElementById('a11yFontUp');
const a11yFontDown = document.getElementById('a11yFontDown');

if (a11yFontUp) {
  a11yFontUp.addEventListener('click', () => {
    if (fontSize < 22) {
      fontSize += 2;
      document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
    }
  });
}

if (a11yFontDown) {
  a11yFontDown.addEventListener('click', () => {
    if (fontSize > 14) {
      fontSize -= 2;
      document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
    }
  });
}

// High contrast
const a11yContrast = document.getElementById('a11yContrast');
if (a11yContrast) {
  a11yContrast.addEventListener('click', () => {
    document.body.classList.toggle('a11y-contrast');
  });
}

// Underline links
const a11yUnderline = document.getElementById('a11yUnderline');
if (a11yUnderline) {
  a11yUnderline.addEventListener('click', () => {
    document.body.classList.toggle('a11y-underline');
  });
}

// Reset accessibility
const a11yReset = document.getElementById('a11yReset');
if (a11yReset) {
  a11yReset.addEventListener('click', () => {
    fontSize = 16;
    document.documentElement.style.setProperty('--font-size-base', '16px');
    document.body.classList.remove('a11y-contrast', 'a11y-underline');
  });
}

// ===== Contact Form (Formspree) =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = currentLang === 'he' ? 'שולח...' : 'Sending...';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 5000);
        }
      } else {
        alert(currentLang === 'he' ? 'אירעה שגיאה בשליחה. נסה שוב או שלח אימייל ישירות.' : 'An error occurred. Please try again or email us directly.');
      }
    } catch (err) {
      alert(currentLang === 'he' ? 'אירעה שגיאה בשליחה. נסה שוב או שלח אימייל ישירות.' : 'An error occurred. Please try again or email us directly.');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  });
}

// ===== Articles Expand / Collapse =====
document.querySelectorAll('.article-card').forEach(card => {
  const toggles = card.querySelectorAll('.article-toggle');
  const full = card.querySelector('.article-full');
  const readMoreBtn = toggles[0]; // the first "Read more" button

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = full.classList.contains('open');

      // Close all other open articles
      document.querySelectorAll('.article-full.open').forEach(el => {
        if (el !== full) {
          el.classList.remove('open');
          const otherCard = el.closest('.article-card');
          const otherReadMore = otherCard.querySelectorAll('.article-toggle')[0];
          if (otherReadMore) otherReadMore.style.display = '';
        }
      });

      if (isOpen) {
        full.classList.remove('open');
        if (readMoreBtn) readMoreBtn.style.display = '';
      } else {
        full.classList.add('open');
        if (readMoreBtn) readMoreBtn.style.display = 'none';
      }
    });
  });
});
// ===== Automatic GitHub PR Generator =====
const openModalBtn = document.getElementById('openArticleModalBtn');
const closeModalBtn = document.getElementById('closeArticleModalBtn');
const articleModal = document.getElementById('articleModal');
const createArticleForm = document.getElementById('createArticleForm');
const ghStatusMessage = document.getElementById('ghStatusMessage');

if (openModalBtn && articleModal) {
  openModalBtn.addEventListener('click', () => articleModal.classList.add('open'));
  closeModalBtn.addEventListener('click', () => articleModal.classList.remove('open'));
}

if (createArticleForm) {
  createArticleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Get or prompt for GitHub Fine-Grained Token
    let token = localStorage.getItem('gh_pat_token');
    if (!token) {
      token = prompt("הזן GitHub Personal Access Token עם הרשאות Contents & Pull Requests:");
      if (!token) return;
      localStorage.setItem('gh_pat_token', token);
    }

    const submitBtn = document.getElementById('submitArticleBtn');
    submitBtn.disabled = true;
    ghStatusMessage.style.color = "var(--navy)";
    ghStatusMessage.innerHTML = "מתחבר ל-GitHub ויוצר Pull Request...";

    const title = document.getElementById('newArtTitle').value;
    const tag = document.getElementById('newArtTag').value;
    const date = document.getElementById('newArtDate').value;
    const excerpt = document.getElementById('newArtExcerpt').value;
    const content = document.getElementById('newArtContent').value;

    const repoOwner = "halleelyasaf";
    const repoName = "meir";
    const branchName = `article-${Date.now()}`;

    try {
      // 2. Get reference SHA of main branch
      const refRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`, {
        headers: { 'Authorization': `token ${token}` }
      });
      const refData = await refRes.json();
      const mainSha = refData.object.sha;

      // 3. Create new branch
      await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
        method: 'POST',
        headers: { 
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: mainSha
        })
      });

      // 4. Get index.html file content
      const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html?ref=main`, {
        headers: { 'Authorization': `token ${token}` }
      });
      const fileData = await fileRes.json();
      
      // Decode Base64 UTF-8 string properly
      const decoder = new TextDecoder('utf-8');
      const bytes = Uint8Array.from(atob(fileData.content.replace(/\n/g, '')), c => c.charCodeAt(0));
      let htmlContent = decoder.decode(bytes);

      // 5. Construct new article HTML block
      const newArticleHTML = `
        <!-- Article -->
        <article class="article-card">
          <div class="article-meta">
            <span class="article-date" data-he="${date}" data-en="${date}">${date}</span>
            <span class="article-tag" data-he="${tag}" data-en="${tag}">${tag}</span>
          </div>
          <h3 class="article-title" data-he="${title}" data-en="${title}">${title}</h3>
          <p class="article-excerpt" data-he="${excerpt}" data-en="${excerpt}">${excerpt}</p>
          <button class="article-toggle btn-text" data-he="קרא עוד ←" data-en="Read more →">קרא עוד ←</button>
          <div class="article-full">
            <p data-he="${content}" data-en="${content}">${content}</p>
            <button class="article-toggle btn-text" data-he="סגור ↑" data-en="Close ↑">סגור ↑</button>
          </div>
        </article>
      `;

      // Inject new article into <div class="articles-grid">
      const targetTag = '<div class="articles-grid">';
      htmlContent = htmlContent.replace(targetTag, `${targetTag}\n${newArticleHTML}`);

      // Encode UTF-8 back to Base64
      const encoder = new TextEncoder();
      const encodedBytes = encoder.encode(htmlContent);
      let binaryStr = '';
      encodedBytes.forEach(b => binaryStr += String.fromCharCode(b));
      const newContentBase64 = btoa(binaryStr);

      // 6. Commit updated index.html to new branch
      await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html`, {
        method: 'PUT',
        headers: { 
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          message: `Add new article: ${title}`,
          content: newContentBase64,
          sha: fileData.sha,
          branch: branchName
        })
      });

      // 7. Create Pull Request
      const prRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
        method: 'POST',
        headers: { 
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: `מאמר חדש: ${title}`,
          head: branchName,
          base: 'main',
          body: `בקשה להוספת מאמר חדש:\n\n**כותרת:** ${title}\n**תגית:** ${tag}\n**תאריך:** ${date}`
        })
      });

      const prData = await prRes.json();

      ghStatusMessage.style.color = "#065F46";
      ghStatusMessage.innerHTML = `✓ ה-Pull Request נוצר בהצלחה!<br><a href="${prData.html_url}" target="_blank" style="text-decoration:underline; font-weight:bold;">לחץ כאן לאישור ה-PR ב-GitHub ←</a>`;
      createArticleForm.reset();

    } catch (err) {
      console.error(err);
      ghStatusMessage.style.color = "#DC2626";
      ghStatusMessage.innerHTML = "אירעה שגיאה. ודא שמפתח ה-GitHub תקין ונסה שוב.";
    }

    submitBtn.disabled = false;
  });
}
// ===== Automatic GitHub PR Generator via Node Server =====
const openModalBtn = document.getElementById('openArticleModalBtn');
const closeModalBtn = document.getElementById('closeArticleModalBtn');
const articleModal = document.getElementById('articleModal');
const createArticleForm = document.getElementById('createArticleForm');
const ghStatusMessage = document.getElementById('ghStatusMessage');

if (openModalBtn && articleModal) {
  openModalBtn.addEventListener('click', () => articleModal.classList.add('open'));
  closeModalBtn.addEventListener('click', () => articleModal.classList.remove('open'));
}

if (createArticleForm) {
  createArticleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitArticleBtn');
    submitBtn.disabled = true;
    ghStatusMessage.style.color = "var(--navy)";
    ghStatusMessage.innerHTML = "מתחבר ל-GitHub ויוצר Pull Request...";

    const payload = {
      title: document.getElementById('newArtTitle').value,
      tag: document.getElementById('newArtTag').value,
      date: document.getElementById('newArtDate').value,
      excerpt: document.getElementById('newArtExcerpt').value,
      content: document.getElementById('newArtContent').value
    };

    try {
      const res = await fetch('/api/create-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        ghStatusMessage.style.color = "#065F46";
        ghStatusMessage.innerHTML = `✓ ה-Pull Request נוצר בהצלחה!<br><a href="${data.prUrl}" target="_blank" style="text-decoration:underline; font-weight:bold;">לחץ כאן לאישור ה-PR ב-GitHub ←</a>`;
        createArticleForm.reset();
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (err) {
      console.error(err);
      ghStatusMessage.style.color = "#DC2626";
      ghStatusMessage.innerHTML = "אירעה שגיאה ביצירת ה-PR. נסה שוב מאוחר יותר.";
    }

    submitBtn.disabled = false;
  });
}



