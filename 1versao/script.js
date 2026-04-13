document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll effect ── */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ── Reveal on scroll ── */
  const ANIMATION_DURATIONS = { reveal: 800, counter: 3200 };
  const animatingElements = new Map();

  function resetElement(el) {
    el.classList.remove('is-visible');
    const counter = el.querySelector('.counter');
    if (counter) {
      counter.innerText = '0';
      if (counter._raf) cancelAnimationFrame(counter._raf);
    }
  }

  function animateElement(el) {
    el.classList.add('is-visible');
    let duration = ANIMATION_DURATIONS.reveal;

    const counter = el.querySelector('.counter');
    if (counter) {
      duration = Math.max(duration, ANIMATION_DURATIONS.counter);
      const target = parseInt(counter.getAttribute('data-target'));
      const totalDuration = 3000;
      const startTime = performance.now();
      if (counter._raf) cancelAnimationFrame(counter._raf);

      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.innerText = Math.round(eased * target);
        if (progress < 1) counter._raf = requestAnimationFrame(updateCounter);
      }
      counter._raf = requestAnimationFrame(updateCounter);
    }

    const timeout = setTimeout(() => {
      animatingElements.delete(el);
    }, duration);
    animatingElements.set(el, timeout);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!entry.target.classList.contains('is-visible')) {
          animateElement(entry.target);
        }
      } else {
        if (!animatingElements.has(entry.target)) {
          resetElement(entry.target);
        } else {
          const existing = animatingElements.get(entry.target);
          clearTimeout(existing);
          const newT = setTimeout(() => {
            animatingElements.delete(entry.target);
            const rect = entry.target.getBoundingClientRect();
            if (!(rect.top < window.innerHeight && rect.bottom > 0)) {
              resetElement(entry.target);
            }
          }, 800);
          animatingElements.set(entry.target, newT);
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
