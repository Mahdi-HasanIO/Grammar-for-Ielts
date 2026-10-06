import fs from 'node:fs'
import type { Page } from '@playwright/test'
import { stage1Lessons } from '../../src/data/lessons/stage1'
import { stage1LessonsEn } from '../../src/data/lessons/en/stage1'
import { stage1Test } from '../../src/data/questions/stage1'
import {
  expect,
  LEGACY_PROGRESS_JSON,
  legacyProgress,
  passTest,
  readStorage,
  seedStorage,
  STORAGE,
  test,
  waitForApp,
} from './fixtures'

const intro = (lessons: { moduleId: number; intro: string }[], id: number) => lessons.find((l) => l.moduleId === id)!.intro
const DEFAULT_PREFERENCES = { theme: 'system', dailyGoalMinutes: 20, showHints: true }

async function storedJson(page: Page, key: string) {
  const raw = await readStorage(page, key)
  return raw === null ? null : JSON.parse(raw)
}

test.describe('English/Bangla lessons', () => {
  test('a new learner chooses Bangla, switches to English, and the choice persists', async ({ page, problems }) => {
    const bn = intro(stage1Lessons, 1)
    const en = intro(stage1LessonsEn, 1)

    await page.goto('/module/1')
    await waitForApp(page)
    const chooser = page.getByRole('dialog', { name: 'Choose your learning language' })
    await expect(chooser).toBeVisible()
    await chooser.getByRole('button', { name: /বাংলা/ }).click()
    await expect(chooser).toBeHidden()
    await expect(page.getByText(bn)).toBeVisible()
    expect(await storedJson(page, STORAGE.lessonLanguage)).toBe('bn')

    // The lesson page has two toggles (header and section bar); they share one store.
    await page.getByRole('radiogroup', { name: 'Lesson language' }).first().getByRole('radio', { name: 'English' }).click()
    await expect(page.getByText(en)).toBeVisible()
    await expect(page.getByText(bn)).toHaveCount(0)

    await page.reload()
    await waitForApp(page)
    await expect(page.getByText(en)).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(await storedJson(page, STORAGE.lessonLanguage)).toBe('en')
    expect(problems.list).toEqual([])
  })

  test('a public grammar page shows English by default and switches to Bangla', async ({ page, problems }) => {
    await page.goto('/grammar/sentence-structure')
    await waitForApp(page)
    await expect(page.getByText(intro(stage1LessonsEn, 1))).toBeVisible()
    await page.getByRole('radiogroup', { name: 'Lesson language' }).first().getByRole('radio', { name: 'বাংলা' }).click()
    await expect(page.getByText(intro(stage1Lessons, 1))).toBeVisible()
    expect(problems.list).toEqual([])
  })
})

test.describe('legacy progress migration (real localStorage)', () => {
  test('migrates an unversioned save in place, keeps every value, and keeps the original once', async ({ page, problems }) => {
    await seedStorage(page, { [STORAGE.progress]: LEGACY_PROGRESS_JSON, [STORAGE.lessonLanguage]: '"en"' })

    await page.goto('/module/4')
    await waitForApp(page)
    // Modules 1-3 were passed in the old save, so module 4 is open and module 5 is still locked.
    await expect(page.locator('h1')).toHaveText('Pronoun Reference')

    const stored = await storedJson(page, STORAGE.progress)
    expect(stored.schemaVersion).toBe(1)
    expect(stored.modules).toEqual(legacyProgress.modules)
    expect(stored.attempts).toEqual(legacyProgress.attempts)
    expect(stored.badges).toEqual(legacyProgress.badges)
    expect(stored.xp).toBe(legacyProgress.xp)
    expect(stored.startedAt).toBe(legacyProgress.startedAt)
    // Today's study time may be added while the page is open; earlier days must be untouched.
    expect(stored.activity).toMatchObject(legacyProgress.activity as Record<string, unknown>)
    expect(await readStorage(page, STORAGE.progressBackup)).toBe(LEGACY_PROGRESS_JSON)

    await page.goto('/module/5')
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Module 5 is locked')
    expect(problems.list).toEqual([])
  })

  test('learning continues on migrated progress and nothing earlier is lost', async ({ page, problems }) => {
    await seedStorage(page, { [STORAGE.progress]: LEGACY_PROGRESS_JSON, [STORAGE.lessonLanguage]: '"en"' })
    const questions = stage1Test.filter((q) => q.moduleId === 4)
    expect(questions).toHaveLength(10)

    await page.goto('/module/4/test')
    await waitForApp(page)
    await passTest(page, questions)
    await expect(page.locator('h1')).toHaveText('Module 4 completed')

    await page.reload()
    await waitForApp(page)
    const stored = await storedJson(page, STORAGE.progress)
    expect(stored.schemaVersion).toBe(1)
    expect(stored.modules['4']).toMatchObject({ completed: true, bestScore: 100, attempts: 2 })
    for (const id of ['1', '2', '3']) expect(stored.modules[id]).toEqual(legacyProgress.modules[id])
    expect(stored.attempts).toHaveLength(6)
    expect(stored.attempts.slice(0, 5)).toEqual(legacyProgress.attempts)
    expect(stored.xp).toBeGreaterThan(legacyProgress.xp as number)
    // The pre-migration copy is kept as it was, not overwritten by later saves.
    expect(await readStorage(page, STORAGE.progressBackup)).toBe(LEGACY_PROGRESS_JSON)

    await page.goto('/module/5')
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Sentence Boundaries & Punctuation')
    expect(problems.list).toEqual([])
  })
})

