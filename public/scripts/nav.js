/**
 * nav.js — Navigation controller for Sean Morse Portfolio v3
 *
 * Handles 3 nav states:
 *   1. Default: subtle frosted float (transparent)
 *   2. Scrolled: condensed light pill (.nav-scrolled)
 *   3. Dark context: inverted pill over dark sections (.nav-dark)
 *
 * Uses IntersectionObserver for context-aware theme switching
 * and requestAnimationFrame-throttled scroll for morph trigger.
 *
 * Re-initializes on Astro View Transition page loads.
 */

function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const scrollThreshold = 100;

  // ── Scroll morph: add/remove .nav-scrolled ──────────────────────────
  // Throttled via requestAnimationFrame so we never fire more than once
  // per paint frame. Passive listener avoids blocking scroll.
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > scrollThreshold) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── Context-aware theme: IntersectionObserver on data-nav-theme ─────
  // Each section declares data-nav-theme="light" or "dark".
  // When a section occupies the nav's vertical position (middle 40-60%
  // of viewport excluded via rootMargin), the observer swaps .nav-dark.
  const sections = document.querySelectorAll('[data-nav-theme]');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const theme = entry.target.dataset.navTheme;
          if (theme === 'dark') {
            nav.classList.add('nav-dark');
          } else {
            nav.classList.remove('nav-dark');
          }
        }
      });
    }, {
      // Only detect when section is at the nav's vertical position:
      // top 40% ignored, bottom 59% ignored → narrow detection band
      rootMargin: '-40% 0px -59% 0px',
      threshold: [0, 0.3, 0.6, 1]
    });
    sections.forEach(s => observer.observe(s));
  }

  // ── Mobile hamburger toggle ─────────────────────────────────────────
  // The overlay is a sibling of the nav (outside it for full-screen coverage),
  // so we query the document — not the nav element.
  const hamburger = nav.querySelector('.nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      overlay.classList.toggle('nav-overlay-open', isOpen);
      overlay.setAttribute('aria-hidden', String(!isOpen));
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // Lock body scroll when mobile nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close overlay when any link/button inside it is clicked
    overlay.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        overlay.classList.remove('nav-overlay-open');
        overlay.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

// Initialize on first load
initNav();

// Re-initialize after Astro View Transition completes
// (scripts in public/ persist across transitions, but DOM is replaced)
document.addEventListener('astro:page-load', initNav);
