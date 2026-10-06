import { describe, expect, it, vi } from 'vitest'
import { createLocalBookmarkRepository, sanitizeBookmarks } from '@/repositories'
import { createBookmarkStore } from '@/hooks/useBookmarks'
import { createMemoryStore, STORAGE_KEYS } from '@/utils/storage'
import type { Bookmark } from '@/types'

const saved: Bookmark[] = [
  { kind: 'grammar', path: '/grammar/articles', title: 'Articles (a, an, the)', savedAt: '2026-09-01T10:00:00.000Z' },
  { kind: 'article', path: '/blog/hedging-in-ielts-task-2', title: 'Hedging', savedAt: '2026-09-02T10:00:00.000Z' },
  { kind: 'lesson', path: '/module/3', title: 'Module 3: Articles & Determiners', savedAt: '2026-09-03T10:00:00.000Z' },
]

describe('bookmark repository (localStorage)', () => {
  it('reads bookmarks saved before the repository existed, under the same key', () => {
    const store = createMemoryStore({ [STORAGE_KEYS.bookmarks]: JSON.stringify(saved) })
    expect(STORAGE_KEYS.bookmarks).toBe('grammar-path:bookmarks')
    expect(createLocalBookmarkRepository(store).list()).toEqual(saved)
  })

  it('drops malformed entries and duplicates instead of failing', () => {
    const messy = [
      saved[0],
      { ...saved[0], title: 'duplicate' },
      { kind: 'video', path: '/x', title: 'unknown kind', savedAt: '' },
      { kind: 'grammar', path: 'https://evil.example', title: 'absolute URL', savedAt: '' },
      { kind: 'grammar', path: '//evil.example', title: 'protocol-relative URL', savedAt: '' },
      { kind: 'grammar', path: '/grammar/tenses' },
      null,
      'string',
      saved[1],
    ]
    expect(sanitizeBookmarks(messy)).toEqual([saved[0], saved[1]])
    expect(sanitizeBookmarks({ not: 'a list' })).toEqual([])
  })

  it('treats unreadable stored JSON as no bookmarks', () => {
    const store = createMemoryStore({ [STORAGE_KEYS.bookmarks]: '[{"kind":' })
    expect(createLocalBookmarkRepository(store).list()).toEqual([])
  })

  it('saves and notifies about changes from another tab', () => {
    const store = createMemoryStore()
    const repo = createLocalBookmarkRepository(store)
    repo.save(saved)
    expect(JSON.parse(store.get(STORAGE_KEYS.bookmarks)!)).toEqual(saved)

    const listener = vi.fn()
    repo.subscribe(listener)
    store.externalSet(STORAGE_KEYS.bookmarks, JSON.stringify([saved[2]]))
    expect(listener).toHaveBeenCalledWith([saved[2]])
  })
})

describe('bookmark store used by the hook', () => {
  it('toggles, removes and persists through the repository', () => {
    const store = createMemoryStore()
    const bookmarks = createBookmarkStore(createLocalBookmarkRepository(store))

    bookmarks.toggle({ kind: 'grammar', path: '/grammar/articles', title: 'Articles' })
    bookmarks.toggle({ kind: 'article', path: '/blog/x', title: 'X' })
    expect(bookmarks.getSnapshot().map((b) => b.path)).toEqual(['/blog/x', '/grammar/articles'])

    bookmarks.toggle({ kind: 'grammar', path: '/grammar/articles', title: 'Articles' })
    expect(bookmarks.getSnapshot().map((b) => b.path)).toEqual(['/blog/x'])

    bookmarks.remove('/blog/x')
    expect(bookmarks.getSnapshot()).toEqual([])
    expect(JSON.parse(store.get(STORAGE_KEYS.bookmarks)!)).toEqual([])
  })

  it('picks up changes from another tab and tells subscribers', () => {
    const store = createMemoryStore()
    const bookmarks = createBookmarkStore(createLocalBookmarkRepository(store))
    const listener = vi.fn()
    const unsubscribe = bookmarks.subscribe(listener)
    store.externalSet(STORAGE_KEYS.bookmarks, JSON.stringify(saved))
    expect(listener).toHaveBeenCalled()
    expect(bookmarks.getSnapshot()).toEqual(saved)
    unsubscribe()
  })
})
