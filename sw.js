// ============================================================
// SERVICE WORKER — Revolucionarios de Mayo
// Estrategia: Cache-first para assets, Network-first para nada
// (el juego es un solo archivo HTML + fuentes externas)
// ============================================================

const CACHE_NAME = 'rev-mayo-v1';

// Recursos a pre-cachear en la instalación
const PRECACHE = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap',
];

// ── Install: pre-cachear el HTML principal ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache el HTML principal. Las fuentes se cachean on-demand (fetch handler).
      return cache.addAll(['./index.html', './']);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches viejos ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-first para todo ───────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo interceptar GET
  if (event.request.method !== 'GET') return;

  // Ignorar requests de chrome-extension y similares
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // No en caché: fetch y guardar
      return fetch(event.request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // No cachear requests de analytics o third-party no-cors que fallen
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, cloned);
        });

        return response;
      }).catch(() => {
        // Sin red y sin caché: para HTML, devolver index.html cacheado
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        // Para fuentes: devolver respuesta vacía (el juego funciona sin ellas)
        return new Response('', { status: 503 });
      });
    })
  );
});
