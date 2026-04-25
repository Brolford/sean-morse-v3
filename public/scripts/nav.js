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

/* ──────────────────────────────────────────────────────────────────
   Module-scope flags + handler refs.
   Some listeners (scroll, document-level touch) only need binding
   once per page load. Others (hamburger click) re-bind on every
   View Transition because the DOM elements are new each time.
   ────────────────────────────────────────────────────────────────── */
let scrollBound = false;
let observer = null;

function setNavOpen(nav, hamburger, overlay, isOpen) {
  nav.classList.toggle('nav-open', isOpen);
  overlay.classList.toggle('nav-overlay-open', isOpen);
  overlay.setAttribute('aria-hidden', String(!isOpen));
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const scrollThreshold = 100;

  // ── Scroll morph (bind once per page-load lifecycle) ───────────────
  if (!scrollBound) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Re-query nav each tick — element is replaced on view transitions
        const liveNav = document.getElementById('main-nav');
        if (liveNav) {
          if (window.scrollY > scrollThreshold) {
            liveNav.classList.add('nav-scrolled');
          } else {
            liveNav.classList.remove('nav-scrolled');
          }
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollBound = true;
  }

  // Apply scrolled class immediately if user is already past the threshold
  // (handles direct loads of long pages and re-init after view transitions)
  if (window.scrollY > scrollThreshold) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }

  // ── Context-aware theme (rebuild observer for fresh DOM) ───────────
  if (observer) observer.disconnect();
  const sections = document.querySelectorAll('[data-nav-theme]');
  if (sections.length) {
    observer = new IntersectionObserver((entries) => {
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
      rootMargin: '-40% 0px -59% 0px',
      threshold: [0, 0.3, 0.6, 1]
    });
    sections.forEach(s => observer.observe(s));
  }

  // ── Mobile hamburger toggle ─────────────────────────────────────────
  // Bind by replacing the button via cloneNode to drop any prior listeners
  // that survived a view transition. This guarantees a single fresh binding
  // even if the script is somehow re-executed.
  const hamburgerOriginal = nav.querySelector('.nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  if (!hamburgerOriginal || !overlay) return;

  const hamburger = hamburgerOriginal.cloneNode(true);
  hamburgerOriginal.parentNode.replaceChild(hamburger, hamburgerOriginal);

  // Use both pointerup (covers iOS Safari touch reliably) and click
  // (keyboard activation, Android, fallback). A flag prevents double-fire
  // when both fire from the same gesture.
  let lastToggle = 0;
  const handleToggle = (e) => {
    const now = Date.now();
    if (now - lastToggle < 300) return; // dedupe pointer + click
    lastToggle = now;
    e.preventDefault();
    const isOpen = !nav.classList.contains('nav-open');
    setNavOpen(nav, hamburger, overlay, isOpen);
  };

  hamburger.addEventListener('pointerup', handleToggle);
  hamburger.addEventListener('click', handleToggle);

  // Close overlay when any link/button inside it is activated
  overlay.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      setNavOpen(nav, hamburger, overlay, false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      setNavOpen(nav, hamburger, overlay, false);
    }
  });
}

// Initialize on first load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}

// Re-initialize after Astro View Transition completes
document.addEventListener('astro:page-load', initNav);
