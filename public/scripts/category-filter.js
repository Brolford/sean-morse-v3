function initCategoryFilter() {
  const filters = document.querySelectorAll('[data-filter-category]');
  const grid = document.querySelector('.bento-grid');
  if (!filters.length || !grid) return;

  const cards = grid.querySelectorAll('.project-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filterCategory;

      // Update active state
      filters.forEach(f => f.classList.remove('filter-active'));
      btn.classList.add('filter-active');

      // Filter cards
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      cards.forEach((card, i) => {
        const cardCategory = card.dataset.category;
        const matches = category === 'All' || cardCategory === category;

        if (prefersReduced) {
          card.style.display = matches ? '' : 'none';
          return;
        }

        // Fade out
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';

        setTimeout(() => {
          card.style.display = matches ? '' : 'none';

          if (matches) {
            // Staggered fade in
            setTimeout(() => {
              card.style.transition = 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 60);
          }
        }, 200);
      });
    });
  });
}

initCategoryFilter();
document.addEventListener('astro:page-load', initCategoryFilter);
