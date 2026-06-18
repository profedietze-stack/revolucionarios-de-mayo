// ============================================================
// UI — pantallas, navegacion, tooltips, toasts
// ============================================================

// ============================================================
// STAT DELTA TOAST
// ============================================================
function showStatDelta(prestChange, riesgoChange) {
  if (GS._menuPause) return; // don't render if navigating to menu
  const container = document.getElementById('stat-delta-toast');
  container.innerHTML = '';

  const toasts = [];
  if (prestChange !== 0) {
    toasts.push({
      cls: prestChange > 0 ? 'positive' : 'negative',
      text: (prestChange > 0 ? '▲' : '▼') + ' PRESTIGIO ' + (prestChange > 0 ? '+' : '') + prestChange
    });
  }
  if (riesgoChange !== 0) {
    toasts.push({
      cls: riesgoChange > 0 ? 'negative' : 'positive',
      text: (riesgoChange > 0 ? '▲' : '▼') + ' RIESGO ' + (riesgoChange > 0 ? '+' : '') + riesgoChange
    });
  }

  toasts.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'stat-delta ' + t.cls;
    el.textContent = t.text;
    el.style.animationDelay = (i * 0.15) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 2400 + i * 150);
  });
}

// ============================================================
// ACT TRANSITION
// ============================================================
function showActTransition(actNum, callback) {
  const data = ACT_TRANSITIONS[actNum];
  if (!data) { callback(); return; }
  AudioEngine.playActTransition(actNum);

  const inner = document.getElementById('act-transition-inner');

  // Build particles
  let particlesHTML = '';
  for (let i = 0; i < 18; i++) {
    const left = Math.random() * 100;
    const dur = 4 + Math.random() * 6;
    const delay = Math.random() * 5;
    const size = 1 + Math.random() * 3;
    particlesHTML += `<div class="act-particle" style="left:${left}%;bottom:${10 + Math.random()*60}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s;"></div>`;
  }

  // Build columns
  const colsHTML = data.columns.map(c => `
    <div>
      <div class="act-trans-col-title">${c.title}</div>
      <div class="act-trans-col-text">${c.text}</div>
    </div>
  `).join('');

  // Build guide (only act 1)
  let guideHTML = '';
  if (data.guide) {
    const items = data.guide.items.map(i => `<li>${i}</li>`).join('');
    guideHTML = `
      <div class="act-guide-box">
        <div class="act-guide-title">${data.guide.title}</div>
        <ul class="act-guide-items">${items}</ul>
      </div>`;
  }

  inner.innerHTML = `
    ${particlesHTML}
    <div class="act-roman">${data.roman}</div>
    <div class="act-trans-title">${data.title}</div>
    <div class="act-trans-subtitle">${data.subtitle}</div>
    <div class="act-trans-divider"><span class="act-trans-divider-gem">✦ ✦ ✦</span></div>
    <div class="act-trans-narrative">${data.narrative}</div>
    <div class="act-trans-columns">${colsHTML}</div>
    ${guideHTML}
    <div class="act-trans-divider"><span class="act-trans-divider-gem">✦</span></div>
    <button class="act-trans-btn" id="act-trans-continue-btn"><span>${data.btnText}</span></button>
  `;

  const overlay = document.getElementById('overlay-act');
  overlay.classList.add('visible');
  requestAnimationFrame(() => { overlay.scrollTop = 0; });

  document.getElementById('act-trans-continue-btn').onclick = () => {
    overlay.classList.remove('visible');
    // If this is Act I, fade out the Himno as the game begins
    if (actNum === 1) AudioEngine.fadeOutHimnoBeforeGame();
    setTimeout(callback, 700);
  };
}

function showScreen(id) {
  // Close any open tooltip before switching screens
  document.querySelectorAll('.tt-open').forEach(el => el.classList.remove('tt-open'));
  const all = document.querySelectorAll('.screen');
  const target = document.getElementById(id);
  if (!target) return;

  // Hide all screens immediately — remove active, add hidden
  all.forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
    s.style.pointerEvents = 'none';
  });

  // Show target
  target.classList.remove('hidden');
  target.classList.add('active');
  target.style.pointerEvents = '';
}

