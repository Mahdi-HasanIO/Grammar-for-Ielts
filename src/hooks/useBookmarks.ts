import { useCallback, useSyncExternalStore } from 'react'
import { bookmarkRepository, type BookmarkRepository } from '@/repositories'
import type { Bookmark } from '@/types'

export type { Bookmark, BookmarkKind } from '@/types'

const EMPTY: Bookmark[] = []

/**
 * Shared store over a BookmarkRepository, so every bookmark button and the
 * bookmarks page stay in sync, across tabs too.
 */
export function createBookmarkStore(repository: BookmarkRepository) {
  const listeners = new Set<() => void>()
  let current: Bookmark[] = repository.list()

  function emit() {
    listeners.forEach((l) => l())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    const unsubscribe = repository.subscribe((next) => {
      current = next
      emit()
    })
    return () => {
      listeners.delete(listener)
      unsubscribe()
    }
  }

  function save(next: Bookmark[]) {
    current = next
    repository.save(next)
    emit()
  }

  return {
    subscribe,
    getSnapshot: () => current,
    toggle(item: Omit<Bookmark, 'savedAt'>) {
      if (current.some((b) => b.path === item.path)) save(current.filter((b) => b.path !== item.path))
      else save([{ ...item, savedAt: new Date().toISOString() }, ...current])
    },
    remove(path: string) {
      save(current.filter((b) => b.path !== path))
    },
  }
}

const store = createBookmarkStore(bookmarkRepository)

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY)

  const isSaved = useCallback((path: string) => bookmarks.some((b) => b.path === path), [bookmarks])
  const toggle = useCallback((item: Omit<Bookmark, 'savedAt'>) => store.toggle(item), [])
  const remove = useCallback((path: string) => store.remove(path), [])

  return { bookmarks, isSaved, toggle, remove }
}
