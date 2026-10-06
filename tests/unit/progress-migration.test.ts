import { afterEach, describe, expect, it, vi } from 'vitest'
import legacyFixture from '../fixtures/legacy-progress.json'
import {
  createInitialState,
  loadStoredProgress,
  MIGRATIONS,
  PROGRESS_LIMITS,
  PROGRESS_SCHEMA_VERSION,
  repairPreferences,
  repairProgressState,
  runMigrations,
  validatePreferences,
  validateProgressState,
  DEFAULT_PREFERENCES,
} from '@/services/progress'
import { createLocalProgressRepository } from '@/repositories'
import { createMemoryStore, STORAGE_KEYS } from '@/utils/storage'

const NOW = '2026-10-06T12:00:00.000Z'
/** A fresh deep copy of a real pre-versioning save (no schemaVersion field). */
const legacy = () => structuredClone(legacyFixture) as Record<string, unknown>

afterEach(() => {
  vi.restoreAllMocks()
})

describe('schema version', () => {
  it('is 1, with a migration chain that reaches it from unversioned data', () => {
    expect(PROGRESS_SCHEMA_VERSION).toBe(1)
    expect(MIGRATIONS.map((m) => [m.from, m.to])).toEqual([[0, 1]])
  })

  it('new learners start at the current version', () => {
    expect(createInitialState(NOW)).toEqual({
      schemaVersion: 1,
      modules: {},
      attempts: [],
      activity: {},
      badges: [],
      xp: 0,
      startedAt: NOW,
    })
  })
})

describe('legacy unversioned progress → v1', () => {
  it('adds schemaVersion and preserves every existing value exactly', () => {
    const loaded = loadStoredProgress(legacy(), NOW)
    expect(loaded.fromVersion).toBe(0)
    expect(loaded.migrated).toBe(true)
    expect(loaded.issues).toEqual([])
    expect(loaded.state).toEqual({ ...legacyFixture, schemaVersion: 1 })
  })

  it('keeps completion, scores, attempts, activity, badges, xp and start date', () => {
    const { state } = loadStoredProgress(legacy(), NOW)
    expect(Object.keys(state.modules)).toEqual(['1', '2', '3', '4'])
    expect(state.modules[3]).toMatchObject({ completed: true, bestScore: 100, completedAt: '2026-09-03T18:30:00.000Z' })
    expect(state.modules[4]).toMatchObject({ completed: false, lessonViewed: true, attempts: 1 })
    expect(state.modules[4].completedAt).toBeUndefined()
    expect(state.attempts).toHaveLength(5)
    expect(Object.keys(state.activity)).toHaveLength(4)
    expect(state.badges).toEqual(['first-module', 'flawless'])
    expect(state.xp).toBe(512)
    expect(state.startedAt).toBe('2026-08-31T19:00:00.000Z')
  })

  it('does not mutate the input', () => {
    const input = legacy()
    const before = JSON.stringify(input)
    loadStoredProgress(input, NOW)
    expect(JSON.stringify(input)).toBe(before)
  })

  it('fills fields that very early saves lack, without losing what is there', () => {
    const sparse = {
      modules: { '2': { completed: true, bestScore: 85 } },
      attempts: [{ moduleId: 2, at: '2026-08-20T10:00:00.000Z', score: 9, total: 10, percentage: 90, passed: true }],
    }
    const loaded = loadStoredProgress(sparse, NOW)
    expect(loaded.issues).toEqual([])
    expect(loaded.state.modules[2]).toEqual({
      moduleId: 2,
      completed: true,
      lessonViewed: false,
      practiceCompleted: false,
      bestScore: 85,
      latestScore: 0,
      attempts: 0,
    })
    expect(loaded.state.activity).toEqual({})
    expect(loaded.state.badges).toEqual([])
    expect(loaded.state.xp).toBe(0)
    // Without startedAt, the earliest attempt is the best estimate of when the learner started.
    expect(loaded.state.startedAt).toBe('2026-08-20T10:00:00.000Z')
  })

  it('uses the current time as start date when there is nothing better', () => {
    expect(loadStoredProgress({ modules: {} }, NOW).state.startedAt).toBe(NOW)
  })
})

