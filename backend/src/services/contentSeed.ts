import { z } from 'zod'
import type { ContentRepositories, UpsertOutcome } from '../repositories/types.js'
import {
  blogPostDoc,
  checkContentIntegrity,
  lessonDoc,
  moduleDoc,
  questionDoc,
  stageDoc,
  type ContentIssue,
  type ContentSet,
} from '../validators/content.js'

/*
 * Turns the exported snapshots (backend/seed/*.json, written by the root
 * script scripts/export-content-snapshot.mjs from the React app's static
 * content) into database documents, validates them, and upserts them.
 * Nothing here reads the frontend's source.
 */

/** The four snapshot files, as exported (the frontend's own shapes). */
export interface ContentSnapshot {
  catalog: unknown
  lessons: unknown
  questions: unknown
  blog: unknown
}

const record = z.record(z.string(), z.unknown())
const rawCatalog = z.object({
  stages: z.array(record),
  stagesEn: record,
  modules: z.array(record),
  modulesEn: record,
  topics: z.array(record),
  featuredTopicSlugs: z.array(z.string()),
})
const rawLessons = z.object({ bn: z.array(record), en: z.array(record) })
const rawQuestions = z.object({ practice: z.array(record), test: z.array(record) })
const rawBlog = z.object({ categories: z.array(z.string()), posts: z.array(record), articles: z.record(z.string(), z.array(z.unknown())) })

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[]

  constructor(issues: ContentIssue[]) {
    super(`Content is invalid (${issues.length} problem${issues.length === 1 ? '' : 's'}):\n${issues.slice(0, 50).map((i) => `  - ${i.path}: ${i.message}`).join('\n')}`)
    this.name = 'ContentValidationError'
    this.issues = issues
  }
}

const zodIssues = (prefix: string, error: z.ZodError): ContentIssue[] =>
  error.issues.map((issue) => ({ path: [prefix, ...issue.path.map(String)].filter(Boolean).join('.'), message: issue.message }))

function parseAll<T>(schema: z.ZodType<T>, items: unknown[], pathOf: (item: unknown, index: number) => string, issues: ContentIssue[]): T[] {
  const out: T[] = []
  items.forEach((item, index) => {
    const result = schema.safeParse(item)
    if (result.success) out.push(result.data)
    else issues.push(...zodIssues(pathOf(item, index), result.error))
  })
  return out
}

const field = (item: unknown, key: string) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>)[key] : undefined)

