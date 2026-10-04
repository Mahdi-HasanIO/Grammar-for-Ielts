import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { GRAMMAR_TOPICS, topicModule } from '@/data/grammarTopics'
import { STAGES } from '@/data/modules'
import { STAGES_EN } from '@/data/modulesEn'
import { Reveal } from '@/components/ui/Reveal'
import { buttonClasses } from '@/components/ui/Button'
import { Blob } from '@/components/public/motion'
import { Breadcrumbs, Container, GrammarCard, SectionHeading } from '@/components/public/PublicUi'
import { useCourseCta } from '@/hooks/useCourseCta'
import { cn } from '@/utils/cn'
import { useHydrated } from '@/hooks/useHydrated'

export function GrammarIndex() {
  const [params, setParams] = useSearchParams()
  // Filters come from the URL; ignore them until hydration so the prerendered list matches.
  const hydrated = useHydrated()
  const stageParam = hydrated ? Number(params.get('stage')) : 0
  const stage = STAGES.some((s) => s.id === stageParam) ? stageParam : 0
  const query = hydrated ? (params.get('q') ?? '') : ''
  const cta = useCourseCta()

  const update = (next: { stage?: number; q?: string }) => {
    const p = new URLSearchParams(params)
    if (next.stage !== undefined) {
      if (next.stage) p.set('stage', String(next.stage))
      else p.delete('stage')
    }
    if (next.q !== undefined) {
      if (next.q) p.set('q', next.q)
      else p.delete('q')
    }
    setParams(p, { replace: true })
  }

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GRAMMAR_TOPICS.filter((t) => {
      const m = topicModule(t)
      if (stage && m.stage !== stage) return false
      if (!q) return true
      return [t.name, t.description, m.title, ...m.topics].some((s) => s.toLowerCase().includes(q))
    })
  }, [stage, query])

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden">
        <Blob className="-left-20 -top-20 h-72 w-72 bg-brand-400/25 dark:bg-brand-500/15" />
        <Blob className="right-0 top-0 h-64 w-64 bg-accent-400/20 [animation-delay:-7s] dark:bg-accent-500/10" />
      </div>

      <Container className="pt-10 sm:pt-16">
        <div className="animate-fade-up">
          <Breadcrumbs className="mb-5" items={[{ name: 'Home', to: '/' }, { name: 'Grammar' }]} />
          <SectionHeading
            as="h1"
            eyebrow="Grammar"
            title="Grammar topics for IELTS writing"
            description={`${GRAMMAR_TOPICS.length} topics, from sentence basics to academic style. Read the key rules, see the common mistakes and practise in minutes, without starting the course.`}
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex animate-fade-up flex-col gap-4 [animation-delay:80ms] lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by stage">
            {[{ id: 0, name: 'All topics' }, ...STAGES].map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={stage === s.id}
                onClick={() => update({ stage: s.id })}
                className={cn(
                  'min-h-[40px] shrink-0 rounded-full px-4 text-[13.5px] font-semibold transition-all duration-200 ease-spring focus-ring active:scale-[0.97]',
                  stage === s.id
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                    : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:text-ink-100',
                )}
              >
                {s.id ? `${s.id}. ${s.name}` : s.name}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="grammar-search" className="sr-only">
              Search grammar topics
            </label>
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              id="grammar-search"
              type="search"
              value={query}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search topics, e.g. passive"
              className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-10 text-[14.5px] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-400 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.15)] dark:border-ink-700 dark:bg-ink-900 dark:placeholder:text-ink-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => update({ q: '' })}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700 focus-ring dark:hover:bg-ink-800"
              >
                <X size={15} />
              </button>
            ) : null}
          </div>
        </div>

        {stage ? (
          <p className="mb-6 max-w-2xl animate-fade-in text-[14.5px] leading-7 text-ink-600 dark:text-ink-400">
            <span className="font-semibold text-ink-900 dark:text-ink-100">{STAGES_EN[stage as 1].tagline}.</span>{' '}
            {STAGES_EN[stage as 1].description}
          </p>
        ) : null}

        <p className="sr-only" aria-live="polite">
          {topics.length} topics shown
        </p>

        {topics.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, i) => (
              <Reveal key={topic.slug} delay={(i % 3) * 70} className="reveal-scale h-full">
                <GrammarCard topic={topic} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink-300 px-6 py-16 text-center dark:border-ink-700">
            <p className="text-[16px] font-bold text-ink-900 dark:text-ink-50">No topics match “{query}”</p>
            <p className="mt-1 text-[14px] text-ink-500 dark:text-ink-400">Try a broader word such as clause, tense or article.</p>
            <button
              type="button"
              onClick={() => update({ q: '', stage: 0 })}
              className={buttonClasses({ variant: 'secondary', size: 'sm', className: 'mt-5' })}
            >
              Show all topics
            </button>
          </div>
        )}

        <Reveal className="mt-16">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50 via-white to-cyan-50/60 p-6 sm:flex-row sm:items-center sm:p-8 dark:border-brand-900/60 dark:from-brand-950/60 dark:via-ink-900 dark:to-cyan-950/30">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
                Prefer a guided path?
              </h2>
              <p className="mt-1 max-w-xl text-[14.5px] leading-6 text-ink-600 dark:text-ink-400">
                The course teaches these topics in order, with full lessons, examples, tests and progress
                tracking.
              </p>
            </div>
            <Link to={cta.to} className={buttonClasses({ className: 'group shrink-0' })}>
              {cta.label}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}
