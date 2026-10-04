import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Lightbulb,
  ListChecks,
  Lock,
  PenLine,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useStudyTimer } from '@/hooks/useStudyTimer'
import { getLesson } from '@/data/lessons'
import {
  getModuleProgress,
  getModuleStatus,
  moduleById,
  stageById,
} from '@/utils/progression'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import {
  ExamplesSection,
  MistakesSection,
  RuleCard,
  TakeawaysSection,
} from '@/components/lesson/LessonSections'
import { IeltsRelevance } from '@/components/lesson/IeltsRelevance'
import { AiPracticePanel } from '@/components/lesson/AiPracticePanel'
import { LanguageChooser, LanguageToggle } from '@/components/lesson/LanguageSwitch'
import { BookmarkButton } from '@/components/BookmarkButton'
import { useLessonLanguage } from '@/hooks/useLessonLanguage'
import { lessonLabels, localizeModule } from '@/utils/i18n'

const SECTIONS = [
  { id: 'rule', label: 'Rules', icon: BookOpen },
  { id: 'examples', label: 'Examples', icon: PenLine },
  { id: 'mistakes', label: 'Mistakes', icon: TriangleAlert },
  { id: 'takeaways', label: 'Takeaways', icon: Lightbulb },
  { id: 'practice', label: 'AI Practice', icon: Sparkles },
  { id: 'test', label: 'Test', icon: ClipboardCheck },
] as const

function SectionTitle({
  icon,
  title,
  description,
  step,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  step?: number
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="icon-chip h-10 w-10 bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-600 ring-brand-200/70 dark:from-brand-950 dark:to-cyan-950/50 dark:text-brand-300 dark:ring-brand-800/60">
          {icon}
        </span>
        <div>
          {step ? <p className="label-xs">Step {step}</p> : null}
          <h2 className="text-[20px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
            {title}
          </h2>
        </div>
      </div>
      {description ? (
        <p className="bn-text mt-3 max-w-3xl text-[14.5px] text-ink-600 dark:text-ink-300">
          {description}
        </p>
      ) : null}
    </div>
  )
}

/** Thin bar fixed to the top of the viewport that fills as the learner reads. */
function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
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
        className="h-full origin-left bg-gradient-to-r from-brand-500 via-accent-500 to-brand-400 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  )
}

/** Sticky in-page navigation that highlights the section currently in view. */
function SectionNav({ ids }: { ids: readonly string[] }) {
  const [active, setActive] = useState<string>(ids[0])
  // A string key, so a fresh array from the parent doesn't rebuild the observer every render.
  const idKey = ids.join('|')

  useEffect(() => {
    const nodes = idKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [idKey])

  // Keep the active chip visible inside the horizontally scrolling bar on mobile.
  // Scrolls only the bar itself; scrollIntoView could also nudge the page.
  const barRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = barRef.current
    const chip = document.getElementById(`nav-${active}`)
    if (!bar || !chip) return
    bar.scrollTo({
      left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2,
      behavior: 'smooth',
    })
  }, [active])

  return (
    <div className="sticky top-[57px] z-20 -mx-4 mb-8 border-y border-ink-200/60 bg-ink-50/80 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10 dark:border-ink-800/60 dark:bg-ink-950/80">
      <div className="flex items-center gap-3">
      <nav ref={barRef} className="no-scrollbar relative flex min-w-0 flex-1 gap-1.5 overflow-x-auto" aria-label="Lesson sections">
        {SECTIONS.filter((s) => ids.includes(s.id)).map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            id={`nav-${id}`}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setActive(id)
            }}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-300 ease-spring focus-ring',
              active === id
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                : 'text-ink-600 hover:bg-white hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100',
            )}
          >
            <Icon size={13} />
            {label}
          </a>
        ))}
      </nav>
      <LanguageToggle className="hidden shrink-0 sm:inline-flex" />
      </div>
    </div>
  )
}

