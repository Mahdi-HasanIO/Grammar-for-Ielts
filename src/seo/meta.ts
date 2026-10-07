import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/config/site'
import { BLOG_POST_INDEX, blogPostBySlug, GRAMMAR_TOPIC_MODULES, moduleByTopicSlug, resolveModule } from '@/content/catalog'
import { postCover } from '@/content/blog'
import { blogPostPath, grammarTopicPath } from '@/content/paths'
import { modulePath, moduleTestPath } from '@/content/paths'

/*
 * One source of truth for page metadata. The build-time prerenderer writes
 * these tags into each static HTML file, and <SeoManager> keeps them in sync
 * as the user navigates client-side.
 */

export type HeadTag =
  | { tag: 'title'; text: string }
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'jsonld'; json: Record<string, unknown> }

export interface PageSeo {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  /** Private or per-learner pages: kept out of search results. */
  noindex?: boolean
  jsonLd?: Record<string, unknown>[]
  article?: { published: string; section: string }
}

const ORGANIZATION = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/icons/icon-512.png'), width: 512, height: 512 },
}

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

const PRIVATE: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/review': 'Review',
  '/progress': 'Progress',
  '/settings': 'Settings',
  '/bookmarks': 'Bookmarks',
}

/** Normalises a pathname: no trailing slash (except root), no query or hash. */
export function normalizePath(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') : '/'
}

