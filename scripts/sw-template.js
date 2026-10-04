/* Grammar for IELTS service worker. Generated at build time by scripts/postbuild.mjs. */
/* eslint-disable */
const VERSION = '__BUILD_ID__'
const SHELL = __SHELL__

const PRECACHE = 'gfi-precache-' + VERSION
const RUNTIME = 'gfi-runtime'
const FONT_CACHE = 'gfi-fonts'
const META = 'gfi-meta'
const OFFLINE_MARKER = '/__offline-enabled'
// Any client-only route is served the app shell by the host; this one is cached as the offline fallback.
const SHELL_URL = '/dashboard'
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']
const NAV_TIMEOUT_MS = 6000

async function storable(response) {
  if (!response.redirected) return response
  return new Response(await response.blob(), { status: response.status, headers: response.headers })
}

async function fetchAndCache(cache, url) {
  if (await cache.match(url)) return
  const res = await fetch(url, { cache: 'no-cache' })
  if (res.ok) await cache.put(url, await storable(res))
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE)
      await Promise.all(SHELL.map((url) => fetchAndCache(cache, url)))

      // The learner turned on Offline Mode: download this new version in full so it stays usable offline.
      const meta = await caches.open(META)
      if (await meta.match(OFFLINE_MARKER)) {
        try {
          const manifest = await (await fetch('/offline-manifest.json', { cache: 'no-store' })).json()
          await Promise.allSettled(manifest.files.map((url) => fetchAndCache(cache, url)))
          await meta.put(OFFLINE_MARKER, new Response(JSON.stringify({ version: VERSION, readyAt: new Date().toISOString() })))
        } catch (e) {
          /* Keep the shell; the learner can re-download from the app. */
        }
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => (k.startsWith('gfi-precache-') && k !== PRECACHE) || k === RUNTIME)
          .map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
}

async function fromCache(url) {
  // ignoreVary: Google Fonts responses vary on request headers, which would stop the
  // stylesheet cached during "Download for Offline" from matching the page's own request.
  return caches.match(url, { ignoreSearch: true, ignoreVary: true })
}

async function handleNavigation(request) {
  const url = new URL(request.url)
  const key = normalizePath(url.pathname)
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NAV_TIMEOUT_MS)),
    ])
    if (response.ok) {
      const copy = await storable(response.clone())
      caches.open(RUNTIME).then((cache) => cache.put(key, copy))
    }
    return response
  } catch (e) {
    const cached = await fromCache(key)
    if (cached) return cached
    // After "Download for Offline" every script is cached, so the app shell can render any route.
    // Without it, the shell could load without the page's code, so show a clear offline page instead.
    const downloaded = await (await caches.open(META)).match(OFFLINE_MARKER)
    const shell = downloaded ? await fromCache(SHELL_URL) : null
    if (shell) return shell
    return new Response(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Offline</title>' +
        '<body style="font-family:system-ui,sans-serif;padding:32px;max-width:520px;margin:auto;color:#1e293b">' +
        '<h1>You are offline</h1><p>This page has not been saved for offline use yet. Reconnect, then use ' +
        '<b>Download for Offline</b> to save the whole course on this device.</p>' +
        '<p><a href="/" style="color:#1d4ed8;font-weight:600">Go to the homepage</a></p></body>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await fromCache(request)
  // An opaque (no-cors) copy cannot answer a CORS request; fetch a proper copy instead.
  if (cached && !(cached.type === 'opaque' && request.mode === 'cors')) return cached
  const response = await fetch(request)
  if (response.ok || response.type === 'opaque') {
    const copy = response.clone()
    caches.open(cacheName).then((cache) => cache.put(request, copy))
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  if (FONT_ORIGINS.includes(url.origin)) {
    event.respondWith(cacheFirst(request, FONT_CACHE))
    return
  }
  // Everything else off-site (including the Gemini API) goes straight to the network, never cached.
  if (url.origin !== self.location.origin) return
  if (['/sw.js', '/offline-manifest.json'].includes(url.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }
  event.respondWith(cacheFirst(request, RUNTIME))
})
