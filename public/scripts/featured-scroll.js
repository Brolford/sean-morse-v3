/**
 * featured-scroll.js — Auto-advancing horizontal scroll for Featured Projects
 *
 * Behavior:
 *   - Advances one card every 5 seconds (smooth scroll)
 *   - Loops back to start when reaching the end
 *   - Pauses immediately on mouse enter
 *   - Resumes 2 seconds after mouse leave
 *   - Disabled when prefers-reduced-motion is active
 *   - Touch users get native horizontal scroll with momentum
 *
 * Re-initializes on Astro View Transition page loads.
 * Cleans up previous instance to prevent stacking intervals.
 */

/* Track the current cleanup function to prevent stacking */
var _featuredScrollCleanup = null;

function initFeaturedScroll() {
  /* Clean up any previous instance first */
  if (_featuredScrollCleanup) {
    _featuredScrollCleanup();
    _featuredScrollCleanup = null;
  }

  var track = document.querySelector('.featured-scroll-track');
  if (!track) return;

  /* Respect reduced motion */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* Check if there's actually content to scroll */
  var cards = track.querySelectorAll('.featured-card');
  if (cards.length < 2) return;

  var interval = null;
  var resumeTimeout = null;
  var ADVANCE_MS = 5000;
  var RESUME_DELAY = 2000;

  function getCardWidth() {
    var card = cards[0];
    if (!card) return 300;
    /* Get computed gap from the flex container */
    var gap = parseInt(getComputedStyle(track).gap) || 16;
    return card.offsetWidth + gap;
  }

  function advance() {
    var cardWidth = getCardWidth();
    var maxScroll = track.scrollWidth - track.clientWidth;

    /* Nothing to scroll */
    if (maxScroll <= 0) return;

    if (track.scrollLeft >= maxScroll - 20) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  function startAutoScroll() {
    if (interval) return;
    interval = setInterval(advance, ADVANCE_MS);
  }

  function stopAutoScroll() {
    clearInterval(interval);
    interval = null;
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }

  function onEnter() { stopAutoScroll(); }
  function onLeave() { resumeTimeout = setTimeout(startAutoScroll, RESUME_DELAY); }

  track.addEventListener('mouseenter', onEnter);
  track.addEventListener('mouseleave', onLeave);

  /* Start after a brief delay to ensure layout is settled */
  var startDelay = setTimeout(startAutoScroll, 1000);

  /* Provide cleanup function */
  _featuredScrollCleanup = function() {
    clearTimeout(startDelay);
    stopAutoScroll();
    track.removeEventListener('mouseenter', onEnter);
    track.removeEventListener('mouseleave', onLeave);
  };
}

/* Initialize on first load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeaturedScroll);
} else {
  initFeaturedScroll();
}

/* Re-initialize after Astro View Transition completes */
document.addEventListener('astro:page-load', initFeaturedScroll);