function showMenu() {
  // Reset any mid-game pause flags
  if (typeof GS !== 'undefined' && GS) GS._menuPause = false;
  checkLoadButton();
  showScreen('screen-menu');
  // Only restart music if the himno isn't already running
  if (AudioEngine.isHimnoRunning && !AudioEngine.isHimnoRunning()) {
    AudioEngine.playMenu();
  }
}

// Called ONLY from the in-game "◀ MENÚ" button.
// Shows a confirmation overlay, then fully tears down the active game session
// before navigating — prevents audio bleed, ghost clicks, and floating stat effects.
function goToMenuFromGame() {
  if (!GS.gameStarted || GS.gameEnded) {
    showMenu();
    return;
  }

  // Remove any existing instance first to avoid duplication
  const existing = document.getElementById('overlay-menu-confirm');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'overlay-menu-confirm';
  el.className = 'overlay';
  el.innerHTML = `
    <div class="overlay-box" style="max-width:420px;">
      <div class="overlay-icon" style="font-size:2rem;">🏛️</div>
      <div class="overlay-title" style="font-size:1.2rem;color:var(--navy);">¿VOLVER AL MENÚ?</div>
      <div class="overlay-text">Tu partida se guarda automáticamente. Podrás continuar desde donde estás al volver.</div>
      <button class="btn btn-primary" onclick="_confirmGoMenu()" style="margin-bottom:10px;"><span>◀ IR AL MENÚ</span></button>
      <button class="btn" onclick="_cancelGoMenu()"><span>✕ CANCELAR</span></button>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
}

function _confirmGoMenu() {
  // 1. Remove overlay from DOM entirely
  const el = document.getElementById('overlay-menu-confirm');
  if (el) { el.classList.remove('visible'); setTimeout(() => el.remove(), 400); }

  // 2. Stop all game audio immediately
  AudioEngine.stopAll ? AudioEngine.stopAll(0.4) : null;

  // 3. Flag pause state
  GS._menuPause = true;

  // 4. Remove any lingering floating stat elements and clear toast container
  document.querySelectorAll('.stat-float, .stat-effect, [class*="float-stat"]').forEach(e => e.remove());
  const toastContainer = document.getElementById('stat-delta-toast');
  if (toastContainer) toastContainer.innerHTML = '';

  // 5. Navigate
  showMenu();
}

function _cancelGoMenu() {
  const el = document.getElementById('overlay-menu-confirm');
  if (el) {
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 400);
  }
}

function toggleFullscreen() {
  try {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  } catch(e) {}
}

function enterFullscreenIfNeeded() {
  try {
    if (document.fullscreenElement) return;
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } catch(e) {}
}

function updateUI() {
  document.getElementById('sidebar-player').textContent = GS.playerName;
  document.getElementById('stat-prestigio-val').textContent = GS.prestigio;
  document.getElementById('stat-riesgo-val').textContent = GS.riesgo + '/150';
  document.getElementById('bar-prestigio').style.width = Math.round(GS.prestigio / PRESTIGIO_MAX * 100) + '%';

  // Riesgo bar scales over RIESGO_MAX; turns red in danger zone
  const riesgoPct = Math.round((GS.riesgo / RIESGO_MAX) * 100);
  const riesgoBar = document.getElementById('bar-riesgo');
  riesgoBar.style.width = riesgoPct + '%';
  if (GS.riesgo >= RIESGO_DANGER) {
    riesgoBar.style.background = 'linear-gradient(90deg, #c0392b, #ff6b6b)';
    riesgoBar.style.boxShadow = '0 0 6px rgba(255,80,80,0.5)';
    document.getElementById('riesgo-warning').style.display = 'block';
  } else {
    riesgoBar.style.background = 'linear-gradient(90deg, #7a1c1c, #e05050)';
    riesgoBar.style.boxShadow = 'none';
    document.getElementById('riesgo-warning').style.display = 'none';
  }

  // Riesgo acumulado en el acto actual
  const riesgoActoEl = document.getElementById('riesgo-acto');
  if (riesgoActoEl && GS.riesgoActo !== undefined) {
    const sign = GS.riesgoActo > 0 ? '+' : '';
    riesgoActoEl.textContent = GS.riesgoActo !== 0 ? `Este acto: ${sign}${GS.riesgoActo}` : '';
  }

  // Pulso rojo en zona crítica
  const dv = document.getElementById('danger-vignette');
  if (dv) dv.style.display = GS.riesgo >= RIESGO_DANGER ? 'block' : 'none';

  // Eventos de rutas alternativas: mapeados a su posición lógica para el display
  const ALT_EVENTS_DISPLAY = { 221: 22, 222: 23 };
  const logicalEvent = ALT_EVENTS_DISPLAY[GS.currentEvent] || GS.currentEvent;
  const isEpilogo = logicalEvent > 45;

  const pct = isEpilogo ? 100 : Math.round(((logicalEvent - 1) / 45) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = isEpilogo
    ? `Epílogo ${logicalEvent - 45} / 5`
    : `Evento ${logicalEvent} / 45`;

  let act = "Acto I: La Tensión";
  let actNum = 'I', actLabel = 'TENSIÓN';
  if (logicalEvent > 13 && logicalEvent <= 31) {
    act = "Acto II: La Revolución";
    actNum = 'II'; actLabel = 'REVOLUCIÓN';
  }
  if (logicalEvent > 31 && logicalEvent <= 45) {
    act = "Acto III: La Consolidación";
    actNum = 'III'; actLabel = 'CONSOLID.';
  }
  if (isEpilogo) {
    act = "Epílogo · Los Personajes";
    actNum = 'E'; actLabel = 'EPÍLOGO';
  }
  document.getElementById('act-indicator').textContent = act;
  const mNum = document.getElementById('mobile-act-num');
  const mLab = document.getElementById('mobile-act-label');
  if (mNum) mNum.textContent = actNum;
  if (mLab) mLab.textContent = actLabel;

  // Frases
  const f = FRASES[GS.fraseIndex % FRASES.length];
  document.getElementById('frase-del-dia').innerHTML =
    `"${f.text}" <em>— ${f.author}</em>`;

  // Logros
  const ll = document.getElementById('logros-list');
  ll.innerHTML = '';
  GS.logros.forEach(lid => {
    const def = LOGROS_DEF.find(l => l.id === lid);
    if (def) {
      const el = document.createElement('div');
      el.className = 'logro-badge';
      el.textContent = def.nombre;
      ll.appendChild(el);
    }
  });
}

// ============================================================
// SAVE TOAST
// ============================================================
let _saveToastTimer = null;
function showSaveToast(success = true) {
  if (GS._menuPause) return;
  const el = document.getElementById('save-toast');
  if (!el) return;
  if (_saveToastTimer) { clearTimeout(_saveToastTimer); el.classList.remove('visible'); }
  el.textContent = success ? '✔ GUARDADO' : '⚠ SIN GUARDAR';
  el.className = success ? 'save-toast-ok' : 'save-toast-err';
  // Force reflow so transition fires even on rapid re-triggers
  void el.offsetWidth;
  el.classList.add('visible');
  _saveToastTimer = setTimeout(() => {
    el.classList.remove('visible');
    _saveToastTimer = null;
  }, 2200);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Tabla precompilada: escapamos cada término y su definición UNA sola vez al
// cargar el módulo, en vez de re-escapar los ~50 términos en cada render de
// evento (antes: ~350 escapes por evento). Salida idéntica al algoritmo original:
// mismo orden de TOOLTIP_DICT, primer término gana (dedup conserva el primero).
const TOOLTIP_COMPILED = (() => {
  const seen = new Set();
  const out = [];
  for (const [term, defn] of TOOLTIP_DICT) {
    if (seen.has(term)) continue;
    seen.add(term);
    out.push({ term, esc: escHtml(term), defnEsc: defn.replace(/"/g, '&quot;').replace(/'/g, '&#39;') });
  }
  return out;
})();

// Split text by HTML tags, replace only in text segments (not inside < > or attributes).
function applyTooltips(text) {
  let result = escHtml(text);
  for (const { esc, defnEsc } of TOOLTIP_COMPILED) {
    // Split on HTML tags (keep delimiters). Even indices = text nodes, odd = tags.
    const parts = result.split(/(<[^>]*>)/);
    let replaced = false;
    for (let i = 0; i < parts.length; i += 2) {
      const idx = parts[i].indexOf(esc);
      if (idx !== -1) {
        parts[i] = parts[i].slice(0, idx)
          + '<span class="tt" data-tt="' + defnEsc + '" onclick="openTooltipModal(this)">'
          + esc + '</span>'
          + parts[i].slice(idx + esc.length);
        replaced = true;
        break;
      }
    }
    if (!replaced) continue;
    result = parts.join('');
  }
  return result;
}

function openTooltipModal(el) {
  const term = el.textContent;
  const def  = el.getAttribute('data-tt');
  document.getElementById('tt-modal-term').textContent = term;
  document.getElementById('tt-modal-def').textContent  = def;
  document.getElementById('tt-modal').classList.add('visible');
}

function closeTooltipModal() {
  document.getElementById('tt-modal').classList.remove('visible');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function showNotification(msg) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3200);
}

function showLogroNotif(def) {
  const iconMatch = def.nombre.match(/^(\p{Emoji})/u);
  const icon = iconMatch ? iconMatch[1] : '🏆';
  const nameNoIcon = def.nombre.replace(/^(\p{Emoji}\s*)/u, '');
  const n = document.createElement('div');
  n.className = 'logro-notif';
  n.innerHTML = `
    <div class="logro-notif-header">✦ LOGRO DESBLOQUEADO ✦</div>
    <div class="logro-notif-body">
      <span class="logro-notif-icon">${icon}</span>
      <div class="logro-notif-text">
        <div class="logro-notif-name">${nameNoIcon}</div>
        <div class="logro-notif-desc">${def.desc || ''}</div>
      </div>
    </div>`;
  document.body.appendChild(n);
  setTimeout(() => n.classList.add('logro-notif-out'), 4200);
  setTimeout(() => n.remove(), 4600);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
});

// ── Global button sound routing ────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('button, .manual-tab, .choice-btn');
  if (!el) return;

  // Determine sound type from element classes / id
  let type = 'ui';

  if (el.id === 'splash-btn')                         type = 'splash';
  else if (el.classList.contains('choice-btn'))       type = 'choice';
  else if (el.classList.contains('manual-tab'))       type = 'tab';
  else if (el.classList.contains('act-trans-btn'))    type = 'primary';
  else if (el.classList.contains('btn-primary'))      type = 'primary';
  else if (el.classList.contains('btn-download'))     type = 'primary';
  else if (el.classList.contains('btn-captura'))      type = 'primary';
  else if (el.id === 'audio-toggle-btn')              type = 'tab';
  else if (
    el.textContent.includes('BORRAR') ||
    el.textContent.includes('RESET')  ||
    el.textContent.includes('🗑')
  )                                                   type = 'danger';
  else if (el.classList.contains('btn'))              type = 'ui';

  AudioEngine.playButtonSound(type);
}, true); // capture phase so sound fires before any onclick handler

// ── Tooltips pedagógicos: soporte táctil y detección de borde ──
(function() {
  let openTt = null;

  function closeAll() {
    if (openTt) { openTt.classList.remove('tt-open'); openTt = null; }
  }

  function positionTt(el) {
    el.classList.remove('tt-left', 'tt-right', 'tt-below');
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    // Flip below if too close to top
    if (r.top < 140) el.classList.add('tt-below');
    // Shift if near right edge
    if (r.left + r.width / 2 > vw - 150) el.classList.add('tt-left');
    // Shift if near left edge
    else if (r.left + r.width / 2 < 150) el.classList.add('tt-right');
  }

  document.addEventListener('click', function(e) {
    const tt = e.target.closest('.tt');
    if (!tt) { closeAll(); return; }

    // On touch devices, toggle on tap
    if (tt === openTt) { closeAll(); return; }
    closeAll();
    positionTt(tt);
    tt.classList.add('tt-open');
    openTt = tt;
    // Note: no stopPropagation — the global sound handler uses capture phase
    // so it fires regardless. Bubbling continues normally.
  });

  // On desktop hover, position on mouseenter
  document.addEventListener('mouseover', function(e) {
    const tt = e.target.closest('.tt');
    if (tt) positionTt(tt);
  });
})();

