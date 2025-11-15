// ---------- helper to open external links (replace with real URLs) ----------
function openLink(url){
  window.open(url,'_blank');
}

// ---------- canvas fx: global snow + lightning + cursor snow ----------
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

window.addEventListener('resize',()=>{W=canvas.width=innerWidth; H=canvas.height=innerHeight});

// snow particles
let snow = [];
function createSnow(){
  snow.push({x:Math.random()*W, y:Math.random()*H, r:1+Math.random()*3, v:0.3+Math.random()*1.2, a:Math.random()*Math.PI*2});
}
for(let i=0;i<160;i++) createSnow();

// cursor spawns
let cursorParticles=[];
window.addEventListener('mousemove',e=>{
  // spawn a particle occasionally
  if(Math.random()<0.25){
    cursorParticles.push({x:e.clientX, y:e.clientY, vx:(Math.random()-0.5)*1.5, vy:-1.2+Math.random()*0.5, life:40+rnd(40), r:2+Math.random()*3})
  }
});

function rnd(n){return Math.floor(Math.random()*n)}

// lightning timer
let nextFlash = 400 + Math.random()*2000;
let flashIntensity=0;

function step(){
  ctx.clearRect(0,0,W,H);
  // gradient background overlay to add depth
  let g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'rgba(14,24,48,0.0)');
  g.addColorStop(1,'rgba(3,8,20,0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // update and draw snow
  for(let i=snow.length-1;i>=0;i--){
    let s = snow[i];
    s.y += s.v;
    s.x += Math.sin(s.a)*0.3;
    s.a += 0.01;
    if(s.y>H+10){ s.y = -10; s.x = Math.random()*W }
    ctx.beginPath(); ctx.globalAlpha = 0.95; ctx.fillStyle='white'; ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
  }

  // draw cursor particles
  for(let i=cursorParticles.length-1;i>=0;i--){
    let p = cursorParticles[i];
    p.life--;
    p.x += p.vx; p.y += p.vy; p.vy += 0.06;
    ctx.beginPath(); ctx.globalAlpha = Math.max(0, p.life/80); ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    if(p.life<=0) cursorParticles.splice(i,1);
  }

  // lightning flash overlay
  if(nextFlash-- < 0){ flashIntensity = 0.6 + Math.random()*0.6; nextFlash = 400 + Math.random()*2200 }
  if(flashIntensity>0){
    ctx.fillStyle = 'rgba(220,235,255,'+flashIntensity*0.12+')';
    ctx.fillRect(0,0,W,H);
    flashIntensity *= 0.88;
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(step);
}
step();

// ---------- snow inside portrait card ----------
(function portraitSnow(){
  const portrait = document.querySelector('.portrait .card');
  const c = portrait.querySelector('.snow-layer');
  const cc = c.getContext('2d');
  c.width = portrait.offsetWidth; c.height = portrait.offsetHeight;
  let sarr=[]; for(let i=0;i<40;i++) sarr.push({x:Math.random()*c.width,y:Math.random()*c.height,r:1+Math.random()*2,v:0.3+Math.random()*0.7});
  function loop(){ cc.clearRect(0,0,c.width,c.height); cc.globalCompositeOperation='lighter';
    for(let s of sarr){ s.y += s.v; s.x += Math.sin(s.y*0.01)*0.5; if(s.y>c.height){ s.y=-5; s.x=Math.random()*c.width } cc.beginPath(); cc.fillStyle='rgba(255,255,255,0.9)'; cc.arc(s.x,s.y,s.r,0,Math.PI*2); cc.fill(); }
    requestAnimationFrame(loop);
  }
  loop();
  window.addEventListener('resize',()=>{c.width = portrait.offsetWidth; c.height = portrait.offsetHeight});
})();

// ---------- link hover snow + tint effect ----------
const slinks = document.querySelectorAll('.slink');
slinks.forEach(s=>{
  s.addEventListener('mouseenter',(e)=>{
    // quick burst
    for(let i=0;i<12;i++) cursorParticles.push({x:e.clientX+Math.random()*20-10,y:e.clientY+Math.random()*20-10,vx:(Math.random()-0.5)*2,vy:-2+Math.random()*2,life:30+rnd(30),r:1+Math.random()*3})
  })
  s.addEventListener('click', (ev)=>{
    ev.preventDefault();
    // tint and snow overlay on click
    const rect = s.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.left = (rect.left + rect.width/2) + 'px';
    el.style.top = (rect.top + rect.height/2) + 'px';
    el.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.2))';
    el.style.width = '12px'; el.style.height='12px'; el.style.zIndex = 60; el.style.pointerEvents='none'; document.body.appendChild(el);
    setTimeout(()=>el.remove(),700);
    // open link handled by onclick openLink() if present
    const label = s.querySelector('.label');
    if(label) label.style.color = 'white';
    setTimeout(()=>{ if(label) label.style.color = '' },1000);
  })
});

// small utility
function rnd(n){return Math.floor(Math.random()*n)};

// prevent right click on images? (optional) - commented out
// document.addEventListener('contextmenu', e=>{ if(e.target.tagName==='IMG') e.preventDefault() })

document.addEventListener("mousemove", createTouchSnow);
document.addEventListener("touchmove", (e) => {
  createTouchSnow(e.touches[0]);
});

function createTouchSnow(e) {
  const snow = document.createElement("div");
  snow.className = "touch-snow";
  snow.style.left = e.clientX + "px";
  snow.style.top = e.clientY + "px";
  document.body.appendChild(snow);

  setTimeout(() => {
    snow.remove();
  }, 700);
}