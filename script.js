// =========================================================
// AUTOCOAT — site interactions
// =========================================================

const loadFragment = async (slotId, url) => {
  const slot = document.getElementById(slotId);
  if (!slot) return;

  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  slot.outerHTML = await response.text();
};

const normalizePath = (path) => {
  if (!path || path === '/') return '/index.html';
  return path.endsWith('/') ? `${path}index.html` : path;
};

const initNav = () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  const backdrop = document.getElementById('navBackdrop');

  if (!navToggle || !mainNav) return;

  const openNav = () => {
    mainNav.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('show');
    document.body.classList.add('nav-open');
  };

  const closeNav = () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('show');
    document.body.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', () => {
    mainNav.classList.contains('open') ? closeNav() : openNav();
  });

  if (backdrop) backdrop.addEventListener('click', closeNav);

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
};

const initActiveLink = () => {
  const currentPath = normalizePath(window.location.pathname.replace(/\\/g, '/'));

  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    try {
      const linkPath = normalizePath(new URL(href, window.location.href).pathname);
      link.classList.toggle('active', linkPath === currentPath);
    } catch (err) {
      // Ignore malformed hrefs rather than breaking navigation styling
    }
  });
};

const initReveal = () => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
};

const initBackToTop = () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const initContactForm = () => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (success) {
      success.classList.add('show');
      clearTimeout(success._hideTimer);
      success._hideTimer = setTimeout(() => success.classList.remove('show'), 4000);
    }
    form.reset();
  });
};

const initHeaderShadow = () => {
  const header = document.getElementById('header');
  if (!header) return;

  const updateShadow = () => {
    header.style.boxShadow = window.scrollY > 10 ? '0 8px 30px -10px rgba(0,0,0,.6)' : 'none';
  };
  updateShadow();
  window.addEventListener('scroll', updateShadow, { passive: true });
};

const initSwipers = () => {
  if (!window.Swiper) return;

  if (document.querySelector('.productSwiper') && !document.querySelector('.productSwiper').swiper) {
    new Swiper('.productSwiper', {
      loop: true,
      speed: 1000,
      autoplay: { delay: 2500, disableOnInteraction: false },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 25 },
        1200: { slidesPerView: 4, spaceBetween: 24 }
      }
    });
  }

  if (document.querySelector('.reviewsSwiper') && !document.querySelector('.reviewsSwiper').swiper) {
    new Swiper('.reviewsSwiper', {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.reviewsSwiper .swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });
  }
};

const initSiteInteractions = () => {
  initNav();
  initActiveLink();
  initReveal();
  initBackToTop();
  initContactForm();
  initHeaderShadow();
  initSwipers();
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadFragment('site-header', 'header.html'),
      loadFragment('site-footer', 'footer.html')
    ]);
  } catch (error) {
    console.warn(error);
  }

  initSiteInteractions();
});