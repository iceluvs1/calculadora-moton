import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Home from '../app/page';
import '../app/globals.css';

// Entrada de la versión estática para GitHub Pages: monta la app en index.html.
// Los estilos y las calculadoras se comparten con la versión Next/Vinext.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);

// El service worker permite recuperar archivos guardados cuando no hay conexión.
// La ruta relativa mantiene la PWA dentro de /calculadora-moton/.
if ('serviceWorker' in navigator) {
  window.addEventListener(
    'load',
    () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
        // La calculadora sigue disponible en línea si el SW no puede registrarse.
      });
    },
    { once: true },
  );
}
