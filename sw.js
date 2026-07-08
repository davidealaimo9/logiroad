const CACHE_NAME = 'logiroad-v2.2'; // <--- Ricordati di aumentare questo (v3, v4...) al prossimo cambio

// Elenco dei file da salvare per l'offline
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// FASE 1: Installazione del Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache scaricata con successo:', CACHE_NAME);
      return cache.addAll(ASSETS);
    }).then(() => {
      // FORZA L'ATTIVAZIONE IMMEDIATA: salta la sala d'attesa (Waiting phase)
      return self.skipWaiting();
    })
  );
});

// FASE 2: Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // Se trova una vecchia cache (es. logiroad-v1), la cancella
          if (key !== CACHE_NAME) {
            console.log('Rimozione vecchia cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Prende immediatamente il controllo di tutte le schede/app aperte
      return self.clients.claim();
    })
  );
});

// FASE 3: Gestione delle richieste (Funzionamento Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Se il file è in cache lo restituisce, altrimenti lo chiede a internet
      return cachedResponse || fetch(e.request);
    })
  );
});
