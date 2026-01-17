// ---------- portrait snow effect ----------
(function portraitSnow(){
  const portraits = document.querySelectorAll('.portrait .card');
  portraits.forEach(portrait => {
    const c = portrait.querySelector('.snow-layer');
    if(!c) return;
    const ctx = c.getContext('2d');
    c.width = portrait.offsetWidth;
    c.height = portrait.offsetHeight;

    let snowArr = [];
    for(let i=0;i<30;i++){
      snowArr.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: 1 + Math.random()*2,
        v: 0.2 + Math.random()*0.5
      });
    }

    function loop(){
      ctx.clearRect(0,0,c.width,c.height);
      for(let s of snowArr){
        s.y += s.v;
        s.x += Math.sin(s.y*0.01)*0.5;
        if(s.y > c.height){ s.y=-5; s.x=Math.random()*c.width; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', ()=>{
      c.width = portrait.offsetWidth;
      c.height = portrait.offsetHeight;
    });
  });
})();

