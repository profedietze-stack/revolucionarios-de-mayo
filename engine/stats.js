// ============================================================
// ESTADISTICAS y logros
// ============================================================

// ============================================================
// STATS & LOGROS SCREEN
// ============================================================
const STATS_KEY = 'rev_mayo_stats';

function loadGlobalStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || defaultStats(); }
  catch(e) { return defaultStats(); }
}
function defaultStats() {
  return { partidas: 0, perdidas: 0, tiempoTotal: 0, historial: [], logrosTotal: [] };
}
function saveGlobalStats(gs) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(gs)); } catch(e) {}
}

// Called at game end — record completed run
function recordCompletedRun(finalScore, prestigio, riesgo, logros, finalType, tiempoSeg) {
  const gs = loadGlobalStats();
  gs.partidas++;
  gs.tiempoTotal += (tiempoSeg || 0);
  const medal = finalScore >= 800 ? '🥇' : finalScore >= 600 ? '🥈' : '🥉';
  gs.historial.unshift({
    fecha: new Date().toLocaleDateString('es-AR'),
    nombre: GS.playerName,
    score: finalScore,
    medal,
    prestigio,
    riesgo,
    logros: logros.length,
    finalType,
    tiempo: tiempoSeg || 0
  });
  if (gs.historial.length > 20) gs.historial = gs.historial.slice(0, 20);
  // Merge logros
  logros.forEach(id => { if (!gs.logrosTotal.includes(id)) gs.logrosTotal.push(id); });
  saveGlobalStats(gs);
}

// Called on game over (caught) — record loss
function recordLostRun() {
  const gs = loadGlobalStats();
  gs.perdidas++;
  saveGlobalStats(gs);
}

function showStats() {
  renderStats();
  showScreen('screen-stats');
  document.getElementById('screen-stats').scrollTop = 0;
}

