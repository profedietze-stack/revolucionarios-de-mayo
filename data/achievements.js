// ============================================================
// ACHIEVEMENTS
// ============================================================
const LOGROS_DEF = [
  { id: "mensajero",    nombre: "🎖️ Mensajero de Confianza",      desc: "Elegiste la mejor opción en al menos 5 eventos.",                   check: (gs) => gs.decisiones.filter(d => d.prest >= 3).length >= 5 },
  { id: "fantasma",    nombre: "👻 Espía Fantasma",               desc: "Completa el juego con Riesgo menor a 30.",                           check: (gs) => gs.riesgo < 30 && gs.gameEnded },
  { id: "legendario",  nombre: "⚡ Patriota Legendario",          desc: "Prestigio elevado (>80) y Riesgo controlado (<70) al mismo tiempo.",  check: (gs) => gs.prestigio >= 80 && gs.riesgo < 70 },
  { id: "castelli",    nombre: "📢 Amigo de Castelli",            desc: "Apoyaste las ideas reformistas en momentos clave.",                  check: (gs) => gs.decisiones.filter(d => [5,24,30,34].includes(d.evento) && d.opcion === 0).length >= 2 },
  { id: "diplomatico", nombre: "🤝 Diplomático",                  desc: "Elegiste negociación sobre confrontación en momentos clave.",        check: (gs) => gs.decisiones.filter(d => [18,25,32].includes(d.evento) && d.opcion !== 0).length >= 2 },
  { id: "puro",        nombre: "🔥 Revolucionario Puro",          desc: "Elegiste la opción más audaz en más de 20 eventos.",                 check: (gs) => gs.decisiones.filter(d => d.opcion === 0).length >= 20 },
  { id: "sobreviviente",nombre: "🛡️ Sobreviviente",              desc: "Completaste el juego sin que el Riesgo superara 100.",               check: (gs) => gs.gameEnded && !gs.maxRiesgoSuperado80 },
  { id: "historiador", nombre: "📚 Historiador",                  desc: "Consultaste el Manual Didáctico durante la partida.",                check: (gs) => gs.leyoManual },
  { id: "heroe",       nombre: "🌟 Héroe Civil",                  desc: "Terminaste con Prestigio mayor a 110.",                              check: (gs) => gs.prestigio > 110 && gs.gameEnded },
  { id: "educador",    nombre: "🎓 Defensor de la Educación",     desc: "Apoyaste la propuesta de escuelas de Belgrano.",                    check: (gs) => gs.decisiones.find(d => d.evento === 34 && d.opcion !== 2) != null },
  { id: "pluma",       nombre: "✍️ Voz de la Gaceta",             desc: "Contribuiste a la Gaceta de Buenos Aires.",                         check: (gs) => gs.decisiones.find(d => d.evento === 40 && d.opcion !== 2) != null },
  { id: "cabildo",     nombre: "🏛️ Voz del Cabildo",             desc: "Estuviste presente y activo en el Cabildo Abierto.",                check: (gs) => gs.decisiones.find(d => d.evento === 13 && d.opcion !== 2) != null }
];
