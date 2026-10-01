/**
 * Single guarded registration point for the offline service worker.
 * Supports a `?sw=off` kill switch and iframe protections, while explicitly
 * allowing localhost:3000 / 127.0.0.1 for SIH offline demonstration.
 */
const SW_URL = "/sw.js";

function isBlockedContext(): boolean {
  if (typeof window === "undefined") return true;

  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  const { hostname, search } = window.location;
  // Explicit kill switch
  if (new URLSearchParams(search).get("sw") === "off") return true;

  // Always permit localhost / loopback for local evaluations
  if (hostname === "localhost" || hostname === "127.0.0.1") return false;

  // Blocked preview environments if needed
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;

  const blockedRoots = ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"];
  return blockedRoots.some((root) => hostname === root || hostname.endsWith(`.${root}`));
}

export async function unregisterExisting() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((reg) => (reg.active?.scriptURL ?? reg.installing?.scriptURL ?? "").endsWith(SW_URL))
      .map((reg) => reg.unregister()),
  );
}

export function registerPwaServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const register = () => {
    // Explicitly allow localhost:3000 testing for SIH offline demonstration
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        console.log("[PWA Service Worker] Registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.warn("[PWA Service Worker] Registration failed:", err);
      });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }
}

export function registerOfflineSupport() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isBlockedContext()) {
    void unregisterExisting();
    return;
  }

  // Register when page has loaded for optimal initial performance
  const onReady = () => {
    navigator.serviceWorker
      .register(SW_URL, { scope: "/" })
      .then((registration) => {
        console.log("[PWA Service Worker] Registered with scope:", registration.scope);
        // Check for worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[PWA] New Dharohar content cached and ready for offline use.");
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn("[PWA] Service worker registration notice:", err);
      });
  };

  if (document.readyState === "complete") {
    onReady();
  } else {
    window.addEventListener("load", onReady);
  }
}
