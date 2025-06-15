const CACHE_NAME = "story-app-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/bundle.js",
  "/manifest.webmanifest",
  "/icons/download.jpg",
  "/icons/image.png",
];

// Install event: caching assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // langsung aktif
});

// Activate event: remove old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[ServiceWorker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // ambil kontrol langsung
});

// Fetch event: cache first, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          // fallback offline html jika perlu
          event.request.destination === "document"
            ? caches.match("/index.html")
            : null
        )
      );
    })
  );
});

// Push Notification support
self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Cerita Baru!";
  const options = {
    body: data.body || "Ada cerita baru dari pengguna lain.",
    icon: "./icons/download.jpg",
    vibrate: [100, 50, 100],
    tag: "story-app-push",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
