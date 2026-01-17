// فتح فيديو اليوتيوب عند الضغط على اللعبة
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const link = card.dataset.youtube;
    window.open(link, '_blank');

    // تفاعل بسيط مع الدمية (لو موجودة)
    if (window.EmiliaMascot?.react) {
      EmiliaMascot.react("game");
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const snowBtn = document.querySelector('.snow-button');
  const dropdown = document.querySelector('.snow-dropdown');
  const modeBtn = document.querySelector('.mode-button');
  const modeDropdown = document.querySelector('.mode-dropdown');
  const modeOptions = document.querySelectorAll('.mode-option');

  // فتح القائمة الرئيسية
  snowBtn.addEventListener('click', (e) => {
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    e.stopPropagation();
  });

  // فتح قائمة Mode
  modeBtn.addEventListener('click', (e) => {
    modeDropdown.style.display = modeDropdown.style.display === 'flex' ? 'none' : 'flex';
    e.stopPropagation();
  });

  // إخفاء القوائم لو ضغطت بره
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
    modeDropdown.style.display = 'none';
  });

  // تبديل بين White و Dark Mode
  modeOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const mode = e.target.dataset.mode;
      if(mode === 'dark'){
        document.documentElement.style.setProperty('--bg1', '#0c0397');
        document.documentElement.style.setProperty('--bg2', '#0e0250');
        document.documentElement.style.setProperty('--text', '#010611');
      } else {
        document.documentElement.style.setProperty('--bg1', '#50a3e7');
        document.documentElement.style.setProperty('--bg2', '#0856cc');
        document.documentElement.style.setProperty('--text', '#f5f1f1');
      }
      modeDropdown.style.display = 'none'; // أغلق القائمة بعد التغيير
    });
  });
});