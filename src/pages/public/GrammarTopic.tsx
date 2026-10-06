import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Dumbbell,
  Lock,
  RotateCcw,
  TriangleAlert,
  Check,
  X,
} from 'lucide-react'
import { contentService, useContent } from '@/services/content'
// Bundled with this route so the prerendered lesson and practice render in the first pass.
import '@/services/content/lessonPack'
import '@/services/content/questionPack'
import { modulePath } from '@/content/paths'
import { createInitialState } from '@/services/progress'
import { useProgress } from '@/hooks/useProgress'
import { useLessonLanguage } from '@/hooks/useLessonLanguage'
import { getCurrentModule, getModuleProgress, getModuleStatus } from '@/utils/progression'
import { lessonLabels, localizeModule } from '@/utils/i18n'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { QuestionCard } from '@/components/lesson/QuestionCard'
import { IeltsRelevance } from '@/components/lesson/IeltsRelevance'
import { LanguageToggle } from '@/components/lesson/LanguageSwitch'
import { Blob } from '@/components/public/motion'
import { BookmarkButton } from '@/components/BookmarkButton'
import { BlogCard, Breadcrumbs, Container, DIFFICULTY_TONE, GrammarCard } from '@/components/public/PublicUi'
import type { ModuleMeta, ProgressState } from '@/types'
import { useHydrated } from '@/hooks/useHydrated'

const EMPTY_STATE: ProgressState = createInitialState('')

function QuickPractice({ module }: { module: ModuleMeta }) {
  const questions = useContent(contentService.getPracticeQuestions(module.slug))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [round, setRound] = useState(0)

  if (!questions.length) return null
  const done = Object.keys(checked).length
  const correct = Object.values(checked).filter(Boolean).length

  return (
    <div>
      <div className="space-y-4" key={round}>
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            total={questions.length}
            value={answers[q.id] ?? ''}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
            mode="practice"
            onChecked={(ok) => setChecked((c) => ({ ...c, [q.id]: ok }))}
            className="animate-fade-up stagger"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </div>
      <div
        className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200/80 bg-white px-5 py-4 shadow-card dark:border-ink-800 dark:bg-ink-900"
        aria-live="polite"
      >
        <p className="text-[14px] font-semibold text-ink-700 dark:text-ink-200">
          {done === questions.length
            ? `You scored ${correct} out of ${questions.length}.`
            : `${done} of ${questions.length} answered`}
        </p>
        <div className="flex flex-wrap gap-2">
          {done > 0 ? (
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setChecked({})
                setRound((r) => r + 1)
              }}
              className={buttonClasses({ variant: 'ghost', size: 'sm' })}
            >
              <RotateCcw size={14} /> Try again
            </button>
          ) : null}
          <Link to="/practice" className={buttonClasses({ variant: 'subtle', size: 'sm' })}>
            More practice
          </Link>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title, id }: { icon: React.ReactNode; title: string; id?: string }) {
  return (
    <h2 id={id} className="mb-4 flex scroll-mt-24 items-center gap-3 text-[20px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
      <span className="icon-chip h-9 w-9 bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-600 ring-brand-200/70 dark:from-brand-950 dark:to-cyan-950/50 dark:text-brand-300 dark:ring-brand-800/60">
        {icon}
      </span>
      {title}
    </h2>
  )
}

