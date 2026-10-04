import { useCallback, useSyncExternalStore } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

export type BookmarkKind = 'grammar' | 'article' | 'lesson'

export interface Bookmark {
  kind: BookmarkKind
  /** Path inside the app, e.g. /grammar/articles. Doubles as the unique id. */
  path: string
  title: string
  /** ISO timestamp. */
  savedAt: string
}

/* Shared store so every bookmark button and the bookmarks page stay in sync, across tabs too. */
const EMPTY: Bookmark[] = []
const listeners = new Set<() => void>()
let current: Bookmark[] = load()

function load(): Bookmark[] {
  const value = readStorage<unknown>(STORAGE_KEYS.bookmarks, EMPTY)
  return Array.isArray(value) ? (value as Bookmark[]) : EMPTY
}

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEYS.bookmarks) return
    current = load()
    emit()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function save(next: Bookmark[]) {
  current = next
  writeStorage(STORAGE_KEYS.bookmarks, next)
  emit()
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, () => current, () => EMPTY)

  const isSaved = useCallback((path: string) => bookmarks.some((b) => b.path === path), [bookmarks])

  const toggle = useCallback((item: Omit<Bookmark, 'savedAt'>) => {
    if (current.some((b) => b.path === item.path)) save(current.filter((b) => b.path !== item.path))
    else save([{ ...item, savedAt: new Date().toISOString() }, ...current])
  }, [])

  const remove = useCallback((path: string) => save(current.filter((b) => b.path !== path)), [])

  return { bookmarks, isSaved, toggle, remove }
}
