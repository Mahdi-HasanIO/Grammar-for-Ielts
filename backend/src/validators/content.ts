import { z } from 'zod'

/*
 * Content documents (stages, modules, lessons, questions, blog posts) and the
 * integrity rules they must satisfy. The rules mirror the React app's content
 * tests (slugs, lesson parity, question integrity) without importing them:
 * the backend never imports from the frontend. Used by the seed script on the
 * exported snapshots (backend/seed/*.json) and by the admin API on each write.
 */

export const LESSON_LANGUAGES = ['bn', 'en'] as const
export const QUESTION_SETS = ['practice', 'test'] as const
export const QUESTION_TYPES = ['multiple-choice', 'fill-blank', 'choose-correct-sentence', 'error-correction', 'rewrite'] as const
/** Types answered by picking an option; the others are typed in and have no options. */
export const OPTION_TYPES: readonly string[] = ['multiple-choice', 'choose-correct-sentence', 'error-correction']
export const DIFFICULTIES = ['Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Proficient'] as const
export const IELTS_IMPORTANCE = ['Very High', 'High', 'Medium', 'Situational'] as const
export const IELTS_PRIORITY = ['Essential for Band 8', 'High-value enhancement', 'Optional'] as const
export const BLOG_CATEGORIES = ['Grammar Tips', 'IELTS Writing', 'Task 1', 'Task 2', 'Study Strategy'] as const

/** The frontend's question counts per module (its question-integrity test and TEST_LENGTH). */
export const PRACTICE_PER_MODULE = 4
export const TEST_PER_MODULE = 10

/** Lowercase kebab-case, never purely numeric (a numeric slug would be read as a legacy id). */
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const slug = z
  .string()
  .regex(KEBAB, 'expected a lowercase kebab-case slug')
  .refine((value) => !/^\d+$/.test(value), 'a slug cannot be only digits')

const text = z.string().trim().min(1, 'must not be empty')
const optionalText = z.string().optional()
const bilingual = z.object({ bn: text, en: text })
const stageId = z.number().int().min(1).max(5)
const legacyId = z.number().int().min(1).max(999_999)
const isoDate = z.iso.date('expected a date like 2026-01-31')

export const stageDoc = z.object({ id: stageId, name: text, tagline: bilingual, description: bilingual })

export const moduleDoc = z.object({
  legacyId,
  slug,
  stage: stageId,
  title: text,
  difficulty: z.enum(DIFFICULTIES),
  estimatedMinutes: z.number().int().min(1).max(600),
  /** Grammar points covered (chips on the module page). */
  topics: z.array(text).max(50),
  summary: bilingual,
  ielts: z.object({ importance: z.enum(IELTS_IMPORTANCE), priority: z.enum(IELTS_PRIORITY), note: bilingual }),
  /** The public grammar-topic view of the module (/grammar/:slug). */
  topic: z.object({ slug, name: text, description: text, related: z.array(slug).max(20) }),
  /** Position in the /grammar topic list. */
  topicOrder: z.number().int().min(0),
  /** Position on the homepage, or null when not featured. */
  featuredRank: z.number().int().min(0).nullable(),
})

const examplePair = z.object({ wrong: optionalText, right: text, note: optionalText })

const ruleBlock = z.object({
  id: text,
  heading: text,
  rule: text,
  whenToUse: text,
  structure: z.array(z.string()),
  notes: z.array(z.string()).optional(),
  table: z.object({ caption: optionalText, headers: z.array(z.string()), rows: z.array(z.array(z.string())) }).optional(),
  examples: z.array(examplePair).optional(),
})

export const lessonDoc = z.object({
  moduleId: legacyId,
  language: z.enum(LESSON_LANGUAGES),
  intro: text,
  rules: z.array(ruleBlock).min(1, 'a lesson needs at least one rule'),
  examples: z.array(examplePair),
  mistakes: z.array(z.object({ wrong: text, right: text, explanation: text })),
  keyTakeaways: z.array(text),
})

