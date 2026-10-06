/** Namespaced, crash-safe localStorage helpers. */

const PREFIX = 'grammar-path:'

export const STORAGE_KEYS = {
  progress: `${PREFIX}progress`,
  preferences: `${PREFIX}preferences`,
  geminiApiKey: `${PREFIX}geminiApiKey`,
  /** 'en' | 'bn': the learner's chosen lesson language. Absent until they choose. */
  lessonLanguage: `${PREFIX}lessonLanguage`,
  /** Saved grammar topics, articles and lessons. */
  bookmarks: `${PREFIX}bookmarks`,
  /** Offline Mode: whether the learner downloaded content, and when. */
  offline: `${PREFIX}offline`,
  /** Per-module suffix: the AI practice set currently shown (sessionStorage). */
  aiSetPrefix: `${PREFIX}ai-set:`,
  /** Per-module suffix: stems of AI questions already seen, to avoid repeats. */
  aiHistoryPrefix: `${PREFIX}ai-seen:`,
} as const

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded or storage disabled - progress stays in memory */
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function clearAppStorage(): void {
  if (typeof window === 'undefined') return
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

/**
 * Minimal string key-value store with change notifications from other tabs.
 * Repositories depend on this instead of `window.localStorage`, so tests can
 * pass an in-memory store and a later IndexedDB store can slot in.
 */
export interface KeyValueStore {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  /** Called with the new raw value (null when removed) when another tab changes `key`. */
  subscribe(key: string, listener: (value: string | null) => void): () => void
}

export const browserLocalStore: KeyValueStore = {
  get(key) {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* quota exceeded or storage disabled - data stays in memory */
    }
  },
  remove(key) {
    removeStorage(key)
  },
  subscribe(key, listener) {
    if (typeof window === 'undefined') return () => {}
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener(event.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  },
}

/** In-memory store for tests and for environments without localStorage. */
export function createMemoryStore(initial: Record<string, string> = {}): KeyValueStore & {
  /** Simulates a write from another tab: updates the value and notifies subscribers. */
  externalSet(key: string, value: string | null): void
  dump(): Record<string, string>
} {
  const data = new Map(Object.entries(initial))
  const listeners = new Map<string, Set<(value: string | null) => void>>()
  return {
    get: (key) => data.get(key) ?? null,
    set: (key, value) => void data.set(key, value),
    remove: (key) => void data.delete(key),
    subscribe(key, listener) {
      const set = listeners.get(key) ?? new Set()
      set.add(listener)
      listeners.set(key, set)
      return () => set.delete(listener)
    },
    externalSet(key, value) {
      if (value === null) data.delete(key)
      else data.set(key, value)
      listeners.get(key)?.forEach((l) => l(value))
    },
    dump: () => Object.fromEntries(data),
  }
}
