import type { Preferences, ProgressState } from '@/types'
import { runMigrations } from './migrations'
import { isRecord, validatePreferences, validateProgressState, type ValidationIssue } from './schema'
import { PROGRESS_SCHEMA_VERSION } from './state'

/*
 * Progress backup files (Settings → Export / Import).
 *
 * Current files look like:
 *   { format, schemaVersion, exportedAt, state, preferences }
 * Files exported before versioning are { state, preferences } with no
 * version; they still import. `state` and `preferences` stay at the top
 * level so older app versions can read new files too.
 */

export const BACKUP_FORMAT = 'grammar-for-ielts/progress-backup'
/** Real backups are a few hundred KB at most. */
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024

export interface ProgressBackup {
  format: typeof BACKUP_FORMAT
  schemaVersion: number
  exportedAt: string
  state: ProgressState
  preferences: Preferences
}

export function createBackup(
  state: ProgressState,
  preferences: Preferences,
  now = new Date().toISOString(),
): ProgressBackup {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: state.schemaVersion,
    exportedAt: now,
    state,
    preferences,
  }
}

export type ParsedBackup =
  | { ok: true; state: ProgressState; preferences?: Preferences; fromVersion: number }
  | { ok: false; error: string; issues?: ValidationIssue[] }

function describe(issues: ValidationIssue[]): string {
  const first = issues[0]
  const more = issues.length > 1 ? ` (and ${issues.length - 1} more problem${issues.length > 2 ? 's' : ''})` : ''
  return `${first.path || 'file'}: ${first.message}${more}`
}

/**
 * Parses and strictly validates a backup file. Nothing is applied unless the
 * whole file is valid, so a damaged file can never half-overwrite progress.
 */
export function parseBackup(text: string, now = new Date().toISOString()): ParsedBackup {
  if (text.length > MAX_BACKUP_BYTES) return { ok: false, error: 'The file is too large to be a progress backup.' }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'The file is not valid JSON.' }
  }
  if (!isRecord(parsed) || !isRecord(parsed.state)) {
    return { ok: false, error: 'The file does not contain progress data.' }
  }
  if (parsed.format !== undefined && parsed.format !== BACKUP_FORMAT) {
    return { ok: false, error: 'The file is not a Grammar for IELTS progress backup.' }
  }

  const migrated = runMigrations(parsed.state, now)
  if (!migrated.ok) {
    return {
      ok: false,
      error:
        migrated.reason === 'future-version'
          ? `The backup was made by a newer version of the app (data version ${migrated.fromVersion}, this app reads up to ${PROGRESS_SCHEMA_VERSION}). Reload the app to update it, then import again.`
          : 'The backup has an unrecognised data version.',
    }
  }

  const state = validateProgressState(migrated.value, now)
  if (!state.ok) return { ok: false, error: `The backup is damaged: ${describe(state.issues)}.`, issues: state.issues }

  let preferences: Preferences | undefined
  if (parsed.preferences !== undefined) {
    const prefs = validatePreferences(parsed.preferences)
    if (!prefs.ok) return { ok: false, error: `The backup is damaged: ${describe(prefs.issues)}.`, issues: prefs.issues }
    preferences = prefs.value
  }

  return { ok: true, state: state.value, preferences, fromVersion: migrated.fromVersion }
}
