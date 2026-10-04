import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

/*
 * Offline Mode. "Download for Offline" copies every file the app needs (the
 * prerendered grammar and blog pages, both lesson languages, all practice and
 * test questions, scripts, styles, cover images, icons and web fonts) into
 * Cache Storage. The service worker (/sw.js) then serves them when there is
 * no connection. Names here must match scripts/sw-template.js.
 */

export const PRECACHE_PREFIX = 'gfi-precache-'
export const FONT_CACHE = 'gfi-fonts'
export const META_CACHE = 'gfi-meta'
/** Marker the service worker checks to keep offline content up to date after a new deploy. */
export const OFFLINE_MARKER = '/__offline-enabled'

export type OfflineStatus = 'idle' | 'downloading' | 'ready' | 'error' | 'unsupported'

export interface OfflineState {
  status: OfflineStatus
  done: number
  total: number
  bytes: number
  readyAt?: string
  message?: string
}

interface Persisted {
  ready: boolean
  version: string
  readyAt: string
  files: number
  bytes: number
}

interface OfflineManifest {
  version: string
  files: string[]
}

const listeners = new Set<() => void>()
const IDLE: OfflineState = { status: 'idle', done: 0, total: 0, bytes: 0 }

function initial(): OfflineState {
  const saved = readStorage<Persisted | null>(STORAGE_KEYS.offline, null)
  if (saved?.ready) return { status: 'ready', done: saved.files, total: saved.files, bytes: saved.bytes, readyAt: saved.readyAt }
  return IDLE
}

let state: OfflineState = typeof window === 'undefined' ? IDLE : initial()

function set(next: Partial<OfflineState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export const offlineStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  get: () => state,
  server: () => IDLE,
}

export function offlineSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window && 'serviceWorker' in navigator
}

/** A redirected response cannot be served for a navigation, so store a clean copy. */
async function storable(response: Response): Promise<Response> {
  if (!response.redirected) return response
  return new Response(await response.blob(), { status: response.status, headers: response.headers })
}

async function runPool<T>(items: T[], size: number, task: (item: T) => Promise<void>) {
  let i = 0
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) await task(items[i++])
  })
  await Promise.all(workers)
}

/** Web fonts come from Google Fonts; cache the stylesheet and every font file it lists. */
async function fontRequests(): Promise<string[]> {
  const link = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"][href*="fonts.googleapis.com"]')
  if (!link) return []
  try {
    const res = await fetch(link.href, { mode: 'cors' })
    if (!res.ok) return []
    const css = await res.clone().text()
    const cache = await caches.open(FONT_CACHE)
    await cache.put(link.href, res)
    return [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1]))]
  } catch {
    return []
  }
}

export async function downloadForOffline(): Promise<void> {
  if (!offlineSupported()) {
    set({ status: 'unsupported', message: 'This browser cannot store the site for offline use.' })
    return
  }
  if (!navigator.onLine) {
    set({ status: 'error', message: 'Connect to the internet to download offline content.' })
    return
  }
  set({ status: 'downloading', done: 0, total: 0, bytes: 0, message: undefined })

  try {
    // Make sure the service worker is installed so cached files can be served later.
    await navigator.serviceWorker.register('/sw.js').catch(() => undefined)

    const manifest = (await (await fetch('/offline-manifest.json', { cache: 'no-store' })).json()) as OfflineManifest
    const fonts = await fontRequests()
    const appFiles = manifest.files
    set({ total: appFiles.length + fonts.length })

    const cache = await caches.open(PRECACHE_PREFIX + manifest.version)
    const fontCache = await caches.open(FONT_CACHE)
    const failed: string[] = []
    let bytes = 0

    const fetchInto = (target: Cache, cors: boolean) => async (url: string) => {
      try {
        let res = await target.match(url)
        if (!res) {
          const fresh = await fetch(url, { cache: 'no-cache', mode: cors ? 'cors' : 'same-origin' })
          if (!fresh.ok) throw new Error(String(fresh.status))
          res = await storable(fresh)
          await target.put(url, res.clone())
        }
        bytes += Number(res.headers.get('content-length')) || 0
      } catch {
        failed.push(url)
      }
      set({ done: state.done + 1, bytes })
    }

    await runPool(appFiles, 6, fetchInto(cache, false))
    await runPool(fonts, 6, fetchInto(fontCache, true))

    // One retry for anything that failed on a flaky connection.
    if (failed.length) {
      const retry = failed.splice(0)
      await runPool(retry, 3, async (url) => {
        try {
          const res = await fetch(url, { cache: 'no-cache' })
          if (!res.ok) throw new Error(String(res.status))
          await (url.startsWith('https://fonts') ? fontCache : cache).put(url, await storable(res))
        } catch {
          failed.push(url)
        }
      })
    }
    const missingAppFiles = failed.filter((u) => !u.startsWith('https://')).length
    if (missingAppFiles) throw new Error(`${missingAppFiles} files could not be downloaded.`)

    const readyAt = new Date().toISOString()
    const meta = await caches.open(META_CACHE)
    await meta.put(OFFLINE_MARKER, new Response(JSON.stringify({ version: manifest.version, readyAt })))
    writeStorage<Persisted>(STORAGE_KEYS.offline, {
      ready: true,
      version: manifest.version,
      readyAt,
      files: state.total,
      bytes,
    })
    set({ status: 'ready', readyAt, bytes, message: undefined })
  } catch (error) {
    set({
      status: 'error',
      message: `Download did not finish. ${error instanceof Error ? error.message : ''} Check your connection and try again.`.trim(),
    })
  }
}

export async function removeOfflineData(): Promise<void> {
  if (offlineSupported()) {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k.startsWith(PRECACHE_PREFIX) || k === META_CACHE).map((k) => caches.delete(k)))
  }
  removeStorage(STORAGE_KEYS.offline)
  set({ ...IDLE })
}

/** If the browser cleared site data, stop claiming offline content is ready. */
export async function verifyOfflineData(): Promise<void> {
  if (state.status !== 'ready' || !offlineSupported()) return
  const marker = await (await caches.open(META_CACHE)).match(OFFLINE_MARKER)
  if (!marker) {
    removeStorage(STORAGE_KEYS.offline)
    set({ ...IDLE })
  }
}

/* ------------------------------ Install ------------------------------ */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let installEvent: BeforeInstallPromptEvent | null = null
const installListeners = new Set<() => void>()
const emitInstall = () => installListeners.forEach((l) => l())

/** Called once at startup so the browser's install prompt can be offered from our own button. */
export function captureInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installEvent = e as BeforeInstallPromptEvent
    emitInstall()
  })
  window.addEventListener('appinstalled', () => {
    installEvent = null
    emitInstall()
  })
}

export const installStore = {
  subscribe(listener: () => void) {
    installListeners.add(listener)
    return () => installListeners.delete(listener)
  },
  get: () => installEvent !== null,
  server: () => false,
}

export async function promptInstall(): Promise<boolean> {
  if (!installEvent) return false
  await installEvent.prompt()
  const { outcome } = await installEvent.userChoice
  installEvent = null
  emitInstall()
  return outcome === 'accepted'
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

