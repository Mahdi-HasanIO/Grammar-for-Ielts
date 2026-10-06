import type { Preferences, ProgressState } from '@/types'

/**
 * Current version of the stored progress shape. Bump it together with a new
 * entry in MIGRATIONS (migrations.ts) whenever ProgressState changes shape.
 */
export const PROGRESS_SCHEMA_VERSION = 1

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  dailyGoalMinutes: 20,
  showHints: true,
}

export function createInitialState(startedAt = new Date().toISOString()): ProgressState {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    modules: {},
    attempts: [],
    activity: {},
    badges: [],
    xp: 0,
    startedAt,
  }
}
