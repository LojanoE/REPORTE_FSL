// Service Worker para funcionalidad offline de Finca San Luis
const CACHE_NAME = 'finca-san-luis-v3';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './html2canvas.min.js',
  './jspdf.umd.min.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Devolver respuesta desde cache o hacer fetch
        if (response) {
          return response;
        }
        return fetch(event.request).catch(function() {
          // Si es una página HTML, devolver index.html para que funcione el enrutamiento
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      }
    )
  );
});