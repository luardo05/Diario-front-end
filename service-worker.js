// service-worker.js

// O evento 'install' é disparado quando o service worker é instalado.
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado com sucesso!');
  // O skipWaiting força o service worker recém-instalado a se tornar ativo.
  self.skipWaiting();
});

// O evento 'fetch' é disparado para cada requisição feita pela página.
// Por enquanto, apenas passamos a requisição para a rede.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});