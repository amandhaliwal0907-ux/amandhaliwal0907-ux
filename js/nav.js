
// navigation and UI logic

window.enterPro = function (skipSave) {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('funBg').style.display = 'none';
  document.getElementById('proBg').style.display = 'none';
  document.getElementById('threeCanvas').style.display = 'none';

  window._pipeStop();

  const pro = document.getElementById('pro');
  pro.style.display = 'block';
  requestAnimationFrame(() => pro.classList.add('visible'));

  if (!skipSave) sessionStorage.setItem('view', 'pro-landing');
};

window.showProSection = function (id) {
  document.getElementById('pro-landing').style.display = 'none';

  document.querySelectorAll('.pro-section').forEach(s => {
    s.classList.remove('active', 'visible');
  });

  const t = document.getElementById(id);
  t.classList.add('active');

  requestAnimationFrame(() => t.classList.add('visible'));

  document.getElementById('pro').scrollTop = 0;

  sessionStorage.setItem('view', 'pro-section');
  sessionStorage.setItem('section', id);
};

window.showProLanding = function () {
  document.querySelectorAll('.pro-section').forEach(s => {
    s.classList.remove('active', 'visible');
  });

  document.getElementById('pro-landing').style.display = 'flex';
  document.getElementById('pro').scrollTop = 0;

  sessionStorage.setItem('view', 'pro-landing');
  sessionStorage.removeItem('section');
};

window.goBackToLanding = function () {
  const pro = document.getElementById('pro');
  pro.classList.remove('visible');

  setTimeout(() => {
    pro.style.display = 'none';

    document.getElementById('landing').style.display = 'block';
    document.getElementById('funBg').style.display = 'block';
    document.getElementById('proBg').style.display = 'block';
    document.getElementById('threeCanvas').style.display = 'block';

    window._pipeStart();

    window.showProLanding();

    sessionStorage.removeItem('view');
    sessionStorage.removeItem('section');
  }, 400);
};

window.openPopup = function (id) {
  const popup = document.getElementById(id);
  popup.style.display = 'flex';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => popup.classList.add('open'));
  });

  sessionStorage.setItem('popup', id);
};

window.closePopup = function (id) {
  const popup = document.getElementById(id);

  popup.classList.remove('open');

  setTimeout(() => {
    popup.style.display = 'none';
  }, 300);

  sessionStorage.removeItem('popup');
};

window.handlePopupClick = function (e, id) {
  if (e.target === document.getElementById(id)) {
    window.closePopup(id);
  }
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.project-popup.open').forEach(p => {
      window.closePopup(p.id);
    });
  }
});

// button logic

const funBtn = document.querySelector('.funBtn');
const funBg = document.getElementById('funBg');
const funVideo = document.getElementById('funVideo');
const audio = document.getElementById('audio');

audio.volume = 0.3;

funBtn.onmouseenter = () => {
  funBg.style.opacity = '1';
  funVideo.play();

  audio.currentTime = 0;
  audio.play();

  funBtn.classList.add('redGlow');
};

funBtn.onmouseleave = () => {
  funBg.style.opacity = '0';
  funVideo.pause();
  funVideo.currentTime = 0;

  audio.pause();
  audio.currentTime = 0;

  funBtn.classList.remove('redGlow');
};

funBtn.onclick = () => {
  window._pipeReset();
  alert('Work in progress - check back soon!');
};

const proBtn = document.querySelector('.proBtn');

proBtn.onmouseenter = () => {
  document.getElementById('proBg').style.opacity = '1';
  document.getElementById('threeCanvas').style.opacity = '1';
};

proBtn.onmouseleave = () => {
  document.getElementById('proBg').style.opacity = '0';
  document.getElementById('threeCanvas').style.opacity = '0';
};

proBtn.onclick = () => {
  window._pipeReset();
  window.enterPro();
};

// restore state

(function restoreState() {
  const view = sessionStorage.getItem('view');
  if (!view) return;

  if (view === 'pro-landing' || view === 'pro-section') {
    window.enterPro(true);

    if (view === 'pro-section') {
      const section = sessionStorage.getItem('section');

      if (section) {
        setTimeout(() => {
          window.showProSection(section);

          const popup = sessionStorage.getItem('popup');
          if (popup) {
            setTimeout(() => window.openPopup(popup), 200);
          }
        }, 50);
      }
    }
  }
})();
