const CACHE_NAME = "iptv-cache-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js",
  "https://cdn.jsdelivr.net/npm/hls.js@latest",
  "https://cdn.jsdelivr.net/npm/shaka-player@latest/dist/shaka-player.compiled.min.js",
  "https://cdn.jsdelivr.net/gh/clappr/dash-shaka-playback/dist/dash-shaka-playback.min.js"
];

// Instala o service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

// Resposta ao navegador
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
