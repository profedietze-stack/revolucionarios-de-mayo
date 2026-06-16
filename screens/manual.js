// ============================================================
// MANUAL DIDACTICO
// ============================================================

// ============================================================
// MANUAL
// ============================================================
function showManual() {
  if (GS.gameStarted && !GS.gameEnded) {
    // Show inline confirmation overlay instead of native confirm()
    showManualConfirm();
    return;
  }
  _goToManual();
}

function showManualConfirm() {
  const existing = document.getElementById('overlay-manual-confirm');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'overlay-manual-confirm';
  el.className = 'overlay';
  el.innerHTML = `
    <div class="overlay-box" style="max-width:420px;">
      <div class="overlay-icon" style="font-size:2rem;">📜</div>
      <div class="overlay-title" style="font-size:1.2rem;color:var(--navy);">¿IR AL MANUAL?</div>
      <div class="overlay-text">Tu partida se guarda automáticamente. Podrás continuar desde donde estás al volver.</div>
      <button class="btn btn-primary" onclick="_confirmGoManual()" style="margin-bottom:10px;"><span>📖 IR AL MANUAL</span></button>
      <button class="btn" onclick="_cancelGoManual()"><span>✕ CANCELAR</span></button>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
}

function _confirmGoManual() {
  const el = document.getElementById('overlay-manual-confirm');
  if (el) { el.classList.remove('visible'); setTimeout(() => el.remove(), 400); }
  _goToManual();
}
function _cancelGoManual() {
  const el = document.getElementById('overlay-manual-confirm');
  if (el) { el.classList.remove('visible'); setTimeout(() => el.remove(), 400); }
}
function _goToManual() {
  if (GS.gameStarted && !GS.leyoManual) {
    GS.leyoManual = true;
    checkLogros();
    saveGame();
  }
  buildGlosario();
  showScreen('screen-manual');
}

function buildGlosario() {
  const container = document.getElementById('tab-glosario');
  if (!container || container.dataset.built) return;
  container.dataset.built = '1';

  const seen = new Set();
  const entries = [];
  for (const [term, def] of TOOLTIP_DICT) {
    if (seen.has(term)) continue;
    seen.add(term);
    entries.push([term, def]);
  }
  entries.sort((a, b) => a[0].localeCompare(b[0], 'es', { sensitivity: 'base' }));

  let html = `<p class="manual-p glosario-intro">${entries.length} términos históricos. Aparecen como tooltips subrayados en el texto del juego.</p>`;

  let currentLetter = '';
  for (const [term, def] of entries) {
    const letter = term[0].toUpperCase();
    if (letter !== currentLetter) {
      currentLetter = letter;
      html += `<div class="glosario-letra">${letter}</div>`;
    }
    html += `<div class="glosario-item"><span class="glosario-term">${escHtml(term)}</span><span class="glosario-def">${escHtml(def)}</span></div>`;
  }

  container.innerHTML = html;
}

function toggleSidebar() {
  const sb = document.getElementById('game-sidebar');
  sb.classList.toggle('expanded');
  const label = document.getElementById('sidebar-toggle-label');
  label.textContent = sb.classList.contains('expanded') ? '📊 OCULTAR STATS' : '📊 ESTADÍSTICAS';
}

function initSidebarToggle() {
  // On mobile (≤600px) the sidebar is a static horizontal bar — no toggle needed.
  // On desktop/tablet, sidebar is always visible — no toggle needed either.
  // This function is kept for compatibility but does nothing.
}

window.addEventListener('resize', initSidebarToggle);

function switchTab(tabId, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.manual-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');
}
