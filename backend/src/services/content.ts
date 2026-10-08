import type { ContentRepositories } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'
import type { BlogPostDoc, LessonDoc, ModuleDoc, QuestionDoc, StageDoc } from '../validators/content.js'
import { BLOG_CATEGORIES } from '../validators/content.js'

export type BlogPostSummary = Omit<BlogPostDoc, 'body'>

export interface ContentService {
  catalog(): Promise<{ stages: StageDoc[]; modules: ModuleDoc[] }>
  /** A legacy id ("3"), a stable module slug or a public topic slug, as the frontend's resolveModule(). */
  module(ref: string): Promise<ModuleDoc>
  lesson(ref: string, language: LessonDoc['language']): Promise<LessonDoc>
  questions(ref: string, set?: QuestionDoc['set']): Promise<QuestionDoc[]>
  posts(): Promise<{ categories: readonly string[]; posts: BlogPostSummary[] }>
  post(slug: string): Promise<BlogPostDoc>
}

const notFound = (what: string) => new AppError(404, 'not_found', `${what} not found`)

/** Read side of the content API. Writes go through the admin API (or the seed script). */
export function createContentService(content: ContentRepositories): ContentService {
  async function resolve(ref: string): Promise<ModuleDoc> {
    const found = /^\d+$/.test(ref)
      ? await content.modules.find({ legacyId: Number(ref) })
      : ((await content.modules.find({ slug: ref })) ?? (await content.modules.find({ 'topic.slug': ref })))
    if (!found) throw notFound('Module')
    return found
  }

  return {
    async catalog() {
      const [stages, modules] = await Promise.all([content.stages.list(), content.modules.list()])
      return { stages, modules }
    },
    module: resolve,
    async lesson(ref, language) {
      const { legacyId } = await resolve(ref)
      const lesson = await content.lessons.find({ moduleId: legacyId, language })
      if (!lesson) throw notFound('Lesson')
      return lesson
    },
    async questions(ref, set) {
      const { legacyId } = await resolve(ref)
      return content.questions.list(set ? { moduleId: legacyId, set } : { moduleId: legacyId })
    },
    async posts() {
      const posts = await content.posts.list()
      return { categories: BLOG_CATEGORIES, posts: posts.map(({ body: _body, ...summary }) => summary) }
    },
    async post(slug) {
      const post = await content.posts.find({ slug })
      if (!post) throw notFound('Post')
      return post
    },
  }
}
