const filters = document.querySelector('.project-filters');
const cards = document.querySelectorAll('.masonry .card');

filters?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  const filter = btn.dataset.filter;
  filters.querySelectorAll('.filter-btn').forEach((b) => {
    b.classList.toggle('active', b === btn);
  });

  cards.forEach((card) => {
    const cats = (card.dataset.category || '').split(/\s+/).filter(Boolean);
    const show = filter === 'all' || cats.includes(filter);
    card.classList.toggle('is-hidden', !show);
  });
});
