import { describe, expect, it } from 'vitest'
import { createStaticContentService } from '@/services/content'
import { packs } from '@/services/content/packs'
import { getLesson } from '@/data/lessons'
import { getTestQuestions } from '@/data/questions'

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
