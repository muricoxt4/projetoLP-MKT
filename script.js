/* ── Estado privado do formulário (não exposto em window) ── */
const _formState = { loadTime: 0 };

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll effect ── */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    try {
      header.classList.toggle('scrolled', window.scrollY > 50);
    } catch (e) { /* header pode não existir em páginas parciais */ }
  });

  /* ── Mobile menu button ── */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const target = document.getElementById('diagnostico');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

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

  /* ── Anti-spam: registra o momento em que a página carregou (privado) ── */
  _formState.loadTime = Date.now();

});


/* ═══════════════════════════════════════════
   UTILITÁRIOS DE VALIDAÇÃO E SANITIZAÇÃO
   ═══════════════════════════════════════════ */

/* Remove caracteres que podem injetar HTML/scripts e limita o tamanho */
function sanitize(str) {
  return str
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, 200);
}

/* Valida formato mínimo de e-mail */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}


/* ═══════════════════════════════════════════
   FORM SUBMISSION + ANTI-SPAM
   ═══════════════════════════════════════════ */

var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxtkm7bLEu7bWfB4J1-EQEM7ioqNPG2FU-zw2NtMi-KQ-0HybXeUFlxgqQb5iTTV7G9NQ/exec';
var WHATSAPP_URL = 'https://wa.me/5542998542014?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20saber%20mais%20sobre%20o%20diagn%C3%B3stico%20de%20growth.';
var MIN_TIME_SECONDS = 3;

function handleFormSubmit() {
  var nameInput  = document.getElementById('contact-name');
  var emailInput = document.getElementById('contact-email');
  var phoneInput = document.getElementById('contact-phone');
  var honeypot   = document.getElementById('contact-website');
  var btn        = document.getElementById('submitBtn');

  /* Limpa erros anteriores */
  [nameInput, emailInput, phoneInput].forEach(function(el) {
    el.classList.remove('error');
  });
  var prevErr = document.getElementById('form-network-error');
  if (prevErr) prevErr.remove();

  /* ── Anti-spam 1: Honeypot ──
     Campo invisível. Se foi preenchido, é bot. Finge que enviou. */
  if (honeypot && honeypot.value.trim() !== '') {
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    setTimeout(function() { showSuccess(); }, 1500);
    return;
  }

  /* ── Anti-spam 2: Tempo mínimo ──
     Envio em menos de 3s após carregar = bot. Finge que enviou. */
  var elapsed = (Date.now() - (_formState.loadTime || 0)) / 1000;
  if (elapsed < MIN_TIME_SECONDS) {
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    setTimeout(function() { showSuccess(); }, 1500);
    return;
  }

  /* ── Validação dos campos ── */
  var hasError = false;

  if (!nameInput.value.trim()) {
    nameInput.classList.add('error');
    nameInput.focus();
    hasError = true;
  }

  var emailVal = emailInput.value.trim();
  if (emailVal && !isValidEmail(emailVal)) {
    emailInput.classList.add('error');
    if (!hasError) emailInput.focus();
    hasError = true;
  }

  var phoneDigits = phoneInput.value.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    phoneInput.classList.add('error');
    if (!hasError) phoneInput.focus();
    hasError = true;
  }

  if (hasError) return;

  /* ── Envio real para o Google Sheets ── */
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  var payload = {
    nome:     sanitize(nameInput.value),
    email:    sanitize(emailInput.value),
    telefone: sanitize(phoneInput.value)
  };

fetch(GOOGLE_SHEETS_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify(payload)
})
.then(function(response) {
  return response.json();
})
.then(function(result) {
  if (result.status === 'ok') {
    showSuccess();
  } else {
    showNetworkError(btn);
    console.error(result);
  }
})
.catch(function(error) {
  showNetworkError(btn);
  console.error(error);
});
}

function showNetworkError(btn) {
  btn.disabled = false;
  btn.innerHTML = 'QUERO MEU DIAGNÓSTICO ESTRATÉGICO <span class="arrow">→</span>';

  var errDiv = document.createElement('div');
  errDiv.id = 'form-network-error';
  errDiv.className = 'form-network-error';
  errDiv.innerHTML =
    'Falha no envio. Verifique sua conexão e tente novamente, ou ' +
    '<a href="' + WHATSAPP_URL + '" target="_blank" rel="noopener">fale direto pelo WhatsApp</a>.';

  btn.parentNode.insertBefore(errDiv, btn);
}

function showSuccess() {
  var card = document.querySelector('.contact-form-card');
  card.innerHTML =
    '<div class="form-success">' +
      '<div class="success-icon">' +
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none">' +
          '<path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M22 4L12 14.01l-3-3" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<h3>Recebemos seu contato!</h3>' +
      '<p>Nossa equipe vai analisar seu cenário e entrar em contato em até 24 horas. Fique de olho no seu telefone.</p>' +
    '</div>';
}
