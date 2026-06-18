// ============================================================
// ESTADO GLOBAL, constantes, guardado/carga, inicio
// ============================================================
// ============================================================
// GAME STATE
// ============================================================
const RIESGO_MAX = 150; // Límite real de game over
const RIESGO_DANGER = 100; // Zona de peligro visual
const PRESTIGIO_MAX = 150; // Nuevo máximo de prestigio

// Guardado versionado: permite migrar saves viejos si cambia la estructura de GS.
const SAVE_KEY = 'rev_mayo_save';
const SAVE_VERSION = 11;

let GS = {
  currentEvent: 1,
  prestigio: 50,
  riesgo: 15,
  logros: [],
  decisiones: [],
  puntuacion: 0,
  playerName: "",
  gameStarted: false,
  gameEnded: false,
  finalType: "",
  fraseIndex: 0
};

let _gameStartTime = null; // tracks session start for time accounting
let pendingSpecialCallback = null;
let pendingReflectionCallback = null;

// ============================================================
// CORE GAME FUNCTIONS
// ============================================================
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

// Lee el save y devuelve el estado GS, soportando el formato versionado
// { version, state } y el formato legacy (GS plano sin versión). null si inválido.
function migrateSave(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (e) { return null; }
  const state = (data && data.version !== undefined && data.state) ? data.state : data;
  if (!state || typeof state !== 'object' || typeof state.currentEvent !== 'number') return null;
  // Compatibilidad con saves anteriores a la feature de rutas alternativas
  if (!state.ruta) state.ruta = '';
  if (state.riesgoActo === undefined) state.riesgoActo = 0;
  if (!Array.isArray(state.seenCharacters)) state.seenCharacters = [];
  if (typeof state.fraseIndex !== 'number' || isNaN(state.fraseIndex)) state.fraseIndex = 0;
  if (typeof state.leyoManual !== 'boolean') state.leyoManual = false;
  if (typeof state.maxRiesgoSuperado80 !== 'boolean') state.maxRiesgoSuperado80 = false;
  if (!state.dificultad) state.dificultad = 'normal';
  return state;
}

// Determina el perfil del jugador basado en 5 decisiones clave del Acto I.
// Se llama al cruzar el umbral 13→14. Asigna GS.ruta: 'combatiente' o 'diplomático'.
function determineRuta() {
  const audaces = [
    GS.decisiones.find(d => d.evento === 5  && d.opcion === 0), // aceptar sin hesitar
    GS.decisiones.find(d => d.evento === 7  && d.opcion === 0), // reclutar 20 personas
    GS.decisiones.find(d => d.evento === 8  && d.opcion === 0), // ir al Fuerte
    GS.decisiones.find(d => d.evento === 12 && d.opcion === 0), // distribuir cintas activamente
    GS.decisiones.find(d => d.evento === 9  && d.opcion < 2),  // priorizar militares o todos los grupos
  ].filter(Boolean).length;
  GS.ruta = audaces >= 3 ? 'combatiente' : 'diplomático';
}

function checkLoadButton() {
  const saved = localStorage.getItem(SAVE_KEY);
  const btn = document.getElementById('btn-load');
  if (!saved) {
    btn.classList.add('btn-disabled');
    btn.title = "No hay partida guardada aún";
  } else {
    btn.classList.remove('btn-disabled');
    btn.title = "Continuar partida guardada";
  }
}

function selectDiff(card) {
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('diff-selected'));
  card.classList.add('diff-selected');
}

function startNewGame() {
  const modal = document.getElementById('name-modal');
  const input = document.getElementById('name-modal-input');
  const btn   = document.getElementById('name-modal-btn');
  input.value = '';
  // Reset dificultad a normal
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('diff-selected'));
  const normalCard = document.querySelector('.diff-card[data-diff="normal"]');
  if (normalCard) normalCard.classList.add('diff-selected');
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 80);

  const errorEl = document.getElementById('name-modal-error');

  function showError() {
    input.style.borderColor = '#e05050';
    errorEl.style.opacity = '1';
    input.focus();
  }
  function clearError() {
    input.style.borderColor = '#b8860b';
    errorEl.style.opacity = '0';
  }

  function confirm() {
    const name = input.value.trim();
    if (name.length < 3) { showError(); return; }
    clearError();
    const selected = document.querySelector('.diff-card.diff-selected');
    const dificultad = selected ? selected.dataset.diff : 'normal';
    modal.style.display = 'none';
    _initGame(name, dificultad);
  }
  input.oninput = () => { if (input.value.trim().length >= 3) clearError(); };
  btn.onclick = confirm;
  input.onkeydown = e => { if (e.key === 'Enter') confirm(); };
}

function _initGame(name, dificultad) {
  dificultad = dificultad || 'normal';
  const DIFF_RIESGO = { facil: 15, normal: 30, dificil: 40 };
  GS = {
    currentEvent: 1,
    prestigio: 50,
    riesgo: DIFF_RIESGO[dificultad] || 30,
    logros: [],
    decisiones: [],
    puntuacion: 0,
    playerName: name,
    dificultad: dificultad,
    gameStarted: true,
    gameEnded: false,
    finalType: "",
    ruta: "",
    riesgoActo: 0,
    seenCharacters: [],
    fraseIndex: Math.floor(Math.random() * FRASES.length),
    leyoManual: false,
    maxRiesgoSuperado80: false,
    _menuPause: false
  };
  enterFullscreenIfNeeded();
  showScreen('screen-game');
  _gameStartTime = Date.now();
  showActTransition(1, renderEvent);
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) { showNotification("No hay partida guardada."); return; }
  const state = migrateSave(saved);
  if (!state) { showNotification("La partida guardada no es válida."); return; }
  GS = state;
  GS.gameStarted = true;
  GS._menuPause = false;
  // Save anterior a rutas alternativas: recalcular ruta si ya pasó el Acto I
  if (!GS.ruta && GS.currentEvent > 13) determineRuta();
  _gameStartTime = Date.now();
  enterFullscreenIfNeeded();
  showScreen('screen-game');
  renderEvent();
  showNotification("Partida cargada — Evento " + GS.currentEvent);
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), state: GS }));
    if (typeof showSaveToast === 'function') showSaveToast(true);
  } catch (e) {
    // localStorage bloqueado: modo privado iOS/Safari, cuota llena, etc.
    console.warn('[RevMayo] No se pudo guardar:', e.message);
    if (typeof showSaveToast === 'function') showSaveToast(false);
  }
}
