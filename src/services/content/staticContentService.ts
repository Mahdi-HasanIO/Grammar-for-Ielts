import {
  BLOG_CATEGORY_LIST,
  BLOG_POST_INDEX,
  blogPostBySlug,
  catalogStages,
  FEATURED_TOPIC_MODULES,
  GRAMMAR_MODULES,
  GRAMMAR_TOPIC_MODULES,
  moduleByTopicSlug,
  resolveModule,
  type ModuleRef,
} from '@/content/catalog'
import { ARTICLES } from '@/data/blog/articles'
import type { LessonLanguage } from '@/types'
import { loadLessonPack, loadQuestionPack, packs } from './packs'
import type { BlogPost, ContentService } from './types'

type Settled<T> = Promise<T> & { status: 'fulfilled'; value: T }

/**
 * A promise that is already settled and says so in the fields React reads.
 * `use()` returns a thenable's value synchronously when `status` is
 * 'fulfilled', so static content renders in the first pass: prerendered HTML
 * and hydration are identical to reading the arrays directly, with no
 * Suspense fallback. A remote service returns ordinary promises instead.
 */
function fulfilled<T>(value: T): Promise<T> {
  const promise = Promise.resolve(value) as Settled<T>
  promise.status = 'fulfilled'
  promise.value = value
  return promise
}

/** Marks a pending promise as settled once it resolves, so later `use()` calls read it synchronously. */
function track<T>(pending: Promise<T>): Promise<T> {
  pending.then(
    (value) => Object.assign(pending, { status: 'fulfilled', value }),
    () => {
      /* Callers see the rejection through `pending` itself. */
    },
  )
  return pending
}

/**
 * The first implementation: reads the TypeScript content files bundled with
 * the app. The catalogue and blog are small and imported directly; lessons
 * and questions come from packs (see packs.ts) so pages that do not show
 * them, such as the blog, do not download them.
 */
export function createStaticContentService(): ContentService {
  const cache = new Map<string, Promise<unknown>>()
  function memo<T>(key: string, read: () => T | Promise<T>): Promise<T> {
    let hit = cache.get(key) as Promise<T> | undefined
    if (!hit) {
      const value = read()
      hit = value instanceof Promise ? track(value) : fulfilled(value)
      cache.set(key, hit)
    }
    return hit
  }

  /** Reads from a pack: synchronously when the route bundled it, otherwise after loading it. */
  function fromPack<P, T>(registered: P | undefined, load: () => Promise<P>, read: (pack: P) => T): T | Promise<T> {
    return registered ? read(registered) : load().then(read)
  }

  const legacyId = (ref: ModuleRef) => resolveModule(ref)?.legacyId

  return {
    getStages: () => memo('stages', () => catalogStages()),
    getModules: () => memo('modules', () => GRAMMAR_MODULES),
    getModule: (ref) => memo(`module:${ref}`, () => resolveModule(ref)),
    getLesson: (ref, locale: LessonLanguage) =>
      memo(`lesson:${ref}:${locale}`, () => {
        const id = legacyId(ref)
        if (id === undefined) return undefined
        return fromPack(packs.lessons, loadLessonPack, (pack) => pack.getLesson(id, locale))
      }),
    getPracticeQuestions: (ref) =>
      memo(`practice:${ref}`, () => {
        const id = legacyId(ref)
        if (id === undefined) return []
        return fromPack(packs.questions, loadQuestionPack, (pack) => pack.getPracticeQuestions(id))
      }),
    getTestQuestions: (ref) =>
      memo(`test:${ref}`, () => {
        const id = legacyId(ref)
        if (id === undefined) return []
        return fromPack(packs.questions, loadQuestionPack, (pack) => pack.getTestQuestions(id))
      }),
    getGrammarTopics: () => memo('topics', () => GRAMMAR_TOPIC_MODULES),
    getGrammarTopic: (topicSlug) => memo(`topic:${topicSlug}`, () => moduleByTopicSlug(topicSlug)),
    getFeaturedGrammarTopics: () => memo('featured-topics', () => FEATURED_TOPIC_MODULES),
    getBlogPosts: () => memo('posts', () => BLOG_POST_INDEX),
    getBlogPost: (slug) =>
      memo(`post:${slug}`, (): BlogPost | undefined => {
        const meta = blogPostBySlug(slug)
        return meta ? { meta, blocks: ARTICLES[meta.slug] ?? [] } : undefined
      }),
    getBlogCategories: () => memo('categories', () => BLOG_CATEGORY_LIST),
  }
}
