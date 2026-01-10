/**
 * Phoenix Mill Events — main.js
 *
 * PURPOSE
 * - Mobile navigation toggle
 * - Hero carousel (horizontal slider with arrows, dots, auto-advance, swipe)
 * - Event Types tab switcher (buttons control images + text panes)
 * - Optional: testimonials rotator (only runs if the section exists)
 * - Optional: video modal (only runs if the modal exists)
 * - Footer year auto-fill
 * - Parallax band (lightweight, iPhone-safe faux parallax)
 *
 * NOTES
 * - This file is sanitized to remove non‑breaking spaces and other invisible characters.
 * - All features are guarded so missing sections won't throw errors.
 */

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

/* Hero Slider (pixel-perfect horizontal slide, no peeking) */
(function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  // Prefer an existing track if present (matches your HTML). If not, create one.
  let track = slider.querySelector("[data-track]") || slider.querySelector(".hero__track");

  // Slides may already live inside a track (your current index.html), or directly under slider.
  const slides = track
    ? Array.from(track.querySelectorAll(".slide"))
    : Array.from(slider.querySelectorAll(".slide"));

  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  // If there is no track, build one and move slides into it.
  if (!track) {
    track = document.createElement("div");
    track.className = "hero__track";
    track.setAttribute("data-track", "");
    slides.forEach((s) => track.appendChild(s));
    slider.insertBefore(track, slider.firstChild);
  }

  let idx = 0;
  let timer = null;
  let isPaused = false;

  function setActiveDot() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((d, k) => {
      d.classList.toggle("is-active", k === idx);
    });
  }

  function applyTransform(instant = false) {
    const w = slider.clientWidth || 1;

    if (instant) track.classList.add("is-instant");
    track.style.transform = `translate3d(-${idx * w}px, 0, 0)`;
    if (instant) {
      // Allow the browser to apply the transform, then re-enable transitions.
      requestAnimationFrame(() => track.classList.remove("is-instant"));
    }
  }

  function go(i, instant = false) {
    idx = (i + slides.length) % slides.length;
    applyTransform(instant);
    setActiveDot();
  }

  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Auto-advance
  function start() {
    stop();
    timer = window.setInterval(() => {
      if (!isPaused) next();
    }, 4500);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Pause on hover/focus
  slider.addEventListener("mouseenter", () => (isPaused = true));
  slider.addEventListener("mouseleave", () => (isPaused = false));
  slider.addEventListener("focusin", () => (isPaused = true));
  slider.addEventListener("focusout", () => (isPaused = false));

  // Touch swipe
  let startX = 0;
  let isDown = false;

  slider.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || !e.touches.length) return;
      isDown = true;
      startX = e.touches[0].clientX;
      isPaused = true;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      if (!isDown) return;
      isDown = false;
      isPaused = false;

      const endX =
        e.changedTouches && e.changedTouches.length
          ? e.changedTouches[0].clientX
          : startX;

      const dx = endX - startX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    },
    { passive: true }
  );

  // Re-measure on resize (prevents drift after window size changes)
  window.addEventListener("resize", () => applyTransform(true));

  // Init
  go(0, true);
  start();
})();

/* Testimonials (optional section — safe if not present) */
(function initQuotes() {
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

  if (prev) prev.addEventListener("click", () => show(i - 1));
  if (next) next.addEventListener("click", () => show(i + 1));

  show(0);
})();

/* Video modal (optional — safe if not present) */
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

  videoBtns.forEach((btn) =>
    btn.addEventListener("click", () => open(btn.dataset.video))
  );

  closeEls.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* Footer year (expects <span id="year"></span> in your footer) */
(function setFooterYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* Faux-parallax (works on iPhone + desktop) */
(function initParallax() {
  const sections = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let ticking = false;

  function update() {
    ticking = false;

    const vh = window.innerHeight || 1;

    sections.forEach((section) => {
      const media = section.querySelector("[data-parallax-media]");
      if (!media) return;

      const rect = section.getBoundingClientRect();

      // Skip if far offscreen
      if (rect.bottom < -200 || rect.top > vh + 200) return;

      // progress: 0 when top hits bottom of viewport, 1 when bottom hits top
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));

      // Move image layer: adjust strength here (try 50–110)
      const strength = 90;
      const y = (clamped - 0.5) * strength;

      media.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll(); // initial
})();

/* Event Types tabs: buttons -> panes + media sets (scoped to #event-types only) */
(function featureSelectorInit() {
  const root = document.querySelector("#event-types");
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll(".featureBtn"));
  const panes = Array.from(root.querySelectorAll(".featurePane"));
  const mediaSets = Array.from(root.querySelectorAll(".mediaSet"));

  if (!buttons.length) return;

  function activate(key) {
    // Toggle buttons
    buttons.forEach((btn) => {
      const isOn = btn.dataset.feature === key;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
    });

    // Toggle right-side text panes
    panes.forEach((pane) => {
      pane.classList.toggle("is-active", pane.dataset.pane === key);
    });

    // Toggle left-side image sets
    mediaSets.forEach((set) => {
      set.classList.toggle("is-active", set.dataset.media === key);
    });
  }

  // Wire clicks
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activate(btn.dataset.feature));
  });

  // Initial state
  const initial =
    buttons.find((b) => b.classList.contains("is-active"))?.dataset.feature ||
    buttons[0].dataset.feature;

  activate(initial);
})();