test.describe('progress export and import (Settings)', () => {
  async function importFile(page: Page, contents: string) {
    await page.locator('input[type="file"]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(contents) })
  }

  test('exports a versioned backup that imports back into an empty browser', async ({ page, problems }) => {
    await seedStorage(page, { [STORAGE.progress]: LEGACY_PROGRESS_JSON })
    await page.goto('/settings')
    await waitForApp(page)

    const downloadEvent = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export progress' }).click()
    const download = await downloadEvent
    expect(download.suggestedFilename()).toMatch(/^grammar-path-progress-\d{4}-\d{2}-\d{2}\.json$/)
    const exported = fs.readFileSync((await download.path())!, 'utf8')
    const backup = JSON.parse(exported)
    expect(backup).toMatchObject({ format: 'grammar-for-ielts/progress-backup', schemaVersion: 1, preferences: DEFAULT_PREFERENCES })
    expect(Date.parse(backup.exportedAt)).not.toBeNaN()
    expect(backup.state.modules).toEqual(legacyProgress.modules)
    expect(backup.state.attempts).toEqual(legacyProgress.attempts)

    // Start again with an empty browser profile on the same page, then import the file.
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await waitForApp(page)
    expect((await storedJson(page, STORAGE.progress)).modules).toEqual({})
    await importFile(page, exported)
    await expect(page.getByText('Progress restored from file.')).toBeVisible()
    expect((await storedJson(page, STORAGE.progress)).modules).toEqual(legacyProgress.modules)
    expect(problems.list).toEqual([])
  })

  test('imports a legacy (pre-versioning) backup and applies its preferences', async ({ page, problems }) => {
    await page.goto('/settings')
    await waitForApp(page)
    await importFile(page, JSON.stringify({ state: legacyProgress, preferences: { theme: 'dark', dailyGoalMinutes: 45, showHints: true } }))
    await expect(page.getByText('Progress restored from file.')).toBeVisible()

    const stored = await storedJson(page, STORAGE.progress)
    expect(stored).toMatchObject({ schemaVersion: 1, modules: legacyProgress.modules, xp: legacyProgress.xp })
    expect(await storedJson(page, STORAGE.preferences)).toEqual({ theme: 'dark', dailyGoalMinutes: 45, showHints: true })
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await page.goto('/module/4')
    await waitForApp(page)
    await expect(page.getByRole('dialog')).toHaveCount(1) // language chooser: this browser never picked one
    await page.getByRole('dialog').getByRole('button', { name: /English/ }).click()
    await expect(page.locator('h1')).toHaveText('Pronoun Reference')
    expect(problems.list).toEqual([])
  })

  test('rejects malformed and invalid files without changing anything', async ({ page, problems }) => {
    await seedStorage(page, { [STORAGE.progress]: LEGACY_PROGRESS_JSON })
    await page.goto('/settings')
    await waitForApp(page)
    const progressBefore = await readStorage(page, STORAGE.progress)
    const preferencesBefore = await readStorage(page, STORAGE.preferences)
    expect(JSON.parse(progressBefore!).schemaVersion).toBe(1)

    const badScore = structuredClone(legacyProgress)
    badScore.modules['1'].bestScore = 250
    const cases: [string, RegExp][] = [
      ['this is not json', /not valid JSON/],
      [JSON.stringify({ hello: 'world' }), /does not contain progress data/],
      [JSON.stringify({ state: badScore }), /The backup is damaged: modules\.1\.bestScore/],
      [JSON.stringify({ state: { ...legacyProgress, modules: {} }, preferences: { theme: 'neon' } }), /The backup is damaged: preferences\.theme/],
      [JSON.stringify({ state: { ...legacyProgress, schemaVersion: 7 } }), /newer version of the app/],
    ]
    for (const [contents, reason] of cases) {
      await importFile(page, contents)
      const message = page.getByText(/That file could not be read as a Grammar Path backup\./)
      await expect(message).toBeVisible()
      await expect(message).toHaveText(reason)
      expect(await readStorage(page, STORAGE.progress)).toBe(progressBefore)
      expect(await readStorage(page, STORAGE.preferences)).toBe(preferencesBefore)
    }

    await page.goto('/module/4')
    await waitForApp(page)
    await page.getByRole('dialog').getByRole('button', { name: /English/ }).click()
    await expect(page.locator('h1')).toHaveText('Pronoun Reference')
    expect(problems.list).toEqual([])
  })
})

test.describe('module URLs by slug', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page, { [STORAGE.lessonLanguage]: '"en"' })
  })

  for (const [from, to, heading] of [
    ['/module/clause-anatomy-and-word-order', '/module/1', 'Clause Anatomy & Word Order'],
    ['/module/sentence-structure', '/module/1', 'Clause Anatomy & Word Order'],
    ['/module/articles-and-determiners', '/module/3', 'Module 3 is locked'],
    ['/module/1', '/module/1', 'Clause Anatomy & Word Order'],
  ] as const) {
    test(`${from} → ${to}`, async ({ page, problems }) => {
      await page.goto(from)
      await waitForApp(page)
      await expect(page).toHaveURL(to)
      await expect(page.locator('h1')).toHaveText(heading)
      expect(problems.list).toEqual([])
    })
  }

  test('a slug test URL redirects to the numeric test URL', async ({ page }) => {
    await page.goto('/module/clause-anatomy-and-word-order/test')
    await waitForApp(page)
    await expect(page).toHaveURL('/module/1/test')
    await expect(page.locator('h1')).toHaveText('Clause Anatomy & Word Order')
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible()
  })

  test('an unknown module goes to the course page', async ({ page }) => {
    await page.goto('/module/not-a-module')
    await waitForApp(page)
    await expect(page).toHaveURL('/course')
  })
})

