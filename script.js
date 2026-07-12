const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const bg = document.querySelector('.hero-background');
canvas.id = 'particle-canvas';
canvas.style.position = 'absolute';
canvas.style.inset = '0';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';
bg.appendChild(canvas);

const particles = [];
const particleCount = 70;
const particleColors = [
  '37, 99, 235',
  '6, 182, 212',
  '245, 158, 11',
  '139, 92, 246'
];

function resizeCanvas() {
  canvas.width = bg.clientWidth;
  canvas.height = bg.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 1 + Math.random() * 2.5;
    this.speed = 0.2 + Math.random() * 0.55;
    this.alpha = 0.2 + Math.random() * 0.28;
    this.direction = Math.random() * Math.PI * 2;
    this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
  }

  update() {
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
      this.reset();
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i += 1) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - distance / 120) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

const header = document.querySelector('.topbar');

if (header) {
  const headerCanvas = document.createElement('canvas');
  const headerCtx = headerCanvas.getContext('2d');
  const headerParticles = [];
  const headerParticleCount = 34;

  headerCanvas.className = 'header-particle-canvas';
  headerCanvas.style.position = 'absolute';
  headerCanvas.style.inset = '0';
  headerCanvas.style.zIndex = '0';
  headerCanvas.style.pointerEvents = 'none';
  header.appendChild(headerCanvas);

  function resizeHeaderCanvas() {
    headerCanvas.width = header.clientWidth;
    headerCanvas.height = header.clientHeight;
  }

  class HeaderParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * headerCanvas.width;
      this.y = Math.random() * headerCanvas.height;
      this.size = 1 + Math.random() * 2;
      this.speed = 0.25 + Math.random() * 0.5;
      this.alpha = 0.28 + Math.random() * 0.28;
      this.direction = Math.random() * Math.PI * 2;
      this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    }

    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;

      if (
        this.x < -12 ||
        this.x > headerCanvas.width + 12 ||
        this.y < -12 ||
        this.y > headerCanvas.height + 12
      ) {
        this.reset();
      }
    }

    draw() {
      headerCtx.beginPath();
      headerCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      headerCtx.shadowColor = `rgba(${this.color}, 0.55)`;
      headerCtx.shadowBlur = 8;
      headerCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      headerCtx.fill();
      headerCtx.shadowBlur = 0;
    }
  }

  window.addEventListener('resize', resizeHeaderCanvas);
  resizeHeaderCanvas();

  for (let i = 0; i < headerParticleCount; i += 1) {
    headerParticles.push(new HeaderParticle());
  }

  function animateHeaderParticles() {
    headerCtx.clearRect(0, 0, headerCanvas.width, headerCanvas.height);
    headerParticles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animateHeaderParticles);
  }

  animateHeaderParticles();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const stickyHeader = document.querySelector('.topbar');
    const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height + 90 : 90;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

// Scroll to top functionality
const scrollBtn = document.getElementById('scrollBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Contact form: let FormSubmit handle the POST, file upload, and redirect.
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Sending...';
      submitButton.setAttribute('aria-busy', 'true');
    }

    formStatus.textContent = 'Sending message...';
    formStatus.classList.remove('error');
    formStatus.classList.remove('success');
  });
}
const featureCarousel = document.querySelector('.feature-carousel');
const featureImages = document.querySelector('#featureImages');
const carouselPrev = document.querySelector('.carousel-btn-prev');
const carouselNext = document.querySelector('.carousel-btn-next');

document.querySelectorAll('.feature-image-card img').forEach((image) => {
  const card = image.closest('.feature-image-card');
  if (card) {
    card.style.setProperty('--card-image', `url("${image.currentSrc || image.src}")`);
  }
});

if (featureCarousel && featureImages && carouselPrev && carouselNext) {
  const getCarouselStep = () => {
    const firstCard = featureImages.querySelector('.feature-image-card');
    if (!firstCard) {
      return featureImages.clientWidth;
    }

    const styles = window.getComputedStyle(featureImages);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const moveCarousel = (direction = 1) => {
    const maxScroll = featureImages.scrollWidth - featureImages.clientWidth;
    const nextLeft = featureImages.scrollLeft + getCarouselStep() * direction;

    if (nextLeft > maxScroll - 8) {
      featureImages.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (nextLeft < 0) {
      featureImages.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    featureImages.scrollBy({ left: getCarouselStep() * direction, behavior: 'smooth' });
  };

  let carouselTimer = window.setInterval(() => moveCarousel(1), 3200);

  const pauseCarousel = () => window.clearInterval(carouselTimer);
  const resumeCarousel = () => {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => moveCarousel(1), 3200);
  };

  carouselPrev.addEventListener('click', () => {
    moveCarousel(-1);
    resumeCarousel();
  });

  carouselNext.addEventListener('click', () => {
    moveCarousel(1);
    resumeCarousel();
  });

  featureCarousel.addEventListener('mouseenter', pauseCarousel);
  featureCarousel.addEventListener('mouseleave', resumeCarousel);
  featureCarousel.addEventListener('focusin', pauseCarousel);
  featureCarousel.addEventListener('focusout', resumeCarousel);
}

const showcaseVideos = Array.from(document.querySelectorAll('.showcase-video'));
const showcaseVideoTrack = document.querySelector('#showcaseVideos');
const videoCarouselPrev = document.querySelector('.video-carousel-prev');
const videoCarouselNext = document.querySelector('.video-carousel-next');
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const pauseOtherVideos = (activeVideo) => {
  showcaseVideos.forEach((video) => {
    if (video !== activeVideo) {
      video.pause();
    }
  });
};

const safelyPlayVideo = (video) => {
  pauseOtherVideos(video);
  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => {});
  }
};

let activeVideoIndex = 0;

const showVideo = (index, shouldPlay = true) => {
  if (!showcaseVideoTrack || showcaseVideos.length === 0) {
    return;
  }

  activeVideoIndex = (index + showcaseVideos.length) % showcaseVideos.length;
  showcaseVideoTrack.scrollTo({
    left: showcaseVideoTrack.clientWidth * activeVideoIndex,
    behavior: 'smooth'
  });

  if (shouldPlay) {
    safelyPlayVideo(showcaseVideos[activeVideoIndex]);
  }
};

videoCarouselPrev?.addEventListener('click', () => showVideo(activeVideoIndex - 1));
videoCarouselNext?.addEventListener('click', () => showVideo(activeVideoIndex + 1));

window.addEventListener('resize', () => {
  if (showcaseVideoTrack) {
    showcaseVideoTrack.scrollLeft = showcaseVideoTrack.clientWidth * activeVideoIndex;
  }
});

showcaseVideos.forEach((video) => {
  const card = video.closest('.showcase-video-card');

  if (!card) {
    return;
  }

  if (hasHover) {
    card.addEventListener('mouseenter', () => safelyPlayVideo(video));
    card.addEventListener('mouseleave', () => video.pause());
  } else {
    video.addEventListener('click', () => {
      if (video.paused) {
        safelyPlayVideo(video);
      } else {
        video.pause();
      }
    });
  }

  video.addEventListener('play', () => {
    activeVideoIndex = showcaseVideos.indexOf(video);
    pauseOtherVideos(video);
  });

  video.addEventListener('ended', () => {
    video.currentTime = 0;
    showVideo(showcaseVideos.indexOf(video) + 1);
  });

});
