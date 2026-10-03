import { CheckCircle2, Loader, Lock } from 'lucide-react'
import { STAGES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { stageProgress } from '@/utils/progression'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/utils/cn'

export function StageTrack() {
  const { state } = useProgress()

  return (
    <ol className="space-y-4">
      {STAGES.map((stage, i) => {
        const { done, total, percentage, status } = stageProgress(state, stage.id)
        return (
          <li
            key={stage.id}
            className="flex animate-slide-in stagger items-center gap-3"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                status === 'completed' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                status === 'in-progress' && 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
                status === 'locked' && 'bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500',
              )}
            >
              {status === 'completed' ? (
                <CheckCircle2 size={15} />
              ) : status === 'in-progress' ? (
                <Loader size={15} className="animate-spin-slow" />
              ) : (
                <Lock size={13} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={cn(
                    'truncate text-[13.5px] font-semibold',
                    status === 'locked'
                      ? 'text-ink-500 dark:text-ink-400'
                      : 'text-ink-900 dark:text-ink-100',
                  )}
                >
                  Stage {stage.id} - {stage.name}
                </p>
                <span className="shrink-0 text-[12px] tabular-nums text-ink-500 dark:text-ink-400">
                  {done}/{total}
                </span>
              </div>
              <ProgressBar
                value={percentage}
                size="sm"
                className="mt-1.5"
                tone={status === 'completed' ? 'success' : 'brand'}
              />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