function renderStats() {
  const gs = loadGlobalStats();

  // --- Summary cards ---
  const bestScore = gs.historial.length ? Math.max(...gs.historial.map(h => h.score)) : null;
  const medals = { '🥇': 0, '🥈': 0, '🥉': 0 };
  gs.historial.forEach(h => { if (medals[h.medal] !== undefined) medals[h.medal]++; });
  const medalStr = gs.historial.length
    ? `${medals['🥇']}🥇 ${medals['🥈']}🥈 ${medals['🥉']}🥉`
    : '—';
  const tiempoFmt = formatTiempo(gs.tiempoTotal);

  document.getElementById('sc-partidas').textContent = gs.partidas;
  document.getElementById('sc-perdidas').textContent = gs.perdidas;
  document.getElementById('sc-mejor').textContent = bestScore !== null ? bestScore : '—';
  document.getElementById('sc-medallas').textContent = medalStr;
  document.getElementById('sc-logros').textContent = gs.logrosTotal.length + '/' + LOGROS_DEF.length;
  document.getElementById('sc-tiempo').textContent = tiempoFmt;

  // --- Logros grid ---
  const grid = document.getElementById('stats-logros-grid');
  grid.innerHTML = '';
  const earned = gs.logrosTotal;
  document.getElementById('stats-logros-count').textContent =
    `${earned.length} / ${LOGROS_DEF.length} desbloqueados`;
  LOGROS_DEF.forEach(def => {
    const isEarned = earned.includes(def.id);
    const iconMatch = def.nombre.match(/^(\p{Emoji})/u);
    const icon = iconMatch ? iconMatch[1] : '🎖️';
    const nameNoIcon = def.nombre.replace(/^(\p{Emoji}\s*)/u, '');
    const div = document.createElement('div');
    div.className = 'logro-full-item' + (isEarned ? ' earned' : '');
    div.innerHTML = `
      <div class="logro-full-icon">${icon}</div>
      <div class="logro-full-info">
        <div class="logro-full-name">${nameNoIcon}</div>
        <div class="logro-full-desc">${def.desc || ''}</div>
      </div>`;
    grid.appendChild(div);
  });

  // --- Historial ---
  const histDiv = document.getElementById('stats-historial');
  if (gs.historial.length === 0) {
    histDiv.innerHTML = '<div class="hist-empty">Aún no hay partidas completadas registradas.</div>';
  } else {
    const bestIdx = gs.historial.indexOf(gs.historial.reduce((a,b) => a.score>b.score?a:b));
    let rows = gs.historial.map((h, i) => `
      <tr class="${i === bestIdx ? 'best-run' : ''}">
        <td><span class="hist-medal">${h.medal}</span></td>
        <td>${h.nombre || '—'}</td>
        <td style="font-family:'Cinzel',serif;font-size:1rem;color:var(--sepia-pale)">${h.score}</td>
        <td>${(h.prestigio ?? '—')}/150 · ${h.riesgo ?? '—'}</td>
        <td>${h.logros} logro${h.logros !== 1 ? 's' : ''}</td>
        <td>${formatTiempo(h.tiempo)}</td>
        <td style="font-style:italic;font-size:0.82rem">${h.fecha}</td>
      </tr>`).join('');
    histDiv.innerHTML = `
      <table class="historial-table">
        <thead><tr>
          <th>Medal</th><th>Nombre</th><th>Score</th>
          <th>Stats</th><th>Logros</th><th>Tiempo</th><th>Fecha</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  // --- Evaluación docente ---
  const evalGrid = document.getElementById('stats-eval-grid');
  if (gs.historial.length === 0) {
    evalGrid.innerHTML = '<div class="stats-no-data" style="grid-column:1/-1">Sin datos de partidas aún.</div>';
  } else {
    const last = gs.historial[0];
    const promScore = Math.round(gs.historial.reduce((a,b)=>a+b.score,0) / gs.historial.length);
    const promedioLogros = (gs.historial.reduce((a,b)=>a+b.logros,0) / gs.historial.length).toFixed(1);
    const tasaExito = gs.partidas > 0
      ? Math.round((gs.partidas / (gs.partidas + gs.perdidas)) * 100) + '%'
      : '—';
    const nivelLabel = bestScore >= 800 ? 'Avanzado 🥇' : bestScore >= 600 ? 'Intermedio 🥈' : bestScore >= 300 ? 'En desarrollo 🥉' : 'Inicial';
    const dominioLogros = earned.length >= 8 ? 'Alto' : earned.length >= 4 ? 'Medio' : 'Bajo';

    const items = [
      { label: 'ÚLTIMA PARTIDA', val: `${last.score} pts · ${last.medal} · ${last.fecha}`, hi: true },
      { label: 'MEJOR PUNTAJE', val: `${bestScore} pts`, hi: true },
      { label: 'PROMEDIO DE PUNTAJE', val: `${promScore} pts en ${gs.partidas} partida${gs.partidas!==1?'s':''}`, hi: false },
      { label: 'TASA DE ÉXITO', val: `${tasaExito} (${gs.partidas}/${gs.partidas+gs.perdidas} partidas terminadas)`, hi: false },
      { label: 'NIVEL ESTIMADO', val: nivelLabel, hi: true },
      { label: 'DOMINIO DE LOGROS', val: `${dominioLogros} — ${earned.length}/${LOGROS_DEF.length} desbloqueados`, hi: false },
      { label: 'PROMEDIO DE LOGROS/PARTIDA', val: `${promedioLogros} logros`, hi: false },
      { label: 'TIEMPO TOTAL JUGADO', val: tiempoFmt, hi: false },
    ];
    evalGrid.innerHTML = items.map(it => `
      <div class="eval-item${it.hi ? ' highlight' : ''}">
        <div class="eval-label">${it.label}</div>
        <div class="eval-value">${it.val}</div>
      </div>`).join('');
  }
}

function formatTiempo(seg) {
  if (!seg || seg === 0) return '0\'';
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}'`;
}

function resetStats() {
  const existing = document.getElementById('overlay-reset-confirm');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'overlay-reset-confirm';
  el.className = 'overlay';
  el.innerHTML = `
    <div class="overlay-box" style="max-width:420px;">
      <div class="overlay-icon" style="font-size:2rem;">🗑</div>
      <div class="overlay-title" style="font-size:1.1rem;color:var(--crimson);">¿BORRAR HISTORIAL?</div>
      <div class="overlay-text">Esto borra todas las partidas y estadísticas. No se puede deshacer.</div>
      <button class="btn" onclick="_confirmResetStats()" style="margin-bottom:10px;border-color:var(--crimson);color:var(--crimson);"><span>🗑 BORRAR TODO</span></button>
      <button class="btn btn-primary" onclick="_cancelResetStats()"><span>✕ CANCELAR</span></button>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
}

function _confirmResetStats() {
  const el = document.getElementById('overlay-reset-confirm');
  if (el) { el.classList.remove('visible'); setTimeout(() => el.remove(), 400); }
  try { localStorage.removeItem(STATS_KEY); } catch(e) {}
  renderStats();
  showNotification('Historial borrado');
}

function _cancelResetStats() {
  const el = document.getElementById('overlay-reset-confirm');
  if (el) { el.classList.remove('visible'); setTimeout(() => el.remove(), 400); }
}
