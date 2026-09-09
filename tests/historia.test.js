// Los hechos.
//
// `datos.test.js` mira que los datos estén bien ENCHUFADOS: que los ids no se
// repitan, que un logro no apunte a un evento que no existe, que ningún
// personaje quede mudo. Todo eso puede estar impecable y el juego enseñar
// historia falsa igual, que en un juego de historia es el peor bug posible: no
// rompe nada, no sale en ningún log, y el alumno se lleva el error a la cabeza.
//
// Acá van los datos comprobables contra la historia, cada uno con su fuente, y
// las cuentas que el propio texto hace sobre sí mismo.
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
const { EVENTS, TOOLTIPS } = vm.runInContext('({ EVENTS, TOOLTIPS: TOOLTIP_DICT })', contexto);

/** Todo el texto que el alumno llega a leer, con el evento del que sale. */
const TEXTOS = EVENTS.flatMap((e) => [
  ...e.narrative.map((p) => [e.id, p]),
  ...e.choices.flatMap((c) => [[e.id, c.text], [e.id, c.goText || '']]),
]);

/** El texto de un evento, entero. */
const evento = (id) => TEXTOS.filter(([i]) => i === id).map(([, t]) => t).join('\n');

/** Dónde aparece un patrón, para que el rojo diga en qué evento mirar. */
function donde(patron) {
  return [...new Set(TEXTOS.filter(([, t]) => patron.test(t)).map(([i]) => i))];
}

// ── La Primera Junta ─────────────────────────────────────────────────────────

/**
 * Nueve hombres: un presidente, seis vocales y dos secretarios.
 *
 * Saavedra presidente; Moreno y Paso secretarios; Alberti, Azcuénaga, Belgrano,
 * Castelli, Larrea y Matheu vocales. Es el dato más repetido de todo el tema y
 * el juego lo tenía mal en los dos lugares donde lo dice, y distinto en cada uno:
 * el evento 14 nombraba a Moreno como secretario y después sumaba «otros cuatro
 * vocales, más dos secretarios» —once personas— para terminar diciendo «nueve
 * hombres»; el tooltip de referencia decía «siete vocales», que dan diez.
 *
 * El tooltip es peor que el relato: es la capa que el alumno abre justamente
 * cuando quiere estar seguro.
 *
 * Fuente: Billiken, «los nueve integrantes de la Primera Junta»; Argentina.gob.ar.
 */
test('la Primera Junta son nueve: presidente, seis vocales y dos secretarios', () => {
  const t = evento(14);
  assert.match(t, /seis vocales/i, 'el evento 14 no dice cuántos vocales son');
  assert.doesNotMatch(t, /otros cuatro vocales/i, 'serían once personas, no nueve');
  assert.match(t, /nueve hombres/i, 'se perdió el total');

  const tip = TOOLTIPS.find(([nombre]) => nombre === 'Primera Junta');
  assert.ok(tip, 'desapareció el tooltip de la Primera Junta');
  assert.match(tip[1], /seis vocales/i, `el tooltip dice: ${tip[1]}`);
  assert.doesNotMatch(tip[1], /siete vocales/i, 'siete vocales dan diez integrantes');
});

/** Y los seis vocales tienen nombre en algún lado del juego. */
test('los seis vocales están nombrados', () => {
  const todo = TEXTOS.map(([, t]) => t).join('\n') + TOOLTIPS.map((x) => x.join(' ')).join('\n');
  for (const v of ['Alberti', 'Azcuénaga', 'Belgrano', 'Castelli', 'Larrea', 'Matheu']) {
    assert.match(todo, new RegExp(v), `ningún texto nombra a ${v}`);
  }
});

// ── La Semana de Mayo ────────────────────────────────────────────────────────

/**
 * El Cabildo Abierto: 450 invitaciones repartidas, 251 vecinos presentes.
 *
 * El juego decía «cuatrocientos cincuenta y un vecinos han sido convocados a
 * votar» y, más abajo, «no sos de los cuatrocientos cincuenta y uno». Son dos
 * cifras distintas mezcladas en una: se repartieron 450 esquelas y se
 * presentaron 251. El 451 no es ninguna de las dos.
 *
 * Fuente: Museo Histórico Nacional, «Invitaciones al Cabildo Abierto del 22 de
 * mayo de 1810».
 */
test('las cifras del Cabildo Abierto son 450 invitaciones y 251 presentes', () => {
  const t = evento(8);
  assert.doesNotMatch(t, /cuatrocientos cincuenta y uno?\b/i,
    'el 451 mezcla las 450 invitaciones con los 251 presentes');
  assert.match(t, /cuatrocientas cincuenta|450/i, 'se perdieron las 450 invitaciones');
  assert.match(t, /doscientos cincuenta y uno|251/i, 'se perdieron los 251 presentes');
});

/**
 * La Junta presidida por Cisneros se formó el 24, no el 23.
 *
 * El 22 se votó, el 23 el Cabildo contó los votos, y el **24** publicó una Junta
 * con Cisneros de presidente, Saavedra, Castelli, Solá e Inchaurregui. Esa misma
 * noche Saavedra y Castelli renunciaron y Cisneros cayó: por eso el 25 hubo que
 * convocar de nuevo. El juego fechaba esa maniobra el 23 y dejaba el 24 como una
 * noche de espera, que es justo el día en que pasó todo.
 *
 * Fuente: TV Pública, «24 de mayo de 1810: el último intento frustrado de
 * Cisneros por seguir en el poder».
 */
test('la Junta de Cisneros se forma el 24 de mayo', () => {
  const e9 = EVENTS.find((e) => e.id === 9);
  assert.match(e9.subtitle, /24 de mayo/, `el evento 9 está fechado: ${e9.subtitle}`);
  assert.match(evento(9), /renunci|cay[óo]|se deshi|dur[óo] (unas )?horas/i,
    'la Junta de Cisneros se deshizo esa misma noche y el evento no lo cuenta');
});

