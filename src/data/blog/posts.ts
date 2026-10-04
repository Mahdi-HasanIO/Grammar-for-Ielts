import { ARTICLES, articleWordCount } from './articles'

/* Blog metadata. Bodies live in ./articles.ts; reading time is derived from them. */

export const BLOG_CATEGORIES = [
  'Grammar Tips',
  'IELTS Writing',
  'Task 1',
  'Task 2',
  'Study Strategy',
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** Derived from the article length at roughly 200 words per minute. */
  readingMinutes: number
  featured?: boolean
  /** Grammar topic slugs this article links to. */
  topics: string[]
}

const POSTS: Omit<BlogPostMeta, 'readingMinutes'>[] = [
  {
    slug: 'common-grammar-mistakes-in-ielts',
    title: '10 Common Grammar Mistakes in IELTS Writing (and How to Fix Them)',
    excerpt:
      'The errors examiners see most often are not advanced at all. Here are the ten that cost the most marks, with a quick fix for each.',
    category: 'Grammar Tips',
    date: '2026-09-22',
    featured: true,
    topics: ['subject-verb-agreement', 'articles', 'sentence-boundaries', 'linking-clauses'],
  },
  {
    slug: 'how-to-improve-ielts-writing-grammar',
    title: 'How to Improve Your IELTS Writing Grammar Score',
    excerpt:
      'What Grammatical Range and Accuracy actually measures, why accuracy comes before complexity, and a practical plan to move from Band 6 to Band 7 and beyond.',
    category: 'IELTS Writing',
    date: '2026-09-10',
    topics: ['sentence-structure', 'linking-clauses', 'relative-clauses'],
  },
  {
    slug: 'how-to-use-complex-sentences-in-ielts',
    title: 'How to Use Complex Sentences in IELTS (Without Making Errors)',
    excerpt:
      'Complex sentences only help your band score when they are accurate. Five safe structures, the mistakes to avoid, and how many you really need.',
    category: 'Task 2',
    date: '2026-08-28',
    topics: ['linking-clauses', 'relative-clauses', 'conditionals', 'participial-clauses'],
  },
  {
    slug: 'articles-a-an-the-for-ielts',
    title: 'A, An or The? A Simple Article System for IELTS Writers',
    excerpt:
      'Articles are small, but a single essay needs around a hundred article decisions. A three-question system that makes them almost automatic.',
    category: 'Grammar Tips',
    date: '2026-08-14',
    topics: ['articles', 'subject-verb-agreement'],
  },
  {
    slug: 'describing-trends-in-ielts-task-1',
    title: 'Describing Trends in IELTS Task 1: Grammar That Gets the Numbers Right',
    excerpt:
      'Rose by or rose to? A sharp rise or rose sharply? The small grammar choices that decide whether your Task 1 report is accurate.',
    category: 'Task 1',
    date: '2026-07-30',
    topics: ['prepositions', 'comparisons', 'tenses'],
  },
  {
    slug: 'hedging-in-ielts-task-2',
    title: 'Sound Academic Without Overclaiming: Hedging in IELTS Task 2',
    excerpt:
      'Absolute claims invite counter-examples. Learn the hedging toolkit that keeps your arguments strong, measured and defensible.',
    category: 'Task 2',
    date: '2026-07-16',
    topics: ['hedging', 'modal-verbs', 'conditionals'],
  },
  {
    slug: 'ielts-grammar-study-plan',
    title: 'A 6-Week IELTS Grammar Study Plan That Actually Works',
    excerpt:
      'Studying grammar in the right order saves weeks. A week-by-week plan that builds accuracy first, then complexity, then style.',
    category: 'Study Strategy',
    date: '2026-07-02',
    topics: ['sentence-structure', 'tenses', 'linking-clauses', 'nominalization'],
  },
]

/** Newest first. */
export const BLOG_POSTS: BlogPostMeta[] = POSTS.map((p) => ({
  ...p,
  readingMinutes: Math.max(2, Math.round(articleWordCount(ARTICLES[p.slug] ?? []) / 200)),
})).sort((a, b) => b.date.localeCompare(a.date))

export function postBySlug(slug: string | undefined): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function featuredPost(): BlogPostMeta {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0]
}

/** Posts sharing a category or grammar topic with the given post. */
export function relatedPosts(post: BlogPostMeta, limit = 3): BlogPostMeta[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score:
        (p.category === post.category ? 2 : 0) +
        p.topics.filter((t) => post.topics.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((x) => x.post)
}

export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
