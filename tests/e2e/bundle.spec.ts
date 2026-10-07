import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

/*
 * Checks on the production build in dist/ (no browser needed):
 * - the lesson and question banks load only on the routes that use them;
 * - every public route was prerendered with real content, not a fallback.
 * Run after `npm run build`; a stale dist/ tests old code.
 */

const DIST = fileURLToPath(new URL('../../dist', import.meta.url))
const ASSETS = path.join(DIST, 'assets')
const chunks = fs.readdirSync(ASSETS).filter((f) => f.endsWith('.js'))
const read = (f: string) => fs.readFileSync(path.join(ASSETS, f), 'utf8')

/** Static imports only: dynamic import() chunks are loaded on demand, not with the route. */
const staticDeps = (f: string) => [...read(f).matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)].map((m) => m[1])
function closure(start: string): string[] {
  const seen = new Set([start])
  const stack = [start]
  while (stack.length) {
    for (const dep of staticDeps(stack.pop()!)) {
      if (seen.has(dep)) continue
      seen.add(dep)
      stack.push(dep)
    }
  }
  return [...seen]
}
const chunk = (name: string) => {
  const found = chunks.filter((f) => f.startsWith(`${name}-`))
  expect(found, name).toHaveLength(1)
  return found[0]
}
const entry = () => {
  const html = fs.readFileSync(path.join(DIST, 'app.html'), 'utf8')
  return html.match(/<script type="module"[^>]*src="\/assets\/([^"]+\.js)"/)![1]
}
const loads = (route: string, pack: string) => closure(route).some((f) => f.startsWith(`${pack}-`))

test.describe('bundle splitting', () => {
  test('the lesson and question packs are separate chunks', () => {
    expect(chunk('lessonPack')).toBeTruthy()
    expect(chunk('questionPack')).toBeTruthy()
  })

  for (const route of ['BlogPost', 'BlogIndex', 'GrammarIndex', 'Practice', 'Dashboard', 'Course', 'Settings', 'Bookmarks']) {
    test(`${route} loads neither pack`, () => {
      const start = chunk(route)
      expect(loads(start, 'lessonPack')).toBe(false)
      expect(loads(start, 'questionPack')).toBe(false)
    })
  }

  test('the entry bundle (home page and app shell) loads neither pack', () => {
    expect(loads(entry(), 'lessonPack')).toBe(false)
    expect(loads(entry(), 'questionPack')).toBe(false)
  })

  test('lesson, grammar-topic and test routes load what they render', () => {
    expect(loads(chunk('Module'), 'lessonPack')).toBe(true)
    expect(loads(chunk('Module'), 'questionPack')).toBe(true)
    expect(loads(chunk('GrammarTopic'), 'lessonPack')).toBe(true)
    expect(loads(chunk('GrammarTopic'), 'questionPack')).toBe(true)
    expect(loads(chunk('Test'), 'questionPack')).toBe(true)
    expect(loads(chunk('Test'), 'lessonPack')).toBe(false)
  })
})

test.describe('prerendered output', () => {
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1])
  const file = (route: string) => path.join(DIST, route === '/' ? 'index.html' : `${route.slice(1)}.html`)

  test('the sitemap lists 36 public URLs on the production origin', () => {
    expect(routes).toHaveLength(36)
    expect(sitemap).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/)
    expect([...sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)]).toHaveLength(36)
  })

  test('robots.txt allows crawling and points at the sitemap', () => {
    const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
    expect(robots).toMatch(/User-agent: \*\nAllow: \//)
    expect(robots).toMatch(/Sitemap: https:\/\/[^/]+\/sitemap\.xml/)
  })

  for (const route of routes.filter((r) => r !== '/course')) {
    test(`${route} is prerendered with content, metadata and no loading fallback`, () => {
      const html = fs.readFileSync(file(route), 'utf8')
      expect(html).toMatch(/<div id="root"><.+<h1/s)
      expect(html).not.toMatch(/aria-busy="true"|<template id="B:/)
      expect(html).toContain(`<link rel="canonical" href="https://`)
      expect(html).toMatch(/<meta name="robots" content="index, follow/)
    })
  }
})
