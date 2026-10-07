import { describe, expect, it } from 'vitest'
import { createStaticContentService } from '@/services/content'
import { packs } from '@/services/content/packs'
import { getLesson } from '@/data/lessons'
import { getTestQuestions } from '@/data/questions'
import { featuredPost, formatPostDate, postCover, relatedPosts } from '@/content/blog'
import { moduleByLegacyId } from '@/content/catalog'
import { localizeModule, localizeStage } from '@/utils/i18n'
import type { BlogPostMeta } from '@/services/content'
import type { Stage } from '@/types'

/*
 * Prerendering and hydration depend on one contract: when a route has
 * imported the pack it reads, the content service returns promises that are
 * already marked fulfilled, so React's use() reads them without suspending.
 */

type Tracked<T> = Promise<T> & { status?: string; value?: T }

describe('static content service', () => {
  // Vitest gives each test file its own module registry, so no pack is registered yet.
  it('loads a pack on demand when the route did not import it', async () => {
    expect(packs.lessons).toBeUndefined()
    const service = createStaticContentService()
    const pending = service.getLesson('articles-and-determiners', 'bn') as Tracked<unknown>
    expect(pending.status).toBeUndefined()
    expect(await pending).toBe(getLesson(3, 'bn'))
    // Once settled, later reads of the same request are synchronous.
    expect(pending.status).toBe('fulfilled')
    expect(service.getLesson('articles-and-determiners', 'bn')).toBe(pending)
    expect(packs.lessons).toBeDefined()
  })

  it('returns already-fulfilled promises once packs are registered', async () => {
    await import('@/services/content/lessonPack')
    await import('@/services/content/questionPack')
    const service = createStaticContentService()

    const lesson = service.getLesson(3, 'en') as Tracked<unknown>
    expect(lesson.status).toBe('fulfilled')
    expect(lesson.value).toBe(getLesson(3, 'en'))

    const test = service.getTestQuestions('articles') as Tracked<unknown>
    expect(test.status).toBe('fulfilled')
    expect(test.value).toEqual(getTestQuestions(3))

    // Catalogue and blog data are always synchronous.
    for (const request of [service.getModules(), service.getGrammarTopics(), service.getBlogPosts(), service.getStages()]) {
      expect((request as Tracked<unknown>).status).toBe('fulfilled')
    }
  })

  it('returns the same promise for the same request, whatever form the module reference takes', () => {
    const service = createStaticContentService()
    expect(service.getTestQuestions(3)).toBe(service.getTestQuestions('3'))
    expect(service.getModule('articles')).toBe(service.getModule('articles'))
  })

  it('returns empty results for unknown modules and posts', async () => {
    const service = createStaticContentService()
    expect(await service.getLesson('nope', 'en')).toBeUndefined()
    expect(await service.getPracticeQuestions('nope')).toEqual([])
    expect(await service.getTestQuestions(99)).toEqual([])
    expect(await service.getBlogPost('nope')).toBeUndefined()
  })

  it('returns a blog post with its article body', async () => {
    const post = await createStaticContentService().getBlogPost('hedging-in-ielts-task-2')
    expect(post?.meta.slug).toBe('hedging-in-ielts-task-2')
    expect(post?.blocks.length).toBeGreaterThan(5)
  })
})

describe('catalogue reads through the service', () => {
  const service = createStaticContentService()
  const value = <T,>(p: Promise<T>) => (p as Tracked<T>).value as T

  it('returns featured homepage topics in display order, synchronously', () => {
    const featured = service.getFeaturedGrammarTopics() as Tracked<readonly { topic: { slug: string } }[]>
    expect(featured.status).toBe('fulfilled')
    expect(featured.value!.map((m) => m.topic.slug)).toEqual(['articles', 'tenses', 'subject-verb-agreement', 'conditionals', 'relative-clauses', 'nominalization'])
  })

  it('returns blog categories in display order', () => {
    expect(value(service.getBlogCategories())).toEqual(['Grammar Tips', 'IELTS Writing', 'Task 1', 'Task 2', 'Study Strategy'])
  })

  it('returns 24 modules, 24 topics in topic order, 5 stages and 7 posts newest first', () => {
    expect(value(service.getModules()).map((m) => m.legacyId)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(value(service.getGrammarTopics())).toHaveLength(24)
    expect(value(service.getGrammarTopics())[0].topic.slug).toBe('sentence-structure')
    expect(value(service.getStages()).map((s) => s.id)).toEqual([1, 2, 3, 4, 5])
    const dates = value(service.getBlogPosts()).map((p) => p.date)
    expect(dates).toHaveLength(7)
    expect([...dates].sort().reverse()).toEqual(dates)
  })
})

describe('blog helpers (src/content/blog.ts)', () => {
  const posts = (createStaticContentService().getBlogPosts() as Tracked<readonly BlogPostMeta[]>).value!

  it('features the post marked featured, or the newest one', () => {
    expect(featuredPost(posts).slug).toBe('common-grammar-mistakes-in-ielts')
    const withoutFlag = posts.map((p) => ({ ...p, featured: false }))
    expect(featuredPost(withoutFlag).slug).toBe(posts[0].slug)
  })

  it.each<[string, string[]]>([
    ['common-grammar-mistakes-in-ielts', ['articles-a-an-the-for-ielts', 'how-to-improve-ielts-writing-grammar', 'how-to-use-complex-sentences-in-ielts']],
    ['hedging-in-ielts-task-2', ['how-to-use-complex-sentences-in-ielts', 'common-grammar-mistakes-in-ielts', 'how-to-improve-ielts-writing-grammar']],
    ['describing-trends-in-ielts-task-1', ['ielts-grammar-study-plan', 'common-grammar-mistakes-in-ielts', 'how-to-improve-ielts-writing-grammar']],
  ])('keeps the related posts for %s unchanged', (slug, expected) => {
    const post = posts.find((p) => p.slug === slug)!
    expect(relatedPosts(post, posts).map((p) => p.slug)).toEqual(expected)
  })

  it('formats dates the same way at build time and in the browser', () => {
    expect(formatPostDate('2026-09-22')).toBe('22 Sep 2026')
    expect(formatPostDate('2026-07-02')).toBe('2 Jul 2026')
  })

  it('resolves cover images, with a default for posts without one', () => {
    expect(postCover({ slug: 'hedging-in-ielts-task-2', coverAlt: 'alt' })).toMatchObject({
      src: '/blog/covers/hedging-in-ielts-task-2-800.webp',
      og: '/blog/covers/hedging-in-ielts-task-2-og.jpg',
      alt: 'alt',
    })
    expect(postCover({ slug: 'new-post', coverAlt: 'alt' }).src).toBe('/blog/covers/default-800.webp')
  })
})

describe('localisation reads English text from the catalogue', () => {
  it('localises stages and modules', () => {
    const stage = (createStaticContentService().getStages() as Tracked<Stage[]>).value![0]
    expect(localizeStage(stage, 'en').tagline).toBe('Build error-free sentences')
    expect(localizeStage(stage, 'bn')).toBe(stage)
    const module = moduleByLegacyId(1)!.module
    expect(localizeModule(module, 'en').summary).toBe('Every clause needs a subject and a verb, in the right order.')
    expect(localizeModule(module, 'bn')).toBe(module)
  })
})
