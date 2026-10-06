import type {
  DayActivity,
  ModuleProgress,
  Preferences,
  ProgressState,
  TestAttempt,
} from '@/types'
import { DEFAULT_PREFERENCES, PROGRESS_SCHEMA_VERSION } from './state'

/*
 * Runtime validation for progress data, written by hand to keep the bundle
 * small. One walker serves two modes:
 * - strict (validate*): collects every problem; the caller rejects the input.
 *   Used for imported backup files.
 * - repair (repair*): keeps everything valid, replaces or drops what is not,
 *   and reports what it changed. Used for data already in this browser, so a
 *   single bad field never wipes a learner's progress.
 * Unknown fields are never copied into state.
 */

export interface ValidationIssue {
  path: string
  message: string
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: ValidationIssue[] }

/** Upper bounds that keep a hostile or corrupt file from bloating state. */
export const PROGRESS_LIMITS = {
  modules: 1_000,
  attempts: 50_000,
  activityDays: 20_000,
  badges: 500,
  badgeIdLength: 64,
  timestampLength: 40,
} as const

type Rec = Record<string, unknown>

export const isRecord = (v: unknown): v is Rec =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/
const MODULE_KEY = /^[1-9]\d{0,5}$/

class Walker {
  readonly issues: ValidationIssue[] = []

  fail(path: string, message: string) {
    this.issues.push({ path, message })
  }

  bool(value: unknown, path: string, fallback: boolean): boolean {
    if (typeof value === 'boolean') return value
    this.fail(path, 'expected true or false')
    return fallback
  }

  num(
    value: unknown,
    path: string,
    opts: { min?: number; max?: number; int?: boolean },
    fallback: number,
  ): number {
    const { min = 0, max = Number.MAX_SAFE_INTEGER, int = false } = opts
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      this.fail(path, 'expected a number')
      return fallback
    }
    if (int && !Number.isInteger(value)) {
      this.fail(path, 'expected a whole number')
      return Math.round(value)
    }
    if (value < min || value > max) {
      this.fail(path, `expected a number from ${min} to ${max}`)
      return Math.min(max, Math.max(min, value))
    }
    return value
  }

  timestamp(value: unknown, path: string): string | undefined {
    if (
      typeof value === 'string' &&
      value.length <= PROGRESS_LIMITS.timestampLength &&
      !Number.isNaN(Date.parse(value))
    ) {
      return value
    }
    this.fail(path, 'expected an ISO date')
    return undefined
  }
}

function walkModule(w: Walker, key: string, raw: unknown): ModuleProgress | undefined {
  const path = `modules.${key}`
  if (!isRecord(raw)) {
    w.fail(path, 'expected an object')
    return undefined
  }
  const moduleId = Number(key)
  if (raw.moduleId !== moduleId) w.fail(`${path}.moduleId`, `expected ${moduleId} to match its key`)
  const score = { min: 0, max: 100 }
  const result: ModuleProgress = {
    moduleId,
    completed: w.bool(raw.completed, `${path}.completed`, false),
    lessonViewed: w.bool(raw.lessonViewed, `${path}.lessonViewed`, false),
    practiceCompleted: w.bool(raw.practiceCompleted, `${path}.practiceCompleted`, false),
    bestScore: w.num(raw.bestScore, `${path}.bestScore`, score, 0),
    latestScore: w.num(raw.latestScore, `${path}.latestScore`, score, 0),
    attempts: w.num(raw.attempts, `${path}.attempts`, { int: true }, 0),
  }
  if (raw.completedAt !== undefined) {
    const at = w.timestamp(raw.completedAt, `${path}.completedAt`)
    if (at) result.completedAt = at
  }
  return result
}

function walkAttempt(w: Walker, index: number, raw: unknown): TestAttempt | undefined {
  const path = `attempts.${index}`
  if (!isRecord(raw)) {
    w.fail(path, 'expected an object')
    return undefined
  }
  const before = w.issues.length
  const attempt: TestAttempt = {
    moduleId: w.num(raw.moduleId, `${path}.moduleId`, { min: 1, int: true }, 0),
    at: w.timestamp(raw.at, `${path}.at`) ?? '',
    score: w.num(raw.score, `${path}.score`, { int: true }, 0),
    total: w.num(raw.total, `${path}.total`, { int: true }, 0),
    percentage: w.num(raw.percentage, `${path}.percentage`, { min: 0, max: 100 }, 0),
    passed: w.bool(raw.passed, `${path}.passed`, false),
  }
  if (attempt.score > attempt.total) w.fail(`${path}.score`, 'score is greater than total')
  // An attempt is a historical record: drop it rather than invent values.
  return w.issues.length === before ? attempt : undefined
}

function walkDay(w: Walker, key: string, raw: unknown): DayActivity | undefined {
  const path = `activity.${key}`
  if (!DATE_KEY.test(key)) {
    w.fail(path, 'expected a YYYY-MM-DD key')
    return undefined
  }
  if (!isRecord(raw)) {
    w.fail(path, 'expected an object')
    return undefined
  }
  if (raw.date !== key) w.fail(`${path}.date`, `expected ${key} to match its key`)
  const count = (field: keyof DayActivity, int = true) =>
    w.num(raw[field], `${path}.${field}`, { int }, 0)
  return {
    date: key,
    // Minutes come from a timer and have always been whole, but tolerate fractions.
    minutes: count('minutes', false),
    modulesCompleted: count('modulesCompleted'),
    testsTaken: count('testsTaken'),
    questionsAnswered: count('questionsAnswered'),
    questionsCorrect: count('questionsCorrect'),
  }
}

