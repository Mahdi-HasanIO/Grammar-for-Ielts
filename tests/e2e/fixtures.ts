import fs from 'node:fs'
import { test as base, expect, type BrowserContext, type ConsoleMessage, type Page } from '@playwright/test'

export { expect }

/** A real pre-versioning progress save (no schemaVersion), shared with the unit tests. */
export const LEGACY_PROGRESS_JSON = fs.readFileSync(new URL('../fixtures/legacy-progress.json', import.meta.url), 'utf8')
export const legacyProgress = JSON.parse(LEGACY_PROGRESS_JSON) as Record<string, unknown> & {
  modules: Record<string, Record<string, unknown>>
  attempts: Record<string, unknown>[]
}

const isLocal = (url: URL) => url.hostname === '127.0.0.1' || url.hostname === 'localhost'

/**
 * Blocks every request that does not go to the local test server: Google
 * Fonts, the production visitor counter (Abacus), Gemini, anything else.
 * Tests must never read or write production data.
 */
export async function isolateNetwork(context: BrowserContext) {
  await context.route((url) => !isLocal(url), (route) => route.abort('blockedbyclient'))
}

export interface PageProblems {
  /** Console errors/warnings and uncaught exceptions, excluding requests we blocked on purpose. */
  list: string[]
}

/** Records everything that would indicate a broken page, including React hydration recoveries. */
export function watchProblems(page: Page): PageProblems {
  const problems: PageProblems = { list: [] }
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return
    const text = msg.text()
    const source = msg.location().url
    // Requests to external hosts are aborted by isolateNetwork(); the browser logs each one.
    if (/net::ERR_BLOCKED_BY_CLIENT/.test(text)) return
    if (source && !isLocal(new URL(source)) && /Failed to load resource/.test(text)) return
    problems.list.push(`[console.${msg.type()}] ${text}`)
  })
  page.on('pageerror', (error) => problems.list.push(`[pageerror] ${error.message}`))
  return problems
}

/** Writes localStorage on the app's origin before the app first loads. */
export async function seedStorage(page: Page, items: Record<string, string>) {
  // Any same-origin static file gives access to localStorage without running the app.
  await page.goto('/robots.txt')
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value)
  }, items)
}

export async function readStorage(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key)
}

/** Waits until React has attached to #root and lazy route content has replaced any loading skeleton. */
export async function waitForApp(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => {
    const root = document.getElementById('root')
    return Boolean(root && Object.keys(root).some((k) => k.startsWith('__reactContainer')) && !root.querySelector('[aria-busy="true"]'))
  })
}

/** Answers a module test correctly, question by question, in the order the test shows them, then submits. */
export async function passTest(page: Page, questions: { answer: string; options?: string[] }[]) {
  for (const [i, q] of questions.entries()) {
    if (q.options?.length) {
      await page.locator('button[role="radio"]').filter({ has: page.getByText(q.answer, { exact: true }) }).click()
    } else {
      await page.getByPlaceholder('Type your answer').fill(q.answer)
    }
    const last = i === questions.length - 1
    await page.getByRole('button', { name: last ? 'Submit test' : 'Next', exact: true }).click()
  }
}

export const STORAGE = {
  progress: 'grammar-path:progress',
  progressBackup: 'grammar-path:progress:before-v1',
  preferences: 'grammar-path:preferences',
  bookmarks: 'grammar-path:bookmarks',
  lessonLanguage: 'grammar-path:lessonLanguage',
} as const

// Fixture callbacks are named `provide` (Playwright calls it `use`) so lint does not mistake them for React's use().
export const test = base.extend<{ problems: PageProblems }>({
  context: async ({ context }, provide) => {
    await isolateNetwork(context)
    await provide(context)
  },
  problems: async ({ page }, provide) => {
    await provide(watchProblems(page))
  },
})
