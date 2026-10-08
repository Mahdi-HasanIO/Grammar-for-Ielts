import type { z } from 'zod'
import type { AuditEntry, AuditLogRepository, ContentFilter, ContentRepositories, UserRecord } from '../repositories/types.js'
import { DuplicateKeyError } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'
import {
  blogPostDoc,
  lessonDoc,
  moduleDoc,
  questionDoc,
  stageDoc,
  type BlogPostDoc,
  type ContentIssue,
  type LessonDoc,
  type ModuleDoc,
  type QuestionDoc,
  type StageDoc,
} from '../validators/content.js'

export const ADMIN_COLLECTIONS = ['stages', 'modules', 'lessons', 'questions', 'posts'] as const
export type AdminCollection = (typeof ADMIN_COLLECTIONS)[number]

/** How each collection is addressed in URLs (/api/admin/content/:collection/:key) and checked before a write. */
interface CollectionRules<T> {
  schema: z.ZodType<T>
  /** The URL key for a document: "3" for module 3, "3-en" for its English lesson. */
  keyOf(doc: T): string
  /** The filter for a URL key, or null if the key cannot be one. */
  filter(key: string): ContentFilter | null
  /** Cross-document checks (references, stable slugs) before an upsert. */
  check(doc: T, content: ContentRepositories): Promise<ContentIssue[]>
  /** Reasons the document cannot be deleted (other documents point at it). */
  inUse(doc: T, content: ContentRepositories): Promise<string[]>
}

const numeric = (key: string) => (/^\d{1,6}$/.test(key) ? Number(key) : null)

async function moduleExists(content: ContentRepositories, legacyId: number, path: string): Promise<ContentIssue[]> {
  return (await content.modules.find({ legacyId })) ? [] : [{ path, message: `module ${legacyId} does not exist` }]
}

const RULES: { [K in AdminCollection]: CollectionRules<K extends 'stages' ? StageDoc : K extends 'modules' ? ModuleDoc : K extends 'lessons' ? LessonDoc : K extends 'questions' ? QuestionDoc : BlogPostDoc> } = {
  stages: {
    schema: stageDoc,
    keyOf: (d) => String(d.id),
    filter: (key) => (numeric(key) === null ? null : { id: Number(key) }),
    check: async () => [],
    inUse: async (d, content) => ((await content.modules.list({ stage: d.id })).length ? [`modules belong to stage ${d.id}`] : []),
  },
  modules: {
    schema: moduleDoc,
    keyOf: (d) => String(d.legacyId),
    filter: (key) => (numeric(key) === null ? null : { legacyId: Number(key) }),
    async check(d, content) {
      const issues: ContentIssue[] = []
      if (!(await content.stages.find({ id: d.stage }))) issues.push({ path: 'stage', message: `stage ${d.stage} does not exist` })
      const others = (await content.modules.list()).filter((m) => m.legacyId !== d.legacyId)
      const topicSlugs = new Set([...others.map((m) => m.topic.slug), d.topic.slug])
      for (const related of d.topic.related) if (!topicSlugs.has(related)) issues.push({ path: 'topic.related', message: `unknown topic "${related}"` })
      if (others.some((m) => m.topic.slug === d.slug)) issues.push({ path: 'slug', message: `"${d.slug}" is another module's topic slug` })
      if (others.some((m) => m.slug === d.topic.slug)) issues.push({ path: 'topic.slug', message: `"${d.topic.slug}" is another module's slug` })
      const existing = await content.modules.find({ legacyId: d.legacyId })
      if (existing && existing.slug !== d.slug) issues.push({ path: 'slug', message: `stored as "${existing.slug}"; slugs never change` })
      if (existing && existing.topic.slug !== d.topic.slug) issues.push({ path: 'topic.slug', message: `stored as "${existing.topic.slug}"; slugs never change` })
      return issues
    },
    async inUse(d, content) {
      const reasons: string[] = []
      if ((await content.lessons.list({ moduleId: d.legacyId })).length) reasons.push('lessons belong to this module')
      if ((await content.questions.list({ moduleId: d.legacyId })).length) reasons.push('questions belong to this module')
      if ((await content.modules.list()).some((m) => m.legacyId !== d.legacyId && m.topic.related.includes(d.topic.slug))) reasons.push('other topics link to it')
      if ((await content.posts.list()).some((p) => p.topics.includes(d.topic.slug))) reasons.push('blog posts link to it')
      return reasons
    },
  },
  lessons: {
    schema: lessonDoc,
    keyOf: (d) => `${d.moduleId}-${d.language}`,
    filter(key) {
      const match = /^(\d{1,6})-(bn|en)$/.exec(key)
      return match ? { moduleId: Number(match[1]), language: match[2] as string } : null
    },
    async check(d, content) {
      const issues = await moduleExists(content, d.moduleId, 'moduleId')
      const ids = d.rules.map((r) => r.id)
      if (new Set(ids).size !== ids.length) issues.push({ path: 'rules', message: 'rule ids must be unique' })
      for (const id of ids) if (!id.startsWith(`m${d.moduleId}-`)) issues.push({ path: 'rules', message: `rule id "${id}" must start with m${d.moduleId}-` })
      return issues
    },
    inUse: async () => [],
  },
  questions: {
    schema: questionDoc,
    keyOf: (d) => d.id,
    filter: (key) => (/^[A-Za-z0-9_-]{1,64}$/.test(key) ? { id: key } : null),
    check: async (d, content) => moduleExists(content, d.moduleId, 'moduleId'),
    inUse: async () => [],
  },
  posts: {
    schema: blogPostDoc,
    keyOf: (d) => d.slug,
    filter: (key) => (/^[a-z0-9-]{1,200}$/.test(key) ? { slug: key } : null),
    async check(d, content) {
      const topics = new Set((await content.modules.list()).map((m) => m.topic.slug))
      return d.topics.filter((t) => !topics.has(t)).map((t) => ({ path: 'topics', message: `unknown topic "${t}"` }))
    },
    inUse: async () => [],
  },
}

