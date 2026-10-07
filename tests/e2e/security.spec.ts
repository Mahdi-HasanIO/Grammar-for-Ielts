import type { Page } from '@playwright/test'
import { expect, seedStorage, STORAGE, test, waitForApp } from './fixtures'

/*
 * The local test server sends the headers from vercel.json, so every browser
 * test already runs under the production Content-Security-Policy. These tests
 * check the headers themselves, and that the CSP allows the external
 * services the app needs. Those services are answered by local mocks: a mock
 * that receives a request proves the CSP let it through, because the browser
 * enforces CSP before any network request is made. Nothing leaves this machine.
 */

const REQUIRED_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'x-frame-options',
]

/** Collects CSP violations reported by the page. */
async function watchCsp(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __csp: string[] }
    w.__csp = []
    document.addEventListener('securitypolicyviolation', (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`))
  })
  return () => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)
}

test('every kind of response carries the security headers', async ({ page }) => {
  await page.goto('/')
  const assets = await page.evaluate(() => [...document.querySelectorAll('script[src^="/assets/"]')].map((s) => s.getAttribute('src')!))
  for (const path of ['/', '/grammar/articles', '/blog/hedging-in-ielts-task-2', '/dashboard', '/sw.js', '/manifest.webmanifest', assets[0]]) {
    const response = await page.request.get(path)
    expect(response.status(), path).toBe(200)
    const headers = response.headers()
    for (const name of REQUIRED_HEADERS) expect(headers[name], `${path} ${name}`).toBeTruthy()
  }
})

test('no CSP violations across public pages, the app shell and Settings', async ({ page, problems }) => {
  const violations = await watchCsp(page)
  for (const path of ['/', '/grammar/articles', '/blog/hedging-in-ielts-task-2', '/practice', '/course', '/dashboard', '/settings']) {
    await page.goto(path)
    await waitForApp(page)
    expect(await violations(), path).toEqual([])
  }
  // The inline theme script ran (allowed by its hash): it adds the `js` class before React loads.
  await expect(page.locator('html')).toHaveClass(/\bjs\b/)
  expect(problems.list).toEqual([])
})

test('the CSP allows Google Fonts and the visitor counter', async ({ page }) => {
  const violations = await watchCsp(page)
  const reached: string[] = []
  await page.route('https://fonts.googleapis.com/**', async (route) => {
    reached.push('fonts.googleapis.com')
    await route.fulfill({ contentType: 'text/css', body: 'body{}' })
  })
  await page.route('https://abacus.jasoncameron.dev/**', async (route) => {
    reached.push('abacus.jasoncameron.dev')
    await route.fulfill({ contentType: 'application/json', body: '{"value":1234}' })
  })

  await page.goto('/dashboard')
  await waitForApp(page)
  // The count also appears in the mobile drawer, which is hidden at desktop width.
  await expect(page.getByText('1,234').filter({ visible: true }).first()).toBeVisible()
  expect(reached).toContain('fonts.googleapis.com')
  expect(reached).toContain('abacus.jasoncameron.dev')
  expect(await violations()).toEqual([])
})

test('the CSP allows AI practice requests to Gemini', async ({ page }) => {
  const violations = await watchCsp(page)
  const reached: string[] = []
  // A placeholder key: requests go only to the mock below, never to Google.
  await page.route('https://generativelanguage.googleapis.com/**', async (route) => {
    reached.push(new URL(route.request().url()).pathname)
    await route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":{"code":403,"message":"mock"}}' })
  })
  await seedStorage(page, { [STORAGE.geminiApiKey]: JSON.stringify('test-key-not-real'), [STORAGE.lessonLanguage]: '"en"' })

  await page.goto('/module/1')
  await waitForApp(page)
  await page.getByRole('button', { name: /Generate AI Practice Questions|Generate a fresh set/ }).first().click()
  await expect.poll(() => reached.length).toBeGreaterThan(0)
  expect(reached[0]).toMatch(/^\/v1(beta)?\/models/)
  expect(await violations()).toEqual([])
})
