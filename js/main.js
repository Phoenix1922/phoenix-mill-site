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

  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  // Build track and move slides into it (no HTML edits needed)
  const track = document.createElement("div");
  track.className = "hero__track";

  slides.forEach((s) => track.appendChild(s));
  slider.insertBefore(track, slider.firstChild);

  let idx = 0;
  let timer = null;
  let isPaused = false;

  const setActiveDot = () => {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((d, k) => {
      d.classList.toggle("is-active", k === idx);
    });
  };

  const applyTransform = () => {
    const w = slider.clientWidth;
    track.style.transform = `translate3d(-${idx * w}px, 0, 0)`;
  };

  const go = (i) => {
    idx = (i + slides.length) % slides.length;
    applyTransform();
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

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Auto-advance
  const start = () => {
    stop();
    timer = setInterval(() => {
      if (!isPaused) next();
    }, 4500);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

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
  window.addEventListener("resize", () => {
    applyTransform();
  });

  // Init
  go(0);
  start();
})();

/* Testimonials */
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

/* Video modal */
(function initVideo() {
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

  videoBtns.forEach((btn) =>
    btn.addEventListener("click", () => open(btn.dataset.video))
  );
  closeEls.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* Footer year */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// ===== Step 3: Faux-parallax (works on iPhone + desktop) =====
(function () {
  const sections = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let ticking = false;

  function update() {
    ticking = false;

    const vh = window.innerHeight || 1;

    sections.forEach(section => {
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

// ===== Step 4: Feature selector (click to swap content + images) =====
(function featureSelectorInit() {
  const buttons = Array.from(document.querySelectorAll(".featureBtn"));
  const panes = Array.from(document.querySelectorAll(".featurePane"));
  const mediaSets = Array.from(document.querySelectorAll(".mediaSet"));

  if (!buttons.length || !panes.length) return;

  function activate(key) {
    // Toggle left buttons
    buttons.forEach((btn) => {
      const isOn = btn.dataset.feature === key;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
    });

    // Toggle right text panes
    panes.forEach((pane) => {
      pane.classList.toggle("is-active", pane.dataset.pane === key);
    });

    // Toggle left image sets (only if they exist)
    if (mediaSets.length) {
      mediaSets.forEach((set) => {
        set.classList.toggle("is-active", set.dataset.media === key);
      });
    }
  }

  // Click handlers
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activate(btn.dataset.feature));
  });

  // Initial sync on page load
  const initial =
    buttons.find((b) => b.classList.contains("is-active"))?.dataset.feature ||
    buttons[0].dataset.feature;

  activate(initial);
})();