describe('already-versioned progress', () => {
  it('loads v1 data unchanged and does not report a migration', () => {
    const v1 = { ...legacy(), schemaVersion: 1 }
    const loaded = loadStoredProgress(v1, NOW)
    expect(loaded.migrated).toBe(false)
    expect(loaded.fromVersion).toBe(1)
    expect(loaded.issues).toEqual([])
    expect(loaded.state).toEqual(v1)
  })

  it('migrating twice gives the same result as migrating once', () => {
    const once = loadStoredProgress(legacy(), NOW).state
    const twice = loadStoredProgress(structuredClone(once), NOW).state
    expect(twice).toEqual(once)
  })
})

describe('missing or malformed stored progress', () => {
  it.each([null, undefined])('starts fresh when nothing is stored (%s)', (raw) => {
    const loaded = loadStoredProgress(raw, NOW)
    expect(loaded.state).toEqual(createInitialState(NOW))
    expect(loaded.issues).toEqual([])
  })

  it.each([['a string', 'progress'], ['a number', 42], ['an array', [1, 2, 3]], ['true', true]])(
    'never throws for %s, and starts fresh with an issue reported',
    (_label, raw) => {
      const loaded = loadStoredProgress(raw, NOW)
      expect(loaded.state).toEqual(createInitialState(NOW))
      expect(loaded.issues.length).toBeGreaterThan(0)
    },
  )

  it('repairs one bad field without losing the rest of the learner data', () => {
    const damaged = legacy()
    const modules = damaged.modules as Record<string, Record<string, unknown>>
    modules['2'].bestScore = 'eighty'
    ;(damaged.attempts as unknown[]).push({ moduleId: 3, at: 'not a date', score: 5, total: 10, percentage: 50, passed: false })
    damaged.xp = -10

    const loaded = loadStoredProgress(damaged, NOW)
    expect(loaded.issues.map((i) => i.path).sort()).toEqual(['attempts.5.at', 'modules.2.bestScore', 'xp'])
    // The damaged field is reset; the module stays completed.
    expect(loaded.state.modules[2]).toMatchObject({ completed: true, bestScore: 0, latestScore: 80 })
    // The broken attempt is dropped; the five real ones remain.
    expect(loaded.state.attempts).toHaveLength(5)
    expect(loaded.state.xp).toBe(0)
    expect(loaded.state.modules[1]).toEqual(legacyFixture.modules['1'])
    expect(loaded.state.badges).toEqual(['first-module', 'flawless'])
  })

  it('keeps the data when the version field itself is unreadable', () => {
    const loaded = loadStoredProgress({ ...legacy(), schemaVersion: 'one' }, NOW)
    expect(loaded.issues[0]).toEqual({ path: 'schemaVersion', message: 'invalid-version' })
    expect(loaded.state.schemaVersion).toBe(1)
    expect(loaded.state.modules[3].completed).toBe(true)
    expect(loaded.state.attempts).toHaveLength(5)
  })

  it('replaces wrong container types instead of crashing', () => {
    const loaded = loadStoredProgress({ ...legacy(), modules: [], activity: 'x', badges: {} }, NOW)
    expect(loaded.state.modules).toEqual({})
    expect(loaded.state.activity).toEqual({})
    expect(loaded.state.badges).toEqual([])
    expect(loaded.state.attempts).toHaveLength(5)
  })
})

describe('data from a newer app version', () => {
  const future = () => ({ ...legacy(), schemaVersion: 2, syncCursor: 'abc123', modules: { ...legacyFixture.modules } })

  it('is not migrated by runMigrations', () => {
    expect(runMigrations(future(), NOW)).toMatchObject({ ok: false, reason: 'future-version', fromVersion: 2 })
  })

  it('keeps unknown fields and its version so saving it back loses nothing', () => {
    const loaded = loadStoredProgress(future(), NOW)
    const state = loaded.state as unknown as Record<string, unknown>
    expect(state.schemaVersion).toBe(2)
    expect(state.syncCursor).toBe('abc123')
    expect(loaded.state.modules[3].completed).toBe(true)
    expect(loaded.state.attempts).toHaveLength(5)
  })
})

