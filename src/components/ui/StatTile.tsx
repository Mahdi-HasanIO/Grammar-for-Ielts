import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function StatTile({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('card card-pad', className)}>
      <div className="flex items-center justify-between">
        <span className="label-xs">{label}</span>
        {icon ? <span className="text-ink-400 dark:text-ink-500">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-ink-900 dark:text-ink-50">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[12px] text-ink-500 dark:text-ink-400">{hint}</p> : null}
    </div>
  )
}
