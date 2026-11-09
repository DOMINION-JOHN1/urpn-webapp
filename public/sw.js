/* URPN service worker — app shell, static assets, offline fallback.
 * Authenticated pages, API responses, and streamed media are never cached.
 */

const VERSION = 'urpn-v5';
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = '/offline.html';
const CACHEABLE_PAGES = new Set(['/', '/testimony']);

const PRECACHE = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/brand/urpn-mark.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('urpn-') && !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/posters/')
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function offlineResponse() {
  const cached = await caches.match(OFFLINE_URL);
  return cached || Response.error();
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return offlineResponse();
  }
}

async function networkOnlyPage(request) {
  try {
    return await fetch(request);
  } catch {
    return offlineResponse();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API responses or media streams.
  if (url.pathname.startsWith('/api/')) return;

  // Never cache authenticated portal pages, including their HTML.
  if (url.pathname.startsWith('/portal')) {
    if (request.mode === 'navigate') {
      event.respondWith(networkOnlyPage(request));
    }
    return;
  }

  // Cache only the stable marketing pages. Verification pages contain a
  // person's name and are deliberately network-only.
  if (request.mode === 'navigate') {
    event.respondWith(
      CACHEABLE_PAGES.has(url.pathname)
        ? networkFirstPage(request)
        : networkOnlyPage(request)
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
