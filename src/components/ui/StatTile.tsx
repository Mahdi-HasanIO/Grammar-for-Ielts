import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function StatTile({
  label,
  value,
  hint,
  icon,
  className,
  style,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cn('card card-pad card-interactive group', className)} style={style}>
      <div className="flex items-center justify-between gap-2">
        <span className="label-xs">{label}</span>
        {icon ? (
          <span className="icon-chip h-8 w-8 transition-colors duration-300 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-[26px] font-bold leading-none tabular-nums tracking-tight text-ink-900 dark:text-ink-50">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[12px] text-ink-500 dark:text-ink-400">{hint}</p> : null}
    </div>
  )
}
