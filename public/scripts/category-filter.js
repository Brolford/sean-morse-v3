function initCategoryFilter() {
  const filters = document.querySelectorAll('[data-filter-category]');
  const grid = document.querySelector('.bento-grid');
  if (!filters.length || !grid) return;

  // Target the grid-item wrappers (grid children that control layout),
  // and read category from the nested .project-card's data-category attribute
  const gridItems = grid.querySelectorAll('.bento-grid__item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filterCategory;

      // Update active pill state + aria
      filters.forEach(f => {
        f.classList.remove('filter-active');
        f.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter grid items
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let visibleIndex = 0;

      gridItems.forEach((item) => {
        const card = item.querySelector('.project-card');
        if (!card) return;
        const cardCategory = card.dataset.category;
        const matches = category === 'All' || cardCategory === category;

        if (prefersReduced) {
          item.style.display = matches ? '' : 'none';
          return;
        }

        if (!matches) {
          // Hide non-matching items
          item.classList.remove('filter-visible', 'filter-entering');
          item.classList.add('filter-hidden');
        } else {
          // Show matching items with staggered entrance
          item.classList.remove('filter-hidden');
          item.classList.add('filter-entering');
          item.style.display = '';

          const delay = visibleIndex * 60;
          visibleIndex++;

          setTimeout(() => {
            item.classList.remove('filter-entering');
            item.classList.add('filter-visible');
          }, delay);
        }
      });
    });
  });
}

initCategoryFilter();
document.addEventListener('astro:page-load', initCategoryFilter);
