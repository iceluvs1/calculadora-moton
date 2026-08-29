'use client';

import { useEffect } from 'react';

export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      const serviceWorkerUrl = new URL('./sw.js', document.baseURI);
      navigator.serviceWorker.register(serviceWorkerUrl, { scope: './' }).catch(() => {
        // La calculadora sigue funcionando en línea si el navegador bloquea el SW.
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }

    window.addEventListener('load', register, { once: true });
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
