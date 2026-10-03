import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-white/50 px-6 py-12 text-center dark:border-ink-700 dark:bg-ink-900/30">
      {icon ? (
        <div className="icon-chip mb-4 h-12 w-12 animate-float text-ink-400 dark:text-ink-500">
          {icon}
        </div>
      ) : null}
      <h3 className="text-sm font-bold text-ink-800 dark:text-ink-100">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-ink-500 dark:text-ink-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