export const questionDoc = z
  .object({
    id: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, 'expected an id of letters, digits, - and _'),
    moduleId: legacyId,
    set: z.enum(QUESTION_SETS),
    /** Order within the module's practice or test set. */
    position: z.number().int().min(0),
    type: z.enum(QUESTION_TYPES),
    question: text,
    prompt: optionalText,
    options: z.array(z.string()).optional(),
    answer: text,
    acceptable: z.array(text).optional(),
    explanation: text,
    // Built-in content is never AI-generated.
    source: z.literal('static').optional(),
  })
  .superRefine((q, ctx) => {
    const options = q.options ?? []
    if (OPTION_TYPES.includes(q.type)) {
      if (options.length < 2) ctx.addIssue({ code: 'custom', path: ['options'], message: 'needs at least two options' })
      if (new Set(options).size !== options.length) ctx.addIssue({ code: 'custom', path: ['options'], message: 'options must be distinct' })
      if (options.some((o) => !o.trim())) ctx.addIssue({ code: 'custom', path: ['options'], message: 'options must not be empty' })
      // The answer index: exactly one option is the answer.
      if (options.filter((o) => o === q.answer).length !== 1) ctx.addIssue({ code: 'custom', path: ['answer'], message: 'the answer must be exactly one of the options' })
    } else if (options.length) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: `a ${q.type} question is typed, so it has no options` })
    }
  })

const blogBlock = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text }),
  z.object({ type: z.literal('h2'), text }),
  z.object({ type: z.literal('list'), items: z.array(text).min(1), ordered: z.boolean().optional() }),
  z.object({ type: z.literal('example'), wrong: text, right: text, note: optionalText }),
  z.object({ type: z.literal('tip'), title: optionalText, text }),
])

export const blogPostDoc = z.object({
  slug,
  title: text,
  excerpt: text,
  coverAlt: text,
  category: z.enum(BLOG_CATEGORIES),
  date: isoDate,
  readingMinutes: z.number().int().min(1).max(600),
  featured: z.boolean().optional(),
  /** Grammar topic slugs the article links to. */
  topics: z.array(slug),
  body: z.array(blogBlock).min(1, 'an article needs a body'),
})

export type StageDoc = z.output<typeof stageDoc>
export type ModuleDoc = z.output<typeof moduleDoc>
export type LessonDoc = z.output<typeof lessonDoc>
export type QuestionDoc = z.output<typeof questionDoc>
export type BlogPostDoc = z.output<typeof blogPostDoc>

export interface ContentSet {
  stages: StageDoc[]
  modules: ModuleDoc[]
  lessons: LessonDoc[]
  questions: QuestionDoc[]
  posts: BlogPostDoc[]
}

export interface ContentIssue {
  path: string
  message: string
}

const duplicates = <T>(values: readonly T[]) => [...new Set(values.filter((v, i) => values.indexOf(v) !== i))]

/** Language-independent lesson shape: rule ids, list lengths and table sizes. Bangla and English must match. */
function lessonShape(lesson: LessonDoc) {
  return JSON.stringify({
    rules: lesson.rules.map((r) => ({
      id: r.id,
      structure: r.structure.length,
      notes: r.notes?.length ?? 0,
      table: r.table ? { headers: r.table.headers.length, rows: r.table.rows.map((row) => row.length) } : null,
      examples: r.examples?.length ?? 0,
    })),
    examples: lesson.examples.length,
    mistakes: lesson.mistakes.length,
    keyTakeaways: lesson.keyTakeaways.length,
  })
}

/**
 * Cross-document rules for a complete content set: unique ids and slugs,
 * references that resolve, lesson parity and question counts. Each document
 * must already be valid on its own (the schemas above).
 */
