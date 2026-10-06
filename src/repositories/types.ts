import type { Bookmark, Preferences, ProgressState } from '@/types'

/*
 * Learner-data repositories. UI code depends on these interfaces, never on
 * localStorage directly.
 *
 * Reads are synchronous on purpose: the app is local-first. The UI always
 * renders from the copy on this device, so it works offline and never waits
 * on the network. Cloud sync (Phase 3) will be a repository that wraps the
 * local one: same reads, plus an outbox that pushes saves to the server and
 * calls subscribers when remote changes arrive.
 */

export interface ProgressChange {
  progress?: ProgressState
  preferences?: Preferences
}

export interface ProgressRepository {
  /** Current progress, already migrated to the latest schema version. */
  loadProgress(): ProgressState
  saveProgress(state: ProgressState): void
  loadPreferences(): Preferences
  savePreferences(preferences: Preferences): void
  /** Notifies about changes made elsewhere (another tab today, another device later). */
  subscribe(listener: (change: ProgressChange) => void): () => void
}

export interface BookmarkRepository {
  /** Newest first. */
  list(): Bookmark[]
  save(bookmarks: Bookmark[]): void
  subscribe(listener: (bookmarks: Bookmark[]) => void): () => void
}
