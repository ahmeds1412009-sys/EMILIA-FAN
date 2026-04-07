/* ============================================================
   EMILIA — main.js  (index page only)
   ============================================================ */
(function () {
  'use strict';

  /* ── Portrait Snow ─────────────────────────────────── */
  const portraitCanvas = document.getElementById('portraitSnow');
  if (portraitCanvas) {
    const card = portraitCanvas.closest('.portrait-card');
    const ctx  = portraitCanvas.getContext('2d');
    let w, h, flakes = [];

    function resize() {
      w = portraitCanvas.width  = card.offsetWidth;
      h = portraitCanvas.height = card.offsetHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    for (let i = 0; i < 45; i++) {
      flakes.push({ x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2, v: 0.3 + Math.random() * 0.7 });
    }
    (function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(200,235,255,0.85)';
      ctx.beginPath();
      for (const f of flakes) {
        f.y += f.v; f.x += Math.sin(f.y * 0.012) * 0.4;
        if (f.y > h + 4) { f.y = -6; f.x = Math.random() * w; }
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();
      requestAnimationFrame(loop);
    })();
  }

  /* ── Sparkle Field ─────────────────────────────────── */
  const sparkleField = document.getElementById('sparkleField');
  if (sparkleField) {
    const wrapper = sparkleField.closest('.portrait-wrapper');
    const count   = 20;
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('div');
      sp.className = 'sp';
      const angle = (i / count) * Math.PI * 2;
      const dist  = 140 + Math.random() * 60;
      sp.style.left    = (50 + Math.cos(angle) * (dist / wrapper.offsetWidth  * 50)) + '%';
      sp.style.top     = (50 + Math.sin(angle) * (dist / wrapper.offsetHeight * 50)) + '%';
      sp.style.setProperty('--dur',   (3 + Math.random() * 4) + 's');
      sp.style.setProperty('--delay', (Math.random() * 4)      + 's');
      sp.style.width  = (2 + Math.random() * 4) + 'px';
      sp.style.height = sp.style.width;
      sparkleField.appendChild(sp);
    }
  }

  /* ── Social link openLink helper ─────────────────── */
  window.openLink = function (url) { window.open(url, '_blank', 'noopener'); };

})();
