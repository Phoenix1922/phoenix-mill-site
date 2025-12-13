console.log("main.js loaded OK");

// ------------------------------
// Mobile nav
// ------------------------------
const navToggle = document.querySelector('.navToggle');
const nav = document.querySelector('.nav');

function setNavOpen(isOpen) {
  if (!navToggle || !nav) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '14px';
    nav.style.position = 'absolute';
    nav.style.top = '62px';
    nav.style.right = '20px';
    nav.style.background = 'rgba(242,230,207,.98)';
    nav.style.padding = '14px';
    nav.style.border = '1px solid rgba(23,58,44,.15)';
    nav.style.borderRadius = '14px';
    nav.style.boxShadow = '0 10px 28px rgba(0,0,0,.10)';
  } else {
    // Let your CSS control desktop nav; on mobile we hide it
    nav.style.display = 'none';
  }
}

if (navToggle && nav) {
  // Start closed on mobile widths
  if (window.matchMedia('(max-width: 900px)').matches) {
    setNavOpen(false);
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!expanded);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (!expanded) return;
    if (nav.contains(e.target) || navToggle.contains(e.target)) return;
    setNavOpen(false);
  });

  // If you resize back to desktop, restore normal CSS behavior
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) {
      nav.style.display = 'flex';
      nav.style.position = '';
      nav.style.top = '';
      nav.style.right = '';
      nav.style.flexDirection = '';
      nav.style.gap = '';
      nav.style.background = '';
      nav.style.padding = '';
      nav.style.border = '';
      nav.style.borderRadius = '';
      nav.style.boxShadow = '';
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      // On mobile, keep it closed unless explicitly opened
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(expanded);
    }
  });
}


// ------------------------------
// Hero slider
// ------------------------------
(function initSlider(){
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  if (!slides.length) {
    console.log("No .slide elements found inside [data-slider].");
    return;
  }

  const prevBtn = slider.querySelector('[data-prev]');
  const nextBtn = slider.querySelector('[data-next]');
  const dotsWrap = slider.querySelector('[data-dots]');

  let idx = slides.findIndex(s => s.classList.contains('is-active'));
  if (idx < 0) idx = 0;

  const setActive = (i) => {
    const safe = ((i % slides.length) + slides.length) % slides.length;

    slides.forEach((s, k) => s.classList.toggle('is-active', k === safe));

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, k) =>
        d.classList.toggle('is-active', k === safe)
      );
    }

    idx = safe;
  };

  // Build dots once
  if (dotsWrap && !dotsWrap.dataset.built) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => {
        stopAuto();
        setActive(i);
        startAuto();
      });
      dotsWrap.appendChild(b);
    });
    dotsWrap.dataset.built = 'true';
  }

  const next = () => setActive(idx + 1);
  const prev = () => setActive(idx - 1);

  nextBtn?.addEventListener('click', () => {
    stopAuto();
    next();
    startAuto();
  });

  prevBtn?.addEventListener('click', () => {
    stopAuto();
    prev();
    startAuto();
  });

  // Optional: swipe on mobile
  let startX = null;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches?.[0]?.clientX ?? null;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? null;
    if (endX == null) return;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) {
      stopAuto();
      dx < 0 ? next() : prev();
      startAuto();
    }
    startX = null;
  }, { passive: true });

  // Auto-advance (pauses when tab hidden)
  let timer = null;

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 7000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // Initialize state and run
  setActive(idx);
  startAuto();
})();


// ------------------------------
// Testimonials
// ------------------------------
(function initQuotes(){
  const root = document.querySelector('[data-quotes]');
  if (!root) return;

  const quotes = Array.from(root.querySelectorAll('.quote'));
  if (!quotes.length) return;

  const prev = root.querySelector('[data-qprev]');
  const next = root.querySelector('[data-qnext]');

  let i = quotes.findIndex(q => q.classList.contains('is-active'));
  if (i < 0) i = 0;

  const show = (n) => {
    const safe = ((n % quotes.length) + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle('is-active', k === safe));
    i = safe;
  };

  prev?.addEventListener('click', () => show(i - 1));
  next?.addEventListener('click', () => show(i + 1));

  show(i);
})();


// ------------------------------
// Video modal
// ------------------------------
(function initVideo(){
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');
  if (!iframe) return;

  const closeEls = modal.querySelectorAll('[data-close]');
  const videoBtns = document.querySelectorAll('[data-video]');

  const toEmbed = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    return url;
  };

  const open = (url) => {
    modal.hidden = false;
    const embed = toEmbed(url);
    iframe.src = embed + (embed.includes('?') ? '&' : '?') + 'autoplay=1';
  };

  const close = () => {
    modal.hidden = true;
    iframe.src = '';
  };

  videoBtns.forEach(btn => btn.addEventListener('click', () => open(btn.dataset.video)));
  closeEls.forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Click outside panel closes
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
})();


// ------------------------------
// Footer year
// ------------------------------
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
