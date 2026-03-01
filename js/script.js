/* ==========================================================
   PORTFOLIO — js/script.js

   Responsibilities:
   1. Navbar — scroll shadow + active link highlighting
   2. Mobile hamburger menu
   3. Scroll-reveal animations (IntersectionObserver)
   4. Skill progress bar animations
   5. Staggered card reveal delays
   6. Contact form validation + simulated submit
   ========================================================== */

'use strict';

/* ── DOM References ──────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const allLinks   = navLinks ? navLinks.querySelectorAll('.nav-link') : [];


/* ──────────────────────────────────────────────────────────
   1. NAVBAR — scroll shadow
   ────────────────────────────────────────────────────────── */
function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // initialise on load


/* ──────────────────────────────────────────────────────────
   2. ACTIVE NAV LINK
   Strategy: compare each link's href filename against the
   current page's filename. Works for both root (index.html)
   and pages/ subdirectory layouts.
   ────────────────────────────────────────────────────────── */
function setActiveLink() {
  // Get the current page filename, e.g. "about.html" or "index.html"
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  allLinks.forEach(link => {
    const linkFile = link.getAttribute('href').split('/').pop();
    const isActive = linkFile === currentFile ||
                     // treat empty path / root as index.html
                     (currentFile === '' && linkFile === 'index.html');
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

setActiveLink();


/* ──────────────────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
   ────────────────────────────────────────────────────────── */
if (hamburger && navLinks) {

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when any nav link is clicked
  navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target)) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}


/* ──────────────────────────────────────────────────────────
   4. SCROLL-REVEAL ANIMATIONS
   ────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.10 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────────────────
   5. SKILL PROGRESS BAR ANIMATIONS
   Each .progress-bar element carries a data-width attribute
   (e.g., data-width="88"). The bar animates from 0% to that
   value when scrolled into view.
   ────────────────────────────────────────────────────────── */
const progressObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        // Slight delay lets the reveal animation settle first
        setTimeout(() => { bar.style.width = `${width}%`; }, 200);
        progressObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.progress-bar').forEach(bar => progressObserver.observe(bar));


/* ──────────────────────────────────────────────────────────
   6. STAGGERED CARD DELAYS
   Adds incremental transition-delay to sibling .reveal cards
   so they animate in as a flowing wave rather than all at once.
   ────────────────────────────────────────────────────────── */
const staggerParents = [
  '.projects-grid',
  '.skills-grid',
  '.cert-grid',
];

staggerParents.forEach(selector => {
  document.querySelectorAll(selector).forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((card, i) => {
      card.style.transitionDelay = `${i * 75}ms`;
    });
  });
});


/* ──────────────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION
   ────────────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm && formStatus) {

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let isValid = true;

    // Clear previous error states
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    formStatus.textContent = '';

    const nameField    = contactForm.querySelector('#name');
    const emailField   = contactForm.querySelector('#email');
    const messageField = contactForm.querySelector('#message');

    // Validate name
    if (!nameField.value.trim()) {
      nameField.classList.add('error');
      isValid = false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      emailField.classList.add('error');
      isValid = false;
    }

    // Validate message length
    if (messageField.value.trim().length < 10) {
      messageField.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      formStatus.style.color = '#e07070';
      formStatus.textContent = 'Please fill in all fields correctly.';
      return;
    }

    // Simulate async submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      formStatus.style.color = '#4d7c5f';
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      contactForm.reset();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }, 1400);
  });

  // Clear error state as user types
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      // Only clear error status text (not success message)
      if (formStatus.style.color !== 'rgb(77, 124, 95)') {
        formStatus.textContent = '';
      }
    });
  });
}
