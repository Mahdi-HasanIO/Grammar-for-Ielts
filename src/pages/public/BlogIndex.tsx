import { useSearchParams } from 'react-router-dom'
import { BLOG_CATEGORIES, BLOG_POSTS, featuredPost, type BlogCategory } from '@/data/blog/posts'
import { Reveal } from '@/components/ui/Reveal'
import { Blob } from '@/components/public/motion'
import { BlogCard, Breadcrumbs, Container, FeaturedPostCard, SectionHeading } from '@/components/public/PublicUi'
import { cn } from '@/utils/cn'
import { useHydrated } from '@/hooks/useHydrated'

export function BlogIndex() {
  const [params, setParams] = useSearchParams()
  const hydrated = useHydrated()
  const raw = hydrated ? params.get('category') : null
  const category = BLOG_CATEGORIES.find((c) => c === raw) as BlogCategory | undefined
  const featured = featuredPost()
  const posts = category
    ? BLOG_POSTS.filter((p) => p.category === category)
    : BLOG_POSTS.filter((p) => p.slug !== featured.slug)

  const setCategory = (c?: BlogCategory) => {
    const p = new URLSearchParams(params)
    if (c) p.set('category', c)
    else p.delete('category')
    setParams(p, { replace: true })
  }

  const counts = Object.fromEntries(
    BLOG_CATEGORIES.map((c) => [c, BLOG_POSTS.filter((p) => p.category === c).length]),
  ) as Record<BlogCategory, number>

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden">
        <Blob className="-right-16 -top-24 h-72 w-72 bg-accent-400/25 dark:bg-accent-500/15" />
        <Blob className="left-10 top-10 h-60 w-60 bg-brand-400/20 [animation-delay:-5s] dark:bg-brand-500/10" />
      </div>

      <Container className="pt-10 sm:pt-16">
        <div className="animate-fade-up">
          <Breadcrumbs className="mb-5" items={[{ name: 'Home', to: '/' }, { name: 'Blog' }]} />
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Grammar advice for IELTS writers"
            description="Practical, exam-focused articles on the grammar that moves band scores, each linked to the topics and course modules that go deeper."
          />
        </div>

        <div
          className="no-scrollbar -mx-4 mb-10 flex animate-fade-up gap-2 overflow-x-auto px-4 pb-1 [animation-delay:80ms] sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filter by category"
        >
          {[undefined, ...BLOG_CATEGORIES].map((c) => {
            const active = category === c
            return (
              <button
                key={c ?? 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={cn(
                  'inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-all duration-200 ease-spring focus-ring active:scale-[0.97]',
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                    : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:text-ink-100',
                )}
              >
                {c ?? 'All articles'}
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[11px] tabular-nums',
                    active ? 'bg-white/20' : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400',
                  )}
                >
                  {c ? counts[c] : BLOG_POSTS.length}
                </span>
              </button>
            )
          })}
        </div>

        {!category ? (
          <Reveal className="mb-12">
            <FeaturedPostCard post={featured} eager />
          </Reveal>
        ) : null}

        <h2 className="mb-6 text-[22px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
          {category ?? 'Latest articles'}
        </h2>
        <p className="sr-only" aria-live="polite">
          {posts.length} articles shown
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 80} className="h-full">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
