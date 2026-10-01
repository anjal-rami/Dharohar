/**
 * Dharohar Progressive Web App — Service Worker (sw.js)
 * High-performance offline caching for India Living Heritage platform
 */

const CACHE_VERSION = "dharohar-v1";
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_DATA = `${CACHE_VERSION}-data`;
const CACHE_MEDIA = `${CACHE_VERSION}-media`;

// Core App Shell routes & assets to pre-cache on install
const PRECACHE_SHELL_URLS = [
  "/",
  "/explore",
  "/trails",
  "/reels",
  "/archive",
  "/assistant",
  "/preservation",
  "/quiz",
  "/manifest.json",
  "/manifest.webmanifest",
  "/dharohar-logo.svg",
  "/favicon.ico",
];

// Maximum cached media items to avoid device storage bloat
const MAX_MEDIA_ENTRIES = 75;

async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      // Remove oldest entries
      await Promise.all(
        keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key))
      );
    }
  } catch (err) {
    console.warn("[SW] Cache trimming error:", err);
  }
}

// 1. Install Event: Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_SHELL)
      .then((cache) => {
        // Individual fetch with resilient error suppression for non-critical assets
        return Promise.allSettled(
          PRECACHE_SHELL_URLS.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch((err) => {
                console.warn(`[SW] Precache skipped for ${url}:`, err.message);
              })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up stale caches & claim clients
self.addEventListener("activate", (event) => {
  const allowedCaches = [CACHE_SHELL, CACHE_DATA, CACHE_MEDIA];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!allowedCaches.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Multi-tiered caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== "GET") return;

  // CRITICAL: NEVER intercept Vite development / HMR internals
  if (
    url.pathname.includes("/@vite/") ||
    url.pathname.includes("/@id/") ||
    url.pathname.includes("/@fs/") ||
    url.pathname.includes("__vite_ping") ||
    url.search.includes("import") ||
    url.search.includes("direct") ||
    url.protocol.startsWith("chrome-extension") ||
    url.protocol.startsWith("ws")
  ) {
    return;
  }

  // A. Cache-First for 3D Models, Media, Videos, Audios & Photographs
  const isMediaAsset =
    url.pathname.match(/\.(glb|gltf|usdz|bin|mp4|webm|mp3|wav|ogg|jpg|jpeg|png|webp|svg|ico)$/i) ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.startsWith("/videos/") ||
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "audio";

  if (isMediaAsset) {
    event.respondWith(
      caches.open(CACHE_MEDIA).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            trimCache(CACHE_MEDIA, MAX_MEDIA_ENTRIES);
          }
          return networkResponse;
        } catch (fetchErr) {
          // If offline and media is not in cache, fallback if image
          if (request.destination === "image") {
            const fallbackLogo = await caches.match("/dharohar-logo.svg");
            if (fallbackLogo) return fallbackLogo;
          }
          throw fetchErr;
        }
      })
    );
    return;
  }

  // B. Stale-While-Revalidate for API & Server Functions
  const isApiOrData =
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("_serverFn") ||
    url.pathname.endsWith(".json") ||
    request.headers.get("accept")?.includes("application/json");

  if (isApiOrData) {
    event.respondWith(
      caches.open(CACHE_DATA).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            if (!cachedResponse) {
              console.warn("[SW] Offline API fetch failed:", url.pathname);
            }
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. Network-First with Cache Fallback for Navigation (HTML Pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_SHELL).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Look for requested route in cache
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;

          // Fallback to pre-cached home shell
          const rootFallback = await caches.match("/");
          if (rootFallback) return rootFallback;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Offline — Dharohar</title>
                <style>
                  body { background: #0c0a09; color: #f5f5f4; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
                  .card { background: #1c1917; border: 1px solid #292524; border-radius: 20px; padding: 32px; max-width: 440px; }
                  h1 { color: #f59e0b; margin-top: 0; font-size: 1.5rem; }
                  p { color: #a8a29e; font-size: 0.9rem; line-height: 1.5; }
                  a { display: inline-block; margin-top: 16px; background: #d97706; color: #0c0a09; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 12px; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>Field Offline Mode Active</h1>
                  <p>You are viewing Dharohar without internet connection. Pre-cached trails, 3D artifacts, and dossiers are accessible from your offline repository.</p>
                  <a href="/trails">Open Saved Trails</a>
                </div>
              </body>
            </html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // D. Stale-While-Revalidate for General Static Assets (CSS, JS, Fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_SHELL).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
