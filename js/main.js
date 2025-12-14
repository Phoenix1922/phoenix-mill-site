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

/* Step 3: HERO CAROUSEL (true horizontal sliding) */
(function initHeroCarousel() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".slide"));
  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  let idx = 0;
  let timer = null;
  let paused = false;

  function go(i, { instant = false } = {}) {
    idx = (i + slides.length) % slides.length;

    if (instant) track.classList.add("is-instant");
    track.style.transform = `translateX(-${idx * 100}%)`;
    if (instant) requestAnimationFrame(() => track.classList.remove("is-instant"));

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, k) => d.classList.toggle("is-active", k === idx));
    }
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

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  function start() {
    stop();
    timer = setInterval(() => {
      if (!paused) next();
    }, 4500); // faster + more “real carousel”
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Pause interactions
  slider.addEventListener("mouseenter", () => (paused = true));
  slider.addEventListener("mouseleave", () => (paused = false));
  slider.addEventListener("focusin", () => (paused = true));
  slider.addEventListener("focusout", () => (paused = false));

  // Touch swipe
  let startX = 0;
  let down = false;

  slider.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || !e.touches.length) return;
      down = true;
      paused = true;
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      if (!down) return;
      down = false;
      paused = false;

      const endX =
        e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : startX;
      const dx = endX - startX;

      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
      }
    },
    { passive: true }
  );

  // Init
  go(0, { instant: true });
  start();
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
    const embed = url.includes("youtube.com/watch") ? url.replace("watch?v=", "embed/") : url;
    iframe.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
  };

  const close = () => {
    modal.hidden = true;
    iframe.src = "";
  };

  videoBtns.forEach((btn) => btn.addEventListener("click", () => open(btn.dataset.video)));
  closeEls.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