// ── Los epílogos ─────────────────────────────────────────────────────────────

/**
 * Moreno se embarcó en la fragata inglesa «La Fama», el 24 de enero de 1811.
 *
 * El juego decía «el bergantín 'Canning' el 25 de enero». El nombre del barco es
 * el detalle que se le queda al alumno de toda la escena, y es el barco
 * equivocado.
 *
 * Fuente: Museo Histórico Nacional, «4 de marzo de 1811: Muerte de Mariano Moreno».
 */
test('Moreno se embarca en La Fama el 24 de enero de 1811', () => {
  assert.deepEqual(donde(/Canning/), [], 'el barco fue La Fama, no el Canning');
  const t = evento(46);
  assert.match(t, /La Fama/, 'se perdió el nombre del barco');
  assert.match(t, /24 de enero de 1811/, 'se embarcó el 24, no el 25');
  assert.match(t, /4 de marzo de 1811/, 'la fecha de la muerte tiene que quedar');
});

/**
 * Castelli murió el 12 de octubre de 1812, de cáncer de lengua.
 *
 * El juego decía «12 de noviembre» y «cáncer en la mandíbula». Lo de la lengua no
 * es un detalle clínico: es lo que cierra la escena. Al tribuno de Mayo, el mejor
 * orador de la revolución, le amputaron la lengua y pasó sus últimos meses sin
 * poder hablar. Cambiarlo por la mandíbula le saca el sentido a su propio final.
 *
 * Fuente: Museo Histórico Nacional del Cabildo; Infobae, 12/10/2022.
 */
test('Castelli muere el 12 de octubre de 1812, de cáncer de lengua', () => {
  const t = evento(47);
  assert.match(t, /12 de octubre de 1812/, 'la fecha es el 12 de octubre');
  assert.doesNotMatch(t, /12 de noviembre de 1812/, 'murió en octubre, no en noviembre');
  assert.match(t, /c[áa]ncer (de|en la) lengua/i, 'fue cáncer de lengua, y por eso deja de hablar');
  assert.doesNotMatch(t, /mand[íi]bula/i, 'la mandíbula no explica que perdiera la voz');
});

/**
 * De Tiahuanaco a Huaqui pasa casi un mes, no una semana.
 *
 * La proclama de Tiahuanaco es del 25 de mayo de 1811 y la derrota de Huaqui del
 * 20 de junio: veintiséis días. El texto decía «una semana después» y daba las
 * dos fechas correctas al lado, así que se contradecía solo.
 */
test('entre Tiahuanaco y Huaqui hay casi un mes', () => {
  const t = evento(47);
  assert.match(t, /25 de mayo de 1811/);
  assert.match(t, /20 de junio de 1811/);
  assert.doesNotMatch(t, /una semana despu[ée]s/i, 'del 25 de mayo al 20 de junio hay 26 días');
});

/**
 * Saavedra volvió a Buenos Aires en 1818, no en 1813.
 *
 * Desterrado en 1811, pasó por San Juan y Chile, y recién fue rehabilitado en
 * 1818, cuando Pueyrredón le devolvió el grado y lo nombró Jefe del Estado Mayor.
 * Cinco años de diferencia en un destierro no son un redondeo: son la mitad de
 * lo que duró.
 *
 * Fuente: Los Andes, «Los últimos años de Cornelio Saavedra».
 */
test('Saavedra vuelve a Buenos Aires en 1818', () => {
  const t = evento(49);
  assert.match(t, /1818/, 'la rehabilitación fue en 1818');
  assert.doesNotMatch(t, /Regres[óo] a Buenos Aires en 1813/i, 'volvió en 1818');
});

/**
 * Y las cuentas que el texto hace sobre sí mismo.
 *
 * Del 25 de mayo de 1810 al 9 de julio de 1816 hay seis años y **45** días
 * (seis de mayo, treinta de junio y nueve de julio). El texto decía cuarenta y
 * cuatro. Es el tipo de dato que un alumno sí verifica, porque es una resta.
 */
test('del 25 de mayo de 1810 al 9 de julio de 1816 hay seis años y 45 días', () => {
  const dias = Math.round((Date.UTC(1816, 6, 9) - Date.UTC(1816, 4, 25)) / 86400000);
  assert.equal(dias, 45, 'la cuenta de referencia cambió');
  assert.match(evento(50), /seis años y cuarenta y cinco días/i);
});

// ── Coherencia general ───────────────────────────────────────────────────────

/**
 * Y ninguna fecha del relato se sale de la ventana que el juego cubre.
 *
 * Los cincuenta eventos van del 18 de abril al 1 de noviembre de 1810, más los
 * epílogos. Una fecha de 1810 fuera de ese rango en la partida principal es un
 * evento mal ubicado en la línea de tiempo.
 */
test('los eventos de la partida principal están en orden cronológico', () => {
  const MESES = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
  const fecha = (sub) => {
    const m = sub.match(/(\d{1,2}) de (\w+) de (\d{4})/);
    return m ? Date.UTC(+m[3], MESES[m[2].toLowerCase()], +m[1]) : null;
  };
  const principales = EVENTS.filter((e) => e.id < 200).sort((a, b) => a.id - b.id);
  let anterior = null, anteriorId = null;
  for (const e of principales) {
    const f = fecha(e.subtitle);
    if (f === null) continue;
    if (anterior !== null) {
      assert.ok(f >= anterior,
        `el evento ${e.id} (${e.subtitle}) va antes que el ${anteriorId}`);
    }
    anterior = f; anteriorId = e.id;
  }
});
