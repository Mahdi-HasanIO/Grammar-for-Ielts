import { describe, expect, it } from 'vitest'
import { getSeo, headTags, headTagsToHtml, indexableRoutes, normalizePath, type HeadTag } from '@/seo/meta'
import { SITE_NAME, SITE_URL } from '@/config/site'
import { GRAMMAR_TOPICS } from '@/data/grammarTopics'
import { BLOG_POSTS } from '@/data/blog/posts'

const routes = indexableRoutes()
const paths = routes.map((r) => r.path)

const attr = (tags: HeadTag[], tag: 'meta' | 'link', key: string, value: string, field: string) =>
  tags.find((t): t is Extract<HeadTag, { tag: 'meta' | 'link' }> => t.tag === tag && t.attrs[key] === value)?.attrs[field]
const jsonLdTypes = (tags: HeadTag[]) =>
  tags.flatMap((t) => (t.tag === 'jsonld' ? [t.json['@type'] as string] : []))

describe('public routes', () => {
  it('lists the expected public pages in the sitemap', () => {
    expect(paths).toEqual([
      '/',
      '/grammar',
      ...GRAMMAR_TOPICS.map((t) => `/grammar/${t.slug}`),
      '/blog',
      ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
      '/practice',
      '/course',
    ])
    expect(paths).toHaveLength(36)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('prerenders every public page except the progress-dependent course roadmap', () => {
    expect(routes.filter((r) => !r.prerender).map((r) => r.path)).toEqual(['/course'])
  })

  it('gives blog posts and the homepage a lastmod date', () => {
    for (const r of routes.filter((r) => r.path.startsWith('/blog/'))) expect(r.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(routes[0].lastmod).toBe(BLOG_POSTS[0].date)
  })
})

describe.each(paths)('indexable page %s', (path) => {
  const seo = getSeo(path)
  const tags = headTags(seo)

  it('is indexable', () => {
    expect(seo.noindex).toBeFalsy()
    expect(attr(tags, 'meta', 'name', 'robots', 'content')).toBe('index, follow, max-image-preview:large')
  })

  it('has a title naming the site and a real description', () => {
    expect(seo.title).toContain(SITE_NAME)
    expect(seo.description.length).toBeGreaterThanOrEqual(50)
    expect(seo.description.length).toBeLessThanOrEqual(200)
  })

  it('has an absolute canonical URL and matching Open Graph URL on the production origin', () => {
    const canonical = attr(tags, 'link', 'rel', 'canonical', 'href')
    expect(canonical).toBe(path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`)
    expect(attr(tags, 'meta', 'property', 'og:url', 'content')).toBe(canonical)
    expect(attr(tags, 'meta', 'property', 'og:title', 'content')).toBe(seo.title)
    expect(attr(tags, 'meta', 'property', 'og:image', 'content')).toMatch(new RegExp(`^${SITE_URL}/`))
  })
})

describe('titles and descriptions', () => {
  const all = paths.map((p) => getSeo(p))

  it('are unique across public pages', () => {
    const titles = all.map((s) => s.title)
    const descriptions = all.map((s) => s.description)
    expect(titles.filter((t, i) => titles.indexOf(t) !== i)).toEqual([])
    expect(descriptions.filter((d, i) => descriptions.indexOf(d) !== i)).toEqual([])
  })
})

describe('structured data (JSON-LD)', () => {
  const types = (path: string) => jsonLdTypes(headTags(getSeo(path)))

  it('describes the site on the homepage', () => {
    expect(types('/')).toEqual(['WebSite'])
  })

  it('has breadcrumbs on grammar and blog index pages', () => {
    expect(types('/grammar')).toEqual(['BreadcrumbList'])
    expect(types('/blog')).toEqual(['BreadcrumbList'])
  })

  it.each(GRAMMAR_TOPICS.map((t) => t.slug))('has a three-level breadcrumb on /grammar/%s', (slug) => {
    const ld = headTags(getSeo(`/grammar/${slug}`)).find((t) => t.tag === 'jsonld')
    expect(ld?.tag === 'jsonld' && ld.json['@type']).toBe('BreadcrumbList')
    const items = ld?.tag === 'jsonld' ? (ld.json.itemListElement as { item: string }[]) : []
    expect(items.map((i) => i.item)).toEqual([`${SITE_URL}/`, `${SITE_URL}/grammar`, `${SITE_URL}/grammar/${slug}`])
  })

  it.each(BLOG_POSTS.map((p) => p.slug))('marks /blog/%s as an Article with dates and an image', (slug) => {
    const post = BLOG_POSTS.find((p) => p.slug === slug)!
    const seo = getSeo(`/blog/${slug}`)
    const tags = headTags(seo)
    expect(jsonLdTypes(tags)).toEqual(['Article', 'BreadcrumbList'])
    const article = tags.find((t) => t.tag === 'jsonld')
    expect(article?.tag === 'jsonld' && article.json).toMatchObject({ headline: post.title, datePublished: post.date })
    expect(attr(tags, 'meta', 'property', 'og:type', 'content')).toBe('article')
    expect(attr(tags, 'meta', 'property', 'article:published_time', 'content')).toBe(post.date)
  })

  it('escapes "<" inside JSON-LD so it cannot close the script tag', () => {
    const html = headTagsToHtml([{ tag: 'jsonld', json: { name: '</script><script>alert(1)</script>' } }])
    expect(html).not.toContain('</script><script>')
    expect(html).toContain('\\u003c/script>')
  })
})

describe('private and unknown pages stay out of search', () => {
  it.each([
    '/dashboard',
    '/review',
    '/progress',
    '/settings',
    '/bookmarks',
    '/module/1',
    '/module/24/test',
    '/module/articles-and-determiners',
    '/grammar/not-a-topic',
    '/blog/not-a-post',
    '/some/unknown/page',
  ])('%s is noindex', (path) => {
    const seo = getSeo(path)
    expect(seo.noindex).toBe(true)
    expect(attr(headTags(seo), 'meta', 'name', 'robots', 'content')).toBe('noindex, follow')
  })

  it('ignores query strings, hashes and trailing slashes when choosing metadata', () => {
    expect(normalizePath('/grammar/articles/?ref=x#rules')).toBe('/grammar/articles')
    expect(getSeo('/grammar/articles/').noindex).toBeFalsy()
    expect(getSeo('/dashboard?tab=1').noindex).toBe(true)
  })
})
