/* ================== تحديد الوقت تلقائي ================== */
const hour = new Date().getHours();
const body = document.body;

if (hour >= 6 && hour < 18) {
  body.classList.add("day");
} else {
  body.classList.add("night");
}

/* ================== منع النسخ والحفظ ================== */
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if (
    e.ctrlKey &&
    ["s", "u", "c", "x", "a"].includes(key)
  ) e.preventDefault();

  if (e.key === "F12") e.preventDefault();
});

/* ================== Snow Effect ================== */
const canvas = document.getElementById("fxCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h;
  let snowflakes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function createSnow(count) {
    snowflakes = [];
    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        d: Math.random() * 1.5 + 0.5
      });
    }
  }

  createSnow(body.classList.contains("day") ? 80 : 140);

  function drawSnow() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();

    for (const flake of snowflakes) {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    }

    ctx.fill();
    moveSnow();
  }

  function moveSnow() {
    for (const flake of snowflakes) {
      flake.y += flake.d;
      if (flake.y > h) {
        flake.y = -5;
        flake.x = Math.random() * w;
      }
    }
  }

  function animate() {
    drawSnow();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ================== touch snow effect (optional) ================== */
document.addEventListener("mousemove", e => {
  createTouchSnow(e);
});

document.addEventListener("touchmove", e => {
  createTouchSnow(e.touches[0]);
});

function createTouchSnow(e) {
  const snow = document.createElement("div");
  snow.className = "touch-snow";
  snow.style.left = e.clientX + "px";
  snow.style.top = e.clientY + "px";
  document.body.appendChild(snow);

  setTimeout(() => snow.remove(), 700);
}