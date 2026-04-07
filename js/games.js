/* ============================================================
   EMILIA — games.js
   ============================================================ */
(function () {
  'use strict';

  /* ── Filter ────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gameCards  = document.querySelectorAll('.game-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.filter;
      gameCards.forEach(card => {
        const match = type === 'all' || card.dataset.type === type;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── Card click → YouTube ──────────────────────────── */
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.youtube?.trim();
      if (url) window.open(url, '_blank', 'noopener');
    });
  });

})();
