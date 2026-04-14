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

  /* ── Phone input mask (XX) XXXXX-XXXX ── */
  const phoneInput = document.getElementById('contact-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 6) {
        val = '(' + val.slice(0, 2) + ') ' + val.slice(2, 7) + '-' + val.slice(7);
      } else if (val.length > 2) {
        val = '(' + val.slice(0, 2) + ') ' + val.slice(2);
      } else if (val.length > 0) {
        val = '(' + val;
      }
      e.target.value = val;
    });
  }

});

/* ── Form submission handler (global) ── */
function handleFormSubmit() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const btn = document.getElementById('submitBtn');

  // Reset errors
  [nameInput, phoneInput].forEach(el => el.classList.remove('error'));

  // Validate
  let hasError = false;
  if (!nameInput.value.trim()) {
    nameInput.classList.add('error');
    nameInput.focus();
    hasError = true;
  }
  const phoneDigits = phoneInput.value.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    phoneInput.classList.add('error');
    if (!hasError) phoneInput.focus();
    hasError = true;
  }

  if (hasError) return;

  // Simulate sending (replace with real endpoint)
  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">Enviando...</span>';

  setTimeout(() => {
    const card = document.querySelector('.contact-form-card');
    card.innerHTML = `
      <div class="form-success">
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M22 4L12 14.01l-3-3" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>Recebemos seu contato!</h3>
        <p>Nossa equipe vai analisar seu cenário e entrar em contato em até 24 horas. Fique de olho no seu telefone.</p>
      </div>
    `;
  }, 1500);
}
