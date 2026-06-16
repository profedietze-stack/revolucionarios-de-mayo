# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Juego educativo "Revolucionarios de Mayo" — elige-tu-propia-aventura sobre la Revolución de Mayo de 1810 (autor: ProfeD., uso escolar). HTML/CSS/JS vanilla, sin framework, sin build step, sin dependencias npm. PWA con service worker para uso offline en el aula.

Resultado de refactorizar un monolito de 1 archivo (263 KB) a arquitectura multi-archivo. La copia del monolito original está en `_referencia/` solo para consulta histórica — NO se carga ni edita.

## Comandos

Servidor estático local (requiere un servidor por el service worker y los `<script src>`; abrir `index.html` con `file://` NO funciona):

```bash
python -m http.server 8770 --directory .   # → http://localhost:8770/index.html
```

Validar sintaxis JS tras editar:

```bash
node --check engine/game.js                # un archivo
for f in data/*.js engine/*.js screens/*.js sw.js; do node --check "$f"; done   # todos
```

No hay tests, linter ni build. La verificación es manual en navegador (ver "Verificación").

## Arquitectura

Sin módulos ES: todos los `.js` son **scripts clásicos** que declaran globales (`const EVENTS`, `function renderEvent`, etc.). Esto es deliberado — el HTML usa `onclick="..."` que necesita funciones en el scope global. El **orden de los `<script>` en `index.html` es la dependencia**: data → engine → screens. No convertir a `type="module"` sin reescribir todos los handlers inline.

Carpetas:
- `data/` — datos puros, sin lógica. `events.js` (los 45 eventos, ~73 KB, es el grueso del contenido), `achievements.js`, `acts.js` (transiciones de acto), `quotes.js`, `tooltips.js` (diccionario término→definición histórica).
- `engine/` — `state.js` (GS global, constantes, save/load), `audio.js` (motor Web Audio API puro), `ui.js` (pantallas, tooltips, toasts), `game.js` (bucle de juego, acta final), `stats.js` (estadísticas globales), `sw-register.js`.
- `screens/` — `splash.js`, `final.js` (captura para docente), `manual.js`.
- `css/` — modular: `base.css`, `screens/*`, `components/*`, `responsive.css`. **El orden de los `<link>` en `index.html` replica el orden de cascada del CSS original** — respetarlo al añadir reglas.
- `vendor/` — `html2canvas.min.js` (local, para la captura docente offline).
- `_referencia/` — monolito original, no tocar.

### Flujo de juego (engine/game.js + engine/state.js)

`GS` (en `state.js`) es el único objeto de estado de partida: `currentEvent`, `prestigio`, `riesgo`, `logros[]`, `decisiones[]`, etc. Bucle: `renderEvent()` pinta el evento actual desde `EVENTS[currentEvent-1]` → `makeChoice()` aplica deltas de prestigio/riesgo, registra la decisión, evalúa logros y game-over → `advanceEvent()` incrementa y dispara transición de acto al cruzar ev.13→14 y ev.31→32 → al pasar de 45, `endGame()` construye el acta final.

3 actos: eventos 1–13 (Tensión), 14–31 (Revolución), 32–45 (Consolidación). Algunos eventos tienen `gameOver:true` (arresto) o un `special` overlay; el último (ev.45) fija `finalType` que ramifica el epílogo.

Dos formas de perder: una opción con `gameOver:true`, o `riesgo` llegando a `RIESGO_MAX` (150).

### Rutas alternativas (Acto II)

Al cruzar ev.13→14, `determineRuta()` asigna `GS.ruta = 'combatiente' | 'diplomático'` según decisiones audaces en eventos 5, 7, 8, 9, 12. La ruta diplomática redirige ev.22 → ev.221 en `advanceEvent()`. Los eventos de ruta alternativa tienen `id > 45` para no romper la secuencia principal.

### Sistema de personajes (data/characters.js + engine/game.js)

`CHARACTERS` (global) registra 8 personajes históricos con retratos PNG y diálogos por contexto: `{ nombre, cargo, img, dialogos: { ctxKey: ['línea1', 'línea2', ...] } }`.

Los eventos con `showCharacter: { id, ctx }` disparan un overlay de diálogo ANTES de renderizar las opciones. El overlay se muestra **una sola vez por playthrough** (tracking en `GS.seenCharacters[]`). Flujo: `renderEvent()` detecta `ev.showCharacter` → push a `seenCharacters` → `_doRenderEvent(ev)` pinta el evento → `showCharacter(id, ctx, null)` muestra el overlay encima. Las opciones ya están en el DOM cuando el jugador cierra el diálogo.

