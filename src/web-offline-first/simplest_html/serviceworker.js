
console.log('Run service worker');

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/index.html",
      "/index.js",
    ]),
  );
});

self.addEventListener("activate", event => {
   console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});

