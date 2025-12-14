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

/* HERO CAROUSEL (true horizontal sliding, no drift) */
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

  // Force viewport-based sizing (NO percentage math)
  slides.forEach(slide => {
    slide.style.width = "100vw";
    slide.style.flex = "0 0 100vw";
  });

  track.style.width = `${slides.length * 100}vw`;

  function updatePosition(instant = false) {
    if (instant) track.style.transition = "none";
    track.style.transform = `translate3d(-${idx * 100}vw, 0, 0)`;
    if (instant) requestAnimationFrame(() => {
      track.style.transition = "";
    });
    updateDots();
  }

  function updateDots() {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((d, i) =>
      d.classList.toggle("is-active", i === idx)
    );
  }

  function go(i) {
    idx = (i + slides.length) % slides.length;
    updatePosition();
  }

  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  nextBtn && nextBtn.addEventListener("click", next);
  prevBtn && prevBtn.addEventListener("click", prev);

  function start() {
    stop();
    timer = setInterval(() => {
      if (!paused) next();
    }, 4500);
  }

  function stop() {
    if (timer) clearInterval(timer);
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
    const dx = e.changedTouches[0].clientX - startX;
    paused = false;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  }, { passive: true });

  updatePosition(true);
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
