// ============================================================
// Registro del Service Worker
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      // Check for updates on every load
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available — show notification
            showNotification('🔄 Nueva versión disponible — recargá la página');
          }
        });
      });
    }).catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}