export function GrammarTopic() {
  const { slug = '' } = useParams()
  const entry = useContent(contentService.getGrammarTopic(slug))
  const topics = useContent(contentService.getGrammarTopics())
  const stages = useContent(contentService.getStages())
  const posts = useContent(contentService.getBlogPosts())
  const { chosen } = useLessonLanguage()
  // Public pages default to English until the learner picks a language.
  const language = chosen ?? 'en'
  // Read before the early return below so hooks run in the same order on every render.
  const lesson = useContent(contentService.getLesson(entry?.slug ?? slug, language))
  const { state: savedState } = useProgress()
  // Learner progress lives in localStorage, so the prerendered page uses a fresh state until hydration.
  const hydrated = useHydrated()
  const state = hydrated ? savedState : EMPTY_STATE

  if (!entry) return <Navigate to="/grammar" replace />
  const topic = entry.topic

  const labels = lessonLabels(language)
  const module = localizeModule(entry.module, language)
  const stage = stages.find((s) => s.id === module.stage)
  const status = getModuleStatus(state, module.id)
  const progress = getModuleProgress(state, module.id)
  const current = getCurrentModule(state)
  const related = topic.related.flatMap((s) => topics.find((t) => t.topic.slug === s)?.topic ?? [])
  const articles = posts.filter((p) => p.topics.includes(topic.slug)).slice(0, 2)

  const learnTo = status === 'locked' ? modulePath(current.id) : modulePath(module.id)
  const learnLabel =
    status === 'completed' ? 'Review the lesson' : status === 'locked' ? 'Continue Course' : 'Start Learning'

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 overflow-hidden">
        <Blob className="-right-20 -top-24 h-80 w-80 bg-brand-400/25 dark:bg-brand-500/15" />
        <Blob className="-left-24 top-20 h-64 w-64 bg-accent-400/20 [animation-delay:-9s] dark:bg-accent-500/10" />
      </div>

      <Container className="pt-8 sm:pt-12">
        <Breadcrumbs
          className="mb-6 animate-fade-in"
          items={[{ name: 'Home', to: '/' }, { name: 'Grammar', to: '/grammar' }, { name: topic.name }]}
        />

        {/* Header */}
        <header className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="flex animate-fade-up flex-wrap items-center gap-2">
              <Badge tone="brand">
                Stage {module.stage} · {stage?.name}
              </Badge>
              <Badge tone={DIFFICULTY_TONE[module.difficulty]}>{module.difficulty}</Badge>
              <Badge tone="muted">
                <Clock size={11} /> {module.estimatedMinutes} min lesson
              </Badge>
            </div>
            <h1 className="mt-4 animate-fade-up stagger text-[32px] font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-[44px] dark:text-ink-50" style={{ '--i': 1 } as React.CSSProperties}>
              {topic.name}
            </h1>
            <p className="mt-4 max-w-2xl animate-fade-up stagger text-[16px] leading-7 text-ink-600 dark:text-ink-300" style={{ '--i': 2 } as React.CSSProperties}>
              {topic.description}
            </p>
            <p
              lang={language}
              className="bn-text mt-2 max-w-2xl animate-fade-up stagger text-[14.5px] font-medium text-ink-500 dark:text-ink-400"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              {module.summary}
            </p>
            <div className="mt-6 flex animate-fade-up stagger flex-col gap-3 sm:flex-row" style={{ '--i': 4 } as React.CSSProperties}>
              <Link to={learnTo} className={buttonClasses({ size: 'lg', className: 'group' })}>
                {status === 'locked' ? <Lock size={16} /> : <BookOpen size={16} />}
                {learnLabel}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="#practice" className={buttonClasses({ size: 'lg', variant: 'secondary', className: 'group' })}>
                <Dumbbell size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
                Practice
              </a>
              <BookmarkButton kind="grammar" path={`/grammar/${topic.slug}`} title={topic.name} className="h-12 justify-center rounded-2xl px-5" />
            </div>
            {status === 'locked' ? (
              <p className="mt-3 text-[13px] text-ink-500 dark:text-ink-400">
                In the course this is Module {module.id}. Modules unlock in order; you are currently on Module{' '}
                {current.id}. The key rules below are open to everyone.
              </p>
            ) : null}
          </div>

          <div className="animate-fade-up stagger rounded-2xl border border-ink-200/80 bg-white/80 p-4 shadow-card backdrop-blur dark:border-ink-800 dark:bg-ink-900/80" style={{ '--i': 3 } as React.CSSProperties}>
            <p className="label-xs mb-2">{labels.languageLabel}</p>
            <LanguageToggle fallback="en" />
            <p className="mt-3 text-[12.5px] leading-5 text-ink-500 dark:text-ink-400">
              Course Module {module.id}: <span className="font-semibold text-ink-700 dark:text-ink-200">{module.title}</span>
              {status === 'completed' ? (
                <span className="mt-1 flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={13} /> Completed · best {progress.bestScore}%
                </span>
              ) : null}
            </p>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-14">
            <Reveal>
              <IeltsRelevance module={module} title={labels.ieltsTitle} />
            </Reveal>

            {lesson ? (
              <section aria-labelledby="key-rules">
                <SectionTitle id="key-rules" icon={<BookOpen size={17} />} title={language === 'bn' ? 'মূল নিয়মগুলো' : 'Key rules'} />
                <p lang={language} className="bn-text mb-5 text-[15px] text-ink-600 dark:text-ink-300">
                  {lesson.intro}
                </p>
                <div className="space-y-4">
                  {lesson.rules.map((rule, i) => (
                    <Reveal key={rule.id} delay={60}>
                      <article className="glow-card rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-6 dark:border-ink-800 dark:bg-ink-900">
                        <h3 className="flex items-center gap-3 text-[16px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[12px] font-bold text-white">
                            {i + 1}
                          </span>
                          <span lang={language}>{rule.heading}</span>
                        </h3>
                        <p lang={language} className="bn-text mt-3 text-[15px] text-ink-700 dark:text-ink-200">
                          {rule.rule}
                        </p>
                        <ul className="mt-4 space-y-1.5">
                          {rule.structure.slice(0, 3).map((line) => (
                            <li
                              key={line}
                              className="rounded-lg border-l-[3px] border-brand-400 bg-ink-50 px-3.5 py-2 font-serif text-[14px] leading-6 text-ink-800 dark:border-brand-600 dark:bg-ink-800/50 dark:text-ink-100"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </article>
                    </Reveal>
                  ))}
                </div>
                <p className="mt-4 text-[13.5px] text-ink-500 dark:text-ink-400">
                  The full lesson adds tables, worked examples, notes and a module test.{' '}
                  <Link to={learnTo} className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600 focus-ring rounded-sm dark:text-brand-300">
                    {learnLabel}
                  </Link>
                </p>
              </section>
            ) : null}

            {lesson ? (
              <Reveal as="section">
                <SectionTitle id="mistakes" icon={<TriangleAlert size={17} />} title={labels.mistakes} />
                <div className="space-y-3">
                  {lesson.mistakes.slice(0, 3).map((m) => (
                    <div key={m.wrong} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-card transition-transform duration-300 ease-spring hover:-translate-y-0.5 sm:p-5 dark:border-rose-900/40 dark:bg-ink-900">
                      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                        <p className="flex gap-2.5 font-serif text-[15px] leading-7 text-rose-700 dark:text-rose-300">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                            <X size={12} strokeWidth={3} />
                          </span>
                          <span>
                            <span className="sr-only">Incorrect: </span>
                            {m.wrong}
                          </span>
                        </p>
                        <p className="flex gap-2.5 font-serif text-[15px] leading-7 text-emerald-800 dark:text-emerald-300">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span>
                            <span className="sr-only">Correct: </span>
                            {m.right}
                          </span>
                        </p>
                      </div>
                      <p lang={language} className="bn-text mt-3 border-t border-dashed border-ink-200 pt-3 text-[13.5px] text-ink-600 dark:border-ink-700 dark:text-ink-400">
                        {m.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <section aria-labelledby="practice">
              <SectionTitle id="practice" icon={<Dumbbell size={17} />} title="Quick practice" />
              <p className="mb-5 text-[14.5px] leading-6 text-ink-600 dark:text-ink-400">
                Check your understanding with instant feedback. This practice does not affect your course score.
              </p>
              <QuickPractice module={module} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block lg:self-start">
            <nav aria-label="On this page">
              <h2 className="label-xs mb-3">On this page</h2>
              <ul className="space-y-1 border-l border-ink-200 dark:border-ink-800">
                {[
                  { href: '#key-rules', label: language === 'bn' ? 'মূল নিয়মগুলো' : 'Key rules', show: !!lesson },
                  { href: '#mistakes', label: labels.mistakes, show: !!lesson },
                  { href: '#practice', label: 'Quick practice', show: true },
                  { href: '#related-heading', label: 'Related topics', show: related.length > 0 },
                ]
                  .filter((l) => l.show)
                  .map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        lang={language}
                        className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[14px] font-medium text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-700 focus-ring dark:text-ink-400 dark:hover:text-brand-300"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
            {articles.length ? (
              <div>
                <h2 className="label-xs mb-3">Read more</h2>
                <ul className="space-y-2">
                  {articles.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="block rounded-lg py-1 text-[14px] font-medium leading-6 text-ink-700 transition-colors hover:text-brand-700 focus-ring dark:text-ink-300 dark:hover:text-brand-300"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50 to-cyan-50/60 p-5 dark:border-brand-900/60 dark:from-brand-950/60 dark:to-cyan-950/30">
              <p className="text-[14px] font-bold text-ink-900 dark:text-ink-50">Learn it properly</p>
              <p className="mt-1 text-[13px] leading-5 text-ink-600 dark:text-ink-400">
                Full lesson, worked examples and a 10-question test in the course.
              </p>
              <Link to={learnTo} className={buttonClasses({ size: 'sm', className: 'group mt-4 w-full' })}>
                {learnLabel}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="mt-20" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-6 scroll-mt-24 text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
              Continue with a related topic
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t, i) => (
                <Reveal key={t.slug} delay={i * 80} className="reveal-scale h-full">
                  <GrammarCard topic={t} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {articles.length ? (
          <section className="mt-16" aria-labelledby="articles-heading">
            <h2 id="articles-heading" className="mb-6 text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
              Articles on this topic
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {articles.map((p, i) => (
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
