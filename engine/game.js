// ============================================================
// LOGICA DE JUEGO — eventos, decisiones, final
// ============================================================

// Lookup por id en vez de por índice: soporta ids de rutas alternativas (>45).
function getEvent(id) {
  return EVENTS.find(ev => ev.id === id) || null;
}

// ============================================================
// SISTEMA DE PERSONAJES — diálogo secuencial con retrato
// ============================================================
let _charCallback = null;
let _charLines = [];
let _charLineIdx = 0;

function showCharacter(id, ctxKey, callback) {
  const ch = (typeof CHARACTERS !== 'undefined') && CHARACTERS[id];
  if (!ch || !ch.dialogos || !ch.dialogos[ctxKey]) {
    if (typeof DEBUG !== 'undefined' && DEBUG) {
      console.warn(`[DEBUG] showCharacter: no encontró id="${id}" ctx="${ctxKey}". Verifica CHARACTERS en data/characters.js`);
    }
    if (callback) callback();
    return;
  }

  _charCallback = callback;
  _charLines = ch.dialogos[ctxKey];
  _charLineIdx = 0;

  const img = document.getElementById('char-portrait-img');
  img.onerror = function() { this.style.display = 'none'; };
  img.onload = function() { this.style.display = ''; };
  img.style.display = '';
  img.src = ch.img;
  img.alt = ch.nombre;
  document.getElementById('char-portrait-name').textContent = ch.nombre;
  document.getElementById('char-portrait-cargo').textContent = ch.cargo;

  _renderCharLine();
  document.getElementById('overlay-character').classList.add('visible');
}

function _renderCharLine() {
  document.getElementById('char-dialogue-text').textContent = _charLines[_charLineIdx];
  document.getElementById('char-dialogue-counter').textContent = `${_charLineIdx + 1} / ${_charLines.length}`;
  const isLast = _charLineIdx === _charLines.length - 1;
  document.getElementById('char-dialogue-btn-text').textContent = isLast ? 'CONTINUAR' : 'SIGUIENTE →';
}

function charDialogueNext() {
  if (_charLineIdx < _charLines.length - 1) {
    _charLineIdx++;
    _renderCharLine();
  } else {
    document.getElementById('overlay-character').classList.remove('visible');
    const cb = _charCallback;
    _charCallback = null;
    _charLines = [];
    _charLineIdx = 0;
    if (cb) setTimeout(cb, 400);
  }
}

function renderEvent() {
  const ev = getEvent(GS.currentEvent);
  if (!ev) { endGame(); return; }

  // Mostrar personaje UNA sola vez por evento: personaje primero, evento después del diálogo.
  if (ev.showCharacter && !GS.seenCharacters.includes(ev.id)) {
    GS.seenCharacters.push(ev.id);
    showCharacter(ev.showCharacter.id, ev.showCharacter.ctx, () => _doRenderEvent(ev));
    return;
  }
  _doRenderEvent(ev);
}

function _doRenderEvent(ev) {
  document.getElementById('event-title').textContent = `${ev.id}. ${ev.title}`;
  document.getElementById('event-subtitle').textContent = ev.subtitle;

  const nc = document.getElementById('narrative-content');
  nc.innerHTML = '';
  const playerName = (GS && GS.playerName) ? GS.playerName : '';
  ev.narrative.forEach((p, i) => {
    const el = document.createElement('p');
    el.className = 'narrative-text' + (i === 0 ? ' first-paragraph' : '');
    el.style.animationDelay = (i * 0.1) + 's';
    el.innerHTML = applyTooltips(playerName ? p.replace(/\{PLAYER\}/g, playerName) : p);
    nc.appendChild(el);
  });

  const cc = document.getElementById('choices-container');
  cc.innerHTML = '';
  ev.choices.forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-indicator">${ch.label}</span>${applyTooltips(ch.text)}`;
    btn.onclick = () => makeChoice(ev, idx);
    // Enable clicks only after fade-in completes
    const delay = 500 + idx * 80;
    setTimeout(() => btn.classList.add('ready'), delay);
    cc.appendChild(btn);
  });

  document.getElementById('narrative-area').scrollTop = 0;
  updateUI();
  AudioEngine.playScene(ev.id);
}