test.describe('bookmarks', () => {
  test('saved items persist across reloads and can be removed', async ({ page, problems }) => {
    await page.goto('/grammar/articles')
    await waitForApp(page)
    const save = page.getByRole('button', { name: /Articles \(a, an, the\) to bookmarks/ })
    await expect(save).toHaveAttribute('aria-pressed', 'false')
    await save.click()
    await expect(save).toHaveAttribute('aria-pressed', 'true')

    await page.goto('/blog/hedging-in-ielts-task-2')
    await waitForApp(page)
    await page.getByRole('button', { name: /to bookmarks/ }).click()

    await page.reload()
    await waitForApp(page)
    await expect(page.getByRole('button', { name: /to bookmarks/ })).toHaveAttribute('aria-pressed', 'true')

    const stored = await storedJson(page, STORAGE.bookmarks)
    expect(stored.map((b: { path: string }) => b.path)).toEqual(['/blog/hedging-in-ielts-task-2', '/grammar/articles'])

    await page.goto('/bookmarks')
    await waitForApp(page)
    await expect(page.getByRole('link', { name: 'Articles (a, an, the)' })).toBeVisible()
    await page.getByRole('button', { name: 'Remove Articles (a, an, the) from bookmarks' }).click()
    await page.reload()
    await waitForApp(page)
    await expect(page.getByRole('link', { name: 'Articles (a, an, the)' })).toHaveCount(0)
    expect((await storedJson(page, STORAGE.bookmarks)).map((b: { path: string }) => b.path)).toEqual(['/blog/hedging-in-ielts-task-2'])
    expect(problems.list).toEqual([])
  })
})
