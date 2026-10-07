import type { BlogPostMeta } from '@/data/blog/posts'

/*
 * Blog presentation helpers. They work on post records from ContentService
 * (or the catalogue) and never read the content store themselves, so they
 * keep working when posts come from an API instead of the bundled files.
 */

/** The post to feature: the one marked `featured`, else the newest. Expects newest-first order. */
export function featuredPost(posts: readonly BlogPostMeta[]): BlogPostMeta {
  return posts.find((p) => p.featured) ?? posts[0]
}

/** Posts sharing a category or grammar topic with the given post. */
export function relatedPosts(post: BlogPostMeta, posts: readonly BlogPostMeta[], limit = 3): BlogPostMeta[] {
  return posts
    .filter((p) => p.slug !== post.slug)
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "22 Sep 2026". Formatted by hand so build-time HTML and the browser always agree. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/* Covers are bundled in /public/blog/covers so they are cached for offline reading. */
const COVER_SLUGS = new Set([
  'common-grammar-mistakes-in-ielts',
  'how-to-improve-ielts-writing-grammar',
  'how-to-use-complex-sentences-in-ielts',
  'articles-a-an-the-for-ielts',
  'describing-trends-in-ielts-task-1',
  'hedging-in-ielts-task-2',
  'ielts-grammar-study-plan',
])

export interface CoverImage {
  src: string
  srcSet: string
  /** 1200x630 JPEG for Open Graph and Twitter cards. */
  og: string
  alt: string
  width: number
  height: number
}

export function postCover(post: Pick<BlogPostMeta, 'slug' | 'coverAlt'>): CoverImage {
  const known = COVER_SLUGS.has(post.slug)
  const base = `/blog/covers/${known ? post.slug : 'default'}`
  return {
    src: `${base}-800.webp`,
    srcSet: `${base}-800.webp 800w, ${base}-1600.webp 1600w`,
    og: `${base}-og.jpg`,
    alt: known ? post.coverAlt : 'Grammar for IELTS article cover',
    width: 1600,
    height: 900,
  }
}
