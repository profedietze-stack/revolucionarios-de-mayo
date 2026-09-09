// El guardado, cuando llega roto.
//
// `rev_mayo_save` vive en el navegador del alumno, y en un aula el segundo día
// alguien abre la consola. No hace falta blindar la trampa —es un juego de un
// jugador— pero sí que el juego no se rompa ni deje de poder perderse.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const raiz = join(__dirname, '..');

/** `state.js` sin las funciones que necesitan navegador: acá sólo interesa la lógica. */
function cargarEstado() {
  const contexto = vm.createContext({
    console, Math, Object, Array, Set, JSON, Date, isNaN, Number,
    document: { getElementById: () => null, querySelectorAll: () => [], querySelector: () => null },
    window: {}, localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  });
  vm.runInContext(readFileSync(join(raiz, 'engine', 'state.js'), 'utf8'), contexto, { filename: 'state.js' });
  return vm.runInContext(
    '({ clamp, migrateSave, RIESGO_MAX, PRESTIGIO_MAX })', contexto);
}

const { clamp, migrateSave, RIESGO_MAX } = cargarEstado();

/**
 * `clamp` deja pasar el NaN, y con eso la partida deja de poder perderse.
 *
 * `Math.max(0, Math.min(150, NaN))` devuelve **NaN**: las dos comparaciones con
 * NaN son falsas, así que sale intacto por el medio. Y la derrota se comprueba
 * con `GS.riesgo >= RIESGO_MAX`, que con NaN es false para siempre.
 *
 * Lo grave no es la barra rota. Es que el juego entero pierde su apuesta: cada
 * decisión del alumno se mide en riesgo, y con el riesgo en NaN ninguna decisión
 * puede salir mal. No hay un solo error en pantalla que lo delate.
 */
test('clamp devuelve siempre un número usable', () => {
  for (const basura of [NaN, undefined, null, 'mucho', {}, [1, 2], Infinity, -Infinity]) {
    const v = clamp(basura, 0, RIESGO_MAX);
    assert.ok(Number.isFinite(v), `clamp(${JSON.stringify(basura)}) devolvió ${v}`);
    assert.ok(v >= 0 && v <= RIESGO_MAX, `clamp(${JSON.stringify(basura)}) = ${v}`);
  }
});

test('y los números de verdad siguen pasando enteros y acotados', () => {
  assert.equal(clamp(80, 0, 150), 80);
  assert.equal(clamp('80', 0, 150), 80);
  assert.equal(clamp(-30, 0, 150), 0);
  assert.equal(clamp(9999, 0, 150), 150);
});

test('con el riesgo roto, la derrota vuelve a poder dispararse', () => {
  const riesgo = clamp('altísimo', 0, RIESGO_MAX);   // antes: NaN
  assert.equal(riesgo >= RIESGO_MAX, false);          // sigue sin perder…
  assert.ok(Number.isFinite(riesgo));                 // …pero ahora es un número
  assert.equal(clamp(NaN + 200, 0, RIESGO_MAX) >= 0, true);
});

/**
 * Y el save editado no entra crudo al estado.
 *
 * `migrateSave` comprobaba una sola cosa —que `currentEvent` fuera un número— y
 * dejaba pasar todo lo demás tal como viniera. Un `riesgo` con una cadena o un
 * `decisiones` que no es una lista se meten enteros en `GS`, y de ahí en adelante
 * cada cuenta arrastra el problema.
 */
test('un guardado con campos de otro tipo se sanea al cargarlo', () => {
  const roto = JSON.stringify({
    version: 11,
    state: {
      currentEvent: 7,
      prestigio: 'mucho',
      riesgo: null,
      logros: 'ninguno',
      decisiones: { no: 'es una lista' },
      puntuacion: NaN,
      playerName: 42,
    },
  });
  const s = migrateSave(roto);
  assert.ok(s, 'el guardado se rechazó entero: sólo hacía falta sanearlo');
  assert.ok(Number.isFinite(s.prestigio), `prestigio quedó en ${s.prestigio}`);
  assert.ok(Number.isFinite(s.riesgo), `riesgo quedó en ${s.riesgo}`);
  assert.ok(Number.isFinite(s.puntuacion), `puntuación quedó en ${s.puntuacion}`);
  assert.ok(Array.isArray(s.logros), 'logros tiene que ser una lista');
  assert.ok(Array.isArray(s.decisiones), 'decisiones tiene que ser una lista');
  assert.equal(typeof s.playerName, 'string');
});

test('un guardado sano no se toca', () => {
  const sano = {
    currentEvent: 12, prestigio: 63, riesgo: 41, logros: ['primer_paso'],
    decisiones: [{ evento: 1, opcion: 0 }], puntuacion: 120, playerName: 'Ana',
  };
  const s = migrateSave(JSON.stringify({ version: 11, state: sano }));
  assert.equal(s.currentEvent, 12);
  assert.equal(s.prestigio, 63);
  assert.equal(s.riesgo, 41);
  assert.equal(s.playerName, 'Ana');
  assert.deepEqual(s.decisiones, [{ evento: 1, opcion: 0 }]);
});

test('y una basura que no es un guardado se sigue rechazando', () => {
  assert.equal(migrateSave('{no es json'), null);
  assert.equal(migrateSave('null'), null);
  assert.equal(migrateSave('[]'), null);
  assert.equal(migrateSave(JSON.stringify({ version: 11, state: { sin: 'evento' } })), null);
});

/**
 * Y `localStorage` puede tirar al tocarlo.
 *
 * En modo privado y con las cookies de sitio bloqueadas, leer la propiedad
 * lanza en vez de devolver null. `saveGame` ya lo tenía previsto —avisa con un
 * toast— pero `checkLoadButton`, que corre al abrir la portada, y `loadGame`
 * preguntaban sin red. La portada es lo primero que se ve.
 */
test('nada toca localStorage sin protección', () => {
  const fuente = readFileSync(join(raiz, 'engine', 'state.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l))
    .join('\n');

  // Cada uso tiene que estar dentro de un `try` abierto poco antes, o dentro de
  // `leerGuardado`, que es la única puerta de lectura del guardado. El `try` suele
  // estar en la línea de arriba, así que se mira el texto que precede y no la línea
  // suelta: filtrando por línea, el `setItem` que sí está protegido daba falso rojo.
  const sinRed = [];
  for (const m of fuente.matchAll(/localStorage\.\w+/g)) {
    const antes = fuente.slice(Math.max(0, m.index - 400), m.index);
    const abreTry = antes.lastIndexOf('try {');
    const enTry = abreTry !== -1 && !antes.slice(abreTry).includes('}');
    const abreLector = antes.lastIndexOf('function leerGuardado');
    const enLector = abreLector !== -1 && !antes.slice(abreLector).includes('\n}');
    if (!enTry && !enLector) {
      sinRed.push(`línea ${fuente.slice(0, m.index).split('\n').length}: ${m[0]}`);
    }
  }
  assert.deepEqual(sinRed, []);
});
