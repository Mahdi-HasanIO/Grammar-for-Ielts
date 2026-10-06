import type { ProgressState } from '@/types'
import { isRecord, repairProgressState, validateProgressState, type ValidationIssue } from './schema'
import { createInitialState, PROGRESS_SCHEMA_VERSION } from './state'

/*
 * Progress schema migrations.
 *
 * Stored progress carries `schemaVersion`. Data saved before versioning has
 * no field and counts as version 0. On load, each migration whose `from`
 * matches the data's version runs in order until the data reaches
 * PROGRESS_SCHEMA_VERSION.
 *
 * To change the shape of ProgressState:
 * 1. bump PROGRESS_SCHEMA_VERSION in state.ts;
 * 2. append a migration { from: old, to: new } below. It receives plain JSON
 *    and must not drop learner data it does not understand;
 * 3. update schema.ts for the new shape and add a fixture test for the old one.
 * Never edit or remove a released migration: old backups still go through it.
 */

type RawState = Record<string, unknown>

interface Migration {
  from: number
  to: number
  description: string
  migrate: (raw: RawState, now: string) => RawState
}

/** v0 → v1: add schemaVersion; fill in fields that very early saves may lack. */
function v0ToV1(raw: RawState, now: string): RawState {
  const modules: RawState = {}
  if (isRecord(raw.modules)) {
    for (const [key, value] of Object.entries(raw.modules)) {
      modules[key] = isRecord(value)
        ? {
            completed: false,
            lessonViewed: false,
            practiceCompleted: false,
            bestScore: 0,
            latestScore: 0,
            attempts: 0,
            ...value,
            // Older code always wrote moduleId, but derive it from the key if it is missing.
            moduleId: value.moduleId ?? Number(key),
          }
        : value
    }
  }
  const attempts = raw.attempts ?? []
  const earliestAttempt = Array.isArray(attempts)
    ? attempts
        .map((a) => (isRecord(a) && typeof a.at === 'string' ? a.at : undefined))
        .filter((at): at is string => Boolean(at))
        .sort()[0]
    : undefined

  return {
    ...raw,
    schemaVersion: 1,
    modules: raw.modules === undefined ? {} : isRecord(raw.modules) ? modules : raw.modules,
    attempts,
    activity: raw.activity ?? {},
    badges: raw.badges ?? [],
    xp: raw.xp ?? 0,
    startedAt: raw.startedAt ?? earliestAttempt ?? now,
  }
}

export const MIGRATIONS: readonly Migration[] = [
  {
    from: 0,
    to: 1,
    description: 'Add schemaVersion; fill fields missing from early saves',
    migrate: v0ToV1,
  },
]

/** 0 for unversioned data; NaN when the field exists but is not a valid version. */
export function readSchemaVersion(raw: RawState): number {
  if (raw.schemaVersion === undefined) return 0
  const v = raw.schemaVersion
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 ? v : Number.NaN
}

export type MigrationOutcome =
  | { ok: true; value: RawState; fromVersion: number }
  | { ok: false; reason: 'not-an-object' | 'invalid-version' | 'future-version' | 'no-migration'; fromVersion: number }

/** Runs the migration chain on plain JSON. Does not validate the result. */
export function runMigrations(raw: unknown, now = new Date().toISOString()): MigrationOutcome {
  if (!isRecord(raw)) return { ok: false, reason: 'not-an-object', fromVersion: Number.NaN }
  const fromVersion = readSchemaVersion(raw)
  if (Number.isNaN(fromVersion)) return { ok: false, reason: 'invalid-version', fromVersion }
  if (fromVersion > PROGRESS_SCHEMA_VERSION) return { ok: false, reason: 'future-version', fromVersion }

  let value = raw
  let version = fromVersion
  while (version < PROGRESS_SCHEMA_VERSION) {
    const step = MIGRATIONS.find((m) => m.from === version)
    if (!step) return { ok: false, reason: 'no-migration', fromVersion }
    value = step.migrate(value, now)
    version = step.to
  }
  return { ok: true, value, fromVersion }
}

export interface LoadedProgress {
  state: ProgressState
  /** Version the data had before loading (0 = unversioned, NaN = unreadable). */
  fromVersion: number
  /** True when one or more migrations ran. */
  migrated: boolean
  /** Problems that were repaired. Empty for healthy data. */
  issues: ValidationIssue[]
}

/**
 * Loads progress already stored in this browser. Never throws and never
 * discards valid learner data: it migrates, then validates, and repairs only
 * the fields that fail. Data from a newer app version keeps its unknown
 * fields so saving it back does not lose anything.
 */
export function loadStoredProgress(raw: unknown, now = new Date().toISOString()): LoadedProgress {
  if (raw === null || raw === undefined) {
    return { state: createInitialState(now), fromVersion: PROGRESS_SCHEMA_VERSION, migrated: false, issues: [] }
  }

  const outcome = runMigrations(raw, now)
  if (!outcome.ok) {
    if (outcome.reason === 'future-version' && isRecord(raw)) {
      const { value, issues } = repairProgressState({ ...raw, schemaVersion: PROGRESS_SCHEMA_VERSION }, now)
      const state = { ...raw, ...value, schemaVersion: outcome.fromVersion } as ProgressState
      return { state, fromVersion: outcome.fromVersion, migrated: false, issues }
    }
    const { value, issues } = repairProgressState(
      isRecord(raw) ? { ...raw, schemaVersion: PROGRESS_SCHEMA_VERSION } : raw,
      now,
    )
    return {
      state: value,
      fromVersion: outcome.fromVersion,
      migrated: false,
      issues: [{ path: 'schemaVersion', message: outcome.reason }, ...issues],
    }
  }

  const migrated = outcome.fromVersion !== PROGRESS_SCHEMA_VERSION
  const checked = validateProgressState(outcome.value, now)
  if (checked.ok) return { state: checked.value, fromVersion: outcome.fromVersion, migrated, issues: [] }
  const { value, issues } = repairProgressState(outcome.value, now)
  return { state: value, fromVersion: outcome.fromVersion, migrated, issues }
}
