// ============================================================
// DEBUG PANEL — solo activo con ?debug=1 en la URL
// ============================================================
const DEBUG = location.search.includes('debug=1');

if (DEBUG) {
  // Inyectar estilos del panel
  const style = document.createElement('style');
  style.textContent = `
    #debug-panel {
      position: fixed;
      bottom: 0; right: 0;
      width: 320px;
      max-height: 60vh;
      overflow-y: auto;
      background: rgba(10,6,2,0.95);
      border: 1px solid #9a6830;
      border-bottom: none;
      border-right: none;
      font-family: monospace;
      font-size: 11px;
      color: #e8dfc8;
      z-index: 9999;
      padding: 8px;
      box-sizing: border-box;
    }
    #debug-panel h4 {
      margin: 0 0 6px;
      color: #c5a040;
      font-size: 11px;
      letter-spacing: 0.1em;
      border-bottom: 1px solid #9a6830;
      padding-bottom: 4px;
    }
    #debug-panel .dbg-row {
      display: flex; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;
    }
    #debug-panel button {
      background: #2a1a08;
      border: 1px solid #9a6830;
      color: #e8dfc8;
      font-family: monospace;
      font-size: 10px;
      padding: 2px 6px;
      cursor: pointer;
      border-radius: 2px;
    }
    #debug-panel button:hover { background: #3a2a10; }
    #debug-panel input[type=number] {
      width: 52px;
      background: #1a0a04;
      border: 1px solid #9a6830;
      color: #e8dfc8;
      font-family: monospace;
      font-size: 10px;
      padding: 2px 4px;
    }
    #debug-panel input[type=range] { width: 100%; accent-color: #c5a040; }
    #debug-panel pre {
      background: #0a0602;
      padding: 4px;
      font-size: 10px;
      max-height: 140px;
      overflow-y: auto;
      color: #b8a880;
      margin: 4px 0 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    #debug-toggle-btn {
      position: fixed;
      bottom: 0; right: 320px;
      background: rgba(10,6,2,0.9);
      border: 1px solid #9a6830;
      border-bottom: none;
      color: #c5a040;
      font-family: monospace;
      font-size: 10px;
      padding: 3px 8px;
      cursor: pointer;
      z-index: 9999;
    }
    #debug-badge {
      position: fixed;
      top: 4px; left: 50%;
      transform: translateX(-50%);
      background: rgba(154,104,48,0.85);
      color: #e8dfc8;
      font-family: monospace;
      font-size: 10px;
      padding: 2px 10px;
      z-index: 9999;
      border-radius: 2px;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // Badge DEBUG MODE siempre visible
  const badge = document.createElement('div');
  badge.id = 'debug-badge';
  badge.textContent = '⚙ DEBUG MODE';
  document.body.appendChild(badge);

  // Panel principal
  const panel = document.createElement('div');
  panel.id = 'debug-panel';
  panel.innerHTML = `
    <h4>⚙ DEBUG PANEL</h4>

    <div class="dbg-row">
      <label style="color:#9a6830;font-size:10px;">Ir a evento:</label>
      <input type="number" id="dbg-ev-input" min="1" max="999" value="1" />
      <button onclick="dbgJumpToEvent()">SALTAR</button>
    </div>

    <div class="dbg-row">
      <button onclick="dbgResetSeenChars()">Reset personajes vistos</button>
      <button onclick="dbgResetSeenCharsAndRerender()">Reset + re-render</button>
    </div>

    <div class="dbg-row" style="flex-direction:column;gap:3px;">
      <label style="color:#9a6830;font-size:10px;">Prestigio: <span id="dbg-prest-val">—</span></label>
      <input type="range" id="dbg-prest" min="0" max="150" value="50" oninput="dbgSetPrest(this.value)">
    </div>

    <div class="dbg-row" style="flex-direction:column;gap:3px;">
      <label style="color:#9a6830;font-size:10px;">Riesgo: <span id="dbg-riesgo-val">—</span></label>
      <input type="range" id="dbg-riesgo" min="0" max="149" value="15" oninput="dbgSetRiesgo(this.value)">
    </div>

    <div class="dbg-row">
      <button onclick="dbgRefreshState()">Actualizar GS</button>
      <button onclick="dbgClearSave()">Borrar save</button>
      <button onclick="dbgEndGame()">Ir al final</button>
    </div>

    <pre id="dbg-gs-display">—</pre>
  `;
  document.body.appendChild(panel);

  // Botón toggle panel
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'debug-toggle-btn';
  toggleBtn.textContent = '⚙';
  toggleBtn.title = 'Toggle debug panel';
  toggleBtn.onclick = () => {
    panel.style.display = panel.style.display === 'none' ? '' : 'none';
  };
  document.body.appendChild(toggleBtn);

  // Actualizar panel cada 800ms
  setInterval(dbgRefreshState, 800);
}

// ============================================================
// FUNCIONES DEBUG (globales, seguras fuera de debug mode)
// ============================================================

function dbgRefreshState() {
  if (!DEBUG) return;
  const gs = (typeof GS !== 'undefined') ? GS : null;
  if (!gs) return;

  const pre = document.getElementById('dbg-gs-display');
  if (pre) {
    const compact = {
      ev: gs.currentEvent,
      prestigio: gs.prestigio,
      riesgo: gs.riesgo,
      ruta: gs.ruta || '—',
      logros: gs.logros?.length || 0,
      decisiones: gs.decisiones?.length || 0,
      seenChars: gs.seenCharacters || [],
      gameEnded: gs.gameEnded
    };
    pre.textContent = JSON.stringify(compact, null, 2);
  }

  const prestSlider = document.getElementById('dbg-prest');
  const riesgoSlider = document.getElementById('dbg-riesgo');
  if (prestSlider) { prestSlider.value = gs.prestigio; document.getElementById('dbg-prest-val').textContent = gs.prestigio; }
  if (riesgoSlider) { riesgoSlider.value = gs.riesgo; document.getElementById('dbg-riesgo-val').textContent = gs.riesgo; }

  const evInput = document.getElementById('dbg-ev-input');
  if (evInput && document.activeElement !== evInput) evInput.value = gs.currentEvent;
}

function dbgJumpToEvent() {
  if (!DEBUG) return;
  const n = parseInt(document.getElementById('dbg-ev-input').value, 10);
  if (!n || n < 1) return;
  if (typeof GS === 'undefined') return;
  GS.currentEvent = n;
  if (typeof renderEvent === 'function') renderEvent();
  dbgLog(`Salté a evento ${n}`);
}

function dbgResetSeenChars() {
  if (!DEBUG) return;
  if (typeof GS !== 'undefined') GS.seenCharacters = [];
  dbgLog('seenCharacters reseteado');
}

function dbgResetSeenCharsAndRerender() {
  dbgResetSeenChars();
  if (typeof renderEvent === 'function') renderEvent();
}

function dbgSetPrest(v) {
  if (!DEBUG) return;
  if (typeof GS !== 'undefined') {
    GS.prestigio = parseInt(v, 10);
    document.getElementById('dbg-prest-val').textContent = v;
    if (typeof updateUI === 'function') updateUI();
  }
}

function dbgSetRiesgo(v) {
  if (!DEBUG) return;
  if (typeof GS !== 'undefined') {
    GS.riesgo = parseInt(v, 10);
    document.getElementById('dbg-riesgo-val').textContent = v;
    if (typeof updateUI === 'function') updateUI();
  }
}

function dbgClearSave() {
  if (!DEBUG) return;
  localStorage.removeItem('rev_mayo_save');
  dbgLog('Save borrado');
}

function dbgEndGame() {
  if (!DEBUG) return;
  if (typeof endGame === 'function') endGame();
}

function dbgLog(msg) {
  if (!DEBUG) return;
  console.log(`[DEBUG] ${msg}`);
}