type Actor = Extract<AuditEntry['actor'], { type: 'user' }>
export const actorOf = (user: UserRecord): Actor => ({ type: 'user', id: user.id, email: user.email })

export interface AdminContentService {
  list(collection: AdminCollection): Promise<unknown[]>
  get(collection: AdminCollection, key: string): Promise<unknown>
  /** Creates or replaces the document at `key`. */
  put(collection: AdminCollection, key: string, body: unknown, actor: Actor): Promise<{ document: unknown; created: boolean }>
  remove(collection: AdminCollection, key: string, actor: Actor): Promise<void>
  audit(options: { limit: number; before?: Date }): Promise<AuditEntry[]>
}

const notFound = () => new AppError(404, 'not_found', 'Document not found')

/**
 * Admin writes to the content collections, with the same validation as the
 * seed (document schemas plus per-document reference checks), and an audit
 * entry for every change.
 */
export function createAdminContentService({ content, audit, now = () => new Date() }: { content: ContentRepositories; audit: AuditLogRepository; now?: () => Date }): AdminContentService {
  const rulesFor = (collection: AdminCollection) => RULES[collection] as unknown as CollectionRules<unknown>
  const storeFor = (collection: AdminCollection) => content[collection] as unknown as ContentRepositories['stages']

  function filterFor(collection: AdminCollection, key: string): ContentFilter {
    const filter = rulesFor(collection).filter(key)
    if (!filter) throw notFound()
    return filter
  }

  return {
    async list(collection) {
      return storeFor(collection).list()
    },

    async get(collection, key) {
      const doc = await storeFor(collection).find(filterFor(collection, key))
      if (!doc) throw notFound()
      return doc
    },

    async put(collection, key, body, actor) {
      const rules = rulesFor(collection)
      const parsed = rules.schema.safeParse(body)
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({ location: 'body', path: i.path.map(String).join('.'), message: i.message }))
        throw new AppError(400, 'validation_error', 'Request validation failed', { details })
      }
      const doc = parsed.data
      if (rules.keyOf(doc) !== key) throw new AppError(400, 'key_mismatch', `The document's key is "${rules.keyOf(doc)}", not "${key}"`)
      const issues = await rules.check(doc, content)
      if (issues.length) throw new AppError(422, 'content_invalid', 'The document does not fit the existing content', { details: issues })

      const store = storeFor(collection)
      const before = await store.find(filterFor(collection, key))
      let outcome
      try {
        outcome = await store.upsert(doc as never)
      } catch (error) {
        if (error instanceof DuplicateKeyError) throw new AppError(409, 'duplicate', 'Another document already uses one of these unique values (e.g. a slug)', { cause: error })
        throw error
      }
      if (outcome !== 'unchanged') {
        await audit.append({ at: now(), actor, action: before ? 'update' : 'create', target: { collection, key }, before, after: doc })
      }
      return { document: doc, created: outcome === 'inserted' }
    },

    async remove(collection, key, actor) {
      const filter = filterFor(collection, key)
      const store = storeFor(collection)
      const before = await store.find(filter)
      if (!before) throw notFound()
      const reasons = await rulesFor(collection).inUse(before, content)
      if (reasons.length) throw new AppError(409, 'in_use', `Cannot delete: ${reasons.join('; ')}`)
      await store.delete(filter)
      await audit.append({ at: now(), actor, action: 'delete', target: { collection, key }, before, after: null })
    },

    audit: (options) => audit.list(options),
  }
}