function walkProgress(w: Walker, raw: unknown, now: string): ProgressState {
  const state: ProgressState = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    modules: {},
    attempts: [],
    activity: {},
    badges: [],
    xp: 0,
    startedAt: now,
  }
  if (!isRecord(raw)) {
    w.fail('', 'expected a progress object')
    return state
  }

  if (raw.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
    w.fail('schemaVersion', `expected version ${PROGRESS_SCHEMA_VERSION}`)
  }

  if (isRecord(raw.modules)) {
    const entries = Object.entries(raw.modules)
    if (entries.length > PROGRESS_LIMITS.modules) w.fail('modules', 'too many modules')
    for (const [key, value] of entries.slice(0, PROGRESS_LIMITS.modules)) {
      if (!MODULE_KEY.test(key)) {
        w.fail(`modules.${key}`, 'expected a numeric module id key')
        continue
      }
      const mod = walkModule(w, key, value)
      if (mod) state.modules[mod.moduleId] = mod
    }
  } else {
    w.fail('modules', 'expected an object')
  }

  if (Array.isArray(raw.attempts)) {
    if (raw.attempts.length > PROGRESS_LIMITS.attempts) w.fail('attempts', 'too many attempts')
    // Keep the most recent attempts when trimming.
    const start = Math.max(0, raw.attempts.length - PROGRESS_LIMITS.attempts)
    raw.attempts.slice(start).forEach((value, i) => {
      const attempt = walkAttempt(w, start + i, value)
      if (attempt) state.attempts.push(attempt)
    })
  } else {
    w.fail('attempts', 'expected a list')
  }

  if (isRecord(raw.activity)) {
    const entries = Object.entries(raw.activity)
    if (entries.length > PROGRESS_LIMITS.activityDays) w.fail('activity', 'too many days')
    for (const [key, value] of entries.slice(-PROGRESS_LIMITS.activityDays)) {
      const day = walkDay(w, key, value)
      if (day) state.activity[key] = day
    }
  } else {
    w.fail('activity', 'expected an object')
  }

  if (Array.isArray(raw.badges)) {
    const seen = new Set<string>()
    raw.badges.forEach((b, i) => {
      if (typeof b !== 'string' || !b || b.length > PROGRESS_LIMITS.badgeIdLength) {
        w.fail(`badges.${i}`, 'expected a badge id')
      } else if (!seen.has(b) && seen.size < PROGRESS_LIMITS.badges) {
        seen.add(b)
      }
    })
    if (raw.badges.length > PROGRESS_LIMITS.badges) w.fail('badges', 'too many badges')
    state.badges = [...seen]
  } else {
    w.fail('badges', 'expected a list')
  }

  state.xp = w.num(raw.xp, 'xp', {}, 0)
  state.startedAt = w.timestamp(raw.startedAt, 'startedAt') ?? now
  return state
}

/** Strict check of a current-version progress object. */
export function validateProgressState(
  input: unknown,
  now = new Date().toISOString(),
): ValidationResult<ProgressState> {
  const w = new Walker()
  const value = walkProgress(w, input, now)
  return w.issues.length ? { ok: false, issues: w.issues } : { ok: true, value }
}

/** Best-effort clean-up: keeps every valid field, replaces or drops the rest. */
export function repairProgressState(
  input: unknown,
  now = new Date().toISOString(),
): { value: ProgressState; issues: ValidationIssue[] } {
  const w = new Walker()
  const value = walkProgress(w, input, now)
  return { value, issues: w.issues }
}

const THEMES: readonly Preferences['theme'][] = ['light', 'dark', 'system']

function walkPreferences(w: Walker, raw: unknown): Preferences {
  const prefs = { ...DEFAULT_PREFERENCES }
  if (!isRecord(raw)) {
    w.fail('preferences', 'expected an object')
    return prefs
  }
  if (raw.theme !== undefined) {
    if (THEMES.includes(raw.theme as Preferences['theme'])) prefs.theme = raw.theme as Preferences['theme']
    else w.fail('preferences.theme', 'expected light, dark or system')
  }
  if (raw.dailyGoalMinutes !== undefined) {
    prefs.dailyGoalMinutes = w.num(
      raw.dailyGoalMinutes,
      'preferences.dailyGoalMinutes',
      { min: 1, max: 600, int: true },
      DEFAULT_PREFERENCES.dailyGoalMinutes,
    )
  }
  if (raw.showHints !== undefined) {
    prefs.showHints = w.bool(raw.showHints, 'preferences.showHints', DEFAULT_PREFERENCES.showHints)
  }
  return prefs
}

/** Strict check. Missing fields take their defaults; present fields must be valid. */
export function validatePreferences(input: unknown): ValidationResult<Preferences> {
  const w = new Walker()
  const value = walkPreferences(w, input)
  return w.issues.length ? { ok: false, issues: w.issues } : { ok: true, value }
}

export function repairPreferences(input: unknown): Preferences {
  return walkPreferences(new Walker(), input)
}
