import { MODULES, STAGES } from '../../src/data/modules'
import { BLOG_POSTS } from '../../src/data/blog/posts'
import { expect, test, waitForApp } from './fixtures'

/*
 * The public pages read content through ContentService. These checks cover
 * what the hydration tests cannot: that the client-side behaviour built on
 * that content (filters, search, links, related posts) still works.
 */

const FEATURED = ['articles', 'tenses', 'subject-verb-agreement', 'conditionals', 'relative-clauses', 'nominalization']
const hrefs = (locator: import('@playwright/test').Locator) => locator.evaluateAll((els) => els.map((e) => e.getAttribute('href')))

test('Home: featured topics, topic ticker, latest posts and course overview', async ({ page, problems }) => {
  await page.goto('/')
  await waitForApp(page)

  const featured = page.locator('section', { has: page.getByRole('heading', { name: 'Browse any topic, any time' }) }).locator('a.glow-card')
  expect(await hrefs(featured)).toEqual(FEATURED.map((s) => `/grammar/${s}`))

  // The ticker repeats its list once for the scrolling effect; the copy is hidden from assistive tech.
  const ticker = page.locator('a[href^="/grammar/"]:not([aria-hidden])').filter({ hasNot: page.locator('h3') })
  const tickerLinks = new Set(await hrefs(ticker))
  expect(tickerLinks.size).toBeGreaterThanOrEqual(24)

  for (const stage of STAGES) {
    const modules = MODULES.filter((m) => m.stage === stage.id)
    await expect(page.getByText(`Modules ${modules[0].id}-${modules[modules.length - 1].id} · ${modules.length} lessons`)).toBeVisible()
  }

  const latest = page.locator('section', { has: page.getByRole('heading', { name: 'Grammar advice for IELTS writers' }) })
  await expect(latest.locator('a[href="/blog/common-grammar-mistakes-in-ielts"]').first()).toBeVisible()
  expect(new Set(await hrefs(latest.locator('a[href^="/blog/"]'))).size).toBe(4)
  expect(problems.list).toEqual([])
})

test('GrammarIndex: stage filter, stage description and search', async ({ page, problems }) => {
  await page.goto('/grammar')
  await waitForApp(page)
  const cards = page.locator('main a.glow-card')
  await expect(cards).toHaveCount(24)

  const filters = page.getByRole('group', { name: 'Filter by stage' })
  await filters.getByRole('button', { name: STAGES[0].name }).click()
  await expect(page).toHaveURL('/grammar?stage=1')
  await expect(cards).toHaveCount(MODULES.filter((m) => m.stage === 1).length)
  await expect(page.getByText('Build error-free sentences.')).toBeVisible()
  const articles = page.locator('a.glow-card[href="/grammar/articles"]')
  await expect(articles).toContainText('Stage 1 · Foundation')
  await expect(articles).toContainText('Intermediate')

  await filters.getByRole('button', { name: 'All topics' }).click()
  // Wait for the reset to land before typing, as a person would. (GrammarIndex builds each URL update from the
  // params of the last render, so input in the same frame as the click would re-apply the old stage.)
  await expect(page).toHaveURL('/grammar')
  await expect(cards).toHaveCount(24)
  // Search covers names, descriptions, module titles and topic chips: "passive" is also a point in Information Structure.
  await page.getByPlaceholder('Search topics, e.g. passive').fill('passive')
  await expect(cards).toHaveCount(2)
  expect(await hrefs(cards)).toEqual(['/grammar/passive-voice', '/grammar/information-structure'])

  // A filtered URL opened directly applies after hydration.
  await page.goto('/grammar?stage=3')
  await waitForApp(page)
  await expect(cards).toHaveCount(MODULES.filter((m) => m.stage === 3).length)
  expect(problems.list).toEqual([])
})

test('Practice: every topic grouped by stage, and course links for a new learner', async ({ page, problems }) => {
  await page.goto('/practice')
  await waitForApp(page)
  const topicLinks = page.locator('a[href$="#practice"][href^="/grammar/"]')
  await expect(topicLinks).toHaveCount(24)
  for (const stage of STAGES) await expect(page.getByText(`Stage ${stage.id} · ${stage.name}`)).toBeVisible()
  await expect(page.locator('a[href="/module/1/test"]').first()).toBeVisible()
  expect(problems.list).toEqual([])
})

test('BlogIndex: category filter and counts', async ({ page, problems }) => {
  await page.goto('/blog')
  await waitForApp(page)
  const filters = page.getByRole('group', { name: 'Filter by category' })
  const task2 = BLOG_POSTS.filter((p) => p.category === 'Task 2')
  await filters.getByRole('button', { name: /Task 2/ }).click()
  await expect(page).toHaveURL(/category=Task(\+|%20)2/)
  const cards = page.locator('main a[href^="/blog/"]')
  expect(new Set(await hrefs(cards))).toEqual(new Set(task2.map((p) => `/blog/${p.slug}`)))
  await expect(filters.getByRole('button', { name: /All/ })).toContainText(String(BLOG_POSTS.length))
  expect(problems.list).toEqual([])
})

test('BlogPost: grammar topic links, related posts and footer categories', async ({ page, problems }) => {
  await page.goto('/blog/hedging-in-ielts-task-2')
  await waitForApp(page)
  const related = page.locator('section[aria-labelledby="related-articles"] a[href^="/blog/"]')
  expect([...new Set(await hrefs(related))]).toEqual([
    '/blog/how-to-use-complex-sentences-in-ielts',
    '/blog/common-grammar-mistakes-in-ielts',
    '/blog/how-to-improve-ielts-writing-grammar',
  ])
  const topicChips = page.locator('section', { has: page.getByRole('heading', { name: 'Grammar topics in this article' }) })
  await expect(topicChips.locator('a[href="/grammar/hedging"]')).toContainText('Module 19')
  const footer = page.locator('footer')
  for (const c of ['Grammar Tips', 'IELTS Writing', 'Task 1']) {
    await expect(footer.getByRole('link', { name: c })).toHaveAttribute('href', `/blog?category=${encodeURIComponent(c)}`)
  }
  expect(problems.list).toEqual([])
})
