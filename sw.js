const CACHE = "curral-agil-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./js/db.js",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ARQUIVOS))
  );

  self.skipWaiting();
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves
          .filter(chave => chave !== CACHE)
          .map(chave => caches.delete(chave))
      )
    )
  );

  self.clients.claim();
});


self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .then(resposta => resposta)
        .catch(() => caches.match("./index.html"))
    );

    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cacheado => {

        if (cacheado) {
          return cacheado;
        }

        return fetch(event.request);
      })
  );
});
