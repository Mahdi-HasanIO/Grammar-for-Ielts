import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Lock, PlayCircle, RotateCcw } from 'lucide-react'
import type { ModuleMeta } from '@/types'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import type { ModuleStatus } from '@/utils/progression'

export function ModuleCard({
  module,
  status,
  bestScore,
}: {
  module: ModuleMeta
  status: ModuleStatus
  bestScore?: number
}) {
  const locked = status === 'locked'
  const completed = status === 'completed'

  const content = (
    <div
      className={cn(
        'group flex items-start gap-4 rounded-2xl border p-4 transition-all sm:p-5',
        locked
          ? 'border-ink-200 bg-ink-50 opacity-70 dark:border-ink-800 dark:bg-ink-900/40'
          : 'border-ink-200 bg-white shadow-card hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lift dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-semibold',
          completed && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
          status === 'unlocked' && 'bg-brand-600 text-white',
          locked && 'bg-ink-200 text-ink-500 dark:bg-ink-800 dark:text-ink-500',
        )}
      >
        {completed ? <CheckCircle2 size={18} /> : locked ? <Lock size={15} /> : module.id}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            className={cn(
              'text-[15px] font-semibold tracking-tight',
              locked ? 'text-ink-500 dark:text-ink-400' : 'text-ink-900 dark:text-ink-50',
            )}
          >
            <span className="text-ink-400 dark:text-ink-500">{module.id}.</span> {module.title}
          </h3>
          {completed && bestScore !== undefined ? (
            <Badge tone="success">Best {bestScore}%</Badge>
          ) : null}
        </div>

        <p className="mt-1 text-[13px] leading-5 text-ink-600 dark:text-ink-400">{module.summary}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-ink-500 dark:text-ink-400">
          <Badge tone="muted">{module.difficulty}</Badge>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {module.estimatedMinutes} min
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1">
              <Lock size={11} />
              Complete module {module.id - 1} to unlock
            </span>
          ) : null}
        </div>
      </div>

      {!locked ? (
        <span className="mt-0.5 hidden shrink-0 items-center gap-1 text-[12px] font-medium text-brand-600 group-hover:underline sm:flex dark:text-brand-400">
          {completed ? (
            <>
              <RotateCcw size={13} /> Review
            </>
          ) : (
            <>
              <PlayCircle size={13} /> Start
            </>
          )}
        </span>
      ) : null}
    </div>
  )

  if (locked) {
    return (
      <div aria-disabled className="cursor-not-allowed">
        {content}
      </div>
    )
  }

  return (
    <Link to={`/module/${module.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-2xl dark:focus-visible:ring-offset-ink-950">
      {content}
    </Link>
  )
}
