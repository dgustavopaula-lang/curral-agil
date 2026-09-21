const CACHE = "curral-agil-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./js/db.js",
  "./manifest.webmanifest"
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

  event.respondWith(

    caches.match(event.request)
      .then(resposta =>
        resposta || fetch(event.request)
      )

  );

});
