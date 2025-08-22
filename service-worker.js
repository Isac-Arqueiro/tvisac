self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Ativo');
});

self.addEventListener('fetch', event => {
  // Por enquanto, não faz nada.
});