export function getSeo(pathname: string): PageSeo {
  const path = normalizePath(pathname)

  if (path === '/') {
    return {
      title: `${SITE_NAME} – IELTS Writing Grammar Course for Band 7-8+`,
      description: SITE_DESCRIPTION,
      path,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: ['en', 'bn'],
          publisher: ORGANIZATION,
        },
      ],
    }
  }

  if (path === '/grammar') {
    return {
      title: `IELTS Grammar Topics: Rules, Common Mistakes & Practice | ${SITE_NAME}`,
      description: `Browse ${GRAMMAR_TOPIC_MODULES.length} IELTS writing grammar topics, from articles and tenses to conditionals and nominalization. Key rules, common mistakes and quick practice for each.`,
      path,
      jsonLd: [breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Grammar', path: '/grammar' }])],
    }
  }

  const grammarMatch = path.match(/^\/grammar\/([^/]+)$/)
  if (grammarMatch) {
    const topic = moduleByTopicSlug(grammarMatch[1])?.topic
    if (topic) {
      return {
        title: `${topic.name} for IELTS Writing: Rules, Mistakes & Practice | ${SITE_NAME}`,
        description: `${topic.description} Free IELTS practice included.`,
        path,
        jsonLd: [
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Grammar', path: '/grammar' },
            { name: topic.name, path },
          ]),
        ],
      }
    }
  }

  if (path === '/blog') {
    return {
      title: `IELTS Grammar Blog: Writing Tips for Band 7-8+ | ${SITE_NAME}`,
      description:
        'Practical, exam-focused articles on the grammar that moves IELTS Writing band scores: common mistakes, complex sentences, articles, Task 1 trends and hedging.',
      path,
      jsonLd: [breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])],
    }
  }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/)
  if (blogMatch) {
    const post = blogPostBySlug(blogMatch[1])
    if (post) {
      const cover = postCover(post)
      return {
        title: `${post.title} | ${SITE_NAME}`,
        description: post.excerpt,
        path,
        image: cover.og,
        imageAlt: cover.alt,
        type: 'article',
        article: { published: post.date, section: post.category },
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: [absoluteUrl(cover.og), absoluteUrl(cover.srcSet.split(', ')[1].split(' ')[0])],
            datePublished: post.date,
            dateModified: post.date,
            articleSection: post.category,
            inLanguage: 'en',
            mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
            author: ORGANIZATION,
            publisher: ORGANIZATION,
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
        ],
      }
    }
  }

  if (path === '/practice') {
    return {
      title: `Free IELTS Grammar Practice Questions | ${SITE_NAME}`,
      description:
        'Practise IELTS writing grammar by topic with instant feedback, take module tests, and generate fresh AI practice questions for every lesson.',
      path,
    }
  }

  if (path === '/course') {
    return {
      title: `IELTS Grammar Course: 24 Modules in 5 Stages | ${SITE_NAME}`,
      description:
        'A sequential IELTS writing grammar course: 24 modules across five stages, from sentence accuracy to academic style, each with a lesson in English and Bangla, practice and a test.',
      path,
    }
  }

  // Course lessons are per-learner, so they stay out of search. /module/:id is the canonical URL;
  // /module/:slug, /learn/:slug and their /test forms are aliases that redirect to it.
  const lessonMatch = path.match(/^\/(?:module|learn)\/([^/]+)(\/test)?$/)
  const lesson = lessonMatch ? resolveModule(lessonMatch[1]) : undefined
  if (lessonMatch && lesson) {
    return {
      title: `Course lesson | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      path: lessonMatch[2] ? moduleTestPath(lesson.legacyId) : modulePath(lesson.legacyId),
      noindex: true,
    }
  }

  if (PRIVATE[path]) {
    return { title: `${PRIVATE[path]} | ${SITE_NAME}`, description: SITE_DESCRIPTION, path, noindex: true }
  }

  return { title: SITE_NAME, description: SITE_DESCRIPTION, path, noindex: true }
}

export function headTags(seo: PageSeo): HeadTag[] {
  const url = absoluteUrl(seo.path)
  const image = absoluteUrl(seo.image ?? DEFAULT_OG_IMAGE)
  const imageAlt = seo.imageAlt ?? `${SITE_NAME}: master the grammar behind Band 8 writing`
  const tags: HeadTag[] = [
    { tag: 'title', text: seo.title },
    { tag: 'meta', attrs: { name: 'description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'robots', content: seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:type', content: seo.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:title', content: seo.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seo.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: imageAlt } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_GB' } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seo.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: imageAlt } },
  ]
  if (seo.article) {
    tags.push(
      { tag: 'meta', attrs: { property: 'article:published_time', content: seo.article.published } },
      { tag: 'meta', attrs: { property: 'article:section', content: seo.article.section } },
    )
  }
  for (const json of seo.jsonLd ?? []) tags.push({ tag: 'jsonld', json })
  return tags
}

const escapeAttr = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Serialises tags for the static HTML written at build time. */
export function headTagsToHtml(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      switch (t.tag) {
        case 'title':
          return `<title data-seo>${escapeAttr(t.text)}</title>`
        case 'jsonld':
          return `<script type="application/ld+json" data-seo>${JSON.stringify(t.json).replace(/</g, '\\u003c')}</script>`
        default: {
          const attrs = Object.entries(t.attrs)
            .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
            .join(' ')
          return `<${t.tag} ${attrs} data-seo>`
        }
      }
    })
    .join('\n    ')
}

/** Public pages rendered to static HTML at build time, and listed in sitemap.xml. */
export function indexableRoutes(): { path: string; lastmod?: string; priority: number; prerender: boolean }[] {
  const latest = BLOG_POST_INDEX[0]?.date
  return [
    { path: '/', priority: 1, prerender: true, lastmod: latest },
    { path: '/grammar', priority: 0.9, prerender: true },
    ...GRAMMAR_TOPIC_MODULES.map((m) => ({ path: grammarTopicPath(m.topic.slug), priority: 0.8, prerender: true })),
    { path: '/blog', priority: 0.8, prerender: true, lastmod: latest },
    ...BLOG_POST_INDEX.map((p) => ({ path: blogPostPath(p.slug), priority: 0.7, prerender: true, lastmod: p.date })),
    { path: '/practice', priority: 0.6, prerender: true },
    // The course roadmap reads learner progress, so it is rendered in the browser only.
    { path: '/course', priority: 0.7, prerender: false },
  ]
}
