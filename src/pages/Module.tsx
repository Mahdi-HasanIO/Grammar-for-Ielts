import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ListChecks,
  Lock,
  PenLine,
} from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useStudyTimer } from '@/hooks/useStudyTimer'
import { getLesson } from '@/data/lessons'
import { getPracticeQuestions } from '@/data/questions'
import {
  getModuleProgress,
  getModuleStatus,
  moduleById,
  stageById,
} from '@/utils/progression'
import { isCorrect } from '@/utils/answers'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import {
  ExamplesSection,
  MistakesSection,
  RuleCard,
  TakeawaysSection,
} from '@/components/lesson/LessonSections'
import { IeltsRelevance } from '@/components/lesson/IeltsRelevance'
import { QuestionCard } from '@/components/lesson/QuestionCard'

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {icon}
        </span>
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 text-[13px] leading-6 text-ink-600 dark:text-ink-400">{description}</p>
      ) : null}
    </div>
  )
}

export function ModulePage() {
  const { id } = useParams()
  const moduleId = Number(id)
  const module = moduleById(moduleId)

  const { state, markLessonViewed, markPracticeCompleted, recordAnswers } = useProgress()
  useStudyTimer(true)

  const practice = useMemo(() => getPracticeQuestions(moduleId), [moduleId])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [practiceSubmitted, setPracticeSubmitted] = useState(false)

  useEffect(() => {
    setAnswers({})
    setPracticeSubmitted(false)
  }, [moduleId])

  useEffect(() => {
    if (module) markLessonViewed(moduleId)
  }, [module, moduleId, markLessonViewed])

  if (!module) return <Navigate to="/course" replace />

  const status = getModuleStatus(state, moduleId)
  if (status === 'locked') {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-500 dark:bg-ink-800">
          <Lock size={20} />
        </span>
        <h1 className="text-lg font-semibold tracking-tight">Module {module.id} is locked</h1>
        <p className="mt-2 text-[14px] leading-6 text-ink-600 dark:text-ink-400">
          Pass the test for Module {module.id - 1} to unlock {module.title}. The course is
          sequential so that each structure rests on the one before it.
        </p>
        <Link to={`/module/${module.id - 1}`} className="mt-5 inline-block">
          <Button>Go to Module {module.id - 1}</Button>
        </Link>
      </div>
    )
  }

  const lesson = getLesson(moduleId)
  const stage = stageById(module.stage)
  const progress = getModuleProgress(state, moduleId)
  const answeredAll = practice.every((q) => (answers[q.id] ?? '').length > 0)

  function submitPractice() {
    const correct = practice.reduce(
      (n, q) => n + (isCorrect(q, answers[q.id] ?? '') ? 1 : 0),
      0,
    )
    recordAnswers(correct, practice.length)
    markPracticeCompleted(moduleId)
    setPracticeSubmitted(true)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Link
          to="/course"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
        >
          <ArrowLeft size={14} /> All modules
        </Link>

        <PageHeader
          eyebrow={`Module ${module.id}`}
          title={module.title}
          description={module.summary}
          action={
            progress.completed ? (
              <Badge tone="success">
                <CheckCircle2 size={12} /> Completed - best {progress.bestScore}%
              </Badge>
            ) : null
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">
            Stage {stage.id} - {stage.name}
          </Badge>
          <Badge tone="muted">{module.difficulty}</Badge>
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
          {module.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-ink-100 px-2 py-1 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <IeltsRelevance module={module} />

      {lesson ? (
        <>
          {/* Section 1 - the rule */}
          <section>
            <SectionTitle
              icon={<BookOpen size={15} />}
              title="The rule"
              description={lesson.intro}
            />
            <div className="space-y-4">
              {lesson.rules.map((rule, i) => (
                <RuleCard key={rule.id} rule={rule} index={i} />
              ))}
            </div>
          </section>

          {/* Section 2 - examples */}
          <section>
            <SectionTitle
              icon={<PenLine size={15} />}
              title="Examples"
              description="Each pair shows the error, the correction and the reason behind it."
            />
            <ExamplesSection examples={lesson.examples} />
          </section>

          {/* Section 3 - common mistakes */}
          <section>
            <SectionTitle
              icon={<ListChecks size={15} />}
              title="Common mistakes"
              description="The errors that cost the most marks in this area."
            />
            <MistakesSection mistakes={lesson.mistakes} />
          </section>

          <TakeawaysSection lesson={lesson} />
        </>
      ) : null}

      {/* Section 4 - quick practice */}
      {practice.length ? (
        <section>
          <SectionTitle
            icon={<ListChecks size={15} />}
            title="Quick practice"
            description="Low-stakes questions with instant feedback. These do not affect your module score."
          />
          <div className="space-y-3">
            {practice.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={practice.length}
                mode="practice"
                value={answers[q.id] ?? ''}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
              />
            ))}
          </div>

          {!practiceSubmitted ? (
            <Button
              variant="secondary"
              className="mt-4"
              disabled={!answeredAll}
              onClick={submitPractice}
            >
              Finish practice
            </Button>
          ) : (
            <p className="mt-4 text-[13px] text-ink-600 dark:text-ink-400">
              Practice logged. When the rules feel familiar, take the module test.
            </p>
          )}
        </section>
      ) : null}

      {/* Test call to action */}
      <Card>
        <CardHeader
          title="Module test"
          subtitle="10 questions - pass mark 80%"
          icon={<ListChecks size={16} />}
        />
        <CardBody className="pt-1">
          <p className="text-[14px] leading-6 text-ink-600 dark:text-ink-400">
            {progress.completed
              ? 'You have already passed this module. Retaking the test updates your latest score and can improve your best score.'
              : `Score 8 out of 10 or higher to complete this module and unlock Module ${module.id + 1}.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={`/module/${module.id}/test`}>
              <Button>
                {progress.attempts > 0 ? 'Retake test' : 'Take the test'} <ArrowRight size={15} />
              </Button>
            </Link>
            {progress.completed && moduleById(module.id + 1) ? (
              <Link to={`/module/${module.id + 1}`}>
                <Button variant="secondary">Next module</Button>
              </Link>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
