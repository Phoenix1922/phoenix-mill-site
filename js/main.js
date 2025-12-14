document.addEventListener('DOMContentLoaded', () => {
  // === HERO CAROUSEL ===
  const slider = document.querySelector('.hero__slider');
  if (!slider) return;

  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.sliderBtn.prev');
  const nextBtn = document.querySelector('.sliderBtn.next');
  const dotsContainer = document.querySelector('.dots');
  const totalSlides = slides.length;

  let currentIndex = 0;
  let autoplayInterval;

  // Create track wrapper (required for your CSS horizontal slide)
  const track = document.createElement('div');
  track.className = 'hero__track';
  slides.forEach(slide => track.appendChild(slide));
  slider.insertBefore(track, slider.firstChild); // Insert track as first child

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dots button');

  // Update carousel position and dots
  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
  }

  // Go to slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Autoplay etc. (same as before)
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 7000);
  }
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  startAutoplay();

  slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  slider.addEventListener('mouseleave', startAutoplay);

  updateCarousel(); // Initial position

  // Keep the rest of your JS (video modal, year, nav toggle) below here...
});
