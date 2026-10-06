import { loadStoredProgress, repairPreferences } from '@/services/progress'
import { browserLocalStore, STORAGE_KEYS, type KeyValueStore } from '@/utils/storage'
import type { ProgressRepository } from './types'

function parse(raw: string | null): unknown {
  if (raw === null) return null
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

/**
 * Progress and preferences in localStorage, under the same keys as before
 * versioning (`grammar-path:progress`, `grammar-path:preferences`; the inline
 * theme script in index.html reads the latter before React loads).
 */
export function createLocalProgressRepository(store: KeyValueStore = browserLocalStore): ProgressRepository {
  const progressKey = STORAGE_KEYS.progress
  const preferencesKey = STORAGE_KEYS.preferences

  function load(raw: string | null) {
    const parsed = parse(raw)
    const loaded = loadStoredProgress(parsed)
    // `undefined` means the stored string is not valid JSON: the app starts fresh, and the next save would overwrite it.
    const unreadable = raw !== null && parsed === undefined
    if (raw !== null && (loaded.migrated || loaded.issues.length || unreadable)) {
      // Keep the original once, so a bad migration, repair or unreadable save can be recovered by hand.
      const backupKey = `${progressKey}:before-v${loaded.state.schemaVersion}`
      if (store.get(backupKey) === null) store.set(backupKey, raw)
      if (import.meta.env?.DEV && loaded.issues.length) {
        console.warn('Stored progress needed repair:', loaded.issues)
      }
    }
    return loaded.state
  }

  return {
    loadProgress: () => load(store.get(progressKey)),
    saveProgress: (state) => store.set(progressKey, JSON.stringify(state)),
    loadPreferences: () => repairPreferences(parse(store.get(preferencesKey)) ?? {}),
    savePreferences: (preferences) => store.set(preferencesKey, JSON.stringify(preferences)),
    subscribe(listener) {
      // A removal in another tab is followed by a write from that tab, so only react to values.
      const offProgress = store.subscribe(progressKey, (raw) => {
        if (raw !== null) listener({ progress: load(raw) })
      })
      const offPreferences = store.subscribe(preferencesKey, (raw) => {
        if (raw !== null) listener({ preferences: repairPreferences(parse(raw) ?? {}) })
      })
      return () => {
        offProgress()
        offPreferences()
      }
    },
  }
}
