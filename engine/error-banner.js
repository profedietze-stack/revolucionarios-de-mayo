// ============================================================
// ERROR BANNER — diagnóstico on-device para testing
// Captura errores JS no manejados y los muestra en pantalla.
// Útil en móvil donde no hay DevTools.
// ============================================================
function initErrorBanner() {
  function showBanner(msg, src, line, col, stack) {
    const existing = document.getElementById('_err_banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = '_err_banner';
    Object.assign(banner.style, {
      position: 'fixed', top: '0', left: '0', right: '0',
      zIndex: '99999',
      background: '#7a0000',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '13px',
      padding: '10px 40px 10px 14px',
      lineHeight: '1.5',
      boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
      cursor: 'pointer',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    });

    const loc = src ? src.split('/').pop() + (line ? ':' + line : '') + (col ? ':' + col : '') : '';
    const stackTop = stack ? stack.split('\n').slice(0, 3).join('\n') : '';
    const text = [msg, loc, stackTop].filter(Boolean).join('\n');

    banner.textContent = '⚠ ERROR JS\n' + text;
    banner.title = 'Toca para copiar al portapapeles';

    banner.addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(text).catch(() => {});
    });

    const close = document.createElement('span');
    Object.assign(close.style, {
      position: 'absolute', top: '8px', right: '12px',
      fontSize: '18px', lineHeight: '1', cursor: 'pointer', opacity: '0.8',
    });
    close.textContent = '✕';
    close.addEventListener('click', (e) => { e.stopPropagation(); banner.remove(); });
    banner.appendChild(close);

    document.body.appendChild(banner);
  }

  window.addEventListener('error', (e) => {
    showBanner(e.message, e.filename, e.lineno, e.colno,
      e.error && e.error.stack ? e.error.stack : null);
  });

  window.addEventListener('unhandledrejection', (e) => {
    const err = e.reason;
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : null;
    showBanner('Promise rechazada: ' + msg, null, null, null, stack);
  });
}

initErrorBanner();
