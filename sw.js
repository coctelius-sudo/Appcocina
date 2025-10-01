// sw.js – Service Worker para Cocina Inventario PWA

// Cambia esta versión cada vez que actualices archivos
const CACHE_NAME = 'cocina-inventario-v2'; 

// Archivos a cachear
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.webmanifest',
  // si tienes iconos u otros archivos, agrégalos aquí
];

// Instalación: cachear archivos
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando archivos');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // activa SW inmediatamente
});

// Activación: limpiar caches antiguos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando cache vieja:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // toma control inmediato
});

// Interceptar requests y responder desde cache si existe
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      return resp || fetch(evt.request);
    })
  );
});

// Mensajes para actualizar SW inmediatamente
self.addEventListener('message', (evt) => {
  if (evt.data && evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
