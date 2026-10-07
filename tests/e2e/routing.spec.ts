import { expect, seedStorage, STORAGE, test, waitForApp } from './fixtures'

/*
 * Direct loads (refresh, bookmark, shared link) of client-only routes must get
 * the app shell. On Vercel these go through the SPA rewrite in vercel.json.
 * Regression: with cleanUrls the rewrite pointed at "/app.html", which Vercel
 * redirects to "/app" instead of serving, so every client-only route returned
 * 404 in production and the offline download failed on its /dashboard shell.
 * The test server applies the same rules (see server.mjs).
 */

const CLIENT_ROUTES = ['/dashboard', '/course', '/settings', '/bookmarks', '/review', '/progress', '/module/1', '/module/1/test', '/learn/articles']

test.describe('direct loads of client-only routes', () => {
  for (const route of CLIENT_ROUTES) {
    test(`${route} returns the app shell`, async ({ request }) => {
      const response = await request.get(route, { maxRedirects: 0 })
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/html')
      expect(await response.text()).toContain('<div id="root"></div>')
    })
  }

  test('the shell file itself is only reachable through its clean URL', async ({ request }) => {
    const html = await request.get('/app.html', { maxRedirects: 0 })
    expect(html.status()).toBe(308)
    expect(html.headers().location).toBe('/app')
    expect((await request.get('/app', { maxRedirects: 0 })).status()).toBe(200)
  })

  test('refreshing a workspace page renders it', async ({ page, problems }) => {
    await seedStorage(page, { [STORAGE.lessonLanguage]: '"en"' })
    for (const [route, heading] of [
      ['/module/1', 'Clause Anatomy & Word Order'],
      ['/settings', 'Preferences and data'],
    ] as const) {
      await page.goto(route)
      await waitForApp(page)
      await page.reload()
      await waitForApp(page)
      await expect(page.locator('h1').first()).toHaveText(heading)
    }
    expect(problems.list).toEqual([])
  })
})
