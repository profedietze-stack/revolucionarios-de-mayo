// El botón de silencio.
//
// Es el control que más se usa en un aula: treinta tablets sonando a la vez y el
// docente pidiendo silencio. Se prueba con una Web Audio de mentira, que es la
// única forma de mirar qué valor queda en el volumen sin abrir un navegador.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const raiz = join(__dirname, '..');

/** Una Web Audio mínima: sólo lo que `init` y `toggleMute` tocan. */
function cargarAudio() {
  // `connect` hace falta: sin él `init` lanza, lo atrapa su propio try, y `toggleMute`
  // se vuelve un no-op silencioso — el test pasaría sin probar nada.
  const master = {
    connect() {},
    gain: { value: null, setTargetAtTime(v) { this.value = v; } },
  };
  const boton = { textContent: '🔊' };

  const ctx = vm.createContext({
    console, Math, Object, Array, JSON, Date, setTimeout, clearTimeout,
    document: { getElementById: (id) => (id === 'audio-toggle-btn' ? boton : null) },
    window: {
      AudioContext: function () {
        return {
          currentTime: 0,
          state: 'running',
          destination: {},
          createGain: () => master,
          resume: () => Promise.resolve(),
        };
      },
    },
  });
  vm.runInContext(readFileSync(join(raiz, 'engine', 'audio.js'), 'utf8'), ctx, { filename: 'audio.js' });
  const AudioEngine = vm.runInContext('AudioEngine', ctx);
  return { AudioEngine, master, boton };
}

/**
 * Silenciar y volver a activar tiene que dejar el volumen donde estaba.
 *
 * `init` dejaba el master en 1.0 y `toggleMute`, al des-silenciar, lo ponía en
 * 0.72. Es decir: apretar el botón dos veces bajaba el volumen del juego un 28 %
 * **para siempre**, y otra vez más no lo devolvía. Nadie lo reporta como bug
 * —suena más bajo y ya— pero es el único control de audio que el juego tiene.
 */
test('des-silenciar devuelve el volumen que había antes', () => {
  const { AudioEngine, master, boton } = cargarAudio();
  AudioEngine.init();
  const original = master.gain.value;
  assert.ok(original > 0, 'el volumen inicial tiene que ser audible');

  AudioEngine.toggleMute();
  assert.equal(master.gain.value, 0, 'silenciar tiene que llevar el volumen a cero');
  assert.equal(boton.textContent, '🔇');

  AudioEngine.toggleMute();
  assert.equal(master.gain.value, original, 'volvió a un volumen distinto del que había');
  assert.equal(boton.textContent, '🔊');
});

test('y el ciclo se puede repetir sin que el volumen se vaya bajando', () => {
  const { AudioEngine, master } = cargarAudio();
  AudioEngine.init();
  const original = master.gain.value;
  for (let i = 0; i < 5; i++) { AudioEngine.toggleMute(); AudioEngine.toggleMute(); }
  assert.equal(master.gain.value, original, `tras cinco ciclos quedó en ${master.gain.value}`);
});
