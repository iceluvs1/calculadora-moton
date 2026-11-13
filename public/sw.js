// Cambia la versión al publicar una actualización para renovar la caché de la PWA.
const CACHE_NAME = 'calculadora-moton-v20';
// Archivos básicos que se guardan al instalar el service worker.
const APP_SHELL = [
  './',
  './manifest.webmanifest',
  './logo-industrial.png',
  './favicon-industrial.png',
  './icon-industrial-192.png',
  './icon-industrial-512.png',
  './icon-industrial-maskable-512.png',
  './apple-touch-icon-industrial.png',
  './crane-background.webp',
  './mobile-crane-background.webp',
];

// Instalación: prepara los recursos básicos de esta versión.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

// Activación: retira las cachés antiguas y toma el control de las páginas abiertas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// Primero intenta descargar la versión actual; si falla la red, usa la copia guardada.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (
          response.ok &&
          new URL(request.url).origin === self.location.origin
        ) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match('./');
      }),
  );
});
