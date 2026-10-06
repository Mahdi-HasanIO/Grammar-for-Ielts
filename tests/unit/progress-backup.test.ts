import { describe, expect, it } from 'vitest'
import legacyFixture from '../fixtures/legacy-progress.json'
import {
  BACKUP_FORMAT,
  createBackup,
  DEFAULT_PREFERENCES,
  MAX_BACKUP_BYTES,
  parseBackup,
  PROGRESS_SCHEMA_VERSION,
} from '@/services/progress'
import type { ProgressState } from '@/types'

const NOW = '2026-10-06T12:00:00.000Z'
const currentState = () => ({ ...structuredClone(legacyFixture), schemaVersion: 1 }) as ProgressState
const prefs = { theme: 'dark' as const, dailyGoalMinutes: 30, showHints: false }

describe('export format', () => {
  it('writes format, schema version, export time, state and preferences', () => {
    const backup = createBackup(currentState(), prefs, NOW)
    expect(backup).toEqual({
      format: BACKUP_FORMAT,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      exportedAt: NOW,
      state: currentState(),
      preferences: prefs,
    })
  })

  it('keeps state and preferences at the top level, where older app versions look for them', () => {
    const json = JSON.parse(JSON.stringify(createBackup(currentState(), prefs, NOW)))
    // Older versions only checked `parsed.state.modules` and read `parsed.preferences`.
    expect(json.state.modules).toBeTypeOf('object')
    expect(json.preferences).toEqual(prefs)
  })

  it('round-trips through import without changes', () => {
    const text = JSON.stringify(createBackup(currentState(), prefs, NOW), null, 2)
    expect(parseBackup(text, NOW)).toEqual({ ok: true, state: currentState(), preferences: prefs, fromVersion: 1 })
  })
})

describe('legacy import format', () => {
  it('imports a pre-versioning { state, preferences } file and migrates it to v1', () => {
    const legacyFile = JSON.stringify({ state: legacyFixture, preferences: { theme: 'light', dailyGoalMinutes: 20, showHints: true } })
    const result = parseBackup(legacyFile, NOW)
    expect(result).toEqual({
      ok: true,
      state: { ...legacyFixture, schemaVersion: 1 },
      preferences: { theme: 'light', dailyGoalMinutes: 20, showHints: true },
      fromVersion: 0,
    })
  })

  it('imports a legacy file without preferences', () => {
    const result = parseBackup(JSON.stringify({ state: legacyFixture }), NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.preferences).toBeUndefined()
  })

  it('fills missing preference fields with defaults', () => {
    const result = parseBackup(JSON.stringify({ state: legacyFixture, preferences: { theme: 'dark' } }), NOW)
    expect(result.ok && result.preferences).toEqual({ ...DEFAULT_PREFERENCES, theme: 'dark' })
  })
})

describe('rejected files', () => {
  const rejects = (text: string, message: RegExp) => {
    const result = parseBackup(text, NOW)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(message)
    return result
  }

  it.each(['', '{', '{"state": ', 'not json at all', '<html></html>'])('rejects malformed JSON %j', (text) => {
    rejects(text, /not valid JSON/)
  })

  it.each([['null', 'null'], ['an array', '[]'], ['a number', '42'], ['no state', '{"preferences": {}}'], ['state as a string', '{"state": "x"}'], ['state as a list', '{"state": []}']])(
    'rejects %s',
    (_label, text) => {
      rejects(text, /does not contain progress data/)
    },
  )

  it('rejects another app’s file even if it has a state object', () => {
    rejects(JSON.stringify({ format: 'something-else', state: currentState() }), /not a Grammar for IELTS progress backup/)
  })

  it('rejects oversized input before parsing it', () => {
    const padding = ' '.repeat(MAX_BACKUP_BYTES)
    rejects(`${padding}${JSON.stringify({ state: legacyFixture })}`, /too large/)
  })

  it('rejects a backup from a newer app version with an explanation', () => {
    rejects(JSON.stringify({ format: BACKUP_FORMAT, state: { ...currentState(), schemaVersion: 99 } }), /newer version of the app/)
  })

  it('rejects an unreadable data version', () => {
    rejects(JSON.stringify({ state: { ...currentState(), schemaVersion: 'one' } }), /unrecognised data version/)
  })

  it.each<[string, (s: Record<string, any>) => void, string]>([
    ['a non-boolean completion flag', (s) => (s.modules['1'].completed = 'yes'), 'modules.1.completed'],
    ['an impossible score', (s) => (s.modules['1'].bestScore = 250), 'modules.1.bestScore'],
    ['a module stored under the wrong key', (s) => (s.modules['9'] = s.modules['1']), 'modules.9.moduleId'],
    ['a malformed attempt', (s) => (s.attempts[0] = { moduleId: 1 }), 'attempts.0.at'],
    ['activity that is not an object', (s) => (s.activity = 'lots'), 'activity'],
    ['negative xp', (s) => (s.xp = -1), 'xp'],
  ])('rejects state with %s, naming the problem', (_label, damage, path) => {
    const state = structuredClone(legacyFixture) as Record<string, any>
    damage(state)
    const result = rejects(JSON.stringify({ state }), /The backup is damaged/)
    if (!result.ok) {
      expect(result.issues?.map((i) => i.path)).toContain(path)
      expect(result.error).toContain(path)
    }
  })

  it.each([{ theme: 'neon' }, { dailyGoalMinutes: -5 }, { showHints: 1 }, 'dark', []])(
    'rejects invalid preferences %j',
    (preferences) => {
      rejects(JSON.stringify({ state: legacyFixture, preferences }), /The backup is damaged: preferences/)
    },
  )

  it('rejects the whole file when only the preferences are invalid, so nothing is half-applied', () => {
    const result = parseBackup(JSON.stringify({ state: legacyFixture, preferences: { theme: 'neon' } }), NOW)
    expect(result).not.toHaveProperty('state')
    expect(result.ok).toBe(false)
  })

  it('does not copy unknown fields from an imported file into state', () => {
    const result = parseBackup(JSON.stringify({ state: { ...legacyFixture, injected: { evil: true } } }), NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.state).not.toHaveProperty('injected')
  })
})
