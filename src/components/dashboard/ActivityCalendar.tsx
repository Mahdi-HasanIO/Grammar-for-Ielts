import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { MONTH_NAMES, WEEKDAY_LABELS, toDateKey } from '@/utils/date'
import { monthGrid } from '@/utils/streak'
import { ACTIVE_DAY_MINUTES } from '@/utils/progression'
import { cn } from '@/utils/cn'

/** Four intensity steps based on minutes studied that day. */
function intensityClass(minutes: number): string {
  if (minutes === 0) return 'bg-ink-100 dark:bg-ink-800/70'
  if (minutes < ACTIVE_DAY_MINUTES) return 'bg-brand-100 dark:bg-brand-950'
  if (minutes < 25) return 'bg-brand-300 dark:bg-brand-800'
  if (minutes < 45) return 'bg-brand-500 dark:bg-brand-600'
  return 'bg-brand-700 dark:bg-brand-400'
}

export function ActivityCalendar() {
  const { state } = useProgress()
  const today = new Date()
  const [offset, setOffset] = useState(0)

  const view = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  }, [offset, today])

  const cells = useMemo(() => monthGrid(view.year, view.month), [view])
  const todayKey = toDateKey()

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-800 dark:text-ink-100">
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setOffset((o) => o - 1)}
            className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:hover:bg-ink-800 dark:hover:text-ink-100"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={offset >= 0}
            onClick={() => setOffset((o) => Math.min(0, o + 1))}
            className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-ink-800 dark:hover:text-ink-100"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="pb-1 text-center text-[10px] font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500"
          >
            {d.charAt(0)}
          </div>
        ))}
        {cells.map((key, i) => {
          if (!key) return <div key={`empty-${i}`} />
          const day = state.activity[key]
          const minutes = day?.minutes ?? 0
          return (
            <div
              key={key}
              title={`${key}: ${minutes} min studied`}
              className={cn(
                'aspect-square rounded-md transition-colors',
                intensityClass(minutes),
                key === todayKey && 'ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-ink-900',
              )}
            />
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-500 dark:text-ink-400">
        <span>Less</span>
        {[0, 5, 20, 35, 60].map((m) => (
          <span key={m} className={cn('h-3 w-3 rounded-sm', intensityClass(m))} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
