// Mobile nav (simple: toggle class + show/hide nav)
const navToggle = document.querySelector('.navToggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '14px';
    nav.style.position = 'absolute';
    nav.style.top = '62px';
    nav.style.right = '20px';
    nav.style.background = 'rgba(242,230,207,.98)';
    nav.style.padding = '14px';
    nav.style.border = '1px solid rgba(23,58,44,.15)';
    nav.style.borderRadius = '14px';
  });
}

// Hero slider
(function initSlider(){
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('[data-prev]');
  const nextBtn = slider.querySelector('[data-next]');
  const dotsWrap = slider.querySelector('[data-dots]');

  let idx = 0;
  const show = (i) => {
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, k) => d.classList.toggle('is-active', k === i));
    }
    idx = i;
  };

  if (dotsWrap) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => show(i));
      dotsWrap.appendChild(b);
    });
  }

  const next = () => show((idx + 1) % slides.length);
  const prev = () => show((idx - 1 + slides.length) % slides.length);

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // Auto-advance
  setInterval(next, 7000);

  show(0);
})();

// Testimonials
(function initQuotes(){
  const root = document.querySelector('[data-quotes]');
  if (!root) return;

  const quotes = Array.from(root.querySelectorAll('.quote'));
  const prev = root.querySelector('[data-qprev]');
  const next = root.querySelector('[data-qnext]');

  let i = 0;
  const show = (n) => {
    quotes.forEach((q, k) => q.classList.toggle('is-active', k === n));
    i = n;
  };
  prev?.addEventListener('click', () => show((i - 1 + quotes.length) % quotes.length));
  next?.addEventListener('click', () => show((i + 1) % quotes.length));

  show(0);
})();

// Video modal
(function initVideo(){
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');
  const closeEls = modal.querySelectorAll('[data-close]');
  const videoBtns = document.querySelectorAll('[data-video]');

  const open = (url) => {
    modal.hidden = false;
    // basic YouTube embed conversion (works if you paste an embed URL too)
    const embed = url.includes('youtube.com/watch')
      ? url.replace('watch?v=', 'embed/')
      : url;
    iframe.src = embed + (embed.includes('?') ? '&' : '?') + 'autoplay=1';
  };

  const close = () => {
    modal.hidden = true;
    iframe.src = '';
  };

  videoBtns.forEach(btn => btn.addEventListener('click', () => open(btn.dataset.video)));
  closeEls.forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
