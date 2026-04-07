/* ============================================================
   EMILIA — designers.js
   ============================================================ */
(function () {
  'use strict';

  /* ── Portrait Snow (each card) ─────────────────────── */
  document.querySelectorAll('.designer-card').forEach(card => {
    const c   = card.querySelector('.snow-layer');
    if (!c) return;
    const ctx = c.getContext('2d');
    let flakes = [];

    function resize() {
      c.width  = card.offsetWidth;
      c.height = card.querySelector('.designer-card-img-wrap').offsetHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    for (let i = 0; i < 28; i++) {
      flakes.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: 0.8 + Math.random() * 1.8, v: 0.25 + Math.random() * 0.55 });
    }

    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'rgba(200,235,255,0.82)';
      ctx.beginPath();
      for (const f of flakes) {
        f.y += f.v; f.x += Math.sin(f.y * 0.013) * 0.35;
        if (f.y > c.height + 4) { f.y = -5; f.x = Math.random() * c.width; }
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();
      requestAnimationFrame(loop);
    })();
  });

})();
