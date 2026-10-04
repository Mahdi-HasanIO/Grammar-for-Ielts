import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Calendar, ChevronRight, Clock } from 'lucide-react'
import type { GrammarTopic } from '@/data/grammarTopics'
import { topicModule } from '@/data/grammarTopics'
import { formatPostDate, postCover, type BlogPostMeta } from '@/data/blog/posts'
import { STAGES } from '@/data/modules'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

/** Page-width container used by every public page. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  as: Heading = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
  as?: 'h1' | 'h2'
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-end gap-4 sm:mb-10',
        align === 'center' ? 'flex-col items-center text-center' : 'justify-between',
      )}
    >
      <div className={cn('min-w-0', align === 'center' ? 'max-w-2xl' : 'max-w-2xl')}>
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Heading
          className={cn(
            'font-extrabold tracking-tight text-ink-900 dark:text-ink-50',
            Heading === 'h1'
              ? 'text-[32px] leading-[1.1] sm:text-[44px]'
              : 'text-[26px] leading-tight sm:text-[34px]',
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-3 text-[15.5px] leading-7 text-ink-600 dark:text-ink-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export const DIFFICULTY_TONE = {
  Elementary: 'success',
  Intermediate: 'brand',
  'Upper-Intermediate': 'ai',
  Advanced: 'warning',
  Proficient: 'danger',
} as const

/** Card linking to a grammar topic page. */
export function GrammarCard({ topic, style, className }: { topic: GrammarTopic; style?: CSSProperties; className?: string }) {
  const module = topicModule(topic)
  const stage = STAGES.find((s) => s.id === module.stage)
  return (
    <Link
      to={`/grammar/${topic.slug}`}
      style={style}
      className={cn(
        'glow-card group flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-spring hover:-translate-y-1 hover:border-transparent hover:shadow-lift focus-ring dark:border-ink-800 dark:bg-ink-900',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-cyan-50 font-display text-[14px] font-bold text-brand-700 ring-1 ring-inset ring-brand-200/70 transition-transform duration-300 ease-bounce group-hover:scale-110 group-hover:-rotate-3 dark:from-brand-950 dark:to-cyan-950/50 dark:text-brand-200 dark:ring-brand-800/60">
          {module.id}
        </span>
        <Badge tone={DIFFICULTY_TONE[module.difficulty]}>{module.difficulty}</Badge>
      </div>
      <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight text-ink-900 dark:text-ink-50">
        {topic.name}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-6 text-ink-600 dark:text-ink-400">{topic.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink-200 pt-3 text-[12.5px] dark:border-ink-800">
        <span className="font-medium text-ink-500 dark:text-ink-400">
          Stage {module.stage} · {stage?.name}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-300">
          Explore
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function PostMeta({ post, className }: { post: BlogPostMeta; className?: string }) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-500 dark:text-ink-400', className)}>
      <span className="inline-flex items-center gap-1">
        <Calendar size={13} aria-hidden />
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock size={13} aria-hidden />
        {post.readingMinutes} min read
      </span>
    </p>
  )
}

/** Article cover: a bundled, topic-specific illustration with responsive sources. */
export function PostCover({
  post,
  large = false,
  eager = false,
  sizes = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw',
}: {
  post: BlogPostMeta
  large?: boolean
  eager?: boolean
  sizes?: string
}) {
  const cover = postCover(post)
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-ink-100 dark:bg-ink-800',
        large ? 'aspect-[16/9] md:aspect-auto md:h-full md:min-h-[300px]' : 'aspect-[16/9]',
      )}
    >
      <img
        src={cover.src}
        srcSet={cover.srcSet}
        sizes={sizes}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' as const } : {})}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
      />
      <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white backdrop-blur">
        {post.category}
      </span>
    </div>
  )
}

export function BlogCard({ post, style, className }: { post: BlogPostMeta; style?: CSSProperties; className?: string }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      style={style}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-lift focus-ring dark:border-ink-800 dark:bg-ink-900',
        className,
      )}
    >
      <PostCover post={post} />
      <div className="flex flex-1 flex-col p-5">
        <PostMeta post={post} />
        <h3 className="mt-2.5 text-[17px] font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-700 dark:text-ink-50 dark:group-hover:text-brand-300">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-6 text-ink-600 dark:text-ink-400">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 dark:text-brand-300">
          Read article
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function FeaturedPostCard({ post, eager = false }: { post: BlogPostMeta; eager?: boolean }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-lift focus-ring md:grid-cols-2 dark:border-ink-800 dark:bg-ink-900"
    >
      <PostCover post={post} large eager={eager} sizes="(min-width: 768px) 560px, 100vw" />
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <Badge tone="ai" className="self-start">Featured</Badge>
        <h3 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight text-ink-900 transition-colors group-hover:text-brand-700 sm:text-[26px] dark:text-ink-50 dark:group-hover:text-brand-300">
          {post.title}
        </h3>
        <p className="mt-3 text-[15px] leading-7 text-ink-600 dark:text-ink-400">{post.excerpt}</p>
        <PostMeta post={post} className="mt-4" />
        <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-600 dark:text-brand-300">
          Read the article
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/** Renders text with [label](/path) links. Internal paths use the router; others open in a new tab. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!match) return <Fragment key={i}>{part}</Fragment>
        const [, label, href] = match
        const cls =
          'font-semibold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-2 transition-colors hover:text-brand-900 hover:decoration-brand-500 focus-ring rounded-sm dark:text-brand-300 dark:decoration-brand-700 dark:hover:text-brand-200'
        return href.startsWith('/') ? (
          <Link key={i} to={href} className={cls}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noreferrer" className={cls}>
            {label}
          </a>
        )
      })}
    </>
  )
}

/** Visible breadcrumb trail. Mirrors the BreadcrumbList structured data in src/seo/meta.ts. */
export function Breadcrumbs({ items, className }: { items: { name: string; to?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-ink-500 dark:text-ink-400">
        {items.map((item, i) => (
          <li key={item.name} className="flex min-w-0 items-center gap-1.5">
            {i > 0 ? <ChevronRight size={13} aria-hidden className="shrink-0" /> : null}
            {item.to ? (
              <Link to={item.to} className="rounded transition-colors hover:text-brand-700 focus-ring dark:hover:text-brand-300">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-ink-800 dark:text-ink-200">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
