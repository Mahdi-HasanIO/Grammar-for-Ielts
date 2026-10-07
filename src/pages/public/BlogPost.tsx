import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, Lightbulb, X } from 'lucide-react'
import { contentService, useContent, type BlogBlock } from '@/services/content'
import { postCover, relatedPosts } from '@/content/blog'
import { blogPostPath, grammarTopicPath } from '@/content/paths'
import { Reveal } from '@/components/ui/Reveal'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { Blob } from '@/components/public/motion'
import { BookmarkButton } from '@/components/BookmarkButton'
import { BlogCard, Breadcrumbs, Container, PostMeta, RichText } from '@/components/public/PublicUi'
import { useCourseCta } from '@/hooks/useCourseCta'

function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setPct(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-brand-500 via-accent-500 to-brand-400"
        style={{ transform: `scaleX(${pct})` }}
      />
    </div>
  )
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-10 text-[22px] font-extrabold leading-snug tracking-tight text-ink-900 sm:text-[24px] dark:text-ink-50">
          {block.text}
        </h2>
      )
    case 'p':
      return (
        <p className="mt-4 text-[16.5px] leading-8 text-ink-700 dark:text-ink-300">
          <RichText text={block.text} />
        </p>
      )
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className="mt-4 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[16px] leading-7 text-ink-700 dark:text-ink-300">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-700 ring-1 ring-inset ring-brand-200/70 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-800/60">
                {block.ordered ? i + 1 : <Check size={12} strokeWidth={3} />}
              </span>
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </Tag>
      )
    }
    case 'example':
      return (
        <div className="mt-5 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card sm:p-5 dark:border-ink-800 dark:bg-ink-900">
          <p className="flex gap-2.5 font-serif text-[15.5px] leading-7 text-rose-700 dark:text-rose-300">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
              <X size={12} strokeWidth={3} />
            </span>
            <span className="line-through decoration-rose-300/80 decoration-1 dark:decoration-rose-700">
              <span className="sr-only">Incorrect: </span>
              {block.wrong}
            </span>
          </p>
          <p className="mt-2 flex gap-2.5 font-serif text-[15.5px] leading-7 text-emerald-800 dark:text-emerald-300">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>
              <span className="sr-only">Correct: </span>
              {block.right}
            </span>
          </p>
          {block.note ? (
            <p className="mt-3 border-t border-dashed border-ink-200 pt-3 text-[14px] text-ink-600 dark:border-ink-700 dark:text-ink-400">
              {block.note}
            </p>
          ) : null}
        </div>
      )
    case 'tip':
      return (
        <aside className="mt-8 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/40 px-5 py-4 dark:border-amber-900/60 dark:from-amber-950/40 dark:to-ink-900">
          <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-300">
            <Lightbulb size={14} /> {block.title ?? 'Tip'}
          </p>
          <p className="mt-2 text-[15.5px] leading-7 text-amber-950 dark:text-amber-100">
            <RichText text={block.text} />
          </p>
        </aside>
      )
  }
}

export function BlogPost() {
  const { slug = '' } = useParams()
  const article = useContent(contentService.getBlogPost(slug))
  const grammarTopics = useContent(contentService.getGrammarTopics())
  const allPosts = useContent(contentService.getBlogPosts())
  const cta = useCourseCta()

  if (!article) return <Navigate to="/blog" replace />
  const { meta: post, blocks } = article
  const topics = post.topics.flatMap((t) => grammarTopics.find((m) => m.topic.slug === t) ?? [])
  const related = relatedPosts(post, allPosts)
  const cover = postCover(post)

  return (
    <div className="relative isolate">
      <ReadingProgress />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden">
        <Blob className="-left-20 -top-24 h-72 w-72 bg-brand-400/25 dark:bg-brand-500/15" />
        <Blob className="right-0 top-0 h-60 w-60 bg-accent-400/20 [animation-delay:-6s] dark:bg-accent-500/10" />
      </div>

      <Container className="pt-8 sm:pt-12">
        <article className="mx-auto max-w-[720px]">
          <Breadcrumbs
            className="animate-fade-in"
            items={[{ name: 'Home', to: '/' }, { name: 'Blog', to: '/blog' }, { name: post.title }]}
          />

          <header className="mt-6">
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="inline-block animate-fade-up rounded-full focus-ring">
              <Badge tone="brand">{post.category}</Badge>
            </Link>
            <h1 className="mt-4 animate-fade-up stagger text-[30px] font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-[40px] dark:text-ink-50" style={{ '--i': 1 } as React.CSSProperties}>
              {post.title}
            </h1>
            <p className="mt-4 animate-fade-up stagger text-[17px] leading-8 text-ink-600 dark:text-ink-400" style={{ '--i': 2 } as React.CSSProperties}>
              {post.excerpt}
            </p>
            <div className="mt-5 flex animate-fade-up stagger flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-6 dark:border-ink-800">
              <PostMeta post={post} className="text-[13.5px]" />
              <BookmarkButton kind="article" path={blogPostPath(post.slug)} title={post.title} />
            </div>
          </header>

          <figure className="mt-8 overflow-hidden rounded-3xl border border-ink-200/80 shadow-lift dark:border-ink-800">
            <img
              src={cover.src}
              srcSet={cover.srcSet}
              sizes="(min-width: 768px) 720px, 100vw"
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/9] h-auto w-full object-cover"
            />
          </figure>

          <div className="pb-4">
            {blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {topics.length ? (
            <Reveal as="section" className="mt-12">
              <h2 className="label-xs mb-3">Grammar topics in this article</h2>
              <div className="flex flex-wrap gap-2">
                {topics.map(({ topic: t, legacyId }) => (
                  <Link
                    key={t.slug}
                    to={grammarTopicPath(t.slug)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-ink-700 transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 focus-ring dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:border-brand-700 dark:hover:text-brand-300"
                  >
                    {t.name}
                    <span className="text-[11.5px] font-medium text-ink-400">Module {legacyId}</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-6 text-white shadow-glow-lg sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
              <h2 className="relative text-[22px] font-extrabold tracking-tight">Turn these tips into habits</h2>
              <p className="relative mt-2 max-w-lg text-[14.5px] leading-6 text-white/80">
                The course covers every point in this article with full lessons, practice and tests, in
                English or বাংলা.
              </p>
              <div className="relative mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={cta.to}
                  className={buttonClasses({
                    variant: 'secondary',
                    className:
                      'group border-transparent bg-white text-brand-700 hover:bg-white hover:shadow-lift dark:border-transparent dark:bg-white dark:text-brand-700 dark:hover:bg-white',
                  })}
                >
                  {cta.label}
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/practice"
                  className={buttonClasses({
                    variant: 'ghost',
                    className: 'text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:text-white dark:text-white dark:hover:bg-white/10',
                  })}
                >
                  Practice Now
                </Link>
              </div>
            </div>
          </Reveal>
        </article>

        {related.length ? (
          <section className="mt-20" aria-labelledby="related-articles">
            <h2 id="related-articles" className="mb-6 text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
              Related articles
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80} className="h-full">
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  )
}
