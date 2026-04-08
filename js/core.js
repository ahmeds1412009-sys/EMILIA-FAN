/* ============================================================
   EMILIA — core.js   (shared across all pages)
   ============================================================ */
(function () {
  'use strict';

  /* ── LOADER ──────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1800);
    });
  }

  /* ── HEADER SCROLL ───────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── HAMBURGER MENU ──────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay= document.getElementById('drawerOverlay');

  function openDrawer() {
    hamburger.classList.add('open');
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
  }
  function closeDrawer() {
    hamburger.classList.remove('open');
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  }

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    /* close when tapping the dim overlay */
    drawerOverlay.addEventListener('click', closeDrawer);
    /* close when a link inside drawer is tapped */
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
    /* close on keyboard Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ── THEME (day / night) ─────────────────────────────── */
  const body = document.body;
  function applyTimeTheme() {
    const h = new Date().getHours();
    body.classList.toggle('day', h >= 6 && h < 18);
    body.classList.toggle('night', h < 6 || h >= 18);
  }
  applyTimeTheme();
  setInterval(applyTimeTheme, 60000);

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      body.classList.toggle('day');
      body.classList.toggle('night');
      themeBtn.textContent = body.classList.contains('day') ? '☀️' : '🌙';
    });
  }

  /* ── CUSTOM CURSOR ───────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });
    (function ringLoop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();
  }

  /* ── SNOW CANVAS ─────────────────────────────────────── */
  const canvas = document.getElementById('fxCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, flakes = [], cursorParts = [];

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    for (let i = 0; i < 180; i++) {
      flakes.push({ x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 2.4, v: 0.3 + Math.random() * 1.0, a: Math.random() * Math.PI * 2, o: 0.5 + Math.random() * 0.45 });
    }

    document.addEventListener('mousemove', e => {
      if (Math.random() < 0.3) {
        cursorParts.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.8, vy: -1.5 + Math.random(), life: 35 + (Math.random() * 30 | 0), r: 1.5 + Math.random() * 2.5 });
      }
    }, { passive: true });

    function snowLoop() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(200,232,255,0.92)';
      ctx.beginPath();
      for (const f of flakes) {
        f.y += f.v; f.x += Math.sin(f.a) * 0.35; f.a += 0.008;
        if (f.y > H + 6) { f.y = -8; f.x = Math.random() * W; }
        ctx.globalAlpha = f.o;
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();

      for (let i = cursorParts.length - 1; i >= 0; i--) {
        const p = cursorParts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life--;
        ctx.globalAlpha = Math.max(0, p.life / 65);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) cursorParts.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(snowLoop);
    }
    snowLoop();
  }

  /* ── TOUCH SNOW ──────────────────────────────────────── */
  function spawnTouchSnow(x, y) {
    const el = document.createElement('div');
    el.className = 'touch-snow';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
  document.addEventListener('mousemove', e => spawnTouchSnow(e.clientX, e.clientY), { passive: true });
  document.addEventListener('touchmove', e => {
    for (const t of e.touches) spawnTouchSnow(t.clientX, t.clientY);
  }, { passive: true });

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── ANIMATED STATS ──────────────────────────────────── */
  document.querySelectorAll('.stat-val').forEach(el => {
    const target = el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) { el.textContent = target + suffix; return; }
    const end = parseInt(target);
    let cur = 0;
    const step = Math.max(1, Math.ceil(end / 60));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          el.textContent = cur + suffix;
          if (cur >= end) clearInterval(t);
        }, 25);
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ── BACKGROUND MUSIC ────────────────────────────────── */
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic     = document.getElementById('bgMusic');
  if (musicToggle && bgMusic) {
    let playing = false;
    musicToggle.addEventListener('click', () => {
      if (playing) {
        bgMusic.pause();
        musicToggle.classList.add('muted');
        playing = false;
      } else {
        bgMusic.volume = 0.25;
        bgMusic.play().then(() => {
          musicToggle.classList.remove('muted');
          playing = true;
        }).catch(() => {}); // autoplay policy
      }
    });
    // auto-attempt on first interaction
    document.addEventListener('click', function autoPlay() {
      if (!playing) { bgMusic.volume = 0.25; bgMusic.play().then(() => { playing = true; musicToggle.classList.remove('muted'); }).catch(() => {}); }
      document.removeEventListener('click', autoPlay);
    }, { once: true });
  }

  /* ── EMILIA MASCOT ───────────────────────────────────── */
  const emilia = document.getElementById('emiliaMascot');
  if (!emilia) return;

  let mascotState = 'idle';
  let idleT, sleepT, walkT, runT;
  let isDragging = false, offX = 0, offY = 0, clickCnt = 0;

  const SPRITE_W = 130, SPRITE_H = 130;

  /* ── Force position mode: clear CSS bottom/right, set explicit top/left ── */
  emilia.style.bottom = 'auto';
  emilia.style.right  = 'auto';
  emilia.style.left   = (window.innerWidth  - SPRITE_W - 40) + 'px';
  emilia.style.top    = (window.innerHeight - SPRITE_H - 80) + 'px';
  emilia.style.transition = 'none';

  const sfx = {
    welcome: tryAudio('assets/audio/welcome.mp3'),
    angry:   tryAudio('assets/audio/angry.mp3'),
    laugh:   tryAudio('assets/audio/laugh.mp3'),
  };

  function tryAudio(src) {
    try { const a = new Audio(src); a.volume = 0.6; return a; } catch { return null; }
  }
  function playSfx(name) { try { sfx[name]?.play(); } catch {} }

  function setMascotState(s) {
    if (mascotState === s) return;
    emilia.className = 'emilia-sprite ' + s;
    mascotState = s;
  }

  function clearTimers() { clearTimeout(idleT); clearTimeout(sleepT); clearTimeout(walkT); clearTimeout(runT); }

  function startIdle() {
    clearTimers();
    idleT  = setTimeout(randomWalk, 6000 + Math.random() * 5000);
    sleepT = setTimeout(() => setMascotState('sleep'), 300000);
  }

  function randomWalk() {
    setMascotState('walk');
    /* roam the full viewport — clamp so sprite stays fully on-screen */
    const maxX = window.innerWidth  - SPRITE_W  - 10;
    const maxY = window.innerHeight - SPRITE_H  - 10;
    const tx = 10 + Math.random() * Math.max(0, maxX - 10);
    const ty = 10 + Math.random() * Math.max(0, maxY - 10);
    /* smooth CSS transition for the walk */
    emilia.style.transition = 'left 2.2s cubic-bezier(.25,.46,.45,.94), top 2.2s cubic-bezier(.25,.46,.45,.94)';
    emilia.style.left = tx + 'px';
    emilia.style.top  = ty + 'px';
    walkT = setTimeout(() => {
      emilia.style.transition = 'none';
      setMascotState('idle');
      startIdle();
    }, 2800 + Math.random() * 2000);
  }

  // init
  window.addEventListener('load', () => {
    setMascotState('welcome');
    playSfx('welcome');
    setTimeout(() => { setMascotState('idle'); startIdle(); }, 2200);
  });

  // drag (mouse)
  emilia.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging = true;
    const r = emilia.getBoundingClientRect();
    offX = e.clientX - r.left; offY = e.clientY - r.top;
    emilia.style.cursor = 'grabbing';
    emilia.style.transition = 'none';
    clearTimers();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const nx = Math.max(0, Math.min(window.innerWidth  - SPRITE_W,  e.clientX - offX));
    const ny = Math.max(0, Math.min(window.innerHeight - SPRITE_H,  e.clientY - offY));
    emilia.style.left = nx + 'px';
    emilia.style.top  = ny + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    emilia.style.cursor = 'grab';
    startIdle();
  });

  // click = laugh
  emilia.addEventListener('click', () => {
    setMascotState('laugh'); playSfx('laugh');
    setTimeout(() => { setMascotState('idle'); startIdle(); }, 1400);
  });

  // spam click = angry
  setInterval(() => { clickCnt = 0; }, 2000);
  emilia.addEventListener('mousedown', () => {
    clickCnt++;
    if (clickCnt >= 8) { setMascotState('angry'); playSfx('angry'); setTimeout(() => { setMascotState('idle'); startIdle(); }, 1400); clickCnt = 0; }
  });

  // touch drag
  emilia.addEventListener('touchstart', e => {
    isDragging = true;
    const t = e.touches[0], r = emilia.getBoundingClientRect();
    offX = t.clientX - r.left; offY = t.clientY - r.top;
    emilia.style.transition = 'none';
    clearTimers();
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const t = e.touches[0];
    const nx = Math.max(0, Math.min(window.innerWidth  - SPRITE_W,  t.clientX - offX));
    const ny = Math.max(0, Math.min(window.innerHeight - SPRITE_H,  t.clientY - offY));
    emilia.style.left = nx + 'px';
    emilia.style.top  = ny + 'px';
  }, { passive: true });
  document.addEventListener('touchend', () => { isDragging = false; startIdle(); });

  // random idle events
  setInterval(() => {
    if (mascotState !== 'idle') return;
    const r = Math.random();
    if      (r < 0.10) { setMascotState('eat');   setTimeout(() => { setMascotState('idle'); startIdle(); }, 1400); }
    else if (r < 0.20) { setMascotState('laugh');  setTimeout(() => { setMascotState('idle'); startIdle(); }, 1200); }
  }, 20000);

  /* ── RIGHT-CLICK / KEY PROTECTION ───────────────────── */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && ['s','u','c','a'].includes(e.key.toLowerCase()))) e.preventDefault();
  });

})();
