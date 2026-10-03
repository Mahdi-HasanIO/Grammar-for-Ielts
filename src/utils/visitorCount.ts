/**
 * Site-wide visitor counter backed by Abacus (https://abacus.jasoncameron.dev),
 * a free, no-signup counter API. The app has no backend, so the count has to
 * live in an external service.
 *
 * Each browser is counted once: the first visit calls /hit (increment), every
 * later visit calls /get (read only), so refreshes don't inflate the number.
 */

const API = 'https://abacus.jasoncameron.dev'
const NAMESPACE = 'grammar-for-ielts-mahdi'
const KEY = 'visitors'
const COUNTED_FLAG = 'grammar-path:visitor-counted'
const TIMEOUT_MS = 6000

let pending: Promise<number | null> | null = null

async function request(path: 'hit' | 'get'): Promise<number | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${API}/${path}/${NAMESPACE}/${KEY}`, { signal: controller.signal })
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return typeof data.value === 'number' ? data.value : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function alreadyCounted(): boolean {
  try {
    return localStorage.getItem(COUNTED_FLAG) === '1'
  } catch {
    return false
  }
}

function markCounted(): void {
  try {
    localStorage.setItem(COUNTED_FLAG, '1')
  } catch {
    // storage unavailable: this browser may be counted again next visit
  }
}

/**
 * Returns the total visitor count, or null if the service is unreachable.
 * Shared across callers so the sidebar and dashboard make a single request.
 */
export function getVisitorCount(): Promise<number | null> {
  if (!pending) {
    pending = (async () => {
      if (alreadyCounted()) {
        const value = await request('get')
        // The key may not exist yet if this browser's first hit failed; retry as a hit.
        return value ?? (await request('hit'))
      }
      const value = await request('hit')
      if (value !== null) markCounted()
      return value
    })()
  }
  return pending
}
