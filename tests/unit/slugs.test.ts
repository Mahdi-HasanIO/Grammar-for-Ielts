import { describe, expect, it } from 'vitest'
import {
  GRAMMAR_MODULES,
  moduleByLegacyId,
  moduleBySlug,
  moduleByTopicSlug,
  resolveModule,
} from '@/content/catalog'
import { MODULES } from '@/data/modules'
import { GRAMMAR_TOPICS } from '@/data/grammarTopics'
import { BLOG_POSTS } from '@/data/blog/posts'
import { blogPostPath, grammarTopicPath, learnPath, learnTestPath, modulePath, moduleTestPath } from '@/content/paths'
import { contentService } from '@/services/content'

/*
 * Identity is pinned here on purpose. Module slugs will become database keys
 * and URLs; topic and blog slugs are already indexed by search engines; legacy
 * ids key every learner's saved progress. Changing any value in these tables
 * breaks one of those, so it must be a deliberate migration, not an edit.
 */
const IDENTITY: [legacyId: number, moduleSlug: string, topicSlug: string][] = [
  [1, 'clause-anatomy-and-word-order', 'sentence-structure'],
  [2, 'subject-verb-agreement', 'subject-verb-agreement'],
  [3, 'articles-and-determiners', 'articles'],
  [4, 'pronoun-reference', 'pronouns'],
  [5, 'sentence-boundaries', 'sentence-boundaries'],
  [6, 'tense-and-aspect', 'tenses'],
  [7, 'modal-verbs', 'modal-verbs'],
  [8, 'passive-voice', 'passive-voice'],
  [9, 'verb-complementation', 'verb-patterns'],
  [10, 'prepositional-patterns', 'prepositions'],
  [11, 'comparison-and-quantity', 'comparisons'],
  [12, 'coordination-and-subordination', 'linking-clauses'],
  [13, 'relative-clauses', 'relative-clauses'],
  [14, 'noun-clauses-and-extraposition', 'noun-clauses'],
  [15, 'conditionals', 'conditionals'],
  [16, 'parallelism', 'parallelism'],
  [17, 'reduced-and-participle-clauses', 'participial-clauses'],
  [18, 'complex-noun-phrases', 'nominalization'],
  [19, 'hedging-and-stance', 'hedging'],
  [20, 'information-packaging', 'information-structure'],
  [21, 'grammatical-cohesion', 'cohesion'],
  [22, 'clefts-and-inversion', 'inversion'],
  [23, 'concision-and-ambiguity', 'concision'],
  [24, 'register-and-sentence-variety', 'register-and-punctuation'],
]

const BLOG_SLUGS = [
  'common-grammar-mistakes-in-ielts',
  'how-to-improve-ielts-writing-grammar',
  'how-to-use-complex-sentences-in-ielts',
  'articles-a-an-the-for-ielts',
  'describing-trends-in-ielts-task-1',
  'hedging-in-ielts-task-2',
  'ielts-grammar-study-plan',
]

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

describe('stable identity', () => {
  it('keeps every module’s legacy id, stable slug and public topic slug unchanged', () => {
    expect(GRAMMAR_MODULES.map((m) => [m.legacyId, m.slug, m.topic.slug])).toEqual(IDENTITY)
  })

  it('keeps blog slugs unchanged', () => {
    expect(BLOG_POSTS.map((p) => p.slug)).toEqual(BLOG_SLUGS)
  })

  it('includes every course module and every grammar topic exactly once', () => {
    expect(GRAMMAR_MODULES).toHaveLength(MODULES.length)
    expect(GRAMMAR_MODULES.map((m) => m.legacyId)).toEqual(MODULES.map((m) => m.id))
    expect(GRAMMAR_MODULES.map((m) => m.topic.slug).sort()).toEqual(GRAMMAR_TOPICS.map((t) => t.slug).sort())
  })

  it('joins each module to the topic that points at it', () => {
    for (const m of GRAMMAR_MODULES) {
      expect(m.topic.moduleId).toBe(m.legacyId)
      expect(m.module.id).toBe(m.legacyId)
      expect(m.slug).toBe(m.module.slug)
      expect(m.stage).toBe(m.module.stage)
    }
  })
})

