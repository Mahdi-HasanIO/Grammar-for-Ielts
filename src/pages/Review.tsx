import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BookMarked, RotateCcw } from 'lucide-react'
import { MODULES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { getModuleProgress, isModuleCompleted, stageById } from '@/utils/progression'
import { weakAreas } from '@/utils/stats'
import { formatRelative } from '@/utils/date'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'

export function Review() {
  const { state } = useProgress()
  const completed = MODULES.filter((m) => isModuleCompleted(state, m.id))
  const weak = weakAreas(state)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review"
        title="Revisit and repair"
        description="Completed modules stay open for review, and any topic where your average test score sits below the pass mark is flagged here."
      />

      {/* Weak areas */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <AlertTriangle size={15} />
          </span>
          Needs review
        </h2>

        {weak.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle size={22} />}
            title="No weak areas yet"
            description="Once you have taken a few tests, any module where you repeatedly score below 80% will appear here."
          />
        ) : (
          <div className="grid gap-3">
            {weak.map((area) => (
              <Card key={area.moduleId}>
                <CardBody className="flex flex-wrap items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold tracking-tight">
                        <span className="text-ink-400 dark:text-ink-500">{area.moduleId}.</span>{' '}
                        {area.title}
                      </h3>
                      <Badge tone={area.average < 70 ? 'danger' : 'warning'}>
                        Average {area.average}%
                      </Badge>
                      {!area.completed ? <Badge tone="muted">Not passed</Badge> : null}
                    </div>
                    <ProgressBar
                      value={area.average}
                      tone="amber"
                      size="sm"
                      className="mt-2.5 max-w-sm"
                    />
                    <p className="mt-2 text-[12px] text-ink-500 dark:text-ink-400">
                      {area.attempts} attempt{area.attempts === 1 ? '' : 's'} - best {area.bestScore}%
                    </p>
                  </div>
                  <Link to={`/module/${area.moduleId}`}>
                    <Button variant="secondary" size="sm">
                      Review now <ArrowRight size={14} />
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Completed modules */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <BookMarked size={15} />
          </span>
          Completed modules
          <Badge tone="muted">{completed.length}</Badge>
        </h2>

        {completed.length === 0 ? (
          <EmptyState
            icon={<BookMarked size={22} />}
            title="Nothing completed yet"
            description="Pass a module test and it will appear here for review at any time."
            action={
              <Link to="/module/1">
                <Button size="sm">Start Module 1</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {completed.map((module) => {
              const progress = getModuleProgress(state, module.id)
              const stage = stageById(module.stage)
              return (
                <Card key={module.id}>
                  <CardHeader
                    title={`${module.id}. ${module.title}`}
                    subtitle={`Stage ${stage.id} - ${stage.name}`}
                    action={<Badge tone="success">{progress.bestScore}%</Badge>}
                  />
                  <CardBody className="pt-3">
                    <p className="text-[13px] leading-5 text-ink-600 dark:text-ink-400">
                      {module.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[12px] text-ink-500 dark:text-ink-400">
                        {progress.completedAt
                          ? `Passed ${formatRelative(progress.completedAt)}`
                          : 'Passed'}
                      </span>
                      <Link to={`/module/${module.id}`}>
                        <Button variant="ghost" size="sm">
                          <RotateCcw size={13} /> Review
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
