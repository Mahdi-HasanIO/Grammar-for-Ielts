import { createLocalBookmarkRepository } from './localBookmarkRepository'
import { createLocalProgressRepository } from './localProgressRepository'
import type { BookmarkRepository, ProgressRepository } from './types'

export type { BookmarkRepository, ProgressChange, ProgressRepository } from './types'
export { createLocalProgressRepository } from './localProgressRepository'
export { createLocalBookmarkRepository, sanitizeBookmarks } from './localBookmarkRepository'

/* The app's default learner-data repositories. Today: this browser's localStorage. */
export const progressRepository: ProgressRepository = createLocalProgressRepository()
export const bookmarkRepository: BookmarkRepository = createLocalBookmarkRepository()
