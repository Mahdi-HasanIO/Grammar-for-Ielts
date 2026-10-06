import fs from 'node:fs'
import { expect, LEGACY_PROGRESS_JSON, seedStorage, STORAGE, test, waitForApp } from './fixtures'

/* Every page in the built sitemap except /course, which is rendered in the browser only. */
const sitemap = fs.readFileSync(new URL('../../dist/sitemap.xml', import.meta.url), 'utf8')
const PRERENDERED = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
  .map((m) => m[1])
  .filter((p) => p !== '/course')

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // main.tsx logs React's recoverable hydration errors when this flag is set.
    localStorage.setItem('gfi:debug', '1')
    // Remember the server-rendered <h1> before the app script runs. Hydration keeps this exact node;
    // a fallback to client rendering replaces it.
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive') {
        ;(window as unknown as { __ssrH1: Element | null }).__ssrH1 = document.querySelector('#root h1')
      }
    })
  })
})

async function expectHydrated(page: import('@playwright/test').Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status()).toBe(200)
  const html = await response!.text()
  expect(html, 'page is prerendered').toMatch(/<div id="root"><.+<h1/s)
  await waitForApp(page)
  const kept = await page.evaluate(() => {
    const ssr = (window as unknown as { __ssrH1: Element | null }).__ssrH1
    return { hadSsrH1: Boolean(ssr), sameNode: ssr !== null && ssr === document.querySelector('#root h1') }
  })
  expect(kept).toEqual({ hadSsrH1: true, sameNode: true })
  await page.waitForTimeout(300)
}

test.describe('first visit: prerendered public pages hydrate without errors', () => {
  test('the sitemap lists the expected 35 prerendered pages', () => {
    expect(PRERENDERED).toHaveLength(35)
  })

  for (const path of PRERENDERED) {
    test(path, async ({ page, problems }) => {
      await expectHydrated(page, path)
      expect(problems.list).toEqual([])
    })
  }
})

test.describe('returning learner: saved progress and language do not break hydration', () => {
  const SAMPLE = ['/', '/grammar', '/grammar/articles', '/grammar/register-and-punctuation', '/blog/hedging-in-ielts-task-2', '/practice']

  for (const path of SAMPLE) {
    test(path, async ({ page, problems }) => {
      await seedStorage(page, {
        [STORAGE.progress]: LEGACY_PROGRESS_JSON,
        [STORAGE.lessonLanguage]: JSON.stringify('bn'),
        [STORAGE.preferences]: JSON.stringify({ theme: 'dark', dailyGoalMinutes: 30, showHints: true }),
      })
      await expectHydrated(page, path)
      expect(problems.list).toEqual([])
      // The saved dark theme is applied by the inline script before React loads.
      await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    })
  }
})

test('control: the checks above do catch a hydration mismatch', async ({ page, problems }) => {
  // Serve /grammar/articles with server HTML that no longer matches what React renders.
  await page.route('**/grammar/articles', async (route) => {
    const response = await route.fetch()
    const body = (await response.text()).replace('Articles (a, an, the)</h1>', 'Tampered heading</h1>')
    await route.fulfill({ response, body })
  })
  await page.goto('/grammar/articles')
  await waitForApp(page)
  await page.waitForTimeout(300)
  const sameNode = await page.evaluate(() => {
    const ssr = (window as unknown as { __ssrH1: Element | null }).__ssrH1
    return ssr !== null && ssr === document.querySelector('#root h1')
  })
  expect(sameNode).toBe(false)
  expect(problems.list.join('\n')).toMatch(/Hydration recovered/)
  await expect(page.locator('h1')).toHaveText('Articles (a, an, the)')
})