function makeChoice(ev, idx) {
  const ch = ev.choices[idx];

  // Game Over choices
  if (ch.gameOver) {
    document.getElementById('gameover-text').textContent = ch.goText || "Has sido descubierto. Tu participación en la revolución ha terminado.";
    document.getElementById('overlay-gameover').classList.add('visible');
    recordLostRun();
    _gameStartTime = null;
    AudioEngine.playGameOver();
    return;
  }

  // Apply stats with difficulty multiplier
  const DIFF_MULT = { facil: 0.75, normal: 1.0, dificil: 1.3 };
  const mult = DIFF_MULT[GS.dificultad] || 1.0;
  const dprest = Math.round((ch.prest || 0) * mult);
  const driesgo = Math.round((ch.riesgo || 0) * mult);
  GS.prestigio = clamp(GS.prestigio + dprest, 0, PRESTIGIO_MAX);
  GS.riesgo = clamp(GS.riesgo + driesgo, 0, RIESGO_MAX);
  GS.riesgoActo += driesgo;
  if (GS.riesgo > RIESGO_DANGER) GS.maxRiesgoSuperado80 = true;

  // Show stat delta toast
  showStatDelta(dprest, driesgo);

  // Record decision
  GS.decisiones.push({
    evento: ev.id,
    titulo: ev.title,
    opcion: idx,
    texto: ch.text,
    prest: dprest,
    prestBase: ch.prest || 0,
    riesgoChange: driesgo
  });

  // Score
  GS.puntuacion += Math.max(0, dprest) * 2;

  // Final type
  if (ch.finalType) GS.finalType = ch.finalType;

  // Riesgo game over
  if (GS.riesgo >= RIESGO_MAX) {
    document.getElementById('gameover-text').textContent = "El Riesgo alcanzó su límite máximo. Las autoridades te han identificado y arrestado. La Policía del Virrey llegó antes de que pudieras escapar.";
    document.getElementById('overlay-gameover').classList.add('visible');
    recordLostRun();
    _gameStartTime = null;
    AudioEngine.playGameOver();
    return;
  }

  // Rotate frase
  if (ev.id % 2 === 0) GS.fraseIndex = (GS.fraseIndex + 1) % FRASES.length;

  // Check achievements
  checkLogros();

  // Special event?
  if (ch.special) {
    document.getElementById('special-title').textContent = ch.special.title;
    document.getElementById('special-text').innerHTML = applyTooltips(ch.special.text);
    pendingSpecialCallback = () => advanceEvent();
    document.getElementById('overlay-special').classList.add('visible');
  } else {
    advanceEvent();
  }
}

function closeSpecial() {
  document.getElementById('overlay-special').classList.remove('visible');
  if (pendingSpecialCallback) { pendingSpecialCallback(); pendingSpecialCallback = null; }
}

function showReflection(actNum, callback) {
  const data = ACT_REFLEXION[actNum];
  if (!data) { callback(); return; }
  pendingReflectionCallback = callback;

  document.getElementById('reflection-title').textContent = data.title;
  document.getElementById('reflection-intro').textContent = data.intro;
  document.getElementById('reflection-btn-text').textContent = data.btnText;

  const ul = document.getElementById('reflection-questions');
  ul.innerHTML = '';
  data.preguntas.forEach(q => {
    const li = document.createElement('li');
    li.className = 'reflection-q';
    li.textContent = q;
    ul.appendChild(li);
  });

  document.getElementById('overlay-reflection').classList.add('visible');
}

function closeReflection() {
  document.getElementById('overlay-reflection').classList.remove('visible');
  const cb = pendingReflectionCallback;
  pendingReflectionCallback = null;
  setTimeout(cb, 400);
}

function advanceEvent() {
  const prevEvent = GS.currentEvent;
  const curEv = getEvent(prevEvent);

  // Siguiente evento: propiedad explícita nextEvent (rutas alt.) o secuencial +1
  let nextId = (curEv && curEv.nextEvent) ? curEv.nextEvent : prevEvent + 1;

  // Ruta diplomática: redirige eventos 22-23 (Córdoba) a misión del noroeste
  if (GS.ruta === 'diplomático' && nextId === 22) {
    nextId = 221;
  }

  GS.currentEvent = nextId;
  saveGame();

  if (!getEvent(GS.currentEvent)) {
    // Epílogo completo → pantalla final
    endGame();
  } else if (prevEvent === 13 && GS.currentEvent === 14) {
    // Umbral Acto I → II: reflexión → perfil → transición
    GS.riesgoActo = 0;
    determineRuta();
    showReflection(1, () => {
      showActTransition(2, () => {
        showNotification(GS.ruta === 'combatiente'
          ? '⚔️ Tu perfil en el Acto I: Agente de Campo'
          : '🤝 Tu perfil en el Acto I: Enviado Diplomático');
        renderEvent();
      });
    });
  } else if (prevEvent === 31 && GS.currentEvent === 32) {
    GS.riesgoActo = 0;
    showReflection(2, () => {
      showActTransition(3, renderEvent);
    });
  } else if (prevEvent === 45 && GS.currentEvent === 46) {
    // Umbral Acto III → Epílogo: reflexión de Acto III
    GS.riesgoActo = 0;
    showReflection(3, renderEvent);
  } else {
    renderEvent();
  }
}

