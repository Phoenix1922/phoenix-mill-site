console.log("main.js loaded OK");

/* Mobile nav */
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

/* Hero Slider (horizontal, forced widths for Safari) */
(function initSlider(){
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  // Create track that matches CSS: .slidesTrack
  const track = document.createElement("div");
  track.className = "slidesTrack";

  // Move slides into track
  slides.forEach(s => track.appendChild(s));

  // Put track at top (buttons/dots remain after it)
  slider.insertBefore(track, slider.firstChild);

  // FORCE track width so Safari can't reflow slides into the same frame
  track.style.width = `${slides.length * 100}%`;
  slides.forEach(s => {
    s.style.width = `${100 / slides.length}%`;
    s.style.flex = `0 0 ${100 / slides.length}%`;
  });

  let idx = 0;
  let timer = null;
  let isPaused = false;

  const setActiveDot = () => {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((d, k) => {
      d.classList.toggle("is-active", k === idx);
    });
  };

  const go = (i) => {
    idx = (i + slides.length) % slides.length;
    const pct = (100 / slides.length) * idx;
    track.style.transform = `translate3d(-${pct}%, 0, 0)`;
    setActiveDot();
  };

  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  // Auto-advance
  const start = () => {
    stop();
    timer = setInterval(() => {
      if (!isPaused) next();
    }, 5200);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  slider.addEventListener("mouseenter", () => { isPaused = true; });
  slider.addEventListener("mouseleave", () => { isPaused = false; });
  slider.addEventListener("focusin", () => { isPaused = true; });
  slider.addEventListener("focusout", () => { isPaused = false; });

  // Touch swipe
  let startX = 0;
  let isDown = false;

  slider.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches.length) return;
    isDown = true;
    startX = e.touches[0].clientX;
    isPaused = true;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    if (!isDown) return;
    isDown = false;
    isPaused = false;

    const endX = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;

    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  go(0);
  start();
})();

/* Parallax (layer approach: no weird “background seams”) */
(function initParallax(){
  const sections = Array.from(document.querySelectorAll(".parallax"));
  if (!sections.length) return;

  // Build background layers once
  for (const el of sections) {
    // Pull existing background-image (from inline style)
    const bg = getComputedStyle(el).backgroundImage;

    // Create layer if not already present
    if (!el.querySelector(".parallax__bg")) {
      const layer = document.createElement("div");
      layer.className = "parallax__bg";
      layer.style.backgroundImage = bg;
      el.prepend(layer);
    }

    // Clear background on the section so only the layer renders
    el.style.backgroundImage = "none";
  }

  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    for (const el of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;

      const layer = el.querySelector(".parallax__bg");
      if (!layer) continue;

      // 0 at top of viewport, 1 at bottom
      const progress = (rect.top + rect.height) / (vh + rect.height);
      const offset = (progress - 0.5) * 80; // strength

      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
})();

/* Testimonials */
(function initQuotes(){
  const root = document.querySelector("[data-quotes]");
  if (!root) return;

  const quotes = Array.from(root.querySelectorAll(".quote"));
  const prev = root.querySelector("[data-qprev]");
  const next = root.querySelector("[data-qnext]");
  if (quotes.length <= 1) return;

  let i = 0;
  const show = (n) => {
    i = (n + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle("is-active", k === i));
  };

  prev && prev.addEventListener("click", () => show(i - 1));
  next && next.addEventListener("click", () => show(i + 1));
  show(0);
})();

/* Video modal */
(function initVideo(){
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const iframe = modal.querySelector("iframe");
  const closeEls = modal.querySelectorAll("[data-close]");
  const videoBtns = document.querySelectorAll("[data-video]");

  const open = (url) => {
    modal.hidden = false;
    const embed = url.includes("youtube.com/watch")
      ? url.replace("watch?v=", "embed/")
      : url;
    iframe.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
  };

  const close = () => {
    modal.hidden = true;
    iframe.src = "";
  };

  videoBtns.forEach(btn => btn.addEventListener("click", () => open(btn.dataset.video)));
  closeEls.forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

/* Footer year */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
