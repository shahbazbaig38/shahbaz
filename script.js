// ===== THEME TOGGLE =====
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== DROPDOWN SECTIONS =====
  document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const block = header.closest('.section-block');
      const content = block.querySelector('.section-content');

      if (block.classList.contains('open')) {
        // Close
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          content.style.maxHeight = '0px';
        });
        block.classList.remove('open');
      } else {
        // Open
        block.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        // After transition, remove max-height to allow dynamic content
        const onEnd = () => {
          if (block.classList.contains('open')) {
            content.style.maxHeight = 'none';
          }
          content.removeEventListener('transitionend', onEnd);
        };
        content.addEventListener('transitionend', onEnd);
      }
    });
  });


  // Sections marked with class="open" in HTML already have their content visible

  // ===== SCROLL PROGRESS BAR =====
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== YEAR IN FOOTER =====
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== INTERSECTION OBSERVER FOR FADE-IN =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.observe-fade').forEach(el => {
    observer.observe(el);
  });

  // ===== SMOOTH NAV ACTIVE STATE =====
  const sections = document.querySelectorAll('.section-block[id], .hero');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id') || 'top';
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }, { passive: true });
});
