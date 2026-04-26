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
  funBg.classList.add("active");
  funVideo.play();

  audio.currentTime = 0;
  audio.play();

  funBtn.classList.add("redGlow");
};

funBtn.onmouseleave = () => {
  funBg.classList.remove("active");
  funVideo.pause();
  funVideo.currentTime = 0;

  audio.pause();
  audio.currentTime = 0;

  funBtn.classList.remove("redGlow");
};

funBtn.onclick = () => {
  window._pipeReset();

  // 1. Fade everything to black
  const overlay = document.getElementById('itachiOverlay');
  const itachiVideo = document.getElementById('itachiVideo');
  const sharinganAudio = document.getElementById('sharinganAudio');

  // Stop hover audio/video
  funBg.classList.remove('active');
  funVideo.pause();
  funVideo.currentTime = 0;
  audio.pause();
  audio.currentTime = 0;

  // Show the overlay immediately — pure black screen
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('visible'));

  // Play itachi video + sharingan audio
  sharinganAudio.currentTime = 0;
  sharinganAudio.volume = 0.45;
  sharinganAudio.play();

  itachiVideo.currentTime = 0;
  itachiVideo.play();

  // Mount the fun section silently behind the overlay once it's fully opaque
  setTimeout(() => {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('funBg').style.display = 'none';
    document.getElementById('proBg').style.display = 'none';
    document.getElementById('threeCanvas').style.display = 'none';
    window._pipeStop();

    const fun = document.getElementById('fun');
    fun.style.display = 'block';
    requestAnimationFrame(() => fun.classList.add('visible'));
  }, 520);

  // When video ends, transition to fun section
  itachiVideo.onended = enterFunFromVideo;

  // Skip button
  document.getElementById('itachiSkip').onclick = enterFunFromVideo;
};

function enterFunFromVideo() {
  const overlay = document.getElementById('itachiOverlay');
  const itachiVideo = document.getElementById('itachiVideo');
  const sharinganAudio = document.getElementById('sharinganAudio');

  // Unbind so it doesn't fire twice
  itachiVideo.onended = null;
  document.getElementById('itachiSkip').onclick = null;

  // Fade out overlay — fun section is already live behind it
  overlay.classList.add('fade-out');

  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.remove('visible', 'fade-out');
    itachiVideo.pause();
    itachiVideo.currentTime = 0;
    sharinganAudio.pause();
    sharinganAudio.currentTime = 0;

    sessionStorage.setItem('view', 'fun');
  }, 600);
}

window.goBackFromFun = function () {
  const fun = document.getElementById('fun');
  fun.classList.remove('visible');

  setTimeout(() => {
    fun.style.display = 'none';
    window.showFunLanding();

    document.getElementById('landing').style.display = 'block';
    document.getElementById('funBg').style.display = 'block';
    document.getElementById('proBg').style.display = 'block';
    document.getElementById('threeCanvas').style.display = 'block';
    window._pipeStart();

    sessionStorage.removeItem('view');
    sessionStorage.removeItem('fun-section');
  }, 400);
};

window.showFunSection = function (id) {
  document.getElementById('fun-landing').style.display = 'none';
  document.querySelectorAll('.fun-section').forEach(s => s.classList.remove('active', 'visible'));

  const t = document.getElementById(id);
  t.classList.add('active');
  requestAnimationFrame(() => t.classList.add('visible'));
  document.getElementById('fun').scrollTop = 0;

  sessionStorage.setItem('view', 'fun-section');
  sessionStorage.setItem('fun-section', id);
};

window.showFunLanding = function () {
  document.querySelectorAll('.fun-section').forEach(s => s.classList.remove('active', 'visible'));
  document.getElementById('fun-landing').style.display = 'flex';
  document.getElementById('fun').scrollTop = 0;
  sessionStorage.setItem('view', 'fun');
  sessionStorage.removeItem('fun-section');
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

  if (view === 'fun' || view === 'fun-section') {
    // Show fun section immediately, skip the video on reload
    document.getElementById('landing').style.display = 'none';
    document.getElementById('funBg').style.display = 'none';
    document.getElementById('proBg').style.display = 'none';
    document.getElementById('threeCanvas').style.display = 'none';
    window._pipeStop();

    const fun = document.getElementById('fun');
    fun.style.display = 'block';
    requestAnimationFrame(() => fun.classList.add('visible'));

    if (view === 'fun-section') {
      const section = sessionStorage.getItem('fun-section');
      if (section) {
        setTimeout(() => window.showFunSection(section), 50);
      }
    }
  }
})();