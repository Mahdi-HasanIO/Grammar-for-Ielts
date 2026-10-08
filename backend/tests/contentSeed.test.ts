import { describe, expect, it } from 'vitest'
import { createMemoryRepositories } from '../src/repositories/memory.js'
import { ContentValidationError, contentFromSnapshot, seedContent } from '../src/services/contentSeed.js'
import { readContentSnapshot } from './helpers.js'

type Rec = Record<string, unknown>
type Snapshot = ReturnType<typeof readContentSnapshot>

/** Applies a change to a fresh copy of the real snapshot and returns the validation messages. */
function problems(change: (s: { catalog: Rec & { modules: Rec[]; topics: Rec[]; featuredTopicSlugs: string[] }; lessons: { bn: Rec[]; en: Rec[] }; questions: { practice: Rec[]; test: Rec[] }; blog: { posts: Rec[]; articles: Rec } }) => void): string[] {
  const snapshot = readContentSnapshot() as unknown as Parameters<typeof change>[0]
  change(snapshot)
  try {
    contentFromSnapshot(snapshot as unknown as Snapshot)
    return []
  } catch (error) {
    if (!(error instanceof ContentValidationError)) throw error
    return error.issues.map((i) => `${i.path}: ${i.message}`)
  }
}

describe('the committed snapshot', () => {
  it('is valid and complete', () => {
    const content = contentFromSnapshot(readContentSnapshot())
    expect(content.stages).toHaveLength(5)
    expect(content.modules).toHaveLength(24)
    expect(content.lessons).toHaveLength(48)
    expect(content.questions).toHaveLength(336)
    expect(content.posts.length).toBeGreaterThan(0)
  })

  it('joins each module with its topic, English text and homepage rank', () => {
    const articles = contentFromSnapshot(readContentSnapshot()).modules.find((m) => m.topic.slug === 'articles')
    expect(articles?.summary.en).toBeTruthy()
    expect(articles?.summary.bn).toBeTruthy()
    expect(articles?.ielts.note.en).toBeTruthy()
    expect(articles?.featuredRank).toBe(0)
  })

  it('numbers questions within each module and set', () => {
    const questions = contentFromSnapshot(readContentSnapshot()).questions.filter((q) => q.moduleId === 1)
    expect(questions.filter((q) => q.set === 'practice').map((q) => q.position)).toEqual([0, 1, 2, 3])
    expect(questions.filter((q) => q.set === 'test').map((q) => q.position)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})

describe('integrity rules (mirroring the frontend content tests)', () => {
  it.each<[string, Parameters<typeof problems>[0], RegExp]>([
    ['a duplicate question id', (s) => { (s.questions.test[0] as Rec).id = s.questions.practice[0]?.id }, /duplicate question id/],
    ['a question for an unknown module', (s) => { (s.questions.practice[0] as Rec).moduleId = 999 }, /module 999 does not exist/],
    ['an answer that is not one of the options', (s) => {
      const q = s.questions.test.find((x) => Array.isArray(x.options)) as Rec
      q.answer = 'not an option'
    }, /the answer must be exactly one of the options/],
    ['repeated options', (s) => {
      const q = s.questions.test.find((x) => Array.isArray(x.options)) as Rec & { options: string[] }
      q.options = [q.options[0] as string, ...q.options]
    }, /options must be distinct/],
    ['a typed question with options', (s) => {
      const q = s.questions.test.find((x) => x.type === 'fill-blank') as Rec
      q.options = ['a', 'b']
    }, /is typed, so it has no options/],
    ['an AI-marked built-in question', (s) => { (s.questions.test[0] as Rec).source = 'ai' }, /questions\./],
    ['a missing practice question', (s) => { s.questions.practice.shift() }, /expected 4 practice questions, found 3/],
    ['a related topic that does not exist', (s) => { (s.catalog.topics[0] as Rec).related = ['no-such-topic'] }, /unknown topic "no-such-topic"/],
    ['a numeric slug', (s) => { (s.catalog.modules[0] as Rec).slug = '123' }, /a slug cannot be only digits/],
    ['an uppercase slug', (s) => { (s.catalog.modules[0] as Rec).slug = 'Sentence-Structure' }, /kebab-case/],
    ['a duplicate module slug', (s) => { (s.catalog.modules[1] as Rec).slug = s.catalog.modules[0]?.slug }, /duplicate module slug/],
    ['a module slug equal to another module\'s topic slug', (s) => { (s.catalog.modules[0] as Rec).slug = s.catalog.topics[1]?.slug }, /is another module's topic slug/],
    ['a featured topic that does not exist', (s) => { s.catalog.featuredTopicSlugs.push('ghost') }, /unknown topic "ghost"/],
    ['a module without English text', (s) => { delete (s.catalog.modulesEn as Rec)['1'] }, /modules\.1\.summary\.en/],
    ['a missing English lesson', (s) => { s.lessons.en.pop() }, /expected exactly one Bangla and one English lesson/],
    ['Bangla and English lessons that differ', (s) => { ((s.lessons.en[0] as Rec).keyTakeaways as string[]).push('extra') }, /differ in rules or item counts/],
    ['a rule id from another module', (s) => {
      for (const l of [s.lessons.bn[0], s.lessons.en[0]]) ((l as Rec).rules as Rec[])[0]!.id = 'm9-wrong'
    }, /must start with m1-/],
    ['a blog post without a body', (s) => { delete s.blog.articles[String(s.blog.posts[0]?.slug)] }, /an article needs a body|expected array/],
    ['a blog post tagged with an unknown topic', (s) => { (s.blog.posts[0] as Rec).topics = ['ghost'] }, /unknown topic "ghost"/],
    ['an invalid blog date', (s) => { (s.blog.posts[0] as Rec).date = '2026-13-01' }, /posts\..*date/],
  ])('rejects %s', (_name, change, expected) => {
    const found = problems(change)
    expect(found.join('\n')).toMatch(expected)
  })

  it('reports every problem at once', () => {
    const found = problems((s) => {
      ;(s.catalog.modules[0] as Rec).slug = '123'
      ;(s.questions.practice[0] as Rec).answer = ''
    })
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})

describe('seedContent', () => {
  it('inserts everything, and a second run changes nothing', async () => {
    const { content: repos } = createMemoryRepositories()
    const content = contentFromSnapshot(readContentSnapshot())
    const first = await seedContent(repos, content)
    expect(first.modules).toEqual({ inserted: 24, updated: 0, unchanged: 0 })
    expect(first.questions).toEqual({ inserted: 336, updated: 0, unchanged: 0 })
    const second = await seedContent(repos, content)
    for (const counts of Object.values(second)) expect(counts.inserted + counts.updated).toBe(0)
    expect(second.lessons.unchanged).toBe(48)
  })

  it('updates changed documents only', async () => {
    const { content: repos } = createMemoryRepositories()
    const content = contentFromSnapshot(readContentSnapshot())
    await seedContent(repos, content)
    content.posts[0]!.title = 'A new title'
    const report = await seedContent(repos, content)
    expect(report.posts).toMatchObject({ updated: 1, inserted: 0 })
    expect(report.modules.unchanged).toBe(24)
    expect((await repos.posts.find({ slug: content.posts[0]!.slug }))?.title).toBe('A new title')
  })

  it('refuses to change a stored module slug, and writes nothing', async () => {
    const { content: repos } = createMemoryRepositories()
    const content = contentFromSnapshot(readContentSnapshot())
    await seedContent(repos, content)
    const renamed = contentFromSnapshot(readContentSnapshot())
    renamed.modules[0]!.slug = 'renamed-module'
    renamed.posts[0]!.title = 'Should not be written'
    await expect(seedContent(repos, renamed)).rejects.toThrow(/slugs never change/)
    expect((await repos.posts.find({ slug: content.posts[0]!.slug }))?.title).toBe(content.posts[0]!.title)
  })

  it('leaves documents that are not in the snapshot alone', async () => {
    const { content: repos } = createMemoryRepositories()
    const content = contentFromSnapshot(readContentSnapshot())
    const extra = { ...content.posts[0]!, slug: 'admin-only-post' }
    await repos.posts.upsert(extra)
    await seedContent(repos, content)
    expect(await repos.posts.find({ slug: 'admin-only-post' })).not.toBeNull()
  })
})