export function ModulePage() {
  const { id } = useParams()
  const moduleId = Number(id)
  const baseModule = moduleById(moduleId)
  const { language } = useLessonLanguage()
  const labels = lessonLabels(language)

  const { state, markLessonViewed } = useProgress()
  useStudyTimer(true)

  useEffect(() => {
    if (baseModule) markLessonViewed(moduleId)
  }, [baseModule, moduleId, markLessonViewed])

  if (!baseModule) return <Navigate to="/course" replace />
  const module = localizeModule(baseModule, language)

  const status = getModuleStatus(state, moduleId)
  if (status === 'locked') {
    return (
      <div className="mx-auto max-w-lg animate-scale-in py-16 text-center">
        <span className="icon-chip mx-auto mb-5 h-16 w-16 animate-float rounded-2xl text-ink-500">
          <Lock size={26} />
        </span>
        <h1 className="text-xl font-extrabold tracking-tight">Module {module.id} is locked</h1>
        <p className="mt-2 text-[14px] leading-6 text-ink-600 dark:text-ink-400">
          Pass the test for Module {module.id - 1} to unlock {module.title}. The course is
          sequential so that each structure rests on the one before it.
        </p>
        <Link to={`/module/${module.id - 1}`} className="mt-6 inline-block">
          <Button>
            Go to Module {module.id - 1} <ArrowRight size={15} />
          </Button>
        </Link>
      </div>
    )
  }

  const lesson = getLesson(moduleId, language)
  const stage = stageById(module.stage)
  const progress = getModuleProgress(state, moduleId)
  const prevModule = moduleById(module.id - 1)
  const nextModule = moduleById(module.id + 1)
  const nextUnlocked = nextModule ? getModuleStatus(state, nextModule.id) !== 'locked' : false
  const sectionIds = lesson
    ? SECTIONS.map((s) => s.id)
    : SECTIONS.filter((s) => s.id === 'practice' || s.id === 'test').map((s) => s.id)

  return (
    <div>
      <LanguageChooser />
      <ReadingProgress />

      {/* Header */}
      <div className="mb-6">
        <Link
          to="/course"
          className="group mb-5 inline-flex items-center gap-1.5 rounded-full px-1 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-300"
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          All modules
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-ink-200/80 bg-white p-5 shadow-card sm:p-7 dark:border-ink-800 dark:bg-ink-900">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[26px] font-extrabold text-white shadow-glow">
              {module.id}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="label-xs">
                  Stage {stage.id} · {stage.name}
                </p>
                {progress.completed ? (
                  <Badge tone="success">
                    <CheckCircle2 size={12} /> Completed · best {progress.bestScore}%
                  </Badge>
                ) : null}
              </div>
              <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[32px] dark:text-ink-50">
                {module.title}
              </h1>
              <p className="bn-text mt-2 max-w-2xl text-[15px] text-ink-600 dark:text-ink-300">
                {module.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <LanguageToggle />
                <BookmarkButton kind="lesson" path={`/module/${module.id}`} title={`Module ${module.id}: ${module.title}`} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="brand">{module.difficulty}</Badge>
                <Badge tone="muted">
                  <Clock size={11} /> {module.estimatedMinutes} min read
                </Badge>
                {progress.attempts > 0 ? (
                  <Badge tone="neutral">
                    {progress.attempts} attempt{progress.attempts === 1 ? '' : 's'}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {module.topics.map((topic, i) => (
                  <span
                    key={topic}
                    style={{ '--i': i } as React.CSSProperties}
                    className="animate-fade-up stagger rounded-lg bg-ink-100 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600 ring-1 ring-inset ring-ink-200/60 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700/60"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionNav ids={sectionIds} />

      <div className="space-y-14">
        <Reveal>
          <IeltsRelevance module={module} title={labels.ieltsTitle} />
        </Reveal>

        {lesson ? (
          <>
            <section id="rule" className="scroll-mt-32">
              <SectionTitle
                step={1}
                icon={<BookOpen size={18} />}
                title={labels.theRule}
                description={lesson.intro}
              />
              <div className="space-y-5">
                {lesson.rules.map((rule, i) => (
                  <Reveal key={rule.id}>
                    <RuleCard rule={rule} index={i} labels={labels} />
                  </Reveal>
                ))}
              </div>
            </section>

            <Reveal as="section" id="examples" className="scroll-mt-32">
              <SectionTitle
                step={2}
                icon={<PenLine size={18} />}
                title={labels.examples}
                description={labels.examplesDesc}
              />
              <ExamplesSection examples={lesson.examples} />
            </Reveal>

            <Reveal as="section" id="mistakes" className="scroll-mt-32">
              <SectionTitle
                step={3}
                icon={<TriangleAlert size={18} />}
                title={labels.mistakes}
                description={labels.mistakesDesc}
              />
              <MistakesSection mistakes={lesson.mistakes} labels={labels} />
            </Reveal>

            <Reveal as="section" id="takeaways" className="scroll-mt-32">
              <TakeawaysSection lesson={lesson} labels={labels} />
            </Reveal>
          </>
        ) : null}

        <section id="practice" className="scroll-mt-32">
          <SectionTitle
            step={lesson ? 4 : undefined}
            icon={<Sparkles size={18} />}
            title="Practice"
            description="Low-stakes questions with instant feedback. These do not affect your module score."
          />
          <AiPracticePanel module={module} lesson={lesson} />
        </section>

        {/* Test call to action */}
        <Reveal as="section" id="test" className="scroll-mt-32">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-950 p-6 text-white shadow-lift sm:p-8 dark:from-ink-900 dark:via-brand-950 dark:to-ink-950 dark:ring-1 dark:ring-ink-800">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur">
                <ListChecks size={26} />
              </span>
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Step {lesson ? 5 : 2} · Module test
                </p>
                <h2 className="mt-1 text-[22px] font-extrabold tracking-tight">
                  10 questions · pass mark 80%
                </h2>
                <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-white/70">
                  {progress.completed
                    ? 'You have already passed this module. Retaking the test updates your latest score and can improve your best score.'
                    : nextModule
                      ? `Score 8 out of 10 or higher to complete this module and unlock Module ${nextModule.id}.`
                      : 'Score 8 out of 10 or higher to complete the final module of the course.'}
                </p>
              </div>
              <Link to={`/module/${module.id}/test`} className="shrink-0">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group w-full border-transparent bg-white text-ink-900 hover:bg-white hover:shadow-glow-lg sm:w-auto dark:border-transparent dark:bg-white dark:text-ink-900 dark:hover:bg-white"
                >
                  {progress.attempts > 0 ? 'Retake test' : 'Take the test'}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Lesson navigation */}
        <nav className="grid gap-3 sm:grid-cols-2" aria-label="Module navigation">
          {prevModule ? (
            <Link
              to={`/module/${prevModule.id}`}
              className="card card-interactive group flex items-center gap-3 p-4 focus-ring"
            >
              <ChevronLeft
                size={18}
                className="shrink-0 text-ink-400 transition-transform duration-300 group-hover:-translate-x-1"
              />
              <div className="min-w-0">
                <p className="label-xs">Previous</p>
                <p className="truncate text-[14px] font-bold text-ink-900 dark:text-ink-50">
                  {prevModule.id}. {prevModule.title}
                </p>
              </div>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextModule ? (
            nextUnlocked ? (
              <Link
                to={`/module/${nextModule.id}`}
                className="card card-interactive group flex items-center justify-end gap-3 p-4 text-right focus-ring"
              >
                <div className="min-w-0">
                  <p className="label-xs">Next</p>
                  <p className="truncate text-[14px] font-bold text-ink-900 dark:text-ink-50">
                    {nextModule.id}. {nextModule.title}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-ink-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <div className="flex items-center justify-end gap-3 rounded-2xl border border-dashed border-ink-300 p-4 text-right dark:border-ink-700">
                <div className="min-w-0">
                  <p className="label-xs">Next · locked</p>
                  <p className="truncate text-[14px] font-bold text-ink-400 dark:text-ink-500">
                    {nextModule.id}. {nextModule.title}
                  </p>
                </div>
                <Lock size={16} className="shrink-0 text-ink-400" />
              </div>
            )
          ) : null}
        </nav>
      </div>
    </div>
  )
}