export function checkContentIntegrity({ stages, modules, lessons, questions, posts }: ContentSet): ContentIssue[] {
  const issues: ContentIssue[] = []
  const fail = (path: string, message: string) => issues.push({ path, message })

  for (const id of duplicates(stages.map((s) => s.id))) fail(`stages.${id}`, 'duplicate stage id')
  const stageIds = new Set(stages.map((s) => s.id))

  for (const id of duplicates(modules.map((m) => m.legacyId))) fail(`modules.${id}`, 'duplicate module id')
  for (const s of duplicates(modules.map((m) => m.slug))) fail(`modules.${s}`, 'duplicate module slug')
  for (const s of duplicates(modules.map((m) => m.topic.slug))) fail(`topics.${s}`, 'duplicate topic slug')
  const moduleIds = new Set(modules.map((m) => m.legacyId))
  const topicSlugs = new Set(modules.map((m) => m.topic.slug))
  for (const m of modules) {
    if (!stageIds.has(m.stage)) fail(`modules.${m.legacyId}.stage`, `stage ${m.stage} does not exist`)
    for (const related of m.topic.related) {
      if (!topicSlugs.has(related)) fail(`modules.${m.legacyId}.topic.related`, `unknown topic "${related}"`)
    }
    // resolveModule() tries module slugs first, so a clash would open the wrong lesson.
    if (modules.some((other) => other !== m && other.topic.slug === m.slug)) fail(`modules.${m.legacyId}.slug`, `"${m.slug}" is another module's topic slug`)
  }

  for (const m of modules) {
    const bn = lessons.filter((l) => l.moduleId === m.legacyId && l.language === 'bn')
    const en = lessons.filter((l) => l.moduleId === m.legacyId && l.language === 'en')
    if (bn.length !== 1 || en.length !== 1) {
      fail(`lessons.${m.legacyId}`, 'expected exactly one Bangla and one English lesson')
      continue
    }
    const [bnLesson, enLesson] = [bn[0], en[0]] as [LessonDoc, LessonDoc]
    const ruleIds = bnLesson.rules.map((r) => r.id)
    for (const id of duplicates(ruleIds)) fail(`lessons.${m.legacyId}.rules`, `duplicate rule id "${id}"`)
    for (const id of ruleIds) if (!id.startsWith(`m${m.legacyId}-`)) fail(`lessons.${m.legacyId}.rules`, `rule id "${id}" must start with m${m.legacyId}-`)
    if (lessonShape(bnLesson) !== lessonShape(enLesson)) fail(`lessons.${m.legacyId}`, 'the Bangla and English lessons differ in rules or item counts')
  }
  for (const l of lessons) if (!moduleIds.has(l.moduleId)) fail(`lessons.${l.moduleId}`, 'lesson for an unknown module')

  for (const id of duplicates(questions.map((q) => q.id))) fail(`questions.${id}`, 'duplicate question id')
  for (const q of questions) if (!moduleIds.has(q.moduleId)) fail(`questions.${q.id}.moduleId`, `module ${q.moduleId} does not exist`)
  for (const m of modules) {
    const practice = questions.filter((q) => q.moduleId === m.legacyId && q.set === 'practice').length
    const test = questions.filter((q) => q.moduleId === m.legacyId && q.set === 'test').length
    if (practice !== PRACTICE_PER_MODULE) fail(`questions.module-${m.legacyId}`, `expected ${PRACTICE_PER_MODULE} practice questions, found ${practice}`)
    if (test !== TEST_PER_MODULE) fail(`questions.module-${m.legacyId}`, `expected ${TEST_PER_MODULE} test questions, found ${test}`)
  }

  for (const s of duplicates(posts.map((p) => p.slug))) fail(`posts.${s}`, 'duplicate blog slug')
  for (const p of posts) {
    for (const topic of p.topics) if (!topicSlugs.has(topic)) fail(`posts.${p.slug}.topics`, `unknown topic "${topic}"`)
  }
  return issues
}
