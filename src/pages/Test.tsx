import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  PartyPopper,
  RefreshCw,
  Unlock,
  X,
} from 'lucide-react'
import { useProgress, type TestResultSummary } from '@/hooks/useProgress'
import { useStudyTimer } from '@/hooks/useStudyTimer'
import { getTestQuestions } from '@/data/questions'
import { getModuleStatus, moduleById, PASS_THRESHOLD } from '@/utils/progression'
import { isCorrect, scoreAnswers } from '@/utils/answers'
import { badgeById } from '@/utils/badges'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { QuestionCard } from '@/components/lesson/QuestionCard'
import { cn } from '@/utils/cn'

export function TestPage() {
  const { id } = useParams()
  const moduleId = Number(id)
  const module = moduleById(moduleId)

  const { state, recordTest } = useProgress()
  useStudyTimer(true)

  const questions = useMemo(() => getTestQuestions(moduleId), [moduleId])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [index, setIndexRaw] = useState(0)
  /** Which way the last navigation went, so the next card slides in from that side. */
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [result, setResult] = useState<TestResultSummary | null>(null)

  useEffect(() => {
    setAnswers({})
    setIndexRaw(0)
    setResult(null)
  }, [moduleId])

  function goTo(target: number) {
    setDirection(target >= index ? 'forward' : 'back')
    setIndexRaw(target)
  }

  if (!module) return <Navigate to="/course" replace />
  if (getModuleStatus(state, moduleId) === 'locked') {
    return <Navigate to={`/module/${moduleId}`} replace />
  }
  if (!questions.length) return <Navigate to={`/module/${moduleId}`} replace />

  const answeredCount = questions.filter((q) => (answers[q.id] ?? '').length > 0).length
  const current = questions[index]
  const isLast = index === questions.length - 1

  function submit() {
    const score = scoreAnswers(questions, answers)
    setResult(recordTest(moduleId, score, questions.length))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function retake() {
    setAnswers({})
    setDirection('forward')
    setIndexRaw(0)
    setResult(null)
    window.scrollTo({ top: 0 })
  }

  /* ----------------------------- Results view ---------------------------- */
  if (result) {
    const wrong = questions.filter((q) => !isCorrect(q, answers[q.id] ?? ''))
    const nextModule = moduleById(moduleId + 1)

    return (
      <div className="space-y-6">
        <Card className="animate-scale-in overflow-hidden">
          <div
            className={cn(
              'relative overflow-hidden px-5 py-7 sm:px-7',
              result.passed
                ? 'bg-gradient-to-br from-emerald-50 via-white to-brand-50/50 dark:from-emerald-950/60 dark:via-ink-900 dark:to-brand-950/30'
                : 'bg-gradient-to-br from-amber-50 via-white to-orange-50/40 dark:from-amber-950/50 dark:via-ink-900 dark:to-ink-900',
            )}
          >
            <div
              className={cn(
                'pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl',
                result.passed ? 'bg-emerald-400/20' : 'bg-amber-400/20',
              )}
            />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="animate-pop-in">
                <ProgressRing
                  value={result.percentage}
                  label={`${result.score}/${result.total}`}
                  sublabel={`${result.percentage}%`}
                  size={116}
                  stroke={9}
                />
              </div>
              <div className="min-w-0">
                <Badge tone={result.passed ? 'success' : 'warning'} className="mb-2">
                  {result.passed ? (
                    <>
                      <CheckCircle2 size={12} /> Module completed
                    </>
                  ) : (
                    <>
                      <X size={12} /> Not passed yet
                    </>
                  )}
                </Badge>
                <h1 className="text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
                  {result.passed
                    ? `Module ${module.id} completed`
                    : `${result.percentage}% - the pass mark is ${PASS_THRESHOLD}%`}
                </h1>
                <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-ink-600 dark:text-ink-300">
                  {result.passed
                    ? nextModule
                      ? `Module ${nextModule.id} - ${nextModule.title} is now unlocked.`
                      : 'That was the final module. You have completed the whole course.'
                    : 'Review the explanations below, go back through the lesson, then retake the test. There is no limit on attempts.'}
                </p>

                {result.passed && result.unlockedModuleId && nextModule ? (
                  <p className="mt-4 inline-flex animate-pop-in items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-emerald-700 shadow-lift ring-1 ring-emerald-200 [animation-delay:400ms] dark:bg-ink-900 dark:text-emerald-300 dark:ring-emerald-900">
                    <Unlock size={14} /> Module {nextModule.id} unlocked
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <CardBody className="flex flex-wrap items-center gap-2 border-t border-ink-200 dark:border-ink-800">
            <Button onClick={retake} variant={result.passed ? 'secondary' : 'primary'}>
              <RefreshCw size={15} /> Retake test
            </Button>
            <Link to={`/module/${module.id}`}>
              <Button variant="secondary">Review module</Button>
            </Link>
            {result.passed && nextModule ? (
              <Link to={`/module/${nextModule.id}`}>
                <Button>
                  Continue to Module {nextModule.id} <ArrowRight size={15} />
                </Button>
              </Link>
            ) : null}
            <span className="ml-auto animate-pop-in rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1 text-[12px] font-bold text-white shadow-glow [animation-delay:600ms]">
              +{result.xpEarned} XP
            </span>
          </CardBody>
        </Card>

        {result.newBadges.length ? (
          <Card className="animate-fade-up [animation-delay:200ms]">
            <CardBody className="flex flex-wrap items-center gap-3">
              <PartyPopper size={20} className="animate-float text-amber-500" />
              <p className="text-[14px] font-medium">New badge unlocked</p>
              <div className="flex flex-wrap gap-2">
                {result.newBadges.map((b) => {
                  const badge = badgeById(b)
                  if (!badge) return null
                  return (
                    <Badge key={b} tone="warning">
                      <Award size={12} /> {badge.name}
                    </Badge>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        ) : null}

        <section>
          <h2 className="mb-4 text-[19px] font-extrabold tracking-tight">
            {wrong.length === 0
              ? 'Every answer was correct'
              : `Review ${wrong.length} incorrect answer${wrong.length === 1 ? '' : 's'}`}
          </h2>
          {wrong.length === 0 ? (
            <p className="text-[14px] text-ink-600 dark:text-ink-400">
              A perfect score. Move on to the next module.
            </p>
          ) : (
            <div className="space-y-3">
              {wrong.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  className="animate-fade-up stagger"
                  style={{ '--i': i } as React.CSSProperties}
                  question={q}
                  index={questions.indexOf(q)}
                  total={questions.length}
                  mode="test"
                  revealed
                  value={answers[q.id] ?? ''}
                  onChange={() => undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  /* ------------------------------ Test view ------------------------------ */
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to={`/module/${module.id}`}
        className="group mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-300"
      >
        <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to lesson
      </Link>

      <div className="mb-6 rounded-3xl border border-ink-200/80 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label-xs">Module {module.id} test</p>
            <h1 className="mt-1 text-[22px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
              {module.title}
            </h1>
          </div>
          <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-bold tabular-nums text-brand-700 dark:bg-brand-950 dark:text-brand-200">
            Pass {PASS_THRESHOLD}%
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={(answeredCount / questions.length) * 100} className="flex-1" />
          <span className="shrink-0 text-[12px] font-semibold tabular-nums text-ink-500 dark:text-ink-400">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
      </div>

      <QuestionCard
        key={current.id}
        className={direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
        question={current}
        index={index}
        total={questions.length}
        mode="test"
        value={answers[current.id] ?? ''}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [current.id]: v }))}
      />

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => goTo(Math.max(0, index - 1))}
        >
          <ArrowLeft size={15} /> Previous
        </Button>

        {isLast ? (
          <Button onClick={submit} disabled={answeredCount < questions.length}>
            Submit test
          </Button>
        ) : (
          <Button onClick={() => goTo(Math.min(questions.length - 1, index + 1))}>
            Next <ArrowRight size={15} />
          </Button>
        )}
      </div>

      {isLast && answeredCount < questions.length ? (
        <p className="mt-3 text-center text-[12px] text-ink-500 dark:text-ink-400">
          Answer all {questions.length} questions before submitting.
        </p>
      ) : null}

      {/* Question jump strip */}
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to question ${i + 1}`}
            className={cn(
              'h-9 w-9 rounded-xl text-[12.5px] font-bold tabular-nums transition-all duration-200 ease-spring focus-ring',
              i === index
                ? 'scale-110 bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow'
                : answers[q.id]
                  ? 'bg-brand-100 text-brand-700 hover:scale-105 dark:bg-brand-950 dark:text-brand-300'
                  : 'bg-white text-ink-500 ring-1 ring-inset ring-ink-200 hover:scale-105 hover:bg-ink-50 dark:bg-ink-900 dark:text-ink-400 dark:ring-ink-700 dark:hover:bg-ink-800',
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
