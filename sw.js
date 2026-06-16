// ============================================================
// SERVICE WORKER — Revolucionarios de Mayo
// Cachea el app shell para uso offline. Subí CACHE_VERSION en
// cada release para forzar actualización del cache.
// ============================================================
const CACHE_VERSION = 'rev-mayo-v12.2';

// Archivos críticos: si falta uno, cache.addAll() falla y el SW no instala.
const APP_SHELL = [
  './index.html',
  './manifest.json',
  // CSS
  './css/base.css',
  './css/screens/splash.css',
  './css/screens/menu.css',
  './css/screens/game.css',
  './css/screens/final.css',
  './css/screens/stats.css',
  './css/screens/manual.css',
  './css/components/overlays.css',
  './css/components/notifications.css',
  './css/components/transitions.css',
  './css/components/tooltips.css',
  './css/components/modal.css',
  './css/responsive.css',
  // Vendor
  './vendor/html2canvas.min.js',
  // Data
  './data/quotes.js',
  './data/achievements.js',
  './data/events.js',
  './data/acts.js',
  './data/tooltips.js',
  './data/characters.js',
  // Engine
  './engine/debug.js',
  './engine/audio.js',
  './engine/state.js',
  './engine/ui.js',
  './engine/stats.js',
  './engine/game.js',
  './engine/sw-register.js',
  // Screens
  './screens/splash.js',
  './screens/final.js',
  './screens/manual.js'
];

// Portraits: opcionales — si falta un PNG no rompe la instalación del SW.
const PORTRAIT_SHELL = [
  './assets/portraits/belgrano.png',
  './assets/portraits/french.png',
  './assets/portraits/beruti.png',
  './assets/portraits/cisneros.png',
  './assets/portraits/castelli.png',
  './assets/portraits/moreno.png',
  './assets/portraits/saavedra.png',
  './assets/portraits/liniers.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => caches.open(CACHE_VERSION).then(cache =>
        // Best-effort: cachear portraits ignorando fallos individuales
        Promise.allSettled(
          PORTRAIT_SHELL.map(url =>
            cache.add(url).catch(() => {})
          )
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first para el app shell; red con fallback a cache para el resto.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        // Cachear respuestas válidas same-origin (no las CDN de fuentes)
        if (resp.ok && e.request.url.startsWith(self.location.origin)) {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});
