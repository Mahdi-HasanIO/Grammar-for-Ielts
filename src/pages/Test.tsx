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
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<TestResultSummary | null>(null)

  useEffect(() => {
    setAnswers({})
    setIndex(0)
    setResult(null)
  }, [moduleId])

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
    setIndex(0)
    setResult(null)
    window.scrollTo({ top: 0 })
  }

  /* ----------------------------- Results view ---------------------------- */
  if (result) {
    const wrong = questions.filter((q) => !isCorrect(q, answers[q.id] ?? ''))
    const nextModule = moduleById(moduleId + 1)

    return (
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div
            className={cn(
              'px-5 py-6 sm:px-6',
              result.passed
                ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/60 dark:to-ink-900'
                : 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/60 dark:to-ink-900',
            )}
          >
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="animate-pop-in">
                <ProgressRing
                  value={result.percentage}
                  label={`${result.score}/${result.total}`}
                  sublabel={`${result.percentage}%`}
                  size={104}
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
                <h1 className="text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
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
                  <p className="mt-3 inline-flex animate-fade-up items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[13px] font-medium text-emerald-700 shadow-card dark:bg-ink-900 dark:text-emerald-300">
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
            <span className="ml-auto text-[12px] text-ink-500 dark:text-ink-400">
              +{result.xpEarned} XP
            </span>
          </CardBody>
        </Card>

        {result.newBadges.length ? (
          <Card>
            <CardBody className="flex flex-wrap items-center gap-3">
              <PartyPopper size={18} className="text-amber-500" />
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
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">
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
              {wrong.map((q) => (
                <QuestionCard
                  key={q.id}
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
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft size={14} /> Back to lesson
      </Link>

      <div className="mb-5">
        <p className="label-xs">Module {module.id} test</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          {module.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={(answeredCount / questions.length) * 100} className="flex-1" />
          <span className="shrink-0 text-[12px] tabular-nums text-ink-500 dark:text-ink-400">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
      </div>

      <QuestionCard
        key={current.id}
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
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ArrowLeft size={15} /> Previous
        </Button>

        {isLast ? (
          <Button onClick={submit} disabled={answeredCount < questions.length}>
            Submit test
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}>
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
      <div className="mt-6 flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to question ${i + 1}`}
            className={cn(
              'h-8 w-8 rounded-lg text-[12px] font-medium tabular-nums transition-colors',
              i === index
                ? 'bg-brand-600 text-white'
                : answers[q.id]
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700',
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
