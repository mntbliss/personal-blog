const filters = document.querySelector('.project-filters');
const cards = document.querySelectorAll('.masonry .card');

filters?.addEventListener('click', (element) => {
  const filterButton = element.target.closest('.filter-button');
  if (!filterButton) return;

  const filter = filterButton.dataset.filter;
  filters.querySelectorAll('.filter-button').forEach((button) => {
    button.classList.toggle('active', button === filterButton);
  });

  cards.forEach((card) => {
    const cats = (card.dataset.category || '').split(/\s+/).filter(Boolean);
    const show = filter === 'all' || cats.includes(filter);
    card.classList.toggle('is-hidden', !show);
  });
});