describe('strict validation (used for imports)', () => {
  const valid = () => ({ ...legacy(), schemaVersion: 1 })

  it('accepts a valid current-version state', () => {
    expect(validateProgressState(valid(), NOW)).toEqual({ ok: true, value: valid() })
  })

  it.each<[string, (s: Record<string, unknown>) => void, string]>([
    ['wrong version', (s) => (s.schemaVersion = 0), 'schemaVersion'],
    ['modules not an object', (s) => (s.modules = []), 'modules'],
    ['non-numeric module key', (s) => (s.modules = { abc: legacyFixture.modules['1'] }), 'modules.abc'],
    ['moduleId not matching key', (s) => (s.modules = { '5': legacyFixture.modules['1'] }), 'modules.5.moduleId'],
    ['score above 100', (s) => ((s.modules as Record<string, Record<string, unknown>>)['1'].bestScore = 101), 'modules.1.bestScore'],
    ['boolean as string', (s) => ((s.modules as Record<string, Record<string, unknown>>)['1'].completed = 'true'), 'modules.1.completed'],
    ['attempts not a list', (s) => (s.attempts = {}), 'attempts'],
    ['score greater than total', (s) => ((s.attempts as Record<string, unknown>[])[0].score = 11), 'attempts.0.score'],
    ['bad activity key', (s) => (s.activity = { yesterday: {} }), 'activity.yesterday'],
    ['activity date mismatch', (s) => ((s.activity as Record<string, Record<string, unknown>>)['2026-09-01'].date = '2026-01-01'), 'activity.2026-09-01.date'],
    ['badge not a string', (s) => (s.badges = [1]), 'badges.0'],
    ['xp not a number', (s) => (s.xp = '512'), 'xp'],
    ['startedAt not a date', (s) => (s.startedAt = 'soon'), 'startedAt'],
  ])('rejects %s', (_label, damage, path) => {
    const input = valid()
    damage(input)
    const result = validateProgressState(input, NOW)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.issues.map((i) => i.path)).toContain(path)
  })

  it('rejects a non-object', () => {
    expect(validateProgressState('nope', NOW).ok).toBe(false)
  })
})

describe('repair mode', () => {
  it('strips unknown top-level fields from current-version data', () => {
    const { value } = repairProgressState({ ...legacy(), schemaVersion: 1, injected: '<script>' }, NOW)
    expect(value).not.toHaveProperty('injected')
  })

  it('de-duplicates badges and fixes activity dates that disagree with their key', () => {
    const input: Record<string, unknown> = { ...legacy(), schemaVersion: 1, badges: ['flawless', 'flawless', 'first-module'] }
    ;(input.activity as Record<string, Record<string, unknown>>)['2026-09-01'].date = 'wrong'
    const { value, issues } = repairProgressState(input, NOW)
    expect(value.badges).toEqual(['flawless', 'first-module'])
    expect(value.activity['2026-09-01'].date).toBe('2026-09-01')
    expect(issues.map((i) => i.path)).toContain('activity.2026-09-01.date')
  })

  it('caps oversized attempt history, keeping the most recent attempts', () => {
    const attempt = (i: number) => ({ moduleId: 1, at: new Date(Date.UTC(2026, 0, 1) + i * 60_000).toISOString(), score: 1, total: 1, percentage: 100, passed: true })
    const total = PROGRESS_LIMITS.attempts + 3
    const attempts = Array.from({ length: total }, (_, i) => attempt(i))
    const { value, issues } = repairProgressState({ ...legacy(), schemaVersion: 1, attempts }, NOW)
    expect(value.attempts).toHaveLength(PROGRESS_LIMITS.attempts)
    expect(value.attempts.at(-1)).toEqual(attempt(total - 1))
    expect(value.attempts[0]).toEqual(attempt(3))
    expect(issues.map((i) => i.path)).toContain('attempts')
  })
})