/** Builds and validates documents from a snapshot. Throws ContentValidationError listing every problem. */
export function contentFromSnapshot(snapshot: ContentSnapshot): ContentSet {
  const issues: ContentIssue[] = []
  const shapes = [
    ['catalog', rawCatalog.safeParse(snapshot.catalog)],
    ['lessons', rawLessons.safeParse(snapshot.lessons)],
    ['questions', rawQuestions.safeParse(snapshot.questions)],
    ['blog', rawBlog.safeParse(snapshot.blog)],
  ] as const
  for (const [name, result] of shapes) if (!result.success) issues.push(...zodIssues(name, result.error))
  if (issues.length) throw new ContentValidationError(issues)
  const catalog = rawCatalog.parse(snapshot.catalog)
  const lessons = rawLessons.parse(snapshot.lessons)
  const questions = rawQuestions.parse(snapshot.questions)
  const blog = rawBlog.parse(snapshot.blog)

  const stages = parseAll(
    stageDoc,
    catalog.stages.map((s) => {
      const en = record.safeParse(catalog.stagesEn[String(s.id)]).data ?? {}
      return { id: s.id, name: s.name, tagline: { bn: s.tagline, en: en.tagline }, description: { bn: s.description, en: en.description } }
    }),
    (s) => `stages.${String(field(s, 'id'))}`,
    issues,
  )

  const topicOrder = new Map(catalog.topics.map((t, i) => [t.moduleId, i]))
  const topicByModule = new Map(catalog.topics.map((t) => [t.moduleId, t]))
  for (const t of catalog.topics) {
    if (!catalog.modules.some((m) => m.id === t.moduleId)) issues.push({ path: `topics.${String(t.slug)}`, message: `module ${String(t.moduleId)} does not exist` })
  }
  for (const s of catalog.featuredTopicSlugs) {
    if (!catalog.topics.some((t) => t.slug === s)) issues.push({ path: 'featuredTopicSlugs', message: `unknown topic "${s}"` })
  }
  const modules = parseAll(
    moduleDoc,
    catalog.modules.map((m) => {
      const en = record.safeParse(catalog.modulesEn[String(m.id)]).data ?? {}
      const ielts = record.safeParse(m.ielts).data ?? {}
      const topic = topicByModule.get(m.id)
      const featured = topic ? catalog.featuredTopicSlugs.indexOf(String(topic.slug)) : -1
      return {
        legacyId: m.id,
        slug: m.slug,
        stage: m.stage,
        title: m.title,
        difficulty: m.difficulty,
        estimatedMinutes: m.estimatedMinutes,
        topics: m.topics,
        summary: { bn: m.summary, en: en.summary },
        ielts: { importance: ielts.importance, priority: ielts.priority, note: { bn: ielts.note, en: en.ieltsNote } },
        topic: topic ? { slug: topic.slug, name: topic.name, description: topic.description, related: topic.related } : undefined,
        topicOrder: topicOrder.get(m.id),
        featuredRank: featured === -1 ? null : featured,
      }
    }),
    (m) => `modules.${String(field(m, 'legacyId'))}`,
    issues,
  )

  const lessonDocs = parseAll(
    lessonDoc,
    [...lessons.bn.map((l) => ({ ...l, language: 'bn' })), ...lessons.en.map((l) => ({ ...l, language: 'en' }))],
    (l) => `lessons.${String(field(l, 'moduleId'))}.${String(field(l, 'language'))}`,
    issues,
  )

  const positioned = (set: 'practice' | 'test', list: Record<string, unknown>[]) => {
    const seen = new Map<unknown, number>()
    return list.map((q) => {
      const position = seen.get(q.moduleId) ?? 0
      seen.set(q.moduleId, position + 1)
      return { ...q, set, position }
    })
  }
  const questionDocs = parseAll(
    questionDoc,
    [...positioned('practice', questions.practice), ...positioned('test', questions.test)],
    (q) => `questions.${String(field(q, 'id'))}`,
    issues,
  )

  for (const c of blog.categories) if (!(blogPostDoc.shape.category.options as readonly string[]).includes(c)) issues.push({ path: 'blog.categories', message: `unknown category "${c}"` })
  for (const slug of Object.keys(blog.articles)) if (!blog.posts.some((p) => p.slug === slug)) issues.push({ path: `blog.articles.${slug}`, message: 'article without a post' })
  const posts = parseAll(
    blogPostDoc,
    blog.posts.map((p) => ({ ...p, body: blog.articles[String(p.slug)] })),
    (p) => `posts.${String(field(p, 'slug'))}`,
    issues,
  )

  const content = { stages, modules, lessons: lessonDocs, questions: questionDocs, posts }
  if (!issues.length) issues.push(...checkContentIntegrity(content))
  if (issues.length) throw new ContentValidationError(issues)
  return content
}

export type SeedReport = Record<keyof ContentSet, Record<UpsertOutcome, number>>

/**
 * Upserts every document; running it again with the same content changes
 * nothing. Documents not in the snapshot (e.g. added through the admin API)
 * are left alone. Stable identity is enforced: a module whose legacy id is
 * already stored under a different slug or topic slug aborts the seed before
 * anything is written, because changing a slug breaks indexed URLs.
 */
export async function seedContent(repositories: ContentRepositories, content: ContentSet): Promise<SeedReport> {
  const issues: ContentIssue[] = []
  for (const m of content.modules) {
    const existing = await repositories.modules.find({ legacyId: m.legacyId })
    if (existing && existing.slug !== m.slug) issues.push({ path: `modules.${m.legacyId}.slug`, message: `stored as "${existing.slug}"; slugs never change` })
    if (existing && existing.topic.slug !== m.topic.slug) issues.push({ path: `modules.${m.legacyId}.topic.slug`, message: `stored as "${existing.topic.slug}"; slugs never change` })
  }
  if (issues.length) throw new ContentValidationError(issues)

  const report = {} as SeedReport
  const run = async <K extends keyof ContentSet>(key: K, upsert: (doc: ContentSet[K][number]) => Promise<UpsertOutcome>) => {
    const counts: Record<UpsertOutcome, number> = { inserted: 0, updated: 0, unchanged: 0 }
    for (const doc of content[key]) counts[await upsert(doc)] += 1
    report[key] = counts
  }
  await run('stages', (d) => repositories.stages.upsert(d))
  await run('modules', (d) => repositories.modules.upsert(d))
  await run('lessons', (d) => repositories.lessons.upsert(d))
  await run('questions', (d) => repositories.questions.upsert(d))
  await run('posts', (d) => repositories.posts.upsert(d))
  return report
}
