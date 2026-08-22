// ── THEME TOGGLE (dark / light) ──
const rootEl = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const THEME_LABELS = { light: 'Switch to dark mode', dark: 'Switch to light mode' };

function setTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeBtn) themeBtn.setAttribute('aria-label', THEME_LABELS[theme]);
}

if (themeBtn) {
  setTheme(rootEl.getAttribute('data-theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}


// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}


// ── MOBILE NAV ──
const navToggleBtn = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggleBtn && mobileMenu) {
  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    navToggleBtn.classList.toggle('open', open);
    navToggleBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  navToggleBtn.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu(false);
  });
}


// ── SCROLL FADE-UP ANIMATION ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// ── CONTACT FORM SUBMIT ──
// Set your real inbox here. This opens the visitor's email app with a
// pre-filled message — no backend needed. Swap for EmailJS/Formspree later if you want.
const CONTACT_EMAIL = 'kiranganji0406@gmail.com';

const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const subjectLine = `[Portfolio] ${subject}`;
    const body = `Hi Kiran Ganji,\n\n${message}\n\n— ${name} (${email})`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

    document.getElementById('form-name').value = '';
    document.getElementById('form-email').value = '';
    document.getElementById('form-subject').value = '';
    document.getElementById('form-message').value = '';
  });
}


// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));


// ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // let bare "#" links jump to top naturally
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── FOOTER YEAR ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── INTERACTIVE GLASS SPOTLIGHT TRACKING ──
const glassElements = document.querySelectorAll(
  '.highlight-card, .skill-cell, .project-card, .edu-card, .contact-form, .contact-link'
);

glassElements.forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  });
});