function checkLogros() {
  LOGROS_DEF.forEach(def => {
    if (!GS.logros.includes(def.id) && def.check(GS)) {
      GS.logros.push(def.id);
      showLogroNotif(def);
    }
  });
}

// ============================================================
// FINAL SCREEN — ACTA COLONIAL
// ============================================================
function endGame() {
  GS.gameEnded = true;
  checkLogros();

  const baseScore = GS.puntuacion;
  const prestigioBonus = GS.prestigio * 2; // escala sobre 150 → máx 300
  const riesgoBonus = GS.riesgo < 50 ? (50 - GS.riesgo) * 2 : 0;
  const logrosBonus = GS.logros.length * 20;
  const manualBonus = GS.leyoManual ? 30 : 0;
  const finalScore = clamp(Math.round(baseScore + prestigioBonus + riesgoBonus + logrosBonus + manualBonus), 0, 1000);
  GS.finalScore = finalScore;

  const medalIcon = finalScore >= 800 ? "🥇" : finalScore >= 600 ? "🥈" : "🥉";
  const medalText = finalScore >= 800 ? "ORO" : finalScore >= 600 ? "PLATA" : "BRONCE";
  const medalLabel = finalScore >= 800 ? "🥇 ORO" : finalScore >= 600 ? "🥈 PLATA" : "🥉 BRONCE";
  const now = new Date();
  const fechaStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;

  // Populate acta fields
  document.getElementById('acta-nombre-display').textContent = GS.playerName;
  document.getElementById('acta-medal-icon').textContent = medalIcon;
  document.getElementById('acta-medal-text').textContent = medalText;
  document.getElementById('acta-score-num').textContent = finalScore;
  document.getElementById('acta-stats-line').textContent =
    `Prestigio: ${GS.prestigio}/150 · Riesgo acumulado: ${GS.riesgo} · ${medalLabel} · Logros: ${GS.logros.length}/${LOGROS_DEF.length}`;
  document.getElementById('acta-fecha-display').textContent = fechaStr;

  // Epilogo
  buildEpilogo(finalScore);

  // Decisiones como artículos de acta (221 = ruta diplomática, reemplaza 22)
  const keyEvents = [1, 5, 13, 14, 18, 22, 221, 25, 30, 46, 50];
  const actDec = document.getElementById('acta-decisiones-container');
  actDec.innerHTML = '';
  keyEvents.forEach((evId, i) => {
    const dec = GS.decisiones.find(d => d.evento === evId);
    if (dec) {
      const div = document.createElement('div');
      div.className = 'acta-articulo';
      div.innerHTML = `<span class="acta-art-num">Ev. ${evId}</span>
        <div class="acta-art-texto"><em>${dec.titulo}:</em> "${dec.texto.substring(0, 120)}${dec.texto.length > 120 ? '...' : ''}"</div>`;
      actDec.appendChild(div);
    }
  });

  // Logros
  const actLog = document.getElementById('acta-logros-container');
  actLog.innerHTML = '';
  LOGROS_DEF.forEach(def => {
    const earned = GS.logros.includes(def.id);
    const span = document.createElement('span');
    span.className = 'acta-logro' + (earned ? ' earned' : ' locked');
    span.textContent = earned ? def.nombre : '🔒 ' + def.nombre.split(' ').slice(1).join(' ');
    span.title = def.desc || '';
    actLog.appendChild(span);
  });

  // Historia comparison
  buildHistoria();

  showScreen('screen-final');
  document.getElementById('screen-final').scrollTop = 0;
  const tiempoSeg = _gameStartTime ? Math.round((Date.now() - _gameStartTime) / 1000) : 0;
  recordCompletedRun(finalScore, GS.prestigio, GS.riesgo, GS.logros, GS.finalType, tiempoSeg);
  _gameStartTime = null;
  AudioEngine.playVictory();
  saveGame();
}