Funciones globales en `game.js`: `showCharacter(id, ctxKey, callback)`, `charDialogueNext()` (onclick del botón), `_renderCharLine()`. Retratos en `assets/portraits/` como PNG (400×500px, estilo grabado en madera).

### Estado persistente (localStorage)

- `rev_mayo_save` — partida en curso. **Formato versionado** `{version, savedAt, state}`. Leer SIEMPRE vía `migrateSave()` (en `state.js`), que también acepta el formato legacy plano. Al cambiar la forma de `GS`, subir `SAVE_VERSION` y manejar la migración ahí.
- `rev_mayo_stats` — estadísticas acumuladas entre partidas (en `engine/stats.js`).

### Logros

`LOGROS_DEF` en `data/achievements.js`: cada uno tiene `check: (gs) => bool` evaluado contra `GS` tras cada decisión. Varios checks dependen de `gs.decisiones` con `evento` (id) y `opcion` (índice 0-based de la elección) — al renumerar eventos hay que revisar estos checks y los mapeos de `buildHistoria()` en `game.js`.

### Tooltips pedagógicos

`applyTooltips(text)` (en `ui.js`) envuelve términos históricos de `TOOLTIP_DICT` en `<span class="tt">`. Usa la tabla precompilada `TOOLTIP_COMPILED` (escapes calculados una sola vez al cargar el módulo). El primer término que coincide gana; el orden de `TOOLTIP_DICT` importa.

### Audio (engine/audio.js)

IIFE `AudioEngine` con Web Audio API pura (sin librerías): música por acto, campanas FM, Himno Nacional secuenciado nota a nota, y SFX de botones. Debe inicializarse desde un gesto del usuario (`AudioEngine.init()` en el botón del splash) por las políticas de autoplay del navegador.

### Debug panel (engine/debug.js)

Activo solo con `?debug=1` en la URL (`index.html?debug=1`). No afecta jugadores normales. Provee: jump-to-event, reset de `seenCharacters`, sliders de stats en tiempo real, borrar save, ir directo al final. `console.warn` automático en `showCharacter()` si `id` o `ctx` no existe en `CHARACTERS`.

## Verificación

No hay screenshots fiables en headless (el splash llama `requestFullscreen`, que cuelga). Verificar por DOM con un servidor corriendo: simular `GS`, llamar `renderEvent()`/`makeChoice()`/`endGame()` y leer el DOM resultante. Revisar consola: no debe haber errores.

## Compatibilidad móvil / iOS Safari

- `enterFullscreenIfNeeded()` y `toggleFullscreen()` en `engine/ui.js`: usan guard `el.requestFullscreen` antes de llamar, más try/catch. iOS Safari no soporta Fullscreen API — falla silencioso.
- `localStorage` puede lanzar `SecurityError` en iOS Safari modo privado. `saveGame()` y `saveGlobalStats()` tienen try/catch. Agregar try/catch a cualquier acceso nuevo a localStorage.
- `confirm()` está bloqueado en fullscreen en Chrome/Android — usar overlays custom en su lugar (ver patrón `goToMenuFromGame()` en `ui.js` y `resetStats()` en `stats.js`).
- Elementos scrollables necesitan `-webkit-overflow-scrolling: touch` para iOS viejos (ya agregado a `.narrative-area`, `.game-sidebar`, `.overlay-character-box`).
- No usar `text-wrap: balance` — sin soporte en iOS Safari < 17.

## Edición de archivos con emojis

El contenido tiene muchos emojis (logros, UI). NUNCA usar PowerShell `Set-Content` sobre estos archivos (corrompe UTF-8). Usar la herramienta Write/Edit o Python en modo binario/UTF-8 explícito.

## Convención al añadir contenido

- **Nuevo personaje**: añadir entrada a `CHARACTERS` en `data/characters.js`; agregar retrato PNG en `assets/portraits/`; registrar el PNG en `APP_SHELL` de `sw.js`; añadir `showCharacter: { id, ctx }` al evento correspondiente en `data/events.js`.
- **Nuevo evento**: añadir objeto a `EVENTS` con `id` secuencial; ajustar el total `/45` referenciado en `engine/ui.js` y en los textos; revisar límites de acto y mapeos de logros/`buildHistoria`.
- **Nuevo archivo JS/CSS**: registrar el `<script>`/`<link>` en `index.html` en el orden correcto Y en el `APP_SHELL` de `sw.js` (y subir `CACHE_VERSION`), o no se cacheará offline.
