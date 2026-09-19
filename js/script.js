document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('active', isOpen);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky header shadow on scroll
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 18px rgba(14, 42, 74, 0.14)'
      : '0 2px 12px rgba(14, 42, 74, 0.08)';
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form (front-end only demo submission)
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  if (form && formNote) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name');
      const phone = form.querySelector('#phone');
      const email = form.querySelector('#email');

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (!name.value.trim() || !phone.value.trim() || !isValidEmail) {
        formNote.textContent = 'Please fill in your name, phone, and a valid email address.';
        formNote.className = 'form-note error';
        return;
      }

      formNote.textContent = "Thank you! Your request has been received — we'll contact you within one business day.";
      formNote.className = 'form-note success';
      form.reset();
    });
  }
});
