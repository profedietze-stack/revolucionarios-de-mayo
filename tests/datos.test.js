// Integridad de los datos del juego.
//
// Todo el contenido —50 eventos, personajes, logros, actos— vive en archivos de
// datos que se editan a mano. Nada avisa cuando una edición rompe un vínculo:
// un logro que apunta a un evento que ya no existe simplemente no se desbloquea
// nunca, y un `showCharacter` con un contexto mal escrito deja al personaje
// mudo. Ninguna de las dos cosas se ve jugando salvo que caiga justo ahí.
//
// Los archivos son <script> clásicos que declaran constantes globales, no
// módulos. Se cargan en un contexto de node, que es la forma de probarlos sin
// tocar el juego.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const raiz = join(__dirname, '..');
const contexto = vm.createContext({ console, Math, Object, Array, Set, JSON });
for (const archivo of ['events.js', 'characters.js', 'achievements.js', 'acts.js', 'quotes.js', 'tooltips.js']) {
  vm.runInContext(readFileSync(join(raiz, 'data', archivo), 'utf8'), contexto, { filename: archivo });
}
// Los archivos declaran las constantes con `const`, que no quedan como
// propiedades del objeto global: hay que pedirlas desde adentro del propio
// contexto, igual que haria otro <script> de la pagina.
const { EVENTS, CHARACTERS, LOGROS_DEF, ACT_TRANSITIONS, FRASES } =
  vm.runInContext('({ EVENTS, CHARACTERS, LOGROS_DEF, ACT_TRANSITIONS, FRASES })', contexto);

// ── Eventos ───────────────────────────────────────────────────────────────────

test('los ids de los eventos son únicos y la partida principal no tiene saltos', () => {
  const ids = EVENTS.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, 'hay ids repetidos');

  // La partida corre del 1 al 50 seguido. Los ids de 200 para arriba son ramas
  // alternativas (la 221 reemplaza a la 22 si se toma la vía diplomática): no
  // van en la numeración corrida, pero tienen que existir de a una.
  const principales = ids.filter((id) => id < 200).sort((a, b) => a - b);
  for (const [i, id] of principales.entries()) {
    assert.equal(id, i + 1, `falta el evento ${i + 1}: después del ${principales[i - 1]} viene ${id}`);
  }
});

test('toda rama alternativa dice a qué evento reemplaza', () => {
  // `ALT_EVENTS_DISPLAY` en ui.js traduce el id alternativo al número que ve el
  // alumno. Un evento alternativo que no esté ahí se muestra con su id crudo
  // ("Evento 221 de 50"), que es justamente lo que el mapeo evita.
  const ui = readFileSync(join(raiz, 'engine', 'ui.js'), 'utf8');
  const mapa = ui.match(/ALT_EVENTS_DISPLAY\s*=\s*\{([^}]*)\}/);
  assert.ok(mapa, 'no se encontró ALT_EVENTS_DISPLAY: cambió de nombre o de forma');
  const declarados = new Set(
    [...mapa[1].matchAll(/(\d+)\s*:\s*(\d+)/g)].map((m) => Number(m[1])),
  );
  const ids = EVENTS.map((e) => e.id);
  for (const id of ids.filter((x) => x >= 200)) {
    assert.ok(declarados.has(id), `el evento alternativo ${id} no está en ALT_EVENTS_DISPLAY`);
  }
  for (const id of declarados) {
    assert.ok(ids.includes(id), `ALT_EVENTS_DISPLAY nombra el evento ${id}, que no existe`);
  }
});

test('todo evento tiene título, subtítulo y narrativa', () => {
  for (const e of EVENTS) {
    assert.ok(e.title && e.title.trim(), `evento ${e.id} sin título`);
    assert.ok(e.subtitle && e.subtitle.trim(), `evento ${e.id} sin subtítulo`);
    assert.ok(Array.isArray(e.narrative) && e.narrative.length > 0, `evento ${e.id} sin narrativa`);
    for (const parrafo of e.narrative) {
      assert.equal(typeof parrafo, 'string', `evento ${e.id}: párrafo que no es texto`);
      assert.ok(parrafo.trim().length > 0, `evento ${e.id}: párrafo vacío`);
    }
  }
});

test('toda opción tiene texto, etiqueta y efectos numéricos', () => {
  for (const e of EVENTS) {
    assert.ok(Array.isArray(e.choices) && e.choices.length >= 2,
      `evento ${e.id}: ${e.choices ? e.choices.length : 0} opciones`);
    for (const [i, c] of e.choices.entries()) {
      assert.ok(c.text && c.text.trim(), `evento ${e.id} opción ${i}: sin texto`);
      assert.ok(c.label && c.label.trim(), `evento ${e.id} opción ${i}: sin etiqueta`);
      assert.equal(typeof c.prest, 'number', `evento ${e.id} opción ${i}: prestigio no numérico`);
      assert.equal(typeof c.riesgo, 'number', `evento ${e.id} opción ${i}: riesgo no numérico`);
      assert.ok(Number.isFinite(c.prest) && Number.isFinite(c.riesgo),
        `evento ${e.id} opción ${i}: efecto no finito`);
    }
  }
});