describe('preferences', () => {
  it('accepts valid and partial preferences, filling defaults', () => {
    expect(validatePreferences({ theme: 'dark', dailyGoalMinutes: 45, showHints: false })).toEqual({
      ok: true,
      value: { theme: 'dark', dailyGoalMinutes: 45, showHints: false },
    })
    expect(validatePreferences({ theme: 'light' })).toEqual({ ok: true, value: { ...DEFAULT_PREFERENCES, theme: 'light' } })
  })

  it.each([{ theme: 'purple' }, { dailyGoalMinutes: 0 }, { dailyGoalMinutes: 20.5 }, { showHints: 'yes' }, 'dark'])(
    'rejects invalid preferences %j',
    (input) => {
      expect(validatePreferences(input).ok).toBe(false)
    },
  )

  it('repairs invalid stored preferences field by field', () => {
    expect(repairPreferences({ theme: 'purple', dailyGoalMinutes: 30, showHints: 'x' })).toEqual({
      theme: 'system',
      dailyGoalMinutes: 30,
      showHints: true,
    })
    expect(repairPreferences(null)).toEqual(DEFAULT_PREFERENCES)
  })
})

describe('localStorage progress repository', () => {
  const progressKey = STORAGE_KEYS.progress
  const backupKey = `${STORAGE_KEYS.progress}:before-v1`

  it('migrates a legacy save on load and keeps the original string once', () => {
    const original = JSON.stringify(legacyFixture)
    const store = createMemoryStore({ [progressKey]: original })
    const repo = createLocalProgressRepository(store)

    const state = repo.loadProgress()
    expect(state.schemaVersion).toBe(1)
    expect(state.modules[3].completed).toBe(true)
    expect(store.get(backupKey)).toBe(original)

    // Saving writes the migrated state under the same key as before.
    repo.saveProgress(state)
    expect(JSON.parse(store.get(progressKey)!)).toEqual({ ...legacyFixture, schemaVersion: 1 })

    // A later load of migrated data does not touch the backup.
    store.set(backupKey, 'sentinel')
    expect(repo.loadProgress()).toEqual(state)
    expect(store.get(backupKey)).toBe('sentinel')
  })

  it('does not create a backup for healthy current-version data', () => {
    const store = createMemoryStore({ [progressKey]: JSON.stringify({ ...legacyFixture, schemaVersion: 1 }) })
    createLocalProgressRepository(store).loadProgress()
    expect(store.get(backupKey)).toBeNull()
  })

  it('keeps unreadable stored progress before it can be overwritten', () => {
    const corrupt = '{"modules": {"1": {"completed": tr'
    const store = createMemoryStore({ [progressKey]: corrupt })
    const state = createLocalProgressRepository(store).loadProgress()
    expect(state).toMatchObject({ schemaVersion: 1, modules: {}, attempts: [] })
    expect(store.get(backupKey)).toBe(corrupt)
  })

  it('starts fresh with no backup when nothing is stored', () => {
    const store = createMemoryStore()
    expect(createLocalProgressRepository(store).loadProgress().modules).toEqual({})
    expect(store.dump()).toEqual({})
  })

  it('reads and writes preferences under the key the inline theme script reads', () => {
    const store = createMemoryStore({ 'grammar-path:preferences': JSON.stringify({ theme: 'dark', dailyGoalMinutes: 30, showHints: true }) })
    const repo = createLocalProgressRepository(store)
    expect(repo.loadPreferences()).toEqual({ theme: 'dark', dailyGoalMinutes: 30, showHints: true })
    repo.savePreferences({ ...DEFAULT_PREFERENCES, theme: 'light' })
    expect(JSON.parse(store.get('grammar-path:preferences')!).theme).toBe('light')
  })

  it('delivers migrated progress written by another tab, and ignores removals', () => {
    const store = createMemoryStore()
    const repo = createLocalProgressRepository(store)
    const listener = vi.fn()
    const unsubscribe = repo.subscribe(listener)

    store.externalSet(progressKey, JSON.stringify(legacyFixture))
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].progress).toEqual({ ...legacyFixture, schemaVersion: 1 })

    store.externalSet(progressKey, null)
    expect(listener).toHaveBeenCalledTimes(1)

    store.externalSet('grammar-path:preferences', JSON.stringify({ theme: 'dark' }))
    expect(listener.mock.calls[1][0].preferences).toEqual({ ...DEFAULT_PREFERENCES, theme: 'dark' })

    unsubscribe()
    store.externalSet(progressKey, JSON.stringify(legacyFixture))
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
