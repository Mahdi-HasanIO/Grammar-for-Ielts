import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Lock, RotateCcw } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { ModuleMeta } from '@/types'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import type { ModuleStatus } from '@/utils/progression'
import { modulePath } from '@/content/paths'

export function ModuleCard({
  module,
  status,
  bestScore,
  style,
}: {
  module: ModuleMeta
  status: ModuleStatus
  bestScore?: number
  style?: CSSProperties
}) {
  const locked = status === 'locked'
  const completed = status === 'completed'
  const current = status === 'unlocked'

  const content = (
    <div
      className={cn(
        'group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 ease-spring sm:p-5',
        locked
          ? 'border-ink-200/70 bg-ink-100/40 dark:border-ink-800/70 dark:bg-ink-900/40'
          : 'border-ink-200/80 bg-white shadow-card hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800/70',
        current && 'border-brand-200 ring-1 ring-brand-100 dark:border-brand-800/70 dark:ring-brand-900/50',
      )}
    >
      {current ? (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />
      ) : null}

      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-[14px] font-bold transition-transform duration-300 ease-bounce',
          !locked && 'group-hover:scale-110',
          completed && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
          current && 'bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow',
          locked && 'bg-ink-200/70 text-ink-400 dark:bg-ink-800 dark:text-ink-500',
        )}
      >
        {completed ? <CheckCircle2 size={19} /> : locked ? <Lock size={15} /> : module.id}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            className={cn(
              'text-[15px] font-bold tracking-tight',
              locked ? 'text-ink-500 dark:text-ink-500' : 'text-ink-900 dark:text-ink-50',
            )}
          >
            <span className="text-ink-400 dark:text-ink-500">{module.id}.</span> {module.title}
          </h3>
          {completed && bestScore !== undefined ? (
            <Badge tone="success">Best {bestScore}%</Badge>
          ) : null}
          {current ? <Badge tone="brand">Up next</Badge> : null}
        </div>

        <p
          className={cn(
            'bn-text mt-1 text-[13.5px]',
            locked ? 'text-ink-400 dark:text-ink-500' : 'text-ink-600 dark:text-ink-400',
          )}
        >
          {module.summary}
        </p>

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
        <span
          className={cn(
            'mt-1 hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-300 ease-spring sm:inline-flex',
            completed
              ? 'text-ink-600 group-hover:bg-ink-100 dark:text-ink-300 dark:group-hover:bg-ink-800'
              : 'bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-200',
          )}
        >
          {completed ? (
            <>
              <RotateCcw size={13} /> Review
            </>
          ) : (
            <>
              Start
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </span>
      ) : null}
    </div>
  )

  if (locked) {
    return (
      <div aria-disabled className="animate-fade-up stagger cursor-not-allowed" style={style}>
        {content}
      </div>
    )
  }

  return (
    <Link
      to={modulePath(module.id)}
      style={style}
      className="block animate-fade-up stagger rounded-2xl focus-ring"
    >
      {content}
    </Link>
  )
}
