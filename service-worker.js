const CACHE_NAME = "iptv-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js",
  "https://cdn.jsdelivr.net/npm/hls.js@latest"
];

// Instalação do SW e cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch com fallback para cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