test('las etiquetas de las opciones no se repiten dentro del mismo evento', () => {
  for (const e of EVENTS) {
    const etiquetas = e.choices.map((c) => c.label);
    assert.equal(new Set(etiquetas).size, etiquetas.length,
      `evento ${e.id}: etiquetas repetidas (${etiquetas.join(', ')})`);
  }
});

test('las opciones que terminan la partida explican por qué', () => {
  for (const e of EVENTS) {
    for (const [i, c] of e.choices.entries()) {
      if (!c.gameOver) continue;
      assert.ok(c.goText && c.goText.trim().length > 20,
        `evento ${e.id} opción ${i}: game over sin texto que lo explique`);
    }
  }
});

test('el marcador del nombre del jugador está siempre bien escrito', () => {
  // Un {PLAYER} mal tipeado no rompe nada: se imprime literal en pantalla, en
  // medio de la narración, y ahí queda.
  const sospechosos = /\{\s*(player|jugador|nombre|name)[^}]*\}/gi;
  for (const e of EVENTS) {
    const texto = [...e.narrative, ...e.choices.map((c) => c.text)].join(' ');
    for (const hallazgo of texto.match(sospechosos) || []) {
      assert.equal(hallazgo, '{PLAYER}', `evento ${e.id}: marcador mal escrito "${hallazgo}"`);
    }
  }
});

// ── Vínculos entre archivos ───────────────────────────────────────────────────

test('todo personaje que un evento muestra existe, y con ese diálogo', () => {
  for (const e of EVENTS) {
    if (!e.showCharacter) continue;
    const { id, ctx } = e.showCharacter;
    const pj = CHARACTERS[id];
    assert.ok(pj, `evento ${e.id}: el personaje "${id}" no existe`);
    assert.ok(pj.dialogos && pj.dialogos[ctx],
      `evento ${e.id}: "${id}" no tiene diálogo para el contexto "${ctx}"`);
    assert.ok(pj.dialogos[ctx].length > 0,
      `evento ${e.id}: el diálogo "${ctx}" de "${id}" está vacío`);
  }
});

test('todo personaje tiene nombre, cargo y retrato', () => {
  for (const [id, pj] of Object.entries(CHARACTERS)) {
    assert.ok(pj.nombre, `${id}: sin nombre`);
    assert.ok(pj.cargo, `${id}: sin cargo`);
    assert.match(pj.img || '', /\.(png|jpg|webp)$/, `${id}: retrato raro (${pj.img})`);
  }
});

test('los logros que miran eventos concretos apuntan a eventos que existen', () => {
  // Los `check` de los logros traen listas de ids a mano: [5,24,30,34] y
  // similares. Si se renumera un evento, el logro deja de desbloquearse y
  // nadie se entera.
  const ids = new Set(EVENTS.map((e) => e.id));
  const fuente = readFileSync(join(raiz, 'data', 'achievements.js'), 'utf8');
  const referencias = [...fuente.matchAll(/d\.evento\s*===?\s*(\d+)/g)].map((m) => Number(m[1]));
  const enListas = [...fuente.matchAll(/\[([\d,\s]+)\]\.includes\(d\.evento\)/g)]
    .flatMap((m) => m[1].split(',').map((n) => Number(n.trim())));
  const todas = [...referencias, ...enListas];
  assert.ok(todas.length > 0, 'no se encontró ninguna referencia: cambió la forma de escribirlas');
  for (const id of todas) {
    assert.ok(ids.has(id), `un logro apunta al evento ${id}, que no existe`);
  }
});

test('los logros tienen id único, nombre, descripción y comprobación', () => {
  const ids = LOGROS_DEF.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length, 'ids de logro repetidos');
  for (const l of LOGROS_DEF) {
    assert.ok(l.nombre && l.desc, `logro ${l.id}: sin nombre o sin descripción`);
    assert.equal(typeof l.check, 'function', `logro ${l.id}: sin comprobación`);
  }
});

test('ningún logro rompe con un estado a medio armar', () => {
  // `check` corre sobre el estado real de la partida. Si uno asume un campo que
  // todavía no existe, tumba la pantalla de final justo cuando el alumno
  // termina de jugar.
  const estadoMinimo = {
    decisiones: [], prestigio: 0, riesgo: 0, gameEnded: true, logros: [],
    dificultad: 'normal', puntuacion: 0,
  };
  for (const l of LOGROS_DEF) {
    assert.doesNotThrow(() => l.check(estadoMinimo), `logro ${l.id} explota con el estado mínimo`);
  }
});

test('cada acto declarado tiene su presentación completa', () => {
  for (const [numero, acto] of Object.entries(ACT_TRANSITIONS)) {
    assert.ok(acto.roman && acto.title, `acto ${numero}: sin título`);
    assert.ok(acto.narrative && acto.narrative.trim().length > 50, `acto ${numero}: narrativa muy corta`);
    assert.ok(Array.isArray(acto.columns) && acto.columns.length > 0, `acto ${numero}: sin columnas`);
    for (const col of acto.columns) {
      assert.ok(col.title && col.text, `acto ${numero}: columna incompleta`);
    }
  }
});

test('las frases de carga son textos, no huecos', () => {
  assert.ok(FRASES.length > 0);
  for (const f of FRASES) {
    const texto = typeof f === 'string' ? f : f.texto || f.text || '';
    assert.ok(String(texto).trim().length > 0, 'hay una frase vacía');
  }
});
