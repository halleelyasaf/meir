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

