/** Namespaced, crash-safe localStorage helpers. */

const PREFIX = 'grammar-path:'

export const STORAGE_KEYS = {
  progress: `${PREFIX}progress`,
  preferences: `${PREFIX}preferences`,
  geminiApiKey: `${PREFIX}geminiApiKey`,
  /** 'en' | 'bn': the learner's chosen lesson language. Absent until they choose. */
  lessonLanguage: `${PREFIX}lessonLanguage`,
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
