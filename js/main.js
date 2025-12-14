document.addEventListener('DOMContentLoaded', () => {
  // === HERO CAROUSEL ===
  const slider = document.querySelector('.hero__slider');
  if (!slider) return;

  const images = [
    'assets/img/hero-1.jpg',
    'assets/img/hero-2.jpg',
    'assets/img/hero-3.jpg'
  ];

  // Create track and slides
  const track = document.createElement('div');
  track.className = 'hero__track';
  
  images.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.backgroundImage = `url(${src})`;
    
    // Add content overlay (customize this HTML to match your hero text)
    slide.innerHTML = `
      <div class="wrap slide__content">
        <div class="kicker">Historic venue • Modern events</div>
        <h1>Phoenix Mill Events</h1>
        <p class="lead">A timeless space for weddings, corporate gatherings, celebrations, and community events.</p>
        <div class="actions">
          <a href="get-started.html" class="btn">Get Started</a>
          <a href="tour-our-space.html" class="btn btn--ghost">Explore capabilities</a>
        </div>
      </div>
    `;
    track.appendChild(slide);
  });
  
  slider.appendChild(track);

  // Navigation buttons & dots
  const prevBtn = document.querySelector('.sliderBtn.prev');
  const nextBtn = document.querySelector('.sliderBtn.next');
  const dotsContainer = document.querySelector('.dots');
  
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.dots button');
  
  let current = 0;
  const total = images.length;
  
  const goTo = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    current = index;
  };
  
  nextBtn.addEventListener('click', () => goTo((current + 1) % total));
  prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  
  // Autoplay
  setInterval(() => goTo((current + 1) % total), 6000);
  goTo(0); // Initial

  // === PARALLAX SECTION (if present) ===
  // Your CSS already handles the fixed background perfectly—no extra JS needed!
  // Just ensure this is in your index.html where you want it:
  /*
  <section class="parallax" style="background-image: url('assets/img/parallax-1.jpg');">
    <div class="parallax__overlay">
      <div class="wrap parallax__content">
        <h2>Historic charm. Modern experiences.</h2>
        <p>As you scroll, the venue stays present—like the model site you shared.</p>
        <a href="get-started.html" class="btn">Start your inquiry</a>
      </div>
    </div>
  </section>
  */
});
