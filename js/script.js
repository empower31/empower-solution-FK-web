document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
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

  /* ---------- Sticky header shrink + shadow on scroll ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          const link = navLinks.find((a) => a.getAttribute('href') === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ---------- Animated stat counters ---------- */
  const heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    const counters = heroStats.querySelectorAll('strong[data-count]');
    const animateCounters = () => {
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (prefersReducedMotion) {
          el.textContent = target.toLocaleString() + suffix;
          return;
        }
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };

    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStats);
  }

  /* ---------- Mouse tilt on cards ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonial-track');
  if (track) {
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById('t-dots');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      timer = setInterval(() => goTo(index + 1), 6000);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    const slider = document.getElementById('testimonial-slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    render();
    startAutoplay();
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form validation + interactive submit ---------- */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');
  const submitBtn = document.getElementById('submit-btn');

  if (form && formNote && submitBtn) {
    const fields = {
      name: { el: form.querySelector('#name'), validate: (v) => v.trim().length > 1, message: 'Please enter your full name.' },
      phone: { el: form.querySelector('#phone'), validate: (v) => v.replace(/\D/g, '').length >= 7, message: 'Please enter a valid phone number.' },
      email: { el: form.querySelector('#email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email address.' },
    };

    const showFieldError = (field, message) => {
      field.el.classList.toggle('invalid', Boolean(message));
      const errorEl = field.el.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.textContent = message || '';
    };

    const validateField = (key) => {
      const field = fields[key];
      const valid = field.validate(field.el.value);
      showFieldError(field, valid ? '' : field.message);
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('invalid')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const results = Object.keys(fields).map((key) => validateField(key));
      const allValid = results.every(Boolean);

      if (!allValid) {
        const firstInvalid = Object.values(fields).find((f) => f.el.classList.contains('invalid'));
        if (firstInvalid) {
          firstInvalid.el.classList.add('shake');
          firstInvalid.el.addEventListener('animationend', () => firstInvalid.el.classList.remove('shake'), { once: true });
          firstInvalid.el.focus();
        }
        formNote.textContent = 'Please fix the highlighted fields and try again.';
        formNote.className = 'form-note error';
        return;
      }

      submitBtn.classList.add('is-loading');
      formNote.textContent = '';
      formNote.className = 'form-note';

      window.setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        formNote.textContent = "Thank you! Your request has been received — we'll contact you within one business day.";
        formNote.className = 'form-note success';
        form.reset();
        Object.values(fields).forEach((field) => showFieldError(field, ''));
      }, 900);
    });
  }
});