function buildEpilogo(score) {
  const ft = GS.finalType;
  let p1 = "Tu participación en la Revolución de Mayo de 1810 fue parte del tejido invisible que sostuvo el movimiento visible. Como tantos otros que la historia no nombrará, tu trabajo en las sombras hizo posible que la luz llegara a la plaza.";

  let p2 = "";
  if (ft === "militar") {
    p2 = "Elegiste continuar en las filas de la independencia. En los años siguientes, el proceso revolucionario que ayudaste a iniciar se extendería por todo el continente. Las guerras de independencia durarían hasta 1824. Muchos de quienes combatiste junto no sobrevivirían para ver el resultado final, pero su sacrificio se volvió la roca sobre la que se construyó la nación.";
  } else if (ft === "maestro") {
    p2 = "Elegiste la vida civil y la transmisión de lo vivido. Como maestro y testigo, contribuiste a la formación de la memoria colectiva de lo que fue la revolución: no solo sus héroes nombrados, sino sus mensajeros anónimos, sus miedos cotidianos, su humanidad compleja. Esa memoria es tan importante como cualquier batalla.";
  } else {
    p2 = "Llevaste los ideales de mayo hacia el interior, donde la revolución necesitaba raíces para sobrevivir. Las provincias del ex-virreinato tendrían sus propias historias de adhesión y resistencia. Tu presencia entre ellas, con la experiencia de haber visto la revolución desde adentro, fue un puente entre Buenos Aires y un territorio que tardó décadas en convertirse en nación.";
  }

  let p3 = "";
  if (score >= 800) {
    p3 = "Tu legado fue recordado: no en los libros que los escolares estudiarán, sino en el tipo de memoria más verdadera que existe — la de quienes vivieron junto a ti y supieron, sin necesitar el monumento, lo que valiste.";
  } else if (score >= 600) {
    p3 = "Como toda persona real dentro de la historia, tu legado fue mixto: parte éxito, parte error, parte oportunidad perdida. Eso es lo que hace a los participantes de la historia más verdaderos que los héroes de los libros de texto.";
  } else {
    p3 = "La revolución es, en el fondo, el intento colectivo de ser mejores de lo que el sistema que heredamos nos permitía ser. No siempre se logra. Pero el intento mismo tiene un valor que no depende del resultado.";
  }

  // Populate acta epilogo
  const container = document.getElementById('acta-epilogo-container');
  container.innerHTML =
    `<p class="acta-parrafo">${p1}</p><p class="acta-parrafo">${p2}</p><p class="acta-parrafo">${p3}</p>`;
}

function buildHistoria() {
  const hechos = [
    { real: "La Revolución de Mayo ocurrió del 18 al 25 de mayo de 1810 en Buenos Aires.", jugador: null },
    { real: "El Cabildo Abierto del 22 de mayo debatió quién debía gobernar con el Rey cautivo.", jugador: GS.decisiones.find(d => d.evento === 8) ? `Tu participación en el Cabildo: "${GS.decisiones.find(d=>d.evento===8).texto.substring(0,60)}..."` : null },
    { real: "Se formó la Primera Junta con Saavedra como presidente y Moreno como secretario.", jugador: null },
    { real: "Mariano Moreno fundó la Gaceta de Buenos Aires, primer periódico revolucionario.", jugador: GS.decisiones.find(d => d.evento === 40) ? `Tu contribución a la Gaceta: "${GS.decisiones.find(d=>d.evento===40).texto.substring(0,60)}..."` : "No contribuiste a la Gaceta." },
    { real: "La Junta envió expediciones militares y misiones diplomáticas para extender la revolución al interior.",
      jugador: GS.decisiones.find(d => d.evento === 22)
        ? `Tu decisión sobre Córdoba: "${GS.decisiones.find(d=>d.evento===22).texto.substring(0,60)}..."`
        : GS.decisiones.find(d => d.evento === 221)
        ? `Tu misión diplomática al noroeste: "${GS.decisiones.find(d=>d.evento===221).texto.substring(0,60)}..."`
        : null },
    { real: "Liniers fue ejecutado en Córdoba el 26 de agosto de 1810 al negarse a rendirse.", jugador: GS.decisiones.find(d => d.evento === 18) ? `Tu rol en la negociación con Liniers: "${GS.decisiones.find(d=>d.evento===18).texto.substring(0,60)}..."` : "No participaste en las negociaciones con Liniers." }
  ];

  // Acta historia
  const hc = document.getElementById('acta-historia-container');
  hc.innerHTML = '';
  hechos.forEach(h => {
    const div = document.createElement('div');
    div.className = 'acta-hist-item';
    let html = `<div class="acta-hist-real">${h.real}</div>`;
    if (h.jugador) {
      html += `<div class="acta-hist-jugador">${h.jugador}</div>`;
    }
    div.innerHTML = html;
    hc.appendChild(div);
  });
}

function closeGameOver() {
  const overlay = document.getElementById('overlay-gameover');
  overlay.classList.remove('visible');
}

function restartGame() {
  closeGameOver();
  // Small delay ensures overlay is hidden before screen switches
  setTimeout(() => startNewGame(), 50);
}

function goMenuFromGameOver() {
  closeGameOver();
  setTimeout(() => showMenu(), 50);
}
