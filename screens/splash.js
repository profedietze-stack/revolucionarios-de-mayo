// ============================================================
// SPLASH SCREEN
// ============================================================

// ============================================================
// SPLASH SCREEN
// ============================================================
const SPLASH_STEPS = [
  { label: 'CARGANDO EVENTOS',    text: 'Preparando el Buenos Aires de 1810…',         pct: 12 },
  { label: 'CARGANDO PERSONAJES', text: 'Convocando a Moreno, Belgrano, Saavedra…',    pct: 28 },
  { label: 'CARGANDO LOGROS',     text: 'Registrando los logros de la revolución…',    pct: 44 },
  { label: 'CARGANDO HISTORIA',   text: 'Consultando los archivos de 1810…',           pct: 60 },
  { label: 'CARGANDO AUDIO',      text: 'Afinando la guitarra criolla y las campanas…', pct: 76 },
  { label: 'CARGANDO HIMNO',      text: 'Ensayando el Himno Nacional Argentino…',      pct: 90 },
  { label: 'LISTO',               text: '¡Buenos Aires te espera, mensajero!',          pct: 100 },
];

function initSplashParticles() {
  const container = document.getElementById('splash-particles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'splash-particle';
    const size = 1.5 + Math.random() * 3;
    p.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `bottom:${Math.random() * 30}%`,
      `animation-duration:${6 + Math.random() * 10}s`,
      `animation-delay:${Math.random() * 8}s`,
    ].join(';');
    container.appendChild(p);
  }
}

let _splashReady = false;

function runSplashProgress() {
  const fill  = document.getElementById('splash-progress-fill');
  const step  = document.getElementById('splash-progress-step');
  const label = document.getElementById('splash-progress-label');
  const btn   = document.getElementById('splash-btn');
  const btnTxt= document.getElementById('splash-btn-text');
  if (!fill) return;

  let idx = 0;
  function next() {
    if (idx >= SPLASH_STEPS.length) {
      _splashReady = true;
      if (btn) { btn.disabled = false; }
      if (btnTxt) { btnTxt.textContent = 'COMENZAR'; }
      if (label) { label.textContent = 'LISTO'; }
      return;
    }
    const s = SPLASH_STEPS[idx++];
    if (fill)  fill.style.width  = s.pct + '%';
    if (label) label.textContent = s.label;
    if (step)  step.textContent  = s.text;
    // Vary delay: shorter for early steps, longer for last two
    const delay = idx < 5 ? 380 + Math.random() * 280 : 500 + Math.random() * 400;
    setTimeout(next, delay);
  }
  // Small initial pause so the page has painted
  setTimeout(next, 320);
}

async function splashBegin() {
  if (!_splashReady) return;
  const btn = document.getElementById('splash-btn');
  if (btn) btn.disabled = true;

  // 1. Fullscreen — must be called directly from user gesture
  try {
    const el = document.documentElement;
    if (el.requestFullscreen)             await el.requestFullscreen().catch(()=>{});
    else if (el.webkitRequestFullscreen)  el.webkitRequestFullscreen();  // Safari
    else if (el.mozRequestFullScreen)     el.mozRequestFullScreen();
  } catch(e) {}

  // 2. Init Web Audio (requires user gesture — Android + Safari)
  AudioEngine.init();

  // 3. Init Tone.js removido — himno usa Web Audio API puro

  // 4. Start music immediately
  AudioEngine.playMenu();

  // 5. Preload/check saved game for load button
  checkLoadButton();
  initSidebarToggle();

  // 6. Animate splash out then show menu
  const splash = document.getElementById('screen-splash');
  splash.classList.add('fade-out');

  setTimeout(() => {
    splash.style.display = 'none';
    showScreen('screen-menu');
  }, 950);
}

document.addEventListener('DOMContentLoaded', () => {
  initSplashParticles();
  runSplashProgress();
});