describe('slug rules', () => {
  const moduleSlugs = GRAMMAR_MODULES.map((m) => m.slug)
  const topicSlugs = GRAMMAR_MODULES.map((m) => m.topic.slug)

  it('uses lowercase kebab-case slugs that are never numeric', () => {
    for (const slug of [...moduleSlugs, ...topicSlugs, ...BLOG_SLUGS]) {
      expect(slug).toMatch(KEBAB)
      // A purely numeric slug would be read as a legacy id.
      expect(slug).not.toMatch(/^\d+$/)
    }
  })

  it('has unique module slugs, topic slugs and blog slugs', () => {
    expect(new Set(moduleSlugs).size).toBe(moduleSlugs.length)
    expect(new Set(topicSlugs).size).toBe(topicSlugs.length)
    expect(new Set(BLOG_SLUGS).size).toBe(BLOG_SLUGS.length)
  })

  it('never uses one module’s slug as another module’s topic slug', () => {
    // resolveModule() tries module slugs first, so such a clash would open the wrong lesson.
    for (const m of GRAMMAR_MODULES) {
      const clash = GRAMMAR_MODULES.find((other) => other !== m && other.topic.slug === m.slug)
      expect(clash, m.slug).toBeUndefined()
    }
  })

  it('has related-topic links that all point at existing topics', () => {
    const known = new Set(topicSlugs)
    for (const m of GRAMMAR_MODULES) {
      for (const related of m.topic.related) expect(known.has(related), `${m.topic.slug} → ${related}`).toBe(true)
    }
  })

  it('has blog topic tags that all point at existing grammar topics', () => {
    const known = new Set(topicSlugs)
    for (const post of BLOG_POSTS) {
      for (const topic of post.topics) expect(known.has(topic), `${post.slug} → ${topic}`).toBe(true)
    }
  })
})

describe('resolving a module reference', () => {
  it.each(IDENTITY)('finds module %i by number, digit string, module slug and topic slug', (id, slug, topicSlug) => {
    const expected = moduleByLegacyId(id)
    expect(expected).toBeDefined()
    expect(resolveModule(id)).toBe(expected)
    expect(resolveModule(String(id))).toBe(expected)
    expect(resolveModule(slug)).toBe(expected)
    expect(resolveModule(topicSlug)).toBe(expected)
    expect(moduleBySlug(slug)).toBe(expected)
    expect(moduleByTopicSlug(topicSlug)).toBe(expected)
  })

  it.each([0, 25, -1, 1.5, '0', '25', '', 'Articles', 'articles ', 'not-a-module', undefined])(
    'returns undefined for %j',
    (ref) => {
      expect(resolveModule(ref as string | number | undefined)).toBeUndefined()
    },
  )

  it('is what the content service uses', async () => {
    expect(await contentService.getModule('articles-and-determiners')).toBe(moduleByLegacyId(3))
    expect(await contentService.getModule(3)).toBe(moduleByLegacyId(3))
    expect(await contentService.getGrammarTopic('articles')).toBe(moduleByLegacyId(3))
    // A module slug is not a public topic URL.
    expect(await contentService.getGrammarTopic('articles-and-determiners')).toBeUndefined()
  })
})

describe('URL builders', () => {
  it('keep numeric /module/:id as the canonical lesson URL and leave public URLs unchanged', () => {
    expect(modulePath(3)).toBe('/module/3')
    expect(moduleTestPath(3)).toBe('/module/3/test')
    expect(learnPath('articles-and-determiners')).toBe('/learn/articles-and-determiners')
    expect(learnTestPath('articles-and-determiners')).toBe('/learn/articles-and-determiners/test')
    expect(grammarTopicPath('articles')).toBe('/grammar/articles')
    expect(blogPostPath('hedging-in-ielts-task-2')).toBe('/blog/hedging-in-ielts-task-2')
  })
})

