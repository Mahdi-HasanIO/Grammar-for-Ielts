/**
 * "At most once per window per key", e.g. one email per address per minute.
 *
 * In memory: correct for a single API instance only. TODO: move to a shared
 * store (a MongoDB collection with a TTL index, or Redis) before running more
 * than one instance, or each instance will allow its own email per window.
 */
export interface Cooldown {
  /** True if the key was not cooling down; it then starts cooling down. False while it still is. */
  tryStart(key: string): boolean
}

export const EMAIL_COOLDOWN_MS = 60_000

export function createMemoryCooldown({
  windowMs = EMAIL_COOLDOWN_MS,
  now = () => new Date(),
  maxEntries = 100_000,
}: { windowMs?: number; now?: () => Date; maxEntries?: number } = {}): Cooldown {
  /** key -> time the cooldown ends (ms). Insertion order is roughly expiry order. */
  const until = new Map<string, number>()

  function prune(at: number): void {
    for (const [key, end] of until) {
      if (end > at && until.size <= maxEntries) break
      until.delete(key)
    }
  }

  return {
    tryStart(key) {
      const at = now().getTime()
      prune(at)
      const end = until.get(key)
      if (end !== undefined && end > at) return false
      until.delete(key)
      until.set(key, at + windowMs)
      return true
    },
  }
}
