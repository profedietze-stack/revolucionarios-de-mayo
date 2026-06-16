// ============================================================
// PANTALLA FINAL — captura docente
// ============================================================

// Intenta cargar un <script> probando las URLs en orden hasta que una resuelva.
function loadScriptWithFallback(urls) {
  return urls.reduce(
    (chain, url) => chain.catch(() => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = resolve;
      s.onerror = () => { s.remove(); reject(new Error('No se pudo cargar ' + url)); };
      document.head.appendChild(s);
    })),
    Promise.reject()
  );
}

// ============================================================
// CAPTURA PARA DOCENTE
// ============================================================
function abrirCaptura() {
  const finalScore = GS.finalScore || 0;
  const medalIcon = finalScore >= 800 ? "🥇" : finalScore >= 600 ? "🥈" : "🥉";
  const medalLabel = finalScore >= 800 ? "ORO" : finalScore >= 600 ? "PLATA" : "BRONCE";
  const now = new Date();
  const fechaStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  document.getElementById('cap-nombre').textContent = GS.playerName;
  document.getElementById('cap-medal').textContent = medalIcon;
  document.getElementById('cap-medal-label').textContent = medalLabel;
  document.getElementById('cap-score').textContent = finalScore;
  document.getElementById('cap-prestigio').textContent = GS.prestigio + '/150';
  document.getElementById('cap-riesgo').textContent = GS.riesgo + '/150';
  document.getElementById('cap-pie-fecha').textContent =
    `REVOLUCIONARIOS DE MAYO · PROFD. · ${fechaStr}`;

  // Logros ganados
  const logrosGanados = LOGROS_DEF.filter(d => GS.logros.includes(d.id));
  const capLog = document.getElementById('cap-logros');
  if (logrosGanados.length > 0) {
    capLog.innerHTML = logrosGanados.map(d =>
      `<span class="cap-logro-badge">${d.nombre}</span>`
    ).join('');
  } else {
    capLog.textContent = 'Ninguno desbloqueado';
  }

  // Decisiones clave (abreviadas)
  const keyEvents = [5, 13, 18, 25, 30];
  const capDec = document.getElementById('cap-decisions');
  const decs = keyEvents
    .map(evId => GS.decisiones.find(d => d.evento === evId))
    .filter(Boolean);
  if (decs.length > 0) {
    capDec.innerHTML = decs.map(d =>
      `<div class="cap-dec-item"><span class="cap-dec-ev">Ev.${d.evento}</span>${d.titulo}: "${d.texto.substring(0, 55)}${d.texto.length > 55 ? '...' : ''}"</div>`
    ).join('');
  } else {
    capDec.textContent = '—';
  }

  document.getElementById('captura-hint').style.display = 'none';
  document.getElementById('overlay-captura').classList.add('visible');
}

function cerrarCaptura() {
  document.getElementById('overlay-captura').classList.remove('visible');
}

async function descargarCaptura() {
  const card = document.getElementById('captura-card');
  const hint = document.getElementById('captura-hint');
  hint.style.display = 'none';

  // html2canvas: carga la copia local primero (funciona offline); si falla,
  // cae al CDN. Sin internet ni local → fallback a captura manual.
  try {
    if (typeof html2canvas === 'undefined') {
      await loadScriptWithFallback([
        './vendor/html2canvas.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
      ]);
    }
    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: '#f5edd8',
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    const nombre = (GS.playerName || 'partida').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `revolucionarios_mayo_${nombre}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showNotification("✔ Imagen descargada");
  } catch (e) {
    // Fallback: show manual instructions
    hint.style.display = 'block';
    showNotification("⚠ Tomá una captura de pantalla manual");
  }
}
