document.addEventListener('DOMContentLoaded', () => {
  // === HERO CAROUSEL ===
  const slider = document.querySelector('.hero__slider');
  if (!slider) return;

  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.sliderBtn.prev');
  const nextBtn = document.querySelector('.sliderBtn.next');
  const dotsContainer = document.querySelector('.dots');
  const totalSlides = slides.length;

  let currentIndex = 0;
  let autoplayInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dots button');

  // Update active slide and dot
  function updateCarousel() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }

  // Next / Previous
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Button events
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation (optional but nice)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 7000); // 7 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();

  // Pause autoplay on hover (improves UX)
  slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  slider.addEventListener('mouseleave', startAutoplay);

  // === VIDEO MODAL ===
  const videoButtons = document.querySelectorAll('[data-video]');
  const modal = document.querySelector('[data-modal]');
  const iframe = modal.querySelector('iframe');
  const closeButtons = modal.querySelectorAll('[data-close]');

  videoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = btn.getAttribute('data-video');
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)[1];
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden'; // prevent scroll
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.hidden = true;
      iframe.src = '';
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click
  modal.querySelector('.modal__backdrop').addEventListener('click', () => {
    closeButtons[0].click();
  });

  // === CURRENT YEAR IN FOOTER ===
  document.getElementById('year').textContent = new Date().getFullYear();

  // === MOBILE NAV TOGGLE (if you have one) ===
  const navToggle = document.querySelector('.navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('is-open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });
  }
});
