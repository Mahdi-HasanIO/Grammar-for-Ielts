import { useCallback, useSyncExternalStore } from 'react'
import type { LessonLanguage } from '@/types'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

/*
 * One shared store for the lesson language so the course page, the lesson
 * toggle and the grammar pages all stay in sync, including across tabs.
 * `null` means the learner has not chosen yet.
 */

type Stored = LessonLanguage | null

const listeners = new Set<() => void>()

function read(): Stored {
  const value = readStorage<unknown>(STORAGE_KEYS.lessonLanguage, null)
  return value === 'en' || value === 'bn' ? value : null
}

let current: Stored = read()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEYS.lessonLanguage) return
    current = read()
    emit()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useLessonLanguage() {
  const chosen = useSyncExternalStore(subscribe, () => current, () => null)

  const setLanguage = useCallback((next: LessonLanguage) => {
    current = next
    writeStorage(STORAGE_KEYS.lessonLanguage, next)
    emit()
  }, [])

  return {
    /** The learner's explicit choice, or null if they have not picked one. */
    chosen,
    /** The language to render: falls back to Bangla, the course's original language. */
    language: chosen ?? ('bn' as LessonLanguage),
    setLanguage,
  }
}
