/* =========================================================
   Phoenix Mill Events — main.js
   What this file does:
   1) Mobile nav toggle (shows/hides the nav on small screens)
   2) Hero carousel (auto-advances + arrow controls + dots + swipe)
   3) Video modal (opens YouTube embed in an overlay)
   4) Footer year (sets © year automatically)
   5) Faux-parallax band (smooth translate on scroll)
   6) Event Types feature selector (buttons swap left images + right text)
   ========================================================= */

console.log("main.js loaded OK");

/* =========================================================
   1) Mobile nav
   ========================================================= */
(function initMobileNav(){
  const navToggle = document.querySelector(".navToggle");
  const nav = document.querySelector(".nav");
  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));

    // Toggle display
    nav.style.display = expanded ? "none" : "flex";

    // Mobile dropdown styling
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
})();

/* =========================================================
   2) Hero Slider (pixel-perfect horizontal slide, no peeking)
   - IMPORTANT: This expects:
     - container: [data-slider]
     - track: [data-track] (preferred) or .hero__track
     - slides: .slide
     - arrows: [data-prev] and [data-next]
     - dots container: [data-dots]
   ========================================================= */
(function initSlider(){
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]") || slider.querySelector(".hero__track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".slide"));
  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  let idx = 0;
  let timer = null;
  let isPaused = false;

  function setActiveDot(){
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((d, k) => {
      d.classList.toggle("is-active", k === idx);
    });
  }

  function applyTransform(){
    const w = slider.clientWidth;
    track.style.transform = `translate3d(-${idx * w}px, 0, 0)`;
  }

  function go(i){
    idx = (i + slides.length) % slides.length;
    applyTransform();
    setActiveDot();
  }

  // Build dots
  if (dotsWrap){
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  function next(){ go(idx + 1); }
  function prev(){ go(idx - 1); }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Auto-advance
  function start(){
    stop();
    timer = setInterval(() => {
      if (!isPaused) next();
    }, 4500);
  }
  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Pause on hover/focus
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

    const endX = (e.changedTouches && e.changedTouches.length)
      ? e.changedTouches[0].clientX
      : startX;

    const dx = endX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  }, { passive: true });

  // Re-measure on resize (prevents drift after window size changes)
  window.addEventListener("resize", applyTransform);

  // Init
  go(0);
  start();
})();

/* =========================================================
   3) Video modal
   - Buttons anywhere on page can have [data-video="URL"]
   - Modal is [data-modal] with [data-close] elements
   ========================================================= */
(function initVideo(){
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const iframe = modal.querySelector("iframe");
  const closeEls = modal.querySelectorAll("[data-close]");
  const videoBtns = document.querySelectorAll("[data-video]");

  function open(url){
    modal.hidden = false;
    const embed = url.includes("youtube.com/watch")
      ? url.replace("watch?v=", "embed/")
      : url;

    iframe.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
  }

  function close(){
    modal.hidden = true;
    iframe.src = "";
  }

  videoBtns.forEach((btn) => btn.addEventListener("click", () => open(btn.dataset.video)));
  closeEls.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

/* =========================================================
   4) Footer year
   ========================================================= */
(function setFooterYear(){
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* =========================================================
   5) Faux-parallax (works on iPhone + desktop)
   - Section wrapper: [data-parallax]
   - Image layer: [data-parallax-media]
   ========================================================= */
(function initParallax(){
  const sections = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let ticking = false;

  function update(){
    ticking = false;
    const vh = window.innerHeight || 1;

    sections.forEach((section) => {
      const media = section.querySelector("[data-parallax-media]");
      if (!media) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;

      // progress: 0 when top hits bottom of viewport, 1 when bottom hits top
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));

      // Strength controls how much the image layer moves
      const strength = 90;
      const y = (clamped - 0.5) * strength;

      media.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

/* =========================================================
   6) Event Types feature selector
   - Scope is ONLY #event-types to avoid conflicts
   - Buttons: .featureBtn with data-feature
   - Panes: .featurePane with data-pane
   - Media: .mediaSet with data-media
   ========================================================= */
(function initEventTypes(){
  const root = document.querySelector("#event-types");
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll(".featureBtn"));
  const panes = Array.from(root.querySelectorAll(".featurePane"));
  const mediaSets = Array.from(root.querySelectorAll(".mediaSet"));

  if (!buttons.length) return;

  function activate(key){
    buttons.forEach((btn) => {
      const isOn = btn.dataset.feature === key;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
    });

    panes.forEach((pane) => pane.classList.toggle("is-active", pane.dataset.pane === key));
    mediaSets.forEach((set) => set.classList.toggle("is-active", set.dataset.media === key));
  }

  buttons.forEach((btn) => btn.addEventListener("click", () => activate(btn.dataset.feature)));

  const initial = buttons.find((b) => b.classList.contains("is-active"))?.dataset.feature || buttons[0].dataset.feature;
  activate(initial);
})();
