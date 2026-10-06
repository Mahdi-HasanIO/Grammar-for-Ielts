import type { Bookmark, BookmarkKind } from '@/types'
import { browserLocalStore, STORAGE_KEYS, type KeyValueStore } from '@/utils/storage'
import type { BookmarkRepository } from './types'

const KINDS: readonly BookmarkKind[] = ['grammar', 'article', 'lesson']
export const MAX_BOOKMARKS = 1_000

function isBookmark(value: unknown): value is Bookmark {
  if (typeof value !== 'object' || value === null) return false
  const b = value as Record<string, unknown>
  return (
    KINDS.includes(b.kind as BookmarkKind) &&
    typeof b.path === 'string' &&
    b.path.startsWith('/') &&
    !b.path.startsWith('//') &&
    typeof b.title === 'string' &&
    typeof b.savedAt === 'string'
  )
}

/** Keeps well-formed entries only, one per path, so a damaged value never breaks the page. */
export function sanitizeBookmarks(value: unknown): Bookmark[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const result: Bookmark[] = []
  for (const item of value) {
    if (!isBookmark(item) || seen.has(item.path)) continue
    seen.add(item.path)
    result.push({ kind: item.kind, path: item.path, title: item.title, savedAt: item.savedAt })
    if (result.length >= MAX_BOOKMARKS) break
  }
  return result
}

function parse(raw: string | null): Bookmark[] {
  if (raw === null) return []
  try {
    return sanitizeBookmarks(JSON.parse(raw))
  } catch {
    return []
  }
}

/** Bookmarks in localStorage under `grammar-path:bookmarks`, as before. */
export function createLocalBookmarkRepository(store: KeyValueStore = browserLocalStore): BookmarkRepository {
  const key = STORAGE_KEYS.bookmarks
  return {
    list: () => parse(store.get(key)),
    save: (bookmarks) => store.set(key, JSON.stringify(bookmarks)),
    subscribe: (listener) => store.subscribe(key, (raw) => listener(parse(raw))),
  }
}
