/**
 * animations.js — Core animation system for Sean Morse Portfolio v3
 *
 * Two animation systems:
 *   1. Scroll reveal — IntersectionObserver triggers .revealed on
 *      .animate-reveal and .animate-entrance elements. One-shot
 *      (observer disconnects after trigger). CSS handles the actual
 *      transition via global.css utility classes.
 *
 *   2. Count-up — Animates numeric stats from 0 to target value
 *      using data-count-to, data-count-prefix, data-count-suffix.
 *      Uses easeOutExpo for a satisfying deceleration curve.
 *
 * Both systems respect prefers-reduced-motion:
 *   - Scroll reveal: CSS handles reduced motion (opacity-only fade)
 *   - Count-up: skips animation, shows final value instantly
 *
 * Re-initializes on Astro View Transition page loads.
 */

function initAnimations() {
  // Check reduced motion preference once at init
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll Reveal Observer ──────────────────────────────────────────
  // Watches .animate-reveal (400ms translateY) and .animate-entrance
  // (600ms blur+translateY+scale). Adds .revealed class on first
  // intersection, then disconnects that element (one-shot pattern).
  const revealElements = document.querySelectorAll('.animate-reveal, .animate-entrance');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // One-shot: stop watching
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Count-Up Animation for Accolade Stats ───────────────────────────
  // Usage: <span data-count-to="320" data-count-prefix="$" data-count-suffix="M+">$0M+</span>
  // Animates the number from 0 to data-count-to over 600ms with
  // easeOutExpo easing. Prefix/suffix stay static around the number.
  const countElements = document.querySelectorAll('[data-count-to]');
  if (countElements.length) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.countTo);
          const prefix = el.dataset.countPrefix || '';
          const suffix = el.dataset.countSuffix || '';
          const duration = 2200;
          const startTime = performance.now();

          // Reduced motion: show final value immediately, no animation
          if (prefersReduced) {
            el.textContent = prefix + target + suffix;
            observer.unobserve(el);
            return;
          }

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic: gradual deceleration, numbers stay readable longer
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '0px 0px 0px 0px'
    });
    countElements.forEach(el => countObserver.observe(el));
  }
}

// Initialize on first load
initAnimations();

// Re-initialize after Astro View Transition completes
document.addEventListener('astro:page-load', initAnimations);
