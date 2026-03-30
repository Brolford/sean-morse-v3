/**
 * featured-scroll.js — Auto-advancing horizontal scroll for Featured Projects
 *
 * Behavior:
 *   - Advances one card every 6 seconds (smooth scroll)
 *   - Loops back to start when reaching the end
 *   - Pauses immediately on mouse enter
 *   - Resumes 2 seconds after mouse leave
 *   - Disabled entirely on mobile (touch devices) and reduced motion
 *   - Touch users get native horizontal scroll with momentum
 *
 * Expects a .featured-scroll-track element containing .featured-card children.
 * Track should have overflow-x: auto and scroll-snap-type: x mandatory.
 *
 * Re-initializes on Astro View Transition page loads.
 */

function initFeaturedScroll() {
  const track = document.querySelector('.featured-scroll-track');
  if (!track) return;

  // Respect reduced motion and mobile (touch-only) preferences
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(hover: none)').matches;

  // Auto-scroll is a desktop-only, motion-allowed feature
  if (prefersReduced || isMobile) return;

  let interval = null;
  let resumeTimeout = null;
  const ADVANCE_MS = 6000;   // 6 seconds between advances
  const RESUME_DELAY = 2000; // 2 second pause after mouse leaves

  /**
   * Calculate how far to scroll per advance.
   * Measures first card width + the grid gap (16px from design system).
   */
  function getCardWidth() {
    const card = track.querySelector('.featured-card');
    if (!card) return 256; // Fallback if no cards found
    return card.offsetWidth + 16; // card width + gap
  }

  /**
   * Scroll one card-width to the right.
   * If we've reached the end of the track, loop back to the start.
   */
  function advance() {
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft >= maxScroll - 10) {
      // At the end — loop back to start
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  /**
   * Start the auto-scroll interval (idempotent — won't double-start).
   */
  function startAutoScroll() {
    if (interval) return;
    interval = setInterval(advance, ADVANCE_MS);
  }

  /**
   * Immediately stop auto-scroll and cancel any pending resume.
   */
  function stopAutoScroll() {
    clearInterval(interval);
    interval = null;
    clearTimeout(resumeTimeout);
  }

  // ── Hover behavior: pause on enter, resume after delay on leave ─────
  track.addEventListener('mouseenter', () => {
    stopAutoScroll();
  });

  track.addEventListener('mouseleave', () => {
    resumeTimeout = setTimeout(startAutoScroll, RESUME_DELAY);
  });

  // Start auto-scrolling
  startAutoScroll();
}

// Initialize on first load
initFeaturedScroll();

// Re-initialize after Astro View Transition completes
document.addEventListener('astro:page-load', initFeaturedScroll);
