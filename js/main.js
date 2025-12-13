console.log("main.js loaded OK");

/* ---------------------------
   Mobile nav
---------------------------- */
const navToggle = document.querySelector(".navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));

    nav.style.display = expanded ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.gap = "14px";
    nav.style.position = "absolute";
    nav.style.top = "62px";
    nav.style.right = "20px";
    nav.style.background = "rgba(242,230,207,.98)";
    nav.style.padding = "14px";
    nav.style.border = "1px solid rgba(23,58,44,.15)";
    nav.style.borderRadius = "14px";
    nav.style.zIndex = "60";
  });
}

/* ---------------------------
   HERO CAROUSEL (Prestige-style)
   Uses EXISTING .hero__track
---------------------------- */
(function initHeroSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector(".hero__track");
  const slides = Array.from(track.querySelectorAll(".slide"));

  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  let index = 0;
  let timer = null;
  let paused = false;

  // Ensure correct sizing
  track.style.display = "flex";
  track.style.width = `${slides.length * 100}%`;
  slides.forEach(slide => {
    slide.style.width = `${100 / slides.length}%`;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * (100 / slides.length)}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((d, i) =>
      d.classList.toggle("is-active", i === index)
    );
  }

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  // Auto-advance
  function start() {
    stop();
    timer = setInterval(() => {
      if (!paused) next();
    }, 6000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  slider.addEventListener("mouseenter", () => paused = true);
  slider.addEventListener("mouseleave", () => paused = false);
  slider.addEventListener("focusin", () => paused = true);
  slider.addEventListener("focusout", () => paused = false);

  // Touch swipe
  let startX = 0;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    paused = true;
  }, { passive: true });

  slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    paused = false;

    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // Init
  go(0);
  start();
})();

/* ---------------------------
   Testimonials
---------------------------- */
(function initQuotes() {
  const root = document.querySelector("[data-quotes]");
  if (!root) return;

  const quotes = [...root.querySelectorAll(".quote")];
  const prev = root.querySelector("[data-qprev]");
  const next = root.querySelector("[data-qnext]");

  if (quotes.length <= 1) return;

  let i = 0;
  function show(n) {
    i = (n + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle("is-active", k === i));
  }

  prev && prev.addEventListener("click", () => show(i - 1));
  next && next.addEventListener("click", () => show(i + 1));

  show(0);
})();

/* ---------------------------
   Video modal
---------------------------- */
(function initVideo() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const iframe = modal.querySelector("iframe");
  const closeEls = modal.querySelectorAll("[data-close]");
  const videoBtns = document.querySelectorAll("[data-video]");

  function open(url) {
    modal.hidden = false;
    const embed = url.includes("youtube.com/watch")
      ? url.replace("watch?v=", "embed/")
      : url;
    iframe.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
  }

  function close() {
    modal.hidden = true;
    iframe.src = "";
  }

  videoBtns.forEach(btn =>
    btn.addEventListener("click", () => open(btn.dataset.video))
  );

  closeEls.forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
})();

/* ---------------------------
   Footer year
---------------------------- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
