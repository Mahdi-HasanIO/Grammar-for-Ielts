import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Dumbbell, RotateCcw, Sparkles } from 'lucide-react'
import { GRAMMAR_TOPICS, topicModule } from '@/data/grammarTopics'
import { MODULES, STAGES } from '@/data/modules'
import { useHydrated } from '@/hooks/useHydrated'
import { useProgress } from '@/hooks/useProgress'
import { getCurrentModule, completedCount } from '@/utils/progression'
import { readStorage, STORAGE_KEYS } from '@/utils/storage'
import { Reveal } from '@/components/ui/Reveal'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { Blob } from '@/components/public/motion'
import { Container, SectionHeading } from '@/components/public/PublicUi'
import { cn } from '@/utils/cn'
import { OfflineDownload } from '@/components/OfflineDownload'

export function Practice() {
  const { state: savedState } = useProgress()
  // Progress and the AI key live in localStorage, so the prerendered page shows a fresh learner until hydration.
  const hydrated = useHydrated()
  const state = hydrated ? savedState : null
  const current = state ? getCurrentModule(state) : MODULES[0]
  const done = state ? completedCount(state) : 0
  const aiConnected = hydrated && Boolean(readStorage<string>(STORAGE_KEYS.geminiApiKey, ''))

  const modes = [
    {
      icon: Dumbbell,
      title: 'Quick practice by topic',
      text: 'Four instant-feedback questions on any grammar topic. Open to everyone, no course progress needed.',
      to: '#topics',
      cta: 'Choose a topic',
      tone: 'from-brand-500 to-accent-600',
    },
    {
      icon: Sparkles,
      title: 'AI practice',
      text: aiConnected
        ? 'Your Gemini key is connected. Open any lesson to generate fresh questions on its rule.'
        : 'Connect a free Gemini key once and every lesson can generate new questions at three levels.',
      to: aiConnected ? `/module/${current.id}#practice` : '/settings#ai',
      cta: aiConnected ? 'Practise in your lesson' : 'Connect AI practice',
      tone: 'from-accent-500 to-brand-600',
      badge: aiConnected ? 'Connected' : undefined,
    },
    {
      icon: ClipboardCheck,
      title: 'Module test',
      text: `Ten questions, 80% to pass. Your next test is Module ${current.id}: ${current.title}.`,
      to: `/module/${current.id}/test`,
      cta: 'Take the test',
      tone: 'from-emerald-500 to-teal-600',
    },
    {
      icon: RotateCcw,
      title: 'Review weak areas',
      text: done
        ? 'Revisit completed modules and the topics where your test average is below the pass mark.'
        : 'Once you pass a module test, it appears here for review along with any weak areas.',
      to: '/review',
      cta: 'Open review',
      tone: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden">
        <Blob className="-left-16 -top-20 h-72 w-72 bg-emerald-300/25 dark:bg-emerald-500/10" />
        <Blob className="right-0 top-0 h-64 w-64 bg-brand-400/25 [animation-delay:-7s] dark:bg-brand-500/15" />
      </div>

      <Container className="pt-10 sm:pt-16">
        <div className="animate-fade-up">
          <SectionHeading
            as="h1"
            eyebrow="Practice"
            title="Practice Now"
            description="Short, focused practice with instant feedback. Pick a topic, generate AI questions in a lesson, or test yourself on the next module."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map(({ icon: Icon, title, text, to, cta, tone, badge }, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow transition-transform duration-300 ease-bounce group-hover:scale-110', tone)}>
                    <Icon size={20} />
                  </span>
                  {badge ? <Badge tone="success">{badge}</Badge> : null}
                </div>
                <h2 className="mt-4 text-[16.5px] font-bold tracking-tight text-ink-900 dark:text-ink-50">{title}</h2>
                <p className="mt-2 flex-1 text-[14px] leading-6 text-ink-600 dark:text-ink-400">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-600 dark:text-brand-300">
                  {cta}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </>
            )
            const cls =
              'glow-card group flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-lift focus-ring dark:border-ink-800 dark:bg-ink-900'
            return (
              <Reveal key={title} delay={i * 80} className="h-full">
                {to.startsWith('#') ? (
                  <a href={to} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link to={to} className={cls}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            )
          })}
        </div>

        <section id="topics" className="mt-20 scroll-mt-24" aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="text-[24px] font-extrabold tracking-tight text-ink-900 sm:text-[28px] dark:text-ink-50">
            Practice by grammar topic
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ink-600 dark:text-ink-400">
            Each topic opens with its key rules, then four practice questions with explanations.
          </p>
          <div className="mt-8 space-y-10">
            {STAGES.map((stage) => {
              const topics = GRAMMAR_TOPICS.filter((t) => topicModule(t).stage === stage.id)
              return (
                <Reveal key={stage.id} as="div">
                  <h3 className="label-xs mb-3">
                    Stage {stage.id} · {stage.name}
                  </h3>
                  <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((t) => {
                      const m = topicModule(t)
                      return (
                        <li key={t.slug}>
                          <Link
                            to={`/grammar/${t.slug}#practice`}
                            className="group flex min-h-[56px] items-center gap-3 rounded-xl border border-ink-200/80 bg-white px-4 py-3 shadow-card transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift focus-ring dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 font-display text-[12px] font-bold text-ink-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300">
                              {m.id}
                            </span>
                            <span className="min-w-0 flex-1 text-[14px] font-semibold text-ink-800 dark:text-ink-100">{t.name}</span>
                            <Dumbbell size={15} className="shrink-0 text-ink-300 transition-all duration-300 group-hover:-rotate-12 group-hover:text-brand-500 dark:text-ink-600" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </Reveal>
              )
            })}
          </div>
        </section>

        <Reveal className="mt-16">
          <h2 className="mb-4 text-[22px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">Practise offline</h2>
          <OfflineDownload />
        </Reveal>

        <Reveal className="mt-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-ink-200/80 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:p-8 dark:border-ink-800 dark:bg-ink-900">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">Track your practice</h2>
              <p className="mt-1 max-w-xl text-[14.5px] leading-6 text-ink-600 dark:text-ink-400">
                Your dashboard shows study time, streaks, test scores and the module to study next.
              </p>
            </div>
            <Link to="/dashboard" className={buttonClasses({ variant: 'secondary', className: 'group shrink-0' })}>
              Open Dashboard
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}
