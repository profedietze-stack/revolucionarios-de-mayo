// ============================================================
// MOTOR DE AUDIO — Web Audio API
// ============================================================

// ============================================================
// AUDIO ENGINE — COLONIAL BUENOS AIRES 1810
// ============================================================
const AudioEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let muted = false;
  let initialized = false;
  let activeNodes = {};   // layerId → { nodes, gain }
  let scheduledTimers = [];

  // ── Init ──────────────────────────────────────────────────
  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 1.0;
      masterGain.connect(ctx.destination);
      initialized = true;
    } catch(e) { console.warn('AudioEngine: WebAudio not available'); }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── Master helpers ─────────────────────────────────────────
  function toggleMute() {
    if (!initialized) return;
    muted = !muted;
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.72, ctx.currentTime, 0.3);
    const btn = document.getElementById('audio-toggle-btn');
    if (btn) btn.textContent = muted ? '🔇' : '🔊';
  }

  function stopAll(fadeTime = 1.5) {
    scheduledTimers.forEach(t => clearTimeout(t));
    scheduledTimers = [];
    Object.keys(activeNodes).forEach(id => fadeOutLayer(id, fadeTime));
  }

  // ── Low-level node builders ────────────────────────────────
  function makeGain(val = 1) {
    const g = ctx.createGain();
    g.gain.value = val;
    g.connect(masterGain);
    return g;
  }

  function makeOsc(freq, type = 'sine', gainVal = 0.1) {
    const o = ctx.createOscillator();
    const g = makeGain(0);
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    o.start();
    g.gain.setTargetAtTime(gainVal, ctx.currentTime, 0.5);
    return { osc: o, gain: g };
  }

  function makeLFO(target, min, max, rate) {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = rate;
    lfoGain.gain.value = (max - min) / 2;
    lfo.connect(lfoGain);
    lfoGain.connect(target);
    target.value = (min + max) / 2;
    lfo.start();
    return lfo;
  }

  // ── Noise generators ──────────────────────────────────────
  function makeWhiteNoise(duration = 4) {
    const bufLen = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ── Layer fade in/out ──────────────────────────────────────
  function fadeInLayer(id, targetGain, time = 2) {
    if (!activeNodes[id]) return;
    activeNodes[id].gain.gain.setTargetAtTime(targetGain, ctx.currentTime, time / 3);
  }

  function fadeOutLayer(id, time = 1.5, remove = true) {
    if (!activeNodes[id]) return;
    const node = activeNodes[id];
    node.gain.gain.setTargetAtTime(0, ctx.currentTime, time / 4);
    if (remove) {
      const t = setTimeout(() => {
        try {
          node.sources.forEach(s => { try { s.stop(); } catch(e){} });
          node.oscs.forEach(o => { try { o.stop(); } catch(e){} });
          node.gain.disconnect();
        } catch(e){}
        delete activeNodes[id];
      }, time * 1000 + 300);
      scheduledTimers.push(t);
    }
  }

  function registerLayer(id, gainNode, sources = [], oscs = []) {
    if (activeNodes[id]) fadeOutLayer(id, 1, true);
    activeNodes[id] = { gain: gainNode, sources, oscs };
  }

  // ══════════════════════════════════════════════════════════
  // MELODÍA DE ESCENA — osciladores sine suaves, sin ruido
  // mood: 'calm' | 'tense' | 'epic' | 'solemn' | 'hopeful'
  // Viento y fuego van de fondo; la melodía va adelante
  // ══════════════════════════════════════════════════════════
  const MELODIES = {
    // Sol menor — serenidad colonial, noches tranquilas
    calm:    [ [392,1.2],[440,0.6],[392,0.6],[349,1.2],[330,1.8],[294,1.2],[330,0.6],[349,0.6],[392,2.4] ],
    // Re menor — misterio, reuniones clandestinas
    tense:   [ [293,0.5],[311,0.5],[330,1.0],[293,0.5],[277,1.5],[261,0.5],[277,0.5],[293,2.0] ],
    // Eb mayor — épico, pueblo en plaza, victoria
    epic:    [ [311,0.4],[392,0.4],[466,0.8],[523,0.8],[466,0.4],[415,0.4],[392,1.2],[311,0.4],[349,0.4],[415,2.0] ],
    // Sol menor grave — solemne, decisiones de peso
    solemn:  [ [196,1.6],[220,0.8],[196,0.8],[175,2.0],[196,0.8],[220,0.8],[233,1.6],[196,3.0] ],
    // Eb mayor ascendente — esperanza, educación, futuro
    hopeful: [ [311,0.6],[349,0.6],[392,0.6],[415,0.6],[466,1.2],[415,0.6],[392,0.6],[349,1.8],[311,2.4] ],
  };

  function buildMelody(mood = 'calm', vol = 0.09) {
    const seq = MELODIES[mood] || MELODIES.calm;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(masterGain);
    registerLayer('melody', g, [], []);

    // Fade in
    g.gain.setTargetAtTime(vol, ctx.currentTime, 1.5);

    let loopActive = true;
    function playLoop() {
      if (!activeNodes['melody'] || !loopActive) return;
      let t = ctx.currentTime + 0.05;
      seq.forEach(([freq, dur]) => {
        // Nota principal
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(vol, t + 0.04);
        env.gain.setTargetAtTime(vol * 0.6, t + 0.08, 0.1);
        env.gain.setTargetAtTime(0.0001, t + dur * 0.75, dur * 0.15);
        osc.connect(env); env.connect(g);
        osc.start(t); osc.stop(t + dur + 0.1);

        // Quinta armónica suave (+7 semitones) para cuerpo
        const osc5 = ctx.createOscillator();
        const env5 = ctx.createGain();
        osc5.type = 'sine';
        osc5.frequency.value = freq * 1.498; // quinta justa
        env5.gain.setValueAtTime(0, t);
        env5.gain.linearRampToValueAtTime(vol * 0.22, t + 0.06);
        env5.gain.setTargetAtTime(0.0001, t + dur * 0.6, dur * 0.2);
        osc5.connect(env5); env5.connect(g);
        osc5.start(t); osc5.stop(t + dur + 0.1);

        t += dur;
      });
      // Pausa entre repeticiones (1.5s) y volver a tocar
      const totalDur = seq.reduce((s,[,d]) => s+d, 0);
      const timer = setTimeout(() => {
        if (activeNodes['melody'] && loopActive) playLoop();
      }, (totalDur + 1.5) * 1000);
      scheduledTimers.push(timer);
    }
    playLoop();
    // guardar flag de kill en el layer
    activeNodes['melody']._stop = () => { loopActive = false; };
  }

  // 5. CAMPANAS — síntesis FM de campana real, sin armónicos agresivos
  // Técnica: modulación de frecuencia con ratio inarmónico suave + envelope de campana
  function strikeBell(freq, vol, when) {
    // Campana = portadora + modulador FM con ratio 2.0 (suave, no 2.756)
    // Vol máximo 0.12 para no saturar — comprimir con masterGain
    const dur = 3.5 + Math.log(freq / 200) * 1.2; // campanas graves duran más
    const safeVol = Math.min(vol, 0.12);

    // Modulador FM
    const modFreq = freq * 2.0;
    const modOsc = ctx.createOscillator();
    const modGain = ctx.createGain();
    modOsc.type = 'sine';
    modOsc.frequency.value = modFreq;
    modGain.gain.setValueAtTime(freq * 1.8, when);         // índice FM inicial
    modGain.gain.exponentialRampToValueAtTime(freq * 0.1, when + dur * 0.7); // decae rápido
    modOsc.connect(modGain);

    // Portadora
    const carOsc = ctx.createOscillator();
    carOsc.type = 'sine';
    carOsc.frequency.value = freq;
    modGain.connect(carOsc.frequency); // FM: modula la portadora

    // Envolvente de amplitud — ataque instantáneo, decay exponencial largo
    const ampGain = ctx.createGain();
    ampGain.gain.setValueAtTime(0, when);
    ampGain.gain.linearRampToValueAtTime(safeVol, when + 0.005);
    ampGain.gain.exponentialRampToValueAtTime(safeVol * 0.4, when + 0.3);
    ampGain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    // Sub-tono: 1/2 de la frecuencia, muy suave, da profundidad
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.value = freq * 0.5;
    subGain.gain.setValueAtTime(safeVol * 0.15, when);
    subGain.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.5);
    subOsc.connect(subGain);

    // Compresor suave para evitar clips — threshold alto, ratio bajo
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 3;
    comp.attack.value = 0.003;
    comp.release.value = 0.5;

    carOsc.connect(ampGain);
    subGain.connect(ampGain);
    ampGain.connect(comp);
    comp.connect(masterGain);

    const endTime = when + dur + 0.1;
    modOsc.start(when); modOsc.stop(endTime);
    carOsc.start(when); carOsc.stop(endTime);
    subOsc.start(when); subOsc.stop(endTime);
  }

  function playCampanas(type = 'single') {
    if (!initialized) return;
    resume();
    const now = ctx.currentTime + 0.05;
    const configs = {
      single:   [{ freq: 440, delay: 0 }],
      doble:    [{ freq: 440, delay: 0 }, { freq: 523.25, delay: 1.2 }],
      repique:  [
        { freq: 440,    delay: 0   }, { freq: 523.25, delay: 0.9 },
        { freq: 392,    delay: 1.9 }, { freq: 523.25, delay: 2.7 },
        { freq: 440,    delay: 3.6 }, { freq: 493.88, delay: 4.4 }
      ],
      victoria: [
        { freq: 523.25, delay: 0   }, { freq: 659.25, delay: 0.7 },
        { freq: 783.99, delay: 1.4 }, { freq: 523.25, delay: 2.5 },
        { freq: 659.25, delay: 3.2 }, { freq: 783.99, delay: 3.9 },
        { freq: 880,    delay: 5.0 }
      ]
    };
    const bells = configs[type] || configs.single;
    bells.forEach(b => strikeBell(b.freq, 0.10, now + b.delay));
  }

  // ══════════════════════════════════════════════════════════
  // MÚSICA POR ACTO — pista continua por sección, sin interrupciones entre eventos
  // Menú       : Himno + ChillPad
  // Acto I  (ev  1–13): solemn  — tensión colonial, conspiración
  // Acto II (ev 14–31): tense   — la revolución en marcha
  // Acto III(ev 32–45): hopeful — consolidación, mirada al futuro
  // ══════════════════════════════════════════════════════════

  function eventToAct(eventId) {
    if (eventId <= 13) return 1;
    if (eventId <= 31) return 2;
    return 3;
  }

  const ACT_MUSIC = {
    1: { mood: 'solemn',  vol: 0.28 },
    2: { mood: 'tense',   vol: 0.30 },
    3: { mood: 'hopeful', vol: 0.30 },
  };

  let currentActPlaying = 0;

  function startActMusic(act) {
    const cfg = ACT_MUSIC[act];
    if (!cfg) return;
    // Si ya está sonando ese acto y hay melodía activa, no interrumpir
    if (currentActPlaying === act && activeNodes['melody']) return;
    currentActPlaying = act;
    if (activeNodes['melody']) fadeOutLayer('melody', 2.5);
    const t = setTimeout(() => buildMelody(cfg.mood, cfg.vol), 700);
    scheduledTimers.push(t);
  }

  // ══════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════

  // playScene: llamado en cada evento. Solo garantiza que la música del acto esté activa.
  // NO detiene ni reinicia la pista — la continuidad es la nueva regla.
  function playScene(eventId) {
    if (!initialized) return;
    resume();
    startActMusic(eventToAct(eventId));
  }

  // ══════════════════════════════════════════════════════════
  // HIMNO NACIONAL ARGENTINO — Web Audio API puro
  // Secuenciador propio, sin Tone.js (evita conflicto de AudioContext)
  // BPM 72, escala Eb mayor, síntesis de piano con 2 voces + reverb artificial
  // ══════════════════════════════════════════════════════════

  // Tabla de frecuencias (Hz) — notación científica → Hz
  const NOTE_FREQ = {
    'Eb3':155.56,'G3':196.00,'Bb3':233.08,
    'C4':261.63,'D4':293.66,'Eb4':311.13,'F4':349.23,'G4':392.00,
    'Ab4':415.30,'A4':440.00,'Bb4':466.16,'B4':493.88,
    'C5':523.25,'D5':587.33,'Eb5':622.25,'F5':698.46,'G5':783.99,
    'Ab5':830.61,'Bb5':932.33
  };

  // [nota, duración_en_segundos_a_BPM_72]
  // 4n=0.833s, 8n=0.417s, 4n.=1.25s, 2n=1.667s, 2n.=2.5s, 1n=3.333s
  const BPM72 = 72;
  const Q  = 60 / BPM72;       // un beat = 0.833s
  const H  = Q * 2;            // half note
  const W  = Q * 4;            // whole note
  const E  = Q / 2;            // eighth
  const QD = Q * 1.5;          // dotted quarter
  const HD = Q * 3;            // dotted half

  // [nota, duracion_sec]
  const HIMNO_SEQ = [
    // Introducción
    ['G4',Q],['G4',E],['G4',E], ['Eb4',QD],['F4',E], ['G4',H],
    // "Oíd mortales el grito sagrado"
    ['G4',Q],['G4',E],['G4',E], ['Eb4',QD],['F4',E], ['G4',H],
    ['G4',Q],['Ab4',Q], ['Bb4',Q],['Bb4',E],['Bb4',E], ['G4',QD],['Ab4',E], ['Bb4',H],
    // "libertad, libertad, libertad"
    ['Bb4',Q],['Bb4',E],['Bb4',E], ['C5',QD],['Bb4',E], ['Ab4',Q],['G4',Q],
    ['F4',QD],['G4',E], ['Eb4',H],
    // "Oíd el ruido de rotas cadenas"
    ['G4',Q],['Ab4',Q], ['Bb4',Q],['Bb4',E],['Bb4',E], ['C5',QD],['Bb4',E],
    ['Ab4',Q],['G4',Q], ['F4',H],
    // "ved en trono a la noble igualdad"
    ['Bb4',Q],['Bb4',E],['Bb4',E], ['Eb5',QD],['D5',E], ['C5',Q],['Bb4',Q],
    ['Ab4',QD],['G4',E], ['F4',H],
    // Coro: "Sean eternos los laureles"
    ['Eb4',Q],['G4',Q], ['Bb4',QD],['Ab4',E], ['G4',Q],['F4',Q], ['Eb4',H],
    ['Eb4',Q],['G4',Q], ['Bb4',QD],['C5',E],  ['Bb4',Q],['Ab4',Q], ['G4',H],
    // "que supimos conseguir"
    ['G4',Q],['G4',E],['G4',E], ['Ab4',Q],['G4',Q], ['F4',QD],['Eb4',E], ['Eb4',H],
    // "Coronados de gloria vivamos"
    ['Bb4',Q],['Bb4',E],['Bb4',E], ['Eb5',QD],['D5',E], ['C5',Q],['Bb4',Q],
    ['Ab4',QD],['G4',E], ['F4',H],
    // "o juremos con gloria morir"
    ['Bb4',Q],['Bb4',E],['Ab4',E], ['G4',Q],['F4',Q], ['Eb4',QD],['F4',E], ['Eb4',W],
  ];

  let chillPadNodes  = [];
  let himnoRunning   = false;
  let himnoFadeTimer = null;
  let himnoLoopTimer = null;      // setTimeout handle for loop restart
  let himnoGainNode  = null;      // master gain for the himno melody

  // Piano sintético minimalista: 2 osciladores por nota (fundamental + octava suave).
  // Menos osciladores simultáneos = sin glitching ni saturación del grafo de audio.
  function playPianoNote(freq, dur, when, masterVol = 0.11) {
    if (!ctx || !himnoRunning) return;

    // Envolvente de amplitud: ataque suave, decay, sustain, release
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.linearRampToValueAtTime(masterVol, when + 0.018);        // ataque
    env.gain.setTargetAtTime(masterVol * 0.55, when + 0.06, 0.07);   // decay
    env.gain.setTargetAtTime(0.0001,            when + dur * 0.65, dur * 0.22); // release

    // Oscilador 1: fundamental (triangle — más cálido que sine, sin armónicos agresivos)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    osc1.connect(env);
    osc1.start(when);
    osc1.stop(when + dur + 0.35);

    // Oscilador 2: octava superior muy suave — da "brillo" sin masa de osciladores
    const osc2 = ctx.createOscillator();
    const osc2g = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.0;
    osc2g.gain.value = 0.18;
    osc2.connect(osc2g); osc2g.connect(env);
    osc2.start(when);
    osc2.stop(when + dur + 0.2);

    env.connect(himnoGainNode);
  }

  // Secuencia el himno completo usando ctx.currentTime (sin Tone.js).
  // El loop se reinicia con un gap de 2s después del final real de la secuencia,
  // evitando superposición de dos ciclos simultáneos (causa de glitching).
  function scheduleHimno(startTime) {
    if (!himnoRunning || !ctx) return;
    let t = startTime;
    HIMNO_SEQ.forEach(([note, dur]) => {
      const freq = NOTE_FREQ[note];
      if (freq) playPianoNote(freq, dur, t);
      t += dur;
    });
    // t ahora es el tiempo del final de la última nota.
    // Añadimos 2s de silencio antes del próximo loop para asegurar
    // que todos los osciladores del ciclo actual hayan terminado.
    const loopDur = t - startTime;
    himnoLoopTimer = setTimeout(() => {
      if (himnoRunning) scheduleHimno(ctx.currentTime + 0.05);
    }, (loopDur + 2.0) * 1000);
    scheduledTimers.push(himnoLoopTimer);
  }

  function buildChillPad() {
    if (!ctx) return;
    // Pad suave: 3 osciladores sinusoidales acordes con la tonalidad de Eb mayor
    const padFreqs = [
      { f: 155.56, label: 'Eb3' }, // Eb3
      { f: 196.00, label: 'G3'  }, // G3
      { f: 233.08, label: 'Bb3' }, // Bb3
    ];
    padFreqs.forEach(({ f }) => {
      const fadeG = ctx.createGain();
      const modG  = ctx.createGain();
      fadeG.gain.value = 0;
      modG.gain.value  = 0.022;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator(); // slight detune for warmth
      osc1.type = 'sine'; osc1.frequency.value = f;
      osc2.type = 'sine'; osc2.frequency.value = f * 1.003;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.5;

      osc1.connect(modG); osc2.connect(modG);
      modG.connect(lp); lp.connect(fadeG); fadeG.connect(masterGain);

      // Slow volume swell LFO — on modG, not fadeG
      const lfoO = ctx.createOscillator();
      const lfoA = ctx.createGain();
      lfoO.frequency.value = 0.08 + Math.random() * 0.04;
      lfoA.gain.value = 0.006;
      lfoO.connect(lfoA); lfoA.connect(modG.gain);
      lfoO.start(); osc1.start(); osc2.start();

      fadeG.gain.setTargetAtTime(1.0, ctx.currentTime, 4);
      chillPadNodes.push({ fadeG, osc1, osc2, lfoO });
    });
  }

  function stopChillPad(fadeTime = 3) {
    chillPadNodes.forEach(({ fadeG, osc1, osc2, lfoO }) => {
      fadeG.gain.setTargetAtTime(0, ctx.currentTime, fadeTime / 4);
      setTimeout(() => {
        try { osc1.stop(); osc2.stop(); lfoO.stop(); fadeG.disconnect(); } catch(e) {}
      }, fadeTime * 1000 + 200);
    });
    chillPadNodes = [];
  }

  function buildHimno() {
    if (himnoRunning || !ctx) return;
    himnoRunning = true;

    // Compresor limitador: evita saturación cuando coinciden notas largas
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;   // empieza a comprimir suavemente a -14 dBFS
    comp.knee.value      = 8;
    comp.ratio.value     = 4;
    comp.attack.value    = 0.004;
    comp.release.value   = 0.18;
    comp.connect(masterGain);

    // Nodo de ganancia del himno — permite fade out limpio
    himnoGainNode = ctx.createGain();
    himnoGainNode.gain.value = 0;
    himnoGainNode.connect(comp);  // → compresor → masterGain

    // Fade in suave (2.5s)
    himnoGainNode.gain.setTargetAtTime(0.80, ctx.currentTime, 0.9);

    // Pequeño silencio antes de arrancar (1.2s)
    scheduleHimno(ctx.currentTime + 1.2);
  }

  function stopHimno(fadeTime = 4) {
    if (!himnoRunning) return;
    himnoRunning = false;
    if (himnoLoopTimer) { clearTimeout(himnoLoopTimer); himnoLoopTimer = null; }
    if (himnoGainNode) {
      himnoGainNode.gain.setTargetAtTime(0, ctx.currentTime, fadeTime / 4);
      const node = himnoGainNode;
      setTimeout(() => { try { node.disconnect(); } catch(e){} }, (fadeTime + 1) * 1000);
      himnoGainNode = null;
    }
  }

  function playMenu() {
    if (!initialized) return;
    resume();
    stopAll(2);
    stopHimno(0.5);
    stopChillPad(0.5);
    currentActPlaying = 0; // resetear estado de acto
    if (himnoFadeTimer) { clearTimeout(himnoFadeTimer); himnoFadeTimer = null; }

    setTimeout(() => {
      buildChillPad();
      buildHimno();
    }, 600);
  }

  // playActTransition: gestiona la transición musical al mostrar la pantalla de acto.
  // Acto 1: la pantalla de transición todavía muestra el Himno (menú context).
  //         Al confirmar "Comenzar", fadeOutHimnoBeforeGame() hace el fade y
  //         luego el primer playScene(1) arranca la música del Acto I.
  // Acto 2: crossfade desde música Acto I → música Acto II durante la pantalla de transición.
  // Acto 3: crossfade desde música Acto II → música Acto III durante la pantalla de transición.
  function playActTransition(actNum) {
    if (!initialized) return;
    resume();

    if (actNum === 1) {
      // La transición del Acto I ocurre mientras el Himno todavía suena (venimos del menú).
      // No tocar nada — el Himno sigue hasta que el jugador haga click en "Comenzar".
      if (!himnoRunning) { buildChillPad(); buildHimno(); }

    } else if (actNum === 2) {
      // Crossfade: fade out música Acto I → fade in música Acto II
      // La pantalla de transición dura varios segundos — aprovechamos ese tiempo.
      currentActPlaying = 0; // resetear para que startActMusic no bloquee
      if (activeNodes['melody']) fadeOutLayer('melody', 3.0);
      const t = setTimeout(() => {
        currentActPlaying = 2;
        buildMelody('tense', 0.30);
      }, 1200);
      scheduledTimers.push(t);

    } else if (actNum === 3) {
      // Crossfade: fade out música Acto II → fade in música Acto III
      currentActPlaying = 0;
      if (activeNodes['melody']) fadeOutLayer('melody', 3.0);
      const t = setTimeout(() => {
        currentActPlaying = 3;
        buildMelody('hopeful', 0.30);
      }, 1200);
      scheduledTimers.push(t);
    }
  }

  // Llamado al hacer click en "Comenzar · Acto I": fade out Himno, arranca música Acto I.
  function fadeOutHimnoBeforeGame() {
    stopHimno(3.5);
    stopChillPad(3.5);
    // Arrancar música Acto I después del fade del himno
    currentActPlaying = 0; // permitir que startActMusic lo inicie
    const t = setTimeout(() => {
      currentActPlaying = 1;
      buildMelody('solemn', 0.28);
    }, 2000);
    scheduledTimers.push(t);
  }

  function playGameOver() {
    if (!initialized) return;
    resume();
    stopAll(0.5);
    setTimeout(() => { buildMelody('solemn', 0.30); }, 300);
  }

  function playVictory() {
    if (!initialized) return;
    resume();
    stopAll(0.8);
    setTimeout(() => {
      playCampanas('victoria');
      buildMelody('epic', 0.35);
    }, 300);
  }

  // ══════════════════════════════════════════════════════════
  // BUTTON SOUNDS
  // ══════════════════════════════════════════════════════════
  // Types: 'ui'=generic, 'primary'=confirm/start, 'choice'=game decision,
  //        'tab'=tab switch, 'danger'=destructive, 'splash'=begin
  function playButtonSound(type = 'ui') {
    if (!initialized || muted) return;
    resume();
    const now = ctx.currentTime;

    switch (type) {

      case 'splash': {
        // Solemne: dos notas ascendentes tipo campana pequeña
        [523.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = freq;
          g.gain.setValueAtTime(0, now + i * 0.18);
          g.gain.linearRampToValueAtTime(0.18, now + i * 0.18 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 1.1);
          o.connect(g); g.connect(masterGain);
          o.start(now + i * 0.18);
          o.stop(now + i * 0.18 + 1.2);
        });
        break;
      }

      case 'primary': {
        // Confirmación: click seco + pequeño tono cálido
        const click = ctx.createOscillator();
        const cg = ctx.createGain();
        click.type = 'triangle'; click.frequency.value = 660;
        cg.gain.setValueAtTime(0, now);
        cg.gain.linearRampToValueAtTime(0.14, now + 0.008);
        cg.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        click.connect(cg); cg.connect(masterGain);
        click.start(now); click.stop(now + 0.25);

        const warm = ctx.createOscillator();
        const wg = ctx.createGain();
        warm.type = 'sine'; warm.frequency.value = 440;
        wg.gain.setValueAtTime(0, now + 0.04);
        wg.gain.linearRampToValueAtTime(0.09, now + 0.06);
        wg.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        warm.connect(wg); wg.connect(masterGain);
        warm.start(now + 0.04); warm.stop(now + 0.55);
        break;
      }

      case 'choice': {
        // Pergamino: crujido suave + nota grave corta — decisión con peso
        const noise = ctx.createBufferSource();
        const nBuf = makeWhiteNoise(0.12);
        noise.buffer = nBuf;
        const nbp = ctx.createBiquadFilter();
        nbp.type = 'bandpass'; nbp.frequency.value = 1200; nbp.Q.value = 0.8;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0, now);
        ng.gain.linearRampToValueAtTime(0.06, now + 0.01);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        noise.connect(nbp); nbp.connect(ng); ng.connect(masterGain);
        noise.start(now); noise.stop(now + 0.14);

        const bass = ctx.createOscillator();
        const bg2 = ctx.createGain();
        bass.type = 'sine'; bass.frequency.value = 196;
        bg2.gain.setValueAtTime(0, now);
        bg2.gain.linearRampToValueAtTime(0.08, now + 0.015);
        bg2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        bass.connect(bg2); bg2.connect(masterGain);
        bass.start(now); bass.stop(now + 0.3);
        break;
      }

      case 'tab': {
        // Sutil: tick seco de madera
        const t = ctx.createOscillator();
        const tg = ctx.createGain();
        t.type = 'triangle'; t.frequency.value = 880;
        tg.gain.setValueAtTime(0, now);
        tg.gain.linearRampToValueAtTime(0.07, now + 0.006);
        tg.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        t.connect(tg); tg.connect(masterGain);
        t.start(now); t.stop(now + 0.08);
        break;
      }

      case 'danger': {
        // Grave disonante: advertencia
        const d = ctx.createOscillator();
        const dg = ctx.createGain();
        d.type = 'sawtooth'; d.frequency.value = 110;
        dg.gain.setValueAtTime(0, now);
        dg.gain.linearRampToValueAtTime(0.09, now + 0.02);
        dg.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        const dlp = ctx.createBiquadFilter();
        dlp.type = 'lowpass'; dlp.frequency.value = 400; dlp.Q.value = 0.5;
        d.connect(dlp); dlp.connect(dg); dg.connect(masterGain);
        d.start(now); d.stop(now + 0.4);
        break;
      }

      case 'ui':
      default: {
        // Hover suave: clic de pluma sobre papel
        const u = ctx.createOscillator();
        const ug = ctx.createGain();
        u.type = 'sine'; u.frequency.value = 740;
        ug.gain.setValueAtTime(0, now);
        ug.gain.linearRampToValueAtTime(0.055, now + 0.005);
        ug.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        u.connect(ug); ug.connect(masterGain);
        u.start(now); u.stop(now + 0.1);
        break;
      }
    }
  }

  return { init, toggleMute, playScene, playMenu, playActTransition, playGameOver, playVictory, playCampanas, fadeOutHimnoBeforeGame, isHimnoRunning: () => himnoRunning, playButtonSound, stopAll: (t) => stopAll(t) };
})();
