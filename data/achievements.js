// ============================================================
// ACHIEVEMENTS
// ============================================================
const LOGROS_DEF = [
  { id: "mensajero", nombre: "🎖️ Mensajero de Confianza", desc: "Elegiste la mejor opción en al menos 8 eventos.", check: (gs) => gs.decisiones.filter(d => d.prest >= 3).length >= 8 },
  { id: "fantasma", nombre: "👻 Espía Fantasma", desc: "Completa el juego con Riesgo menor a 25.", check: (gs) => gs.riesgo < 25 && gs.gameEnded },
  { id: "legendario", nombre: "⚡ Patriota Legendario", desc: "Prestigio y Riesgo balanceados entre 80-120.", check: (gs) => gs.prestigio >= 80 && gs.prestigio <= 120 && gs.riesgo >= 40 && gs.riesgo <= 80 },
  { id: "castelli", nombre: "📢 Amigo de Castelli", desc: "Tomaste decisiones de apertura social y secularismo.", check: (gs) => gs.decisiones.filter(d => [5,24,30,34].includes(d.evento) && d.opcion === 0).length >= 2 },
  { id: "diplomatico", nombre: "🤝 Diplomático", desc: "Elegiste negociación sobre confrontación en momentos clave.", check: (gs) => gs.decisiones.filter(d => [18,25,32].includes(d.evento) && d.opcion !== 0).length >= 2 },
  { id: "puro", nombre: "🔥 Revolucionario Puro", desc: "Elegiste la opción más audaz en más de 25 eventos.", check: (gs) => gs.decisiones.filter(d => d.opcion === 0).length >= 25 },
  { id: "sobreviviente", nombre: "🛡️ Sobreviviente", desc: "Completaste el juego sin que el Riesgo superara 80.", check: (gs) => gs.gameEnded && !gs.maxRiesgoSuperado80 },
  { id: "historiador", nombre: "📚 Historiador", desc: "Consultaste el Manual Didáctico durante la partida.", check: (gs) => gs.leyoManual },
  { id: "heroe", nombre: "🌟 Héroe Civil", desc: "Terminaste con Prestigio mayor a 120.", check: (gs) => gs.prestigio > 120 && gs.gameEnded },
  { id: "educador", nombre: "🎓 Defensor de la Educación", desc: "Apoyaste la propuesta de escuelas de Belgrano.", check: (gs) => gs.decisiones.find(d => d.evento === 34 && d.opcion !== 2) != null },
  { id: "pluma", nombre: "✍️ Voz de la Gaceta", desc: "Contribuiste a la Gaceta de Buenos Aires.", check: (gs) => gs.decisiones.find(d => d.evento === 40 && d.opcion !== 2) != null },
  { id: "cabildo", nombre: "🏛️ Voz del Cabildo", desc: "Estuviste presente y activo en el Cabildo Abierto.", check: (gs) => gs.decisiones.find(d => d.evento === 13 && d.opcion !== 2) != null }
];
