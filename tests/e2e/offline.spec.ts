import { test as base } from '@playwright/test'
import { stage1Lessons } from '../../src/data/lessons/stage1'
import { stage1LessonsEn } from '../../src/data/lessons/en/stage1'
import { stage1Practice, stage1Test } from '../../src/data/questions/stage1'
import { startServer } from './server.mjs'
import { expect, isolateNetwork, passTest, readStorage, STORAGE, waitForApp, watchProblems } from './fixtures'

/*
 * Offline Mode, end to end, against the real service worker and Cache Storage.
 * This test runs its own copy of the server so it can shut it down: once the
 * learner has downloaded the course, the origin is genuinely unreachable (and
 * the browser is also switched offline), and every page must come from cache.
 */

const intro = (lessons: { moduleId: number; intro: string }[], id: number) => lessons.find((l) => l.moduleId === id)!.intro

base('download for offline, then learn with no connection', async ({ browser }) => {
  base.setTimeout(180_000)
  const server = await startServer(0)
  const context = await browser.newContext({ baseURL: server.url, serviceWorkers: 'allow' })
  await isolateNetwork(context)
  const page = await context.newPage()
  const problems = watchProblems(page)

  try {
    /* ------------------------------ Online ------------------------------ */
    await page.goto('/robots.txt')
    await page.evaluate((key) => localStorage.setItem(key, '"en"'), STORAGE.lessonLanguage)

    await page.goto('/')
    await waitForApp(page)
    // main.tsx registers /sw.js on load; it claims the page once activated.
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, { timeout: 30_000 })

    await page.goto('/settings')
    await waitForApp(page)
    await page.getByRole('button', { name: 'Download for Offline' }).click()
    await expect(page.getByText('Offline Mode Ready')).toBeVisible({ timeout: 120_000 })
    const offlineState = JSON.parse((await readStorage(page, 'grammar-path:offline'))!)
    expect(offlineState).toMatchObject({ ready: true })
    expect(offlineState.files).toBeGreaterThanOrEqual(100)

    /* ------------------------------ Offline ----------------------------- */
    await server.close()
    await context.setOffline(true)

    // Grammar lesson (prerendered public page), English then Bangla.
    const grammar = await page.goto('/grammar/articles')
    expect(grammar?.ok()).toBe(true)
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Articles (a, an, the)')
    await expect(page.getByText(intro(stage1LessonsEn, 3))).toBeVisible()
    await page.getByRole('radiogroup', { name: 'Lesson language' }).first().getByRole('radio', { name: 'বাংলা' }).click()
    await expect(page.getByText(intro(stage1Lessons, 3))).toBeVisible()

    // Practice on the same page.
    const practice = stage1Practice.filter((q) => q.moduleId === 3)[0]
    if (practice.options?.length) {
      await page.locator('button[role="radio"]').filter({ has: page.getByText(practice.answer, { exact: true }) }).first().click()
    } else {
      await page.getByPlaceholder('Type your answer').first().fill(practice.answer)
    }
    await page.getByRole('button', { name: 'Check answer' }).first().click()
    await expect(page.getByText('Correct, well done!')).toBeVisible()

    // Course lesson (client-rendered app shell), still in Bangla.
    await page.goto('/module/1')
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Clause Anatomy & Word Order')
    await expect(page.getByText(intro(stage1Lessons, 1))).toBeVisible()

    // Module test: pass it offline; the result is saved locally.
    await page.goto('/module/1/test')
    await waitForApp(page)
    await passTest(page, stage1Test.filter((q) => q.moduleId === 1))
    await expect(page.locator('h1')).toHaveText('Module 1 completed')
    const progress = JSON.parse((await readStorage(page, STORAGE.progress))!)
    expect(progress).toMatchObject({ schemaVersion: 1, modules: { 1: { completed: true, bestScore: 100 } } })

    // Blog article with its cover image.
    await page.goto('/blog/hedging-in-ielts-task-2')
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Sound Academic Without Overclaiming: Hedging in IELTS Task 2')
    const cover = page.locator('article figure img')
    await expect(cover).toBeVisible()
    expect(await cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)

    // Dashboard reflects the test passed offline.
    await page.goto('/dashboard')
    await waitForApp(page)
    await expect(page.locator('h1').first()).toBeVisible()
    await page.goto('/module/2')
    await waitForApp(page)
    await expect(page.locator('h1')).toHaveText('Subject-Verb Agreement & Noun Number')

    // Being offline produces failed-request logs; anything else (exceptions, hydration recoveries) is a failure.
    const unexpected = problems.list.filter(
      (p) => !/Failed to load resource: net::ERR_(INTERNET_DISCONNECTED|CONNECTION_REFUSED|FAILED)/.test(p),
    )
    expect(unexpected).toEqual([])
  } finally {
    await context.close()
    await server.close().catch(() => {})
  }
})

base('control: without the download, an unvisited page is really unavailable offline', async ({ browser }) => {
  const server = await startServer(0)
  const context = await browser.newContext({ baseURL: server.url, serviceWorkers: 'allow' })
  await isolateNetwork(context)
  const page = await context.newPage()
  try {
    await page.goto('/')
    await waitForApp(page)
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, { timeout: 30_000 })

    await server.close()
    await context.setOffline(true)
    const response = await page.goto('/grammar/tenses')
    expect(response?.status()).toBe(503)
    await expect(page.locator('h1')).toHaveText('You are offline')
  } finally {
    await context.close()
    await server.close().catch(() => {})
  }
})
